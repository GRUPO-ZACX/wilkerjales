"use client"

import Link from "next/link"
import type { ChangeEvent, ReactNode } from "react"
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
  Globe,
  GripVertical,
  ImageIcon,
  ImageOff,
  Link2,
  Mail,
  Phone,
  Quote,
  Scale,
} from "lucide-react"

import type {
  NewsletterContact,
  NewsletterSection,
  NewsletterSectionType,
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
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )
  const bannerText =
    newsletter.banner.trim() || "INFORMATIVO CONDOMINIAL · EDIÇÃO EM RASCUNHO"

  function moveSection(type: NewsletterSectionType, direction: -1 | 1) {
    const currentIndex = sections.findIndex((section) => section.type === type)
    const nextIndex = currentIndex + direction

    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= sections.length) {
      return
    }

    onChange((draft) => {
      draft.sections = arrayMove(sections, currentIndex, nextIndex).map(
        (section, index) => ({
          ...section,
          order: index,
        })
      )
    })
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    const activeIndex = sections.findIndex((section) => section.id === active.id)
    const overIndex = sections.findIndex((section) => section.id === over.id)

    if (activeIndex < 0 || overIndex < 0) {
      return
    }

    onChange((draft) => {
      draft.sections = arrayMove(sections, activeIndex, overIndex).map(
        (section, index) => ({
          ...section,
          order: index,
        })
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
              <DndContext
                collisionDetection={closestCenter}
                id="newsletter-inline-section-sorter"
                sensors={sensors}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={sections.map((section) => section.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {sections.map((section, index) => (
                    <SortableSectionFrame
                      key={section.id}
                      index={index}
                      section={section}
                      total={sections.length}
                      onMove={moveSection}
                    >
                      <NewsletterContentSection
                        editable={editable}
                        isMobile={isMobile}
                        newsletter={newsletter}
                        type={section.type}
                        onChange={onChange}
                        textStyleProps={textStyleProps}
                      />
                    </SortableSectionFrame>
                  ))}
                </SortableContext>
              </DndContext>
            ) : (
              sections.map((section) => (
                <div key={section.id} className="relative min-w-0">
                  <NewsletterContentSection
                    editable={editable}
                    isMobile={isMobile}
                    newsletter={newsletter}
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

  return null
}

type SortableSectionFrameProps = {
  children: ReactNode
  index: number
  onMove: (type: NewsletterSectionType, direction: -1 | 1) => void
  section: NewsletterSection
  total: number
}

function SortableSectionFrame({
  children,
  index,
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
      <div className="absolute -top-4 right-0 z-30 flex items-center overflow-hidden rounded-sm border border-[#B7B783] bg-[#F7F5EE]/95 shadow-[0_10px_28px_rgba(22,59,53,0.12)]">
        <button
          className="cursor-grab px-2 py-1.5 text-[#244F49] hover:bg-[#ECE8D8] active:cursor-grabbing"
          type="button"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
          <span className="sr-only">Arrastar bloco</span>
        </button>
        <button
          className="border-l border-[#B7B783] px-2 py-1.5 text-[#244F49] hover:bg-[#ECE8D8] disabled:cursor-not-allowed disabled:opacity-40"
          disabled={index === 0}
          onClick={() => onMove(section.type, -1)}
          type="button"
        >
          <ArrowUp className="size-4" />
          <span className="sr-only">Mover bloco para cima</span>
        </button>
        <button
          className="border-l border-[#B7B783] px-2 py-1.5 text-[#244F49] hover:bg-[#ECE8D8] disabled:cursor-not-allowed disabled:opacity-40"
          disabled={index === total - 1}
          onClick={() => onMove(section.type, 1)}
          type="button"
        >
          <ArrowDown className="size-4" />
          <span className="sr-only">Mover bloco para baixo</span>
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
        <div className="min-w-0 space-y-1 text-[11px] font-bold uppercase tracking-[0.24em] text-[#244F49] [overflow-wrap:anywhere]">
          <InlineText
            ariaLabel="Coleção"
            editable={editable}
            multiline={false}
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
            multiline={false}
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
                "font-semibold leading-none tracking-[-0.02em] text-[#1F1F1A]",
                isMobile ? "text-[21px]" : "text-[25px]"
              )}
              editable={editable}
              multiline={false}
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
                "mt-1 text-[10px] font-bold uppercase text-[#244F49]",
                isMobile ? "tracking-[0.22em]" : "tracking-[0.34em]"
              )}
              editable={editable}
              multiline={false}
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
            "min-w-0 space-y-1 text-[11px] font-bold uppercase tracking-[0.24em] text-[#244F49] [overflow-wrap:anywhere]",
            !isMobile && "sm:text-right"
          )}
        >
          <InlineText
            ariaLabel="Número da edição"
            editable={editable}
            multiline={false}
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
            multiline={false}
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
}: Omit<NewsletterContentSectionProps, "type">) {
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
}: Omit<NewsletterContentSectionProps, "type">) {
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
            key={`${index}-${topic.title}`}
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
}: Omit<NewsletterContentSectionProps, "type">) {
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
            key={`${index}-${block.title}`}
            className="grid grid-cols-[5px_minmax(0,1fr)] gap-5"
          >
            <div className="bg-[#244F49]" />
            <div className="min-w-0 pb-1">
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
                  <InlineText
                    key={`${paragraphIndex}-${paragraph}`}
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
                ))}
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}

function EditableSyndicCards({
  editable,
  isMobile,
  newsletter,
  onChange,
  textStyleProps,
}: Omit<NewsletterContentSectionProps, "type">) {
  const cards =
    newsletter.syndicCards.length > 0
      ? newsletter.syndicCards
      : [{ description: "", number: "01", title: "" }]

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
            key={`${index}-${card.number}`}
            className="relative grid min-h-44 grid-cols-[58px_minmax(0,1fr)] gap-5 border border-[#B7B783] bg-white p-5 shadow-[inset_4px_0_0_#244F49]"
          >
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
}: Omit<NewsletterContentSectionProps, "type">) {
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
            <div className="inline-flex w-fit max-w-full items-center gap-2 rounded-sm bg-[#B7B783] px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#163B35]">
              <InlineText
                ariaLabel="Texto do botão do CTA"
                editable
                multiline={false}
                placeholder="Falar com o escritório"
                value={label}
                onChange={(value) =>
                  onChange((draft) => {
                    draft.cta.label = value
                  })
                }
                {...textStyleProps("cta.label")}
              />
              <ArrowRight className="size-4 shrink-0" />
            </div>
          ) : (
            <Link
              className="inline-flex w-fit max-w-full items-center gap-2 rounded-sm bg-[#B7B783] px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#163B35] transition-colors hover:bg-[#F7F5EE]"
              href={href}
            >
              <span className="[overflow-wrap:anywhere]">{label}</span>
              <ArrowRight className="size-4 shrink-0" />
            </Link>
          )}

          {editable && (
            <label className="mt-3 flex max-w-xs items-center gap-2 border border-[#B7B783]/60 bg-[#F7F5EE]/10 px-2 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#E8E4D4]">
              <Link2 className="size-3.5 shrink-0" />
              <input
                className="min-w-0 flex-1 bg-transparent text-xs normal-case tracking-normal text-[#F7F5EE] outline-none placeholder:text-[#E8E4D4]/70"
                placeholder="mailto:contato@..."
                value={cta.href}
                onChange={(event) =>
                  onChange((draft) => {
                    draft.cta.href = event.target.value
                  })
                }
              />
            </label>
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
  return (
    <aside
      className={cn(
        "space-y-6",
        !isMobile && "lg:border-l lg:border-[#B7B783]/60 lg:pl-8"
      )}
    >
      <section className="border border-[#B7B783] bg-white p-6 shadow-[inset_0_4px_0_#244F49]">
        <InlineText
          ariaLabel="Síntese lateral do informativo"
          className="text-[16px] leading-8 text-[#303029]"
          editable={false}
          placeholder="Síntese objetiva do informativo."
          renderAs="p"
          value="Entendimento útil para cobrança, negociação e gestão documental de débitos condominiais envolvendo unidades ocupadas pelo poder público."
          onChange={() => undefined}
        />
      </section>

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

      <EditableAttorneyCard
        editable={editable}
        newsletter={newsletter}
        onAttorneyPhotoChange={onAttorneyPhotoChange}
        onChange={onChange}
        onRemoveAttorneyPhoto={onRemoveAttorneyPhoto}
        textStyleProps={textStyleProps}
      />

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
    </aside>
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
            className="text-lg font-semibold leading-none text-[#1F1F1A]"
            editable={editable}
            multiline={false}
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
            className="mt-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#244F49]"
            editable={editable}
            multiline={false}
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
    return (
      <span className="inline-flex max-w-full flex-col gap-1">
        <span className="inline-flex max-w-full items-center gap-2 text-xs font-semibold text-[#1F1F1A]">
          {content}
        </span>
        {onHrefChange && (
          <span className="inline-flex max-w-[220px] items-center gap-1 border border-[#B7B783]/60 bg-[#F7F5EE]/70 px-1.5 py-1 text-[10px] text-[#4F5549]">
            <Link2 className="size-3 shrink-0" />
            <input
              className="min-w-0 bg-transparent outline-none"
              placeholder="https://..."
              value={contact.href}
              onChange={(event) => onHrefChange(event.target.value)}
            />
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

function removeEmptyStyle(style: NewsletterTextStyle) {
  return Object.fromEntries(
    Object.entries(style).filter(([, value]) => value !== undefined)
  ) as NewsletterTextStyle
}
