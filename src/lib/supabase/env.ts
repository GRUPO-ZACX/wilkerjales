export function getSupabasePublicEnv() {
  return {
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  }
}

export function hasSupabaseEnv() {
  const { anonKey, url } = getSupabasePublicEnv()
  return Boolean(anonKey && url)
}

export function requireSupabasePublicEnv() {
  const env = getSupabasePublicEnv()

  if (!env.url || !env.anonKey) {
    throw new Error(
      "Supabase não configurado. Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY."
    )
  }

  return {
    anonKey: env.anonKey,
    url: env.url,
  }
}
