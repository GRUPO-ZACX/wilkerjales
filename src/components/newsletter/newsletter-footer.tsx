import Link from "next/link"
import { AtSign, Globe, Link2, Mail, Phone } from "lucide-react"

import {
  getNewsletterTextStyle,
  newsletterTextStyleClassName,
  newsletterTextStyleCss,
} from "yes@/lib/newsletter/text-style"
import type {
  NewsletterContact,
  NewsletterTemplate,
  NewsletterTextStyle,
} from "yes@/lib/newsletter/types"
import { cn } from "yes@/lib/utils"

type NewsletterFooterProps = {
  newsletter: NewsletterTemplate
}

const contactIcons = {
  Telefone: Phone,
  "E-mail": Mail,
  Site: Globe,
}

const socialIcons = {
  Instagram: AtSign,
  LinkedIn: Link2,
}

export function NewsletterFooter({ newsletter }: NewsletterFooterProps) {
  const firmName = newsletter.firm.name.trim() || "Nome do escritório"
  const firmDescriptor =
    newsletter.firm.descriptor.trim() || "Advogados Associados"
  const address = newsletter.address.trim() || "Endereço institucional"
  const firmNameStyle = getNewsletterTextStyle(newsletter, "firm.name.footer")
  const descriptorStyle = getNewsletterTextStyle(
    newsletter,
    "firm.descriptor.footer"
  )
  const addressStyle = getNewsletterTextStyle(newsletter, "address")

  return (
    <footer className="border-t border-[#B7B783] bg-[#ECE8D8] px-5 py-6 sm:px-7 lg:px-8">
      <div className="mx-auto grid w-full max-w-[1280px] gap-5 lg:grid-cols-[180px_1fr] lg:items-start">
        <div className="min-w-0">
          <p
            className={cn(
              "text-lg font-semibold leading-none text-[#1F1F1A] [overflow-wrap:anywhere]",
              newsletterTextStyleClassName(firmNameStyle)
            )}
            style={newsletterTextStyleCss(firmNameStyle)}
          >
            {firmName}
          </p>
          <p
            className={cn(
              "mt-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#244F49] [overflow-wrap:anywhere]",
              newsletterTextStyleClassName(descriptorStyle)
            )}
            style={newsletterTextStyleCss(descriptorStyle)}
          >
            {firmDescriptor}
          </p>
        </div>

        <div className="grid gap-3">
          <div className="flex flex-wrap gap-x-5 gap-y-2 lg:justify-end">
            {newsletter.contacts.map((contact, index) => (
              <FooterLink
                key={contact.label}
                contact={contact}
                icon={
                  contactIcons[contact.label as keyof typeof contactIcons] ??
                  Globe
                }
                textStyle={getNewsletterTextStyle(
                  newsletter,
                  `contacts.${index}.value`
                )}
              />
            ))}
          </div>
          <p
            className={cn(
              "text-xs font-medium text-[#4F5549] [overflow-wrap:anywhere] lg:text-right",
              newsletterTextStyleClassName(addressStyle)
            )}
            style={newsletterTextStyleCss(addressStyle)}
          >
            {address}
          </p>

          <div className="flex flex-wrap gap-x-5 gap-y-2 lg:justify-end">
            {newsletter.socialLinks.map((contact, index) => (
              <FooterLink
                key={contact.label}
                contact={contact}
                icon={
                  socialIcons[contact.label as keyof typeof socialIcons] ??
                  Link2
                }
                textStyle={getNewsletterTextStyle(
                  newsletter,
                  `socialLinks.${index}.value`
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

type FooterLinkProps = {
  contact: NewsletterContact
  icon: typeof Phone
  textStyle?: NewsletterTextStyle
}

function FooterLink({ contact, icon: Icon, textStyle }: FooterLinkProps) {
  const value = contact.value.trim() || contact.label
  const href = contact.href.trim() || "#"

  return (
    <Link
      className={cn(
        "inline-flex max-w-full items-center gap-2 text-xs font-semibold text-[#1F1F1A] transition-colors hover:text-[#244F49]",
        newsletterTextStyleClassName(textStyle)
      )}
      href={href}
      style={newsletterTextStyleCss(textStyle)}
    >
      <Icon className="size-4 shrink-0 text-[#244F49]" />
      <span className="[overflow-wrap:anywhere]">{value}</span>
    </Link>
  )
}
