"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState, type ChangeEvent } from "react"
import {
  ArrowLeft,
  Eye,
  Laptop,
  Pencil,
  RotateCcw,
  Save,
  Send,
  Smartphone,
} from "lucide-react"

import { Button } from "yes@/components/ui/button"
import { getNewsletterSections } from "yes@/lib/newsletter/sections"
import type { NewsletterTemplate } from "yes@/lib/newsletter/types"
import type { NewsletterStatus } from "yes@/lib/supabase/database.types"
import { cn } from "yes@/lib/utils"

import {
  NewsletterInlineCanvas,
  type NewsletterEditorViewport,
} from "./newsletter-inline-canvas"

type NewsletterEditorProps = {
  backHref?: string
  initialNewsletter: NewsletterTemplate
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

function cloneNewsletter(newsletter: NewsletterTemplate): NewsletterTemplate {
  return JSON.parse(JSON.stringify(newsletter)) as NewsletterTemplate
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
  const [viewport, setViewport] = useState<NewsletterEditorViewport>("desktop")
  const [attorneyPhotoObjectUrl, setAttorneyPhotoObjectUrl] = useState<
    string | null
  >(null)
  const [logoObjectUrl, setLogoObjectUrl] = useState<string | null>(null)
  const [status, setStatus] = useState<NewsletterStatus>(initialStatus)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    return () => {
      if (attorneyPhotoObjectUrl) {
        URL.revokeObjectURL(attorneyPhotoObjectUrl)
      }

      if (logoObjectUrl) {
        URL.revokeObjectURL(logoObjectUrl)
      }
    }
  }, [attorneyPhotoObjectUrl, logoObjectUrl])

  function updateNewsletter(updater: (draft: NewsletterTemplate) => void) {
    setNewsletter((current) => {
      const next = cloneNewsletter(current)
      updater(next)
      return next
    })
  }

  function handleAttorneyPhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const nextUrl = URL.createObjectURL(file)
    setAttorneyPhotoObjectUrl((currentUrl) => {
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

  function handleLogoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const nextUrl = URL.createObjectURL(file)
    setLogoObjectUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl)
      }
      return nextUrl
    })

    updateNewsletter((draft) => {
      draft.firm.logoUrl = nextUrl
      draft.firm.logoAlt = file.name
    })
    event.target.value = ""
  }

  function removeAttorneyPhoto() {
    if (attorneyPhotoObjectUrl) {
      URL.revokeObjectURL(attorneyPhotoObjectUrl)
      setAttorneyPhotoObjectUrl(null)
    }

    updateNewsletter((draft) => {
      draft.attorney.photoUrl = undefined
      draft.attorney.photoAlt = undefined
    })
  }

  function removeLogo() {
    if (logoObjectUrl) {
      URL.revokeObjectURL(logoObjectUrl)
      setLogoObjectUrl(null)
    }

    updateNewsletter((draft) => {
      draft.firm.logoUrl = undefined
      draft.firm.logoAlt = undefined
    })
  }

  function restoreDefaultTemplate() {
    if (attorneyPhotoObjectUrl) {
      URL.revokeObjectURL(attorneyPhotoObjectUrl)
      setAttorneyPhotoObjectUrl(null)
    }

    if (logoObjectUrl) {
      URL.revokeObjectURL(logoObjectUrl)
      setLogoObjectUrl(null)
    }

    setNewsletter(
      cloneNewsletter({
        ...initialNewsletter,
        sections: getNewsletterSections(initialNewsletter),
      })
    )
    setPreviewMode("edit")
    setViewport("desktop")
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
  const isEditing = previewMode === "edit"

  return (
    <main className="min-h-screen bg-[#F7F5EE] text-[#1F1F1A]">
      <header className="sticky top-0 z-50 border-b border-[#B7B783] bg-[#ECE8D8]/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-[1520px] flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
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
              <p className="truncate text-xs font-semibold uppercase tracking-[0.16em] text-[#6D714C]">
                Editor no próprio informativo
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-lg font-semibold tracking-[-0.02em] text-[#163B35] sm:text-xl">
                  {newsletter.title.trim() || "Novo informativo"}
                </h1>
                <span className="rounded-full border border-[#B7B783] bg-[#F7F5EE] px-2.5 py-1 text-xs font-semibold text-[#244F49]">
                  {statusLabel}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-lg border border-[#B7B783] bg-[#F7F5EE]/80 p-1">
              <button
                className={cn(
                  "inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-semibold text-[#244F49] transition-colors",
                  viewport === "desktop" && "bg-[#163B35] text-[#F7F5EE]"
                )}
                onClick={() => setViewport("desktop")}
                type="button"
              >
                <Laptop className="size-4" />
                Desktop
              </button>
              <button
                className={cn(
                  "inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-semibold text-[#244F49] transition-colors",
                  viewport === "mobile" && "bg-[#163B35] text-[#F7F5EE]"
                )}
                onClick={() => setViewport("mobile")}
                type="button"
              >
                <Smartphone className="size-4" />
                Mobile
              </button>
            </div>

            <Button
              className="border-[#B7B783] bg-[#F7F5EE]/70 text-[#163B35] hover:bg-[#F7F5EE]"
              onClick={() =>
                setPreviewMode((current) =>
                  current === "edit" ? "public" : "edit"
                )
              }
              variant="outline"
            >
              {isEditing ? <Eye /> : <Pencil />}
              {isEditing ? "Visualizar" : "Editar"}
            </Button>

            <Button
              className="border-[#B7B783] bg-[#F7F5EE]/70 text-[#163B35] hover:bg-[#F7F5EE]"
              disabled={isSaving}
              onClick={restoreDefaultTemplate}
              variant="outline"
            >
              <RotateCcw />
              Restaurar
            </Button>

            <Button
              className="bg-[#163B35] text-[#F7F5EE] hover:bg-[#244F49]"
              disabled={isSaving}
              onClick={saveDraft}
            >
              <Save />
              {isSaving ? "Salvando..." : "Salvar rascunho"}
            </Button>

            {onPublish && status !== "published" && (
              <Button
                className="border-[#B7B783] bg-[#B7B783] text-[#163B35] hover:bg-[#C9C99A]"
                disabled={isSaving}
                onClick={publishNewsletter}
                variant="outline"
              >
                <Send />
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
          </div>
        </div>

        {feedback && (
          <p className="mx-auto mt-2 w-full max-w-[1520px] text-xs font-medium text-[#244F49]">
            {feedback}
          </p>
        )}
      </header>

      <section className="w-full px-0 py-5 sm:py-7">
        <div
          className={cn(
            "mx-auto w-full transition-all duration-300",
            viewport === "mobile"
              ? "max-w-[430px] px-3"
              : "max-w-none px-0"
          )}
        >
          <NewsletterInlineCanvas
            editable={isEditing}
            newsletter={newsletter}
            viewport={viewport}
            onAttorneyPhotoChange={handleAttorneyPhotoChange}
            onChange={updateNewsletter}
            onLogoChange={handleLogoChange}
            onRemoveAttorneyPhoto={removeAttorneyPhoto}
            onRemoveLogo={removeLogo}
          />
        </div>
      </section>
    </main>
  )
}
