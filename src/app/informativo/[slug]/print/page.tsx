import { notFound } from "next/navigation"

import { NewsletterRenderer } from "yes@/components/newsletter/newsletter-renderer"
import { normalizeNewsletterTemplate } from "yes@/lib/newsletter/normalize"
import type { NewsletterRow } from "yes@/lib/supabase/database.types"
import { hasSupabaseEnv } from "yes@/lib/supabase/env"
import { createClient } from "yes@/lib/supabase/server"

type PublicPrintInformativoPageProps = {
  params: Promise<{
    slug: string
  }>
}

export default async function PublicPrintInformativoPage({
  params,
}: PublicPrintInformativoPageProps) {
  const { slug } = await params

  if (!hasSupabaseEnv()) {
    notFound()
  }

  const supabase = await createClient()
  const { data: rawData } = await supabase
    .from("newsletters")
    .select("content")
    .eq("slug", slug)
    .eq("status", "published")
    .single()
  const data = rawData as Pick<NewsletterRow, "content"> | null

  if (!data) {
    notFound()
  }

  const newsletter = normalizeNewsletterTemplate(data.content)
  newsletter.slug = slug

  return (
    <NewsletterRenderer
      newsletter={newsletter}
      mode="print"
    />
  )
}
