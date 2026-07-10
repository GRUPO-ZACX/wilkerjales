import type { Metadata } from "next"

import { LegalContentPage } from "yes@/components/site/legal-content-page"

export const metadata: Metadata = {
  title: "Política de Cookies | Jales & Jales Advogados",
}

export default function CookiePolicyPage() {
  return (
    <LegalContentPage
      title="Política de Cookies"
      description="Uso de tecnologias de navegação para funcionamento e melhoria dos canais digitais."
      paragraphs={[
        "Este site pode utilizar cookies e tecnologias semelhantes para garantir funcionamento adequado, melhorar a experiência de navegação e compreender interações gerais com as páginas.",
        "Cookies essenciais podem ser necessários para recursos básicos do site. Outros recursos de análise ou integração podem ser ajustados conforme a configuração final de publicação.",
        "O visitante pode gerenciar cookies diretamente nas configurações do navegador, ciente de que a desativação de alguns recursos pode afetar a navegação.",
      ]}
    />
  )
}
