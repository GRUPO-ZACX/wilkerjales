import { SiteFooter } from "./site-footer"
import { SiteHeader } from "./site-header"
import { SiteMotion } from "./site-motion"
import { SiteWhatsApp } from "./site-whatsapp"

type SiteShellProps = {
  children: React.ReactNode
}

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="site-scope flex min-h-screen flex-col bg-white text-black">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <SiteWhatsApp />
      <SiteMotion />
    </div>
  )
}
