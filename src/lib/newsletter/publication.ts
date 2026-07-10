import { cache } from "react"

import { normalizeNewsletterTemplate } from "yes@/lib/newsletter/normalize"
import { applyNewsletterProfile } from "yes@/lib/newsletter/profile"
import { getNewsletterProfileForUserId } from "yes@/lib/newsletter/profile-server"
import type { NewsletterTemplate } from "yes@/lib/newsletter/types"
import type { NewsletterRow } from "yes@/lib/supabase/database.types"
import { hasSupabaseEnv } from "yes@/lib/supabase/env"
import { createClient } from "yes@/lib/supabase/server"

export type PublishedNewsletterRow = Pick<
  NewsletterRow,
  | "content"
  | "id"
  | "published_at"
  | "slug"
  | "title"
  | "updated_at"
  | "user_id"
>

export type PublishedNewsletter = PublishedNewsletterRow & {
  newsletter: NewsletterTemplate
}

async function toPublishedNewsletter(
  row: PublishedNewsletterRow
): Promise<PublishedNewsletter> {
  const settings = await getNewsletterProfileForUserId(row.user_id)
  const newsletter = applyNewsletterProfile(
    normalizeNewsletterTemplate(row.content),
    settings.profile
  )
  newsletter.slug = row.slug

  return {
    ...row,
    newsletter,
  }
}

export const getPublishedNewsletters = cache(async () => {
  if (!hasSupabaseEnv()) {
    return []
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("newsletters")
    .select("id,title,slug,content,published_at,updated_at,user_id")
    .eq("status", "published")
    .order("published_at", { ascending: false })

  if (error || !data) {
    return []
  }

  return Promise.all((data as PublishedNewsletterRow[]).map(toPublishedNewsletter))
})

export const getPublishedNewsletterBySlug = cache(async (slug: string) => {
  if (!hasSupabaseEnv()) {
    return null
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("newsletters")
    .select("id,title,slug,content,published_at,updated_at,user_id")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle()

  if (error || !data) {
    return null
  }

  return toPublishedNewsletter(data as PublishedNewsletterRow)
})

export function getNewsletterExcerpt(newsletter: NewsletterTemplate) {
  const intro = newsletter.intro
    .map((segment) => segment.text)
    .join("")
    .replace(/\s+/g, " ")
    .trim()

  return intro || newsletter.highlight || newsletter.category
}

export function getPublishedNewsletterTitle(publication: PublishedNewsletter) {
  return (
    publication.title.trim() ||
    publication.newsletter.title.trim() ||
    "Informativo jurídico"
  )
}
