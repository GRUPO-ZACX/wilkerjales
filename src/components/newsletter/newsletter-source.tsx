import type { NewsletterTemplate } from "yes@/lib/newsletter/types"

type NewsletterSourceProps = {
  newsletter: NewsletterTemplate
}

export function NewsletterSource({ newsletter }: NewsletterSourceProps) {
  const source =
    newsletter.sourceDescription.trim() ||
    "Referência jurídica do informativo em edição."

  return (
    <section className="border border-[#B7B783]/80 bg-white p-6">
      <p className="text-xs leading-6 text-[#404038] [overflow-wrap:anywhere]">
        {source}
      </p>
    </section>
  )
}
