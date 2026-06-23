import Link from "next/link"
import { redirect } from "next/navigation"

import { LogoutButton } from "yes@/components/auth/logout-button"
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
    <div className="min-h-screen bg-[#F7F5EE] text-[#1F1F1A]">
      <header className="border-b border-[#B7B783] bg-[#ECE8D8]/95 px-5 py-4">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              className="text-sm font-semibold uppercase tracking-[0.18em] text-[#244F49]"
              href="/dashboard/informativos"
            >
              Informativo Jurídico Digital
            </Link>
            <p className="mt-1 text-xs font-medium text-[#6D714C]">
              Dashboard editorial do escritório
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-2">
            <Link
              className="border border-[#B7B783] bg-[#F7F5EE]/70 px-3 py-1.5 text-sm font-semibold text-[#163B35] hover:bg-[#F7F5EE]"
              href="/dashboard/informativos"
            >
              Informativos
            </Link>
            <Link
              className="border border-[#B7B783] bg-[#F7F5EE]/70 px-3 py-1.5 text-sm font-semibold text-[#163B35] hover:bg-[#F7F5EE]"
              href="/dashboard/informativos/novo"
            >
              Novo
            </Link>
            <Link
              className="border border-[#B7B783] bg-[#F7F5EE]/70 px-3 py-1.5 text-sm font-semibold text-[#163B35] hover:bg-[#F7F5EE]"
              href="/informativo/demo"
            >
              Demo
            </Link>
            <LogoutButton />
          </nav>
        </div>
      </header>

      {!isConfigured && (
        <div className="border-b border-[#B7B783] bg-[#F7F5EE] px-5 py-3 text-sm font-medium text-[#244F49]">
          <div className="mx-auto w-full max-w-[1280px]">
            Supabase ainda não configurado. Defina
            `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
          </div>
        </div>
      )}

      {children}
    </div>
  )
}
