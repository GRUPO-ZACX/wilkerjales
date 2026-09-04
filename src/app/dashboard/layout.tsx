import { redirect } from "next/navigation"

import { DashboardShell } from "yes@/components/newsletter/editor/dashboard-shell"
import { ADMIN_LOGIN_PATH } from "yes@/lib/auth/routes"
import { hasSupabaseEnv } from "yes@/lib/supabase/env"
import { createClient } from "yes@/lib/supabase/server"

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isConfigured = hasSupabaseEnv()

  if (isConfigured) {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect(ADMIN_LOGIN_PATH)
    }
  }

  return (
    <DashboardShell showConfigWarning={!isConfigured}>
      {children}
    </DashboardShell>
  )
}
