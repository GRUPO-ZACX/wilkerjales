import Link from "next/link"
import { MessageCircle } from "lucide-react"

import { siteConfig } from "yes@/lib/site/content"

export function SiteWhatsApp() {
  return (
    <Link
      aria-label="Abrir bate-papo no WhatsApp"
      className="site-whatsapp-button"
      href={siteConfig.whatsappHref}
      target="_blank"
      rel="noreferrer"
    >
      <MessageCircle size={24} aria-hidden />
      <span className="site-whatsapp-label">
        <strong>WhatsApp</strong>
        <span>Abrir bate-papo</span>
      </span>
    </Link>
  )
}
