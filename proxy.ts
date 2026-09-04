import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

import type { Database } from "yes@/lib/supabase/database.types"
import { ADMIN_LOGIN_PATH } from "yes@/lib/auth/routes"
import { getSupabasePublicEnv } from "yes@/lib/supabase/env"

export async function proxy(request: NextRequest) {
  const env = getSupabasePublicEnv()

  if (!env.url || !env.anonKey) {
    return NextResponse.next()
  }

  let response = NextResponse.next({
    request,
  })

  const supabase = createServerClient<Database>(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value)
        })

        response = NextResponse.next({
          request,
        })

        cookiesToSet.forEach(({ name, options, value }) => {
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url)
    loginUrl.searchParams.set("redirectTo", request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
