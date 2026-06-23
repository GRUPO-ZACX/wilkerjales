export type InformativoBlock =
  | ArticleBlock
  | NumberedCardsBlock
  | NoteBlock
  | AttorneyBlock
  | CtaBlock

export type InformativoBlockType = InformativoBlock["type"]

type BaseBlock = {
  id: string
  visible: boolean
}

export type FirmInfo = {
  name: string
  tagline: string
  city: string
}

export type AttorneyInfo = {
  name: string
  role: string
  oab: string
  bio: string
  email: string
  phone: string
  photoAlt: string
  initials: string
}

export type CtaInfo = {
  title: string
  description: string
  label: string
  href: string
}

export type Informativo = {
  id: string
  slug: string
  edition: string
  issueLabel: string
  publishedAt: string
  practiceArea: string
  firm: FirmInfo
  title: string
  subtitle: string
  summary: string
  tags: string[]
  source: string
  footerNote: string
  blocks: InformativoBlock[]
}

export type ArticleBlock = BaseBlock & {
  type: "article"
  eyebrow: string
  title: string
  lead?: string
  paragraphs: string[]
  highlight?: string
}

export type NumberedCardsBlock = BaseBlock & {
  type: "numbered-cards"
  eyebrow: string
  title: string
  description: string
  cards: Array<{
    number: string
    title: string
    description: string
  }>
}

export type NoteBlock = BaseBlock & {
  type: "note"
  eyebrow: string
  title: string
  quote: string
  source: string
}

export type AttorneyBlock = BaseBlock & {
  type: "attorney"
  attorney: AttorneyInfo
}

export type CtaBlock = BaseBlock & {
  type: "cta"
  cta: CtaInfo
}
