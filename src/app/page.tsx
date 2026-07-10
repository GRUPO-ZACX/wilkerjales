import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Circle, Tablet, BookOpen } from "lucide-react"

import { SiteHero } from "yes@/components/site/site-hero"
import { SiteImage } from "yes@/components/site/site-image"
import { SiteShell } from "yes@/components/site/site-shell"
import {
  areaCards,
  getAreaCardHref,
  homeContent,
} from "yes@/lib/site/content"

export const metadata: Metadata = {
  title: "Jales & Jales Advogados Associados",
  description: "Tecnologia, conhecimento e proximidade.",
}

export default function Home() {
  return (
    <SiteShell>
      <SiteHero
        action={{ href: "#servicos", label: "Conheça nossos serviços" }}
        image={homeContent.heroImage}
        kind="home"
        title={homeContent.heroTitle}
      />

      <section className="site-section bg-white">
        <div className="site-container site-home-about-lines grid gap-12 lg:grid-cols-[45fr_55fr]">
          <div className="site-animate-left">
            <h2 className="site-heading">{homeContent.aboutTitle}</h2>
            <div className="mt-8 h-px w-full bg-[#c4c496]" />
            <p className="site-text mt-8">{homeContent.about[0]}</p>
          </div>

          <div className="site-animate-right grid content-start gap-6">
            {homeContent.about.slice(1).map((paragraph) => (
              <p className="site-text" key={paragraph}>
                {paragraph}
              </p>
            ))}
            <Link className="site-button mt-2 w-fit" href="/o-jales-e-jales-advogados">
              saiba mais
              <ArrowRight size={18} aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <section className="site-section bg-[#f3f3ea]" id="servicos">
        <div className="site-container">
          <div className="text-center">
            <h2 className="site-heading">Áreas de Atuação</h2>
            <p className="site-text mt-4">
              Para saber mais sobre nossos serviços clique na área desejada.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {areaCards.map((area, index) => (
              <Link
                className={[
                  "site-area-card group site-animate-down flex flex-col justify-between",
                  index > 4 ? "site-animate-up" : "",
                ].join(" ")}
                href={getAreaCardHref(index)}
                key={area.title}
              >
                <span>
                  <SiteImage
                    alt=""
                    className="h-[78px] w-[78px]"
                    src={area.icon}
                  />
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

      <section className="site-section relative overflow-hidden bg-white">
        <div
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-[38%] bg-contain bg-right bg-no-repeat opacity-20 lg:block"
          style={{ backgroundImage: "url(/jales-assets/bg-icon.svg)" }}
        />
        <div className="site-container relative">
          <h2 className="site-heading site-animate-up text-center">
            Nosso compromisso vai além do direito.
          </h2>

          <div className="mt-14 grid gap-12 lg:grid-cols-[60fr_40fr]">
            <div className="site-animate-left">
              <h3 className="site-serif text-[30px] text-[#a3a373]">Missão</h3>
              <p className="site-text mt-4">{homeContent.mission}</p>
              <div className="my-10 h-px bg-[#c4c496]" />
              <h3 className="site-serif text-[30px] text-[#a3a373]">Visão</h3>
              <p className="site-text mt-4">{homeContent.vision}</p>
            </div>

            <div className="site-animate-right border-l-2 border-[#a3a373] p-10 lg:p-[100px]">
              <h3 className="site-serif text-[30px] text-[#a3a373]">Valores</h3>
              <ul className="mt-6 grid gap-2">
                {homeContent.values.map((value) => (
                  <li className="flex items-start gap-3 text-black" key={value}>
                    <Circle className="mt-[10px] size-[6px] fill-current" aria-hidden />
                    <span>{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="grid bg-[#f3f3ea] lg:grid-cols-2">
        <div
          className="site-animate-left min-h-[420px] bg-cover bg-center lg:min-h-[620px]"
          style={{ backgroundImage: `url(${homeContent.helpImage})` }}
        />
        <div className="site-animate-right flex items-center px-5 py-[60px] sm:px-10 lg:px-[60px]">
          <div className="max-w-[650px]">
            <h2 className="site-heading text-[#336666]">Como podemos te ajudar</h2>
            <div className="mt-8 grid gap-6">
              {homeContent.helpText.map((paragraph) => (
                <p className="site-text" key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="site-section bg-white">
        <div className="site-container text-center">
          <h2 className="site-heading site-animate-up">Publicações</h2>
          <p className="site-text mt-4">
            Acompanhe as novidades dentre nossas áreas de atuação.
          </p>
          <Link className="site-button mt-10" href="/publicacoes">
            Leia Mais
            <ArrowRight size={18} aria-hidden />
          </Link>
        </div>
      </section>

      <section
        className="relative overflow-hidden bg-[#a3a373] text-white"
        style={{
          backgroundImage: `url(${homeContent.bookCutout})`,
          backgroundPosition: "center right",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
        }}
      >
        <div className="site-container grid min-h-[400px] items-center py-16 lg:grid-cols-[60fr_40fr]">
          <div className="max-w-[760px]">
            <h2 className="site-serif text-[42px] leading-tight text-white">
              Sou Síndico, e Agora?
            </h2>
            <h3 className="site-serif mt-3 text-[24px] text-white">
              Wilker Lucio Jales
            </h3>
            <p className="mt-6 max-w-[680px] text-white">
              Um guia prático que ajuda síndicos a diminuírem riscos e
              conduzirem uma gestão condominial mais segura, eficiente e
              transparente.
            </p>
            <h4 className="site-serif mt-7 text-[22px] text-white">
              Compre agora:
            </h4>
            <div className="mt-4 flex flex-wrap gap-4">
              <Link
                className="site-button site-button-filled"
                href={homeContent.ebookHref}
                target="_blank"
                rel="noreferrer"
              >
                <Tablet size={18} aria-hidden />
                E-book
              </Link>
              <Link
                className="site-button site-button-filled"
                href={homeContent.physicalBookHref}
                target="_blank"
                rel="noreferrer"
              >
                <BookOpen size={18} aria-hidden />
                Livro Físico
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
