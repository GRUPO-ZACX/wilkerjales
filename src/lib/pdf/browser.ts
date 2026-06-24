import { existsSync } from "node:fs"

import chromium from "@sparticuz/chromium"
import puppeteer, { type Browser, type PDFOptions } from "puppeteer-core"

type PdfLayout = "a4" | "digital"

type RenderPdfOptions = {
  layout?: PdfLayout
  url: string
}

const DIGITAL_VIEWPORT = {
  deviceScaleFactor: 1,
  height: 1600,
  width: 1280,
}

const LOCAL_CHROME_PATHS = [
  process.env.CHROME_EXECUTABLE_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium-browser",
  "/usr/bin/chromium",
].filter(Boolean) as string[]

function isServerlessRuntime() {
  return Boolean(
    process.env.VERCEL ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.AWS_EXECUTION_ENV
  )
}

function findLocalChromeExecutable() {
  return LOCAL_CHROME_PATHS.find((path) => existsSync(path))
}

async function launchBrowser(): Promise<Browser> {
  if (isServerlessRuntime()) {
    return puppeteer.launch({
      args: await puppeteer.defaultArgs({
        args: chromium.args,
        headless: "shell",
      }),
      defaultViewport: DIGITAL_VIEWPORT,
      executablePath: await chromium.executablePath(),
      headless: "shell",
    })
  }

  const executablePath = findLocalChromeExecutable()

  if (!executablePath) {
    throw new Error(
      "Chrome local não encontrado. Instale o Google Chrome ou defina CHROME_EXECUTABLE_PATH."
    )
  }

  return puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: DIGITAL_VIEWPORT,
    executablePath,
    headless: true,
  })
}

async function waitForFonts() {
  if (!("fonts" in document)) {
    return
  }

  await document.fonts.ready
}

async function getDocumentHeight() {
  return Math.ceil(
    Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    )
  )
}

function pdfOptionsForLayout(layout: PdfLayout, height: number): PDFOptions {
  if (layout === "a4") {
    return {
      format: "A4",
      margin: {
        bottom: "0",
        left: "0",
        right: "0",
        top: "0",
      },
      preferCSSPageSize: false,
      printBackground: true,
    }
  }

  return {
    height: `${height}px`,
    margin: {
      bottom: "0",
      left: "0",
      right: "0",
      top: "0",
    },
    printBackground: true,
    width: `${DIGITAL_VIEWPORT.width}px`,
  }
}

export async function renderPdfFromUrl({
  layout = "digital",
  url,
}: RenderPdfOptions) {
  const browser = await launchBrowser()

  try {
    const page = await browser.newPage()
    await page.setViewport(DIGITAL_VIEWPORT)

    const response = await page.goto(url, {
      timeout: 45_000,
      waitUntil: "networkidle0",
    })

    if (!response || !response.ok()) {
      return {
        ok: false as const,
        status: response?.status() ?? 500,
      }
    }

    await page.emulateMediaType("screen")
    await page.evaluate(waitForFonts)

    const height = await page.evaluate(getDocumentHeight)
    const pdf = await page.pdf(pdfOptionsForLayout(layout, height))

    return {
      ok: true as const,
      pdf,
    }
  } finally {
    await browser.close()
  }
}

export function safePdfFilename(value: string) {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")

  return `${normalized || "informativo"}.pdf`
}
