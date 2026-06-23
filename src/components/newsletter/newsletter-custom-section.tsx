import Link from "next/link"
import { ArrowRight, Image as ImageSymbol } from "lucide-react"

import {
  getNewsletterTextStyle,
  newsletterTextStyleClassName,
  newsletterTextStyleCss,
} from "yes@/lib/newsletter/text-style"
import type {
  NewsletterCustomSection as NewsletterCustomSectionType,
  RichTextSegment,
  NewsletterTemplate,
} from "yes@/lib/newsletter/types"
import { cn } from "yes@/lib/utils"

type NewsletterCustomSectionProps = {
  customSection: NewsletterCustomSectionType
  newsletter: NewsletterTemplate
}

export function NewsletterCustomSection({
  customSection,
  newsletter,
}: NewsletterCustomSectionProps) {
  if (customSection.type === "custom-image") {
    const caption = customSection.caption.trim()
    const captionStyle = getNewsletterTextStyle(
      newsletter,
      `customSections.${customSection.id}.caption`
    )

    return (
      <section className="border border-[#B7B783]/80 bg-white p-4">
        <div className="flex aspect-[16/9] min-h-56 items-center justify-center overflow-hidden bg-[#ECE8D8]">
          {customSection.imageUrl ? (
            <div
              aria-label={customSection.imageAlt ?? "Imagem do informativo"}
              className="h-full w-full bg-cover bg-center"
              role="img"
              style={{ backgroundImage: `url(${customSection.imageUrl})` }}
            />
          ) : (
            <div className="grid gap-3 text-center text-[#244F49]">
              <ImageSymbol className="mx-auto size-10" />
              <p className="text-sm font-semibold">Imagem do informativo</p>
            </div>
          )}
        </div>
        {caption && (
          <p
            className={cn(
              "mt-3 text-xs leading-6 text-[#404038] [overflow-wrap:anywhere]",
              newsletterTextStyleClassName(captionStyle)
            )}
            style={newsletterTextStyleCss(captionStyle)}
          >
            {caption}
          </p>
        )}
      </section>
    )
  }

  if (customSection.type === "custom-button") {
    const title = customSection.title.trim() || "Chamada"
    const description = customSection.description.trim()
    const label = customSection.label.trim() || "Abrir link"
    const href = customSection.href.trim() || "#"
    const titleStyle = getNewsletterTextStyle(
      newsletter,
      `customSections.${customSection.id}.title`
    )
    const descriptionStyle = getNewsletterTextStyle(
      newsletter,
      `customSections.${customSection.id}.description`
    )
    const labelStyle = getNewsletterTextStyle(
      newsletter,
      `customSections.${customSection.id}.label`
    )

    return (
      <section className="border border-[#B7B783] bg-white p-6 sm:p-7">
        <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="min-w-0">
            <h2
              className={cn(
                "text-2xl font-semibold leading-tight text-[#163B35] [overflow-wrap:anywhere]",
                newsletterTextStyleClassName(titleStyle)
              )}
              style={newsletterTextStyleCss(titleStyle)}
            >
              {title}
            </h2>
            {description && (
              <p
                className={cn(
                  "mt-3 max-w-2xl text-sm leading-6 text-[#404038] [overflow-wrap:anywhere]",
                  newsletterTextStyleClassName(descriptionStyle)
                )}
                style={newsletterTextStyleCss(descriptionStyle)}
              >
                {description}
              </p>
            )}
          </div>

          <Link
            className="inline-flex w-fit max-w-full items-center gap-2 rounded-sm bg-[#244F49] px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#F7F5EE] transition-colors hover:bg-[#163B35]"
            href={href}
          >
            <span
              className={cn(
                "[overflow-wrap:anywhere]",
                newsletterTextStyleClassName(labelStyle)
              )}
              style={newsletterTextStyleCss(labelStyle)}
            >
              {label}
            </span>
            <ArrowRight className="size-4 shrink-0" />
          </Link>
        </div>
      </section>
    )
  }

  const title = customSection.title.trim() || "Seção"
  const titleStyle = getNewsletterTextStyle(
    newsletter,
    `customSections.${customSection.id}.title`
  )
  const bodyStyle = getNewsletterTextStyle(
    newsletter,
    `customSections.${customSection.id}.body`
  )
  const body = customSection.body.some((segment) => segment.text.trim())
    ? customSection.body
    : [{ text: "Texto do informativo." }]

  return (
    <section className="grid grid-cols-[5px_minmax(0,1fr)] gap-5">
      <div className="bg-[#244F49]" />
      <div className="min-w-0 pb-1">
        <h2
          className={cn(
            "max-w-2xl text-[32px] font-semibold leading-tight tracking-[-0.02em] text-[#1F1F1A] [overflow-wrap:anywhere]",
            newsletterTextStyleClassName(titleStyle)
          )}
          style={newsletterTextStyleCss(titleStyle)}
        >
          {title}
        </h2>
        <p
          className={cn(
            "mt-5 text-[16px] leading-8 text-[#404038] [overflow-wrap:anywhere]",
            newsletterTextStyleClassName(bodyStyle)
          )}
          style={newsletterTextStyleCss(bodyStyle)}
        >
          {body.map((segment, index) => renderSegment(segment, index))}
        </p>
      </div>
    </section>
  )
}

function renderSegment(segment: RichTextSegment, index: number) {
  let content = <>{segment.text}</>

  if (segment.bold) {
    content = <strong>{content}</strong>
  }

  if (segment.italic) {
    content = <em>{content}</em>
  }

  if (segment.underline) {
    content = <u>{content}</u>
  }

  if (segment.href) {
    content = (
      <a
        className="font-semibold text-[#244F49] underline decoration-[#B7B783] underline-offset-4"
        href={segment.href}
        rel="noopener noreferrer"
        target="_blank"
      >
        {content}
      </a>
    )
  }

  return (
    <span
      key={`${segment.text}-${index}`}
      style={segment.color ? { color: segment.color } : undefined}
    >
      {content}
    </span>
  )
}
