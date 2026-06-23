import Link from "next/link"
import type { Metadata } from "next"
import { FileText, Plus } from "lucide-react"

import { Button } from "yes@/components/ui/button"
import { Badge } from "yes@/components/ui/badge"
import {
  publishNewsletterFromListAction,
  unpublishNewsletterFromListAction,
} from "./actions"
import type { NewsletterRow } from "yes@/lib/supabase/database.types"
import { hasSupabaseEnv } from "yes@/lib/supabase/env"
import { createClient } from "yes@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Informativos | Dashboard",
  description: "Lista de informativos jurídicos do escritório.",
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value))
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
        <div className="flex flex-col gap-4 border-b border-[#B7B783] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#244F49]">
              Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-[#1F1F1A]">
              Informativos
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#4F5549]">
              Gerencie rascunhos e publicações do escritório sem alterar o
              sistema visual do informativo.
            </p>
          </div>

          <Button
            asChild
            className="w-fit bg-[#163B35] text-[#F7F5EE] hover:bg-[#244F49]"
          >
            <Link href="/dashboard/informativos/novo">
              <Plus />
              Novo informativo
            </Link>
          </Button>
        </div>

        <div className="mt-6 grid gap-3">
          {newsletters.length === 0 && (
            <div className="border border-[#B7B783] bg-white/80 p-8 text-center">
              <FileText className="mx-auto size-10 text-[#244F49]" />
              <h2 className="mt-4 text-xl font-semibold text-[#163B35]">
                Nenhum informativo salvo ainda
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#4F5549]">
                Crie o primeiro rascunho para começar a persistir o conteúdo no
                Supabase.
              </p>
            </div>
          )}

          {newsletters.map((newsletter) => (
            <article
              className="grid gap-4 border border-[#B7B783] bg-white/85 p-4 shadow-[0_10px_30px_rgba(22,59,53,0.05)] lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"
              key={newsletter.id}
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#1F1F1A] [overflow-wrap:anywhere]">
                    {newsletter.title}
                  </h2>
                  <Badge
                    className={
                      newsletter.status === "published"
                        ? "border-[#244F49] bg-[#244F49] text-[#F7F5EE]"
                        : "border-[#B7B783] bg-[#F7F5EE] text-[#244F49]"
                    }
                    variant="outline"
                  >
                    {newsletter.status === "published"
                      ? "Publicado"
                      : "Rascunho"}
                  </Badge>
                </div>
                <p className="mt-2 text-xs font-medium text-[#6D714C]">
                  Atualizado em {formatDate(newsletter.updated_at)}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 lg:justify-end">
                <Button
                  asChild
                  className="border-[#B7B783] bg-[#F7F5EE] text-[#163B35] hover:bg-[#ECE8D8]"
                  size="sm"
                  variant="outline"
                >
                  <Link href={`/dashboard/informativos/${newsletter.id}/editar`}>
                    Editar
                  </Link>
                </Button>

                {newsletter.status === "published" && (
                  <Button
                    asChild
                    className="border-[#B7B783] bg-[#F7F5EE] text-[#163B35] hover:bg-[#ECE8D8]"
                    size="sm"
                    variant="outline"
                  >
                    <Link href={`/informativo/${newsletter.slug}`}>
                      Ver público
                    </Link>
                  </Button>
                )}

                {newsletter.status === "published" ? (
                  <form action={unpublishNewsletterFromListAction}>
                    <input name="id" type="hidden" value={newsletter.id} />
                    <Button
                      className="border-[#B7B783] bg-[#F7F5EE] text-[#163B35] hover:bg-[#ECE8D8]"
                      size="sm"
                      type="submit"
                      variant="outline"
                    >
                      Despublicar
                    </Button>
                  </form>
                ) : (
                  <form action={publishNewsletterFromListAction}>
                    <input name="id" type="hidden" value={newsletter.id} />
                    <Button
                      className="bg-[#163B35] text-[#F7F5EE] hover:bg-[#244F49]"
                      size="sm"
                      type="submit"
                    >
                      Publicar
                    </Button>
                  </form>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
