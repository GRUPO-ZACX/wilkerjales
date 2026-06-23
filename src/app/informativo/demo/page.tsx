import type { Metadata } from "next"

import { NewsletterRenderer } from "yes@/components/newsletter/newsletter-renderer"
import { defaultNewsletterTemplate } from "yes@/lib/newsletter/default-template"

export const metadata: Metadata = {
  title: "Informativo Condominial | Demo",
  description:
    "Informativo jurídico condominial estático com layout editorial premium.",
}

export default function DemoInformativoPage() {
  return (
    <NewsletterRenderer newsletter={defaultNewsletterTemplate} mode="public" />
  )
}
