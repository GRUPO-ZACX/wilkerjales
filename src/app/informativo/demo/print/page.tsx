import type { Metadata } from "next"

import { NewsletterRenderer } from "yes@/components/newsletter/newsletter-renderer"
import { defaultNewsletterTemplate } from "yes@/lib/newsletter/default-template"

export const metadata: Metadata = {
  title: "Print | Informativo Condominial",
  description:
    "Versão preparada para impressão e geração de PDF do informativo demo.",
}

export default function PrintInformativoPage() {
  return <NewsletterRenderer newsletter={defaultNewsletterTemplate} mode="print" />
}
