"use client"

import { type ChangeEvent, useState } from "react"
import { ImageIcon, RotateCcw, Save, Upload } from "lucide-react"

import { Button } from "yes@/components/ui/button"
import {
  defaultNewsletterProfile,
  normalizeNewsletterProfile,
  type NewsletterProfile,
} from "yes@/lib/newsletter/profile"
import type { SaveNewsletterProfileResult } from "yes@/app/dashboard/configuracoes/actions"

const MAX_SAVED_IMAGE_LENGTH = 900_000
const MAX_SOURCE_IMAGE_SIZE = 6_000_000
const RASTER_IMAGE_MAX_EDGE = 1200

type TextField = {
  helper?: string
  id: keyof NewsletterProfile
  label: string
  multiline?: boolean
}

const fieldGroups: Array<{
  description: string
  fields: TextField[]
  title: string
}> = [
  {
    description: "Dados institucionais usados em todos os informativos.",
    fields: [
      { id: "firmName", label: "Nome do escritório" },
      { id: "firmDescriptor", label: "Descrição do escritório" },
      { id: "firmLogoAlt", label: "Texto alternativo da logo" },
    ],
    title: "Identidade",
  },
  {
    description: "Assinatura fixa que aparece no rodapé do PDF e no material.",
    fields: [
      { id: "attorneyName", label: "Nome do advogado" },
      { id: "attorneySpecialty", label: "Área de atuação" },
      { id: "attorneyPhotoAlt", label: "Texto alternativo da foto" },
      { id: "attorneyPhrase", label: "Bio curta", multiline: true },
    ],
    title: "Advogado",
  },
  {
    description: "Telefone, site, e-mail e endereço que não mudam por edição.",
    fields: [
      { id: "contactPhone", label: "Telefone" },
      { id: "contactEmail", label: "E-mail" },
      { id: "contactSite", label: "Site" },
      { id: "address", label: "Endereço", multiline: true },
    ],
    title: "Contatos fixos",
  },
  {
    description: "Perfis exibidos no rodapé do informativo.",
    fields: [
      { id: "instagram", label: "Instagram" },
      {
        helper: "Use a URL completa do perfil ou da página.",
        id: "linkedInHref",
        label: "Link do LinkedIn",
      },
      { id: "linkedIn", label: "Texto do LinkedIn" },
    ],
    title: "Redes",
  },
  {
    description: "Chamada final padrão. A IA não precisa enviar estes campos.",
    fields: [
      { id: "ctaTitle", label: "Título do CTA" },
      { id: "ctaDescription", label: "Descrição do CTA", multiline: true },
      { id: "ctaLabel", label: "Texto do botão" },
      { id: "ctaHref", label: "Link do botão" },
    ],
    title: "CTA fixo",
  },
]

type NewsletterSettingsFormProps = {
  initialError?: string
  initialProfile: NewsletterProfile
  migrationRequired?: boolean
  onSave: (profile: NewsletterProfile) => Promise<SaveNewsletterProfileResult>
}

function phoneHrefFromValue(value: string) {
  const digits = value.replace(/\D/g, "")

  if (!digits) {
    return defaultNewsletterProfile.contactPhoneHref
  }

  const normalizedDigits = digits.startsWith("55") ? digits : `55${digits}`

  return `tel:+${normalizedDigits}`
}

function emailHrefFromValue(value: string) {
  const email = value.trim()

  return email ? `mailto:${email}` : defaultNewsletterProfile.contactEmailHref
}

function siteHrefFromValue(value: string) {
  const site = value.trim().replace(/^https?:\/\//i, "")

  return site ? `https://${site}` : defaultNewsletterProfile.contactSiteHref
}

function instagramHrefFromValue(value: string) {
  const instagram = value.trim()

  if (!instagram) {
    return defaultNewsletterProfile.instagramHref
  }

  if (/^https?:\/\//i.test(instagram)) {
    return instagram
  }

  return `https://www.instagram.com/${instagram.replace(/^@/, "")}/`
}

export function NewsletterSettingsForm({
  initialError,
  initialProfile,
  migrationRequired = false,
  onSave,
}: NewsletterSettingsFormProps) {
  const [profile, setProfile] = useState<NewsletterProfile>(() =>
    normalizeNewsletterProfile(initialProfile),
  )
  const [feedback, setFeedback] = useState<string | null>(initialError ?? null)
  const [isSaving, setIsSaving] = useState(false)

  function updateField(field: keyof NewsletterProfile, value: string) {
    setProfile((current) => {
      const next = {
        ...current,
        [field]: value,
      }

      if (field === "contactPhone") {
        next.contactPhoneHref = phoneHrefFromValue(value)
      }

      if (field === "contactEmail") {
        next.contactEmailHref = emailHrefFromValue(value)
      }

      if (field === "contactSite") {
        next.contactSiteHref = siteHrefFromValue(value)
      }

      if (field === "instagram") {
        next.instagramHref = instagramHrefFromValue(value)
      }

      return next
    })
  }

  async function uploadImage(
    field: "attorneyPhotoUrl" | "firmLogoUrl",
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (file.size > MAX_SOURCE_IMAGE_SIZE) {
      setFeedback("Use uma imagem menor que 6 MB.")
      event.target.value = ""
      return
    }

    try {
      const dataUrl = await imageFileToDataUrl(file)

      if (dataUrl.length > MAX_SAVED_IMAGE_LENGTH) {
        setFeedback("Essa imagem ficou pesada demais. Use uma versão menor.")
        event.target.value = ""
        return
      }

      updateField(field, dataUrl)
      setFeedback("Imagem carregada. Clique em salvar para aplicar.")
    } catch {
      setFeedback("Não foi possível carregar essa imagem.")
    }

    event.target.value = ""
  }

  async function saveProfile(nextProfile = profile) {
    const normalizedProfile = normalizeNewsletterProfile(nextProfile)
    setIsSaving(true)
    const result = await onSave(normalizedProfile)
    setIsSaving(false)

    if (!result.ok) {
      setFeedback(result.error ?? "Não foi possível salvar configurações.")
      return
    }

    const savedProfile = normalizeNewsletterProfile(
      result.profile ?? normalizedProfile,
    )
    setProfile(savedProfile)
    setFeedback("Configurações globais salvas para todos os informativos.")
  }

  async function restoreProfile() {
    setProfile(defaultNewsletterProfile)
    await saveProfile(defaultNewsletterProfile)
  }

  return (
    <section className="mx-auto w-full max-w-[1040px] px-5 py-8 sm:px-7 lg:px-8">
      <div className="border-b border-black/10 pb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-black/45">
          Dashboard
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.03em] text-black">
          Configurações do informativo
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-black/55">
          Estes dados ficam fixos. No editor, a colagem da IA preenche apenas o
          conteúdo jurídico.
        </p>
      </div>

      {migrationRequired ? (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          A tabela de configurações globais ainda precisa ser criada no
          Supabase. Enquanto isso, o sistema usa o padrão oficial.
        </div>
      ) : null}

      <div className="mt-8 grid gap-5">
        <div className="grid gap-5 lg:grid-cols-2">
          <ImageUploadCard
            label="Logo oficial"
            value={profile.firmLogoUrl}
            onChange={(event) => void uploadImage("firmLogoUrl", event)}
          />
          <ImageUploadCard
            label="Foto do advogado"
            value={profile.attorneyPhotoUrl}
            onChange={(event) => void uploadImage("attorneyPhotoUrl", event)}
          />
        </div>

        {fieldGroups.map((group) => (
          <div
            key={group.title}
            className="rounded-xl border border-black/10 bg-white p-5 shadow-[0_18px_70px_rgba(0,0,0,0.05)]"
          >
            <div className="border-b border-black/10 pb-4">
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-black">
                {group.title}
              </h2>
              <p className="mt-1 text-sm leading-6 text-black/55">
                {group.description}
              </p>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {group.fields.map((field) => (
                <label
                  key={field.id}
                  className={
                    field.multiline ? "grid gap-2 sm:col-span-2" : "grid gap-2"
                  }
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-black/45">
                    {field.label}
                  </span>
                  {field.multiline ? (
                    <textarea
                      className="min-h-24 rounded-lg border border-black/10 bg-white px-3 py-2 text-sm leading-6 text-black outline-none transition-colors focus:border-black/35 focus:ring-3 focus:ring-black/10"
                      value={profile[field.id]}
                      onChange={(event) =>
                        updateField(field.id, event.target.value)
                      }
                    />
                  ) : (
                    <input
                      className="h-10 rounded-lg border border-black/10 bg-white px-3 text-sm text-black outline-none transition-colors focus:border-black/35 focus:ring-3 focus:ring-black/10"
                      value={profile[field.id]}
                      onChange={(event) =>
                        updateField(field.id, event.target.value)
                      }
                    />
                  )}
                  {field.helper ? (
                    <span className="text-xs leading-5 text-black/45">
                      {field.helper}
                    </span>
                  ) : null}
                </label>
              ))}
            </div>
          </div>
        ))}

        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-black/10 bg-white p-5 shadow-[0_18px_70px_rgba(0,0,0,0.05)]">
          <Button
            className="border-black bg-black text-white hover:bg-black/80"
            disabled={isSaving}
            onClick={() => void saveProfile()}
            type="button"
          >
            <Save />
            {isSaving ? "Salvando..." : "Salvar configurações"}
          </Button>
          <Button
            className="border-black/15 bg-white text-black hover:bg-black/5"
            disabled={isSaving}
            onClick={() => void restoreProfile()}
            type="button"
            variant="outline"
          >
            <RotateCcw />
            Restaurar padrão
          </Button>
          {feedback ? (
            <span className="text-sm font-medium text-black/55">
              {feedback}
            </span>
          ) : null}
        </div>
      </div>
    </section>
  )
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onerror = () => reject(reader.error)
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result)
        return
      }

      reject(new Error("Invalid image result"))
    }

    reader.readAsDataURL(file)
  })
}

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()

    image.onerror = reject
    image.onload = () => resolve(image)
    image.src = url
  })
}

async function imageFileToDataUrl(file: File) {
  if (file.type === "image/svg+xml") {
    return readFileAsDataUrl(file)
  }

  const objectUrl = URL.createObjectURL(file)

  try {
    const image = await loadImage(objectUrl)
    const scale = Math.min(
      1,
      RASTER_IMAGE_MAX_EDGE / Math.max(image.width, image.height),
    )
    const canvas = document.createElement("canvas")
    canvas.width = Math.max(1, Math.round(image.width * scale))
    canvas.height = Math.max(1, Math.round(image.height * scale))

    const context = canvas.getContext("2d")

    if (!context) {
      return readFileAsDataUrl(file)
    }

    context.drawImage(image, 0, 0, canvas.width, canvas.height)

    let quality = 0.86
    let dataUrl = canvas.toDataURL("image/webp", quality)

    while (dataUrl.length > MAX_SAVED_IMAGE_LENGTH && quality > 0.58) {
      quality -= 0.08
      dataUrl = canvas.toDataURL("image/webp", quality)
    }

    return dataUrl
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

type ImageUploadCardProps = {
  label: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  value: string
}

function ImageUploadCard({ label, onChange, value }: ImageUploadCardProps) {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-5 shadow-[0_18px_70px_rgba(0,0,0,0.05)]">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-black/45">
        {label}
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-center">
        <div
          aria-label={label}
          className="grid aspect-[16/10] w-full place-items-center overflow-hidden rounded-lg border border-black/10 bg-neutral-100 bg-contain bg-center bg-no-repeat text-black/30"
          role="img"
          style={value ? { backgroundImage: `url(${value})` } : undefined}
        >
          {!value ? <ImageIcon className="size-7" /> : null}
        </div>
        <div className="min-w-0">
          <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-black/15 bg-white px-3 text-sm font-semibold text-black transition-colors hover:bg-black hover:text-white">
            <Upload className="size-4" />
            Enviar imagem
            <input
              accept="image/*"
              className="sr-only"
              onChange={onChange}
              type="file"
            />
          </label>
          <p className="mt-3 text-xs leading-5 text-black/45">
            Use JPG, PNG ou SVG. Para salvar sem travar, prefira arquivos leves.
          </p>
        </div>
      </div>
    </div>
  )
}
