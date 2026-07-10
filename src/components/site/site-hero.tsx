import Link from "next/link"
import { ArrowRight } from "lucide-react"

type HeroAction = {
  external?: boolean
  href: string
  label: string
}

type SiteHeroProps = {
  action?: HeroAction
  image: string
  kind?: "home" | "page"
  subtitle?: string
  title: string
}

export function SiteHero({
  action,
  image,
  kind = "page",
  subtitle,
  title,
}: SiteHeroProps) {
  return (
    <section
      className={[
        "site-hero relative isolate overflow-hidden bg-[#203b3b] bg-cover bg-center text-white",
        kind === "home"
          ? "min-h-[calc(100vh-132px)] lg:min-h-[calc(100vh-176px)]"
          : "min-h-[410px]",
      ].join(" ")}
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${image})`,
      }}
    >
      <div className="mx-auto flex min-h-[inherit] max-w-[1400px] items-center px-5 py-16 sm:px-8">
        <div className="max-w-[720px]">
          <h1
            className={[
              "site-serif site-animate-left leading-[1.5] text-white",
              kind === "home"
                ? "text-[35px] sm:text-[42px]"
                : "text-[42px]",
            ].join(" ")}
          >
            {title}
          </h1>

          {subtitle ? (
            <p className="site-animate-right mt-6 max-w-[640px] text-xl font-light leading-[1.5] text-white">
              {subtitle}
            </p>
          ) : null}

          {action ? (
            <Link
              href={action.href}
              target={action.external ? "_blank" : undefined}
              rel={action.external ? "noreferrer" : undefined}
              className="site-animate-up mt-9 inline-flex items-center gap-3 border-2 border-[#c4c496] px-[25px] py-[20px] text-base font-normal uppercase text-white transition-colors hover:bg-[#c4c496] hover:text-black sm:px-[35px]"
            >
              {action.label}
              <ArrowRight size={18} aria-hidden />
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  )
}
