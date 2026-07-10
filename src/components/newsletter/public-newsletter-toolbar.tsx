import Link from "next/link"
import { ArrowLeft, Download, Home } from "lucide-react"

import { SiteBrand } from "yes@/components/site/site-brand"

type PublicNewsletterToolbarProps = {
  printHref: string
  title: string
}

export function PublicNewsletterToolbar({
  printHref,
  title,
}: PublicNewsletterToolbarProps) {
  return (
    <div className="site-scope sticky top-0 z-50 border-b border-[#c0c0c0] bg-white/95 text-black shadow-[0_10px_24px_rgba(0,0,0,0.06)] backdrop-blur print:hidden">
      <div className="mx-auto flex min-h-[78px] max-w-[1400px] flex-col gap-3 px-5 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <SiteBrand compact />
          <div className="min-w-0 border-l border-[#c0c0c0] pl-4">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#a3a373]">
              Informativo
            </p>
            <h1 className="truncate text-base font-medium leading-tight text-[#336666]">
              {title}
            </h1>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-2 text-sm font-medium">
          <Link
            className="inline-flex min-h-10 items-center gap-2 border border-[#c0c0c0] px-3 text-[#336666] transition-colors hover:border-[#c4c496] hover:text-[#a3a373]"
            href="/publicacoes"
          >
            <ArrowLeft size={16} aria-hidden />
            Publicações
          </Link>
          <Link
            className="inline-flex min-h-10 items-center gap-2 border border-[#c0c0c0] px-3 text-[#336666] transition-colors hover:border-[#c4c496] hover:text-[#a3a373]"
            href="/"
          >
            <Home size={16} aria-hidden />
            Site
          </Link>
          <Link
            className="inline-flex min-h-10 items-center gap-2 bg-[#336666] px-3 text-white transition-colors hover:bg-[#285555]"
            href={printHref}
          >
            <Download size={16} aria-hidden />
            PDF
          </Link>
        </nav>
      </div>
    </div>
  )
}
