import Link from "next/link"

import { asset, siteConfig } from "yes@/lib/site/content"
import { SiteImage } from "./site-image"

type SiteBrandProps = {
  compact?: boolean
  footer?: boolean
}

export function SiteBrand({ compact = false, footer = false }: SiteBrandProps) {
  return (
    <Link
      className="inline-flex items-center"
      href="/"
      aria-label={`${siteConfig.legalName} - página inicial`}
    >
      <SiteImage
        alt={siteConfig.legalName}
        className={
          footer
            ? "h-auto w-[240px] max-w-full"
            : compact
              ? "h-auto w-[120px] max-w-full"
              : "h-auto w-[250px] max-w-full lg:w-[290px]"
        }
        src={footer ? asset("brand-footer-jales.svg") : asset("brand-jales.svg")}
      />
    </Link>
  )
}
