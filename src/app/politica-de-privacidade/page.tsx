import type { Metadata } from "next"

import { LegalContentPage } from "yes@/components/site/legal-content-page"
import { siteConfig } from "yes@/lib/site/content"

export const metadata: Metadata = {
  title: "Política de Privacidade | Jales & Jales Advogados",
}

export default function PrivacyPolicyPage() {
  return (
    <LegalContentPage
      title="Política de Privacidade"
      description="Informações sobre tratamento de dados pessoais nos canais digitais do escritório."
      paragraphs={[
        `${siteConfig.legalName} trata dados pessoais com responsabilidade, transparência e finalidade legítima, observando a legislação aplicável e a necessidade de atendimento jurídico.`,
        "Os dados enviados por formulários, mensagens ou canais de contato podem ser utilizados para retorno ao solicitante, análise inicial da demanda, agendamento de atendimento e cumprimento de obrigações legais.",
        "O titular pode solicitar informações, atualização ou exclusão de dados pessoais, respeitadas as hipóteses legais de guarda e tratamento necessárias à prestação de serviços jurídicos.",
      ]}
    />
  )
}
