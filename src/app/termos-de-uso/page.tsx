import type { Metadata } from "next"

import { LegalContentPage } from "yes@/components/site/legal-content-page"
import { siteConfig } from "yes@/lib/site/content"

export const metadata: Metadata = {
  title: "Termos de Uso | Jales & Jales Advogados",
}

export default function TermsPage() {
  return (
    <LegalContentPage
      title="Termos de Uso"
      description="Condições gerais de acesso aos conteúdos publicados neste site."
      paragraphs={[
        `O acesso ao site de ${siteConfig.legalName} implica ciência de que os conteúdos têm finalidade informativa e institucional.`,
        "Informativos, artigos e materiais publicados não substituem análise jurídica individualizada. Cada caso deve ser avaliado conforme documentos, contexto e legislação aplicável.",
        "É vedada a reprodução de conteúdos do site sem autorização, salvo quando houver indicação expressa de fonte e respeito aos direitos aplicáveis.",
      ]}
    />
  )
}
