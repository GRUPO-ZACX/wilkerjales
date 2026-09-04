import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, CalendarDays, FileText } from "lucide-react"

import { SiteHero } from "yes@/components/site/site-hero"
import { SiteShell } from "yes@/components/site/site-shell"
import {
  getNewsletterExcerpt,
  getPublishedNewsletterTitle,
  getPublishedNewsletters,
  type PublishedNewsletter,
} from "yes@/lib/newsletter/publication"
import { newsletterImageCropBackgroundStyle } from "yes@/lib/newsletter/image-crop"
import type { NewsletterImageCrop } from "yes@/lib/newsletter/types"
import { asset } from "yes@/lib/site/content"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Publicações | Jales & Jales Advogados",
  description:
    "Acompanhe as novidades dentre nossas áreas de atuação.",
}

type PublishedNewsletterCard = {
  category: string
  coverCrop?: NewsletterImageCrop
  coverImageAlt?: string
  coverImageUrl?: string
  dateLabel: string
  excerpt: string
  href: string
  id: string
  issue: string
  period: string
  title: string
}

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "long",
  year: "numeric",
})

function formatNewsletterDate(publication: PublishedNewsletter) {
  const dateValue = publication.published_at || publication.updated_at

  if (!dateValue) {
    return ""
  }

  return dateFormatter.format(new Date(dateValue))
}

function toPublishedNewsletterCard(
  publication: PublishedNewsletter
): PublishedNewsletterCard {
  const { newsletter } = publication

  return {
    category: newsletter.category.trim() || "Informativo jurídico",
    coverCrop: newsletter.cover?.crop,
    coverImageAlt: newsletter.cover?.imageAlt,
    coverImageUrl: newsletter.cover?.imageUrl?.trim() || undefined,
    dateLabel: formatNewsletterDate(publication),
    excerpt: getNewsletterExcerpt(newsletter),
    href: `/informativo/${publication.slug}`,
    id: publication.id,
    issue: newsletter.header.issue.trim() || "Edição",
    period: newsletter.header.period.trim() || "",
    title: getPublishedNewsletterTitle(publication),
  }
}

export default async function PublicacoesPage() {
  const newsletters = await getPublishedNewsletters()
  const publishedCards = newsletters.map(toPublishedNewsletterCard)

  return (
    <SiteShell>
      <SiteHero image={asset("publicacoes-jales-e-jales.jpg")} title="Publicações" />

      <section className="site-section bg-white">
        <div className="site-container">
          <div className="text-center">
            <h2 className="site-heading">Informativos publicados</h2>
            <p className="site-text mt-4">
              Acompanhe os materiais jurídicos disponibilizados pelo escritório.
            </p>
          </div>

          {publishedCards.length > 0 ? (
            <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {publishedCards.map((newsletter) => (
                <Link
                  aria-label={`Ler informativo: ${newsletter.title}`}
                  className="site-animate-up group block overflow-hidden border border-[#e5e5e5] bg-white shadow-sm transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-[#c4c496] hover:shadow-[0_18px_42px_rgba(23,39,39,0.12)] focus:outline-none focus-visible:border-[#336666] focus-visible:ring-4 focus-visible:ring-[#336666]/15"
                  href={newsletter.href}
                  key={newsletter.id}
                >
                  {newsletter.coverImageUrl ? (
                    <div className="relative h-[220px] overflow-hidden bg-[#f3f3ea]">
                      <div
                        aria-label={
                          newsletter.coverImageAlt || newsletter.title
                        }
                        className="absolute inset-0 bg-cover bg-no-repeat"
                        role="img"
                        style={newsletterImageCropBackgroundStyle(
                          newsletter.coverImageUrl,
                          newsletter.coverCrop,
                        )}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#163b35]/82 via-[#163b35]/18 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                        <div className="flex items-center justify-between gap-4">
                          <span className="inline-flex size-11 items-center justify-center rounded-full bg-white/92 text-[#336666]">
                            <FileText size={20} aria-hidden />
                          </span>
                          <span className="site-serif text-sm text-white/85">
                            {newsletter.issue}
                          </span>
                        </div>
                        <p className="mt-8 text-xs font-medium uppercase tracking-[0.18em] text-white/85">
                          Informativo
                        </p>
                        <p className="site-serif mt-2 line-clamp-2 text-[24px] leading-tight text-white">
                          {newsletter.category}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-[220px] flex-col justify-between bg-[#f3f3ea] p-6">
                      <div className="flex items-center justify-between gap-4">
                        <span className="inline-flex size-11 items-center justify-center rounded-full bg-[#336666] text-white">
                          <FileText size={20} aria-hidden />
                        </span>
                        <span className="site-serif text-sm text-[#a3a373]">
                          {newsletter.issue}
                        </span>
                      </div>

                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#336666]">
                          Informativo
                        </p>
                        <p className="site-serif mt-3 text-[26px] leading-tight text-[#a3a373]">
                          {newsletter.category}
                        </p>
                        {newsletter.period ? (
                          <p className="mt-3 text-sm text-black/55">
                            {newsletter.period}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  )}

                  <div className="flex min-h-[310px] flex-col p-6">
                    <h3 className="border-l-[4px] border-[#c4c496] pl-4 text-[22px] font-semibold leading-snug tracking-[-0.01em] text-[#336666] transition-colors duration-200 group-hover:text-[#163b35]">
                      {newsletter.title}
                    </h3>
                    <p className="mt-5 line-clamp-4 text-base leading-7 text-[#a3a373]">
                      {newsletter.excerpt}
                    </p>
                    <div className="mt-auto pt-6">
                      {newsletter.dateLabel ? (
                        <p className="inline-flex items-center gap-2 border border-[#c4c496] bg-[#f3f3ea] px-4 py-2.5 text-sm font-semibold text-[#6f704d]">
                          <CalendarDays
                            className="shrink-0 text-[#336666]"
                            size={16}
                            aria-hidden
                          />
                          {newsletter.dateLabel}
                        </p>
                      ) : null}
                      <span className="mt-4 flex items-center gap-2 text-[15px] font-semibold text-[#336666]">
                        Ler informativo
                        <ArrowRight
                          className="transition-transform duration-200 group-hover:translate-x-1"
                          size={16}
                          aria-hidden
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mx-auto mt-12 max-w-3xl border border-[#e5e5e5] bg-[#f3f3ea] p-8 text-center">
              <p className="site-text">
                Nenhuma publicação disponível no momento.
              </p>
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  )
}
