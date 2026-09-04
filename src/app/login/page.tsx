import { redirect } from "next/navigation"

import {
  ADMIN_LOGIN_PATH,
  getSafeDashboardRedirect,
} from "yes@/lib/auth/routes"

type LoginPageProps = {
  searchParams: Promise<{
    redirectTo?: string | string[]
  }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams
  const redirectTo =
    typeof params.redirectTo === "string" ? params.redirectTo : undefined
  const safeRedirectTo = getSafeDashboardRedirect(redirectTo)
  const target = new URLSearchParams()

  if (safeRedirectTo) {
    target.set("redirectTo", safeRedirectTo)
  }

  redirect(`${ADMIN_LOGIN_PATH}?${target.toString()}`)
}
