import type { Metadata } from "next"

import { AdminLoginScreen } from "yes@/components/auth/admin-login-screen"

export const metadata: Metadata = {
  title: "Acesso Wilker | Informativo Jurídico Digital",
  description: "Área interna para publicar informativos jurídicos.",
}

export default function AcessoWilkerPage() {
  return <AdminLoginScreen />
}
