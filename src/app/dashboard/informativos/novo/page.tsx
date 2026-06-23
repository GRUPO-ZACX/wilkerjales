import type { Metadata } from "next"

import { NewsletterEditor } from "yes@/components/newsletter/editor/newsletter-editor"
import { defaultNewsletterTemplate } from "yes@/lib/newsletter/default-template"
import { createNewsletterAction } from "../actions"

export const metadata: Metadata = {
  title: "Novo informativo | Dashboard",
  description: "Editor inicial do Informativo Jurídico Digital.",
}

export default function NovoInformativoPage() {
  return (
    <NewsletterEditor
      backHref="/dashboard/informativos"
      initialNewsletter={defaultNewsletterTemplate}
      onSaveDraft={createNewsletterAction}
    />
  )
}
