"use client"

import { useEffect, useId, useState } from "react"
import { ArrowRight, X } from "lucide-react"

import type { TeamMember } from "yes@/lib/site/content"
import { SiteImage } from "./site-image"

type TeamGridProps = {
  members: TeamMember[]
}

export function TeamGrid({ members }: TeamGridProps) {
  const [activeMember, setActiveMember] = useState<TeamMember | null>(null)
  const titleId = useId()

  useEffect(() => {
    if (!activeMember) {
      return
    }

    const previousOverflow = document.body.style.overflow
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveMember(null)
      }
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [activeMember])

  const activeProfile = activeMember?.profile

  return (
    <>
      <div className="mt-12 grid gap-[50px] sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <article className="site-team-card site-animate-up" key={member.name}>
            {member.profile ? (
              <button
                type="button"
                className="block w-full text-left"
                aria-label={`Abrir perfil de ${member.name}`}
                onClick={() => setActiveMember(member)}
              >
                <TeamCardContent member={member} />
              </button>
            ) : (
              <TeamCardContent member={member} />
            )}
          </article>
        ))}
      </div>

      {activeMember && activeProfile ? (
        <div
          className="site-modal-backdrop"
          role="presentation"
          onClick={() => setActiveMember(null)}
        >
          <section
            aria-labelledby={titleId}
            aria-modal="true"
            className="site-team-modal"
            role="dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="site-modal-close"
              aria-label="Fechar perfil"
              onClick={() => setActiveMember(null)}
            >
              <X size={22} aria-hidden />
            </button>

            <h2 id={titleId} className="site-serif text-[42px] leading-tight text-[#a3a373]">
              {activeProfile.title}
            </h2>
            <h3 className="mt-3 text-[22px] font-medium leading-snug text-[#336666]">
              {activeProfile.subtitle}
            </h3>
            <div className="mt-8 grid gap-5">
              {activeProfile.paragraphs.map((paragraph) => (
                <p className="text-base font-light leading-7 text-black" key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        </div>
      ) : null}
    </>
  )
}

function TeamCardContent({ member }: { member: TeamMember }) {
  return (
    <>
      <div className="site-team-photo">
        <SiteImage alt={member.name} src={member.image} />
      </div>
      <div className="site-team-copy">
        <h3 className="site-serif site-team-name">{member.name}</h3>
        <p className="site-team-role">{member.role}</p>
        {member.profile ? (
          <span className="site-team-arrow" aria-hidden>
            <ArrowRight size={32} />
          </span>
        ) : null}
      </div>
    </>
  )
}
