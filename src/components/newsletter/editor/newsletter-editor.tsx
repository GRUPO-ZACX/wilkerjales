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
  ClipboardPaste,
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
import {
  NEWSLETTER_CONTENT_IMPORT_AI_MEMORY,
  parseNewsletterContentImport,
} from "yes@/lib/newsletter/content-import"
import {
  ACCEPTED_RASTER_IMAGE_TYPES,
  createImageUploadRejectedMessage,
  imageFileToDataUrl,
  isAcceptedImageFile,
  MAX_SAVED_IMAGE_LENGTH,
  MAX_SOURCE_IMAGE_SIZE,
} from "yes@/lib/newsletter/browser-image"
import { defaultNewsletterImageCrop } from "yes@/lib/newsletter/image-crop"
import {
  applyNewsletterProfile,
  defaultNewsletterProfile,
  normalizeNewsletterProfile,
  type NewsletterProfile,
} from "yes@/lib/newsletter/profile"
import { getNewsletterSections } from "yes@/lib/newsletter/sections"
import type {
  NewsletterImageCrop,
  NewsletterTemplate,
} from "yes@/lib/newsletter/types"
import type { NewsletterStatus } from "yes@/lib/supabase/database.types"
import { cn } from "yes@/lib/utils"

import {
  NewsletterInlineCanvas,
  type NewsletterEditorViewport,
} from "./newsletter-inline-canvas"
import { PhotoCropDialog } from "./photo-crop-dialog"
import { ImageUploadWarning } from "./image-upload-warning"

type NewsletterEditorProps = {
  backHref?: string
  initialNewsletter: NewsletterTemplate
  initialProfile?: NewsletterProfile
  initialStatus?: NewsletterStatus
  isPersisted?: boolean
  onPublish?: NewsletterEditorAction
  onSaveDraft?: NewsletterEditorAction
  onSaveProfile?: NewsletterProfileEditorAction
  onUnpublish?: NewsletterEditorAction
}

export type NewsletterEditorAction = (
  newsletter: NewsletterTemplate,
) => Promise<{
  ok: boolean
  error?: string
  publicHref?: string
  redirectTo?: string
  status?: NewsletterStatus
}>

type PreviewMode = "edit" | "public"

const HISTORY_LIMIT = 100
const COVER_IMAGE_MAX_EDGE = 1600
const COVER_IMAGE_MAX_SAVED_LENGTH = 520_000

type NewsletterProfileEditorAction = (
  profile: NewsletterProfile,
) => Promise<{
  ok: boolean
  error?: string
  profile?: NewsletterProfile
}>

type PendingCropUpload = {
  imageAlt: string
  imageUrl: string
  kind: "attorney" | "cover"
}

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
  initialProfile = defaultNewsletterProfile,
  initialStatus = "draft",
  isPersisted = false,
  onPublish,
  onSaveDraft,
  onSaveProfile,
  onUnpublish,
}: NewsletterEditorProps) {
  const router = useRouter()
  const [fixedProfile, setFixedProfile] = useState<NewsletterProfile>(() =>
    normalizeNewsletterProfile(initialProfile),
  )
  const fixedProfileRef = useRef(fixedProfile)
  const initialNewsletterSnapshot = createEditorInitialNewsletter(
    applyNewsletterProfile(initialNewsletter, fixedProfile),
  )
  const initialNewsletterRef = useRef(initialNewsletterSnapshot)
  const newsletterRef = useRef(cloneNewsletter(initialNewsletterSnapshot))
  const historyRef = useRef<{
    future: NewsletterTemplate[]
    past: NewsletterTemplate[]
  }>({
    future: [],
    past: [],
  })
  const [historyAvailability, setHistoryAvailability] = useState({
    canRedo: false,
    canUndo: false,
  })
  const [newsletter, setNewsletter] = useState(() =>
    cloneNewsletter(initialNewsletterSnapshot),
  )
  const [previewMode, setPreviewMode] = useState<PreviewMode>("edit")
  const [viewport, setViewport] = useState<NewsletterEditorViewport>("desktop")
  const [status, setStatus] = useState<NewsletterStatus>(initialStatus)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [imageUploadWarning, setImageUploadWarning] = useState<string | null>(
    null,
  )
  const [isSaving, setIsSaving] = useState(false)
  const [copiedPublicLink, setCopiedPublicLink] = useState(false)
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [contentImportDraft, setContentImportDraft] = useState("")
  const [showMemoryCopied, setShowMemoryCopied] = useState(false)
  const memoryCopiedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  )
  const [pendingCropUpload, setPendingCropUpload] =
    useState<PendingCropUpload | null>(null)

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
      options?: { recordHistory?: boolean },
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
    [syncHistory],
  )

  useEffect(() => {
    const profiledNewsletter = applyNewsletterProfile(
      newsletterRef.current,
      fixedProfile,
    )

    commitNewsletter(profiledNewsletter, { recordHistory: false })
  }, [commitNewsletter, fixedProfile])

  const updateNewsletter = useCallback(
    (updater: (draft: NewsletterTemplate) => void) => {
      const nextNewsletter = cloneNewsletter(newsletterRef.current)
      updater(nextNewsletter)
      commitNewsletter(nextNewsletter)
    },
    [commitNewsletter],
  )

  function updateFixedProfile(nextProfile: NewsletterProfile) {
    fixedProfileRef.current = nextProfile
    setFixedProfile(nextProfile)
  }

  function showImageUploadRejected(message: string) {
    setFeedback(message)
    setImageUploadWarning(message)
  }

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

  useEffect(() => {
    return () => {
      if (memoryCopiedTimeoutRef.current) {
        clearTimeout(memoryCopiedTimeoutRef.current)
      }
    }
  }, [])

  async function saveFixedProfile(
    nextProfile: NewsletterProfile,
    successMessage: string,
  ) {
    const normalizedProfile = normalizeNewsletterProfile(nextProfile)
    const profiledNewsletter = applyNewsletterProfile(
      newsletterRef.current,
      normalizedProfile,
    )

    updateFixedProfile(normalizedProfile)
    commitNewsletter(profiledNewsletter)

    if (!onSaveProfile) {
      setFeedback(successMessage)
      return
    }

    setIsSaving(true)
    let result: Awaited<ReturnType<NewsletterProfileEditorAction>>

    try {
      result = await onSaveProfile(normalizedProfile)
    } catch {
      setFeedback("Não foi possível salvar a configuração agora.")
      setIsSaving(false)
      return
    }

    setIsSaving(false)

    if (!result.ok) {
      setFeedback(result.error ?? "Não foi possível salvar a configuração.")
      return
    }

    const savedProfile = normalizeNewsletterProfile(
      result.profile ?? normalizedProfile,
    )
    updateFixedProfile(savedProfile)
    commitNewsletter(applyNewsletterProfile(newsletterRef.current, savedProfile))
    setFeedback(successMessage)
  }

  async function handleAttorneyPhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (!isAcceptedImageFile(file, ACCEPTED_RASTER_IMAGE_TYPES)) {
      showImageUploadRejected(createImageUploadRejectedMessage("foto", "format"))
      event.target.value = ""
      return
    }

    if (file.size > MAX_SOURCE_IMAGE_SIZE) {
      showImageUploadRejected(
        createImageUploadRejectedMessage("foto", "source-size", file),
      )
      event.target.value = ""
      return
    }

    try {
      const nextUrl = await imageFileToDataUrl(file)

      if (nextUrl.length > MAX_SAVED_IMAGE_LENGTH) {
        showImageUploadRejected(
          createImageUploadRejectedMessage("foto", "saved-size", file),
        )
        event.target.value = ""
        return
      }

      setPendingCropUpload({
        imageAlt: file.name,
        imageUrl: nextUrl,
        kind: "attorney",
      })
      setFeedback("Ajuste o corte da foto antes de aplicar.")
    } catch {
      showImageUploadRejected(createImageUploadRejectedMessage("foto", "read"))
    } finally {
      event.target.value = ""
    }
  }

  async function handleCoverImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (!isAcceptedImageFile(file, ACCEPTED_RASTER_IMAGE_TYPES)) {
      showImageUploadRejected(
        createImageUploadRejectedMessage("banner", "format"),
      )
      event.target.value = ""
      return
    }

    if (file.size > MAX_SOURCE_IMAGE_SIZE) {
      showImageUploadRejected(
        createImageUploadRejectedMessage("banner", "source-size", file),
      )
      event.target.value = ""
      return
    }

    try {
      const nextUrl = await imageFileToDataUrl(file, {
        initialQuality: 0.82,
        maxEdge: COVER_IMAGE_MAX_EDGE,
        maxSavedLength: COVER_IMAGE_MAX_SAVED_LENGTH,
        minQuality: 0.5,
      })

      if (nextUrl.length > COVER_IMAGE_MAX_SAVED_LENGTH) {
        showImageUploadRejected(
          createImageUploadRejectedMessage("banner", "saved-size", file),
        )
        event.target.value = ""
        return
      }

      setPendingCropUpload({
        imageAlt: file.name,
        imageUrl: nextUrl,
        kind: "cover",
      })
      setFeedback("Ajuste o corte do banner antes de aplicar.")
    } catch {
      showImageUploadRejected(createImageUploadRejectedMessage("banner", "read"))
    } finally {
      event.target.value = ""
    }
  }

  function removeCoverImage() {
    updateNewsletter((draft) => {
      draft.cover = {
        ...(draft.cover ?? {}),
        crop: defaultNewsletterImageCrop,
        imageAlt: undefined,
        imageUrl: undefined,
      }
    })
    setFeedback("Banner removido. Clique em salvar para aplicar.")
  }

  function saveCoverImageCrop(crop: NewsletterImageCrop) {
    updateNewsletter((draft) => {
      draft.cover = {
        ...(draft.cover ?? {}),
        crop,
      }
    })
    setFeedback("Corte do banner ajustado. Clique em salvar para aplicar.")
  }

  async function applyPendingCropUpload(crop: NewsletterImageCrop) {
    if (!pendingCropUpload) {
      return
    }

    if (pendingCropUpload.kind === "attorney") {
      await saveFixedProfile(
        {
          ...fixedProfileRef.current,
          attorneyPhotoAlt: pendingCropUpload.imageAlt,
          attorneyPhotoCrop: crop,
          attorneyPhotoUrl: pendingCropUpload.imageUrl,
        },
        "Foto do advogado salva nas configurações globais.",
      )
      setPendingCropUpload(null)
      return
    }

    updateNewsletter((draft) => {
      draft.cover = {
        ...(draft.cover ?? {}),
        crop,
        imageAlt: pendingCropUpload.imageAlt,
        imageUrl: pendingCropUpload.imageUrl,
      }
    })
    setPendingCropUpload(null)
    setFeedback("Banner aplicado. Clique em salvar para publicar a mudança.")
  }

  function removeAttorneyPhoto() {
    void saveFixedProfile(
      {
        ...fixedProfileRef.current,
        attorneyPhotoAlt: defaultNewsletterProfile.attorneyPhotoAlt,
        attorneyPhotoCrop: defaultNewsletterImageCrop,
        attorneyPhotoUrl: defaultNewsletterProfile.attorneyPhotoUrl,
      },
      "Foto padrão restaurada nas configurações globais.",
    )
  }

  function restoreDefaultTemplate() {
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
    successMessage: string,
  ) {
    setFeedback(null)
    const newsletterForAction = applyNewsletterProfile(
      newsletterRef.current,
      fixedProfileRef.current,
    )

    commitNewsletter(newsletterForAction, { recordHistory: false })

    if (!action) {
      console.log(fallbackConsoleLabel, newsletterForAction)
      setFeedback("JSON do rascunho enviado para o console.")
      return
    }

    setIsSaving(true)
    let result: Awaited<ReturnType<NewsletterEditorAction>>

    try {
      result = await action(newsletterForAction)
    } catch {
      setFeedback("Não foi possível concluir a ação agora.")
      setIsSaving(false)
      return
    }

    setIsSaving(false)

    if (!result.ok) {
      setFeedback(result.error ?? "Não foi possível salvar este informativo.")
      return
    }

    if (result.status) {
      setStatus(result.status)
    }

    setFeedback(
      result.status === "published"
        ? "Informativo publicado. Ele já aparece em Publicações."
        : successMessage,
    )

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
      status === "published"
        ? "Alterações salvas no informativo publicado."
        : "Rascunho salvo.",
    )
  }

  function publishNewsletter() {
    void runNewsletterAction(
      onPublish,
      "Informativo publicado",
      "Informativo publicado.",
    )
  }

  function unpublishNewsletter() {
    void runNewsletterAction(
      onUnpublish,
      "Informativo voltou para rascunho",
      "Informativo voltou para rascunho.",
    )
  }

  async function copyPublicLink() {
    const publicHref = `/informativo/${newsletter.slug}`

    await navigator.clipboard.writeText(
      `${window.location.origin}${publicHref}`,
    )
    setCopiedPublicLink(true)
    window.setTimeout(() => setCopiedPublicLink(false), 1600)
  }

  async function copyAiMemory() {
    try {
      await navigator.clipboard.writeText(NEWSLETTER_CONTENT_IMPORT_AI_MEMORY)
    } catch {
      setFeedback("Não foi possível copiar a memória agora.")
      return
    }

    setIsImportOpen(false)
    setShowMemoryCopied(true)

    if (memoryCopiedTimeoutRef.current) {
      clearTimeout(memoryCopiedTimeoutRef.current)
    }

    memoryCopiedTimeoutRef.current = setTimeout(() => {
      setShowMemoryCopied(false)
      memoryCopiedTimeoutRef.current = null
    }, 4200)
  }

  function applyContentImport() {
    const result = parseNewsletterContentImport(
      contentImportDraft,
      newsletterRef.current,
    )

    if (result.appliedFields.length === 0) {
      setFeedback("Cole um conteúdo no padrão para preencher o informativo.")
      return
    }

    const profiledNewsletter = applyNewsletterProfile(
      result.newsletter,
      fixedProfile,
    )

    commitNewsletter(profiledNewsletter)
    setFeedback(`Conteúdo aplicado: ${result.appliedFields.join(", ")}.`)
    setIsImportOpen(false)
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
  const projectTitle = newsletter.title.trim() || "Novo informativo"
  const saveLabel =
    status === "published" ? "Salvar alterações" : "Salvar rascunho"

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
                <h1 className="sr-only">{projectTitle}</h1>
                <label className="min-w-[220px] max-w-full">
                  <span className="sr-only">Nome do projeto</span>
                  <input
                    aria-label="Nome do projeto"
                    className="h-9 w-full min-w-0 rounded-lg border border-transparent bg-black/[0.03] px-2.5 text-lg font-semibold tracking-[-0.02em] text-black outline-none transition-colors placeholder:text-black/35 hover:border-black/10 focus:border-black/25 focus:bg-white focus:ring-3 focus:ring-black/10 sm:text-xl"
                    onChange={(event) =>
                      updateNewsletter((draft) => {
                        draft.title = event.target.value
                      })
                    }
                    placeholder="Nome do projeto"
                    title="Altere o nome do projeto e clique em salvar"
                    value={newsletter.title}
                  />
                </label>
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
                  viewport === "desktop" &&
                    "bg-black text-white hover:text-white",
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
                  viewport === "mobile" &&
                    "bg-black text-white hover:text-white",
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
                  current === "edit" ? "public" : "edit",
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

            <ContentImportPopover
              isOpen={isImportOpen}
              value={contentImportDraft}
              onApply={applyContentImport}
              onClose={() => setIsImportOpen(false)}
              onCopyMemory={() => void copyAiMemory()}
              onOpen={() => setIsImportOpen((current) => !current)}
              onValueChange={setContentImportDraft}
            />

            <EditorIconButton
              className="bg-black text-white hover:bg-black/80"
              disabled={isSaving}
              label={isSaving ? "Salvando" : saveLabel}
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
          <div className="mx-auto mt-2 flex w-full max-w-[1520px] flex-wrap items-center gap-2 text-xs font-medium text-black/60">
            <span>{copiedPublicLink ? "Link público copiado." : feedback}</span>
            {status === "published" ? (
              <Link
                className="font-semibold text-black underline-offset-4 hover:underline"
                href="/publicacoes"
                target="_blank"
              >
                Ver em Publicações
              </Link>
            ) : null}
          </div>
        )}
      </header>

      <section className="w-full px-0 py-5 sm:py-7">
        <div
          className={cn(
            "mx-auto w-full transition-all duration-300",
            viewport === "mobile" ? "max-w-[430px] px-3" : "max-w-none px-0",
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
                  onCoverImageChange={handleCoverImageChange}
                  onImageUploadRejected={showImageUploadRejected}
                  onRemoveCoverImage={removeCoverImage}
                  onRemoveAttorneyPhoto={removeAttorneyPhoto}
                  onSaveCoverImageCrop={saveCoverImageCrop}
                  onSaveAttorneyPhotoCrop={(crop) =>
                    saveFixedProfile(
                      {
                        ...fixedProfileRef.current,
                        attorneyPhotoCrop: crop,
                      },
                      "Corte da foto salvo nas configurações globais.",
                    )
                  }
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
              onCoverImageChange={handleCoverImageChange}
              onImageUploadRejected={showImageUploadRejected}
              onRemoveCoverImage={removeCoverImage}
              onRemoveAttorneyPhoto={removeAttorneyPhoto}
              onSaveCoverImageCrop={saveCoverImageCrop}
              onSaveAttorneyPhotoCrop={(crop) =>
                saveFixedProfile(
                  {
                    ...fixedProfileRef.current,
                    attorneyPhotoCrop: crop,
                  },
                  "Corte da foto salvo nas configurações globais.",
                )
              }
            />
          )}
        </div>
      </section>

      {pendingCropUpload ? (
        <PhotoCropDialog
          confirmLabel={
            pendingCropUpload.kind === "attorney"
              ? "Aplicar foto"
              : "Aplicar banner"
          }
          crop={defaultNewsletterImageCrop}
          imageUrl={pendingCropUpload.imageUrl}
          open
          previewClassName={
            pendingCropUpload.kind === "cover"
              ? "aspect-[16/5] max-w-[680px]"
              : undefined
          }
          showTrigger={false}
          stageClassName={
            pendingCropUpload.kind === "cover" ? "min-h-[330px]" : undefined
          }
          title={
            pendingCropUpload.kind === "attorney"
              ? "Ajustar foto"
              : "Ajustar banner"
          }
          onApply={applyPendingCropUpload}
          onOpenChange={(open) => {
            if (!open) {
              setPendingCropUpload(null)
            }
          }}
        />
      ) : null}

      {showMemoryCopied ? (
        <div
          aria-live="polite"
          className="fixed inset-0 z-[90] grid place-items-center bg-black/55 px-5"
          role="status"
        >
          <div className="w-full max-w-[340px] rounded-xl bg-white px-6 py-5 text-center shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
            <p className="text-sm font-semibold leading-6 text-black">
              Modelo de conteúdo copiado, cole na sua IA.
            </p>
          </div>
        </div>
      ) : null}

      <ImageUploadWarning
        message={imageUploadWarning}
        onClose={() => setImageUploadWarning(null)}
      />
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
        className,
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

type ContentImportPopoverProps = {
  isOpen: boolean
  onApply: () => void
  onClose: () => void
  onCopyMemory: () => void
  onOpen: () => void
  onValueChange: (value: string) => void
  value: string
}

function ContentImportPopover({
  isOpen,
  onApply,
  onClose,
  onCopyMemory,
  onOpen,
  onValueChange,
  value,
}: ContentImportPopoverProps) {
  return (
    <div className="relative">
      <EditorIconButton label="Colar conteúdo" onClick={onOpen}>
        <ClipboardPaste />
      </EditorIconButton>

      {isOpen && (
        <div className="absolute right-0 top-10 z-50 w-[min(520px,calc(100vw-32px))] rounded-xl border border-black/10 bg-white p-3 text-black shadow-[0_18px_54px_rgba(0,0,0,0.14)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-black/45">
                Colar conteúdo
              </p>
              <p className="mt-1 text-sm leading-5 text-black/55">
                Cole apenas o conteúdo jurídico. Logo, contatos e CTA vêm das
                configurações.
              </p>
            </div>
            <button
              className="grid size-8 place-items-center rounded-lg border border-black/10 text-black/50 hover:bg-black hover:text-white"
              onClick={onClose}
              type="button"
            >
              <span className="sr-only">Fechar</span>x
            </button>
          </div>

          <textarea
            className="mt-3 h-72 w-full resize-y rounded-lg border border-black/10 bg-white p-3 font-mono text-xs leading-5 text-black outline-none transition-colors focus:border-black/35 focus:ring-3 focus:ring-black/10"
            placeholder="Cole aqui o conteúdo gerado no padrão combinado."
            value={value}
            onChange={(event) => onValueChange(event.target.value)}
          />

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <button
              className="text-xs font-semibold text-black/55 underline-offset-4 hover:text-black hover:underline"
              onClick={onCopyMemory}
              type="button"
            >
              Copiar memória
            </button>
            <Button
              className="border-black bg-black text-white hover:bg-black/80"
              onClick={onApply}
              type="button"
              variant="outline"
            >
              Aplicar ao informativo
            </Button>
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
        active && "ring-2 ring-black ring-offset-2",
      )}
      onClick={onClick}
      style={{ backgroundColor: color }}
      type="button"
    />
  )
}
