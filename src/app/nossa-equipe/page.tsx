import type { Metadata } from "next"

import { SiteHero } from "yes@/components/site/site-hero"
import { SiteShell } from "yes@/components/site/site-shell"
import { TeamGrid } from "yes@/components/site/team-grid"
import { teamMembers, teamPage } from "yes@/lib/site/content"

export const metadata: Metadata = {
  title: "Nossa Equipe | Jales & Jales Advogados",
  description: "Equipe Jales & Jales Advogados.",
}

export default function TeamPage() {
  return (
    <SiteShell>
      <SiteHero image={teamPage.heroImage} title="Nossa Equipe" />

      <section className="bg-white py-[80px]">
        <div className="site-container">
          <h2 className="site-heading text-center">Advogados</h2>
          <TeamGrid members={teamMembers} />
        </div>
      </section>
    </SiteShell>
  )
}
