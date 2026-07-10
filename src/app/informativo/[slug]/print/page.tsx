import { notFound } from "next/navigation"

import { NewsletterRenderer } from "yes@/components/newsletter/newsletter-renderer"
import { getPublishedNewsletterBySlug } from "yes@/lib/newsletter/publication"

type PublicPrintInformativoPageProps = {
  params: Promise<{
    slug: string
  }>
}

export default async function PublicPrintInformativoPage({
  params,
}: PublicPrintInformativoPageProps) {
  const { slug } = await params
  const publication = await getPublishedNewsletterBySlug(slug)

  if (!publication) {
    notFound()
  }

  return (
    <NewsletterRenderer
      newsletter={publication.newsletter}
      mode="print"
    />
  )
}
