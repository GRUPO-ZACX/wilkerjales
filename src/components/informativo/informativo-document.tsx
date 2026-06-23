import type { Informativo } from "yes@/lib/informativo/types"
import { cn } from "yes@/lib/utils"

import { BlockRenderer } from "./block-renderer"
import { InformativoFooter } from "./informativo-footer"
import { InformativoHeader } from "./informativo-header"
import { InformativoHero } from "./informativo-hero"

type InformativoDocumentProps = {
  informativo: Informativo
  mode?: "screen" | "print"
}

export function InformativoDocument({
  informativo,
  mode = "screen",
}: InformativoDocumentProps) {
  const visibleBlocks = informativo.blocks.filter((block) => block.visible)
  const isPrint = mode === "print"

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[920px] px-4 pb-12 sm:px-6 lg:px-0",
        isPrint && "max-w-none px-0 pb-0"
      )}
    >
      <article
        className={cn(
          "relative mx-auto min-h-[1120px] overflow-hidden border border-[#d3c27f] bg-[#fbf8ef] text-[#223528]",
          "shadow-[0_24px_80px_rgba(35,49,37,0.18)] sm:rounded-md",
          isPrint &&
            "min-h-[297mm] w-full max-w-[210mm] border-[#d7c891] shadow-none sm:rounded-none"
        )}
      >
        <div className="flex h-4 w-full">
          <div className="basis-2/3 bg-[#2f4634]" />
          <div className="basis-1/3 bg-[#c7b56f]" />
        </div>

        <div className="px-6 py-7 sm:px-10 sm:py-10 lg:px-14">
          <InformativoHeader informativo={informativo} />
          <InformativoHero informativo={informativo} />

          <div className="space-y-8">
            {visibleBlocks.map((block) => (
              <BlockRenderer key={block.id} block={block} />
            ))}
          </div>

          <InformativoFooter informativo={informativo} />
        </div>
      </article>
    </div>
  )
}
