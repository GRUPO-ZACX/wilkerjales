"use client"

import {
  useRef,
  useState,
  type PointerEvent,
  type WheelEvent,
} from "react"
import { Check, Crop, RotateCcw, ZoomIn, ZoomOut } from "lucide-react"

import { Button } from "yes@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "yes@/components/ui/dialog"
import {
  defaultNewsletterImageCrop,
  newsletterImageCropBackgroundStyle,
  normalizeNewsletterImageCrop,
} from "yes@/lib/newsletter/image-crop"
import type { NewsletterImageCrop } from "yes@/lib/newsletter/types"
import { cn } from "yes@/lib/utils"

type PhotoCropDialogProps = {
  confirmLabel?: string
  previewClassName?: string
  showTrigger?: boolean
  stageClassName?: string
  title?: string
  crop?: Partial<NewsletterImageCrop>
  imageUrl: string
  onApply: (crop: NewsletterImageCrop) => Promise<void> | void
  onOpenChange?: (open: boolean) => void
  open?: boolean
  triggerClassName?: string
  triggerLabel?: string
}

export function PhotoCropDialog({
  confirmLabel = "Aplicar corte",
  crop,
  imageUrl,
  onApply,
  onOpenChange,
  open: controlledOpen,
  previewClassName,
  showTrigger = true,
  stageClassName,
  title = "Editar foto",
  triggerClassName,
  triggerLabel = "Editar foto",
}: PhotoCropDialogProps) {
  const cropBoxRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{
    crop: NewsletterImageCrop
    x: number
    y: number
  } | null>(null)
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const [draftCrop, setDraftCrop] = useState<NewsletterImageCrop>(() =>
    normalizeNewsletterImageCrop(crop),
  )
  const [isApplying, setIsApplying] = useState(false)
  const open = controlledOpen ?? uncontrolledOpen

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setDraftCrop(normalizeNewsletterImageCrop(crop))
    }

    setUncontrolledOpen(nextOpen)
    onOpenChange?.(nextOpen)
  }

  function moveCrop(deltaX: number, deltaY: number) {
    const box = cropBoxRef.current
    const drag = dragRef.current

    if (!box || !drag) {
      return
    }

    const rect = box.getBoundingClientRect()

    setDraftCrop(
      normalizeNewsletterImageCrop({
        ...drag.crop,
        positionX:
          drag.crop.positionX - (deltaX / Math.max(rect.width, 1)) * 100,
        positionY:
          drag.crop.positionY - (deltaY / Math.max(rect.height, 1)) * 100,
      }),
    )
  }

  function updateZoom(delta: number) {
    setDraftCrop((current) =>
      normalizeNewsletterImageCrop({
        ...current,
        zoom: current.zoom + delta,
      }),
    )
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    dragRef.current = {
      crop: draftCrop,
      x: event.clientX,
      y: event.clientY,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!dragRef.current) {
      return
    }

    moveCrop(event.clientX - dragRef.current.x, event.clientY - dragRef.current.y)
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    dragRef.current = null

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    event.preventDefault()
    updateZoom(event.deltaY > 0 ? -0.08 : 0.08)
  }

  async function applyCrop() {
    setIsApplying(true)

    try {
      await onApply(normalizeNewsletterImageCrop(draftCrop))
      handleOpenChange(false)
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {showTrigger ? (
        <DialogTrigger asChild>
          <button
            className={cn(
              "inline-flex cursor-pointer items-center gap-2 rounded-sm bg-[#F7F5EE] px-3 py-2 text-xs font-semibold text-[#163B35] shadow-sm transition-colors hover:bg-white",
              triggerClassName,
            )}
            type="button"
          >
            <Crop className="size-4" />
            {triggerLabel}
          </button>
        </DialogTrigger>
      ) : null}
      <DialogContent className="max-w-[760px] overflow-hidden border-black/10 bg-white p-0 text-black">
        <DialogHeader className="px-5 pt-5 pr-12">
          <DialogTitle className="text-xl font-semibold tracking-[-0.02em]">
            {title}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Arraste a imagem dentro do quadro para definir o recorte.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 px-5 pb-5">
          <div
            className={cn(
              "relative flex min-h-[390px] items-center justify-center overflow-hidden rounded-lg bg-[#101815] p-5",
              stageClassName,
            )}
          >
            <div
              aria-hidden
              className="absolute inset-0 bg-cover bg-no-repeat opacity-45"
              style={newsletterImageCropBackgroundStyle(imageUrl, draftCrop)}
            />
            <div aria-hidden className="absolute inset-0 bg-black/60" />
            <div
              ref={cropBoxRef}
              aria-label="Prévia do corte"
              className={cn(
                "relative aspect-[16/11] w-full max-w-[560px] cursor-grab touch-none overflow-hidden border-2 border-white bg-[#E8E4D4] shadow-[0_0_0_999px_rgba(0,0,0,0.36),0_18px_60px_rgba(0,0,0,0.32)] active:cursor-grabbing",
                previewClassName,
              )}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerCancel={handlePointerUp}
              onPointerUp={handlePointerUp}
              onLostPointerCapture={() => {
                dragRef.current = null
              }}
              onWheel={handleWheel}
              role="img"
            >
              <div
                className="absolute inset-0 bg-cover bg-no-repeat"
                style={newsletterImageCropBackgroundStyle(imageUrl, draftCrop)}
              />
              <div className="pointer-events-none absolute inset-x-0 top-1/3 border-t border-white/45" />
              <div className="pointer-events-none absolute inset-x-0 top-2/3 border-t border-white/45" />
              <div className="pointer-events-none absolute inset-y-0 left-1/3 border-l border-white/45" />
              <div className="pointer-events-none absolute inset-y-0 left-2/3 border-l border-white/45" />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                className="border-black/15 bg-white text-black hover:bg-black/5"
                onClick={() => updateZoom(-0.12)}
                type="button"
                variant="outline"
              >
                <ZoomOut />
                Menos zoom
              </Button>
              <Button
                className="border-black/15 bg-white text-black hover:bg-black/5"
                onClick={() => setDraftCrop(defaultNewsletterImageCrop)}
                type="button"
                variant="outline"
              >
                <RotateCcw />
                Centralizar
              </Button>
              <Button
                className="border-black/15 bg-white text-black hover:bg-black/5"
                onClick={() => updateZoom(0.12)}
                type="button"
                variant="outline"
              >
                <ZoomIn />
                Mais zoom
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <DialogClose asChild>
                <Button
                  className="border-black/15 bg-white text-black hover:bg-black/5"
                  type="button"
                  variant="outline"
                >
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                className="border-[#244F49] bg-[#244F49] text-white hover:bg-[#163B35]"
                disabled={isApplying}
                onClick={() => void applyCrop()}
                type="button"
              >
                <Check />
                {isApplying ? "Aplicando..." : confirmLabel}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
