import type {
  NewsletterMode,
  NewsletterTemplate,
} from "yes@/lib/newsletter/types"
import { cn } from "yes@/lib/utils"

import { AttorneyCard } from "./attorney-card"
import { NewsletterSource } from "./newsletter-source"

type NewsletterSidebarProps = {
  newsletter: NewsletterTemplate
  mode: NewsletterMode
}

export function NewsletterSidebar({
  newsletter,
  mode,
}: NewsletterSidebarProps) {
  const collection = newsletter.header.collection.trim() || "Coleção"
  const period = newsletter.header.period.trim() || "Período"
  const category = newsletter.category.trim() || "Tema jurídico"

  return (
    <aside
      className={cn(
        "space-y-6 lg:border-l lg:border-[#B7B783]/60 lg:pl-8",
        mode !== "print" && "lg:sticky lg:top-8 lg:self-start"
      )}
    >
      <section className="border border-[#B7B783] bg-white p-6 shadow-[inset_0_4px_0_#244F49]">
        <p className="text-[16px] leading-8 text-[#303029] [overflow-wrap:anywhere]">
          Entendimento útil para cobrança, negociação e gestão documental de
          débitos condominiais envolvendo unidades ocupadas pelo poder público.
        </p>
      </section>

      <section className="border border-[#B7B783]/80 bg-[#ECE8D8] p-6">
        <dl className="grid gap-3 text-sm">
          <div className="flex items-start justify-between gap-4 border-b border-[#B7B783]/70 pb-3">
            <dt className="font-semibold uppercase tracking-[0.14em] text-[#6D714C]">
              Coleção
            </dt>
            <dd className="min-w-0 text-right font-semibold text-[#1F1F1A] [overflow-wrap:anywhere]">
              {collection}
            </dd>
          </div>
          <div className="flex items-start justify-between gap-4 border-b border-[#B7B783]/70 pb-3">
            <dt className="font-semibold uppercase tracking-[0.14em] text-[#6D714C]">
              Período
            </dt>
            <dd className="min-w-0 text-right font-semibold text-[#1F1F1A] [overflow-wrap:anywhere]">
              {period}
            </dd>
          </div>
          <div className="flex items-start justify-between gap-4">
            <dt className="font-semibold uppercase tracking-[0.14em] text-[#6D714C]">
              Tema
            </dt>
            <dd className="min-w-0 text-right font-semibold text-[#1F1F1A] [overflow-wrap:anywhere]">
              {category}
            </dd>
          </div>
        </dl>
      </section>

      <AttorneyCard newsletter={newsletter} />
      <NewsletterSource newsletter={newsletter} />
    </aside>
  )
}
