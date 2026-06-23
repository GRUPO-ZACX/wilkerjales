import type { NewsletterTemplate } from "yes@/lib/newsletter/types"
import {
  getNewsletterTextStyle,
  newsletterTextStyleClassName,
  newsletterTextStyleCss,
} from "yes@/lib/newsletter/text-style"
import { cn } from "yes@/lib/utils"

type NewsletterSyndicCardsProps = {
  newsletter: NewsletterTemplate
}

export function NewsletterSyndicCards({
  newsletter,
}: NewsletterSyndicCardsProps) {
  const title = newsletter.syndicTitle.trim() || "Pontos de atenção"
  const cards =
    newsletter.syndicCards.length > 0
      ? newsletter.syndicCards
      : [{ number: "01", title: "", description: "" }]
  const sectionTitleStyle = getNewsletterTextStyle(newsletter, "syndicTitle")

  return (
    <section className="border-b border-[#B7B783]/55 pb-12">
      <div className="flex items-center gap-5">
        <h2
          className={cn(
            "min-w-0 text-2xl font-semibold tracking-[-0.02em] text-[#163B35] [overflow-wrap:anywhere]",
            newsletterTextStyleClassName(sectionTitleStyle)
          )}
          style={newsletterTextStyleCss(sectionTitleStyle)}
        >
          {title}
        </h2>
        <div className="h-px flex-1 bg-[#B7B783]" />
      </div>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        {cards.map((card, index) => {
          const cardNumber =
            card.number.trim() || String(index + 1).padStart(2, "0")
          const cardTitle = card.title.trim() || "Título do card"
          const cardDescription =
            card.description.trim() || "Descrição objetiva para orientar a decisão."
          const numberStyle = getNewsletterTextStyle(
            newsletter,
            `syndicCards.${index}.number`
          )
          const titleStyle = getNewsletterTextStyle(
            newsletter,
            `syndicCards.${index}.title`
          )
          const descriptionStyle = getNewsletterTextStyle(
            newsletter,
            `syndicCards.${index}.description`
          )

          return (
            <article
              key={`${index}-${cardNumber}`}
              className="relative grid min-h-44 grid-cols-[58px_minmax(0,1fr)] gap-5 border border-[#B7B783] bg-white p-5 shadow-[inset_4px_0_0_#244F49]"
            >
              <span
                className={cn(
                  "inline-flex size-12 items-center justify-center rounded-full border border-[#B7B783] bg-[#F7F5EE] px-1 text-center text-xl font-semibold leading-none text-[#244F49] [overflow-wrap:anywhere]",
                  newsletterTextStyleClassName(numberStyle)
                )}
                style={newsletterTextStyleCss(numberStyle)}
              >
                {cardNumber}
              </span>
              <div className="min-w-0">
                <h3
                  className={cn(
                    "text-[19px] font-semibold leading-tight text-[#1F1F1A] [overflow-wrap:anywhere]",
                    newsletterTextStyleClassName(titleStyle)
                  )}
                  style={newsletterTextStyleCss(titleStyle)}
                >
                  {cardTitle}
                </h3>
                <p
                  className={cn(
                    "mt-3 text-sm leading-6 text-[#404038] [overflow-wrap:anywhere]",
                    newsletterTextStyleClassName(descriptionStyle)
                  )}
                  style={newsletterTextStyleCss(descriptionStyle)}
                >
                  {cardDescription}
                </p>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
