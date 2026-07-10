import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { SiteHero } from "yes@/components/site/site-hero"
import { SiteImage } from "yes@/components/site/site-image"
import { SiteShell } from "yes@/components/site/site-shell"
import {
  areaCards,
  asset,
  getAreaCardHref,
} from "yes@/lib/site/content"

export const metadata: Metadata = {
  title: "Áreas de Atuação | Jales & Jales Advogados",
  description: "Conheça nossas Áreas.",
}

export default function PracticeAreasPage() {
  return (
    <SiteShell>
      <SiteHero image={asset("areas-jales-e-jales.jpg")} title="Áreas de Atuação" />

      <section className="site-section bg-[#f3f3ea]">
        <div className="site-container">
          <div className="text-center">
            <h2 className="site-heading">Conheça nossas Áreas</h2>
            <p className="site-text mt-4">
              Para saber mais sobre nossos serviços clique na área desejada.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {areaCards.map((area, index) => (
              <Link
                className="site-area-card group site-animate-up flex flex-col justify-between"
                href={getAreaCardHref(index)}
                key={area.title}
              >
                <span>
                  <SiteImage alt="" className="h-[78px] w-[78px]" src={area.icon} />
                  <span className="site-serif mt-8 block text-[30px] leading-tight text-white">
                    {area.title}
                  </span>
                </span>
                <ArrowRight
                  className="mt-8 text-white transition-colors group-hover:text-[#c4c496]"
                  size={34}
                  aria-hidden
                />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
