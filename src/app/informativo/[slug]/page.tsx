import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { PublicNewsletterToolbar } from "yes@/components/newsletter/public-newsletter-toolbar"
import { NewsletterRenderer } from "yes@/components/newsletter/newsletter-renderer"
import {
  getNewsletterExcerpt,
  getPublishedNewsletterBySlug,
  getPublishedNewsletterTitle,
} from "yes@/lib/newsletter/publication"

type PublicInformativoPageProps = {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({
  params,
}: PublicInformativoPageProps): Promise<Metadata> {
  const { slug } = await params
  const publication = await getPublishedNewsletterBySlug(slug)

  if (!publication) {
    return {
      title: "Informativo não encontrado | Jales & Jales Advogados",
    }
  }

  const title = getPublishedNewsletterTitle(publication)
  const description = getNewsletterExcerpt(publication.newsletter)

  return {
    title: `${title} | Jales & Jales Advogados`,
    description,
    openGraph: {
      description,
      title,
      type: "article",
    },
  }
}

export default async function PublicInformativoPage({
  params,
}: PublicInformativoPageProps) {
  const { slug } = await params
  const publication = await getPublishedNewsletterBySlug(slug)

  if (!publication) {
    notFound()
  }

  const title = getPublishedNewsletterTitle(publication)
  const printHref = `/api/informativos/${slug}/pdf`

  return (
    <>
      <PublicNewsletterToolbar printHref={printHref} title={title} />
      <NewsletterRenderer
        newsletter={publication.newsletter}
        mode="public"
        printHref={printHref}
      />
    </>
  )
}
