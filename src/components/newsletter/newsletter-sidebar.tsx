import { Image as ImageSymbol } from "lucide-react"

import {
  getNewsletterTextStyle,
  newsletterTextStyleClassName,
  newsletterTextStyleCss,
} from "yes@/lib/newsletter/text-style"
import type {
  NewsletterMode,
  NewsletterSidebarBlock,
  NewsletterTemplate,
  RichTextSegment,
} from "yes@/lib/newsletter/types"
import { cn } from "yes@/lib/utils"

import { AttorneyCard } from "./attorney-card"
import { NewsletterSource } from "./newsletter-source"

type NewsletterSidebarProps = {
  newsletter: NewsletterTemplate
  mode: NewsletterMode
}

export function NewsletterSidebar({
  newsletter,
  mode,
}: NewsletterSidebarProps) {
  const blocks = newsletter.sidebarBlocks ?? defaultSidebarBlocks()

  return (
    <aside
      className={cn(
        "space-y-6 lg:border-l lg:border-[#B7B783]/60 lg:pl-8",
        mode !== "print" && "lg:sticky lg:top-8 lg:self-start"
      )}
    >
      {blocks.map((block) => (
        <NewsletterSidebarBlock
          key={block.id}
          block={block}
          newsletter={newsletter}
        />
      ))}
    </aside>
  )
}

type NewsletterSidebarBlockProps = {
  block: NewsletterSidebarBlock
  newsletter: NewsletterTemplate
}

function NewsletterSidebarBlock({
  block,
  newsletter,
}: NewsletterSidebarBlockProps) {
  if (block.type === "summary") {
    const text =
      block.text.trim() ||
      "Síntese objetiva do informativo."
    const textStyle = getNewsletterTextStyle(
      newsletter,
      `sidebarBlocks.${block.id}.text`
    )

    return (
      <section className="border border-[#B7B783] bg-white p-6 shadow-[inset_0_4px_0_#244F49]">
        <p
          className={cn(
            "text-[16px] leading-8 text-[#303029] [overflow-wrap:anywhere]",
            newsletterTextStyleClassName(textStyle)
          )}
          style={newsletterTextStyleCss(textStyle)}
        >
          {text}
        </p>
      </section>
    )
  }

  if (block.type === "metadata") {
    return <NewsletterSidebarMetadata newsletter={newsletter} />
  }

  if (block.type === "attorney") {
    return <AttorneyCard newsletter={newsletter} />
  }

  if (block.type === "source") {
    return <NewsletterSource newsletter={newsletter} />
  }

  if (block.type === "sidebar-image") {
    const caption = block.caption.trim()
    const captionStyle = getNewsletterTextStyle(
      newsletter,
      `sidebarBlocks.${block.id}.caption`
    )

    return (
      <section className="border border-[#B7B783]/80 bg-white p-4">
        <SidebarImage
          imageAlt={block.imageAlt}
          imageUrl={block.imageUrl}
        />
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

  if (block.type === "sidebar-media-text") {
    const title = block.title.trim() || "Imagem com texto"
    const body = block.body.some((segment) => segment.text.trim())
      ? block.body
      : [{ text: "Texto lateral." }]
    const titleStyle = getNewsletterTextStyle(
      newsletter,
      `sidebarBlocks.${block.id}.title`
    )
    const bodyStyle = getNewsletterTextStyle(
      newsletter,
      `sidebarBlocks.${block.id}.body`
    )

    return (
      <section className="border border-[#B7B783]/80 bg-white p-4">
        <SidebarImage
          imageAlt={block.imageAlt}
          imageUrl={block.imageUrl}
        />
        <h3
          className={cn(
            "mt-4 text-xl font-semibold leading-tight text-[#1F1F1A] [overflow-wrap:anywhere]",
            newsletterTextStyleClassName(titleStyle)
          )}
          style={newsletterTextStyleCss(titleStyle)}
        >
          {title}
        </h3>
        <p
          className={cn(
            "mt-3 text-sm leading-7 text-[#404038] [overflow-wrap:anywhere]",
            newsletterTextStyleClassName(bodyStyle)
          )}
          style={newsletterTextStyleCss(bodyStyle)}
        >
          {body.map((segment, index) => renderSegment(segment, index))}
        </p>
      </section>
    )
  }

  const title = block.title.trim() || "Bloco lateral"
  const body = block.body.some((segment) => segment.text.trim())
    ? block.body
    : [{ text: "Texto lateral." }]
  const titleStyle = getNewsletterTextStyle(
    newsletter,
    `sidebarBlocks.${block.id}.title`
  )
  const bodyStyle = getNewsletterTextStyle(
    newsletter,
    `sidebarBlocks.${block.id}.body`
  )

  return (
    <section className="border border-[#B7B783]/80 bg-white p-6">
      <h3
        className={cn(
          "text-xl font-semibold leading-tight text-[#1F1F1A] [overflow-wrap:anywhere]",
          newsletterTextStyleClassName(titleStyle)
        )}
        style={newsletterTextStyleCss(titleStyle)}
      >
        {title}
      </h3>
      <p
        className={cn(
          "mt-3 text-sm leading-7 text-[#404038] [overflow-wrap:anywhere]",
          newsletterTextStyleClassName(bodyStyle)
        )}
        style={newsletterTextStyleCss(bodyStyle)}
      >
        {body.map((segment, index) => renderSegment(segment, index))}
      </p>
    </section>
  )
}

function NewsletterSidebarMetadata({
  newsletter,
}: {
  newsletter: NewsletterTemplate
}) {
  const collection = newsletter.header.collection.trim() || "Coleção"
  const period = newsletter.header.period.trim() || "Período"
  const category = newsletter.category.trim() || "Tema jurídico"

  return (
    <section className="border border-[#B7B783]/80 bg-[#ECE8D8] p-6">
      <dl className="grid gap-3 text-sm">
        <SidebarMetaRow label="Coleção" value={collection} />
        <SidebarMetaRow label="Período" value={period} />
        <SidebarMetaRow label="Tema" isLast value={category} />
      </dl>
    </section>
  )
}

function SidebarMetaRow({
  isLast = false,
  label,
  value,
}: {
  isLast?: boolean
  label: string
  value: string
}) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4",
        !isLast && "border-b border-[#B7B783]/70 pb-3"
      )}
    >
      <dt className="font-semibold uppercase tracking-[0.14em] text-[#6D714C]">
        {label}
      </dt>
      <dd className="min-w-0 text-right font-semibold text-[#1F1F1A] [overflow-wrap:anywhere]">
        {value}
      </dd>
    </div>
  )
}

function SidebarImage({
  imageAlt,
  imageUrl,
}: {
  imageAlt?: string
  imageUrl?: string
}) {
  return (
    <div className="flex aspect-[4/3] min-h-48 items-center justify-center overflow-hidden bg-[#ECE8D8]">
      {imageUrl ? (
        <div
          aria-label={imageAlt ?? "Imagem lateral"}
          className="h-full w-full bg-cover bg-center"
          role="img"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      ) : (
        <div className="grid gap-3 text-center text-[#244F49]">
          <ImageSymbol className="mx-auto size-9" />
          <p className="text-sm font-semibold">Imagem lateral</p>
        </div>
      )}
    </div>
  )
}

function renderSegment(segment: RichTextSegment, index: number) {
  const style = segment.color ? { color: segment.color } : undefined
  const className = cn(
    segment.bold && "font-semibold",
    segment.italic && "italic",
    segment.underline && "underline underline-offset-4"
  )
  const content = (
    <span key={index} className={className} style={style}>
      {segment.text}
    </span>
  )

  if (!segment.href) {
    return content
  }

  return (
    <a
      key={index}
      className={cn("font-semibold text-[#244F49] underline underline-offset-4", className)}
      href={segment.href}
      rel="noopener noreferrer"
      style={style}
      target="_blank"
    >
      {segment.text}
    </a>
  )
}

function defaultSidebarBlocks(): NewsletterSidebarBlock[] {
  return [
    {
      id: "sidebar-summary",
      text: "Entendimento útil para cobrança, negociação e gestão documental de débitos condominiais envolvendo unidades ocupadas pelo poder público.",
      type: "summary",
    },
    { id: "sidebar-metadata", type: "metadata" },
    { id: "sidebar-attorney", type: "attorney" },
    { id: "sidebar-source", type: "source" },
  ]
}
