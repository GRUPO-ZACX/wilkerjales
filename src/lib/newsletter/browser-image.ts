export const MAX_SAVED_IMAGE_LENGTH = 900_000
export const MAX_SOURCE_IMAGE_SIZE = 6_000_000
export const RASTER_IMAGE_MAX_EDGE = 1200
export const ACCEPTED_RASTER_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const
export const ACCEPTED_LOGO_IMAGE_TYPES = [
  ...ACCEPTED_RASTER_IMAGE_TYPES,
  "image/svg+xml",
] as const
export const RASTER_IMAGE_UPLOAD_ACCEPT = ACCEPTED_RASTER_IMAGE_TYPES.join(",")
export const LOGO_IMAGE_UPLOAD_ACCEPT = ACCEPTED_LOGO_IMAGE_TYPES.join(",")

type ImageFileToDataUrlOptions = {
  initialQuality?: number
  maxEdge?: number
  maxSavedLength?: number
  minQuality?: number
  outputType?: "image/webp" | "image/jpeg" | "image/png"
  qualityStep?: number
}

export type ImageUploadKind = "banner" | "foto" | "imagem" | "logo"

export function isAcceptedImageFile(
  file: File,
  acceptedTypes: readonly string[] = ACCEPTED_RASTER_IMAGE_TYPES,
) {
  return acceptedTypes.includes(file.type)
}

export function formatFileSize(bytes: number) {
  if (bytes >= 1_000_000) {
    return `${(bytes / 1_000_000).toFixed(1).replace(".0", "")} MB`
  }

  if (bytes >= 1_000) {
    return `${Math.round(bytes / 1_000)} KB`
  }

  return `${bytes} bytes`
}

export function getImageUploadRequirements(kind: ImageUploadKind) {
  if (kind === "banner") {
    return "Use JPG, PNG ou WebP, menor que 6 MB. Recomendado: 1600 x 500 px e até 300 KB."
  }

  if (kind === "logo") {
    return "Use JPG, PNG, WebP ou SVG, menor que 6 MB."
  }

  if (kind === "foto") {
    return "Use JPG, PNG ou WebP, menor que 6 MB, com boa iluminação e sem cortes muito fechados."
  }

  return "Use JPG, PNG ou WebP, menor que 6 MB."
}

export function createImageUploadRejectedMessage(
  kind: ImageUploadKind,
  reason:
    | "format"
    | "read"
    | "saved-size"
    | "source-size",
  file?: File,
) {
  const subject = kind === "logo" ? "Logo" : "Imagem"
  const requirements = getImageUploadRequirements(kind)

  if (reason === "format") {
    return `${subject} não foi aceita: formato inválido. ${requirements}`
  }

  if (reason === "source-size") {
    const sizeLabel = file ? ` Este arquivo tem ${formatFileSize(file.size)}.` : ""

    return `${subject} não foi aceita: arquivo maior que o limite.${sizeLabel} ${requirements}`
  }

  if (reason === "saved-size") {
    return `${subject} não foi aceita: mesmo compactada, ficou pesada demais para salvar sem travar. ${requirements}`
  }

  return `${subject} não foi aceita: não consegui ler esse arquivo como imagem. ${requirements}`
}

export function readFileAsDataUrl(file: File) {
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

export async function imageFileToDataUrl(
  file: File,
  options: ImageFileToDataUrlOptions = {},
) {
  if (file.type === "image/svg+xml") {
    return readFileAsDataUrl(file)
  }

  const maxEdge = options.maxEdge ?? RASTER_IMAGE_MAX_EDGE
  const maxSavedLength = options.maxSavedLength ?? MAX_SAVED_IMAGE_LENGTH
  const outputType = options.outputType ?? "image/webp"
  const qualityStep = options.qualityStep ?? 0.08

  const objectUrl = URL.createObjectURL(file)

  try {
    const image = await loadImage(objectUrl)
    const scale = Math.min(
      1,
      maxEdge / Math.max(image.width, image.height),
    )
    const canvas = document.createElement("canvas")
    canvas.width = Math.max(1, Math.round(image.width * scale))
    canvas.height = Math.max(1, Math.round(image.height * scale))

    const context = canvas.getContext("2d")

    if (!context) {
      return readFileAsDataUrl(file)
    }

    context.drawImage(image, 0, 0, canvas.width, canvas.height)

    let quality = options.initialQuality ?? 0.86
    const minQuality = options.minQuality ?? 0.58
    let dataUrl = canvas.toDataURL(outputType, quality)

    while (dataUrl.length > maxSavedLength && quality > minQuality) {
      quality -= qualityStep
      dataUrl = canvas.toDataURL(outputType, quality)
    }

    return dataUrl
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}
