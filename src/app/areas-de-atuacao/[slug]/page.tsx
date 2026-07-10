import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight } from "lucide-react"

import { SiteHero } from "yes@/components/site/site-hero"
import { SiteImage } from "yes@/components/site/site-image"
import { SiteShell } from "yes@/components/site/site-shell"
import {
  asset,
  getPracticeArea,
  practiceAreas,
  siteConfig,
} from "yes@/lib/site/content"

type PracticeAreaPageProps = {
  params: Promise<{
    slug: string
  }>
}

export function generateStaticParams() {
  return practiceAreas.map((area) => ({
    slug: area.slug,
  }))
}

export async function generateMetadata({
  params,
}: PracticeAreaPageProps): Promise<Metadata> {
  const { slug } = await params
  const area = getPracticeArea(slug)

  return {
    title: area
      ? `${area.title} | Jales & Jales Advogados`
      : "Área de Atuação | Jales & Jales Advogados",
    description: area?.subtitle,
  }
}

export default async function PracticeAreaPage({ params }: PracticeAreaPageProps) {
  const { slug } = await params
  const area = getPracticeArea(slug)

  if (!area) {
    notFound()
  }

  const isCondo = area.slug === "advocacia-especializada-em-direito-condominial"

  return (
    <SiteShell>
      <SiteHero image={area.heroImage} subtitle={area.subtitle} title={area.title} />

      <section className="site-section bg-white">
        <div className="site-container grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="site-animate-left">
            <h2 className="site-heading">{area.shortTitle}</h2>
            <div className="mt-8 grid gap-5">
              {area.intro.map((paragraph) => (
                <p className="site-text" key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>
            <Link
              className="site-button mt-8"
              href={siteConfig.whatsappHref}
              target="_blank"
              rel="noreferrer"
            >
              Fale Conosco
              <ArrowRight size={18} aria-hidden />
            </Link>
          </div>

          {area.featureImage ? (
            <SiteImage
              alt={area.shortTitle}
              className="site-animate-right h-full min-h-[460px] w-full object-cover"
              src={area.featureImage}
            />
          ) : (
            <div className="site-animate-right flex justify-center">
              <SiteImage alt="" className="h-[260px] w-[260px]" src={area.icon} />
            </div>
          )}
        </div>
      </section>

      <section className="site-section bg-[#f3f3ea]">
        <div className="site-container">
          <div className="mx-auto max-w-[850px] text-center">
            <h2 className="site-heading">O que fazemos</h2>
            <p className="site-text mt-5">{area.workIntro}</p>
            <p className="site-text mt-4">Confira nossos principais serviços:</p>
          </div>

          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {area.services.map((service) => (
              <article
                className="site-area-card site-animate-up flex min-h-[220px] flex-col justify-between"
                key={service.title}
              >
                <SiteImage alt="" className="h-[78px] w-[78px]" src={service.icon} />
                <h3 className="site-serif mt-7 text-[24px] leading-tight text-white">
                  {service.title}
                </h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      {isCondo ? (
        <section className="site-section bg-white">
          <div className="site-container grid gap-12 lg:grid-cols-[40fr_60fr] lg:items-center">
            <SiteImage
              alt="Wilker Jales, autor do livro Sou Síndico, e Agora?"
              className="h-full min-h-[600px] w-full object-cover"
              src={asset("wilker-jales-autor-do-livro-sou-sindico-e-agora.jpg")}
            />
            <div>
              <h2 className="site-heading">Fale com quem entende do assunto!​</h2>
              <div className="mt-8 grid gap-5">
                <p className="site-text">
                  Wilker Lucio Jales, sócio-fundador da Jales Advogados
                  Associados, é autor do livro “Sou Síndico, e Agora?” , obra
                  reconhecida como guia prático para gestores condominiais em
                  todo o país, alia profundo conhecimento jurídico a uma
                  abordagem clara e acessível, ajudando clientes a compreender
                  responsabilidades e implementar estratégias eficazes de
                  governança.
                </p>
                <p className="site-text">
                  Com ampla experiência em assembleias condominiais, mediação de
                  conflitos e elaboração de documentos institucionais, sua
                  atuação é pautada pela busca constante de segurança jurídica,
                  transparência e resultados sustentáveis para condomínios e
                  empresas.
                </p>
              </div>
              <Link
                className="site-button mt-8"
                href={siteConfig.whatsappHref}
                target="_blank"
                rel="noreferrer"
              >
                solicite atendimento agora
                <ArrowRight size={18} aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <section
        id="atendimento"
        className="bg-cover bg-center py-[100px] text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${asset("hero-home.jpg")})`,
        }}
      >
        <div className="site-container text-center">
          <h2 className="site-serif mx-auto max-w-[980px] text-[42px] leading-tight text-white">
            Para saber mais, agende uma reunião com um advogado do nosso
            escritório.
          </h2>
          <Link
            className="mt-9 inline-flex items-center gap-3 border-2 border-[#c4c496] px-[25px] py-[20px] text-base uppercase text-white transition-colors hover:bg-[#c4c496] hover:text-black"
            href={siteConfig.whatsappHref}
            target="_blank"
            rel="noreferrer"
          >
            agende uma reunião
            <ArrowRight size={18} aria-hidden />
          </Link>
        </div>
      </section>
    </SiteShell>
  )
}
