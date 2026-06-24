"use client"

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react"
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Baseline,
  Bold,
  CaseLower,
  CaseSensitive,
  CaseUpper,
  Italic,
  Link2,
  Maximize2,
  MoveHorizontal,
  Paintbrush,
  Rows3,
  Type,
  Underline as UnderlineIcon,
} from "lucide-react"
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

const FONT_SIZE_MAX = 100

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
  const lastEmittedValueRef = useRef(value)
  const onChangeRef = useRef(onChange)
  const wrapperRef = useRef<HTMLSpanElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const displayValue = value.trim() || placeholder
  const textStyleClassName = textStyleClasses(textStyle)
  const textStyleInline = textStyleInlineStyle(textStyle)
  const inputStyle = {
    ...textStyleInline,
    width: !multiline
      ? `${Math.max(value.length, placeholder.length, 4) + 1}ch`
      : undefined,
  }

  function resizeTextarea() {
    const textarea = textareaRef.current

    if (!textarea) {
      return
    }

    textarea.style.height = "auto"
    textarea.style.height = `${Math.ceil(textarea.scrollHeight) + 6}px`
  }

  function emitValue(nextValue: string) {
    if (lastEmittedValueRef.current === nextValue) {
      return
    }

    lastEmittedValueRef.current = nextValue
    onChangeRef.current(nextValue)
  }

  useLayoutEffect(() => {
    resizeTextarea()
    const animationFrame = requestAnimationFrame(resizeTextarea)

    return () => cancelAnimationFrame(animationFrame)
  }, [
    className,
    multiline,
    textStyle?.bold,
    textStyle?.fontFamily,
    textStyle?.fontSize,
    textStyle?.letterSpacing,
    textStyle?.lineHeight,
    textStyle?.blockWidth,
    value,
  ])

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    lastEmittedValueRef.current = value
  }, [value])

  useEffect(() => {
    if (!editable || !isFocused) {
      return
    }

    const interval = window.setInterval(() => {
      const textarea = textareaRef.current

      if (!textarea) {
        return
      }

      emitValue(textarea.value)
    }, 120)

    return () => window.clearInterval(interval)
  }, [editable, isFocused])

  function closeToolbarIfFocusLeft() {
    window.setTimeout(() => {
      const activeElement = document.activeElement

      if (
        activeElement &&
        wrapperRef.current?.contains(activeElement)
      ) {
        return
      }

      setIsFocused(false)
    }, 0)
  }

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
    <span ref={wrapperRef} className="relative block min-w-0">
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
          "block min-w-0 resize-none overflow-hidden rounded-[2px] border border-transparent bg-transparent p-0 text-inherit outline-none transition-[border-color] placeholder:text-[#8A8A76] focus:border-[#B7B783]/80 focus:bg-transparent",
          multiline ? "w-full" : "w-auto max-w-full whitespace-nowrap",
          className,
          textStyleClassName
        )}
        onBlur={closeToolbarIfFocusLeft}
        onInput={(event) => {
          emitValue(event.currentTarget.value)
          resizeTextarea()
        }}
        onFocus={() => setIsFocused(true)}
        onKeyDown={(event) => {
          if (!multiline && event.key === "Enter") {
            event.preventDefault()
            event.currentTarget.blur()
            return
          }

          if (multiline && event.key === "Enter") {
            requestAnimationFrame(() => {
              resizeTextarea()
              textareaRef.current?.scrollIntoView({
                block: "nearest",
              })
            })
          }
        }}
        placeholder={placeholder}
        rows={1}
        style={inputStyle}
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
  const wrapperRef = useRef<HTMLSpanElement>(null)
  const isEmpty = segments.every((segment) => !segment.text.trim())
  const textStyleClassName = textStyleClasses(textStyle)

  function closeToolbarIfFocusLeft() {
    window.setTimeout(() => {
      const activeElement = document.activeElement

      if (
        activeElement &&
        wrapperRef.current?.contains(activeElement)
      ) {
        return
      }

      setIsFocused(false)
    }, 0)
  }

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
          "data-rich-text-editor": "true",
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
          link: false,
          listItem: false,
          orderedList: false,
          strike: false,
          underline: false,
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
      onBlur: closeToolbarIfFocusLeft,
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
      ref={wrapperRef}
      className={cn("relative block min-w-0", textStyleClassName)}
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
  const fontSize = numericStyleValue(textStyle?.fontSize, 16)
  const lineHeight = numericStyleValue(textStyle?.lineHeight, 1.45)
  const letterSpacing = numericStyleValue(textStyle?.letterSpacing, 0)
  const blockWidth = numericStyleValue(textStyle?.blockWidth, 100)

  return (
    <span
      className="absolute -top-12 left-0 z-20 flex max-w-[min(920px,calc(100vw-32px))] items-center gap-1 overflow-x-auto rounded-xl border border-black/10 bg-white p-1 text-black shadow-[0_14px_36px_rgba(0,0,0,0.12)]"
      onPointerDown={(event) => event.stopPropagation()}
    >
      <ToolbarButton
        active={textStyle?.bold}
        icon={<Bold className="size-4" />}
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
        icon={<Type className="size-4" />}
        title="Alternar fonte serifada"
        onClick={() =>
          onChange?.({
            fontFamily: textStyle?.fontFamily === "serif" ? "sans" : "serif",
          })
        }
      />
      <ToolbarButton
        active={textStyle?.align === "left" || !textStyle?.align}
        icon={<AlignLeft className="size-4" />}
        title="Alinhar à esquerda"
        onClick={() => onChange?.({ align: "left" })}
      />
      <ToolbarButton
        active={textStyle?.align === "center"}
        icon={<AlignCenter className="size-4" />}
        title="Centralizar"
        onClick={() => onChange?.({ align: "center" })}
      />
      <ToolbarButton
        active={textStyle?.align === "right"}
        icon={<AlignRight className="size-4" />}
        title="Alinhar à direita"
        onClick={() => onChange?.({ align: "right" })}
      />
      <ToolbarButton
        icon={<CaseUpper className="size-4" />}
        title="Maiúsculas"
        onClick={onUpper}
      />
      {onTitle && (
        <ToolbarButton
          icon={<CaseSensitive className="size-4" />}
          title="Caixa de título"
          onClick={onTitle}
        />
      )}
      <ToolbarButton
        icon={<CaseLower className="size-4" />}
        title="Minúsculas"
        onClick={onLower}
      />
      {onChange && (
        <ToolbarRange
          icon={<Maximize2 className="size-4" />}
          label="Largura da caixa"
          max={100}
          min={30}
          step={5}
          value={blockWidth}
          onChange={(value) => onChange({ blockWidth: value })}
        />
      )}
      {onChange && (
        <ToolbarRange
          icon={<Baseline className="size-4" />}
          label="Tamanho"
          max={FONT_SIZE_MAX}
          min={10}
          step={1}
          value={fontSize}
          onChange={(value) => onChange({ fontSize: value })}
        />
      )}
      {onChange && (
        <ToolbarRange
          icon={<Rows3 className="size-4" />}
          label="Entrelinha"
          max={2.2}
          min={0.9}
          step={0.05}
          value={lineHeight}
          onChange={(value) => onChange({ lineHeight: value })}
        />
      )}
      {onChange && (
        <ToolbarRange
          icon={<MoveHorizontal className="size-4" />}
          label="Entre letras"
          max={5}
          min={-0.5}
          step={0.1}
          value={letterSpacing}
          onChange={(value) => onChange({ letterSpacing: value })}
        />
      )}
      {onChange && (
        <span className="flex items-center gap-1 border-l border-black/10 pl-1">
          <Paintbrush className="mx-1 size-4 text-black/45" />
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
  const [linkText, setLinkText] = useState("")
  const [linkValue, setLinkValue] = useState("")
  const fontSize = numericStyleValue(textStyle?.fontSize, 16)
  const lineHeight = numericStyleValue(textStyle?.lineHeight, 1.45)
  const letterSpacing = numericStyleValue(textStyle?.letterSpacing, 0)
  const blockWidth = numericStyleValue(textStyle?.blockWidth, 100)

  function openLinkEditor() {
    const { from, to } = editor.state.selection
    const selectedText = editor.state.doc.textBetween(from, to, " ")

    setLinkText(selectedText)
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

    const text = linkText.trim()

    if (text) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .insertContent(`<a href="${escapeHtml(href)}">${escapeHtml(text)}</a>`)
        .run()
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href })
        .run()
    }

    setIsLinkOpen(false)
  }

  return (
    <span
      className="absolute -top-12 left-0 z-30 flex max-w-[min(980px,calc(100vw-32px))] items-center gap-1 overflow-x-auto rounded-xl border border-black/10 bg-white p-1 text-black shadow-[0_14px_36px_rgba(0,0,0,0.12)]"
      onPointerDown={(event) => event.stopPropagation()}
    >
      <ToolbarButton
        active={editor.isActive("bold")}
        icon={<Bold className="size-4" />}
        title="Negrito"
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <ToolbarButton
        active={editor.isActive("italic")}
        icon={<Italic className="size-4" />}
        title="Itálico"
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <ToolbarButton
        active={editor.isActive("underline")}
        icon={<UnderlineIcon className="size-4" />}
        title="Sublinhado"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      />
      <ToolbarButton
        active={editor.isActive("link")}
        icon={<Link2 className="size-4" />}
        title="Editar link"
        onClick={openLinkEditor}
      />
      <ToolbarButton
        active={textStyle?.fontFamily === "serif"}
        icon={<Type className="size-4" />}
        title="Alternar fonte serifada"
        onClick={() =>
          onChange?.({
            fontFamily: textStyle?.fontFamily === "serif" ? "sans" : "serif",
          })
        }
      />
      <ToolbarButton
        active={textStyle?.align === "left" || !textStyle?.align}
        icon={<AlignLeft className="size-4" />}
        title="Alinhar à esquerda"
        onClick={() => onChange?.({ align: "left" })}
      />
      <ToolbarButton
        active={textStyle?.align === "center"}
        icon={<AlignCenter className="size-4" />}
        title="Centralizar"
        onClick={() => onChange?.({ align: "center" })}
      />
      <ToolbarButton
        active={textStyle?.align === "right"}
        icon={<AlignRight className="size-4" />}
        title="Alinhar à direita"
        onClick={() => onChange?.({ align: "right" })}
      />
      {onChange && (
        <ToolbarRange
          icon={<Maximize2 className="size-4" />}
          label="Largura da caixa"
          max={100}
          min={30}
          step={5}
          value={blockWidth}
          onChange={(value) => onChange({ blockWidth: value })}
        />
      )}
      {onChange && (
        <ToolbarRange
          icon={<Baseline className="size-4" />}
          label="Tamanho"
          max={FONT_SIZE_MAX}
          min={10}
          step={1}
          value={fontSize}
          onChange={(value) => onChange({ fontSize: value })}
        />
      )}
      {onChange && (
        <ToolbarRange
          icon={<Rows3 className="size-4" />}
          label="Entrelinha"
          max={2.2}
          min={0.9}
          step={0.05}
          value={lineHeight}
          onChange={(value) => onChange({ lineHeight: value })}
        />
      )}
      {onChange && (
        <ToolbarRange
          icon={<MoveHorizontal className="size-4" />}
          label="Entre letras"
          max={5}
          min={-0.5}
          step={0.1}
          value={letterSpacing}
          onChange={(value) => onChange({ letterSpacing: value })}
        />
      )}
      <span className="flex items-center gap-1 border-l border-black/10 pl-1">
        <Paintbrush className="mx-1 size-4 text-black/45" />
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
        <span
          className="absolute left-0 top-11 z-40 grid w-[min(420px,calc(100vw-32px))] gap-2 rounded-xl border border-black/10 bg-white p-3 shadow-[0_16px_42px_rgba(0,0,0,0.14)]"
          onPointerDown={(event) => event.stopPropagation()}
        >
          <label className="grid gap-1 text-xs font-semibold text-black/55">
            Texto
            <input
              className="h-10 min-w-0 rounded-lg border border-black/15 px-3 text-sm text-black outline-none focus:border-black/45"
              placeholder="Texto do link"
              value={linkText}
              onChange={(event) => setLinkText(event.target.value)}
            />
          </label>
          <label className="grid gap-1 text-xs font-semibold text-black/55">
            Link
            <input
              className="h-10 min-w-0 rounded-lg border border-black/15 px-3 text-sm text-black outline-none focus:border-black/45"
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
          </label>
          <div className="flex justify-end gap-2">
            <button
              className="h-9 rounded-lg border border-black/10 px-3 text-xs font-semibold text-black hover:bg-black/5"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => setIsLinkOpen(false)}
              type="button"
            >
              Cancelar
            </button>
            <button
              className="h-9 rounded-lg bg-black px-3 text-xs font-semibold text-white"
              onMouseDown={(event) => event.preventDefault()}
              onClick={applyLink}
              type="button"
            >
              Aplicar
            </button>
          </div>
        </span>
      )}
    </span>
  )
}

type ToolbarButtonProps = {
  active?: boolean
  icon: ReactNode
  onClick?: () => void
  title: string
}

function ToolbarButton({ active, icon, onClick, title }: ToolbarButtonProps) {
  return (
    <button
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-md text-black/70 transition-colors hover:bg-black/5 hover:text-black",
        active && "bg-black text-white hover:bg-black"
      )}
      disabled={!onClick}
      onPointerDown={(event) => event.stopPropagation()}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      title={title}
      type="button"
    >
      {icon}
      <span className="sr-only">{title}</span>
    </button>
  )
}

type ToolbarRangeProps = {
  icon: ReactNode
  label: string
  max: number
  min: number
  onChange: (value: number) => void
  step: number
  value: number
}

function ToolbarRange({
  icon,
  label,
  max,
  min,
  onChange,
  step,
  value,
}: ToolbarRangeProps) {
  return (
    <label
      className="flex h-8 shrink-0 items-center gap-2 rounded-md border border-black/10 bg-black/[0.03] px-2 text-[11px] font-semibold text-black/70"
      onPointerDown={(event) => event.stopPropagation()}
    >
      {icon}
      <span className="sr-only">{label}</span>
      <input
        className="w-20 accent-black"
        max={max}
        min={min}
        onMouseDown={(event) => event.stopPropagation()}
        onChange={(event) => onChange(Number(event.target.value))}
        step={step}
        title={label}
        type="range"
        value={value}
      />
      <span className="w-8 text-right tabular-nums">
        {Number.isInteger(value) ? value : value.toFixed(1)}
      </span>
    </label>
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
  if (!style) {
    return undefined
  }

  if (
    !style?.color &&
    typeof style?.fontSize !== "number" &&
    typeof style?.letterSpacing !== "number" &&
    typeof style?.lineHeight !== "number" &&
    typeof style?.blockWidth !== "number"
  ) {
    return undefined
  }

  const blockAlignment =
    typeof style.blockWidth === "number" && style.blockWidth < 100
      ? blockAlignmentStyle(style.align)
      : {}

  return {
    ...blockAlignment,
    color: style.color,
    fontSize:
      typeof style.fontSize === "number" ? `${style.fontSize}px` : undefined,
    letterSpacing:
      typeof style.letterSpacing === "number"
        ? `${style.letterSpacing}px`
        : undefined,
    lineHeight:
      typeof style.lineHeight === "number" ? style.lineHeight : undefined,
    maxWidth:
      typeof style.blockWidth === "number" ? `${style.blockWidth}%` : undefined,
  }
}

function blockAlignmentStyle(align: NewsletterTextStyle["align"]) {
  if (align === "center") {
    return {
      marginLeft: "auto",
      marginRight: "auto",
    }
  }

  if (align === "right") {
    return {
      marginLeft: "auto",
      marginRight: "0",
    }
  }

  return {
    marginLeft: "0",
    marginRight: "auto",
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

function numericStyleValue(value: number | string | undefined, fallback: number) {
  return typeof value === "number" ? value : fallback
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
