import type { CSSProperties } from "react"

import type {
  NewsletterTemplate,
  RichTextSegment,
} from "yes@/lib/newsletter/types"

type NewsletterA4DocumentProps = {
  newsletter: NewsletterTemplate
}

function plainText(segments: RichTextSegment[]) {
  return segments.map((segment) => segment.text).join("")
}

function clampLines(lines: number): CSSProperties {
  return {
    display: "-webkit-box",
    overflow: "hidden",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: lines,
  }
}

export function NewsletterA4Document({
  newsletter,
}: NewsletterA4DocumentProps) {
  const theme = newsletter.theme ?? {}
  const category = newsletter.category.trim() || "Direito Condominial"
  const title = newsletter.title.trim() || "Titulo do informativo"
  const highlight = newsletter.highlight.trim() || "Destaque principal"
  const intro = plainText(newsletter.intro).trim()
  const logoAlt = newsletter.firm.logoAlt || newsletter.firm.name
  const logoUrl = newsletter.firm.logoUrl
  const topics = newsletter.decisionTopics.slice(0, 4)
  const cards = newsletter.syndicCards.slice(0, 4)
  const bodyBlocks = newsletter.bodyBlocks.slice(0, 2)
  const attorney = newsletter.attorney
  const phone = newsletter.contacts.find(
    (contact) => contact.label === "Telefone",
  )
  const site = newsletter.contacts.find((contact) => contact.label === "Site")
  const instagram = newsletter.socialLinks.find(
    (contact) => contact.label === "Instagram",
  )

  return (
    <main className="min-h-screen bg-white">
      <article
        className="newsletter-a4-page mx-auto flex h-[297mm] w-[210mm] flex-col overflow-hidden bg-[#F7F5EE] text-[#1F1F1A]"
        style={{
          backgroundColor: theme.background,
          color: theme.text,
        }}
      >
        <section className="px-[14mm] pt-[11mm]">
          <div className="flex min-h-[13mm] items-start justify-between gap-[8mm]">
            <p className="pt-[2mm] text-[8pt] font-bold uppercase tracking-[0.18em] text-[#244F49]">
              {category}
            </p>
            {logoUrl ? (
              <div
                aria-label={logoAlt}
                className="h-[13mm] w-[34mm] shrink-0 bg-contain bg-right-top bg-no-repeat"
                role="img"
                style={{ backgroundImage: `url(${logoUrl})` }}
              />
            ) : null}
          </div>
          <h1
            className="mt-[2mm] font-serif text-[27pt] leading-[1.02] text-[#1F1F1A]"
            style={clampLines(2)}
          >
            {title}
          </h1>
          <p
            className="mt-[4mm] border-l-[4px] border-[#B7B783] pl-[4mm] font-serif text-[15pt] leading-tight text-[#244F49]"
            style={clampLines(2)}
          >
            {highlight}
          </p>
          {intro ? (
            <p
              className="mt-[4mm] text-[9.2pt] leading-[1.55] text-[#303029]"
              style={clampLines(3)}
            >
              {intro}
            </p>
          ) : null}
        </section>

        <section className="grid grid-cols-2 gap-[7mm] px-[14mm] pt-[7mm]">
          <div>
            <h2 className="border-b border-[#B7B783] pb-[2mm] text-[10pt] font-bold uppercase tracking-[0.12em] text-[#163B35]">
              Pontos jurídicos
            </h2>
            <div className="mt-[3mm] grid gap-[2.6mm]">
              {topics.map((topic, index) => (
                <article
                  key={`${topic.title}-${index}`}
                  className="grid grid-cols-[9mm_minmax(0,1fr)] gap-[3mm]"
                >
                  <span className="text-[10pt] font-semibold text-[#244F49]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3
                      className="text-[9.6pt] font-semibold leading-tight text-[#1F1F1A]"
                      style={clampLines(1)}
                    >
                      {topic.title}
                    </h3>
                    <p
                      className="mt-[1mm] text-[7.8pt] leading-[1.45] text-[#4F5549]"
                      style={clampLines(2)}
                    >
                      {topic.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div>
            <h2 className="border-b border-[#B7B783] pb-[2mm] text-[10pt] font-bold uppercase tracking-[0.12em] text-[#163B35]">
              Para o síndico
            </h2>
            <div className="mt-[3mm] grid gap-[2.5mm]">
              {cards.map((card, index) => (
                <article
                  key={`${card.title}-${index}`}
                  className="border border-[#B7B783] bg-white px-[3mm] py-[2.5mm]"
                >
                  <p className="text-[7pt] font-semibold text-[#B7B783]">
                    {card.number || String(index + 1).padStart(2, "0")}
                  </p>
                  <h3
                    className="mt-[0.5mm] text-[9.2pt] font-semibold leading-tight text-[#1F1F1A]"
                    style={clampLines(1)}
                  >
                    {card.title}
                  </h3>
                  <p
                    className="mt-[1mm] text-[7.5pt] leading-[1.4] text-[#4F5549]"
                    style={clampLines(2)}
                  >
                    {card.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-[7mm] px-[14mm] pt-[6mm]">
          {bodyBlocks.map((block, index) => (
            <article
              key={`${block.title}-${index}`}
              className="border-l-[3px] border-[#244F49] pl-[3mm]"
            >
              <h2
                className="text-[11pt] font-semibold leading-tight text-[#1F1F1A]"
                style={clampLines(2)}
              >
                {block.title}
              </h2>
              <p
                className="mt-[2mm] text-[8pt] leading-[1.55] text-[#404038]"
                style={clampLines(6)}
              >
                {block.paragraphs.join(" ")}
              </p>
            </article>
          ))}
        </section>

        <footer className="mt-auto border-t border-[#B7B783] bg-[#ECE8D8] px-[14mm] py-[6mm]">
          <div className="grid grid-cols-[24mm_minmax(0,1fr)_42mm] items-center gap-[5mm]">
            <div className="h-[24mm] overflow-hidden border border-[#B7B783] bg-[#F7F5EE]">
              {attorney.photoUrl ? (
                <div
                  aria-label={attorney.photoAlt ?? attorney.name}
                  className="h-full w-full bg-cover bg-top"
                  role="img"
                  style={{ backgroundImage: `url(${attorney.photoUrl})` }}
                />
              ) : null}
            </div>
            <div>
              <p className="text-[11pt] font-semibold leading-tight text-[#1F1F1A]">
                {attorney.name}
              </p>
              <p className="mt-[1mm] text-[7pt] font-bold uppercase tracking-[0.12em] text-[#244F49]">
                {attorney.specialty}
              </p>
              <p className="mt-[2mm] text-[8pt] leading-[1.4] text-[#163B35]">
                {attorney.phrase}
              </p>
            </div>
            <div className="text-right text-[7.5pt] font-semibold leading-[1.55] text-[#1F1F1A]">
              {phone?.value ? <p>{phone.value}</p> : null}
              {site?.value ? <p>{site.value}</p> : null}
              {instagram?.value ? <p>{instagram.value}</p> : null}
            </div>
          </div>
        </footer>
      </article>
    </main>
  )
}
