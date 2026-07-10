"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { useEffect, useState } from "react"

import { mainNav } from "yes@/lib/site/content"
import { SiteBrand } from "./site-brand"

type MenuScope = "static" | "floating"

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/"
  }

  if (href === "/publicacoes") {
    return pathname.startsWith("/publicacoes") || pathname.startsWith("/informativo")
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

function HeaderFrame({
  compact = false,
  menuScope,
  onClose,
  onToggle,
  openMenu,
  pathname,
}: {
  compact?: boolean
  menuScope: MenuScope
  onClose: () => void
  onToggle: (scope: MenuScope) => void
  openMenu: MenuScope | null
  pathname: string
}) {
  const isOpen = openMenu === menuScope

  return (
    <>
      <div
        className={[
          "mx-auto flex max-w-[1400px] items-center justify-between px-5 sm:px-8",
          compact ? "h-[94px]" : "h-[132px] lg:h-[171px]",
        ].join(" ")}
      >
        <SiteBrand compact={compact} />

        <nav className="hidden items-center justify-end gap-[25px] lg:flex" aria-label="Principal">
          {mainNav.map((item) => {
            const active = isActivePath(pathname, item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "site-nav-link site-serif py-[10px] text-[20px]",
                  active ? "is-active" : "",
                ].join(" ")}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <button
          type="button"
          className="grid size-11 place-items-center bg-[#336666] text-[#c4c496] transition-colors hover:bg-[#285555] lg:hidden"
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isOpen}
          onClick={() => onToggle(menuScope)}
        >
          {isOpen ? <X size={26} aria-hidden /> : <Menu size={28} aria-hidden />}
        </button>
      </div>

      {isOpen ? (
        <div className="site-mobile-menu border-t border-[#c0c0c0] bg-white px-5 py-[25px] lg:hidden">
          <nav className="mx-auto grid max-w-[1400px]" aria-label="Principal">
            {mainNav.map((item) => {
              const active = isActivePath(pathname, item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "site-mobile-nav-link site-serif py-3 text-lg",
                    active ? "is-active" : "",
                  ].join(" ")}
                  onClick={onClose}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      ) : null}
    </>
  )
}

export function SiteHeader() {
  const pathname = usePathname()
  const [openMenu, setOpenMenu] = useState<MenuScope | null>(null)
  const [showFloatingHeader, setShowFloatingHeader] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const shouldShowFloatingHeader = window.scrollY > 172

      setShowFloatingHeader(shouldShowFloatingHeader)

      if (!shouldShowFloatingHeader) {
        setOpenMenu((current) => (current === "floating" ? null : current))
      }
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleToggle = (scope: MenuScope) => {
    setOpenMenu((current) => (current === scope ? null : scope))
  }

  const handleClose = () => {
    setOpenMenu(null)
  }

  return (
    <>
      <header className="site-header site-header-static border-b border-[#c0c0c0] bg-white">
        <HeaderFrame
          menuScope="static"
          onClose={handleClose}
          onToggle={handleToggle}
          openMenu={openMenu}
          pathname={pathname}
        />
      </header>

      {showFloatingHeader ? (
        <header
          className="site-header site-header-floating border-b border-[#eeeeee] bg-white"
          aria-label="Menu fixo"
        >
          <HeaderFrame
            compact
            menuScope="floating"
            onClose={handleClose}
            onToggle={handleToggle}
            openMenu={openMenu}
            pathname={pathname}
          />
        </header>
      ) : null}
    </>
  )
}
