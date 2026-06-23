import Link from "next/link"
import { Download } from "lucide-react"

type DownloadFloatingButtonProps = {
  href: string
}

export function DownloadFloatingButton({ href }: DownloadFloatingButtonProps) {
  return (
    <Link
      href={href}
      aria-label="Baixar PDF"
      className="group fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-[#163B35] text-[#F7F5EE] shadow-[0_18px_50px_rgba(22,59,53,0.28)] transition-all duration-300 hover:w-40 hover:bg-[#244F49] print:hidden"
    >
      <Download className="size-5 shrink-0" />
      <span className="ml-0 max-w-0 whitespace-nowrap text-sm font-semibold opacity-0 transition-all duration-300 group-hover:ml-2 group-hover:max-w-24 group-hover:opacity-100">
        Baixar PDF
      </span>
    </Link>
  )
}
