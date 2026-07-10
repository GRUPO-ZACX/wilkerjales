import { SiteHero } from "./site-hero"
import { SiteShell } from "./site-shell"
import { asset } from "yes@/lib/site/content"

type LegalContentPageProps = {
  title: string
  description: string
  paragraphs: string[]
}

export function LegalContentPage({
  description,
  paragraphs,
  title,
}: LegalContentPageProps) {
  return (
    <SiteShell>
      <SiteHero
        image={asset("hero-politica-de-privacidade.jpg")}
        subtitle={description}
        title={title}
      />

      <section className="site-section bg-white">
        <div className="mx-auto max-w-4xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-5">
            {paragraphs.map((paragraph) => (
              <p className="site-text" key={paragraph}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
