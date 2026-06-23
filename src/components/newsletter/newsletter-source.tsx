import type { NewsletterTemplate } from "yes@/lib/newsletter/types"
import {
  getNewsletterTextStyle,
  newsletterTextStyleClassName,
  newsletterTextStyleCss,
} from "yes@/lib/newsletter/text-style"
import { cn } from "yes@/lib/utils"

type NewsletterSourceProps = {
  newsletter: NewsletterTemplate
}

export function NewsletterSource({ newsletter }: NewsletterSourceProps) {
  const source =
    newsletter.sourceDescription.trim() ||
    "Referência jurídica do informativo em edição."
  const sourceStyle = getNewsletterTextStyle(newsletter, "sourceDescription")

  return (
    <section className="border border-[#B7B783]/80 bg-white p-6">
      <p
        className={cn(
          "text-xs leading-6 text-[#404038] [overflow-wrap:anywhere]",
          newsletterTextStyleClassName(sourceStyle)
        )}
        style={newsletterTextStyleCss(sourceStyle)}
      >
        {source}
      </p>
    </section>
  )
}
