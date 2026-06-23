import Link from "next/link"
import { AtSign, Globe, Link2, Mail, Phone } from "lucide-react"

import type { NewsletterContact, NewsletterTemplate } from "yes@/lib/newsletter/types"

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

  return (
    <footer className="border-t border-[#B7B783] bg-[#ECE8D8] px-5 py-6 sm:px-7 lg:px-8">
      <div className="mx-auto grid w-full max-w-[1280px] gap-5 lg:grid-cols-[180px_1fr] lg:items-start">
        <div className="min-w-0">
          <p className="text-lg font-semibold leading-none text-[#1F1F1A] [overflow-wrap:anywhere]">
            {firmName}
          </p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#244F49] [overflow-wrap:anywhere]">
            {firmDescriptor}
          </p>
        </div>

        <div className="grid gap-3">
          <div className="flex flex-wrap gap-x-5 gap-y-2 lg:justify-end">
            {newsletter.contacts.map((contact) => (
              <FooterLink
                key={contact.label}
                contact={contact}
                icon={
                  contactIcons[contact.label as keyof typeof contactIcons] ??
                  Globe
                }
              />
            ))}
          </div>
          <p className="text-xs font-medium text-[#4F5549] [overflow-wrap:anywhere] lg:text-right">
            {address}
          </p>

          <div className="flex flex-wrap gap-x-5 gap-y-2 lg:justify-end">
            {newsletter.socialLinks.map((contact) => (
              <FooterLink
                key={contact.label}
                contact={contact}
                icon={
                  socialIcons[contact.label as keyof typeof socialIcons] ??
                  Link2
                }
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
}

function FooterLink({ contact, icon: Icon }: FooterLinkProps) {
  const value = contact.value.trim() || contact.label
  const href = contact.href.trim() || "#"

  return (
    <Link
      href={href}
      className="inline-flex max-w-full items-center gap-2 text-xs font-semibold text-[#1F1F1A] transition-colors hover:text-[#244F49]"
    >
      <Icon className="size-4 shrink-0 text-[#244F49]" />
      <span className="[overflow-wrap:anywhere]">{value}</span>
    </Link>
  )
}
