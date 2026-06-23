"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import type { ChangeEvent, ReactNode } from "react"
import {
  ArrowLeft,
  Eye,
  ImageOff,
  Pencil,
  RotateCcw,
  Save,
  Upload,
} from "lucide-react"

import { Button } from "yes@/components/ui/button"
import { Input } from "yes@/components/ui/input"
import { Textarea } from "yes@/components/ui/textarea"
import { NewsletterRenderer } from "yes@/components/newsletter/newsletter-renderer"
import { NewsletterSectionSorter } from "yes@/components/newsletter/editor/newsletter-section-sorter"
import { getNewsletterSections } from "yes@/lib/newsletter/sections"
import type {
  NewsletterContact,
  NewsletterSection,
  NewsletterTemplate,
} from "yes@/lib/newsletter/types"
import type { NewsletterStatus } from "yes@/lib/supabase/database.types"
import { cn } from "yes@/lib/utils"

type NewsletterEditorProps = {
  initialNewsletter: NewsletterTemplate
  backHref?: string
  initialStatus?: NewsletterStatus
  isPersisted?: boolean
  onPublish?: NewsletterEditorAction
  onSaveDraft?: NewsletterEditorAction
  onUnpublish?: NewsletterEditorAction
}

export type NewsletterEditorAction = (
  newsletter: NewsletterTemplate
) => Promise<{
  ok: boolean
  error?: string
  redirectTo?: string
  status?: NewsletterStatus
}>

type PreviewMode = "edit" | "public"
type EditorGroup =
  | "order"
  | "header"
  | "hero"
  | "content"
  | "legal"
  | "cta"
  | "attorney"
  | "footer"

const editorGroups: Array<{ id: EditorGroup; label: string }> = [
  { id: "order", label: "Ordem dos blocos" },
  { id: "header", label: "Cabeçalho" },
  { id: "hero", label: "Hero" },
  { id: "content", label: "Conteúdo principal" },
  { id: "legal", label: "Blocos jurídicos" },
  { id: "cta", label: "CTA" },
  { id: "attorney", label: "Advogado" },
  { id: "footer", label: "Rodapé" },
]

function cloneNewsletter(newsletter: NewsletterTemplate): NewsletterTemplate {
  return JSON.parse(JSON.stringify(newsletter)) as NewsletterTemplate
}

function introToText(newsletter: NewsletterTemplate) {
  return newsletter.intro.map((segment) => segment.text).join("")
}

function textToParagraphs(value: string) {
  const paragraphs = value
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  return paragraphs.length > 0 ? paragraphs : [""]
}

function initialsFromName(name: string) {
  const initials = name
    .replace(/^(dr\.?|dra\.?)\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")

  return initials || "JJ"
}

function phoneHref(value: string) {
  const digits = value.replace(/\D/g, "")
  return digits ? `tel:+55${digits}` : "tel:"
}

function emailHref(value: string) {
  return `mailto:${value.trim()}`
}

function websiteHref(value: string) {
  const trimmed = value.trim()
  if (!trimmed) {
    return "https://"
  }
  return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`
}

export function NewsletterEditor({
  backHref = "/dashboard/informativos",
  initialNewsletter,
  initialStatus = "draft",
  isPersisted = false,
  onPublish,
  onSaveDraft,
  onUnpublish,
}: NewsletterEditorProps) {
  const router = useRouter()
  const [newsletter, setNewsletter] = useState(() =>
    cloneNewsletter({
      ...initialNewsletter,
      sections: getNewsletterSections(initialNewsletter),
    })
  )
  const [previewMode, setPreviewMode] = useState<PreviewMode>("edit")
  const [activeGroup, setActiveGroup] = useState<EditorGroup>("order")
  const [photoObjectUrl, setPhotoObjectUrl] = useState<string | null>(null)
  const [status, setStatus] = useState<NewsletterStatus>(initialStatus)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    return () => {
      if (photoObjectUrl) {
        URL.revokeObjectURL(photoObjectUrl)
      }
    }
  }, [photoObjectUrl])

  const introText = useMemo(() => introToText(newsletter), [newsletter])
  const activeGroupLabel =
    editorGroups.find((group) => group.id === activeGroup)?.label ?? "Editor"

  function updateNewsletter(updater: (draft: NewsletterTemplate) => void) {
    setNewsletter((current) => {
      const next = cloneNewsletter(current)
      updater(next)
      return next
    })
  }

  function updateContact(
    index: number,
    value: string,
    hrefFactory: (value: string) => string
  ) {
    updateNewsletter((draft) => {
      const fallbackContacts = ["Telefone", "E-mail", "Site"]

      while (draft.contacts.length <= index) {
        const label = fallbackContacts[draft.contacts.length] ?? "Contato"
        draft.contacts.push({ label, value: "", href: "#" })
      }

      draft.contacts[index]!.value = value
      draft.contacts[index]!.href = hrefFactory(value)
    })
  }

  function updateSocial(
    index: number,
    field: keyof NewsletterContact,
    value: string
  ) {
    updateNewsletter((draft) => {
      if (!draft.socialLinks[index]) {
        draft.socialLinks[index] = { label: "Rede social", value: "", href: "#" }
      }

      draft.socialLinks[index]![field] = value
    })
  }

  function updateSections(sections: NewsletterSection[]) {
    updateNewsletter((draft) => {
      draft.sections = sections
    })
  }

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    const nextUrl = URL.createObjectURL(file)
    setPhotoObjectUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl)
      }
      return nextUrl
    })

    updateNewsletter((draft) => {
      draft.attorney.photoUrl = nextUrl
      draft.attorney.photoAlt = file.name
    })
    event.target.value = ""
  }

  function removePhoto() {
    if (photoObjectUrl) {
      URL.revokeObjectURL(photoObjectUrl)
      setPhotoObjectUrl(null)
    }

    updateNewsletter((draft) => {
      draft.attorney.photoUrl = undefined
      draft.attorney.photoAlt = undefined
    })
  }

  function restoreDefaultTemplate() {
    if (photoObjectUrl) {
      URL.revokeObjectURL(photoObjectUrl)
      setPhotoObjectUrl(null)
    }
    setNewsletter(
      cloneNewsletter({
        ...initialNewsletter,
        sections: getNewsletterSections(initialNewsletter),
      })
    )
    setPreviewMode("edit")
    setActiveGroup("order")
  }

  async function runNewsletterAction(
    action: NewsletterEditorAction | undefined,
    fallbackConsoleLabel: string,
    successMessage: string
  ) {
    setFeedback(null)

    if (!action) {
      console.log(fallbackConsoleLabel, newsletter)
      setFeedback("JSON do rascunho enviado para o console.")
      return
    }

    setIsSaving(true)
    const result = await action(newsletter)
    setIsSaving(false)

    if (!result.ok) {
      setFeedback(result.error ?? "Não foi possível salvar este informativo.")
      return
    }

    if (result.status) {
      setStatus(result.status)
    }

    setFeedback(successMessage)

    if (result.redirectTo) {
      router.push(result.redirectTo)
    } else {
      router.refresh()
    }
  }

  function saveDraft() {
    void runNewsletterAction(
      onSaveDraft,
      "Informativo rascunho",
      "Rascunho salvo."
    )
  }

  function publishNewsletter() {
    void runNewsletterAction(
      onPublish,
      "Informativo publicado",
      "Informativo publicado."
    )
  }

  function unpublishNewsletter() {
    void runNewsletterAction(
      onUnpublish,
      "Informativo voltou para rascunho",
      "Informativo voltou para rascunho."
    )
  }

  const statusLabel =
    status === "published"
      ? "Publicado"
      : isPersisted
        ? "Rascunho salvo"
        : "Rascunho local"

  return (
    <main className="min-h-screen bg-[#F7F5EE] text-[#1F1F1A]">
      <header className="sticky top-0 z-50 border-b border-[#B7B783] bg-[#ECE8D8]/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <Button
              asChild
              className="border-[#B7B783] bg-[#F7F5EE]/70 text-[#163B35] hover:bg-[#F7F5EE]"
              size="sm"
              variant="outline"
            >
              <Link href={backHref}>
                <ArrowLeft />
                Voltar
              </Link>
            </Button>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#244F49]">
                Informativo Jurídico Digital
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-semibold tracking-[-0.02em]">
                  Novo informativo
                </h1>
                <span className="rounded-full border border-[#B7B783] bg-[#F7F5EE] px-2.5 py-1 text-xs font-semibold text-[#244F49]">
                  {statusLabel}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              className="border-[#B7B783] bg-[#F7F5EE]/70 text-[#163B35] hover:bg-[#F7F5EE]"
              onClick={() =>
                setPreviewMode((current) =>
                  current === "edit" ? "public" : "edit"
                )
              }
              variant="outline"
            >
              {previewMode === "edit" ? <Eye /> : <Pencil />}
              {previewMode === "edit" ? "Visualizar" : "Editar"}
            </Button>
            <Button
              className="border-[#B7B783] bg-[#F7F5EE]/70 text-[#163B35] hover:bg-[#F7F5EE]"
              disabled={isSaving}
              onClick={restoreDefaultTemplate}
              variant="outline"
            >
              <RotateCcw />
              Restaurar modelo
            </Button>
            {onPublish && status !== "published" && (
              <Button
                className="border-[#B7B783] bg-[#B7B783] text-[#163B35] hover:bg-[#C9C99A]"
                disabled={isSaving}
                onClick={publishNewsletter}
                variant="outline"
              >
                Publicar
              </Button>
            )}
            {onUnpublish && status === "published" && (
              <Button
                className="border-[#B7B783] bg-[#F7F5EE]/70 text-[#163B35] hover:bg-[#F7F5EE]"
                disabled={isSaving}
                onClick={unpublishNewsletter}
                variant="outline"
              >
                Voltar para rascunho
              </Button>
            )}
            <Button
              className="bg-[#163B35] text-[#F7F5EE] hover:bg-[#244F49]"
              disabled={isSaving}
              onClick={saveDraft}
            >
              <Save />
              {isSaving ? "Salvando..." : "Salvar rascunho"}
            </Button>
          </div>
        </div>
        {feedback && (
          <p className="mx-auto mt-2 w-full max-w-[1440px] text-xs font-medium text-[#244F49]">
            {feedback}
          </p>
        )}
      </header>

      <div
        className={cn(
          "mx-auto grid w-full max-w-[1440px] gap-6 px-4 py-6 lg:px-6",
          previewMode === "edit"
            ? "lg:grid-cols-[420px_minmax(0,1fr)]"
            : "grid-cols-1"
        )}
      >
        {previewMode === "edit" && (
          <EditorPanel
            activeGroup={activeGroup}
            activeGroupLabel={activeGroupLabel}
            handlePhotoChange={handlePhotoChange}
            introText={introText}
            newsletter={newsletter}
            removePhoto={removePhoto}
            setActiveGroup={setActiveGroup}
            updateContact={updateContact}
            updateNewsletter={updateNewsletter}
            updateSections={updateSections}
            updateSocial={updateSocial}
          />
        )}

        <section
          className={cn(
            "min-w-0 overflow-hidden border border-[#B7B783]/70 bg-[#F7F5EE] shadow-[0_18px_60px_rgba(22,59,53,0.10)]",
            previewMode === "public" && "border-0 shadow-none"
          )}
        >
          <NewsletterRenderer newsletter={newsletter} mode={previewMode} />
        </section>
      </div>
    </main>
  )
}

type EditorPanelProps = {
  newsletter: NewsletterTemplate
  introText: string
  activeGroup: EditorGroup
  activeGroupLabel: string
  setActiveGroup: (group: EditorGroup) => void
  updateNewsletter: (updater: (draft: NewsletterTemplate) => void) => void
  updateSections: (sections: NewsletterSection[]) => void
  updateContact: (
    index: number,
    value: string,
    hrefFactory: (value: string) => string
  ) => void
  updateSocial: (
    index: number,
    field: keyof NewsletterContact,
    value: string
  ) => void
  handlePhotoChange: (event: ChangeEvent<HTMLInputElement>) => void
  removePhoto: () => void
}

function EditorPanel({
  activeGroup,
  activeGroupLabel,
  handlePhotoChange,
  introText,
  newsletter,
  removePhoto,
  setActiveGroup,
  updateContact,
  updateNewsletter,
  updateSections,
  updateSocial,
}: EditorPanelProps) {
  return (
    <aside className="h-fit space-y-4 lg:sticky lg:top-24">
      <section className="border border-[#B7B783]/80 bg-white/80 p-3 shadow-[0_10px_30px_rgba(22,59,53,0.06)]">
        <p className="px-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#6D714C]">
          Áreas editáveis
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {editorGroups.map((group) => (
            <button
              key={group.id}
              className={cn(
                "px-3 py-2 text-left text-sm font-semibold transition-colors",
                activeGroup === group.id
                  ? "bg-[#163B35] text-[#F7F5EE]"
                  : "bg-[#F7F5EE] text-[#244F49] hover:bg-[#ECE8D8]"
              )}
              onClick={() => setActiveGroup(group.id)}
              type="button"
            >
              {group.label}
            </button>
          ))}
        </div>
      </section>

      <EditorSection title={activeGroupLabel}>
        {activeGroup === "order" && (
          <NewsletterSectionSorter
            sections={getNewsletterSections(newsletter)}
            onChange={updateSections}
          />
        )}

        {activeGroup === "header" && (
          <>
            <EditorGrid>
              <TextField
                label="Coleção"
                placeholder="Ex.: COLEÇÃO 2026"
                value={newsletter.header.collection}
                onChange={(value) =>
                  updateNewsletter((draft) => {
                    draft.header.collection = value
                  })
                }
              />
              <TextField
                label="Mês/semana"
                placeholder="Ex.: MAIO · SEMANA 2"
                value={newsletter.header.period}
                onChange={(value) =>
                  updateNewsletter((draft) => {
                    draft.header.period = value
                  })
                }
              />
              <TextField
                label="Número da edição"
                placeholder="Ex.: 02 / 2026"
                value={newsletter.header.issue}
                onChange={(value) =>
                  updateNewsletter((draft) => {
                    draft.header.issue = value
                  })
                }
              />
              <TextField
                label="Área do tema"
                placeholder="Ex.: Direito Condominial"
                value={newsletter.category}
                onChange={(value) =>
                  updateNewsletter((draft) => {
                    draft.category = value
                  })
                }
              />
            </EditorGrid>
            <TextField
              label="Faixa institucional"
              placeholder="Texto da faixa verde"
              value={newsletter.banner}
              onChange={(value) =>
                updateNewsletter((draft) => {
                  draft.banner = value
                })
              }
            />
          </>
        )}

        {activeGroup === "hero" && (
          <>
            <TextField
              label="Título principal"
              placeholder="Título do informativo"
              value={newsletter.title}
              onChange={(value) =>
                updateNewsletter((draft) => {
                  draft.title = value
                })
              }
            />
            <TextField
              label="Destaque principal"
              placeholder="Frase de impacto"
              value={newsletter.highlight}
              onChange={(value) =>
                updateNewsletter((draft) => {
                  draft.highlight = value
                })
              }
            />
            <TextAreaField
              label="Parágrafo introdutório"
              minRows={6}
              placeholder="Explique o contexto jurídico em linguagem clara."
              value={introText}
              onChange={(value) =>
                updateNewsletter((draft) => {
                  draft.intro = [{ text: value }]
                })
              }
            />
          </>
        )}

        {activeGroup === "content" && (
          <>
            {newsletter.bodyBlocks.map((block, index) => (
              <NestedEditor
                key={`${block.title}-${index}`}
                title={`Bloco explicativo ${index + 1}`}
              >
                <TextField
                  label="Título"
                  placeholder="Título do bloco"
                  value={block.title}
                  onChange={(value) =>
                    updateNewsletter((draft) => {
                      draft.bodyBlocks[index].title = value
                    })
                  }
                />
                <TextAreaField
                  label="Parágrafos"
                  minRows={8}
                  placeholder="Separe parágrafos com uma linha em branco."
                  value={block.paragraphs.join("\n\n")}
                  onChange={(value) =>
                    updateNewsletter((draft) => {
                      draft.bodyBlocks[index].paragraphs =
                        textToParagraphs(value)
                    })
                  }
                />
              </NestedEditor>
            ))}
          </>
        )}

        {activeGroup === "legal" && (
          <>
            {newsletter.decisionTopics.map((topic, index) => (
              <NestedEditor
                key={`${topic.title}-${index}`}
                title={`Tópico jurídico ${index + 1}`}
              >
                <TextField
                  label="Título"
                  placeholder="Título do tópico"
                  value={topic.title}
                  onChange={(value) =>
                    updateNewsletter((draft) => {
                      draft.decisionTopics[index].title = value
                    })
                  }
                />
                <TextAreaField
                  label="Descrição"
                  placeholder="Descrição objetiva"
                  value={topic.description}
                  onChange={(value) =>
                    updateNewsletter((draft) => {
                      draft.decisionTopics[index].description = value
                    })
                  }
                />
              </NestedEditor>
            ))}

            <TextField
              label="Título dos cards"
              placeholder="Ex.: O que todo síndico precisa saber"
              value={newsletter.syndicTitle}
              onChange={(value) =>
                updateNewsletter((draft) => {
                  draft.syndicTitle = value
                })
              }
            />
            {newsletter.syndicCards.map((card, index) => (
              <NestedEditor
                key={`${card.number}-${index}`}
                title={`Card ${index + 1}`}
              >
                <EditorGrid>
                  <TextField
                    label="Número"
                    placeholder="01"
                    value={card.number}
                    onChange={(value) =>
                      updateNewsletter((draft) => {
                        draft.syndicCards[index].number = value
                      })
                    }
                  />
                  <TextField
                    label="Título"
                    placeholder="Título do card"
                    value={card.title}
                    onChange={(value) =>
                      updateNewsletter((draft) => {
                        draft.syndicCards[index].title = value
                      })
                    }
                  />
                </EditorGrid>
                <TextAreaField
                  label="Descrição"
                  placeholder="Texto curto do card"
                  value={card.description}
                  onChange={(value) =>
                    updateNewsletter((draft) => {
                      draft.syndicCards[index].description = value
                    })
                  }
                />
              </NestedEditor>
            ))}
          </>
        )}

        {activeGroup === "cta" && (
          <>
            <TextField
              label="Chamada"
              placeholder="Chamada do CTA"
              value={newsletter.cta.title}
              onChange={(value) =>
                updateNewsletter((draft) => {
                  draft.cta.title = value
                })
              }
            />
            <TextAreaField
              label="Texto"
              placeholder="Texto de apoio do CTA"
              value={newsletter.cta.description}
              onChange={(value) =>
                updateNewsletter((draft) => {
                  draft.cta.description = value
                })
              }
            />
            <EditorGrid>
              <TextField
                label="Texto do botão"
                placeholder="Falar com o escritório"
                value={newsletter.cta.label}
                onChange={(value) =>
                  updateNewsletter((draft) => {
                    draft.cta.label = value
                  })
                }
              />
              <TextField
                label="Link do botão"
                placeholder="mailto:contato@..."
                value={newsletter.cta.href}
                onChange={(value) =>
                  updateNewsletter((draft) => {
                    draft.cta.href = value
                  })
                }
              />
            </EditorGrid>
          </>
        )}

        {activeGroup === "attorney" && (
          <>
            <div className="grid gap-2">
              <p className="text-sm font-semibold text-[#244F49]">
                Imagem do advogado
              </p>
              <div className="flex items-center gap-4 border border-[#B7B783]/50 bg-[#F7F5EE]/70 p-3">
                <div className="grid size-20 shrink-0 place-items-center overflow-hidden border border-[#B7B783] bg-white">
                  {newsletter.attorney.photoUrl ? (
                    <div
                      aria-label={
                        newsletter.attorney.photoAlt ||
                        newsletter.attorney.name ||
                        "Foto do advogado"
                      }
                      className="h-full w-full bg-cover bg-center"
                      role="img"
                      style={{
                        backgroundImage: `url(${newsletter.attorney.photoUrl})`,
                      }}
                    />
                  ) : (
                    <span className="grid size-12 place-items-center rounded-full border border-[#B7B783] bg-[#F7F5EE] text-lg font-semibold text-[#244F49]">
                      {newsletter.attorney.initials || "JJ"}
                    </span>
                  )}
                </div>
                <p className="text-xs leading-5 text-[#6D714C]">
                  A foto aparece no card profissional da sidebar. Use uma imagem
                  vertical ou retrato para melhor encaixe.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <label className="inline-flex cursor-pointer items-center gap-2 bg-[#163B35] px-3 py-2 text-sm font-semibold text-[#F7F5EE] transition-colors hover:bg-[#244F49]">
                  <Upload className="size-4" />
                  {newsletter.attorney.photoUrl
                    ? "Trocar foto"
                    : "Escolher foto"}
                  <Input
                    accept="image/*"
                    className="sr-only"
                    onChange={handlePhotoChange}
                    type="file"
                  />
                </label>
                <Button
                  className="border-[#B7B783] bg-[#F7F5EE] text-[#163B35] hover:bg-[#ECE8D8]"
                  disabled={!newsletter.attorney.photoUrl}
                  onClick={removePhoto}
                  variant="outline"
                >
                  <ImageOff />
                  Remover foto
                </Button>
              </div>
            </div>
            <TextField
              label="Nome"
              placeholder="Nome do advogado"
              value={newsletter.attorney.name}
              onChange={(value) =>
                updateNewsletter((draft) => {
                  draft.attorney.name = value
                  draft.attorney.initials = initialsFromName(value)
                })
              }
            />
            <TextField
              label="Especialidade"
              placeholder="Área de atuação"
              value={newsletter.attorney.specialty}
              onChange={(value) =>
                updateNewsletter((draft) => {
                  draft.attorney.specialty = value
                })
              }
            />
            <TextAreaField
              label="Frase"
              placeholder="Frase de posicionamento profissional"
              value={newsletter.attorney.phrase}
              onChange={(value) =>
                updateNewsletter((draft) => {
                  draft.attorney.phrase = value
                })
              }
            />
          </>
        )}

        {activeGroup === "footer" && (
          <>
            <TextField
              label="Telefone"
              placeholder="(11) 4000-2026"
              value={newsletter.contacts[0]?.value ?? ""}
              onChange={(value) => updateContact(0, value, phoneHref)}
            />
            <TextField
              label="E-mail"
              placeholder="contato@escritorio.adv.br"
              value={newsletter.contacts[1]?.value ?? ""}
              onChange={(value) => updateContact(1, value, emailHref)}
            />
            <TextField
              label="Site"
              placeholder="escritorio.adv.br"
              value={newsletter.contacts[2]?.value ?? ""}
              onChange={(value) => updateContact(2, value, websiteHref)}
            />
            <TextField
              label="Endereço"
              placeholder="Endereço institucional"
              value={newsletter.address}
              onChange={(value) =>
                updateNewsletter((draft) => {
                  draft.address = value
                })
              }
            />
            {newsletter.socialLinks.map((social, index) => (
              <NestedEditor key={social.label} title={social.label}>
                <TextField
                  label="Texto"
                  placeholder="@perfil"
                  value={social.value}
                  onChange={(value) => updateSocial(index, "value", value)}
                />
                <TextField
                  label="URL"
                  placeholder="https://..."
                  value={social.href}
                  onChange={(value) => updateSocial(index, "href", value)}
                />
              </NestedEditor>
            ))}
            <TextAreaField
              label="Fonte/referência jurídica"
              minRows={5}
              placeholder="Referência jurídica que embasa o informativo"
              value={newsletter.sourceDescription}
              onChange={(value) =>
                updateNewsletter((draft) => {
                  draft.sourceDescription = value
                })
              }
            />
          </>
        )}
      </EditorSection>
    </aside>
  )
}

type EditorSectionProps = {
  title: string
  children: ReactNode
}

function EditorSection({ children, title }: EditorSectionProps) {
  const helperText =
    title === "Ordem dos blocos"
      ? "Reorganização controlada"
      : "Editando texto e imagem"

  return (
    <section className="border border-[#B7B783]/80 bg-white/85 p-4 shadow-[0_10px_30px_rgba(22,59,53,0.06)]">
      <div className="flex items-center justify-between gap-3 border-b border-[#B7B783]/50 pb-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#163B35]">
          {title}
        </h2>
        <span className="text-xs font-medium text-[#6D714C]">{helperText}</span>
      </div>
      <div className="mt-4 grid gap-4">{children}</div>
    </section>
  )
}

type NestedEditorProps = {
  title: string
  children: ReactNode
}

function NestedEditor({ children, title }: NestedEditorProps) {
  return (
    <div className="border border-[#B7B783]/45 bg-[#F7F5EE]/80 p-3">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#6D714C]">
        {title}
      </p>
      <div className="grid gap-3">{children}</div>
    </div>
  )
}

function EditorGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2">{children}</div>
}

type TextFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

function TextField({ label, onChange, placeholder, value }: TextFieldProps) {
  return (
    <label className="grid gap-1.5 text-sm font-semibold text-[#244F49]">
      {label}
      <Input
        className="h-10 rounded-sm border-0 border-b border-[#B7B783]/80 bg-[#F7F5EE]/70 px-2 shadow-none placeholder:text-[#8A8A76] focus-visible:border-[#244F49] focus-visible:ring-2 focus-visible:ring-[#244F49]/10"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}

type TextAreaFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  minRows?: number
  placeholder?: string
}

function TextAreaField({
  label,
  minRows = 3,
  onChange,
  placeholder,
  value,
}: TextAreaFieldProps) {
  return (
    <label className="grid gap-1.5 text-sm font-semibold text-[#244F49]">
      {label}
      <Textarea
        className="rounded-sm border-0 border-b border-[#B7B783]/80 bg-[#F7F5EE]/70 px-2 shadow-none placeholder:text-[#8A8A76] focus-visible:border-[#244F49] focus-visible:ring-2 focus-visible:ring-[#244F49]/10"
        placeholder={placeholder}
        rows={minRows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}
