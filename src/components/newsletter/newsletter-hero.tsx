import type { NewsletterTemplate } from "yes@/lib/newsletter/types"
import {
  getNewsletterTextStyle,
  newsletterTextStyleClassName,
  newsletterTextStyleCss,
} from "yes@/lib/newsletter/text-style"
import { cn } from "yes@/lib/utils"

type NewsletterHeroProps = {
  newsletter: NewsletterTemplate
}

export function NewsletterHero({ newsletter }: NewsletterHeroProps) {
  const title = newsletter.title.trim() || "Título do informativo"
  const highlight = newsletter.highlight.trim() || "Destaque principal"
  const intro = newsletter.intro.some((segment) => segment.text.trim())
    ? newsletter.intro
    : [{ text: "Parágrafo introdutório do informativo." }]
  const titleStyle = getNewsletterTextStyle(newsletter, "title")
  const highlightStyle = getNewsletterTextStyle(newsletter, "highlight")
  const introStyle = getNewsletterTextStyle(newsletter, "intro")

  return (
    <section className="border-b border-[#B7B783]/60 pb-12">
      <h1
        className={cn(
          "max-w-[860px] font-serif text-5xl leading-[0.98] tracking-tight text-[#1F1F1A] [overflow-wrap:anywhere] sm:text-6xl lg:text-[84px]",
          newsletterTextStyleClassName(titleStyle)
        )}
        style={newsletterTextStyleCss(titleStyle)}
      >
        {title}
      </h1>
      <p
        className={cn(
          "mt-7 max-w-[860px] border-l-[6px] border-[#B7B783] pl-6 font-serif text-3xl leading-tight text-[#244F49] [overflow-wrap:anywhere] sm:text-[42px]",
          newsletterTextStyleClassName(highlightStyle)
        )}
        style={newsletterTextStyleCss(highlightStyle)}
      >
        {highlight}
      </p>

      <p
        className={cn(
          "mt-9 max-w-[820px] text-[18px] leading-9 text-[#1F1F1A] [overflow-wrap:anywhere]",
          newsletterTextStyleClassName(introStyle)
        )}
        style={newsletterTextStyleCss(introStyle)}
      >
        {intro.map((segment, index) => {
          let content = <>{segment.text}</>

          if (segment.bold) {
            content = <strong>{content}</strong>
          }

          if (segment.italic) {
            content = <em>{content}</em>
          }

          if (segment.underline) {
            content = <u>{content}</u>
          }

          if (segment.href) {
            content = (
              <a
                className="font-semibold text-[#244F49] underline decoration-[#B7B783] underline-offset-4"
                href={segment.href}
                rel="noopener noreferrer"
                target="_blank"
              >
                {content}
              </a>
            )
          }

          return (
            <span
              key={`${segment.text}-${index}`}
              style={segment.color ? { color: segment.color } : undefined}
            >
              {content}
            </span>
          )
        })}
      </p>
    </section>
  )
}
