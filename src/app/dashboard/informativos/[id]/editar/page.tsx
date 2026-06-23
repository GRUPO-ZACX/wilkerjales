import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { NewsletterEditor } from "yes@/components/newsletter/editor/newsletter-editor"
import { normalizeNewsletterTemplate } from "yes@/lib/newsletter/normalize"
import type { NewsletterRow } from "yes@/lib/supabase/database.types"
import { hasSupabaseEnv } from "yes@/lib/supabase/env"
import { createClient } from "yes@/lib/supabase/server"
import {
  publishNewsletterAction,
  unpublishNewsletterAction,
  updateNewsletterAction,
} from "../../actions"

export const metadata: Metadata = {
  title: "Editar informativo | Dashboard",
  description: "Edição de informativo jurídico salvo.",
}

type EditarInformativoPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function EditarInformativoPage({
  params,
}: EditarInformativoPageProps) {
  const { id } = await params

  if (!hasSupabaseEnv()) {
    return (
      <main className="px-5 py-8">
        <section className="mx-auto max-w-[960px] border border-[#B7B783] bg-white/80 p-6">
          <h1 className="text-2xl font-semibold text-[#163B35]">
            Supabase não configurado
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#4F5549]">
            Configure as variáveis de ambiente para carregar informativos
            salvos.
          </p>
        </section>
      </main>
    )
  }

  const supabase = await createClient()
  const { data: rawData } = await supabase
    .from("newsletters")
    .select("*")
    .eq("id", id)
    .single()
  const data = rawData as NewsletterRow | null

  if (!data) {
    notFound()
  }

  const newsletter = normalizeNewsletterTemplate(data.content)
  newsletter.id = data.id
  newsletter.slug = data.slug

  return (
    <NewsletterEditor
      backHref="/dashboard/informativos"
      initialNewsletter={newsletter}
      initialStatus={data.status}
      isPersisted
      onPublish={publishNewsletterAction.bind(null, data.id)}
      onSaveDraft={updateNewsletterAction.bind(null, data.id)}
      onUnpublish={unpublishNewsletterAction.bind(null, data.id)}
    />
  )
}
