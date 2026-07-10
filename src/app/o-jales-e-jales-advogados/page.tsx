import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { SiteHero } from "yes@/components/site/site-hero"
import { SiteImage } from "yes@/components/site/site-image"
import { SiteShell } from "yes@/components/site/site-shell"
import { aboutPage } from "yes@/lib/site/content"

export const metadata: Metadata = {
  title: "Quem Somos | Jales & Jales Advogados",
  description: "O Jales e Jales Advogados.",
}

export default function AboutPage() {
  return (
    <SiteShell>
      <SiteHero image={aboutPage.heroImage} title="Quem Somos" />

      <section className="site-section bg-white">
        <div className="site-container grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="site-animate-left">
            <h2 className="site-heading">Jales Advogados</h2>
            <div className="mt-8 grid gap-5">
              {aboutPage.paragraphs.map((paragraph) => (
                <p className="site-text" key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <SiteImage
            alt="Escritório Jales e Jales"
            className="site-animate-right h-[460px] w-full object-cover lg:h-[640px]"
            src={aboutPage.image}
          />
        </div>
      </section>

      <section className="bg-[#c4c496] py-[50px]">
        <div className="site-container grid gap-10 lg:grid-cols-[40fr_60fr] lg:items-center">
          <div>
            <h2 className="site-heading text-white">Nossa Equipe</h2>
            <Link className="site-button site-button-light mt-8" href="/nossa-equipe">
              conheça o time
              <ArrowRight size={18} aria-hidden />
            </Link>
          </div>
          <p className="site-text">{aboutPage.teamText}</p>
        </div>
      </section>

      <section className="site-section bg-[#f3f3ea]">
        <div className="site-container">
          <h2 className="site-heading text-center">Nossos diferenciais</h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {aboutPage.differentials.map((item) => (
              <article
                className="site-area-card site-animate-up flex min-h-[300px] flex-col justify-between"
                key={item.title}
              >
                <SiteImage alt="" className="h-[78px] w-[78px]" src={item.icon} />
                <div className="mt-8">
                  <h3 className="site-serif text-[30px] leading-tight text-white">
                    {item.title}
                  </h3>
                  {item.description ? (
                    <p className="mt-4 text-base font-light leading-7 text-white">
                      {item.description}
                    </p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="grid bg-[#f3f3ea] lg:grid-cols-2">
        <SiteImage
          alt="Responsabilidade social"
          className="h-[500px] w-full object-cover lg:h-auto lg:min-h-[500px]"
          src={aboutPage.responsibilityImage}
        />
        <div className="flex items-center px-5 py-[70px] sm:px-10 lg:px-[60px]">
          <div>
            <h2 className="site-heading text-[#336666]">Responsabilidade social</h2>
            <div className="mt-8 grid gap-5">
              {aboutPage.responsibility.map((paragraph) => (
                <p className="site-text" key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
