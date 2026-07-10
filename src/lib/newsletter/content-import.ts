import type {
  NewsletterNumberedCard,
  NewsletterTemplate,
  NewsletterTextBlock,
  NewsletterTopic,
} from "./types"

type ParsedSections = Record<string, string>

export type NewsletterContentImportResult = {
  appliedFields: string[]
  newsletter: NewsletterTemplate
}

export const NEWSLETTER_CONTENT_IMPORT_SAMPLE = `TITULO:
[Título novo do informativo]

DESTAQUE:
[Frase curta de impacto para o síndico]

INTRODUCAO:
[Parágrafo curto explicando o assunto em linguagem clara]

DATA:
[Data do conteúdo]

TEMA:
[Tema jurídico principal]

TOPICOS JURIDICOS:
1. [Título do ponto jurídico] - [Descrição objetiva do ponto jurídico].
2. [Título do ponto jurídico] - [Descrição objetiva do ponto jurídico].

SINDICO:
1. [Orientação prática] - [Descrição clara para o síndico].
2. [Orientação prática] - [Descrição clara para o síndico].

BLOCOS:
## [Título do primeiro bloco]
[Texto do primeiro bloco explicativo.]

## [Título do segundo bloco]
[Texto do segundo bloco explicativo.]`

export const NEWSLETTER_CONTENT_IMPORT_AI_MEMORY = `Sempre que eu pedir um informativo juridico condominial para o sistema da Jales Advogados, responda somente no formato abaixo, mantendo os nomes dos campos exatamente iguais.

Regras:
- Crie conteudo novo para o tema pedido; nao copie os textos do modelo.
- Nao inclua logo, foto, nome do advogado, telefone, site, e-mail, redes sociais ou dados do escritorio.
- Nao inclua CTA, botao, link de contato ou chamada comercial final.
- Use linguagem clara para sindicos.
- Em TOPICOS JURIDICOS, escreva de 2 a 4 itens no formato: numero. Titulo - descricao.
- Em SINDICO, escreva de 2 a 4 itens no formato: numero. Titulo - descricao.
- Em BLOCOS, use titulos com ## e paragrafos curtos.
- Nao escreva explicacoes fora do modelo.

Modelo a preencher:

${NEWSLETTER_CONTENT_IMPORT_SAMPLE}`

const sectionAliases: Record<string, string> = {
  blocos: "body",
  "blocos explicativos": "body",
  conteudo: "body",
  "cta botao": "ctaLabel",
  "cta descricao": "ctaDescription",
  "cta link": "ctaHref",
  "cta titulo": "ctaTitle",
  data: "date",
  "data de criacao": "date",
  destaque: "highlight",
  fonte: "source",
  introducao: "intro",
  resumo: "summary",
  sindico: "syndic",
  tema: "category",
  titulo: "title",
  topicos: "topics",
  "topicos juridicos": "topics",
}

function normalizeLabel(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
}

function cloneNewsletter(newsletter: NewsletterTemplate): NewsletterTemplate {
  return JSON.parse(JSON.stringify(newsletter)) as NewsletterTemplate
}

function parseSections(input: string): ParsedSections {
  const sections: ParsedSections = {}
  let currentKey = "body"

  input.split(/\r?\n/).forEach((line) => {
    const match = line.match(/^\s*([A-Za-zÀ-ÿ0-9 ]{2,36})\s*:\s*(.*)$/)

    if (match) {
      const alias = sectionAliases[normalizeLabel(match[1])]

      if (alias) {
        currentKey = alias
        sections[currentKey] = sections[currentKey]
          ? `${sections[currentKey]}\n${match[2]}`
          : match[2]
        return
      }
    }

    sections[currentKey] = sections[currentKey]
      ? `${sections[currentKey]}\n${line}`
      : line
  })

  return Object.fromEntries(
    Object.entries(sections).map(([key, value]) => [key, value.trim()]),
  )
}

function splitTitleDescription(line: string) {
  const cleaned = line
    .replace(/^\s*[-*]\s+/, "")
    .replace(/^\s*\d+[.)]\s+/, "")
    .trim()
  const [title, ...descriptionParts] = cleaned.split(/\s+(?:-|–|:)\s+/)
  const description = descriptionParts.join(" - ").trim()

  return {
    description,
    title: title.trim(),
  }
}

function parseTopics(value: string, fallback: NewsletterTopic[]) {
  const lines = value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
  const parsed = lines
    .map(splitTitleDescription)
    .filter((item) => item.title)
    .map((item) => ({
      description: item.description || "Descricao objetiva do ponto juridico.",
      title: item.title,
    }))

  return parsed.length > 0 ? parsed.slice(0, 6) : fallback
}

function parseCards(value: string, fallback: NewsletterNumberedCard[]) {
  const lines = value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
  const parsed = lines
    .map((line, index) => {
      const item = splitTitleDescription(line)

      return {
        description: item.description || "Descricao objetiva para o sindico.",
        number: String(index + 1).padStart(2, "0"),
        title: item.title,
      }
    })
    .filter((item) => item.title)

  return parsed.length > 0 ? parsed.slice(0, 6) : fallback
}

function parseBodyBlocks(value: string, fallback: NewsletterTextBlock[]) {
  const blocks: NewsletterTextBlock[] = []
  const chunks = value
    .split(/\n(?=##\s+)/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)

  chunks.forEach((chunk) => {
    const lines = chunk.split(/\r?\n/)
    const firstLine = lines[0]?.replace(/^##\s*/, "").trim()
    const body = lines.slice(firstLine?.startsWith("#") ? 0 : 1).join("\n")
    const paragraphs = body
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.replace(/\n+/g, " ").trim())
      .filter(Boolean)

    if (firstLine) {
      blocks.push({
        eyebrow: "",
        paragraphs: paragraphs.length > 0 ? paragraphs : ["Texto explicativo."],
        title: firstLine,
      })
    }
  })

  if (blocks.length > 0) {
    return blocks.slice(0, 4)
  }

  const paragraphs = value
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\n+/g, " ").trim())
    .filter(Boolean)

  return paragraphs.length > 0
    ? [
        {
          eyebrow: "",
          paragraphs,
          title: "Analise juridica",
        },
      ]
    : fallback
}

function updateSummaryBlock(newsletter: NewsletterTemplate, summary: string) {
  const sidebarBlocks = newsletter.sidebarBlocks ?? []
  const summaryBlock = sidebarBlocks.find((block) => block.type === "summary")

  if (summaryBlock?.type === "summary") {
    summaryBlock.text = summary
    return
  }

  newsletter.sidebarBlocks = [
    {
      id: "sidebar-summary",
      text: summary,
      type: "summary",
    },
    ...sidebarBlocks,
  ]
}

export function parseNewsletterContentImport(
  input: string,
  currentNewsletter: NewsletterTemplate,
): NewsletterContentImportResult {
  const sections = parseSections(input)
  const newsletter = cloneNewsletter(currentNewsletter)
  const appliedFields: string[] = []

  if (sections.title) {
    newsletter.title = sections.title
    appliedFields.push("titulo")
  }

  if (sections.highlight) {
    newsletter.highlight = sections.highlight
    appliedFields.push("destaque")
  }

  if (sections.intro) {
    newsletter.intro = [{ text: sections.intro.replace(/\n+/g, " ") }]
    appliedFields.push("introducao")
  }

  if (sections.date) {
    newsletter.header.period = sections.date
    appliedFields.push("data")
  }

  if (sections.category) {
    newsletter.category = sections.category.toUpperCase()
    appliedFields.push("tema")
  }

  if (sections.topics) {
    newsletter.decisionTopics = parseTopics(
      sections.topics,
      newsletter.decisionTopics,
    )
    appliedFields.push("topicos juridicos")
  }

  if (sections.syndic) {
    newsletter.syndicCards = parseCards(sections.syndic, newsletter.syndicCards)
    appliedFields.push("sindico")
  }

  if (sections.body) {
    newsletter.bodyBlocks = parseBodyBlocks(
      sections.body,
      newsletter.bodyBlocks,
    )
    appliedFields.push("blocos")
  }

  if (sections.source) {
    newsletter.sourceDescription = sections.source
    appliedFields.push("fonte")
  }

  if (sections.summary) {
    updateSummaryBlock(newsletter, sections.summary)
    appliedFields.push("resumo")
  }

  newsletter.banner = [
    "INFORMATIVO CONDOMINIAL",
    newsletter.header.period,
    newsletter.category,
  ]
    .filter((item) => item.trim())
    .join(" · ")

  return {
    appliedFields,
    newsletter,
  }
}
