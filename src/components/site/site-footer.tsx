import Link from "next/link"
import { Phone } from "lucide-react"

import { mainNav, siteConfig } from "yes@/lib/site/content"
import { SiteBrand } from "./site-brand"

const policies = [
  { href: "/politica-de-privacidade", label: "Política de Privacidade" },
  { href: "/politica-de-cookies", label: "Política de Cookies" },
  { href: "/termos-de-uso", label: "Termos de Uso" },
]

const socialIcons = {
  Facebook: (
    <svg viewBox="0 0 24 24" className="size-[18px]" aria-hidden="true">
      <path
        d="M14 8.25h2.5V5.1A10.4 10.4 0 0 0 13.6 5C10.7 5 8.75 6.77 8.75 10v1.75H6v3.55h2.75V23h3.55v-7.7h3l.5-3.55h-3.5v-1.4c0-1.03.28-2.1 1.7-2.1Z"
        fill="currentColor"
      />
    </svg>
  ),
  Instagram: (
    <svg viewBox="0 0 24 24" className="size-[18px]" aria-hidden="true">
      <path
        d="M7.75 2h8.5A5.76 5.76 0 0 1 22 7.75v8.5A5.76 5.76 0 0 1 16.25 22h-8.5A5.76 5.76 0 0 1 2 16.25v-8.5A5.76 5.76 0 0 1 7.75 2Zm0 2A3.75 3.75 0 0 0 4 7.75v8.5A3.75 3.75 0 0 0 7.75 20h8.5A3.75 3.75 0 0 0 20 16.25v-8.5A3.75 3.75 0 0 0 16.25 4h-8.5ZM12 7.35A4.65 4.65 0 1 1 12 16.65 4.65 4.65 0 0 1 12 7.35Zm0 2A2.65 2.65 0 1 0 12 14.65 2.65 2.65 0 0 0 12 9.35Zm5.18-2.54a1.09 1.09 0 1 1 0 2.18 1.09 1.09 0 0 1 0-2.18Z"
        fill="currentColor"
      />
    </svg>
  ),
  Linkedin: (
    <svg viewBox="0 0 24 24" className="size-[18px]" aria-hidden="true">
      <path
        d="M6.94 8.98H3.4V20h3.54V8.98ZM5.17 4a2.06 2.06 0 1 0 0 4.12A2.06 2.06 0 0 0 5.17 4Zm8.06 4.98H9.85V20h3.53v-5.78c0-1.52.28-2.99 2.17-2.99 1.86 0 1.88 1.74 1.88 3.08V20H21v-6.42c0-3.15-.68-5.57-4.36-5.57-1.77 0-2.96.97-3.45 1.89h-.05l.09-.92Z"
        fill="currentColor"
      />
    </svg>
  ),
}

export function SiteFooter() {
  return (
    <footer className="site-footer bg-[#336666] text-white">
      <div className="mx-auto max-w-[1400px] px-5 py-[10px] sm:px-8">
        <div className="grid gap-10 border-b border-[#184e4e] py-[50px] md:grid-cols-[1.2fr_1fr_0.75fr_0.75fr]">
          <div>
            <SiteBrand footer />
            <div className="mt-8 flex items-center gap-[15px]">
              {siteConfig.socialLinks.map((link) => {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="grid size-7 place-items-center text-[#a3a373] transition-colors hover:text-[#c4c496]"
                    target="_blank"
                    rel="noreferrer"
                    aria-label={link.label}
                  >
                    {socialIcons[link.label as keyof typeof socialIcons]}
                  </Link>
                )
              })}
            </div>
          </div>

          <div>
            <h2 className="site-footer-title">Localização</h2>
            <p className="mt-4 max-w-xs whitespace-pre-line text-base leading-7 text-white">
              Rua Copaíba – Lote 01 – Sala 819 e 820{"\n"}
              Centro Empresarial DF Century Plaza{"\n"}
              Águas Claras, Brasília – DF
            </p>

            <h2 className="site-footer-title mt-9">Contato</h2>
            <Link
              href={siteConfig.whatsappHref}
              className="mt-4 inline-flex items-center gap-3 text-base text-white transition-colors hover:text-[#a3a373]"
              target="_blank"
              rel="noreferrer"
            >
              <Phone size={14} aria-hidden />
              {siteConfig.phone}
            </Link>
          </div>

          <div>
            <h2 className="site-footer-title">Acesso Rápido</h2>
            <nav className="mt-4 grid gap-[10px]" aria-label="Acesso rápido">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-base leading-none text-white transition-colors hover:text-[#a3a373]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="site-footer-title">Políticas</h2>
            <nav className="mt-4 grid gap-[10px]" aria-label="Políticas">
              {policies.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-base leading-none text-white transition-colors hover:text-[#a3a373]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <p className="py-5 text-center text-sm text-white">
          Todos os direitos reservados – Feito por{" "}
          <Link
            href="https://riseupmarketing.com.br/"
            className="text-[#c4c496] underline-offset-4 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            RiseUp Marketing
          </Link>
        </p>
      </div>
    </footer>
  )
}
