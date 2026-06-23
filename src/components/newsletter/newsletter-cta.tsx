import Link from "next/link"
import { ArrowRight } from "lucide-react"

import type { NewsletterCta as NewsletterCtaType } from "yes@/lib/newsletter/types"

type NewsletterCtaProps = {
  cta: NewsletterCtaType
}

export function NewsletterCta({ cta }: NewsletterCtaProps) {
  const title = cta.title.trim() || "Chamada para atendimento"
  const description =
    cta.description.trim() || "Texto de apoio para orientar o próximo passo."
  const label = cta.label.trim() || "Falar com o escritório"
  const href = cta.href.trim() || "#"

  return (
    <section className="rounded-md border border-[#B7B783] bg-[#163B35] p-6 text-[#F7F5EE] sm:p-7">
      <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="min-w-0">
          <h2 className="text-3xl font-semibold leading-tight tracking-[-0.02em] [overflow-wrap:anywhere]">
            {title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#E8E4D4] [overflow-wrap:anywhere]">
            {description}
          </p>
        </div>
        <Link
          href={href}
          className="inline-flex w-fit max-w-full items-center gap-2 rounded-sm bg-[#B7B783] px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#163B35] transition-colors hover:bg-[#F7F5EE]"
        >
          <span className="[overflow-wrap:anywhere]">{label}</span>
          <ArrowRight className="size-4 shrink-0" />
        </Link>
      </div>
    </section>
  )
}
