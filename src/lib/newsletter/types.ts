export type NewsletterMode = "public" | "edit" | "print"

export type RichTextSegment = {
  text: string
  bold?: boolean
  color?: string
  href?: string
  italic?: boolean
  underline?: boolean
}

export type NewsletterHeader = {
  collection: string
  period: string
  issue: string
  label: string
}

export type NewsletterFirm = {
  name: string
  descriptor: string
  logoUrl?: string
  logoAlt?: string
}

export type NewsletterTextStyle = {
  align?: "left" | "center" | "right"
  bold?: boolean
  color?: string
  fontFamily?: "sans" | "serif"
  letterSpacing?: "normal" | "wide" | "wider"
  lineHeight?: "compact" | "normal" | "loose"
}

export type NewsletterTheme = {
  background?: string
  text?: string
}

export type NewsletterTopic = {
  title: string
  description: string
}

export type NewsletterNumberedCard = {
  number: string
  title: string
  description: string
}

export type NewsletterTextBlock = {
  eyebrow: string
  title: string
  paragraphs: string[]
}

export type NewsletterAttorney = {
  name: string
  specialty: string
  phrase: string
  initials: string
  photoUrl?: string
  photoAlt?: string
}

export type NewsletterCta = {
  title: string
  description: string
  label: string
  href: string
}

export type NewsletterContact = {
  label: string
  value: string
  href: string
}

export type NewsletterSectionType =
  | "hero"
  | "decision"
  | "body"
  | "syndic"
  | "cta"

export type NewsletterSection = {
  id: string
  type: NewsletterSectionType
  order: number
}

export type NewsletterTemplate = {
  id: string
  slug: string
  sections?: NewsletterSection[]
  theme?: NewsletterTheme
  textStyles?: Record<string, NewsletterTextStyle>
  header: NewsletterHeader
  firm: NewsletterFirm
  banner: string
  category: string
  title: string
  highlight: string
  intro: RichTextSegment[]
  decisionTitle: string
  decisionTopics: NewsletterTopic[]
  syndicTitle: string
  syndicCards: NewsletterNumberedCard[]
  bodyBlocks: NewsletterTextBlock[]
  attorney: NewsletterAttorney
  cta: NewsletterCta
  sourceTitle: string
  sourceDescription: string
  address: string
  contacts: NewsletterContact[]
  socialLinks: NewsletterContact[]
}
