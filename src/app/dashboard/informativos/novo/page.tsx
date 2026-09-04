import type { Metadata } from "next"

import { NewsletterEditor } from "yes@/components/newsletter/editor/newsletter-editor"
import { applyNewsletterProfile } from "yes@/lib/newsletter/profile"
import { defaultNewsletterTemplate } from "yes@/lib/newsletter/default-template"
import { getCurrentUserNewsletterProfile } from "yes@/lib/newsletter/profile-server"
import { saveNewsletterProfileAction } from "../../configuracoes/actions"
import { createNewsletterAction } from "../actions"

export const metadata: Metadata = {
  title: "Novo informativo | Dashboard",
  description: "Editor inicial do Informativo Jurídico Digital.",
}

export default async function NovoInformativoPage() {
  const settings = await getCurrentUserNewsletterProfile()

  return (
    <NewsletterEditor
      backHref="/dashboard/informativos"
      initialNewsletter={applyNewsletterProfile(
        defaultNewsletterTemplate,
        settings.profile
      )}
      initialProfile={settings.profile}
      onSaveDraft={createNewsletterAction}
      onSaveProfile={saveNewsletterProfileAction}
    />
  )
}
