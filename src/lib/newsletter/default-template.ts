import { defaultNewsletterSections } from "./sections"
import type { NewsletterTemplate } from "./types"

export const defaultNewsletterTemplate: NewsletterTemplate = {
  id: "informativo-condominial-02-2026",
  slug: "demo",
  sections: defaultNewsletterSections.map((section) => ({ ...section })),
  theme: {
    background: "#F7F5EE",
    text: "#1F1F1A",
  },
  header: {
    collection: "COLEÇÃO 2026",
    period: "MAIO · SEMANA 2",
    issue: "02 / 2026",
    label: "Informativo Condominial",
  },
  firm: {
    name: "JALES & JALES",
    descriptor: "Advogados Associados",
  },
  banner: "INFORMATIVO CONDOMINIAL · 02 / 2026 · MAIO 2026",
  category: "DIREITO CONDOMINIAL",
  title: "Órgão público no condomínio?",
  highlight: "Paga multa e juros como qualquer condômino.",
  intro: [
    {
      text: "Quando um órgão público ocupa uma unidade condominial, ele ",
    },
    {
      text: "não recebe tratamento privilegiado",
      bold: true,
    },
    {
      text: " nas obrigações ordinárias do condomínio. Se houver atraso, a cobrança pode incluir ",
    },
    {
      text: "multa, juros e correção",
      bold: true,
    },
    {
      text: ", observados os mesmos critérios aplicados aos demais condôminos.",
    },
  ],
  decisionTitle: "",
  decisionTopics: [
    {
      title: "Sem imunidade condominial",
      description:
        "A taxa de condomínio decorre do uso e conservação do bem, não de relação tributária.",
    },
    {
      title: "Encargos são aplicáveis",
      description:
        "Multa, juros e correção podem incidir quando há atraso no pagamento da cota.",
    },
    {
      title: "Tratamento isonômico",
      description:
        "O condomínio não precisa dispensar encargos apenas porque a unidade é ocupada pelo poder público.",
    },
    {
      title: "Gestão documental importa",
      description:
        "Convenção, boletos, atas e demonstrativos devem sustentar a cobrança com precisão.",
    },
  ],
  syndicTitle: "O QUE TODO SÍNDICO PRECISA SABER",
  syndicCards: [
    {
      number: "01",
      title: "Cota condominial não é tributo",
      description:
        "A obrigação nasce da propriedade ou posse da unidade e do rateio das despesas comuns.",
    },
    {
      number: "02",
      title: "Atraso gera encargos",
      description:
        "A cobrança deve observar convenção, assembleia e legislação civil aplicável.",
    },
    {
      number: "03",
      title: "Cobrança exige prova",
      description:
        "Guarde documentos que demonstrem origem, vencimento, valor e atualização do débito.",
    },
    {
      number: "04",
      title: "Negociação deve ser formal",
      description:
        "Acordos com entes públicos precisam de registro claro, prazo e autorização adequada.",
    },
  ],
  bodyBlocks: [
    {
      eyebrow: "",
      title: "Por que a decisão é relevante para condomínios",
      paragraphs: [
        "Muitos condomínios enfrentam insegurança quando uma unidade é utilizada por órgão público. A dúvida costuma aparecer na cobrança: seria possível aplicar multa e juros? O entendimento reafirma que a despesa condominial preserva natureza privada e decorre do rateio aprovado.",
        "Na prática, o síndico deve conduzir a cobrança com o mesmo rigor documental utilizado para qualquer outro condômino. A diferença está no cuidado com a comunicação institucional e na organização dos comprovantes.",
      ],
    },
    {
      eyebrow: "",
      title: "Como reduzir risco de contestação",
      paragraphs: [
        "Antes de judicializar ou negociar, revise a convenção, as atas que aprovaram despesas, os boletos vencidos e a memória de cálculo. Esse conjunto permite demonstrar que os encargos não foram arbitrários.",
        "Também é recomendável manter uma linha de comunicação formal, com protocolo e histórico. O condomínio ganha força quando consegue mostrar previsibilidade, transparência e tratamento uniforme.",
      ],
    },
  ],
  attorney: {
    name: "Dr. Marcelo Jales",
    specialty: "Direito Condominial e Imobiliário",
    phrase:
      "Informação jurídica clara para decisões condominiais mais seguras.",
    initials: "MJ",
    photoAlt: "Foto do advogado Marcelo Jales",
  },
  cta: {
    title: "Seu condomínio precisa revisar uma cobrança sensível?",
    description:
      "Organize documentos, valide a estratégia e reduza riscos antes de iniciar a cobrança ou formalizar um acordo.",
    label: "Falar com o escritório",
    href: "mailto:contato@jalesjales.adv.br",
  },
  customSections: [],
  sourceTitle: "",
  sourceDescription:
    "Informativo baseado em entendimento do Superior Tribunal de Justiça sobre natureza da cota condominial, encargos moratórios e tratamento de unidade ocupada por órgão público.",
  address: "Av. Paulista, 1000 · São Paulo, SP",
  contacts: [
    {
      label: "Telefone",
      value: "(11) 4000-2026",
      href: "tel:+551140002026",
    },
    {
      label: "E-mail",
      value: "contato@jalesjales.adv.br",
      href: "mailto:contato@jalesjales.adv.br",
    },
    {
      label: "Site",
      value: "jalesjales.adv.br",
      href: "https://jalesjales.adv.br",
    },
  ],
  socialLinks: [
    {
      label: "Instagram",
      value: "@jalesjales.adv",
      href: "https://instagram.com/jalesjales.adv",
    },
    {
      label: "LinkedIn",
      value: "Jales & Jales Advogados",
      href: "https://linkedin.com",
    },
  ],
}
