import type { CSSProperties } from "react"

import type { NewsletterImageCrop } from "./types"

export const defaultNewsletterImageCrop: NewsletterImageCrop = {
  positionX: 50,
  positionY: 50,
  zoom: 1,
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function numberOrFallback(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback
}

export function normalizeNewsletterImageCrop(
  value: Partial<NewsletterImageCrop> | unknown,
): NewsletterImageCrop {
  if (!isRecord(value)) {
    return defaultNewsletterImageCrop
  }

  return {
    positionX: clamp(
      numberOrFallback(value.positionX ?? value.x, defaultNewsletterImageCrop.positionX),
      0,
      100,
    ),
    positionY: clamp(
      numberOrFallback(value.positionY ?? value.y, defaultNewsletterImageCrop.positionY),
      0,
      100,
    ),
    zoom: clamp(
      numberOrFallback(value.zoom ?? value.scale, defaultNewsletterImageCrop.zoom),
      1,
      2.8,
    ),
  }
}

export function newsletterImageCropBackgroundStyle(
  imageUrl: string,
  crop: Partial<NewsletterImageCrop> | undefined,
): CSSProperties {
  const normalizedCrop = normalizeNewsletterImageCrop(crop)
  const position = `${normalizedCrop.positionX}% ${normalizedCrop.positionY}%`

  return {
    backgroundImage: `url(${imageUrl})`,
    backgroundPosition: position,
    transform: `scale(${normalizedCrop.zoom})`,
    transformOrigin: position,
  }
}
