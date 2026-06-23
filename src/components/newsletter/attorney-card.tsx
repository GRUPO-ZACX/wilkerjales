import { Quote } from "lucide-react"

import {
  getNewsletterTextStyle,
  newsletterTextStyleClassName,
  newsletterTextStyleCss,
} from "yes@/lib/newsletter/text-style"
import type { NewsletterTemplate } from "yes@/lib/newsletter/types"
import { cn } from "yes@/lib/utils"

type AttorneyCardProps = {
  newsletter: NewsletterTemplate
}

export function AttorneyCard({ newsletter }: AttorneyCardProps) {
  const attorney = newsletter.attorney
  const name = attorney.name.trim() || "Nome do advogado"
  const specialty = attorney.specialty.trim() || "Área de atuação"
  const phrase =
    attorney.phrase.trim() ||
    "Frase profissional para contextualizar o atendimento."
  const initials = attorney.initials.trim() || "JJ"
  const nameStyle = getNewsletterTextStyle(newsletter, "attorney.name")
  const specialtyStyle = getNewsletterTextStyle(
    newsletter,
    "attorney.specialty"
  )
  const phraseStyle = getNewsletterTextStyle(newsletter, "attorney.phrase")

  return (
    <aside className="h-fit border border-[#B7B783] bg-white shadow-[0_14px_35px_rgba(22,59,53,0.08)]">
      <div className="flex aspect-[16/11] items-center justify-center bg-[#E8E4D4] p-4">
        <div className="flex h-full w-full items-center justify-center overflow-hidden border border-[#B7B783] bg-[#F7F5EE]/70">
          {attorney.photoUrl ? (
            <div
              aria-label={attorney.photoAlt ?? name}
              className="h-full w-full bg-cover bg-center"
              role="img"
              style={{ backgroundImage: `url(${attorney.photoUrl})` }}
            />
          ) : (
            <div className="grid size-24 place-items-center rounded-full border border-[#B7B783] bg-[#F7F5EE] text-3xl font-semibold text-[#244F49] shadow-[0_0_0_9px_rgba(183,183,131,0.18)]">
              {initials}
            </div>
          )}
        </div>
      </div>

      <div className="px-5 py-5">
        <h2
          className={cn(
            "text-2xl font-semibold leading-tight tracking-[-0.02em] text-[#1F1F1A] [overflow-wrap:anywhere]",
            newsletterTextStyleClassName(nameStyle)
          )}
          style={newsletterTextStyleCss(nameStyle)}
        >
          {name}
        </h2>
        <p
          className={cn(
            "mt-2 text-sm font-semibold uppercase tracking-[0.12em] text-[#244F49] [overflow-wrap:anywhere]",
            newsletterTextStyleClassName(specialtyStyle)
          )}
          style={newsletterTextStyleCss(specialtyStyle)}
        >
          {specialty}
        </p>
        <div className="mt-5 border-t border-[#B7B783] pt-4">
          <Quote className="size-5 text-[#B7B783]" />
          <p
            className={cn(
              "mt-3 text-[17px] font-medium leading-7 text-[#163B35] [overflow-wrap:anywhere]",
              newsletterTextStyleClassName(phraseStyle)
            )}
            style={newsletterTextStyleCss(phraseStyle)}
          >
            {phrase}
          </p>
        </div>
      </div>
    </aside>
  )
}
