import { CalendarDays, MapPin, Scale } from "lucide-react"

import type { Informativo } from "yes@/lib/informativo/types"

type InformativoHeaderProps = {
  informativo: Informativo
}

export function InformativoHeader({ informativo }: InformativoHeaderProps) {
  return (
    <header className="border-b border-[#c7b56f]/70 pb-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-full border border-[#c7b56f] bg-[#304638] text-[#fbf8ef]">
            <Scale className="size-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#88783d]">
              {informativo.issueLabel}
            </p>
            <h2 className="mt-2 font-serif text-2xl leading-none text-[#233829]">
              {informativo.firm.name}
            </h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-[#5a665a]">
              {informativo.firm.tagline}
            </p>
          </div>
        </div>

        <div className="grid gap-2 text-sm text-[#405142] sm:justify-items-end sm:text-right">
          <div className="inline-flex items-center gap-2">
            <CalendarDays className="size-4 text-[#9a8848]" />
            <span>{informativo.publishedAt}</span>
          </div>
          <div className="inline-flex items-center gap-2">
            <MapPin className="size-4 text-[#9a8848]" />
            <span>{informativo.firm.city}</span>
          </div>
          <span className="mt-1 inline-flex w-fit rounded-full border border-[#c7b56f]/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#304638]">
            {informativo.edition}
          </span>
        </div>
      </div>
    </header>
  )
}
