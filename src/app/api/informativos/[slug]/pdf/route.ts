import type { NextRequest } from "next/server"

import {
  renderPdfFromUrl,
  safePdfFilename,
} from "yes@/lib/pdf/browser"

export const dynamic = "force-dynamic"
export const maxDuration = 60
export const runtime = "nodejs"

type NewsletterPdfRouteProps = {
  params: Promise<{
    slug: string
  }>
}

function getRequestOrigin(request: NextRequest) {
  const forwardedHost = request.headers.get("x-forwarded-host")
  const host = forwardedHost ?? request.headers.get("host")
  const protocol = request.headers.get("x-forwarded-proto") ?? "http"

  if (!host) {
    return request.nextUrl.origin
  }

  return `${protocol}://${host}`
}

function getPrintPath(slug: string) {
  if (slug === "demo") {
    return "/informativo/demo/print"
  }

  return `/informativo/${slug}/print`
}

export async function GET(
  request: NextRequest,
  { params }: NewsletterPdfRouteProps
) {
  const { slug } = await params
  const origin = getRequestOrigin(request)
  const layout =
    request.nextUrl.searchParams.get("paper") === "a4" ? "a4" : "digital"
  const printUrl = new URL(getPrintPath(slug), origin)

  try {
    const result = await renderPdfFromUrl({
      layout,
      url: printUrl.toString(),
    })

    if (!result.ok) {
      return Response.json(
        { error: "Informativo publicado não encontrado para gerar PDF." },
        { status: result.status === 404 ? 404 : 502 }
      )
    }

    const pdfBody = result.pdf.buffer.slice(
      result.pdf.byteOffset,
      result.pdf.byteOffset + result.pdf.byteLength
    ) as ArrayBuffer

    return new Response(pdfBody, {
      headers: {
        "Cache-Control": "no-store",
        "Content-Disposition": `attachment; filename="${safePdfFilename(slug)}"`,
        "Content-Type": "application/pdf",
      },
    })
  } catch (error) {
    console.error("Erro ao gerar PDF do informativo", error)

    return Response.json(
      { error: "Não foi possível gerar o PDF agora." },
      { status: 500 }
    )
  }
}
