import type { NewsletterTemplate } from "yes@/lib/newsletter/types"

type NewsletterHeroProps = {
  newsletter: NewsletterTemplate
}

export function NewsletterHero({ newsletter }: NewsletterHeroProps) {
  const title = newsletter.title.trim() || "Título do informativo"
  const highlight = newsletter.highlight.trim() || "Destaque principal"
  const intro = newsletter.intro.some((segment) => segment.text.trim())
    ? newsletter.intro
    : [{ text: "Parágrafo introdutório do informativo." }]

  return (
    <section className="border-b border-[#B7B783]/60 pb-12">
      <h1 className="max-w-[860px] font-serif text-5xl leading-[0.98] tracking-tight text-[#1F1F1A] [overflow-wrap:anywhere] sm:text-6xl lg:text-[84px]">
        {title}
      </h1>
      <p className="mt-7 max-w-[860px] border-l-[6px] border-[#B7B783] pl-6 font-serif text-3xl leading-tight text-[#244F49] [overflow-wrap:anywhere] sm:text-[42px]">
        {highlight}
      </p>

      <p className="mt-9 max-w-[820px] text-[18px] leading-9 text-[#1F1F1A] [overflow-wrap:anywhere]">
        {intro.map((segment, index) =>
          segment.bold ? (
            <strong key={`${segment.text}-${index}`}>{segment.text}</strong>
          ) : (
            <span key={`${segment.text}-${index}`}>{segment.text}</span>
          )
        )}
      </p>
    </section>
  )
}
