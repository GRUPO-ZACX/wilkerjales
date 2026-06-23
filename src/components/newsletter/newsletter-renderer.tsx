import type {
  NewsletterMode,
  NewsletterSectionType,
  NewsletterTemplate,
} from "yes@/lib/newsletter/types"
import { getNewsletterSections } from "yes@/lib/newsletter/sections"
import { cn } from "yes@/lib/utils"

import { DownloadFloatingButton } from "./download-floating-button"
import { NewsletterBody } from "./newsletter-body"
import { NewsletterCta } from "./newsletter-cta"
import { NewsletterDecisionBox } from "./newsletter-decision-box"
import { NewsletterFooter } from "./newsletter-footer"
import { NewsletterHeader } from "./newsletter-header"
import { NewsletterHero } from "./newsletter-hero"
import { NewsletterSidebar } from "./newsletter-sidebar"
import { NewsletterSyndicCards } from "./newsletter-syndic-cards"

type NewsletterRendererProps = {
  newsletter: NewsletterTemplate
  mode: NewsletterMode
  printHref?: string
}

export function NewsletterRenderer({
  newsletter,
  mode,
  printHref = "/informativo/demo/print",
}: NewsletterRendererProps) {
  const isPrint = mode === "print"
  const bannerText =
    newsletter.banner.trim() || "INFORMATIVO CONDOMINIAL · EDIÇÃO EM RASCUNHO"
  const sections = getNewsletterSections(newsletter)

  return (
    <main
      className={cn(
        "min-h-screen bg-[#F7F5EE] text-[#1F1F1A]",
        isPrint ? "py-0" : "py-0"
      )}
    >
      <NewsletterHeader newsletter={newsletter} />
      <div className="border-y border-[#B7B783]/45 bg-[#244F49] px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#F7F5EE] sm:text-[11px]">
        <div className="mx-auto w-full max-w-[1280px] [overflow-wrap:anywhere]">
          {bannerText}
        </div>
      </div>

      <section
        className={cn(
          "mx-auto w-full max-w-[1280px] px-5 py-10 sm:px-7 lg:px-8 lg:py-14",
          isPrint && "max-w-[1200px] py-10",
          mode === "edit" && "ring-2 ring-[#B7B783]"
        )}
      >
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_390px]">
          <div className="min-w-0 space-y-14">
            {sections.map((section) => (
              <NewsletterContentSection
                key={section.id}
                newsletter={newsletter}
                type={section.type}
              />
            ))}
          </div>

          <NewsletterSidebar newsletter={newsletter} mode={mode} />
        </div>
      </section>

      <NewsletterFooter newsletter={newsletter} />

      {mode === "public" && <DownloadFloatingButton href={printHref} />}
    </main>
  )
}

type NewsletterContentSectionProps = {
  newsletter: NewsletterTemplate
  type: NewsletterSectionType
}

function NewsletterContentSection({
  newsletter,
  type,
}: NewsletterContentSectionProps) {
  if (type === "hero") {
    return <NewsletterHero newsletter={newsletter} />
  }

  if (type === "decision") {
    return <NewsletterDecisionBox newsletter={newsletter} />
  }

  if (type === "body") {
    return <NewsletterBody blocks={newsletter.bodyBlocks} />
  }

  if (type === "syndic") {
    return <NewsletterSyndicCards newsletter={newsletter} />
  }

  if (type === "cta") {
    return <NewsletterCta cta={newsletter.cta} />
  }

  return null
}
