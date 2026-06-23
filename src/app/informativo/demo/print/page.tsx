import type { Metadata } from "next"

import { NewsletterRenderer } from "yes@/components/newsletter/newsletter-renderer"
import { defaultNewsletterTemplate } from "yes@/lib/newsletter/default-template"

export const metadata: Metadata = {
  title: "Print | Informativo Condominial",
  description:
    "Versão preparada para impressão do informativo demo, sem geração real de PDF.",
}

export default function PrintInformativoPage() {
  return <NewsletterRenderer newsletter={defaultNewsletterTemplate} mode="print" />
}
