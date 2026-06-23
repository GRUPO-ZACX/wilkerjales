"use client"

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ElementType,
} from "react"
import Color from "@tiptap/extension-color"
import Link from "@tiptap/extension-link"
import TextAlign from "@tiptap/extension-text-align"
import { TextStyle } from "@tiptap/extension-text-style"
import Underline from "@tiptap/extension-underline"
import { EditorContent, useEditor, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

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
        style={textStyleInlineStyle(textStyle)}
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
        style={textStyleInlineStyle(textStyle)}
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
  const [isFocused, setIsFocused] = useState(false)
  const isEmpty = segments.every((segment) => !segment.text.trim())
  const textStyleClassName = textStyleClasses(textStyle)
  const editor = useEditor(
    {
      content: segmentsToHtml(segments),
      editorProps: {
        attributes: {
          "aria-label": ariaLabel,
          class: cn(
            "min-h-[1.5em] rounded-[2px] border border-transparent outline-none transition-[border-color] empty:before:text-[#8A8A76] focus:border-[#B7B783]/80 focus:bg-transparent [&_a]:font-semibold [&_a]:text-[#244F49] [&_a]:underline [&_a]:decoration-[#B7B783] [&_a]:underline-offset-4 [&_p]:m-0",
            className,
            textStyleClassName
          ),
          role: "textbox",
        },
      },
      extensions: [
        StarterKit.configure({
          blockquote: false,
          bulletList: false,
          code: false,
          codeBlock: false,
          hardBreak: false,
          heading: false,
          horizontalRule: false,
          listItem: false,
          orderedList: false,
          strike: false,
        }),
        TextStyle,
        Color,
        Underline,
        TextAlign.configure({
          types: ["paragraph"],
        }),
        Link.configure({
          autolink: true,
          defaultProtocol: "https",
          HTMLAttributes: {
            rel: "noopener noreferrer",
            target: "_blank",
          },
          linkOnPaste: true,
          openOnClick: false,
        }),
      ],
      immediatelyRender: false,
      onBlur: () => setIsFocused(false),
      onFocus: () => setIsFocused(true),
      onUpdate: ({ editor }) => {
        onChange(htmlToSegments(editor.getHTML()))
      },
    },
    []
  )

  useEffect(() => {
    if (!editor || isFocused) {
      return
    }

    const nextHtml = segmentsToHtml(segments)

    if (editor.getHTML() === nextHtml) {
      return
    }

    editor.commands.setContent(nextHtml)
  }, [editor, isFocused, segments])

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
        style={textStyleInlineStyle(textStyle)}
      >
        {isEmpty
          ? placeholder
          : segments.map((segment, index) =>
              renderRichTextSegment(segment, index)
            )}
      </p>
    )
  }

  return (
    <span
      className="relative block min-w-0"
      style={textStyleInlineStyle(textStyle)}
    >
      {isFocused && editor && (
        <RichTextToolbar
          editor={editor}
          textStyle={textStyle}
          onChange={onTextStyleChange ? updateTextStyle : undefined}
        />
      )}

      {isEmpty && !isFocused && (
        <span className={cn("pointer-events-none absolute text-[#8A8A76]", className)}>
          {placeholder}
        </span>
      )}

      <EditorContent editor={editor} />
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
      {onChange && (
        <span className="flex items-center gap-1 border-l border-black/10 pl-1">
          {richTextColors.map((color) => (
            <button
              key={color.value}
              className={cn(
                "size-6 rounded-full border border-black/15",
                textStyle?.color === color.value &&
                  "ring-2 ring-black ring-offset-1"
              )}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => onChange({ color: color.value })}
              style={{ backgroundColor: color.value }}
              title={`Cor: ${color.label}`}
              type="button"
            />
          ))}
        </span>
      )}
    </span>
  )
}

type RichTextToolbarProps = {
  editor: Editor
  onChange?: (style: NewsletterTextStyle) => void
  textStyle?: NewsletterTextStyle
}

const richTextColors = [
  { label: "Texto", value: "#1F1F1A" },
  { label: "Verde", value: "#244F49" },
  { label: "Oliva", value: "#6D714C" },
  { label: "Dourado", value: "#B7B783" },
]

function RichTextToolbar({ editor, onChange, textStyle }: RichTextToolbarProps) {
  const [isLinkOpen, setIsLinkOpen] = useState(false)
  const [linkValue, setLinkValue] = useState("")
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

  function openLinkEditor() {
    setLinkValue(editor.getAttributes("link").href ?? "")
    setIsLinkOpen((current) => !current)
  }

  function applyLink() {
    const href = linkValue.trim()

    if (!href) {
      editor.chain().focus().unsetLink().run()
      setIsLinkOpen(false)
      return
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href })
      .run()
    setIsLinkOpen(false)
  }

  return (
    <span className="absolute -top-12 left-0 z-30 flex max-w-[min(760px,calc(100vw-32px))] items-center gap-1 rounded-lg border border-black/10 bg-white p-1 text-black shadow-[0_12px_34px_rgba(0,0,0,0.12)]">
      <ToolbarButton
        active={editor.isActive("bold")}
        label="B"
        title="Negrito"
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <ToolbarButton
        active={editor.isActive("italic")}
        label="I"
        title="Itálico"
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <ToolbarButton
        active={editor.isActive("underline")}
        label="U"
        title="Sublinhado"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      />
      <ToolbarButton
        active={editor.isActive("link")}
        label="Link"
        title="Editar link"
        onClick={openLinkEditor}
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
      <span className="flex items-center gap-1 border-l border-black/10 pl-1">
        {richTextColors.map((color) => (
          <button
            key={color.value}
            className={cn(
              "size-6 rounded-full border border-black/15",
              editor.isActive("textStyle", { color: color.value }) &&
                "ring-2 ring-black ring-offset-1"
            )}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => editor.chain().focus().setColor(color.value).run()}
            style={{ backgroundColor: color.value }}
            title={color.label}
            type="button"
          />
        ))}
      </span>

      {isLinkOpen && (
        <span className="absolute left-0 top-11 z-40 flex w-[min(360px,calc(100vw-32px))] items-center gap-2 rounded-lg border border-black/10 bg-white p-2 shadow-[0_16px_42px_rgba(0,0,0,0.14)]">
          <input
            className="h-8 min-w-0 flex-1 rounded-md border border-black/15 px-2 text-xs outline-none focus:border-black/45"
            placeholder="https://..."
            value={linkValue}
            onChange={(event) => setLinkValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()
                applyLink()
              }
            }}
          />
          <button
            className="h-8 rounded-md bg-black px-3 text-xs font-semibold text-white"
            onMouseDown={(event) => event.preventDefault()}
            onClick={applyLink}
            type="button"
          >
            OK
          </button>
        </span>
      )}
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

function textStyleInlineStyle(style: NewsletterTextStyle | undefined) {
  if (!style?.color) {
    return undefined
  }

  return {
    color: style.color,
  }
}

function renderRichTextSegment(segment: RichTextSegment, index: number) {
  let content = <>{segment.text}</>

  if (segment.bold) {
    content = <strong>{content}</strong>
  }

  if (segment.italic) {
    content = <em>{content}</em>
  }

  if (segment.underline) {
    content = <u>{content}</u>
  }

  if (segment.href) {
    content = (
      <a
        className="font-semibold text-[#244F49] underline decoration-[#B7B783] underline-offset-4"
        href={segment.href}
        rel="noopener noreferrer"
        target="_blank"
      >
        {content}
      </a>
    )
  }

  return (
    <span
      key={`${segment.text}-${index}`}
      style={segment.color ? { color: segment.color } : undefined}
    >
      {content}
    </span>
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
  const content = segments
    .map((segment) => {
      let text = escapeHtml(segment.text)

      if (segment.bold) {
        text = `<strong>${text}</strong>`
      }

      if (segment.italic) {
        text = `<em>${text}</em>`
      }

      if (segment.underline) {
        text = `<u>${text}</u>`
      }

      if (segment.color) {
        text = `<span style="color: ${escapeHtml(segment.color)}">${text}</span>`
      }

      if (segment.href) {
        text = `<a href="${escapeHtml(segment.href)}">${text}</a>`
      }

      return text
    })
    .join("")

  return `<p>${content}</p>`
}

function htmlToSegments(html: string) {
  if (typeof window === "undefined") {
    return [{ text: stripTags(html) }]
  }

  const template = document.createElement("template")
  template.innerHTML = html

  return parseRichText(template.content)
}

function parseRichText(root: ParentNode) {
  const segments: RichTextSegment[] = []

  function pushText(text: string, style: Omit<RichTextSegment, "text">) {
    if (!text) {
      return
    }

    const previous = segments.at(-1)

    if (
      previous &&
      Boolean(previous.bold) === Boolean(style.bold) &&
      Boolean(previous.italic) === Boolean(style.italic) &&
      Boolean(previous.underline) === Boolean(style.underline) &&
      previous.href === style.href &&
      previous.color === style.color
    ) {
      previous.text += text
      return
    }

    segments.push({ ...style, text })
  }

  function walk(node: Node, style: Omit<RichTextSegment, "text">) {
    if (node.nodeType === Node.TEXT_NODE) {
      pushText(node.textContent ?? "", style)
      return
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return
    }

    const element = node as HTMLElement
    const nextStyle = {
      ...style,
      bold:
        style.bold ||
        element.tagName === "B" ||
        element.tagName === "STRONG" ||
        element.style.fontWeight === "bold" ||
        Number(element.style.fontWeight) >= 600 ||
        undefined,
      color: element.style.color || style.color,
      href: element.tagName === "A" ? element.getAttribute("href") || undefined : style.href,
      italic: style.italic || element.tagName === "EM" || element.tagName === "I" || undefined,
      underline:
        style.underline ||
        element.tagName === "U" ||
        element.style.textDecorationLine.includes("underline") ||
        undefined,
    }

    element.childNodes.forEach((child) => walk(child, nextStyle))
  }

  root.childNodes.forEach((child) => walk(child, {}))

  return segments.length > 0 ? segments : [{ text: "" }]
}

function stripTags(html: string) {
  return html.replace(/<[^>]*>/g, "")
}
