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
  if (!style) {
    return undefined
  }

  if (
    !style.color &&
    typeof style.fontSize !== "number" &&
    typeof style.letterSpacing !== "number" &&
    typeof style.lineHeight !== "number" &&
    typeof style.blockWidth !== "number"
  ) {
    return undefined
  }

  const blockAlignment =
    typeof style.blockWidth === "number" && style.blockWidth < 100
      ? blockAlignmentStyle(style.align)
      : {}

  return {
    ...blockAlignment,
    color: style.color,
    fontSize:
      typeof style.fontSize === "number" ? `${style.fontSize}px` : undefined,
    letterSpacing:
      typeof style.letterSpacing === "number"
        ? `${style.letterSpacing}px`
        : undefined,
    lineHeight:
      typeof style.lineHeight === "number" ? style.lineHeight : undefined,
    maxWidth:
      typeof style.blockWidth === "number" ? `${style.blockWidth}%` : undefined,
  }
}

function blockAlignmentStyle(align: NewsletterTextStyle["align"]) {
  if (align === "center") {
    return {
      marginLeft: "auto",
      marginRight: "auto",
    }
  }

  if (align === "right") {
    return {
      marginLeft: "auto",
      marginRight: "0",
    }
  }

  return {
    marginLeft: "0",
    marginRight: "auto",
  }
}
