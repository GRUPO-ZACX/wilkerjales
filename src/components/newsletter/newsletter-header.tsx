import { Scale } from "lucide-react"

import type { NewsletterTemplate } from "yes@/lib/newsletter/types"

type NewsletterHeaderProps = {
  newsletter: NewsletterTemplate
}

export function NewsletterHeader({ newsletter }: NewsletterHeaderProps) {
  const collection = newsletter.header.collection.trim() || "COLEÇÃO"
  const period = newsletter.header.period.trim() || "PERÍODO"
  const issue = newsletter.header.issue.trim() || "EDIÇÃO"
  const label = newsletter.header.label.trim() || "Informativo"
  const firmName = newsletter.firm.name.trim() || "Nome do escritório"
  const firmDescriptor =
    newsletter.firm.descriptor.trim() || "Advogados Associados"
  const logoUrl = newsletter.firm.logoUrl

  return (
    <header className="relative border-b border-[#B7B783] bg-[#F7F5EE] px-5 py-5 sm:px-7 lg:px-8">
      <div className="absolute inset-x-0 top-0 flex h-1">
        <div className="flex-1 bg-[#163B35]" />
        <div className="w-40 bg-[#B7B783]" />
      </div>

      <div className="mx-auto grid w-full max-w-[1280px] gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.45fr)_minmax(0,1fr)] sm:items-center">
        <div className="min-w-0 space-y-1 text-[11px] font-bold uppercase leading-5 tracking-[0.18em] text-[#244F49] [overflow-wrap:anywhere]">
          <p>{collection}</p>
          <p className="text-[#6D714C]">{period}</p>
        </div>

        <div className="flex min-w-0 items-center gap-3 sm:justify-center">
          <div className="grid size-12 shrink-0 place-items-center rounded-full border border-[#B7B783] bg-[#163B35] text-[#F7F5EE] shadow-[0_0_0_6px_rgba(183,183,131,0.13)]">
            {logoUrl ? (
              <div
                aria-label={newsletter.firm.logoAlt ?? firmName}
                className="h-full w-full rounded-full bg-cover bg-center"
                role="img"
                style={{ backgroundImage: `url(${logoUrl})` }}
              />
            ) : (
              <Scale className="size-6" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[25px] font-semibold leading-tight tracking-[-0.02em] text-[#1F1F1A] [overflow-wrap:anywhere]">
              {firmName}
            </p>
            <p className="mt-1 text-[10px] font-bold uppercase leading-5 tracking-[0.2em] text-[#244F49] [overflow-wrap:anywhere]">
              {firmDescriptor}
            </p>
          </div>
        </div>

        <div className="min-w-0 space-y-1 text-[11px] font-bold uppercase leading-5 tracking-[0.18em] text-[#244F49] [overflow-wrap:anywhere] sm:text-right">
          <p>{issue}</p>
          <p className="text-[#6D714C]">{label}</p>
        </div>
      </div>
    </header>
  )
}
