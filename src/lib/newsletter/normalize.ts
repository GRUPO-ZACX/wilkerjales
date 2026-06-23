import { defaultNewsletterTemplate } from "./default-template"
import { normalizeNewsletterSections } from "./sections"
import type {
  NewsletterContact,
  NewsletterNumberedCard,
  NewsletterSection,
  NewsletterSectionType,
  NewsletterTemplate,
  NewsletterTextBlock,
  NewsletterTopic,
  RichTextSegment,
} from "./types"

function cloneNewsletter(newsletter: NewsletterTemplate): NewsletterTemplate {
  return JSON.parse(JSON.stringify(newsletter)) as NewsletterTemplate
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function stringOrFallback(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback
}

function optionalString(value: unknown) {
  return typeof value === "string" ? value : undefined
}

function normalizeIntro(value: unknown, fallback: RichTextSegment[]) {
  if (!Array.isArray(value)) {
    return fallback
  }

  const intro = value
    .filter(isRecord)
    .map((segment) => ({
      bold: typeof segment.bold === "boolean" ? segment.bold : undefined,
      text: stringOrFallback(segment.text, ""),
    }))

  return intro.length > 0 ? intro : fallback
}

function normalizeTopics(value: unknown, fallback: NewsletterTopic[]) {
  if (!Array.isArray(value)) {
    return fallback
  }

  const topics = value
    .filter(isRecord)
    .map((topic) => ({
      description: stringOrFallback(topic.description, ""),
      title: stringOrFallback(topic.title, ""),
    }))

  return topics.length > 0 ? topics : fallback
}

function normalizeCards(value: unknown, fallback: NewsletterNumberedCard[]) {
  if (!Array.isArray(value)) {
    return fallback
  }

  const cards = value
    .filter(isRecord)
    .map((card) => ({
      description: stringOrFallback(card.description, ""),
      number: stringOrFallback(card.number, ""),
      title: stringOrFallback(card.title, ""),
    }))

  return cards.length > 0 ? cards : fallback
}

function normalizeBodyBlocks(value: unknown, fallback: NewsletterTextBlock[]) {
  if (!Array.isArray(value)) {
    return fallback
  }

  const blocks = value
    .filter(isRecord)
    .map((block) => ({
      eyebrow: stringOrFallback(block.eyebrow, ""),
      paragraphs: Array.isArray(block.paragraphs)
        ? block.paragraphs
            .map((paragraph) => stringOrFallback(paragraph, ""))
            .filter(Boolean)
        : [""],
      title: stringOrFallback(block.title, ""),
    }))

  return blocks.length > 0 ? blocks : fallback
}

function normalizeContacts(value: unknown, fallback: NewsletterContact[]) {
  if (!Array.isArray(value)) {
    return fallback
  }

  const contacts = value
    .filter(isRecord)
    .map((contact) => ({
      href: stringOrFallback(contact.href, "#"),
      label: stringOrFallback(contact.label, "Contato"),
      value: stringOrFallback(contact.value, ""),
    }))

  return contacts.length > 0 ? contacts : fallback
}

function normalizeSections(value: unknown): NewsletterSection[] | undefined {
  if (!Array.isArray(value)) {
    return undefined
  }

  const knownTypes = new Set<NewsletterSectionType>([
    "hero",
    "decision",
    "body",
    "syndic",
    "cta",
  ])

  return value.filter(isRecord).flatMap((section, index) => {
    const type = section.type

    if (
      typeof type !== "string" ||
      !knownTypes.has(type as NewsletterSectionType)
    ) {
      return []
    }

    return [
      {
        id: stringOrFallback(section.id, `section-${type}`),
        order: typeof section.order === "number" ? section.order : index,
        type: type as NewsletterSectionType,
      },
    ]
  })
}

export function normalizeNewsletterTemplate(value: unknown): NewsletterTemplate {
  const fallback = cloneNewsletter(defaultNewsletterTemplate)

  if (!isRecord(value)) {
    return fallback
  }

  const header = isRecord(value.header) ? value.header : {}
  const firm = isRecord(value.firm) ? value.firm : {}
  const attorney = isRecord(value.attorney) ? value.attorney : {}
  const cta = isRecord(value.cta) ? value.cta : {}

  return {
    ...fallback,
    id: stringOrFallback(value.id, fallback.id),
    slug: stringOrFallback(value.slug, fallback.slug),
    sections: normalizeNewsletterSections(normalizeSections(value.sections)),
    header: {
      collection: stringOrFallback(
        header.collection,
        fallback.header.collection
      ),
      issue: stringOrFallback(header.issue, fallback.header.issue),
      label: stringOrFallback(header.label, fallback.header.label),
      period: stringOrFallback(header.period, fallback.header.period),
    },
    firm: {
      descriptor: stringOrFallback(firm.descriptor, fallback.firm.descriptor),
      name: stringOrFallback(firm.name, fallback.firm.name),
    },
    banner: stringOrFallback(value.banner, fallback.banner),
    category: stringOrFallback(value.category, fallback.category),
    title: stringOrFallback(value.title, fallback.title),
    highlight: stringOrFallback(value.highlight, fallback.highlight),
    intro: normalizeIntro(value.intro, fallback.intro),
    decisionTitle: stringOrFallback(value.decisionTitle, ""),
    decisionTopics: normalizeTopics(value.decisionTopics, fallback.decisionTopics),
    syndicTitle: stringOrFallback(value.syndicTitle, fallback.syndicTitle),
    syndicCards: normalizeCards(value.syndicCards, fallback.syndicCards),
    bodyBlocks: normalizeBodyBlocks(value.bodyBlocks, fallback.bodyBlocks),
    attorney: {
      initials: stringOrFallback(attorney.initials, fallback.attorney.initials),
      name: stringOrFallback(attorney.name, fallback.attorney.name),
      photoAlt: optionalString(attorney.photoAlt),
      photoUrl: optionalString(attorney.photoUrl),
      phrase: stringOrFallback(attorney.phrase, fallback.attorney.phrase),
      specialty: stringOrFallback(
        attorney.specialty,
        fallback.attorney.specialty
      ),
    },
    cta: {
      description: stringOrFallback(cta.description, fallback.cta.description),
      href: stringOrFallback(cta.href, fallback.cta.href),
      label: stringOrFallback(cta.label, fallback.cta.label),
      title: stringOrFallback(cta.title, fallback.cta.title),
    },
    sourceTitle: stringOrFallback(value.sourceTitle, ""),
    sourceDescription: stringOrFallback(
      value.sourceDescription,
      fallback.sourceDescription
    ),
    address: stringOrFallback(value.address, fallback.address),
    contacts: normalizeContacts(value.contacts, fallback.contacts),
    socialLinks: normalizeContacts(value.socialLinks, fallback.socialLinks),
  }
}

export function prepareNewsletterForPersistence(value: NewsletterTemplate) {
  const newsletter = normalizeNewsletterTemplate(value)

  if (newsletter.attorney.photoUrl?.startsWith("blob:")) {
    newsletter.attorney.photoUrl = undefined
    newsletter.attorney.photoAlt = undefined
  }

  return JSON.parse(JSON.stringify(newsletter)) as NewsletterTemplate
}
