import type { Metadata } from "next"
import Link from "next/link"
import { MapPin, Phone } from "lucide-react"

import { SiteHero } from "yes@/components/site/site-hero"
import { SiteShell } from "yes@/components/site/site-shell"
import { contactPage, siteConfig } from "yes@/lib/site/content"

export const metadata: Metadata = {
  title: "Contato | Jales & Jales Advogados",
  description: "Fale conosco.",
}

export default function ContactPage() {
  return (
    <SiteShell>
      <SiteHero image={contactPage.heroImage} title="Contato" />

      <section className="site-section bg-white">
        <div className="site-container grid gap-12 lg:grid-cols-[45fr_55fr] lg:items-start">
          <div>
            <h2 className="site-heading">Fale conosco</h2>
            <h3 className="site-serif mt-5 text-[30px] leading-tight text-[#a3a373]">
              Advogados experientes para resolver o seu caso.
            </h3>
            <p className="site-text mt-6">
              Agende uma reunião com um membro de nossa equipe através do botão
              do WhatsApp.
            </p>
            <Link
              className="site-button mt-8"
              href={siteConfig.whatsappHref}
              target="_blank"
              rel="noreferrer"
            >
              <Phone size={18} aria-hidden />
              WhatsApp
            </Link>
            <Link
              className="mt-8 flex w-fit items-center gap-4 text-[#336666] transition-colors hover:text-[#a3a373]"
              href={siteConfig.whatsappHref}
              target="_blank"
              rel="noreferrer"
            >
              <Phone className="size-6 shrink-0" aria-hidden />
              <span className="text-[20px] font-light">{siteConfig.phone}</span>
            </Link>
          </div>

          <div className="bg-[#f3f3ea] p-8 lg:p-12">
            <h2 className="site-heading text-[#336666]">Nossa Localização</h2>
            <p className="site-text mt-6 flex gap-4">
              <MapPin className="mt-1 size-7 shrink-0 text-[#a3a373]" aria-hidden />
              <span>{siteConfig.address}</span>
            </p>
            <p className="site-text mt-6 flex gap-4">
              <Phone className="mt-1 size-7 shrink-0 text-[#a3a373]" aria-hidden />
              <Link href={siteConfig.whatsappHref} target="_blank" rel="noreferrer">
                {siteConfig.phone}
              </Link>
            </p>
            <iframe
              className="mt-8 h-[320px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=Rua%20Copa%C3%ADba%20Lote%2001%20Sala%20819%20DF%20Century%20Plaza%20%C3%81guas%20Claras%20Bras%C3%ADlia%20DF&output=embed"
              title="Mapa da localização do Jales & Jales Advogados"
            />
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
