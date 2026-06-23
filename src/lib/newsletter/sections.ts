import type {
  NewsletterSection,
  NewsletterSectionType,
  NewsletterTemplate,
} from "./types"

export const defaultNewsletterSections: NewsletterSection[] = [
  { id: "section-hero", type: "hero", order: 0 },
  { id: "section-decision", type: "decision", order: 1 },
  { id: "section-body", type: "body", order: 2 },
  { id: "section-syndic", type: "syndic", order: 3 },
  { id: "section-cta", type: "cta", order: 4 },
]

export const newsletterSectionMeta: Record<
  NewsletterSectionType,
  { label: string; description: string }
> = {
  hero: {
    label: "Hero e introdução",
    description: "Título, destaque principal e parágrafo de abertura.",
  },
  decision: {
    label: "Tópicos jurídicos",
    description: "Síntese objetiva do entendimento jurídico.",
  },
  body: {
    label: "Blocos explicativos",
    description: "Texto principal com análise e orientação prática.",
  },
  syndic: {
    label: "Cards numerados",
    description: "Pontos que o síndico precisa observar.",
  },
  cta: {
    label: "Chamada para atendimento",
    description: "Bloco final com convite para falar com o escritório.",
  },
  "custom-text": {
    label: "Texto livre",
    description: "Seção editorial simples com título e texto.",
  },
  "custom-image": {
    label: "Imagem",
    description: "Espaço visual com legenda opcional.",
  },
  "custom-button": {
    label: "Botão",
    description: "Chamada independente com link.",
  },
}

const knownSectionTypes = new Set<NewsletterSectionType>(
  Object.keys(newsletterSectionMeta) as NewsletterSectionType[]
)

const baseSectionTypes = new Set<NewsletterSectionType>(
  defaultNewsletterSections.map((section) => section.type)
)

export function normalizeNewsletterSections(
  sections: NewsletterSection[] | undefined
) {
  const byType = new Map<NewsletterSectionType, NewsletterSection>()
  const customSections: NewsletterSection[] = []

  sections
    ?.filter((section) => knownSectionTypes.has(section.type))
    .forEach((section, index) => {
      if (!baseSectionTypes.has(section.type)) {
        customSections.push({
          hidden: section.hidden === true,
          id: section.id || `section-${section.type}-${index}`,
          type: section.type,
          order: Number.isFinite(section.order) ? section.order : index,
        })
        return
      }

      if (byType.has(section.type)) {
        return
      }

      byType.set(section.type, {
        hidden: section.hidden === true,
        id: section.id || `section-${section.type}`,
        type: section.type,
        order: Number.isFinite(section.order) ? section.order : index,
      })
    })

  defaultNewsletterSections.forEach((section) => {
    if (!byType.has(section.type)) {
      byType.set(section.type, { ...section })
    }
  })

  return Array.from(byType.values())
    .concat(customSections)
    .sort((current, next) => current.order - next.order)
    .map((section, index) => ({ ...section, order: index }))
}

export function getNewsletterSections(newsletter: NewsletterTemplate) {
  return normalizeNewsletterSections(newsletter.sections)
}
