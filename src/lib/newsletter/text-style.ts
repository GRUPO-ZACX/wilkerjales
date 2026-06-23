import type { NewsletterTextStyle, NewsletterTemplate } from "./types"
import type { CSSProperties } from "react"

import { cn } from "yes@/lib/utils"

export function getNewsletterTextStyle(
  newsletter: NewsletterTemplate,
  fieldId: string
) {
  return newsletter.textStyles?.[fieldId]
}

export function newsletterTextStyleClassName(
  style: NewsletterTextStyle | undefined
) {
  return cn(
    style?.bold && "font-bold",
    style?.fontFamily === "serif" && "font-serif",
    style?.fontFamily === "sans" && "font-sans",
    style?.letterSpacing === "wide" && "tracking-wide",
    style?.letterSpacing === "wider" && "tracking-wider",
    style?.lineHeight === "compact" && "leading-snug",
    style?.lineHeight === "normal" && "leading-normal",
    style?.lineHeight === "loose" && "leading-loose",
    style?.align === "center" && "text-center",
    style?.align === "right" && "text-right",
    style?.align === "left" && "text-left"
  )
}

export function newsletterTextStyleCss(
  style: NewsletterTextStyle | undefined
): CSSProperties | undefined {
  if (!style?.color) {
    return undefined
  }

  return {
    color: style.color,
  }
}
