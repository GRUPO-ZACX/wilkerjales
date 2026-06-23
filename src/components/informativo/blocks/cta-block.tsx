import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { Button } from "yes@/components/ui/button"
import type { CtaBlock } from "yes@/lib/informativo/types"

type CtaBlockViewProps = {
  block: CtaBlock
}

export function CtaBlockView({ block }: CtaBlockViewProps) {
  return (
    <section className="flex flex-col gap-5 border border-[#c7b56f]/80 bg-[#efe5c8] p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8f7e43]">
          Próximo passo
        </p>
        <h2 className="mt-2 font-serif text-3xl leading-tight text-[#25382a]">
          {block.cta.title}
        </h2>
        <p className="mt-3 text-[15px] leading-7 text-[#4f5e51]">
          {block.cta.description}
        </p>
      </div>
      <Button
        className="w-fit bg-[#304638] text-[#fbf8ef] hover:bg-[#24382a]"
        asChild
      >
        <Link href={block.cta.href}>
          {block.cta.label}
          <ArrowUpRight />
        </Link>
      </Button>
    </section>
  )
}
