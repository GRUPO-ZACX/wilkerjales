"use server"

import { revalidatePath } from "next/cache"

import {
  normalizeNewsletterProfile,
  type NewsletterProfile,
} from "yes@/lib/newsletter/profile"
import type { Json } from "yes@/lib/supabase/database.types"
import { hasSupabaseEnv } from "yes@/lib/supabase/env"
import { createClient } from "yes@/lib/supabase/server"

export type SaveNewsletterProfileResult = {
  error?: string
  ok: boolean
  profile?: NewsletterProfile
}

function isMissingSettingsTable(error: { code?: string; message?: string } | null) {
  return (
    error?.code === "42P01" ||
    error?.message?.toLowerCase().includes("newsletter_settings") === true
  )
}

function revalidateNewsletterProfilePaths() {
  revalidatePath("/dashboard/configuracoes")
  revalidatePath("/dashboard/informativos")
  revalidatePath("/dashboard/informativos/[id]/editar", "page")
  revalidatePath("/dashboard/informativos/novo")
  revalidatePath("/publicacoes")
  revalidatePath("/informativo/[slug]", "page")
  revalidatePath("/informativo/[slug]/print", "page")
}

export async function saveNewsletterProfileAction(
  profile: NewsletterProfile
): Promise<SaveNewsletterProfileResult> {
  if (!hasSupabaseEnv()) {
    return {
      error: "Supabase não configurado.",
      ok: false,
    }
  }

  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return {
      error: "Faça login para salvar configurações.",
      ok: false,
    }
  }

  const normalizedProfile = normalizeNewsletterProfile(profile)
  const { error } = await supabase.from("newsletter_settings").upsert(
    {
      profile: normalizedProfile as unknown as Json,
      user_id: user.id,
    },
    { onConflict: "user_id" }
  )

  if (isMissingSettingsTable(error)) {
    return {
      error:
        "A tabela newsletter_settings ainda não existe no Supabase. Aplique a migração 002 para salvar configurações globais.",
      ok: false,
    }
  }

  if (error) {
    return {
      error: error.message,
      ok: false,
    }
  }

  revalidateNewsletterProfilePaths()

  return {
    ok: true,
    profile: normalizedProfile,
  }
}
