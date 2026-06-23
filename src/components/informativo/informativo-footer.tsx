import type { Informativo } from "yes@/lib/informativo/types"

type InformativoFooterProps = {
  informativo: Informativo
}

export function InformativoFooter({ informativo }: InformativoFooterProps) {
  return (
    <footer className="mt-10 border-t border-[#c7b56f]/70 pt-5">
      <div className="grid gap-3 text-xs leading-5 text-[#667063] sm:grid-cols-[1fr_auto]">
        <p>
          <span className="font-semibold uppercase tracking-[0.14em] text-[#8f7e43]">
            Fonte:
          </span>{" "}
          {informativo.source}
        </p>
        <p className="font-semibold uppercase tracking-[0.16em] text-[#304638]">
          {informativo.firm.name}
        </p>
      </div>
      <p className="mt-3 text-xs leading-5 text-[#667063]">
        {informativo.footerNote}
      </p>
    </footer>
  )
}
