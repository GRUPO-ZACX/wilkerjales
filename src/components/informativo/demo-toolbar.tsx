import Link from "next/link"
import { FileText, LayoutDashboard, Printer } from "lucide-react"

import { Button } from "yes@/components/ui/button"
import { Badge } from "yes@/components/ui/badge"

type DemoToolbarProps = {
  slug: string
}

export function DemoToolbar({ slug }: DemoToolbarProps) {
  return (
    <div className="mx-auto flex w-full max-w-[1040px] flex-col gap-3 px-4 pb-4 pt-6 sm:flex-row sm:items-center sm:justify-between lg:px-0">
      <div className="space-y-2">
        <Badge className="border-[#c5b06d]/60 bg-[#f7f0dc] text-[#43543d] hover:bg-[#f7f0dc]">
          Demo estático
        </Badge>
        <p className="text-sm text-[#5b6559]">
          Primeira versão do informativo, com layout fixo e blocos mockados.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          className="border-[#c5b06d]/70 bg-[#fbf8ef] text-[#304334] hover:bg-[#efe6ce]"
          asChild
        >
          <Link href="/">
            <LayoutDashboard />
            Dashboard futuro
          </Link>
        </Button>
        <Button
          variant="outline"
          className="border-[#c5b06d]/70 bg-[#fbf8ef] text-[#304334] hover:bg-[#efe6ce]"
          asChild
        >
          <Link href={`/informativo/${slug}/print`}>
            <Printer />
            Rota print
          </Link>
        </Button>
        <Button className="bg-[#2f4634] text-[#fbf8ef] hover:bg-[#24382a]">
          <FileText />
          PDF em breve
        </Button>
      </div>
    </div>
  )
}
