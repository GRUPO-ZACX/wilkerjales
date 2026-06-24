"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react"
import {
  ArrowLeft,
  ArrowUpRight,
  Copy,
  Eye,
  Laptop,
  Palette,
  Pencil,
  RotateCcw,
  Redo2,
  Save,
  Send,
  Smartphone,
  Undo2,
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

const HISTORY_LIMIT = 100

function cloneNewsletter(newsletter: NewsletterTemplate): NewsletterTemplate {
  return JSON.parse(JSON.stringify(newsletter)) as NewsletterTemplate
}

function createEditorInitialNewsletter(newsletter: NewsletterTemplate) {
  return cloneNewsletter({
    ...newsletter,
    sections: getNewsletterSections(newsletter),
  })
}

function serializeNewsletter(newsletter: NewsletterTemplate) {
  return JSON.stringify(newsletter)
}

function trimHistoryStack(items: NewsletterTemplate[]) {
  return items.slice(-HISTORY_LIMIT)
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
  const initialNewsletterSnapshot = createEditorInitialNewsletter(initialNewsletter)
  const initialNewsletterRef = useRef(initialNewsletterSnapshot)
  const newsletterRef = useRef(cloneNewsletter(initialNewsletterSnapshot))
  const historyRef = useRef<{
    future: NewsletterTemplate[]
    past: NewsletterTemplate[]
  }>({
    future: [],
    past: [],
  })
  const objectUrlsRef = useRef<Set<string>>(new Set())
  const [historyAvailability, setHistoryAvailability] = useState({
    canRedo: false,
    canUndo: false,
  })
  const [newsletter, setNewsletter] = useState(() =>
    cloneNewsletter(initialNewsletterSnapshot)
  )
  const [previewMode, setPreviewMode] = useState<PreviewMode>("edit")
  const [viewport, setViewport] = useState<NewsletterEditorViewport>("desktop")
  const [, setAttorneyPhotoObjectUrl] = useState<
    string | null
  >(null)
  const [, setLogoObjectUrl] = useState<string | null>(null)
  const [status, setStatus] = useState<NewsletterStatus>(initialStatus)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [copiedPublicLink, setCopiedPublicLink] = useState(false)

  useEffect(() => {
    const objectUrls = objectUrlsRef.current

    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  const syncHistory = useCallback((history: typeof historyRef.current) => {
    historyRef.current = history
    setHistoryAvailability({
      canRedo: history.future.length > 0,
      canUndo: history.past.length > 0,
    })
  }, [])

  const commitNewsletter = useCallback(
    (
      nextNewsletter: NewsletterTemplate,
      options?: { recordHistory?: boolean }
    ) => {
      const currentNewsletter = newsletterRef.current

      if (
        serializeNewsletter(currentNewsletter) ===
        serializeNewsletter(nextNewsletter)
      ) {
        return
      }

      if (options?.recordHistory !== false) {
        syncHistory({
          future: [],
          past: trimHistoryStack([
            ...historyRef.current.past,
            cloneNewsletter(currentNewsletter),
          ]),
        })
      }

      newsletterRef.current = cloneNewsletter(nextNewsletter)
      setNewsletter(cloneNewsletter(nextNewsletter))
    },
    [syncHistory]
  )

  const updateNewsletter = useCallback(
    (updater: (draft: NewsletterTemplate) => void) => {
      const nextNewsletter = cloneNewsletter(newsletterRef.current)
      updater(nextNewsletter)
      commitNewsletter(nextNewsletter)
    },
    [commitNewsletter]
  )

  const undoNewsletterChange = useCallback(() => {
    const previousNewsletter = historyRef.current.past.at(-1)

    if (!previousNewsletter) {
      return
    }

    syncHistory({
      future: [
        cloneNewsletter(newsletterRef.current),
        ...historyRef.current.future,
      ].slice(0, HISTORY_LIMIT),
      past: historyRef.current.past.slice(0, -1),
    })
    newsletterRef.current = cloneNewsletter(previousNewsletter)
    setNewsletter(cloneNewsletter(previousNewsletter))
    setFeedback("Alteração desfeita.")
  }, [syncHistory])

  const redoNewsletterChange = useCallback(() => {
    const nextNewsletter = historyRef.current.future[0]

    if (!nextNewsletter) {
      return
    }

    syncHistory({
      future: historyRef.current.future.slice(1),
      past: trimHistoryStack([
        ...historyRef.current.past,
        cloneNewsletter(newsletterRef.current),
      ]),
    })
    newsletterRef.current = cloneNewsletter(nextNewsletter)
    setNewsletter(cloneNewsletter(nextNewsletter))
    setFeedback("Alteração refeita.")
  }, [syncHistory])

  useEffect(() => {
    function handleUndoRedoShortcut(event: KeyboardEvent) {
      const key = event.key.toLowerCase()

      if (key !== "z" || (!event.ctrlKey && !event.metaKey) || event.altKey) {
        return
      }

      const target = event.target

      if (target instanceof HTMLInputElement && target.type !== "range") {
        return
      }

      if (
        target instanceof HTMLElement &&
        target.closest("[data-rich-text-editor='true']")
      ) {
        return
      }

      event.preventDefault()

      if (event.shiftKey) {
        redoNewsletterChange()
        return
      }

      undoNewsletterChange()
    }

    window.addEventListener("keydown", handleUndoRedoShortcut)

    return () => {
      window.removeEventListener("keydown", handleUndoRedoShortcut)
    }
  }, [redoNewsletterChange, undoNewsletterChange])

  function handleAttorneyPhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const nextUrl = URL.createObjectURL(file)
    objectUrlsRef.current.add(nextUrl)
    setAttorneyPhotoObjectUrl(nextUrl)

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
    objectUrlsRef.current.add(nextUrl)
    setLogoObjectUrl(nextUrl)

    updateNewsletter((draft) => {
      draft.firm.logoUrl = nextUrl
      draft.firm.logoAlt = file.name
    })
    event.target.value = ""
  }

  function removeAttorneyPhoto() {
    setAttorneyPhotoObjectUrl(null)

    updateNewsletter((draft) => {
      draft.attorney.photoUrl = undefined
      draft.attorney.photoAlt = undefined
    })
  }

  function removeLogo() {
    setLogoObjectUrl(null)

    updateNewsletter((draft) => {
      draft.firm.logoUrl = undefined
      draft.firm.logoAlt = undefined
    })
  }

  function restoreDefaultTemplate() {
    setAttorneyPhotoObjectUrl(null)
    setLogoObjectUrl(null)

    syncHistory({
      future: [],
      past: [],
    })
    const restoredNewsletter = cloneNewsletter(initialNewsletterRef.current)
    newsletterRef.current = restoredNewsletter
    setNewsletter(cloneNewsletter(restoredNewsletter))
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

  async function copyPublicLink() {
    const publicHref = `/informativo/${newsletter.slug}`

    await navigator.clipboard.writeText(`${window.location.origin}${publicHref}`)
    setCopiedPublicLink(true)
    window.setTimeout(() => setCopiedPublicLink(false), 1600)
  }

  const statusLabel =
    status === "published"
      ? "Publicado"
      : isPersisted
        ? "Rascunho salvo"
        : "Rascunho local"
  const isEditing = previewMode === "edit"
  const { canRedo, canUndo } = historyAvailability
  const publicHref = `/informativo/${newsletter.slug}`

  return (
    <main className="min-h-screen bg-neutral-50 text-black">
      <header className="sticky top-0 z-50 border-b border-black/10 bg-white/95 px-4 py-3 text-black backdrop-blur sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-[1520px] flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <Button
              asChild
              className="border-black/15 bg-white text-black hover:bg-black/5"
              size="sm"
              variant="outline"
            >
              <Link href={backHref}>
                <ArrowLeft />
                Voltar
              </Link>
            </Button>

            <div className="min-w-0">
              <p className="truncate text-xs font-semibold uppercase tracking-[0.16em] text-black/50">
                Editor no próprio informativo
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-lg font-semibold tracking-[-0.02em] text-black sm:text-xl">
                  {newsletter.title.trim() || "Novo informativo"}
                </h1>
                <span className="rounded-full border border-black/10 bg-black/[0.03] px-2.5 py-1 text-xs font-semibold text-black/70">
                  {statusLabel}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-lg border border-black/10 bg-black/[0.03] p-1">
              <button
                className={cn(
                  "inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-semibold text-black/70 transition-colors hover:text-black",
                  viewport === "desktop" && "bg-black text-white hover:text-white"
                )}
                onClick={() => setViewport("desktop")}
                type="button"
              >
                <Laptop className="size-4" />
                Desktop
              </button>
              <button
                className={cn(
                  "inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-semibold text-black/70 transition-colors hover:text-black",
                  viewport === "mobile" && "bg-black text-white hover:text-white"
                )}
                onClick={() => setViewport("mobile")}
                type="button"
              >
                <Smartphone className="size-4" />
                Mobile
              </button>
            </div>

            <EditorIconButton
              label={isEditing ? "Visualizar" : "Editar"}
              onClick={() =>
                setPreviewMode((current) =>
                  current === "edit" ? "public" : "edit"
                )
              }
            >
              {isEditing ? <Eye /> : <Pencil />}
            </EditorIconButton>

            <div className="inline-flex overflow-hidden rounded-lg border border-black/15 bg-white">
              <Button
                className="rounded-none border-0 bg-white text-black hover:bg-black/5"
                disabled={isSaving}
                onClick={restoreDefaultTemplate}
                variant="outline"
              >
                <RotateCcw />
                Restaurar
              </Button>
              <button
                aria-label="Desfazer alteração"
                className="grid size-9 place-items-center border-l border-black/10 text-black/70 transition-colors hover:bg-black/5 hover:text-black disabled:cursor-not-allowed disabled:opacity-35"
                disabled={!canUndo || isSaving}
                onClick={undoNewsletterChange}
                title="Desfazer alteração (Ctrl/⌘ + Z)"
                type="button"
              >
                <Undo2 className="size-4" />
              </button>
              <button
                aria-label="Refazer alteração"
                className="grid size-9 place-items-center border-l border-black/10 text-black/70 transition-colors hover:bg-black/5 hover:text-black disabled:cursor-not-allowed disabled:opacity-35"
                disabled={!canRedo || isSaving}
                onClick={redoNewsletterChange}
                title="Refazer alteração (Ctrl/⌘ + Shift + Z)"
                type="button"
              >
                <Redo2 className="size-4" />
              </button>
            </div>

            <AppearancePopover
              background={newsletter.theme?.background ?? "#F7F5EE"}
              text={newsletter.theme?.text ?? "#1F1F1A"}
              onBackgroundChange={(background) =>
                updateNewsletter((draft) => {
                  draft.theme = {
                    ...(draft.theme ?? {}),
                    background,
                  }
                })
              }
              onTextChange={(text) =>
                updateNewsletter((draft) => {
                  draft.theme = {
                    ...(draft.theme ?? {}),
                    text,
                  }
                })
              }
            />

            <EditorIconButton
              className="bg-black text-white hover:bg-black/80"
              disabled={isSaving}
              label={isSaving ? "Salvando" : "Salvar rascunho"}
              onClick={saveDraft}
            >
              <Save />
            </EditorIconButton>

            {onPublish && status !== "published" && (
              <Button
                className="border-black bg-black text-white hover:bg-black/80"
                disabled={isSaving}
                onClick={publishNewsletter}
                variant="outline"
              >
                <Send />
                Publicar
              </Button>
            )}

            {onUnpublish && status === "published" && (
              <>
                <div className="inline-flex overflow-hidden rounded-lg border border-black/15 bg-white">
                  <Button
                    asChild
                    aria-label="Abrir link público"
                    className="rounded-none border-0 bg-white text-black hover:bg-black/5"
                    size="icon-lg"
                    title="Abrir link público"
                    variant="outline"
                  >
                    <Link href={publicHref} target="_blank">
                      <ArrowUpRight />
                    </Link>
                  </Button>
                  <Button
                    aria-label="Copiar link público"
                    className="rounded-none border-0 border-l border-black/10 bg-white text-black hover:bg-black/5"
                    disabled={isSaving}
                    size="icon-lg"
                    title="Copiar link público"
                    type="button"
                    variant="outline"
                    onClick={copyPublicLink}
                  >
                    <Copy />
                  </Button>
                </div>

                <Button
                  className="border-black/15 bg-white text-black hover:bg-black/5"
                  disabled={isSaving}
                  onClick={unpublishNewsletter}
                  variant="outline"
                >
                  Voltar para rascunho
                </Button>
              </>
            )}
          </div>
        </div>

        {(feedback || copiedPublicLink) && (
          <p className="mx-auto mt-2 w-full max-w-[1520px] text-xs font-medium text-black/60">
            {copiedPublicLink ? "Link público copiado." : feedback}
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
          {viewport === "mobile" ? (
            <div className="mx-auto rounded-[34px] border border-black/15 bg-neutral-950 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.25)]">
              <div className="mx-auto mb-2 h-1.5 w-20 rounded-full bg-white/25" />
              <div className="h-[760px] overflow-y-auto rounded-[26px] bg-[#F7F5EE]">
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
            </div>
          ) : (
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
          )}
        </div>
      </section>
    </main>
  )
}

type EditorIconButtonProps = {
  children: ReactNode
  className?: string
  disabled?: boolean
  label: string
  onClick: () => void
}

function EditorIconButton({
  children,
  className,
  disabled,
  label,
  onClick,
}: EditorIconButtonProps) {
  return (
    <Button
      aria-label={label}
      className={cn(
        "border-black/15 bg-white text-black hover:bg-black/5",
        className
      )}
      disabled={disabled}
      onClick={onClick}
      size="icon-lg"
      title={label}
      type="button"
      variant="outline"
    >
      {children}
    </Button>
  )
}

const backgroundSwatches = [
  "#F7F5EE",
  "#FFFFFF",
  "#F3F0E6",
  "#ECE8D8",
  "#F5F7F4",
]

const textSwatches = ["#1F1F1A", "#163B35", "#244F49", "#3F3F37", "#000000"]

type AppearancePopoverProps = {
  background: string
  onBackgroundChange: (value: string) => void
  onTextChange: (value: string) => void
  text: string
}

function AppearancePopover({
  background,
  onBackgroundChange,
  onTextChange,
  text,
}: AppearancePopoverProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <EditorIconButton
        label="Aparência"
        onClick={() => setIsOpen((current) => !current)}
      >
        <Palette />
      </EditorIconButton>

      {isOpen && (
        <div className="absolute right-0 top-10 z-50 w-64 rounded-xl border border-black/10 bg-white p-3 text-black shadow-[0_18px_54px_rgba(0,0,0,0.14)]">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-black/45">
            Fundo
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {backgroundSwatches.map((swatch) => (
              <SwatchButton
                key={swatch}
                active={background === swatch}
                color={swatch}
                onClick={() => onBackgroundChange(swatch)}
              />
            ))}
          </div>

          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-black/45">
            Texto base
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {textSwatches.map((swatch) => (
              <SwatchButton
                key={swatch}
                active={text === swatch}
                color={swatch}
                onClick={() => onTextChange(swatch)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

type SwatchButtonProps = {
  active: boolean
  color: string
  onClick: () => void
}

function SwatchButton({ active, color, onClick }: SwatchButtonProps) {
  return (
    <button
      className={cn(
        "size-8 rounded-full border border-black/15",
        active && "ring-2 ring-black ring-offset-2"
      )}
      onClick={onClick}
      style={{ backgroundColor: color }}
      type="button"
    />
  )
}
