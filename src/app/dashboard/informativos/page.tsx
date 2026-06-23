import Link from "next/link"
import type { Metadata } from "next"
import { FileText, Plus } from "lucide-react"

import { Button } from "yes@/components/ui/button"
import { NewsletterDashboardList } from "yes@/components/newsletter/editor/newsletter-dashboard-list"
import type { NewsletterRow } from "yes@/lib/supabase/database.types"
import { hasSupabaseEnv } from "yes@/lib/supabase/env"
import { createClient } from "yes@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Informativos | Dashboard",
  description: "Lista de informativos jurídicos do escritório.",
}

export default async function InformativosPage() {
  let newsletters: NewsletterRow[] = []
  const isConfigured = hasSupabaseEnv()

  if (isConfigured) {
    const supabase = await createClient()
    const { data } = await supabase
      .from("newsletters")
      .select("*")
      .order("updated_at", { ascending: false })

    newsletters = (data as NewsletterRow[] | null) ?? []
  }

  return (
    <main className="px-5 py-8">
      <section className="mx-auto w-full max-w-[1280px]">
        <div className="flex flex-col gap-4 border-b border-black/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-black/45">
              Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-black">
              Informativos
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-black/55">
              Gerencie rascunhos e publicações do escritório sem alterar o
              sistema visual do informativo.
            </p>
          </div>

          <Button
            asChild
            className="w-fit bg-black text-white hover:bg-black/80"
          >
            <Link href="/dashboard/informativos/novo">
              <Plus />
              Novo informativo
            </Link>
          </Button>
        </div>

        {newsletters.length === 0 ? (
            <div className="rounded-xl border border-black/10 bg-white p-8 text-center shadow-[0_12px_34px_rgba(0,0,0,0.04)]">
              <FileText className="mx-auto size-10 text-black/55" />
              <h2 className="mt-4 text-xl font-semibold text-black">
                Nenhum informativo salvo ainda
              </h2>
              <p className="mt-2 text-sm leading-6 text-black/55">
                Crie o primeiro rascunho para começar a persistir o conteúdo no
                Supabase.
              </p>
            </div>
        ) : (
          <NewsletterDashboardList newsletters={newsletters} />
        )}
      </section>
    </main>
  )
}
