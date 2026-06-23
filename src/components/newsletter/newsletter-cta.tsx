import Link from "next/link"
import { ArrowRight } from "lucide-react"

import {
  getNewsletterTextStyle,
  newsletterTextStyleClassName,
  newsletterTextStyleCss,
} from "yes@/lib/newsletter/text-style"
import type { NewsletterTemplate } from "yes@/lib/newsletter/types"
import { cn } from "yes@/lib/utils"

type NewsletterCtaProps = {
  newsletter: NewsletterTemplate
}

export function NewsletterCta({ newsletter }: NewsletterCtaProps) {
  const cta = newsletter.cta
  const title = cta.title.trim() || "Chamada para atendimento"
  const description =
    cta.description.trim() || "Texto de apoio para orientar o próximo passo."
  const label = cta.label.trim() || "Falar com o escritório"
  const href = cta.href.trim() || "#"
  const titleStyle = getNewsletterTextStyle(newsletter, "cta.title")
  const descriptionStyle = getNewsletterTextStyle(
    newsletter,
    "cta.description"
  )
  const labelStyle = getNewsletterTextStyle(newsletter, "cta.label")

  return (
    <section className="rounded-md border border-[#B7B783] bg-[#163B35] p-6 text-[#F7F5EE] sm:p-7">
      <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="min-w-0">
          <h2
            className={cn(
              "text-3xl font-semibold leading-tight tracking-[-0.02em] [overflow-wrap:anywhere]",
              newsletterTextStyleClassName(titleStyle)
            )}
            style={newsletterTextStyleCss(titleStyle)}
          >
            {title}
          </h2>
          <p
            className={cn(
              "mt-3 max-w-2xl text-sm leading-6 text-[#E8E4D4] [overflow-wrap:anywhere]",
              newsletterTextStyleClassName(descriptionStyle)
            )}
            style={newsletterTextStyleCss(descriptionStyle)}
          >
            {description}
          </p>
        </div>
        <Link
          href={href}
          className="inline-flex w-fit max-w-full items-center gap-2 rounded-sm bg-[#B7B783] px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#163B35] transition-colors hover:bg-[#F7F5EE]"
        >
          <span
            className={cn(
              "[overflow-wrap:anywhere]",
              newsletterTextStyleClassName(labelStyle)
            )}
            style={newsletterTextStyleCss(labelStyle)}
          >
            {label}
          </span>
          <ArrowRight className="size-4 shrink-0" />
        </Link>
      </div>
    </section>
  )
}
