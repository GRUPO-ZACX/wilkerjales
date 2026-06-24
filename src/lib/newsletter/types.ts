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
  blockWidth?: number
  bold?: boolean
  color?: string
  fontFamily?: "sans" | "serif"
  fontSize?: number
  letterSpacing?: "normal" | "wide" | "wider" | number
  lineHeight?: "compact" | "normal" | "loose" | number
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

export type NewsletterCustomTextSection = {
  id: string
  type: "custom-text"
  title: string
  body: RichTextSegment[]
}

export type NewsletterCustomImageSection = {
  id: string
  type: "custom-image"
  imageAlt?: string
  imageUrl?: string
  caption: string
}

export type NewsletterCustomButtonSection = {
  id: string
  type: "custom-button"
  title: string
  description: string
  label: string
  href: string
}

export type NewsletterCustomMediaTextSection = {
  id: string
  type: "custom-media-text"
  body: RichTextSegment[]
  imageAlt?: string
  imageUrl?: string
  layout: "image-left" | "image-right" | "image-top"
  title: string
}

export type NewsletterCustomSection =
  | NewsletterCustomTextSection
  | NewsletterCustomImageSection
  | NewsletterCustomButtonSection
  | NewsletterCustomMediaTextSection

export type NewsletterSidebarSummaryBlock = {
  id: string
  type: "summary"
  text: string
}

export type NewsletterSidebarMetadataBlock = {
  id: string
  type: "metadata"
}

export type NewsletterSidebarAttorneyBlock = {
  id: string
  type: "attorney"
}

export type NewsletterSidebarSourceBlock = {
  id: string
  type: "source"
}

export type NewsletterSidebarTextBlock = {
  id: string
  type: "sidebar-text"
  title: string
  body: RichTextSegment[]
}

export type NewsletterSidebarImageBlock = {
  id: string
  type: "sidebar-image"
  caption: string
  imageAlt?: string
  imageUrl?: string
}

export type NewsletterSidebarMediaTextBlock = {
  id: string
  type: "sidebar-media-text"
  body: RichTextSegment[]
  imageAlt?: string
  imageUrl?: string
  title: string
}

export type NewsletterSidebarBlock =
  | NewsletterSidebarSummaryBlock
  | NewsletterSidebarMetadataBlock
  | NewsletterSidebarAttorneyBlock
  | NewsletterSidebarSourceBlock
  | NewsletterSidebarTextBlock
  | NewsletterSidebarImageBlock
  | NewsletterSidebarMediaTextBlock

export type NewsletterSectionType =
  | "hero"
  | "decision"
  | "body"
  | "syndic"
  | "cta"
  | "custom-text"
  | "custom-image"
  | "custom-button"
  | "custom-media-text"

export type NewsletterSection = {
  hidden?: boolean
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
  customSections?: NewsletterCustomSection[]
  sidebarBlocks?: NewsletterSidebarBlock[]
  sourceTitle: string
  sourceDescription: string
  address: string
  contacts: NewsletterContact[]
  socialLinks: NewsletterContact[]
}
