"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpenText, FileText, Menu, Plus, X } from "lucide-react"
import { useState, type ReactNode } from "react"

import { LogoutButton } from "yes@/components/auth/logout-button"
import { cn } from "yes@/lib/utils"

type DashboardShellProps = {
  children: ReactNode
  showConfigWarning: boolean
}

const navigationItems = [
  {
    href: "/dashboard/informativos",
    icon: FileText,
    label: "Informativos",
  },
  {
    href: "/dashboard/informativos/novo",
    icon: Plus,
    label: "Novo",
  },
  {
    href: "/informativo/demo",
    icon: BookOpenText,
    label: "Demo",
  },
]

export function DashboardShell({
  children,
  showConfigWarning,
}: DashboardShellProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="min-h-screen bg-neutral-50 text-black">
      <aside className="fixed inset-y-0 left-0 z-[80] flex w-14 flex-col items-center border-r border-black/10 bg-white">
        <button
          aria-expanded={isOpen}
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          className="mt-4 grid size-10 place-items-center rounded-xl border border-black/10 bg-white text-black transition-colors hover:bg-black hover:text-white"
          onClick={() => setIsOpen((current) => !current)}
          type="button"
        >
          {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </aside>

      {isOpen && (
        <button
          aria-label="Fechar menu"
          className="fixed inset-0 z-[85] bg-black/15"
          onClick={() => setIsOpen(false)}
          type="button"
        />
      )}

      <nav
        className={cn(
          "fixed inset-y-0 left-14 z-[90] flex w-[min(300px,calc(100vw-56px))] flex-col border-r border-black/10 bg-white p-5 shadow-[18px_0_60px_rgba(0,0,0,0.12)] transition-transform duration-200",
          isOpen
            ? "pointer-events-auto translate-x-0"
            : "pointer-events-none -translate-x-[calc(100%+56px)]"
        )}
      >
        <div>
          <Link
            className="block text-sm font-semibold uppercase tracking-[0.18em] text-black"
            href="/dashboard/informativos"
            onClick={() => setIsOpen(false)}
          >
            Informativo Jurídico Digital
          </Link>
          <p className="mt-2 text-xs font-medium leading-5 text-black/50">
            Dashboard editorial do escritório
          </p>
        </div>

        <div className="mt-8 grid gap-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive =
              pathname === item.href ||
              (item.href === "/dashboard/informativos"
                ? pathname.startsWith("/dashboard/informativos/") &&
                  !pathname.startsWith("/dashboard/informativos/novo")
                : pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm font-semibold text-black/70 transition-colors hover:border-black/10 hover:bg-black/[0.03] hover:text-black",
                  isActive && "border-black bg-black text-white hover:bg-black hover:text-white"
                )}
                href={item.href}
                onClick={() => setIsOpen(false)}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="mt-auto border-t border-black/10 pt-4">
          <LogoutButton />
        </div>
      </nav>

      <div className="min-h-screen pl-14">
        {showConfigWarning && (
          <div className="border-b border-black/10 bg-white px-5 py-3 text-sm font-medium text-black/65">
            <div className="mx-auto w-full max-w-[1280px]">
              Supabase ainda não configurado. Defina{" "}
              <code>NEXT_PUBLIC_SUPABASE_URL</code> e{" "}
              <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
            </div>
          </div>
        )}

        {children}
      </div>
    </div>
  )
}
