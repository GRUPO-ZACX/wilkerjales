"use client"

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ElementType,
} from "react"

import type { RichTextSegment } from "yes@/lib/newsletter/types"
import { cn } from "yes@/lib/utils"

type InlineTextProps = {
  ariaLabel: string
  className?: string
  editable: boolean
  multiline?: boolean
  onChange: (value: string) => void
  placeholder: string
  renderAs?: ElementType
  showTextTools?: boolean
  value: string
}

export function InlineText({
  ariaLabel,
  className,
  editable,
  multiline = true,
  onChange,
  placeholder,
  renderAs: StaticTag = "span",
  showTextTools = false,
  value,
}: InlineTextProps) {
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const displayValue = value.trim() || placeholder

  useLayoutEffect(() => {
    const textarea = textareaRef.current

    if (!textarea) {
      return
    }

    textarea.style.height = "auto"
    textarea.style.height = `${textarea.scrollHeight}px`
  }, [value])

  function transformValue(transform: "upper" | "lower" | "title") {
    const source = value || placeholder
    const nextValue =
      transform === "upper"
        ? source.toUpperCase()
        : transform === "lower"
          ? source.toLowerCase()
          : toTitleCase(source)

    onChange(nextValue)
  }

  if (!editable) {
    return (
      <StaticTag className={cn("[overflow-wrap:anywhere]", className)}>
        {displayValue}
      </StaticTag>
    )
  }

  return (
    <span className="relative block min-w-0">
      {showTextTools && isFocused && (
        <span className="absolute -top-9 left-0 z-20 inline-flex overflow-hidden rounded-sm border border-[#B7B783] bg-[#F7F5EE] shadow-[0_10px_28px_rgba(22,59,53,0.12)]">
          <button
            className="px-2 py-1 text-[11px] font-bold text-[#163B35] hover:bg-[#ECE8D8]"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => transformValue("upper")}
            type="button"
          >
            AA
          </button>
          <button
            className="border-l border-[#B7B783] px-2 py-1 text-[11px] font-bold text-[#163B35] hover:bg-[#ECE8D8]"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => transformValue("lower")}
            type="button"
          >
            aa
          </button>
          <button
            className="border-l border-[#B7B783] px-2 py-1 text-[11px] font-bold text-[#163B35] hover:bg-[#ECE8D8]"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => transformValue("title")}
            type="button"
          >
            Aa
          </button>
        </span>
      )}
      <textarea
        ref={textareaRef}
        aria-label={ariaLabel}
        className={cn(
          "block w-full min-w-0 resize-none overflow-hidden rounded-sm border border-transparent bg-transparent p-0 text-inherit outline-none transition-colors placeholder:text-[#8A8A76] focus:border-[#B7B783] focus:bg-[#F7F5EE]/80 focus:px-2 focus:py-1 focus:shadow-[0_0_0_4px_rgba(183,183,131,0.16)]",
          !multiline && "whitespace-nowrap",
          className
        )}
        onBlur={() => setIsFocused(false)}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => setIsFocused(true)}
        onKeyDown={(event) => {
          if (!multiline && event.key === "Enter") {
            event.preventDefault()
            event.currentTarget.blur()
          }
        }}
        placeholder={placeholder}
        rows={1}
        value={value}
      />
    </span>
  )
}

type InlineRichTextProps = {
  ariaLabel: string
  className?: string
  editable: boolean
  onChange: (segments: RichTextSegment[]) => void
  placeholder: string
  segments: RichTextSegment[]
}

export function InlineRichText({
  ariaLabel,
  className,
  editable,
  onChange,
  placeholder,
  segments,
}: InlineRichTextProps) {
  const editorRef = useRef<HTMLParagraphElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const html = segmentsToHtml(segments)
  const isEmpty = segments.every((segment) => !segment.text.trim())

  useEffect(() => {
    const editor = editorRef.current

    if (!editor || isFocused || editor.innerHTML === html) {
      return
    }

    editor.innerHTML = html
  }, [html, isFocused])

  function emitChange() {
    const editor = editorRef.current

    if (!editor) {
      return
    }

    const nextSegments = parseRichText(editor)
    onChange(nextSegments.length > 0 ? nextSegments : [{ text: "" }])
  }

  function runCommand(command: "bold") {
    document.execCommand(command)
    emitChange()
  }

  function transformAll(transform: "upper" | "lower") {
    const plainText = segments.map((segment) => segment.text).join("")
    onChange([
      {
        text:
          transform === "upper"
            ? plainText.toUpperCase()
            : plainText.toLowerCase(),
      },
    ])
  }

  if (!editable) {
    return (
      <p className={cn("[overflow-wrap:anywhere]", className)}>
        {isEmpty
          ? placeholder
          : segments.map((segment, index) =>
              segment.bold ? (
                <strong key={`${segment.text}-${index}`}>{segment.text}</strong>
              ) : (
                <span key={`${segment.text}-${index}`}>{segment.text}</span>
              )
            )}
      </p>
    )
  }

  return (
    <span className="relative block min-w-0">
      {isFocused && (
        <span className="absolute -top-9 left-0 z-20 inline-flex overflow-hidden rounded-sm border border-[#B7B783] bg-[#F7F5EE] shadow-[0_10px_28px_rgba(22,59,53,0.12)]">
          <button
            className="px-2.5 py-1 text-[12px] font-black text-[#163B35] hover:bg-[#ECE8D8]"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => runCommand("bold")}
            type="button"
          >
            B
          </button>
          <button
            className="border-l border-[#B7B783] px-2 py-1 text-[11px] font-bold text-[#163B35] hover:bg-[#ECE8D8]"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => transformAll("upper")}
            type="button"
          >
            AA
          </button>
          <button
            className="border-l border-[#B7B783] px-2 py-1 text-[11px] font-bold text-[#163B35] hover:bg-[#ECE8D8]"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => transformAll("lower")}
            type="button"
          >
            aa
          </button>
        </span>
      )}

      {isEmpty && !isFocused && (
        <span className={cn("pointer-events-none absolute text-[#8A8A76]", className)}>
          {placeholder}
        </span>
      )}

      <p
        ref={editorRef}
        aria-label={ariaLabel}
        className={cn(
          "min-h-[1.5em] rounded-sm border border-transparent outline-none transition-colors empty:before:text-[#8A8A76] focus:border-[#B7B783] focus:bg-[#F7F5EE]/80 focus:px-2 focus:py-1 focus:shadow-[0_0_0_4px_rgba(183,183,131,0.16)] [&_strong]:font-bold",
          className
        )}
        contentEditable
        dangerouslySetInnerHTML={{ __html: html }}
        onBlur={() => setIsFocused(false)}
        onFocus={() => setIsFocused(true)}
        onInput={emitChange}
        role="textbox"
        suppressContentEditableWarning
      />
    </span>
  )
}

function toTitleCase(value: string) {
  return value
    .toLowerCase()
    .replace(/(^|\s)(\p{L})/gu, (match) => match.toUpperCase())
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

function segmentsToHtml(segments: RichTextSegment[]) {
  return segments
    .map((segment) => {
      const text = escapeHtml(segment.text)
      return segment.bold ? `<strong>${text}</strong>` : text
    })
    .join("")
}

function parseRichText(root: HTMLElement) {
  const segments: RichTextSegment[] = []

  function pushText(text: string, bold: boolean) {
    if (!text) {
      return
    }

    const previous = segments.at(-1)

    if (previous && Boolean(previous.bold) === bold) {
      previous.text += text
      return
    }

    segments.push({ bold: bold || undefined, text })
  }

  function walk(node: Node, bold: boolean) {
    if (node.nodeType === Node.TEXT_NODE) {
      pushText(node.textContent ?? "", bold)
      return
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return
    }

    const element = node as HTMLElement
    const nextBold =
      bold ||
      element.tagName === "B" ||
      element.tagName === "STRONG" ||
      element.style.fontWeight === "bold" ||
      Number(element.style.fontWeight) >= 600

    element.childNodes.forEach((child) => walk(child, nextBold))
  }

  root.childNodes.forEach((child) => walk(child, false))

  return segments
}
