import type { NewsletterTemplate } from "yes@/lib/newsletter/types"

type NewsletterDecisionBoxProps = {
  newsletter: NewsletterTemplate
}

export function NewsletterDecisionBox({
  newsletter,
}: NewsletterDecisionBoxProps) {
  const topics =
    newsletter.decisionTopics.length > 0
      ? newsletter.decisionTopics
      : [{ title: "", description: "" }]

  return (
    <section className="border border-[#B7B783] bg-white p-6 shadow-[inset_0_4px_0_#244F49] sm:p-8">
      <div className="grid gap-x-8 gap-y-0 sm:grid-cols-2">
        {topics.map((topic, index) => {
          const title = topic.title.trim() || "Tópico jurídico"
          const description =
            topic.description.trim() || "Descrição objetiva do entendimento."

          return (
            <article
              key={`${index}-${title}`}
              className="grid grid-cols-[42px_minmax(0,1fr)] gap-4 border-b border-[#B7B783]/70 py-5"
            >
              <span className="pt-1 text-2xl font-semibold leading-none text-[#244F49]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <h3 className="text-[20px] font-semibold leading-tight text-[#1F1F1A] [overflow-wrap:anywhere]">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#404038] [overflow-wrap:anywhere]">
                  {description}
                </p>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
