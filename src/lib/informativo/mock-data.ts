import type { Informativo } from "./types"

export const demoInformativo: Informativo = {
  id: "demo-assembleias-condominiais",
  slug: "demo",
  edition: "Edição 01",
  issueLabel: "Informativo jurídico condominial",
  publishedAt: "Junho de 2026",
  practiceArea: "Direito Condominial",
  firm: {
    name: "Almeida & Costa Advocacia",
    tagline: "Consultivo condominial com linguagem clara",
    city: "São Paulo, SP",
  },
  title:
    "Assembleias condominiais: como reduzir conflitos e formalizar decisões com segurança",
  subtitle:
    "Um guia objetivo para síndicos, administradoras e conselhos evitarem nulidades, retrabalho e discussões repetidas.",
  summary:
    "Convocação, quórum, registro em ata e comunicação posterior formam a base documental das decisões condominiais.",
  tags: ["Assembleia", "Ata", "Quórum", "Síndico"],
  source:
    "Código Civil, Lei nº 4.591/1964 e jurisprudência aplicada a rotinas condominiais.",
  footerNote:
    "Material informativo. A aplicação a casos concretos exige análise individual dos documentos do condomínio.",
  blocks: [
    {
      id: "contexto-juridico",
      type: "article",
      visible: true,
      eyebrow: "Contexto jurídico",
      title: "A ata não corrige uma assembleia mal conduzida",
      lead:
        "A assembleia é o espaço de deliberação, mas a segurança jurídica nasce antes dela: na pauta, na convocação e na preparação dos documentos.",
      paragraphs: [
        "Quando a convocação é genérica ou o item votado foge da pauta, a decisão pode ser questionada mesmo que tenha recebido apoio da maioria presente.",
        "O caminho mais seguro é tratar cada deliberação como um pequeno procedimento: identificar o assunto, confirmar o quórum, registrar os fundamentos e comunicar o resultado de forma rastreável.",
      ],
      highlight:
        "Boa governança condominial não depende de excesso de formalismo. Depende de previsibilidade, prova e linguagem precisa.",
    },
    {
      id: "cuidados-praticos",
      type: "numbered-cards",
      visible: true,
      eyebrow: "Checklist editorial",
      title: "Três cuidados antes de colocar o tema em votação",
      description:
        "Os pontos abaixo servem como estrutura fixa para o editor: texto livre dentro de campos controlados, sem alterar o desenho do informativo.",
      cards: [
        {
          number: "01",
          title: "Convocação completa",
          description:
            "Informe data, horário, local, pauta objetiva e documentos de apoio com antecedência compatível com a convenção.",
        },
        {
          number: "02",
          title: "Quórum conferido",
          description:
            "Separe quórum simples, especial e unanimidade antes da reunião, evitando votação inválida por enquadramento errado.",
        },
        {
          number: "03",
          title: "Ata verificável",
          description:
            "Registre votos, ressalvas, documentos analisados e encaminhamentos, com assinatura e guarda em canal seguro.",
        },
      ],
    },
    {
      id: "nota-orientacao",
      type: "note",
      visible: true,
      eyebrow: "Orientação prática",
      title: "Decisões sensíveis pedem trilha documental",
      quote:
        "Quanto maior o impacto financeiro ou estrutural da decisão, maior deve ser o cuidado com prova, transparência e comunicação posterior.",
      source: "Síntese editorial para gestão condominial preventiva.",
    },
    {
      id: "guarda-documentos",
      type: "article",
      visible: true,
      eyebrow: "Depois da reunião",
      title: "O que deve ficar arquivado pelo condomínio",
      paragraphs: [
        "A versão final da ata deve ser acompanhada da lista de presença, procurações, comprovantes de convocação, orçamentos e anexos apresentados durante a deliberação.",
        "Esse conjunto reduz disputas futuras e ajuda a administradora a responder moradores com objetividade, sem depender de memória ou mensagens soltas.",
      ],
    },
    {
      id: "advogado",
      type: "attorney",
      visible: true,
      attorney: {
        name: "Dra. Marina Almeida",
        role: "Advogada condominial e consultiva",
        oab: "OAB/SP 000.000",
        bio:
          "Atua na prevenção de conflitos entre condomínios, síndicos, administradoras e moradores, com foco em documentos claros e decisões sustentáveis.",
        email: "marina@almeidacosta.adv.br",
        phone: "(11) 4000-0000",
        photoAlt: "Foto da advogada Marina Almeida",
        initials: "MA",
      },
    },
    {
      id: "cta-consulta",
      type: "cta",
      visible: true,
      cta: {
        title: "Precisa revisar uma pauta ou ata antes da próxima assembleia?",
        description:
          "Envie os documentos do condomínio para uma análise preventiva e receba orientações objetivas antes da votação.",
        label: "Solicitar análise",
        href: "mailto:marina@almeidacosta.adv.br",
      },
    },
  ],
}
