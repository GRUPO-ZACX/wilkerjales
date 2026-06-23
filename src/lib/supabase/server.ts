import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

import type { Database } from "./database.types"
import { requireSupabasePublicEnv } from "./env"

export async function createClient() {
  const { anonKey, url } = requireSupabasePublicEnv()
  const cookieStore = await cookies()

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, options, value }) => {
            cookieStore.set(name, value, options)
          })
        } catch {
          // Server Components cannot set cookies; proxy handles auth refresh.
        }
      },
    },
  })
}
