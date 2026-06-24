import { redirect } from "next/navigation"

import { DashboardShell } from "yes@/components/newsletter/editor/dashboard-shell"
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
      redirect("/login")
    }
  }

  return (
    <DashboardShell showConfigWarning={!isConfigured}>
      {children}
    </DashboardShell>
  )
}
