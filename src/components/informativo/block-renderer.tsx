import type { InformativoBlock } from "yes@/lib/informativo/types"

import { ArticleBlockView } from "./blocks/article-block"
import { AttorneyBlockView } from "./blocks/attorney-block"
import { CtaBlockView } from "./blocks/cta-block"
import { NoteBlockView } from "./blocks/note-block"
import { NumberedCardsBlockView } from "./blocks/numbered-cards-block"

type BlockRendererProps = {
  block: InformativoBlock
}

export function BlockRenderer({ block }: BlockRendererProps) {
  switch (block.type) {
    case "article":
      return <ArticleBlockView block={block} />
    case "numbered-cards":
      return <NumberedCardsBlockView block={block} />
    case "note":
      return <NoteBlockView block={block} />
    case "attorney":
      return <AttorneyBlockView block={block} />
    case "cta":
      return <CtaBlockView block={block} />
  }
}
