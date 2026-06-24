"use client"

import Link from "next/link"
import type { ChangeEvent, ReactNode } from "react"
import { useState } from "react"
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  AtSign,
  Copy,
  FileText,
  Globe,
  GripVertical,
  Image as ImageSymbol,
  ImageIcon,
  ImageOff,
  Link2,
  Mail,
  MousePointerClick,
  Phone,
  Plus,
  Quote,
  Scale,
  Trash2,
} from "lucide-react"

import type {
  NewsletterContact,
  NewsletterCustomSection,
  NewsletterSection,
  NewsletterSectionType,
  NewsletterSidebarBlock,
  NewsletterTemplate,
  NewsletterTextStyle,
} from "yes@/lib/newsletter/types"
import { getNewsletterSections } from "yes@/lib/newsletter/sections"
import { cn } from "yes@/lib/utils"

import { InlineRichText, InlineText } from "./inline-editable"

export type NewsletterEditorViewport = "desktop" | "mobile"

type NewsletterInlineCanvasProps = {
  editable: boolean
  newsletter: NewsletterTemplate
  onAttorneyPhotoChange: (event: ChangeEvent<HTMLInputElement>) => void
  onChange: (updater: (draft: NewsletterTemplate) => void) => void
  onLogoChange: (event: ChangeEvent<HTMLInputElement>) => void
  onRemoveAttorneyPhoto: () => void
  onRemoveLogo: () => void
  viewport: NewsletterEditorViewport
}

const contactIcons = {
  Telefone: Phone,
  "E-mail": Mail,
  Site: Globe,
}

const socialIcons = {
  Instagram: AtSign,
  LinkedIn: Link2,
}

export function NewsletterInlineCanvas({
  editable,
  newsletter,
  onAttorneyPhotoChange,
  onChange,
  onLogoChange,
  onRemoveAttorneyPhoto,
  onRemoveLogo,
  viewport,
}: NewsletterInlineCanvasProps) {
  const isMobile = viewport === "mobile"
  const sections = getNewsletterSections(newsletter)
  const visibleSections = sections.filter((section) => !section.hidden)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )
  const bannerText =
    newsletter.banner.trim() || "INFORMATIVO CONDOMINIAL · EDIÇÃO EM RASCUNHO"
  const theme = newsletter.theme ?? {}

  function moveSection(sectionId: string, direction: -1 | 1) {
    const currentIndex = visibleSections.findIndex(
      (section) => section.id === sectionId
    )
    const nextIndex = currentIndex + direction

    if (
      currentIndex < 0 ||
      nextIndex < 0 ||
      nextIndex >= visibleSections.length
    ) {
      return
    }

    onChange((draft) => {
      const reorderedVisible = arrayMove(
        visibleSections,
        currentIndex,
        nextIndex
      )
      const hiddenSections = sections.filter((section) => section.hidden)

      draft.sections = [...reorderedVisible, ...hiddenSections].map(
        (section, index) => ({ ...section, order: index })
      )
    })
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    const activeIndex = visibleSections.findIndex(
      (section) => section.id === active.id
    )
    const overIndex = visibleSections.findIndex((section) => section.id === over.id)

    if (activeIndex < 0 || overIndex < 0) {
      return
    }

    onChange((draft) => {
      const reorderedVisible = arrayMove(
        visibleSections,
        activeIndex,
        overIndex
      )
      const hiddenSections = sections.filter((section) => section.hidden)

      draft.sections = [...reorderedVisible, ...hiddenSections].map(
        (section, index) => ({ ...section, order: index })
      )
    })
  }

  function addCustomSection(type: NewsletterCustomSection["type"]) {
    const id = createSectionId(type)
    const customSection = createCustomSection(type, id)

    onChange((draft) => {
      const currentSections = getNewsletterSections(draft)
      const currentVisibleSections = currentSections.filter(
        (section) => !section.hidden
      )
      const currentHiddenSections = currentSections.filter(
        (section) => section.hidden
      )

      draft.customSections = [...(draft.customSections ?? []), customSection]
      draft.sections = [
        ...currentVisibleSections,
        {
          id,
          order: currentVisibleSections.length,
          type,
        },
        ...currentHiddenSections,
      ].map((section, index) => ({ ...section, order: index }))
    })
  }

  function duplicateSection(section: NewsletterSection) {
    const customSection = newsletter.customSections?.find(
      (item) => item.id === section.id
    )

    if (!customSection) {
      return
    }

    const id = createSectionId(customSection.type)
    const currentIndex = visibleSections.findIndex(
      (item) => item.id === section.id
    )
    const nextSection = {
      ...structuredClone(customSection),
      id,
    }
    const nextSections = [...visibleSections]
    nextSections.splice(currentIndex + 1, 0, {
      id,
      order: currentIndex + 1,
      type: customSection.type,
    })

    onChange((draft) => {
      draft.customSections = [...(draft.customSections ?? []), nextSection]
      draft.sections = [
        ...nextSections,
        ...sections.filter((item) => item.hidden),
      ].map((item, index) => ({ ...item, order: index }))
    })
  }

  function deleteSection(section: NewsletterSection) {
    onChange((draft) => {
      if (section.type.startsWith("custom-")) {
        draft.customSections = (draft.customSections ?? []).filter(
          (item) => item.id !== section.id
        )
        draft.sections = sections
          .filter((item) => item.id !== section.id)
          .map((item, index) => ({ ...item, order: index }))
        return
      }

      draft.sections = sections.map((item, index) =>
        item.id === section.id
          ? { ...item, hidden: true, order: index }
          : { ...item, order: index }
      )
    })
  }

  function getTextStyle(fieldId: string) {
    return newsletter.textStyles?.[fieldId]
  }

  function updateTextStyle(fieldId: string, style: NewsletterTextStyle) {
    onChange((draft) => {
      draft.textStyles = {
        ...(draft.textStyles ?? {}),
        [fieldId]: removeEmptyStyle(style),
      }
    })
  }

  const textStyleProps = (fieldId: string) => ({
    textStyle: getTextStyle(fieldId),
    onTextStyleChange: (style: NewsletterTextStyle) =>
      updateTextStyle(fieldId, style),
  })

  return (
    <main
      className={cn(
        "min-h-screen bg-[#F7F5EE] text-[#1F1F1A]",
        isMobile && "min-h-0 shadow-[0_22px_70px_rgba(22,59,53,0.18)]"
      )}
      style={{
        backgroundColor: theme.background,
        color: theme.text,
      }}
    >
      <EditableNewsletterHeader
        editable={editable}
        isMobile={isMobile}
        newsletter={newsletter}
        onChange={onChange}
        onLogoChange={onLogoChange}
        onRemoveLogo={onRemoveLogo}
      />

      <div
        className={cn(
          "border-y border-[#B7B783]/45 bg-[#244F49] px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#F7F5EE]",
          !isMobile && "sm:text-[11px]",
          isMobile && "tracking-[0.18em]"
        )}
      >
        <div
          className={cn(
            "mx-auto w-full [overflow-wrap:anywhere]",
            isMobile ? "max-w-[430px]" : "max-w-[1280px]"
          )}
        >
          <InlineText
            ariaLabel="Texto da faixa institucional"
            editable={editable}
            multiline
            placeholder="INFORMATIVO CONDOMINIAL · EDIÇÃO"
            value={bannerText}
            onChange={(value) =>
              onChange((draft) => {
                draft.banner = value
              })
            }
            {...textStyleProps("banner")}
          />
        </div>
      </div>

      <section
        className={cn(
          "mx-auto w-full",
          isMobile
            ? "max-w-[430px] px-4 py-8"
            : "max-w-[1280px] px-5 py-10 sm:px-7 lg:px-8 lg:py-14"
        )}
      >
        <div
          className={cn(
            "grid gap-12",
            isMobile
              ? "grid-cols-1"
              : "lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_390px]"
          )}
        >
          <div className={cn("min-w-0", isMobile ? "space-y-10" : "space-y-14")}>
            {editable ? (
              <>
                <DndContext
                  collisionDetection={closestCenter}
                  id="newsletter-inline-section-sorter"
                  sensors={sensors}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={visibleSections.map((section) => section.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {visibleSections.map((section, index) => (
                      <SortableSectionFrame
                        key={section.id}
                        index={index}
                        section={section}
                        total={visibleSections.length}
                        onDelete={deleteSection}
                        onDuplicate={duplicateSection}
                        onMove={moveSection}
                      >
                        <NewsletterContentSection
                          editable={editable}
                          isMobile={isMobile}
                          newsletter={newsletter}
                          section={section}
                          type={section.type}
                          onChange={onChange}
                          textStyleProps={textStyleProps}
                        />
                      </SortableSectionFrame>
                    ))}
                  </SortableContext>
                </DndContext>
                <AddSectionBar onAdd={addCustomSection} />
              </>
            ) : (
              visibleSections.map((section) => (
                <div key={section.id} className="relative min-w-0">
                  <NewsletterContentSection
                    editable={editable}
                    isMobile={isMobile}
                    newsletter={newsletter}
                    section={section}
                    type={section.type}
                    onChange={onChange}
                    textStyleProps={textStyleProps}
                  />
                </div>
              ))
            )}
          </div>

          <EditableSidebar
            editable={editable}
            isMobile={isMobile}
            newsletter={newsletter}
            onAttorneyPhotoChange={onAttorneyPhotoChange}
            onChange={onChange}
            onRemoveAttorneyPhoto={onRemoveAttorneyPhoto}
            textStyleProps={textStyleProps}
          />
        </div>
      </section>

      <EditableNewsletterFooter
        editable={editable}
        isMobile={isMobile}
        newsletter={newsletter}
        onChange={onChange}
        textStyleProps={textStyleProps}
      />
    </main>
  )
}

type NewsletterContentSectionProps = {
  editable: boolean
  isMobile: boolean
  newsletter: NewsletterTemplate
  onChange: (updater: (draft: NewsletterTemplate) => void) => void
  section: NewsletterSection
  textStyleProps: (fieldId: string) => {
    onTextStyleChange: (style: NewsletterTextStyle) => void
    textStyle: NewsletterTextStyle | undefined
  }
  type: NewsletterSectionType
}

function NewsletterContentSection({
  editable,
  isMobile,
  newsletter,
  onChange,
  section,
  textStyleProps,
  type,
}: NewsletterContentSectionProps) {
  if (type === "hero") {
    return (
      <EditableHero
        editable={editable}
        isMobile={isMobile}
        newsletter={newsletter}
        onChange={onChange}
        textStyleProps={textStyleProps}
      />
    )
  }

  if (type === "decision") {
    return (
      <EditableDecisionBox
        editable={editable}
        isMobile={isMobile}
        newsletter={newsletter}
        onChange={onChange}
        textStyleProps={textStyleProps}
      />
    )
  }

  if (type === "body") {
    return (
      <EditableBody
        editable={editable}
        isMobile={isMobile}
        newsletter={newsletter}
        onChange={onChange}
        textStyleProps={textStyleProps}
      />
    )
  }

  if (type === "syndic") {
    return (
      <EditableSyndicCards
        editable={editable}
        isMobile={isMobile}
        newsletter={newsletter}
        onChange={onChange}
        textStyleProps={textStyleProps}
      />
    )
  }

  if (type === "cta") {
    return (
      <EditableCta
        editable={editable}
        isMobile={isMobile}
        newsletter={newsletter}
        onChange={onChange}
        textStyleProps={textStyleProps}
      />
    )
  }

  if (type === "custom-text") {
    return (
      <EditableCustomTextSection
        editable={editable}
        newsletter={newsletter}
        section={section}
        onChange={onChange}
        textStyleProps={textStyleProps}
      />
    )
  }

  if (type === "custom-image") {
    return (
      <EditableCustomImageSection
        editable={editable}
        newsletter={newsletter}
        section={section}
        onChange={onChange}
        textStyleProps={textStyleProps}
      />
    )
  }

  if (type === "custom-button") {
    return (
      <EditableCustomButtonSection
        editable={editable}
        isMobile={isMobile}
        newsletter={newsletter}
        section={section}
        onChange={onChange}
        textStyleProps={textStyleProps}
      />
    )
  }

  if (type === "custom-media-text") {
    return (
      <EditableCustomMediaTextSection
        editable={editable}
        isMobile={isMobile}
        newsletter={newsletter}
        section={section}
        onChange={onChange}
        textStyleProps={textStyleProps}
      />
    )
  }

  return null
}

type AddSectionBarProps = {
  onAdd: (type: NewsletterCustomSection["type"]) => void
}

function AddSectionBar({ onAdd }: AddSectionBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 rounded-xl border border-dashed border-black/20 bg-transparent p-4 text-black">
      <span className="inline-flex items-center gap-1.5 px-2 text-xs font-semibold uppercase tracking-[0.12em] text-black/45">
        <Plus className="size-3.5" />
        Nova seção
      </span>
      <AddSectionButton
        icon={<FileText className="size-4" />}
        label="Texto"
        onClick={() => onAdd("custom-text")}
      />
      <AddSectionButton
        icon={<ImageSymbol className="size-4" />}
        label="Imagem"
        onClick={() => onAdd("custom-image")}
      />
      <AddSectionButton
        icon={<MousePointerClick className="size-4" />}
        label="Botão"
        onClick={() => onAdd("custom-button")}
      />
      <AddSectionButton
        icon={<ImageSymbol className="size-4" />}
        label="Imagem + texto"
        onClick={() => onAdd("custom-media-text")}
      />
    </div>
  )
}

type AddSectionButtonProps = {
  icon: ReactNode
  label: string
  onClick: () => void
}

function AddSectionButton({ icon, label, onClick }: AddSectionButtonProps) {
  return (
    <button
      className="inline-flex h-9 items-center gap-2 rounded-lg border border-dashed border-black/20 bg-transparent px-3 text-xs font-semibold text-black/65 transition-colors hover:border-black hover:bg-black hover:text-white"
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        onClick()
      }}
      type="button"
    >
      {icon}
      {label}
    </button>
  )
}

type SortableSectionFrameProps = {
  children: ReactNode
  index: number
  onDelete: (section: NewsletterSection) => void
  onDuplicate: (section: NewsletterSection) => void
  onMove: (sectionId: string, direction: -1 | 1) => void
  section: NewsletterSection
  total: number
}

function SortableSectionFrame({
  children,
  index,
  onDelete,
  onDuplicate,
  onMove,
  section,
  total,
}: SortableSectionFrameProps) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: section.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "relative min-w-0",
        "rounded-sm outline outline-1 outline-transparent transition-[outline-color,box-shadow] focus-within:outline-[#B7B783]/80 hover:outline-[#B7B783]/80",
        isDragging && "z-20 opacity-80 shadow-[0_24px_70px_rgba(22,59,53,0.22)]"
      )}
      style={style}
    >
      <div className="absolute -top-4 right-0 z-30 flex items-center overflow-hidden rounded-lg border border-black/10 bg-white/95 text-black shadow-[0_10px_28px_rgba(0,0,0,0.12)]">
        <button
          className="cursor-grab px-2 py-1.5 text-black/65 hover:bg-black/5 active:cursor-grabbing"
          type="button"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
          <span className="sr-only">Arrastar bloco</span>
        </button>
        <button
          className="border-l border-black/10 px-2 py-1.5 text-black/65 hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={index === 0}
          onClick={() => onMove(section.id, -1)}
          type="button"
        >
          <ArrowUp className="size-4" />
          <span className="sr-only">Mover bloco para cima</span>
        </button>
        <button
          className="border-l border-black/10 px-2 py-1.5 text-black/65 hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={index === total - 1}
          onClick={() => onMove(section.id, 1)}
          type="button"
        >
          <ArrowDown className="size-4" />
          <span className="sr-only">Mover bloco para baixo</span>
        </button>
        <button
          className="border-l border-black/10 px-2 py-1.5 text-black/65 hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={!section.type.startsWith("custom-")}
          onClick={() => onDuplicate(section)}
          type="button"
        >
          <Copy className="size-4" />
          <span className="sr-only">Duplicar seção</span>
        </button>
        <button
          className="border-l border-black/10 px-2 py-1.5 text-black/65 hover:bg-black/5"
          onClick={() => onDelete(section)}
          type="button"
        >
          <Trash2 className="size-4" />
          <span className="sr-only">Excluir seção</span>
        </button>
      </div>
      {children}
    </div>
  )
}

type EditableHeaderProps = {
  editable: boolean
  isMobile: boolean
  newsletter: NewsletterTemplate
  onChange: (updater: (draft: NewsletterTemplate) => void) => void
  onLogoChange: (event: ChangeEvent<HTMLInputElement>) => void
  onRemoveLogo: () => void
}

function EditableNewsletterHeader({
  editable,
  isMobile,
  newsletter,
  onChange,
  onLogoChange,
  onRemoveLogo,
}: EditableHeaderProps) {
  const collection = newsletter.header.collection
  const period = newsletter.header.period
  const issue = newsletter.header.issue
  const label = newsletter.header.label
  const firmName = newsletter.firm.name
  const firmDescriptor = newsletter.firm.descriptor

  return (
    <header
      className={cn(
        "relative border-b border-[#B7B783] bg-[#F7F5EE]",
        isMobile ? "px-4 py-5" : "px-5 py-5 sm:px-7 lg:px-8"
      )}
    >
      <div className="absolute inset-x-0 top-0 flex h-1">
        <div className="flex-1 bg-[#163B35]" />
        <div className="w-40 bg-[#B7B783]" />
      </div>

      <div
        className={cn(
          "mx-auto grid w-full",
          isMobile
            ? "max-w-[430px] gap-5"
            : "max-w-[1280px] sm:grid-cols-[1fr_1.45fr_1fr] sm:items-center"
        )}
      >
        <div className="min-w-0 space-y-1 text-[11px] font-bold uppercase leading-5 tracking-[0.18em] text-[#244F49] [overflow-wrap:anywhere]">
          <InlineText
            ariaLabel="Coleção"
            editable={editable}
            multiline
            placeholder="COLEÇÃO"
            value={collection}
            onChange={(value) =>
              onChange((draft) => {
                draft.header.collection = value
              })
            }
          />
          <InlineText
            ariaLabel="Período"
            className="text-[#6D714C]"
            editable={editable}
            multiline
            placeholder="PERÍODO"
            value={period}
            onChange={(value) =>
              onChange((draft) => {
                draft.header.period = value
              })
            }
          />
        </div>

        <div
          className={cn(
            "flex min-w-0 items-center gap-3",
            !isMobile && "sm:justify-center"
          )}
        >
          <EditableLogo
            editable={editable}
            newsletter={newsletter}
            onLogoChange={onLogoChange}
            onRemoveLogo={onRemoveLogo}
          />
          <div className="min-w-0">
            <InlineText
              ariaLabel="Nome do escritório"
              className={cn(
                "font-semibold leading-tight tracking-[-0.02em] text-[#1F1F1A]",
                isMobile ? "text-[21px]" : "text-[25px]"
              )}
              editable={editable}
              multiline
              placeholder="Nome do escritório"
              value={firmName}
              onChange={(value) =>
                onChange((draft) => {
                  draft.firm.name = value
                })
              }
            />
            <InlineText
              ariaLabel="Descrição do escritório"
              className={cn(
                "mt-1 text-[10px] font-bold uppercase leading-5 text-[#244F49]",
                isMobile ? "tracking-[0.16em]" : "tracking-[0.2em]"
              )}
              editable={editable}
              multiline
              placeholder="Advogados Associados"
              value={firmDescriptor}
              onChange={(value) =>
                onChange((draft) => {
                  draft.firm.descriptor = value
                })
              }
            />
          </div>
        </div>

        <div
          className={cn(
            "min-w-0 space-y-1 text-[11px] font-bold uppercase leading-5 tracking-[0.18em] text-[#244F49] [overflow-wrap:anywhere]",
            !isMobile && "sm:text-right"
          )}
        >
          <InlineText
            ariaLabel="Número da edição"
            editable={editable}
            multiline
            placeholder="EDIÇÃO"
            value={issue}
            onChange={(value) =>
              onChange((draft) => {
                draft.header.issue = value
              })
            }
          />
          <InlineText
            ariaLabel="Tipo de informativo"
            className="text-[#6D714C]"
            editable={editable}
            multiline
            placeholder="Informativo"
            value={label}
            onChange={(value) =>
              onChange((draft) => {
                draft.header.label = value
              })
            }
          />
        </div>
      </div>
    </header>
  )
}

type EditableLogoProps = {
  editable: boolean
  newsletter: NewsletterTemplate
  onLogoChange: (event: ChangeEvent<HTMLInputElement>) => void
  onRemoveLogo: () => void
}

function EditableLogo({
  editable,
  newsletter,
  onLogoChange,
  onRemoveLogo,
}: EditableLogoProps) {
  const logoUrl = newsletter.firm.logoUrl
  const firmName = newsletter.firm.name.trim() || "Logo do escritório"

  return (
    <div className="group/logo relative grid size-12 shrink-0 place-items-center rounded-full border border-[#B7B783] bg-[#163B35] text-[#F7F5EE] shadow-[0_0_0_6px_rgba(183,183,131,0.13)]">
      {logoUrl ? (
        <div
          aria-label={newsletter.firm.logoAlt ?? firmName}
          className="h-full w-full rounded-full bg-cover bg-center"
          role="img"
          style={{ backgroundImage: `url(${logoUrl})` }}
        />
      ) : (
        <Scale className="size-6" />
      )}

      {editable && (
        <div className="absolute inset-0 grid place-items-center rounded-full bg-[#163B35]/0 opacity-0 transition-opacity group-hover/logo:bg-[#163B35]/75 group-hover/logo:opacity-100 group-focus-within/logo:bg-[#163B35]/75 group-focus-within/logo:opacity-100">
          <div className="flex items-center gap-1">
            <label className="grid size-7 cursor-pointer place-items-center rounded-full bg-[#F7F5EE] text-[#163B35] shadow-sm">
              <ImageIcon className="size-4" />
              <span className="sr-only">Trocar logo</span>
              <input
                accept="image/*"
                className="sr-only"
                onChange={onLogoChange}
                type="file"
              />
            </label>
            {logoUrl && (
              <button
                className="grid size-7 place-items-center rounded-full bg-[#F7F5EE] text-[#163B35] shadow-sm"
                onClick={onRemoveLogo}
                type="button"
              >
                <ImageOff className="size-4" />
                <span className="sr-only">Remover logo</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function EditableHero({
  editable,
  isMobile,
  newsletter,
  onChange,
  textStyleProps,
}: Omit<NewsletterContentSectionProps, "section" | "type">) {
  const intro = newsletter.intro.length > 0 ? newsletter.intro : [{ text: "" }]

  return (
    <section className="border-b border-[#B7B783]/60 pb-12">
      <InlineText
        ariaLabel="Título principal"
        className={cn(
          "max-w-[860px] font-serif leading-[0.98] tracking-tight text-[#1F1F1A]",
          isMobile ? "text-[38px]" : "text-5xl sm:text-6xl lg:text-[84px]"
        )}
        editable={editable}
        placeholder="Título do informativo"
        renderAs="h1"
        showTextTools
        value={newsletter.title}
        onChange={(value) =>
          onChange((draft) => {
            draft.title = value
          })
        }
        {...textStyleProps("title")}
      />
      <InlineText
        ariaLabel="Destaque principal"
        className={cn(
          "mt-7 max-w-[860px] border-l-[6px] border-[#B7B783] pl-6 font-serif leading-tight text-[#244F49]",
          isMobile ? "text-[25px]" : "text-3xl sm:text-[42px]"
        )}
        editable={editable}
        placeholder="Destaque principal"
        renderAs="p"
        showTextTools
        value={newsletter.highlight}
        onChange={(value) =>
          onChange((draft) => {
            draft.highlight = value
          })
        }
        {...textStyleProps("highlight")}
      />

      <InlineRichText
        ariaLabel="Parágrafo introdutório"
        className={cn(
          "mt-9 max-w-[820px] text-[#1F1F1A]",
          isMobile ? "text-[15px] leading-7" : "text-[18px] leading-9"
        )}
        editable={editable}
        placeholder="Parágrafo introdutório do informativo."
        segments={intro}
        onChange={(segments) =>
          onChange((draft) => {
            draft.intro = segments
          })
        }
        {...textStyleProps("intro")}
      />
    </section>
  )
}

function EditableDecisionBox({
  editable,
  isMobile,
  newsletter,
  onChange,
  textStyleProps,
}: Omit<NewsletterContentSectionProps, "section" | "type">) {
  const topics =
    newsletter.decisionTopics.length > 0
      ? newsletter.decisionTopics
      : [{ title: "", description: "" }]

  return (
    <section
      className={cn(
        "border border-[#B7B783] bg-white shadow-[inset_0_4px_0_#244F49]",
        isMobile ? "p-5" : "p-6 sm:p-8"
      )}
    >
      <div
        className={cn(
          "grid gap-x-8 gap-y-0",
          !isMobile && "sm:grid-cols-2"
        )}
      >
        {topics.map((topic, index) => (
          <article
            key={`decision-topic-${index}`}
            className="grid grid-cols-[42px_minmax(0,1fr)] gap-4 border-b border-[#B7B783]/70 py-5"
          >
            <span className="pt-1 text-2xl font-semibold leading-none text-[#244F49]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <InlineText
                ariaLabel={`Título do tópico jurídico ${index + 1}`}
                className="text-[20px] font-semibold leading-tight text-[#1F1F1A]"
                editable={editable}
                placeholder="Tópico jurídico"
                renderAs="h3"
                value={topic.title}
                onChange={(value) =>
                  onChange((draft) => {
                    draft.decisionTopics[index].title = value
                  })
                }
                {...textStyleProps(`decisionTopics.${index}.title`)}
              />
              <InlineText
                ariaLabel={`Descrição do tópico jurídico ${index + 1}`}
                className="mt-2 text-sm leading-6 text-[#404038]"
                editable={editable}
                placeholder="Descrição objetiva do entendimento."
                renderAs="p"
                value={topic.description}
                onChange={(value) =>
                  onChange((draft) => {
                    draft.decisionTopics[index].description = value
                  })
                }
                {...textStyleProps(`decisionTopics.${index}.description`)}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function EditableBody({
  editable,
  isMobile,
  newsletter,
  onChange,
  textStyleProps,
}: Omit<NewsletterContentSectionProps, "section" | "type">) {
  const blocks =
    newsletter.bodyBlocks.length > 0
      ? newsletter.bodyBlocks
      : [{ eyebrow: "", paragraphs: [""], title: "" }]

  return (
    <div className="space-y-12">
      {blocks.map((block, index) => {
        const paragraphs = block.paragraphs.length > 0 ? block.paragraphs : [""]

        return (
          <article
            key={`body-block-${index}`}
            className="grid grid-cols-[5px_minmax(0,1fr)] gap-5"
          >
            <div className="bg-[#244F49]" />
            <div className="min-w-0 pb-1">
              {editable && (
                <div className="mb-3 flex flex-wrap gap-2">
                  <BlockActionButton
                    icon={<Plus className="size-3.5" />}
                    label="Novo parágrafo"
                    onClick={() =>
                      onChange((draft) => {
                        draft.bodyBlocks[index].paragraphs.push("")
                      })
                    }
                  />
                  <BlockActionButton
                    icon={<Copy className="size-3.5" />}
                    label="Duplicar bloco"
                    onClick={() =>
                      onChange((draft) => {
                        draft.bodyBlocks.splice(index + 1, 0, {
                          ...structuredClone(draft.bodyBlocks[index]),
                        })
                      })
                    }
                  />
                  <BlockActionButton
                    icon={<Trash2 className="size-3.5" />}
                    label="Excluir bloco"
                    onClick={() =>
                      onChange((draft) => {
                        if (draft.bodyBlocks.length > 1) {
                          draft.bodyBlocks.splice(index, 1)
                        }
                      })
                    }
                  />
                </div>
              )}
              <InlineText
                ariaLabel={`Título do bloco explicativo ${index + 1}`}
                className={cn(
                  "max-w-2xl font-semibold leading-tight tracking-[-0.02em] text-[#1F1F1A]",
                  isMobile ? "text-[27px]" : "text-[32px]"
                )}
                editable={editable}
                placeholder="Título do bloco explicativo"
                renderAs="h2"
                value={block.title}
                onChange={(value) =>
                  onChange((draft) => {
                    draft.bodyBlocks[index].title = value
                  })
                }
                {...textStyleProps(`bodyBlocks.${index}.title`)}
              />
              <div className="mt-5 space-y-5 text-[16px] leading-8 text-[#404038] [overflow-wrap:anywhere]">
                {paragraphs.map((paragraph, paragraphIndex) => (
                  <div
                    key={`body-block-${index}-paragraph-${paragraphIndex}`}
                    className="group/paragraph relative"
                  >
                    <InlineText
                      ariaLabel={`Parágrafo ${paragraphIndex + 1} do bloco ${index + 1}`}
                      editable={editable}
                      placeholder="Texto explicativo do informativo."
                      renderAs="p"
                      value={paragraph}
                      onChange={(value) =>
                        onChange((draft) => {
                          draft.bodyBlocks[index].paragraphs[paragraphIndex] =
                            value
                        })
                      }
                      {...textStyleProps(
                        `bodyBlocks.${index}.paragraphs.${paragraphIndex}`
                      )}
                    />
                    {editable && paragraphs.length > 1 && (
                      <button
                        className="absolute -right-2 -top-2 grid size-7 place-items-center rounded-full border border-black/10 bg-white text-black/45 opacity-0 shadow-sm transition-opacity hover:text-black group-hover/paragraph:opacity-100"
                        onClick={() =>
                          onChange((draft) => {
                            draft.bodyBlocks[index].paragraphs.splice(
                              paragraphIndex,
                              1
                            )
                          })
                        }
                        type="button"
                      >
                        <Trash2 className="size-3.5" />
                        <span className="sr-only">Excluir parágrafo</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}

type BlockActionButtonProps = {
  icon: ReactNode
  label: string
  onClick: () => void
}

function BlockActionButton({ icon, label, onClick }: BlockActionButtonProps) {
  return (
    <button
      className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-black/10 bg-white px-2.5 text-xs font-semibold text-black/60 shadow-sm transition-colors hover:bg-black hover:text-white"
      onClick={onClick}
      type="button"
    >
      {icon}
      {label}
    </button>
  )
}

function EditableSyndicCards({
  editable,
  isMobile,
  newsletter,
  onChange,
  textStyleProps,
}: Omit<NewsletterContentSectionProps, "section" | "type">) {
  const cards =
    newsletter.syndicCards.length > 0
      ? newsletter.syndicCards
      : []

  function addSyndicCard() {
    onChange((draft) => {
      const nextNumber = String(draft.syndicCards.length + 1).padStart(2, "0")

      draft.syndicCards.push({
        description: "Descreva o ponto de atenção para o síndico.",
        number: nextNumber,
        title: "Novo ponto de atenção",
      })
    })
  }

  function duplicateSyndicCard(index: number) {
    onChange((draft) => {
      const card = draft.syndicCards[index]

      if (!card) {
        return
      }

      draft.syndicCards.splice(index + 1, 0, {
        ...structuredClone(card),
        number: String(index + 2).padStart(2, "0"),
      })
    })
  }

  function deleteSyndicCard(index: number) {
    onChange((draft) => {
      draft.syndicCards.splice(index, 1)
    })
  }

  return (
    <section className="border-b border-[#B7B783]/55 pb-12">
      <div className="flex items-center gap-5">
        <InlineText
          ariaLabel="Título dos cards numerados"
          className="min-w-0 text-2xl font-semibold tracking-[-0.02em] text-[#163B35]"
          editable={editable}
          multiline={false}
          placeholder="Pontos de atenção"
          renderAs="h2"
          value={newsletter.syndicTitle}
          onChange={(value) =>
            onChange((draft) => {
              draft.syndicTitle = value
            })
          }
          {...textStyleProps("syndicTitle")}
        />
        <div className="h-px flex-1 bg-[#B7B783]" />
      </div>

      <div
        className={cn(
          "mt-7 grid gap-5",
          !isMobile && "sm:grid-cols-2"
        )}
      >
        {cards.map((card, index) => (
          <article
            key={`syndic-card-${index}`}
            className="group/card relative grid min-h-44 grid-cols-[58px_minmax(0,1fr)] gap-5 border border-[#B7B783] bg-white p-5 shadow-[inset_4px_0_0_#244F49]"
          >
            {editable && (
              <div className="absolute right-3 top-3 z-20 flex overflow-hidden rounded-lg border border-black/10 bg-white/95 text-black opacity-0 shadow-[0_10px_26px_rgba(0,0,0,0.12)] transition-opacity group-hover/card:opacity-100 group-focus-within/card:opacity-100">
                <button
                  className="px-2 py-1.5 text-black/60 transition-colors hover:bg-black/5 hover:text-black"
                  onClick={() => duplicateSyndicCard(index)}
                  title="Duplicar card"
                  type="button"
                >
                  <Copy className="size-3.5" />
                  <span className="sr-only">Duplicar card</span>
                </button>
                <button
                  className="border-l border-black/10 px-2 py-1.5 text-black/60 transition-colors hover:bg-black/5 hover:text-black"
                  onClick={() => deleteSyndicCard(index)}
                  title="Excluir card"
                  type="button"
                >
                  <Trash2 className="size-3.5" />
                  <span className="sr-only">Excluir card</span>
                </button>
              </div>
            )}
            <InlineText
              ariaLabel={`Número do card ${index + 1}`}
              className="inline-flex size-12 items-center justify-center rounded-full border border-[#B7B783] bg-[#F7F5EE] px-1 text-center text-xl font-semibold leading-none text-[#244F49]"
              editable={editable}
              multiline={false}
              placeholder={String(index + 1).padStart(2, "0")}
              value={card.number}
              onChange={(value) =>
                onChange((draft) => {
                  draft.syndicCards[index].number = value
                })
              }
              {...textStyleProps(`syndicCards.${index}.number`)}
            />
            <div className="min-w-0">
              <InlineText
                ariaLabel={`Título do card ${index + 1}`}
                className="text-[19px] font-semibold leading-tight text-[#1F1F1A]"
                editable={editable}
                placeholder="Título do card"
                renderAs="h3"
                value={card.title}
                onChange={(value) =>
                  onChange((draft) => {
                    draft.syndicCards[index].title = value
                  })
                }
                {...textStyleProps(`syndicCards.${index}.title`)}
              />
              <InlineText
                ariaLabel={`Descrição do card ${index + 1}`}
                className="mt-3 text-sm leading-6 text-[#404038]"
                editable={editable}
                placeholder="Descrição objetiva para orientar a decisão."
                renderAs="p"
                value={card.description}
                onChange={(value) =>
                  onChange((draft) => {
                    draft.syndicCards[index].description = value
                  })
                }
                {...textStyleProps(`syndicCards.${index}.description`)}
              />
            </div>
          </article>
        ))}

        {editable && (
          <button
            className="grid min-h-44 place-items-center border border-dashed border-[#B7B783] bg-transparent p-5 text-[#244F49] transition-colors hover:bg-white/55"
            onClick={addSyndicCard}
            type="button"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-dashed border-[#244F49]/45 px-4 py-2 text-sm font-semibold">
              <Plus className="size-4" />
              Adicionar card
            </span>
          </button>
        )}
      </div>
    </section>
  )
}

function EditableCta({
  editable,
  isMobile,
  newsletter,
  onChange,
  textStyleProps,
}: Omit<NewsletterContentSectionProps, "section" | "type">) {
  const cta = newsletter.cta
  const label = cta.label.trim() || "Falar com o escritório"
  const href = cta.href.trim() || "#"

  return (
    <section
      className={cn(
        "rounded-md border border-[#B7B783] bg-[#163B35] text-[#F7F5EE]",
        isMobile ? "p-5" : "p-6 sm:p-7"
      )}
    >
      <div
        className={cn(
          "grid gap-6",
          !isMobile && "sm:grid-cols-[1fr_auto] sm:items-center"
        )}
      >
        <div className="min-w-0">
          <InlineText
            ariaLabel="Título do CTA"
            className="text-3xl font-semibold leading-tight tracking-[-0.02em]"
            editable={editable}
            placeholder="Chamada para atendimento"
            renderAs="h2"
            value={cta.title}
            onChange={(value) =>
              onChange((draft) => {
                draft.cta.title = value
              })
            }
            {...textStyleProps("cta.title")}
          />
          <InlineText
            ariaLabel="Descrição do CTA"
            className="mt-3 max-w-2xl text-sm leading-6 text-[#E8E4D4]"
            editable={editable}
            placeholder="Texto de apoio para orientar o próximo passo."
            renderAs="p"
            value={cta.description}
            onChange={(value) =>
              onChange((draft) => {
                draft.cta.description = value
              })
            }
            {...textStyleProps("cta.description")}
          />
        </div>

        <div className="min-w-0">
          {editable ? (
            <LinkLabelPopoverButton
              className="bg-[#B7B783] text-[#163B35] hover:bg-[#F7F5EE]"
              href={cta.href}
              label={label}
              labelPlaceholder="Falar com o escritório"
              onChange={({ href, label }) =>
                onChange((draft) => {
                  draft.cta.href = href
                  draft.cta.label = label
                })
              }
            />
          ) : (
            <Link
              className="inline-flex w-fit max-w-full items-center gap-2 rounded-sm bg-[#B7B783] px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#163B35] transition-colors hover:bg-[#F7F5EE]"
              href={href}
            >
              <span className="[overflow-wrap:anywhere]">{label}</span>
              <ArrowRight className="size-4 shrink-0" />
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}

function EditableCustomTextSection({
  editable,
  newsletter,
  onChange,
  section,
  textStyleProps,
}: Omit<NewsletterContentSectionProps, "isMobile" | "type">) {
  const customSection = newsletter.customSections?.find(
    (item) => item.id === section.id && item.type === "custom-text"
  )

  if (!customSection || customSection.type !== "custom-text") {
    return null
  }

  return (
    <section className="grid grid-cols-[5px_minmax(0,1fr)] gap-5">
      <div className="bg-[#244F49]" />
      <div className="min-w-0 pb-1">
        <InlineText
          ariaLabel="Título da seção de texto"
          className="max-w-2xl text-[32px] font-semibold leading-tight tracking-[-0.02em] text-[#1F1F1A]"
          editable={editable}
          placeholder="Novo título"
          renderAs="h2"
          value={customSection.title}
          onChange={(value) =>
            onChange((draft) => {
              const item = findCustomSection(draft, section.id, "custom-text")
              if (item) {
                item.title = value
              }
            })
          }
          {...textStyleProps(`customSections.${section.id}.title`)}
        />
        <InlineRichText
          ariaLabel="Texto da seção"
          className="mt-5 text-[16px] leading-8 text-[#404038]"
          editable={editable}
          placeholder="Escreva aqui o novo conteúdo do informativo."
          segments={customSection.body}
          onChange={(segments) =>
            onChange((draft) => {
              const item = findCustomSection(draft, section.id, "custom-text")
              if (item) {
                item.body = segments
              }
            })
          }
          {...textStyleProps(`customSections.${section.id}.body`)}
        />
      </div>
    </section>
  )
}

function EditableCustomImageSection({
  editable,
  newsletter,
  onChange,
  section,
  textStyleProps,
}: Omit<NewsletterContentSectionProps, "isMobile" | "type">) {
  const customSection = newsletter.customSections?.find(
    (item) => item.id === section.id && item.type === "custom-image"
  )

  if (!customSection || customSection.type !== "custom-image") {
    return null
  }

  return (
    <section className="border border-[#B7B783]/80 bg-white p-4">
      <div className="group/custom-image relative flex aspect-[16/9] min-h-56 items-center justify-center overflow-hidden bg-[#ECE8D8]">
        {customSection.imageUrl ? (
          <div
            aria-label={customSection.imageAlt ?? "Imagem do informativo"}
            className="h-full w-full bg-cover bg-center"
            role="img"
            style={{ backgroundImage: `url(${customSection.imageUrl})` }}
          />
        ) : (
          <div className="grid gap-4 text-center text-[#244F49]">
            <ImageSymbol className="mx-auto size-10" />
            <div>
              <p className="text-sm font-semibold">
                Adicione uma imagem nesta seção
              </p>
              {editable && (
                <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#244F49] px-4 py-2 text-xs font-semibold text-[#F7F5EE] shadow-sm transition-colors hover:bg-[#163B35]">
                  <ImageIcon className="size-4" />
                  Selecionar imagem
                  <input
                    accept="image/*"
                    className="sr-only"
                    type="file"
                    onChange={(event) =>
                      updateCustomImageFromFile(event, onChange, section.id)
                    }
                  />
                </label>
              )}
            </div>
          </div>
        )}

        {editable && customSection.imageUrl && (
          <label className="absolute inset-0 grid cursor-pointer place-items-center bg-[#163B35]/0 text-sm font-semibold text-[#F7F5EE] opacity-0 transition-opacity group-hover/custom-image:bg-[#163B35]/70 group-hover/custom-image:opacity-100">
            <span className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-black">
              <ImageIcon className="size-4" />
              Trocar imagem
            </span>
            <input
              accept="image/*"
              className="sr-only"
              type="file"
              onChange={(event) =>
                updateCustomImageFromFile(event, onChange, section.id)
              }
            />
          </label>
        )}
      </div>
      <InlineText
        ariaLabel="Legenda da imagem"
        className="mt-3 text-xs leading-6 text-[#404038]"
        editable={editable}
        placeholder="Legenda opcional da imagem."
        renderAs="p"
        value={customSection.caption}
        onChange={(value) =>
          onChange((draft) => {
            const item = findCustomSection(draft, section.id, "custom-image")
            if (item) {
              item.caption = value
            }
          })
        }
        {...textStyleProps(`customSections.${section.id}.caption`)}
      />
    </section>
  )
}

function updateCustomImageFromFile(
  event: ChangeEvent<HTMLInputElement>,
  onChange: (updater: (draft: NewsletterTemplate) => void) => void,
  sectionId: string
) {
  const file = event.target.files?.[0]

  if (!file) {
    return
  }

  const url = URL.createObjectURL(file)

  onChange((draft) => {
    const item = findCustomSection(draft, sectionId, "custom-image")
    if (item) {
      item.imageAlt = file.name
      item.imageUrl = url
    }
  })
  event.target.value = ""
}

function EditableCustomMediaTextSection({
  editable,
  isMobile,
  newsletter,
  onChange,
  section,
  textStyleProps,
}: Omit<NewsletterContentSectionProps, "type">) {
  const customSection = newsletter.customSections?.find(
    (item) => item.id === section.id && item.type === "custom-media-text"
  )

  if (!customSection || customSection.type !== "custom-media-text") {
    return null
  }

  const isImageTop = isMobile || customSection.layout === "image-top"
  const imageFirst = customSection.layout !== "image-right"

  const imageBlock = (
    <div className="group/custom-media relative flex aspect-[4/3] min-h-56 items-center justify-center overflow-hidden bg-[#ECE8D8]">
      {customSection.imageUrl ? (
        <div
          aria-label={customSection.imageAlt ?? "Imagem do informativo"}
          className="h-full w-full bg-cover bg-center"
          role="img"
          style={{ backgroundImage: `url(${customSection.imageUrl})` }}
        />
      ) : (
        <div className="grid gap-4 text-center text-[#244F49]">
          <ImageSymbol className="mx-auto size-10" />
          <p className="text-sm font-semibold">Imagem da seção</p>
        </div>
      )}

      {editable && (
        <label className="absolute inset-0 grid cursor-pointer place-items-center bg-[#163B35]/0 text-sm font-semibold text-[#F7F5EE] opacity-0 transition-opacity group-hover/custom-media:bg-[#163B35]/70 group-hover/custom-media:opacity-100">
          <span className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-black">
            <ImageIcon className="size-4" />
            {customSection.imageUrl ? "Trocar imagem" : "Selecionar imagem"}
          </span>
          <input
            accept="image/*"
            className="sr-only"
            type="file"
            onChange={(event) =>
              updateCustomMediaTextImageFromFile(event, onChange, section.id)
            }
          />
        </label>
      )}
    </div>
  )

  const textBlock = (
    <div className="min-w-0">
      {editable && (
        <div className="mb-3 flex flex-wrap gap-2">
          {(["image-left", "image-right", "image-top"] as const).map(
            (layout) => (
              <BlockActionButton
                key={layout}
                icon={<ImageSymbol className="size-3.5" />}
                label={
                  layout === "image-left"
                    ? "Imagem esquerda"
                    : layout === "image-right"
                      ? "Imagem direita"
                      : "Imagem acima"
                }
                onClick={() =>
                  onChange((draft) => {
                    const item = findCustomSection(
                      draft,
                      section.id,
                      "custom-media-text"
                    )
                    if (item) {
                      item.layout = layout
                    }
                  })
                }
              />
            )
          )}
        </div>
      )}
      <InlineText
        ariaLabel="Título da seção com imagem e texto"
        className="text-[28px] font-semibold leading-tight tracking-[-0.02em] text-[#1F1F1A]"
        editable={editable}
        placeholder="Título da seção"
        renderAs="h2"
        value={customSection.title}
        onChange={(value) =>
          onChange((draft) => {
            const item = findCustomSection(
              draft,
              section.id,
              "custom-media-text"
            )
            if (item) {
              item.title = value
            }
          })
        }
        {...textStyleProps(`customSections.${section.id}.title`)}
      />
      <InlineRichText
        ariaLabel="Texto da seção com imagem"
        className="mt-4 text-[16px] leading-8 text-[#404038]"
        editable={editable}
        placeholder="Escreva o texto de apoio para esta imagem."
        segments={customSection.body}
        onChange={(segments) =>
          onChange((draft) => {
            const item = findCustomSection(
              draft,
              section.id,
              "custom-media-text"
            )
            if (item) {
              item.body = segments
            }
          })
        }
        {...textStyleProps(`customSections.${section.id}.body`)}
      />
    </div>
  )

  return (
    <section className="border border-[#B7B783]/80 bg-white p-5">
      <div
        className={cn(
          "grid gap-6",
          isImageTop ? "grid-cols-1" : "grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)]"
        )}
      >
        {imageFirst ? (
          <>
            {imageBlock}
            {textBlock}
          </>
        ) : (
          <>
            {textBlock}
            {imageBlock}
          </>
        )}
      </div>
    </section>
  )
}

function updateCustomMediaTextImageFromFile(
  event: ChangeEvent<HTMLInputElement>,
  onChange: (updater: (draft: NewsletterTemplate) => void) => void,
  sectionId: string
) {
  const file = event.target.files?.[0]

  if (!file) {
    return
  }

  const url = URL.createObjectURL(file)

  onChange((draft) => {
    const item = findCustomSection(draft, sectionId, "custom-media-text")
    if (item) {
      item.imageAlt = file.name
      item.imageUrl = url
    }
  })
  event.target.value = ""
}

function EditableCustomButtonSection({
  editable,
  isMobile,
  newsletter,
  onChange,
  section,
  textStyleProps,
}: Omit<NewsletterContentSectionProps, "type">) {
  const customSection = newsletter.customSections?.find(
    (item) => item.id === section.id && item.type === "custom-button"
  )

  if (!customSection || customSection.type !== "custom-button") {
    return null
  }

  const label = customSection.label.trim() || "Abrir link"
  const href = customSection.href.trim() || "#"

  return (
    <section
      className={cn(
        "border border-[#B7B783] bg-white",
        isMobile ? "p-5" : "p-6 sm:p-7"
      )}
    >
      <div className={cn("grid gap-5", !isMobile && "sm:grid-cols-[1fr_auto] sm:items-center")}>
        <div className="min-w-0">
          <InlineText
            ariaLabel="Título da seção com botão"
            className="text-2xl font-semibold leading-tight text-[#163B35]"
            editable={editable}
            placeholder="Título da chamada"
            renderAs="h2"
            value={customSection.title}
            onChange={(value) =>
              onChange((draft) => {
                const item = findCustomSection(
                  draft,
                  section.id,
                  "custom-button"
                )
                if (item) {
                  item.title = value
                }
              })
            }
            {...textStyleProps(`customSections.${section.id}.title`)}
          />
          <InlineText
            ariaLabel="Descrição da seção com botão"
            className="mt-3 max-w-2xl text-sm leading-6 text-[#404038]"
            editable={editable}
            placeholder="Explique o próximo passo em uma frase curta."
            renderAs="p"
            value={customSection.description}
            onChange={(value) =>
              onChange((draft) => {
                const item = findCustomSection(
                  draft,
                  section.id,
                  "custom-button"
                )
                if (item) {
                  item.description = value
                }
              })
            }
            {...textStyleProps(`customSections.${section.id}.description`)}
          />
        </div>

        <div className="min-w-0">
          {editable ? (
            <LinkLabelPopoverButton
              className="bg-[#244F49] text-[#F7F5EE] hover:bg-[#163B35]"
              href={customSection.href}
              label={label}
              labelPlaceholder="Abrir link"
              onChange={({ href, label }) =>
                onChange((draft) => {
                  const item = findCustomSection(
                    draft,
                    section.id,
                    "custom-button"
                  )
                  if (item) {
                    item.href = href
                    item.label = label
                  }
                })
              }
            />
          ) : (
            <Link
              className="inline-flex w-fit max-w-full items-center gap-2 rounded-sm bg-[#244F49] px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#F7F5EE] transition-colors hover:bg-[#163B35]"
              href={href}
            >
              <span className="[overflow-wrap:anywhere]">{label}</span>
              <ArrowRight className="size-4 shrink-0" />
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}

type EditableSidebarProps = {
  editable: boolean
  isMobile: boolean
  newsletter: NewsletterTemplate
  onAttorneyPhotoChange: (event: ChangeEvent<HTMLInputElement>) => void
  onChange: (updater: (draft: NewsletterTemplate) => void) => void
  onRemoveAttorneyPhoto: () => void
  textStyleProps: (fieldId: string) => {
    onTextStyleChange: (style: NewsletterTextStyle) => void
    textStyle: NewsletterTextStyle | undefined
  }
}

function EditableSidebar({
  editable,
  isMobile,
  newsletter,
  onAttorneyPhotoChange,
  onChange,
  onRemoveAttorneyPhoto,
  textStyleProps,
}: EditableSidebarProps) {
  const sidebarBlocks = newsletter.sidebarBlocks ?? createDefaultSidebarBlocks()
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  function deleteSidebarBlock(blockId: string) {
    onChange((draft) => {
      draft.sidebarBlocks = (draft.sidebarBlocks ?? sidebarBlocks).filter(
        (block) => block.id !== blockId
      )
    })
  }

  function addSidebarBlock(type: NewsletterSidebarBlock["type"]) {
    const block = createSidebarBlock(type)

    onChange((draft) => {
      draft.sidebarBlocks = [...(draft.sidebarBlocks ?? sidebarBlocks), block]
    })
  }

  function moveSidebarBlock(blockId: string, direction: -1 | 1) {
    const currentIndex = sidebarBlocks.findIndex((block) => block.id === blockId)
    const nextIndex = currentIndex + direction

    if (
      currentIndex < 0 ||
      nextIndex < 0 ||
      nextIndex >= sidebarBlocks.length
    ) {
      return
    }

    onChange((draft) => {
      draft.sidebarBlocks = arrayMove(sidebarBlocks, currentIndex, nextIndex)
    })
  }

  function handleSidebarDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    const activeIndex = sidebarBlocks.findIndex(
      (block) => block.id === active.id
    )
    const overIndex = sidebarBlocks.findIndex((block) => block.id === over.id)

    if (activeIndex < 0 || overIndex < 0) {
      return
    }

    onChange((draft) => {
      draft.sidebarBlocks = arrayMove(sidebarBlocks, activeIndex, overIndex)
    })
  }

  return (
    <aside
      className={cn(
        "space-y-6",
        !isMobile && "lg:border-l lg:border-[#B7B783]/60 lg:pl-8"
      )}
    >
      {editable ? (
        <DndContext
          collisionDetection={closestCenter}
          id="newsletter-sidebar-block-sorter"
          sensors={sensors}
          onDragEnd={handleSidebarDragEnd}
        >
          <SortableContext
            items={sidebarBlocks.map((block) => block.id)}
            strategy={verticalListSortingStrategy}
          >
            {sidebarBlocks.map((block, index) => (
              <SortableEditableSidebarBlock
                key={block.id}
                block={block}
                index={index}
                newsletter={newsletter}
                total={sidebarBlocks.length}
                onAttorneyPhotoChange={onAttorneyPhotoChange}
                onChange={onChange}
                onDelete={() => deleteSidebarBlock(block.id)}
                onMove={moveSidebarBlock}
                onRemoveAttorneyPhoto={onRemoveAttorneyPhoto}
                textStyleProps={textStyleProps}
              />
            ))}
          </SortableContext>
        </DndContext>
      ) : (
        sidebarBlocks.map((block) => (
          <EditableSidebarBlock
            key={block.id}
            block={block}
            editable={editable}
            newsletter={newsletter}
            onAttorneyPhotoChange={onAttorneyPhotoChange}
            onChange={onChange}
            onDelete={() => deleteSidebarBlock(block.id)}
            onRemoveAttorneyPhoto={onRemoveAttorneyPhoto}
            textStyleProps={textStyleProps}
          />
        ))
      )}

      {editable && <AddSidebarBlockBar onAdd={addSidebarBlock} />}
    </aside>
  )
}

type EditableSidebarBlockProps = {
  block: NewsletterSidebarBlock
  editable: boolean
  newsletter: NewsletterTemplate
  onAttorneyPhotoChange: (event: ChangeEvent<HTMLInputElement>) => void
  onChange: (updater: (draft: NewsletterTemplate) => void) => void
  onDelete: () => void
  onRemoveAttorneyPhoto: () => void
  textStyleProps: (fieldId: string) => {
    onTextStyleChange: (style: NewsletterTextStyle) => void
    textStyle: NewsletterTextStyle | undefined
  }
}

function EditableSidebarBlock({
  block,
  editable,
  newsletter,
  onAttorneyPhotoChange,
  onChange,
  onDelete,
  onRemoveAttorneyPhoto,
  textStyleProps,
}: EditableSidebarBlockProps) {
  return (
    <div className="group/sidebar-block relative">
      {editable && (
        <button
          className="absolute right-3 top-3 z-30 grid size-8 place-items-center rounded-lg border border-black/10 bg-white/95 text-black/55 opacity-0 shadow-[0_10px_26px_rgba(0,0,0,0.12)] transition-colors transition-opacity hover:bg-black hover:text-white group-hover/sidebar-block:opacity-100 group-focus-within/sidebar-block:opacity-100"
          onClick={onDelete}
          title="Excluir bloco lateral"
          type="button"
        >
          <Trash2 className="size-4" />
          <span className="sr-only">Excluir bloco lateral</span>
        </button>
      )}

      <EditableSidebarBlockContent
        block={block}
        editable={editable}
        newsletter={newsletter}
        onAttorneyPhotoChange={onAttorneyPhotoChange}
        onChange={onChange}
        onRemoveAttorneyPhoto={onRemoveAttorneyPhoto}
        textStyleProps={textStyleProps}
      />
    </div>
  )
}

type SortableEditableSidebarBlockProps = Omit<
  EditableSidebarBlockProps,
  "editable"
> & {
  index: number
  onMove: (blockId: string, direction: -1 | 1) => void
  total: number
}

function SortableEditableSidebarBlock({
  block,
  index,
  newsletter,
  onAttorneyPhotoChange,
  onChange,
  onDelete,
  onMove,
  onRemoveAttorneyPhoto,
  textStyleProps,
  total,
}: SortableEditableSidebarBlockProps) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: block.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "group/sidebar-block relative min-w-0",
        "rounded-sm outline outline-1 outline-transparent transition-[outline-color,box-shadow] focus-within:outline-[#B7B783]/80 hover:outline-[#B7B783]/80",
        isDragging && "z-30 opacity-85 shadow-[0_22px_60px_rgba(22,59,53,0.2)]"
      )}
      style={style}
    >
      <div className="absolute right-3 top-3 z-30 flex items-center overflow-hidden rounded-lg border border-black/10 bg-white/95 text-black opacity-0 shadow-[0_10px_26px_rgba(0,0,0,0.12)] transition-opacity group-hover/sidebar-block:opacity-100 group-focus-within/sidebar-block:opacity-100">
        <button
          className="cursor-grab px-2 py-1.5 text-black/60 hover:bg-black/5 active:cursor-grabbing"
          title="Arrastar bloco lateral"
          type="button"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
          <span className="sr-only">Arrastar bloco lateral</span>
        </button>
        <button
          className="border-l border-black/10 px-2 py-1.5 text-black/60 hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-35"
          disabled={index === 0}
          onClick={() => onMove(block.id, -1)}
          title="Mover bloco lateral para cima"
          type="button"
        >
          <ArrowUp className="size-4" />
          <span className="sr-only">Mover bloco lateral para cima</span>
        </button>
        <button
          className="border-l border-black/10 px-2 py-1.5 text-black/60 hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-35"
          disabled={index === total - 1}
          onClick={() => onMove(block.id, 1)}
          title="Mover bloco lateral para baixo"
          type="button"
        >
          <ArrowDown className="size-4" />
          <span className="sr-only">Mover bloco lateral para baixo</span>
        </button>
        <button
          className="border-l border-black/10 px-2 py-1.5 text-black/60 hover:bg-black/5"
          onClick={onDelete}
          title="Excluir bloco lateral"
          type="button"
        >
          <Trash2 className="size-4" />
          <span className="sr-only">Excluir bloco lateral</span>
        </button>
      </div>

      <EditableSidebarBlockContent
        block={block}
        editable
        newsletter={newsletter}
        onAttorneyPhotoChange={onAttorneyPhotoChange}
        onChange={onChange}
        onRemoveAttorneyPhoto={onRemoveAttorneyPhoto}
        textStyleProps={textStyleProps}
      />
    </div>
  )
}

function EditableSidebarBlockContent({
  block,
  editable,
  newsletter,
  onAttorneyPhotoChange,
  onChange,
  onRemoveAttorneyPhoto,
  textStyleProps,
}: Omit<EditableSidebarBlockProps, "onDelete">) {
  if (block.type === "summary") {
    return (
      <section className="border border-[#B7B783] bg-white p-6 shadow-[inset_0_4px_0_#244F49]">
        <InlineText
          ariaLabel="Síntese lateral do informativo"
          className="text-[16px] leading-8 text-[#303029]"
          editable={editable}
          placeholder="Síntese objetiva do informativo."
          renderAs="p"
          value={block.text}
          onChange={(value) =>
            onChange((draft) => {
              draft.sidebarBlocks =
                draft.sidebarBlocks ?? createDefaultSidebarBlocks()
              const item = findSidebarBlock(draft, block.id, "summary")
              if (item) {
                item.text = value
              }
            })
          }
          {...textStyleProps(`sidebarBlocks.${block.id}.text`)}
        />
      </section>
    )
  }

  if (block.type === "metadata") {
    return (
      <section className="border border-[#B7B783]/80 bg-[#ECE8D8] p-6">
        <dl className="grid gap-3 text-sm">
          <EditableMetaRow
            editable={editable}
            label="Coleção"
            placeholder="Coleção"
            value={newsletter.header.collection}
            onChange={(value) =>
              onChange((draft) => {
                draft.header.collection = value
              })
            }
          />
          <EditableMetaRow
            editable={editable}
            label="Período"
            placeholder="Período"
            value={newsletter.header.period}
            onChange={(value) =>
              onChange((draft) => {
                draft.header.period = value
              })
            }
          />
          <EditableMetaRow
            editable={editable}
            label="Tema"
            placeholder="Tema jurídico"
            value={newsletter.category}
            onChange={(value) =>
              onChange((draft) => {
                draft.category = value
              })
            }
          />
        </dl>
      </section>
    )
  }

  if (block.type === "attorney") {
    return (
      <EditableAttorneyCard
        editable={editable}
        newsletter={newsletter}
        onAttorneyPhotoChange={onAttorneyPhotoChange}
        onChange={onChange}
        onRemoveAttorneyPhoto={onRemoveAttorneyPhoto}
        textStyleProps={textStyleProps}
      />
    )
  }

  if (block.type === "source") {
    return (
      <section className="border border-[#B7B783]/80 bg-white p-6">
        <InlineText
          ariaLabel="Fonte ou referência jurídica"
          className="text-xs leading-6 text-[#404038]"
          editable={editable}
          placeholder="Referência jurídica do informativo em edição."
          renderAs="p"
          value={newsletter.sourceDescription}
          onChange={(value) =>
            onChange((draft) => {
              draft.sourceDescription = value
            })
          }
          {...textStyleProps("sourceDescription")}
        />
      </section>
    )
  }

  if (block.type === "sidebar-image") {
    return (
      <section className="border border-[#B7B783]/80 bg-white p-4">
        <SidebarImagePicker
          blockId={block.id}
          editable={editable}
          imageAlt={block.imageAlt}
          imageUrl={block.imageUrl}
          onChange={onChange}
          type="sidebar-image"
        />
        <InlineText
          ariaLabel="Legenda da imagem lateral"
          className="mt-3 text-xs leading-6 text-[#404038]"
          editable={editable}
          placeholder="Legenda da imagem."
          renderAs="p"
          value={block.caption}
          onChange={(value) =>
            onChange((draft) => {
              const item = findSidebarBlock(draft, block.id, "sidebar-image")
              if (item) {
                item.caption = value
              }
            })
          }
          {...textStyleProps(`sidebarBlocks.${block.id}.caption`)}
        />
      </section>
    )
  }

  if (block.type === "sidebar-media-text") {
    return (
      <section className="border border-[#B7B783]/80 bg-white p-4">
        <SidebarImagePicker
          blockId={block.id}
          editable={editable}
          imageAlt={block.imageAlt}
          imageUrl={block.imageUrl}
          onChange={onChange}
          type="sidebar-media-text"
        />
        <InlineText
          ariaLabel="Título do bloco lateral com imagem"
          className="mt-4 text-xl font-semibold leading-tight text-[#1F1F1A]"
          editable={editable}
          placeholder="Título do bloco"
          renderAs="h3"
          value={block.title}
          onChange={(value) =>
            onChange((draft) => {
              const item = findSidebarBlock(
                draft,
                block.id,
                "sidebar-media-text"
              )
              if (item) {
                item.title = value
              }
            })
          }
          {...textStyleProps(`sidebarBlocks.${block.id}.title`)}
        />
        <InlineRichText
          ariaLabel="Texto do bloco lateral com imagem"
          className="mt-3 text-sm leading-7 text-[#404038]"
          editable={editable}
          placeholder="Escreva o texto de apoio."
          segments={block.body}
          onChange={(segments) =>
            onChange((draft) => {
              const item = findSidebarBlock(
                draft,
                block.id,
                "sidebar-media-text"
              )
              if (item) {
                item.body = segments
              }
            })
          }
          {...textStyleProps(`sidebarBlocks.${block.id}.body`)}
        />
      </section>
    )
  }

  return (
    <section className="border border-[#B7B783]/80 bg-white p-6">
      <InlineText
        ariaLabel="Título do bloco lateral"
        className="text-xl font-semibold leading-tight text-[#1F1F1A]"
        editable={editable}
        placeholder="Título do bloco"
        renderAs="h3"
        value={block.title}
        onChange={(value) =>
          onChange((draft) => {
            const item = findSidebarBlock(draft, block.id, "sidebar-text")
            if (item) {
              item.title = value
            }
          })
        }
        {...textStyleProps(`sidebarBlocks.${block.id}.title`)}
      />
      <InlineRichText
        ariaLabel="Texto do bloco lateral"
        className="mt-3 text-sm leading-7 text-[#404038]"
        editable={editable}
        placeholder="Escreva o conteúdo lateral."
        segments={block.body}
        onChange={(segments) =>
          onChange((draft) => {
            const item = findSidebarBlock(draft, block.id, "sidebar-text")
            if (item) {
              item.body = segments
            }
          })
        }
        {...textStyleProps(`sidebarBlocks.${block.id}.body`)}
      />
    </section>
  )
}

type SidebarImagePickerProps = {
  blockId: string
  editable: boolean
  imageAlt?: string
  imageUrl?: string
  onChange: (updater: (draft: NewsletterTemplate) => void) => void
  type: "sidebar-image" | "sidebar-media-text"
}

function SidebarImagePicker({
  blockId,
  editable,
  imageAlt,
  imageUrl,
  onChange,
  type,
}: SidebarImagePickerProps) {
  return (
    <div className="group/sidebar-image relative flex aspect-[4/3] min-h-48 items-center justify-center overflow-hidden bg-[#ECE8D8]">
      {imageUrl ? (
        <div
          aria-label={imageAlt ?? "Imagem lateral"}
          className="h-full w-full bg-cover bg-center"
          role="img"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      ) : (
        <div className="grid gap-3 text-center text-[#244F49]">
          <ImageSymbol className="mx-auto size-9" />
          <p className="text-sm font-semibold">Imagem lateral</p>
        </div>
      )}

      {editable && (
        <label className="absolute inset-0 grid cursor-pointer place-items-center bg-[#163B35]/0 text-sm font-semibold text-[#F7F5EE] opacity-0 transition-opacity group-hover/sidebar-image:bg-[#163B35]/70 group-hover/sidebar-image:opacity-100">
          <span className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-black">
            <ImageIcon className="size-4" />
            {imageUrl ? "Trocar imagem" : "Selecionar imagem"}
          </span>
          <input
            accept="image/*"
            className="sr-only"
            type="file"
            onChange={(event) =>
              updateSidebarImageFromFile(event, onChange, blockId, type)
            }
          />
        </label>
      )}
    </div>
  )
}

function AddSidebarBlockBar({
  onAdd,
}: {
  onAdd: (type: NewsletterSidebarBlock["type"]) => void
}) {
  return (
    <div className="grid gap-2 rounded-xl border border-dashed border-black/20 bg-transparent p-4 text-black">
      <span className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-black/45">
        <Plus className="size-3.5" />
        Novo bloco lateral
      </span>
      <div className="flex flex-wrap justify-center gap-2">
        <AddSectionButton
          icon={<FileText className="size-4" />}
          label="Texto"
          onClick={() => onAdd("sidebar-text")}
        />
        <AddSectionButton
          icon={<ImageSymbol className="size-4" />}
          label="Imagem"
          onClick={() => onAdd("sidebar-image")}
        />
        <AddSectionButton
          icon={<ImageIcon className="size-4" />}
          label="Imagem + texto"
          onClick={() => onAdd("sidebar-media-text")}
        />
      </div>
    </div>
  )
}

type EditableMetaRowProps = {
  editable: boolean
  label: string
  onChange: (value: string) => void
  placeholder: string
  value: string
}

function EditableMetaRow({
  editable,
  label,
  onChange,
  placeholder,
  value,
}: EditableMetaRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#B7B783]/70 pb-3 last:border-b-0 last:pb-0">
      <dt className="font-semibold uppercase tracking-[0.14em] text-[#6D714C]">
        {label}
      </dt>
      <dd className="min-w-0 text-right font-semibold text-[#1F1F1A] [overflow-wrap:anywhere]">
        <InlineText
          ariaLabel={label}
          editable={editable}
          multiline={false}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </dd>
    </div>
  )
}

function EditableAttorneyCard({
  editable,
  newsletter,
  onAttorneyPhotoChange,
  onChange,
  onRemoveAttorneyPhoto,
  textStyleProps,
}: Omit<EditableSidebarProps, "isMobile">) {
  const attorney = newsletter.attorney
  const name = attorney.name
  const specialty = attorney.specialty
  const phrase = attorney.phrase
  const initials = attorney.initials.trim() || "JJ"

  return (
    <aside className="h-fit border border-[#B7B783] bg-white shadow-[0_14px_35px_rgba(22,59,53,0.08)]">
      <div className="flex aspect-[16/11] items-center justify-center bg-[#E8E4D4] p-4">
        <div className="group/photo relative flex h-full w-full items-center justify-center overflow-hidden border border-[#B7B783] bg-[#F7F5EE]/70">
          {attorney.photoUrl ? (
            <div
              aria-label={attorney.photoAlt ?? name}
              className="h-full w-full bg-cover bg-center"
              role="img"
              style={{ backgroundImage: `url(${attorney.photoUrl})` }}
            />
          ) : (
            <div className="grid size-24 place-items-center rounded-full border border-[#B7B783] bg-[#F7F5EE] text-3xl font-semibold text-[#244F49] shadow-[0_0_0_9px_rgba(183,183,131,0.18)]">
              {initials}
            </div>
          )}

          {editable && (
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-[#163B35]/0 opacity-0 transition-opacity group-hover/photo:bg-[#163B35]/70 group-hover/photo:opacity-100 group-focus-within/photo:bg-[#163B35]/70 group-focus-within/photo:opacity-100">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-sm bg-[#F7F5EE] px-3 py-2 text-xs font-semibold text-[#163B35] shadow-sm">
                <ImageIcon className="size-4" />
                Trocar foto
                <input
                  accept="image/*"
                  className="sr-only"
                  onChange={onAttorneyPhotoChange}
                  type="file"
                />
              </label>
              {attorney.photoUrl && (
                <button
                  className="inline-flex items-center gap-2 rounded-sm bg-[#F7F5EE] px-3 py-2 text-xs font-semibold text-[#163B35] shadow-sm"
                  onClick={onRemoveAttorneyPhoto}
                  type="button"
                >
                  <ImageOff className="size-4" />
                  Remover
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="px-5 py-5">
        <InlineText
          ariaLabel="Nome do advogado"
          className="text-2xl font-semibold leading-tight tracking-[-0.02em] text-[#1F1F1A]"
          editable={editable}
          multiline={false}
          placeholder="Nome do advogado"
          renderAs="h2"
          value={name}
          onChange={(value) =>
            onChange((draft) => {
              draft.attorney.name = value
              draft.attorney.initials = initialsFromName(value)
            })
          }
          {...textStyleProps("attorney.name")}
        />
        <InlineText
          ariaLabel="Especialidade do advogado"
          className="mt-2 text-sm font-semibold uppercase tracking-[0.12em] text-[#244F49]"
          editable={editable}
          placeholder="Área de atuação"
          renderAs="p"
          value={specialty}
          onChange={(value) =>
            onChange((draft) => {
              draft.attorney.specialty = value
            })
          }
          {...textStyleProps("attorney.specialty")}
        />
        <div className="mt-5 border-t border-[#B7B783] pt-4">
          <Quote className="size-5 text-[#B7B783]" />
          <InlineText
            ariaLabel="Frase do advogado"
            className="mt-3 text-[17px] font-medium leading-7 text-[#163B35]"
            editable={editable}
            placeholder="Frase profissional para contextualizar o atendimento."
            renderAs="p"
            value={phrase}
            onChange={(value) =>
              onChange((draft) => {
                draft.attorney.phrase = value
              })
            }
            {...textStyleProps("attorney.phrase")}
          />
        </div>
      </div>
    </aside>
  )
}

type EditableFooterProps = {
  editable: boolean
  isMobile: boolean
  newsletter: NewsletterTemplate
  onChange: (updater: (draft: NewsletterTemplate) => void) => void
  textStyleProps: (fieldId: string) => {
    onTextStyleChange: (style: NewsletterTextStyle) => void
    textStyle: NewsletterTextStyle | undefined
  }
}

function EditableNewsletterFooter({
  editable,
  isMobile,
  newsletter,
  onChange,
  textStyleProps,
}: EditableFooterProps) {
  return (
    <footer
      className={cn(
        "border-t border-[#B7B783] bg-[#ECE8D8]",
        isMobile ? "px-4 py-6" : "px-5 py-6 sm:px-7 lg:px-8"
      )}
    >
      <div
        className={cn(
          "mx-auto grid w-full gap-5",
          isMobile
            ? "max-w-[430px]"
            : "max-w-[1280px] lg:grid-cols-[180px_1fr] lg:items-start"
        )}
      >
        <div className="min-w-0">
          <InlineText
            ariaLabel="Nome do escritório no rodapé"
            className="text-lg font-semibold leading-tight text-[#1F1F1A]"
            editable={editable}
            multiline
            placeholder="Nome do escritório"
            renderAs="p"
            value={newsletter.firm.name}
            onChange={(value) =>
              onChange((draft) => {
                draft.firm.name = value
              })
            }
            {...textStyleProps("firm.name.footer")}
          />
          <InlineText
            ariaLabel="Descrição do escritório no rodapé"
            className="mt-1 text-[10px] font-semibold uppercase leading-5 tracking-[0.18em] text-[#244F49]"
            editable={editable}
            multiline
            placeholder="Advogados Associados"
            renderAs="p"
            value={newsletter.firm.descriptor}
            onChange={(value) =>
              onChange((draft) => {
                draft.firm.descriptor = value
              })
            }
            {...textStyleProps("firm.descriptor.footer")}
          />
        </div>

        <div className="grid gap-3">
          <div
            className={cn(
              "flex flex-wrap gap-x-5 gap-y-2",
              !isMobile && "lg:justify-end"
            )}
          >
            {newsletter.contacts.map((contact, index) => (
              <EditableFooterLink
                key={`${contact.label}-${index}`}
                contact={contact}
                editable={editable}
                icon={
                  contactIcons[contact.label as keyof typeof contactIcons] ??
                  Globe
                }
                onChange={(value) =>
                  onChange((draft) => {
                    ensureContact(draft.contacts, index, contact.label)
                    draft.contacts[index].value = value
                    draft.contacts[index].href = hrefForContact(
                      draft.contacts[index].label,
                      value
                    )
                  })
                }
                onHrefChange={(href) =>
                  onChange((draft) => {
                    ensureContact(draft.contacts, index, contact.label)
                    draft.contacts[index].href = href
                  })
                }
                textStyleProps={textStyleProps(`contacts.${index}.value`)}
              />
            ))}
          </div>

          <InlineText
            ariaLabel="Endereço"
            className={cn(
              "text-xs font-medium text-[#4F5549]",
              !isMobile && "lg:text-right"
            )}
            editable={editable}
            placeholder="Endereço institucional"
            renderAs="p"
            value={newsletter.address}
            onChange={(value) =>
              onChange((draft) => {
                draft.address = value
              })
            }
            {...textStyleProps("address")}
          />

          <div
            className={cn(
              "flex flex-wrap gap-x-5 gap-y-2",
              !isMobile && "lg:justify-end"
            )}
          >
            {newsletter.socialLinks.map((contact, index) => (
              <EditableFooterLink
                key={`${contact.label}-${index}`}
                contact={contact}
                editable={editable}
                icon={
                  socialIcons[contact.label as keyof typeof socialIcons] ??
                  Link2
                }
                onChange={(value) =>
                  onChange((draft) => {
                    ensureContact(draft.socialLinks, index, contact.label)
                    draft.socialLinks[index].value = value
                  })
                }
                onHrefChange={(href) =>
                  onChange((draft) => {
                    ensureContact(draft.socialLinks, index, contact.label)
                    draft.socialLinks[index].href = href
                  })
                }
                textStyleProps={textStyleProps(`socialLinks.${index}.value`)}
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

type EditableFooterLinkProps = {
  contact: NewsletterContact
  editable: boolean
  icon: typeof Phone
  onChange: (value: string) => void
  onHrefChange?: (href: string) => void
  textStyleProps?: {
    onTextStyleChange: (style: NewsletterTextStyle) => void
    textStyle: NewsletterTextStyle | undefined
  }
}

function EditableFooterLink({
  contact,
  editable,
  icon: Icon,
  onChange,
  onHrefChange,
  textStyleProps,
}: EditableFooterLinkProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [draftHref, setDraftHref] = useState(contact.href)
  const [draftValue, setDraftValue] = useState(contact.value)
  const value = contact.value.trim() || contact.label
  const href = contact.href.trim() || "#"
  const content = (
    <>
      <Icon className="size-4 shrink-0 text-[#244F49]" />
      <InlineText
        ariaLabel={contact.label}
        editable={editable}
        multiline={false}
        placeholder={contact.label}
        value={value}
        onChange={onChange}
        {...textStyleProps}
      />
    </>
  )

  if (editable) {
    function openEditor() {
      setDraftValue(value)
      setDraftHref(contact.href || hrefForContact(contact.label, value))
      setIsOpen((current) => !current)
    }

    function applyChanges() {
      const nextValue = draftValue.trim() || contact.label
      const nextHref =
        draftHref.trim() || hrefForContact(contact.label, nextValue)

      onChange(nextValue)
      onHrefChange?.(nextHref)
      setIsOpen(false)
    }

    return (
      <span className="relative inline-flex max-w-full">
        <button
          className="inline-flex max-w-full items-center gap-2 rounded-sm border border-transparent px-1 py-0.5 text-xs font-semibold text-[#1F1F1A] transition-colors hover:border-[#B7B783]/70 hover:bg-white/45"
          onClick={openEditor}
          type="button"
        >
          <Icon className="size-4 shrink-0 text-[#244F49]" />
          <span className="min-w-0 [overflow-wrap:anywhere]">{value}</span>
        </button>

        {isOpen && (
          <span
            className="absolute right-0 top-8 z-50 grid w-[min(420px,calc(100vw-32px))] gap-2 rounded-xl border border-black/10 bg-white p-3 text-left text-black shadow-[0_18px_48px_rgba(0,0,0,0.16)]"
            onPointerDown={(event) => event.stopPropagation()}
          >
            <label className="grid gap-1 text-xs font-semibold text-black/55">
              Texto exibido
              <input
                className="h-10 rounded-lg border border-black/15 px-3 text-sm text-black outline-none focus:border-black/45"
                placeholder={contact.label}
                value={draftValue}
                onChange={(event) => setDraftValue(event.target.value)}
              />
            </label>
            <label className="grid gap-1 text-xs font-semibold text-black/55">
              Link
              <input
                className="h-10 rounded-lg border border-black/15 px-3 text-sm text-black outline-none focus:border-black/45"
                placeholder="https://..."
                value={draftHref}
                onChange={(event) => setDraftHref(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault()
                    applyChanges()
                  }
                }}
              />
            </label>
            <div className="flex justify-end gap-2">
              <button
                className="h-9 rounded-lg border border-black/10 px-3 text-xs font-semibold text-black hover:bg-black/5"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                Cancelar
              </button>
              <button
                className="h-9 rounded-lg bg-black px-3 text-xs font-semibold text-white hover:bg-black/80"
                onClick={applyChanges}
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

  return (
    <Link
      className="inline-flex max-w-full items-center gap-2 text-xs font-semibold text-[#1F1F1A] transition-colors hover:text-[#244F49]"
      href={href}
    >
      {content}
    </Link>
  )
}

function ensureContact(
  contacts: NewsletterContact[],
  index: number,
  label: string
) {
  while (contacts.length <= index) {
    contacts.push({ href: "#", label, value: "" })
  }
}

function hrefForContact(label: string, value: string) {
  if (label === "Telefone") {
    const digits = value.replace(/\D/g, "")
    return digits ? `tel:+55${digits}` : "tel:"
  }

  if (label === "E-mail") {
    return `mailto:${value.trim()}`
  }

  if (label === "Site") {
    const trimmed = value.trim()
    if (!trimmed) {
      return "https://"
    }
    return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`
  }

  return "#"
}

function initialsFromName(name: string) {
  const initials = name
    .replace(/^(dr\.?|dra\.?)\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")

  return initials || "JJ"
}

function createDefaultSidebarBlocks(): NewsletterSidebarBlock[] {
  return [
    {
      id: "sidebar-summary",
      text: "Entendimento útil para cobrança, negociação e gestão documental de débitos condominiais envolvendo unidades ocupadas pelo poder público.",
      type: "summary",
    },
    { id: "sidebar-metadata", type: "metadata" },
    { id: "sidebar-attorney", type: "attorney" },
    { id: "sidebar-source", type: "source" },
  ]
}

function createSidebarBlock(
  type: NewsletterSidebarBlock["type"]
): NewsletterSidebarBlock {
  const id = createContentId(type)

  if (type === "summary") {
    return {
      id,
      text: "Escreva uma síntese objetiva para a lateral do informativo.",
      type,
    }
  }

  if (type === "metadata") {
    return { id, type }
  }

  if (type === "attorney") {
    return { id, type }
  }

  if (type === "source") {
    return { id, type }
  }

  if (type === "sidebar-image") {
    return {
      caption: "Legenda da imagem lateral.",
      id,
      type,
    }
  }

  if (type === "sidebar-media-text") {
    return {
      body: [{ text: "Escreva o texto de apoio para esta imagem." }],
      id,
      title: "Imagem com texto",
      type,
    }
  }

  return {
    body: [{ text: "Escreva aqui o novo conteúdo lateral." }],
    id,
    title: "Novo bloco lateral",
    type,
  }
}

function updateSidebarImageFromFile(
  event: ChangeEvent<HTMLInputElement>,
  onChange: (updater: (draft: NewsletterTemplate) => void) => void,
  blockId: string,
  type: "sidebar-image" | "sidebar-media-text"
) {
  const file = event.target.files?.[0]

  if (!file) {
    return
  }

  const url = URL.createObjectURL(file)

  onChange((draft) => {
    const item = findSidebarBlock(draft, blockId, type)
    if (item) {
      item.imageAlt = file.name
      item.imageUrl = url
    }
  })
  event.target.value = ""
}

function findSidebarBlock<T extends NewsletterSidebarBlock["type"]>(
  newsletter: NewsletterTemplate,
  id: string,
  type: T
) {
  return newsletter.sidebarBlocks?.find(
    (block): block is Extract<NewsletterSidebarBlock, { type: T }> =>
      block.id === id && block.type === type
  )
}

type LinkLabelPopoverButtonProps = {
  className?: string
  href: string
  label: string
  labelPlaceholder: string
  onChange: (value: { href: string; label: string }) => void
}

function LinkLabelPopoverButton({
  className,
  href,
  label,
  labelPlaceholder,
  onChange,
}: LinkLabelPopoverButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [draftHref, setDraftHref] = useState(href)
  const [draftLabel, setDraftLabel] = useState(label)

  function openEditor() {
    setDraftHref(href)
    setDraftLabel(label)
    setIsOpen((current) => !current)
  }

  function applyChanges() {
    onChange({
      href: draftHref.trim() || "#",
      label: draftLabel.trim() || labelPlaceholder,
    })
    setIsOpen(false)
  }

  return (
    <span className="relative inline-flex max-w-full">
      <button
        className={cn(
          "inline-flex w-fit max-w-full items-center gap-2 rounded-sm px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] transition-colors",
          className
        )}
        onPointerDown={(event) => event.stopPropagation()}
        onClick={openEditor}
        type="button"
      >
        <span className="[overflow-wrap:anywhere]">
          {label || labelPlaceholder}
        </span>
        <ArrowRight className="size-4 shrink-0" />
      </button>

      {isOpen && (
        <span
          className="absolute left-0 top-14 z-50 grid w-[min(420px,calc(100vw-32px))] gap-2 rounded-xl border border-black/10 bg-white p-3 text-black shadow-[0_18px_48px_rgba(0,0,0,0.16)]"
          onPointerDown={(event) => event.stopPropagation()}
        >
          <label className="grid gap-1 text-xs font-semibold text-black/55">
            Texto do botão
            <input
              className="h-10 rounded-lg border border-black/15 px-3 text-sm text-black outline-none focus:border-black/45"
              placeholder={labelPlaceholder}
              value={draftLabel}
              onChange={(event) => setDraftLabel(event.target.value)}
            />
          </label>
          <label className="grid gap-1 text-xs font-semibold text-black/55">
            Link
            <input
              className="h-10 rounded-lg border border-black/15 px-3 text-sm text-black outline-none focus:border-black/45"
              placeholder="https://..."
              value={draftHref}
              onChange={(event) => setDraftHref(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault()
                  applyChanges()
                }
              }}
            />
          </label>
          <div className="flex justify-end gap-2">
            <button
              className="h-9 rounded-lg border border-black/10 px-3 text-xs font-semibold text-black hover:bg-black/5"
              onClick={() => setIsOpen(false)}
              type="button"
            >
              Cancelar
            </button>
            <button
              className="h-9 rounded-lg bg-black px-3 text-xs font-semibold text-white hover:bg-black/80"
              onClick={applyChanges}
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

function createSectionId(type: NewsletterCustomSection["type"]) {
  return createContentId(type)
}

function createContentId(type: string) {
  const randomId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`

  return `${type}-${randomId}`
}

function createCustomSection(
  type: NewsletterCustomSection["type"],
  id: string
): NewsletterCustomSection {
  if (type === "custom-media-text") {
    return {
      body: [{ text: "Escreva o texto de apoio para esta imagem." }],
      id,
      layout: "image-left",
      title: "Imagem com texto",
      type,
    }
  }

  if (type === "custom-image") {
    return {
      caption: "",
      id,
      type,
    }
  }

  if (type === "custom-button") {
    return {
      description: "Use esta chamada para direcionar o leitor para uma ação.",
      href: "https://",
      id,
      label: "Abrir link",
      title: "Nova chamada",
      type,
    }
  }

  return {
    body: [{ text: "Escreva aqui o novo conteúdo do informativo." }],
    id,
    title: "Nova seção",
    type,
  }
}

function findCustomSection<T extends NewsletterCustomSection["type"]>(
  newsletter: NewsletterTemplate,
  id: string,
  type: T
) {
  return newsletter.customSections?.find(
    (section): section is Extract<NewsletterCustomSection, { type: T }> =>
      section.id === id && section.type === type
  )
}

function removeEmptyStyle(style: NewsletterTextStyle) {
  return Object.fromEntries(
    Object.entries(style).filter(([, value]) => value !== undefined)
  ) as NewsletterTextStyle
}
