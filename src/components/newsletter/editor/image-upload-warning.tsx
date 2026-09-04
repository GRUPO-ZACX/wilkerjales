"use client"

import { AlertCircle } from "lucide-react"

import { Button } from "yes@/components/ui/button"

type ImageUploadWarningProps = {
  message: string | null
  onClose: () => void
}

export function ImageUploadWarning({
  message,
  onClose,
}: ImageUploadWarningProps) {
  if (!message) {
    return null
  }

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-[95] grid place-items-center bg-black/55 px-5"
      role="alertdialog"
    >
      <div className="w-full max-w-[420px] rounded-xl bg-white p-5 text-black shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-red-50 text-red-600">
            <AlertCircle className="size-5" />
          </span>
          <div className="min-w-0">
            <h2 className="text-base font-semibold tracking-[-0.02em]">
              Arquivo não aceito
            </h2>
            <p className="mt-2 text-sm leading-6 text-black/65">{message}</p>
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <Button
            className="border-black bg-black text-white hover:bg-black/80"
            onClick={onClose}
            type="button"
            variant="outline"
          >
            Entendi
          </Button>
        </div>
      </div>
    </div>
  )
}
