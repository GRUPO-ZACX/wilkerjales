"use client"

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ElementType,
} from "react"

import type {
  NewsletterTextStyle,
  RichTextSegment,
} from "yes@/lib/newsletter/types"
import { cn } from "yes@/lib/utils"

type InlineTextProps = {
  ariaLabel: string
  className?: string
  editable: boolean
  multiline?: boolean
  onChange: (value: string) => void
  onTextStyleChange?: (style: NewsletterTextStyle) => void
  placeholder: string
  renderAs?: ElementType
  showTextTools?: boolean
  textStyle?: NewsletterTextStyle
  value: string
}

export function InlineText({
  ariaLabel,
  className,
  editable,
  multiline = true,
  onChange,
  onTextStyleChange,
  placeholder,
  renderAs: StaticTag = "span",
  showTextTools = true,
  textStyle,
  value,
}: InlineTextProps) {
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const displayValue = value.trim() || placeholder
  const textStyleClassName = textStyleClasses(textStyle)

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

  function updateTextStyle(nextStyle: NewsletterTextStyle) {
    onTextStyleChange?.({
      ...textStyle,
      ...nextStyle,
    })
  }

  if (!editable) {
    return (
      <StaticTag
        className={cn(
          "[overflow-wrap:anywhere]",
          className,
          textStyleClassName
        )}
      >
        {displayValue}
      </StaticTag>
    )
  }

  return (
    <span className="relative block min-w-0">
      {showTextTools && isFocused && (
        <TextToolbar
          textStyle={textStyle}
          onChange={onTextStyleChange ? updateTextStyle : undefined}
          onLower={() => transformValue("lower")}
          onTitle={() => transformValue("title")}
          onUpper={() => transformValue("upper")}
        />
      )}
      <textarea
        ref={textareaRef}
        aria-label={ariaLabel}
        className={cn(
          "block w-full min-w-0 resize-none overflow-hidden rounded-[2px] border border-transparent bg-transparent p-0 text-inherit outline-none transition-[border-color] placeholder:text-[#8A8A76] focus:border-[#B7B783]/80 focus:bg-transparent",
          !multiline && "whitespace-nowrap",
          className,
          textStyleClassName
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
  onTextStyleChange?: (style: NewsletterTextStyle) => void
  placeholder: string
  segments: RichTextSegment[]
  textStyle?: NewsletterTextStyle
}

export function InlineRichText({
  ariaLabel,
  className,
  editable,
  onChange,
  onTextStyleChange,
  placeholder,
  segments,
  textStyle,
}: InlineRichTextProps) {
  const editorRef = useRef<HTMLParagraphElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const html = segmentsToHtml(segments)
  const isEmpty = segments.every((segment) => !segment.text.trim())
  const textStyleClassName = textStyleClasses(textStyle)

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

  function updateTextStyle(nextStyle: NewsletterTextStyle) {
    onTextStyleChange?.({
      ...textStyle,
      ...nextStyle,
    })
  }

  if (!editable) {
    return (
      <p
        className={cn(
          "[overflow-wrap:anywhere]",
          className,
          textStyleClassName
        )}
      >
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
        <TextToolbar
          textStyle={textStyle}
          onBold={() => runCommand("bold")}
          onChange={onTextStyleChange ? updateTextStyle : undefined}
          onLower={() => transformAll("lower")}
          onUpper={() => transformAll("upper")}
        />
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
          "min-h-[1.5em] rounded-[2px] border border-transparent outline-none transition-[border-color] empty:before:text-[#8A8A76] focus:border-[#B7B783]/80 focus:bg-transparent [&_strong]:font-bold",
          className,
          textStyleClassName
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

type TextToolbarProps = {
  onBold?: () => void
  onChange?: (style: NewsletterTextStyle) => void
  onLower?: () => void
  onTitle?: () => void
  onUpper?: () => void
  textStyle?: NewsletterTextStyle
}

function TextToolbar({
  onBold,
  onChange,
  onLower,
  onTitle,
  onUpper,
  textStyle,
}: TextToolbarProps) {
  const nextLineHeight = cycleValue(textStyle?.lineHeight, [
    "compact",
    "normal",
    "loose",
  ])
  const nextLetterSpacing = cycleValue(textStyle?.letterSpacing, [
    "normal",
    "wide",
    "wider",
  ])

  return (
    <span className="absolute -top-10 left-0 z-20 flex max-w-[min(720px,calc(100vw-32px))] items-center overflow-x-auto rounded-md border border-black/10 bg-white text-black shadow-[0_10px_30px_rgba(0,0,0,0.10)]">
      <ToolbarButton
        active={textStyle?.bold}
        label="B"
        title="Negrito"
        onClick={() => {
          if (onBold) {
            onBold()
            return
          }
          onChange?.({ bold: !textStyle?.bold })
        }}
      />
      <ToolbarButton
        active={textStyle?.fontFamily === "serif"}
        label="Serif"
        title="Fonte serifada"
        onClick={() =>
          onChange?.({
            fontFamily: textStyle?.fontFamily === "serif" ? "sans" : "serif",
          })
        }
      />
      <ToolbarButton
        label={lineHeightLabel(textStyle?.lineHeight)}
        title="Entrelinha"
        onClick={() => onChange?.({ lineHeight: nextLineHeight })}
      />
      <ToolbarButton
        label={letterSpacingLabel(textStyle?.letterSpacing)}
        title="Entre letras"
        onClick={() => onChange?.({ letterSpacing: nextLetterSpacing })}
      />
      <ToolbarButton
        active={textStyle?.align === "left" || !textStyle?.align}
        label="E"
        title="Alinhar à esquerda"
        onClick={() => onChange?.({ align: "left" })}
      />
      <ToolbarButton
        active={textStyle?.align === "center"}
        label="C"
        title="Centralizar"
        onClick={() => onChange?.({ align: "center" })}
      />
      <ToolbarButton
        active={textStyle?.align === "right"}
        label="D"
        title="Alinhar à direita"
        onClick={() => onChange?.({ align: "right" })}
      />
      <ToolbarButton label="AA" title="Maiúsculas" onClick={onUpper} />
      {onTitle && (
        <ToolbarButton label="Aa" title="Título" onClick={onTitle} />
      )}
      <ToolbarButton label="aa" title="Minúsculas" onClick={onLower} />
    </span>
  )
}

type ToolbarButtonProps = {
  active?: boolean
  label: string
  onClick?: () => void
  title: string
}

function ToolbarButton({ active, label, onClick, title }: ToolbarButtonProps) {
  return (
    <button
      className={cn(
        "h-8 shrink-0 border-r border-black/10 px-2.5 text-[11px] font-semibold transition-colors last:border-r-0 hover:bg-black/5",
        active && "bg-black text-white hover:bg-black"
      )}
      disabled={!onClick}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      title={title}
      type="button"
    >
      {label}
    </button>
  )
}

function textStyleClasses(style: NewsletterTextStyle | undefined) {
  return cn(
    style?.bold && "font-bold",
    style?.fontFamily === "serif" && "font-serif",
    style?.fontFamily === "sans" && "font-sans",
    style?.letterSpacing === "wide" && "tracking-wide",
    style?.letterSpacing === "wider" && "tracking-wider",
    style?.lineHeight === "compact" && "leading-snug",
    style?.lineHeight === "normal" && "leading-normal",
    style?.lineHeight === "loose" && "leading-loose",
    style?.align === "center" && "text-center",
    style?.align === "right" && "text-right",
    style?.align === "left" && "text-left"
  )
}

function cycleValue<T extends string>(
  current: T | undefined,
  values: [T, ...T[]]
) {
  const index = current ? values.indexOf(current) : -1
  return values[(index + 1) % values.length]
}

function lineHeightLabel(value: NewsletterTextStyle["lineHeight"]) {
  if (value === "compact") {
    return "LH-"
  }

  if (value === "loose") {
    return "LH+"
  }

  return "LH"
}

function letterSpacingLabel(value: NewsletterTextStyle["letterSpacing"]) {
  if (value === "wide") {
    return "LS+"
  }

  if (value === "wider") {
    return "LS++"
  }

  return "LS"
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
