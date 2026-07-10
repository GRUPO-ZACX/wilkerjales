"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import {
  normalizeNewsletterTemplate,
  prepareNewsletterForPersistence,
} from "yes@/lib/newsletter/normalize"
import { applyNewsletterProfile } from "yes@/lib/newsletter/profile"
import { getNewsletterProfileForUserId } from "yes@/lib/newsletter/profile-server"
import { slugifyTitle } from "yes@/lib/newsletter/slug"
import type { NewsletterTemplate } from "yes@/lib/newsletter/types"
import type {
  Json,
  NewsletterRow,
  NewsletterStatus,
} from "yes@/lib/supabase/database.types"
import { hasSupabaseEnv } from "yes@/lib/supabase/env"
import { createClient } from "yes@/lib/supabase/server"

export type NewsletterActionResult = {
  ok: boolean
  id?: string
  publicHref?: string
  status?: NewsletterStatus
  redirectTo?: string
  error?: string
}

function publicNewsletterHref(slug: string) {
  return `/informativo/${slug}`
}

function revalidatePublicNewsletterPaths(slug?: string) {
  revalidatePath("/publicacoes")
  revalidatePath("/informativos")
  revalidatePath("/informativo/[slug]", "page")
  revalidatePath("/informativo/[slug]/print", "page")

  if (slug) {
    revalidatePath(publicNewsletterHref(slug))
    revalidatePath(`${publicNewsletterHref(slug)}/print`)
  }
}

async function requireAuthenticatedClient() {
  if (!hasSupabaseEnv()) {
    return {
      error:
        "Supabase não configurado. Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      supabase: null,
      userId: null,
    }
  }

  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return {
      error: "Faça login para continuar.",
      supabase: null,
      userId: null,
    }
  }

  return {
    error: null,
    supabase,
    userId: user.id,
  }
}

function newsletterTitle(newsletter: NewsletterTemplate) {
  return newsletter.title.trim() || "Informativo sem título"
}

async function prepareNewsletterForUser(
  newsletter: NewsletterTemplate,
  userId: string
) {
  const settings = await getNewsletterProfileForUserId(userId)

  return applyNewsletterProfile(
    prepareNewsletterForPersistence(newsletter),
    settings.profile
  )
}

function submittedTitle(value: FormDataEntryValue | null) {
  const title = typeof value === "string" ? value.trim() : ""

  return title || "Informativo sem título"
}

async function insertNewsletterWithUniqueSlug(
  newsletter: NewsletterTemplate
): Promise<NewsletterActionResult> {
  const { error, supabase, userId } = await requireAuthenticatedClient()

  if (error || !supabase || !userId) {
    return { error: error ?? "Não autorizado.", ok: false }
  }

  const content = await prepareNewsletterForUser(newsletter, userId)
  const title = newsletterTitle(content)
  const baseSlug = slugifyTitle(title)

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const slug = attempt === 0 ? baseSlug : `${baseSlug}-${attempt + 1}`
    const contentWithSlug = { ...content, slug }
    const { data, error: insertError } = await supabase
      .from("newsletters")
      .insert({
        content: contentWithSlug as unknown as Json,
        slug,
        status: "draft",
        title,
        user_id: userId,
      })
      .select("id")
      .single()

    if (!insertError && data) {
      revalidatePath("/dashboard/informativos")
      return {
        id: data.id,
        ok: true,
        redirectTo: `/dashboard/informativos/${data.id}/editar`,
        status: "draft",
      }
    }

    if (insertError?.code !== "23505") {
      return {
        error: insertError?.message ?? "Não foi possível salvar o rascunho.",
        ok: false,
      }
    }
  }

  return {
    error: "Não foi possível gerar um slug único para este informativo.",
    ok: false,
  }
}

export async function createNewsletterAction(
  newsletter: NewsletterTemplate
): Promise<NewsletterActionResult> {
  return insertNewsletterWithUniqueSlug(newsletter)
}

export async function updateNewsletterAction(
  id: string,
  newsletter: NewsletterTemplate
): Promise<NewsletterActionResult> {
  const { error, supabase, userId } = await requireAuthenticatedClient()

  if (error || !supabase || !userId) {
    return { error: error ?? "Não autorizado.", ok: false }
  }

  const content = await prepareNewsletterForUser(newsletter, userId)
  const title = newsletterTitle(content)
  const { data: rawCurrent } = await supabase
    .from("newsletters")
    .select("slug,status")
    .eq("id", id)
    .single()
  const current = rawCurrent as Pick<NewsletterRow, "slug" | "status"> | null
  const contentWithSlug = current?.slug
    ? { ...content, slug: current.slug }
    : content
  const { error: updateError } = await supabase
    .from("newsletters")
    .update({
      content: contentWithSlug as unknown as Json,
      title,
    })
    .eq("id", id)

  if (updateError) {
    return {
      error: updateError.message,
      ok: false,
    }
  }

  revalidatePath("/dashboard/informativos")
  revalidatePath(`/dashboard/informativos/${id}/editar`)

  if (current?.status === "published") {
    revalidatePublicNewsletterPaths(current.slug)
  }

  return { id, ok: true }
}

export async function publishNewsletterAction(
  id: string,
  newsletter: NewsletterTemplate
): Promise<NewsletterActionResult> {
  const { error, supabase, userId } = await requireAuthenticatedClient()

  if (error || !supabase || !userId) {
    return { error: error ?? "Não autorizado.", ok: false }
  }

  const content = await prepareNewsletterForUser(newsletter, userId)
  const title = newsletterTitle(content)
  const { data: rawCurrent } = await supabase
    .from("newsletters")
    .select("slug")
    .eq("id", id)
    .single()
  const current = rawCurrent as Pick<NewsletterRow, "slug"> | null
  const slug = current?.slug ?? content.slug
  const contentWithSlug = { ...content, slug }
  const { error: updateError } = await supabase
    .from("newsletters")
    .update({
      content: contentWithSlug as unknown as Json,
      published_at: new Date().toISOString(),
      status: "published",
      title,
    })
    .eq("id", id)

  if (updateError) {
    return { error: updateError.message, ok: false }
  }

  revalidatePath("/dashboard/informativos")
  revalidatePath(`/dashboard/informativos/${id}/editar`)
  revalidatePublicNewsletterPaths(slug)

  return {
    id,
    ok: true,
    publicHref: publicNewsletterHref(slug),
    status: "published",
  }
}

export async function unpublishNewsletterAction(
  id: string,
  newsletter: NewsletterTemplate
): Promise<NewsletterActionResult> {
  const { error, supabase, userId } = await requireAuthenticatedClient()

  if (error || !supabase || !userId) {
    return { error: error ?? "Não autorizado.", ok: false }
  }

  const content = await prepareNewsletterForUser(newsletter, userId)
  const title = newsletterTitle(content)
  const { data: rawCurrent } = await supabase
    .from("newsletters")
    .select("slug")
    .eq("id", id)
    .single()
  const current = rawCurrent as Pick<NewsletterRow, "slug"> | null
  const slug = current?.slug ?? content.slug
  const contentWithSlug = { ...content, slug }
  const { error: updateError } = await supabase
    .from("newsletters")
    .update({
      content: contentWithSlug as unknown as Json,
      published_at: null,
      status: "draft",
      title,
    })
    .eq("id", id)

  if (updateError) {
    return { error: updateError.message, ok: false }
  }

  revalidatePath("/dashboard/informativos")
  revalidatePath(`/dashboard/informativos/${id}/editar`)
  revalidatePublicNewsletterPaths(slug)

  return { id, ok: true, status: "draft" }
}

export async function publishNewsletterFromListAction(formData: FormData) {
  const id = String(formData.get("id") ?? "")
  const { error, supabase, userId } = await requireAuthenticatedClient()

  if (!id || error || !supabase || !userId) {
    return
  }

  const { data: rawCurrent } = await supabase
    .from("newsletters")
    .select("content, slug")
    .eq("id", id)
    .single()
  const current = rawCurrent as Pick<NewsletterRow, "content" | "slug"> | null

  if (!current) {
    return
  }

  const content = await prepareNewsletterForUser(
    normalizeNewsletterTemplate(current.content),
    userId
  )

  await supabase
    .from("newsletters")
    .update({
      content: content as unknown as Json,
      published_at: new Date().toISOString(),
      status: "published",
    })
    .eq("id", id)

  revalidatePath("/dashboard/informativos")
  revalidatePublicNewsletterPaths(current?.slug)
}

export async function duplicateNewsletterFromListAction(formData: FormData) {
  const id = String(formData.get("id") ?? "")
  const { error, supabase } = await requireAuthenticatedClient()

  if (!id || error || !supabase) {
    return
  }

  const { data } = await supabase
    .from("newsletters")
    .select("content")
    .eq("id", id)
    .single()

  if (!data) {
    return
  }

  const newsletter = normalizeNewsletterTemplate(data.content)
  const result = await insertNewsletterWithUniqueSlug(newsletter)

  if (result.redirectTo) {
    redirect(result.redirectTo)
  }

  revalidatePath("/dashboard/informativos")
}

export async function renameNewsletterFromListAction(formData: FormData) {
  const id = String(formData.get("id") ?? "")
  const title = submittedTitle(formData.get("title"))
  const { error, supabase, userId } = await requireAuthenticatedClient()

  if (!id || error || !supabase || !userId) {
    return
  }

  const { data: rawData } = await supabase
    .from("newsletters")
    .select("content, slug, status")
    .eq("id", id)
    .single()
  const data = rawData as Pick<
    NewsletterRow,
    "content" | "slug" | "status"
  > | null

  if (!data) {
    return
  }

  const newsletter = normalizeNewsletterTemplate(data.content)
  newsletter.title = title

  const content = await prepareNewsletterForUser(newsletter, userId)

  await supabase
    .from("newsletters")
    .update({
      content: content as unknown as Json,
      title,
    })
    .eq("id", id)

  revalidatePath("/dashboard/informativos")
  revalidatePath(`/dashboard/informativos/${id}/editar`)

  if (data.status === "published") {
    revalidatePublicNewsletterPaths(data.slug)
  }
}

export async function deleteNewsletterFromListAction(formData: FormData) {
  const id = String(formData.get("id") ?? "")
  const { error, supabase } = await requireAuthenticatedClient()

  if (!id || error || !supabase) {
    return
  }

  const { data: rawData } = await supabase
    .from("newsletters")
    .select("slug")
    .eq("id", id)
    .single()
  const data = rawData as Pick<NewsletterRow, "slug"> | null

  await supabase.from("newsletters").delete().eq("id", id)

  revalidatePath("/dashboard/informativos")
  revalidatePublicNewsletterPaths(data?.slug)

  if (data?.slug) {
    revalidatePath(`/informativo/${data.slug}`)
    revalidatePath(`/informativo/${data.slug}/print`)
  }
}

export async function unpublishNewsletterFromListAction(formData: FormData) {
  const id = String(formData.get("id") ?? "")
  const { error, supabase } = await requireAuthenticatedClient()

  if (!id || error || !supabase) {
    return
  }

  const { data: rawCurrent } = await supabase
    .from("newsletters")
    .select("slug")
    .eq("id", id)
    .single()
  const current = rawCurrent as Pick<NewsletterRow, "slug"> | null

  await supabase
    .from("newsletters")
    .update({
      published_at: null,
      status: "draft",
    })
    .eq("id", id)

  revalidatePath("/dashboard/informativos")
  revalidatePublicNewsletterPaths(current?.slug)
}
