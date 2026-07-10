/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text */

import type { ImgHTMLAttributes } from "react"

type SiteImageProps = ImgHTMLAttributes<HTMLImageElement>

export function SiteImage(props: SiteImageProps) {
  return <img {...props} />
}
