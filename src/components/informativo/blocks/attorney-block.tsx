import { Mail, Phone } from "lucide-react"

import type { AttorneyBlock } from "yes@/lib/informativo/types"

type AttorneyBlockViewProps = {
  block: AttorneyBlock
}

export function AttorneyBlockView({ block }: AttorneyBlockViewProps) {
  const { attorney } = block

  return (
    <section className="grid gap-6 border-y border-[#c7b56f]/70 py-7 sm:grid-cols-[210px_1fr]">
      <div
        className="flex aspect-[4/5] items-center justify-center border border-[#c7b56f] bg-[#eadfbe]"
        aria-label={attorney.photoAlt}
      >
        <div className="grid size-28 place-items-center rounded-full border border-[#304638]/25 bg-[#fbf8ef] font-serif text-4xl text-[#304638]">
          {attorney.initials}
        </div>
      </div>

      <div className="self-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8f7e43]">
          Área de foto e assinatura
        </p>
        <h2 className="mt-2 font-serif text-3xl leading-tight text-[#25382a]">
          {attorney.name}
        </h2>
        <p className="mt-1 text-sm font-semibold uppercase tracking-[0.12em] text-[#536246]">
          {attorney.role} · {attorney.oab}
        </p>
        <p className="mt-4 max-w-xl text-[15px] leading-7 text-[#4f5e51]">
          {attorney.bio}
        </p>

        <div className="mt-5 flex flex-wrap gap-3 text-sm text-[#334536]">
          <span className="inline-flex items-center gap-2 border border-[#c7b56f]/70 bg-[#fffaf0] px-3 py-2">
            <Mail className="size-4 text-[#8f7e43]" />
            {attorney.email}
          </span>
          <span className="inline-flex items-center gap-2 border border-[#c7b56f]/70 bg-[#fffaf0] px-3 py-2">
            <Phone className="size-4 text-[#8f7e43]" />
            {attorney.phone}
          </span>
        </div>
      </div>
    </section>
  )
}
