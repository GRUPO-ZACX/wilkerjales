import { createBrowserClient } from "@supabase/ssr"

import type { Database } from "./database.types"
import { requireSupabasePublicEnv } from "./env"

export function createClient() {
  const { anonKey, url } = requireSupabasePublicEnv()

  return createBrowserClient<Database>(url, anonKey)
}
