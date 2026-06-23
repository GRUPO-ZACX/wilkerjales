import type { NoteBlock } from "yes@/lib/informativo/types"

type NoteBlockViewProps = {
  block: NoteBlock
}

export function NoteBlockView({ block }: NoteBlockViewProps) {
  return (
    <section className="bg-[#304638] p-6 text-[#fbf8ef]">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d5c27d]">
        {block.eyebrow}
      </p>
      <h2 className="mt-2 font-serif text-2xl leading-tight">{block.title}</h2>
      <blockquote className="mt-4 border-l-2 border-[#d5c27d] pl-4 text-lg leading-8">
        {block.quote}
      </blockquote>
      <p className="mt-4 text-xs uppercase tracking-[0.16em] text-[#d8dccf]">
        {block.source}
      </p>
    </section>
  )
}
