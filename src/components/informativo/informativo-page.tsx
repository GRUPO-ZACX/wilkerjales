import type { Informativo } from "yes@/lib/informativo/types"

import { DemoToolbar } from "./demo-toolbar"
import { InformativoDocument } from "./informativo-document"

type InformativoPageProps = {
  informativo: Informativo
  mode?: "screen" | "print"
}

export function InformativoPage({
  informativo,
  mode = "screen",
}: InformativoPageProps) {
  const isPrint = mode === "print"

  return (
    <main
      className={
        isPrint
          ? "min-h-screen bg-white"
          : "min-h-screen bg-[#ece5d7] bg-[linear-gradient(180deg,#f5f0e4_0%,#e8dfcf_100%)]"
      }
    >
      {!isPrint && <DemoToolbar slug={informativo.slug} />}
      <InformativoDocument informativo={informativo} mode={mode} />
    </main>
  )
}
