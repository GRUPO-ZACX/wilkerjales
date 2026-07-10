import { cache } from "react"

import type { Json } from "yes@/lib/supabase/database.types"
import { hasSupabaseEnv } from "yes@/lib/supabase/env"
import { createClient } from "yes@/lib/supabase/server"

import {
  defaultNewsletterProfile,
  normalizeNewsletterProfile,
  type NewsletterProfile,
} from "./profile"

export type NewsletterProfileLoadResult = {
  error?: string
  isPersisted: boolean
  migrationRequired: boolean
  profile: NewsletterProfile
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function profileFromJson(value: Json | null | undefined) {
  return normalizeNewsletterProfile(isRecord(value) ? value : null)
}

function isMissingSettingsTable(error: { code?: string; message?: string } | null) {
  return (
    error?.code === "42P01" ||
    error?.message?.toLowerCase().includes("newsletter_settings") === true
  )
}

function defaultResult(
  overrides: Partial<Omit<NewsletterProfileLoadResult, "profile">> = {}
): NewsletterProfileLoadResult {
  return {
    isPersisted: false,
    migrationRequired: false,
    profile: defaultNewsletterProfile,
    ...overrides,
  }
}

export const getNewsletterProfileForUserId = cache(async (userId?: string | null) => {
  if (!userId || !hasSupabaseEnv()) {
    return defaultResult()
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("newsletter_settings")
    .select("profile")
    .eq("user_id", userId)
    .maybeSingle()

  if (isMissingSettingsTable(error)) {
    return defaultResult({
      error:
        "A tabela newsletter_settings ainda não foi aplicada no Supabase.",
      migrationRequired: true,
    })
  }

  if (error) {
    return defaultResult({ error: error.message })
  }

  if (!data) {
    return defaultResult()
  }

  return {
    isPersisted: true,
    migrationRequired: false,
    profile: profileFromJson(data.profile),
  }
})

export async function getCurrentUserNewsletterProfile() {
  if (!hasSupabaseEnv()) {
    return defaultResult({
      error:
        "Supabase não configurado. As configurações fixas usam o padrão oficial.",
    })
  }

  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return defaultResult({ error: "Faça login para alterar configurações." })
  }

  return getNewsletterProfileForUserId(user.id)
}
