"use client"

import type { CSSProperties } from "react"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import type { DragEndEvent } from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { ArrowDown, ArrowUp, GripVertical } from "lucide-react"

import {
  newsletterSectionMeta,
  normalizeNewsletterSections,
} from "yes@/lib/newsletter/sections"
import type { NewsletterSection } from "yes@/lib/newsletter/types"
import { cn } from "yes@/lib/utils"

type NewsletterSectionSorterProps = {
  sections: NewsletterSection[]
  onChange: (sections: NewsletterSection[]) => void
}

export function NewsletterSectionSorter({
  onChange,
  sections,
}: NewsletterSectionSorterProps) {
  const normalizedSections = normalizeNewsletterSections(sections)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function updateOrder(nextSections: NewsletterSection[]) {
    onChange(
      normalizeNewsletterSections(
        nextSections.map((section, index) => ({ ...section, order: index }))
      )
    )
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    const oldIndex = normalizedSections.findIndex(
      (section) => section.id === active.id
    )
    const newIndex = normalizedSections.findIndex(
      (section) => section.id === over.id
    )

    if (oldIndex < 0 || newIndex < 0) {
      return
    }

    updateOrder(arrayMove(normalizedSections, oldIndex, newIndex))
  }

  function moveSection(index: number, direction: -1 | 1) {
    const nextIndex = index + direction

    if (nextIndex < 0 || nextIndex >= normalizedSections.length) {
      return
    }

    updateOrder(arrayMove(normalizedSections, index, nextIndex))
  }

  return (
    <div className="grid gap-4">
      <p className="text-sm leading-6 text-[#4F5549]">
        Reorganize apenas os blocos centrais do informativo. Cabeçalho, faixa
        institucional, sidebar, rodapé e download permanecem fixos.
      </p>

      <DndContext
        collisionDetection={closestCenter}
        id="newsletter-section-sorter"
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <SortableContext
          items={normalizedSections.map((section) => section.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid gap-2">
            {normalizedSections.map((section, index) => (
              <SortableSectionItem
                index={index}
                isFirst={index === 0}
                isLast={index === normalizedSections.length - 1}
                key={section.id}
                onMove={moveSection}
                section={section}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}

type SortableSectionItemProps = {
  section: NewsletterSection
  index: number
  isFirst: boolean
  isLast: boolean
  onMove: (index: number, direction: -1 | 1) => void
}

function SortableSectionItem({
  index,
  isFirst,
  isLast,
  onMove,
  section,
}: SortableSectionItemProps) {
  const {
    attributes,
    isDragging,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: section.id })
  const meta = newsletterSectionMeta[section.type]
  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <article
      className={cn(
        "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border border-[#B7B783]/55 bg-[#F7F5EE]/85 p-3 shadow-sm transition-shadow",
        isDragging &&
          "border-[#244F49] bg-white shadow-[0_14px_30px_rgba(22,59,53,0.14)]"
      )}
      ref={setNodeRef}
      style={style}
    >
      <button
        aria-label={`Arrastar ${meta.label}`}
        className="grid size-9 cursor-grab place-items-center border border-[#B7B783]/70 bg-white text-[#244F49] transition-colors hover:bg-[#ECE8D8] active:cursor-grabbing"
        ref={setActivatorNodeRef}
        type="button"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" />
      </button>

      <div className="min-w-0">
        <p className="text-sm font-semibold text-[#163B35] [overflow-wrap:anywhere]">
          {meta.label}
        </p>
        <p className="mt-1 text-xs leading-5 text-[#6D714C] [overflow-wrap:anywhere]">
          {meta.description}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <button
          aria-label={`Mover ${meta.label} para cima`}
          className="grid size-8 place-items-center border border-[#B7B783]/70 bg-white text-[#244F49] transition-colors hover:bg-[#ECE8D8] disabled:cursor-not-allowed disabled:opacity-35"
          disabled={isFirst}
          onClick={() => onMove(index, -1)}
          type="button"
        >
          <ArrowUp className="size-4" />
        </button>
        <button
          aria-label={`Mover ${meta.label} para baixo`}
          className="grid size-8 place-items-center border border-[#B7B783]/70 bg-white text-[#244F49] transition-colors hover:bg-[#ECE8D8] disabled:cursor-not-allowed disabled:opacity-35"
          disabled={isLast}
          onClick={() => onMove(index, 1)}
          type="button"
        >
          <ArrowDown className="size-4" />
        </button>
      </div>
    </article>
  )
}
