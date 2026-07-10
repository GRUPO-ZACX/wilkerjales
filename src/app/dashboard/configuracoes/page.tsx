import type { Metadata } from "next"

import { NewsletterSettingsForm } from "yes@/components/newsletter/editor/newsletter-settings-form"
import { getCurrentUserNewsletterProfile } from "yes@/lib/newsletter/profile-server"
import { saveNewsletterProfileAction } from "./actions"

export const metadata: Metadata = {
  title: "Configurações | Dashboard",
  description: "Configurações fixas do informativo jurídico.",
}

export default async function DashboardConfiguracoesPage() {
  const settings = await getCurrentUserNewsletterProfile()

  return (
    <NewsletterSettingsForm
      initialError={settings.error}
      initialProfile={settings.profile}
      migrationRequired={settings.migrationRequired}
      onSave={saveNewsletterProfileAction}
    />
  )
}
