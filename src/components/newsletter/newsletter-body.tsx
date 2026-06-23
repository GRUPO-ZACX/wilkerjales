import type { NewsletterTextBlock } from "yes@/lib/newsletter/types"
import type { NewsletterTemplate } from "yes@/lib/newsletter/types"
import {
  getNewsletterTextStyle,
  newsletterTextStyleClassName,
  newsletterTextStyleCss,
} from "yes@/lib/newsletter/text-style"
import { cn } from "yes@/lib/utils"

type NewsletterBodyProps = {
  blocks: NewsletterTextBlock[]
  newsletter?: NewsletterTemplate
}

export function NewsletterBody({ blocks, newsletter }: NewsletterBodyProps) {
  const visibleBlocks =
    blocks.length > 0 ? blocks : [{ eyebrow: "", title: "", paragraphs: [""] }]

  return (
    <div className="space-y-12">
      {visibleBlocks.map((block, index) => {
        const title = block.title.trim() || "Título do bloco explicativo"
        const paragraphs = block.paragraphs.some((paragraph) => paragraph.trim())
          ? block.paragraphs
          : ["Texto explicativo do informativo."]
        const titleStyle =
          newsletter &&
          getNewsletterTextStyle(newsletter, `bodyBlocks.${index}.title`)

        return (
          <article
            key={`${index}-${title}`}
            className="grid grid-cols-[5px_minmax(0,1fr)] gap-5"
          >
            <div className="bg-[#244F49]" />
            <div className="min-w-0 pb-1">
              <h2
                className={cn(
                  "max-w-2xl text-[32px] font-semibold leading-tight tracking-[-0.02em] text-[#1F1F1A] [overflow-wrap:anywhere]",
                  newsletterTextStyleClassName(titleStyle)
                )}
                style={newsletterTextStyleCss(titleStyle)}
              >
                {title}
              </h2>
              <div className="mt-5 space-y-5 text-[16px] leading-8 text-[#404038] [overflow-wrap:anywhere]">
                {paragraphs.map((paragraph, paragraphIndex) => {
                  const paragraphStyle =
                    newsletter &&
                    getNewsletterTextStyle(
                      newsletter,
                      `bodyBlocks.${index}.paragraphs.${paragraphIndex}`
                    )

                  return (
                    <p
                      key={`${paragraphIndex}-${paragraph}`}
                      className={newsletterTextStyleClassName(paragraphStyle)}
                      style={newsletterTextStyleCss(paragraphStyle)}
                    >
                      {paragraph.trim() || "Texto explicativo do informativo."}
                    </p>
                  )
                })}
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}
