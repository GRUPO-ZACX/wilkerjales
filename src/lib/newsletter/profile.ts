import type {
  NewsletterContact,
  NewsletterCta,
  NewsletterTemplate,
} from "./types"

export type NewsletterProfile = {
  address: string
  attorneyName: string
  attorneyPhotoAlt: string
  attorneyPhotoUrl: string
  attorneyPhrase: string
  attorneySpecialty: string
  contactEmail: string
  contactEmailHref: string
  contactPhone: string
  contactPhoneHref: string
  contactSite: string
  contactSiteHref: string
  ctaDescription: string
  ctaHref: string
  ctaLabel: string
  ctaTitle: string
  firmDescriptor: string
  firmLogoAlt: string
  firmLogoUrl: string
  firmName: string
  instagram: string
  instagramHref: string
  linkedIn: string
  linkedInHref: string
}

export const defaultNewsletterProfile: NewsletterProfile = {
  address: "Av. Paulista, 1000 · São Paulo, SP",
  attorneyName: "Dr. Wilker Jales",
  attorneyPhotoAlt: "Foto do advogado Wilker Jales",
  attorneyPhotoUrl: "/jales-assets/wilker-jales2.jpg",
  attorneyPhrase:
    "Informação jurídica clara, prática e segura para a gestão condominial.",
  attorneySpecialty: "Direito Imobiliário e Condominial",
  contactEmail: "contato@jalesjales.adv.br",
  contactEmailHref: "mailto:contato@jalesjales.adv.br",
  contactPhone: "61 3879-7990",
  contactPhoneHref: "tel:+556138797990",
  contactSite: "jalesadvogados.com",
  contactSiteHref: "https://jalesadvogados.com",
  ctaDescription: "Organize documentos, valide a estratégia e reduza riscos.",
  ctaHref: "https://jalesadvogados.com/contato",
  ctaLabel: "Falar com o escritório",
  ctaTitle: "Seu condomínio precisa revisar uma cobrança sensível?",
  firmDescriptor: "Advogados Associados",
  firmLogoAlt: "Jales & Jales Advogados Associados",
  firmLogoUrl: "/jales-assets/brand-jales.svg",
  firmName: "Jales & Jales",
  instagram: "@wilkerjales",
  instagramHref: "https://www.instagram.com/wilkerjales/",
  linkedIn: "Jales & Jales Advogados",
  linkedInHref: "https://linkedin.com",
}

function cleanProfileValue(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback
}

export function normalizeNewsletterProfile(
  value: Partial<NewsletterProfile> | null | undefined,
): NewsletterProfile {
  return {
    address: cleanProfileValue(
      value?.address,
      defaultNewsletterProfile.address,
    ),
    attorneyName: cleanProfileValue(
      value?.attorneyName,
      defaultNewsletterProfile.attorneyName,
    ),
    attorneyPhotoAlt: cleanProfileValue(
      value?.attorneyPhotoAlt,
      defaultNewsletterProfile.attorneyPhotoAlt,
    ),
    attorneyPhotoUrl: cleanProfileValue(
      value?.attorneyPhotoUrl,
      defaultNewsletterProfile.attorneyPhotoUrl,
    ),
    attorneyPhrase: cleanProfileValue(
      value?.attorneyPhrase,
      defaultNewsletterProfile.attorneyPhrase,
    ),
    attorneySpecialty: cleanProfileValue(
      value?.attorneySpecialty,
      defaultNewsletterProfile.attorneySpecialty,
    ),
    contactEmail: cleanProfileValue(
      value?.contactEmail,
      defaultNewsletterProfile.contactEmail,
    ),
    contactEmailHref: cleanProfileValue(
      value?.contactEmailHref,
      defaultNewsletterProfile.contactEmailHref,
    ),
    contactPhone: cleanProfileValue(
      value?.contactPhone,
      defaultNewsletterProfile.contactPhone,
    ),
    contactPhoneHref: cleanProfileValue(
      value?.contactPhoneHref,
      defaultNewsletterProfile.contactPhoneHref,
    ),
    contactSite: cleanProfileValue(
      value?.contactSite,
      defaultNewsletterProfile.contactSite,
    ),
    contactSiteHref: cleanProfileValue(
      value?.contactSiteHref,
      defaultNewsletterProfile.contactSiteHref,
    ),
    ctaDescription: cleanProfileValue(
      value?.ctaDescription,
      defaultNewsletterProfile.ctaDescription,
    ),
    ctaHref: cleanProfileValue(
      value?.ctaHref,
      defaultNewsletterProfile.ctaHref,
    ),
    ctaLabel: cleanProfileValue(
      value?.ctaLabel,
      defaultNewsletterProfile.ctaLabel,
    ),
    ctaTitle: cleanProfileValue(
      value?.ctaTitle,
      defaultNewsletterProfile.ctaTitle,
    ),
    firmDescriptor: cleanProfileValue(
      value?.firmDescriptor,
      defaultNewsletterProfile.firmDescriptor,
    ),
    firmLogoAlt: cleanProfileValue(
      value?.firmLogoAlt,
      defaultNewsletterProfile.firmLogoAlt,
    ),
    firmLogoUrl: cleanProfileValue(
      value?.firmLogoUrl,
      defaultNewsletterProfile.firmLogoUrl,
    ),
    firmName: cleanProfileValue(
      value?.firmName,
      defaultNewsletterProfile.firmName,
    ),
    instagram: cleanProfileValue(
      value?.instagram,
      defaultNewsletterProfile.instagram,
    ),
    instagramHref: cleanProfileValue(
      value?.instagramHref,
      defaultNewsletterProfile.instagramHref,
    ),
    linkedIn: cleanProfileValue(
      value?.linkedIn,
      defaultNewsletterProfile.linkedIn,
    ),
    linkedInHref: cleanProfileValue(
      value?.linkedInHref,
      defaultNewsletterProfile.linkedInHref,
    ),
  }
}

export function contactsFromNewsletterProfile(
  profile: NewsletterProfile = defaultNewsletterProfile,
): NewsletterContact[] {
  const normalizedProfile = normalizeNewsletterProfile(profile)

  return [
    {
      href: normalizedProfile.contactPhoneHref,
      label: "Telefone",
      value: normalizedProfile.contactPhone,
    },
    {
      href: normalizedProfile.contactEmailHref,
      label: "E-mail",
      value: normalizedProfile.contactEmail,
    },
    {
      href: normalizedProfile.contactSiteHref,
      label: "Site",
      value: normalizedProfile.contactSite,
    },
  ]
}

export function socialLinksFromNewsletterProfile(
  profile: NewsletterProfile = defaultNewsletterProfile,
): NewsletterContact[] {
  const normalizedProfile = normalizeNewsletterProfile(profile)

  return [
    {
      href: normalizedProfile.instagramHref,
      label: "Instagram",
      value: normalizedProfile.instagram,
    },
    {
      href: normalizedProfile.linkedInHref,
      label: "LinkedIn",
      value: normalizedProfile.linkedIn,
    },
  ]
}

export function ctaFromNewsletterProfile(
  profile: NewsletterProfile = defaultNewsletterProfile,
): NewsletterCta {
  const normalizedProfile = normalizeNewsletterProfile(profile)

  return {
    description: normalizedProfile.ctaDescription,
    href: normalizedProfile.ctaHref,
    label: normalizedProfile.ctaLabel,
    title: normalizedProfile.ctaTitle,
  }
}

function initialsFromName(name: string) {
  const initials = name
    .replace(/^(dr\.?|dra\.?)\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")

  return initials || "WJ"
}

export function applyNewsletterProfile(
  newsletter: NewsletterTemplate,
  profile: NewsletterProfile = defaultNewsletterProfile,
): NewsletterTemplate {
  const normalizedProfile = normalizeNewsletterProfile(profile)

  return {
    ...newsletter,
    attorney: {
      ...newsletter.attorney,
      initials: initialsFromName(normalizedProfile.attorneyName),
      name: normalizedProfile.attorneyName,
      photoAlt: normalizedProfile.attorneyPhotoAlt,
      photoUrl: normalizedProfile.attorneyPhotoUrl,
      phrase: normalizedProfile.attorneyPhrase,
      specialty: normalizedProfile.attorneySpecialty,
    },
    firm: {
      ...newsletter.firm,
      descriptor: normalizedProfile.firmDescriptor,
      logoAlt: normalizedProfile.firmLogoAlt,
      logoUrl: normalizedProfile.firmLogoUrl,
      name: normalizedProfile.firmName,
    },
    address: normalizedProfile.address,
    contacts: contactsFromNewsletterProfile(normalizedProfile),
    cta: ctaFromNewsletterProfile(normalizedProfile),
    socialLinks: socialLinksFromNewsletterProfile(normalizedProfile),
  }
}
