import type { ArticleBlock } from "yes@/lib/informativo/types"

type ArticleBlockViewProps = {
  block: ArticleBlock
}

export function ArticleBlockView({ block }: ArticleBlockViewProps) {
  return (
    <section className="border-l-4 border-[#c7b56f] pl-5">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8f7e43]">
        {block.eyebrow}
      </p>
      <h2 className="mt-2 font-serif text-3xl leading-tight text-[#25382a]">
        {block.title}
      </h2>
      {block.lead && (
        <p className="mt-4 text-lg leading-8 text-[#354a3a]">{block.lead}</p>
      )}
      <div className="mt-4 space-y-4 text-[15px] leading-7 text-[#4f5e51]">
        {block.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {block.highlight && (
        <p className="mt-5 border border-[#c7b56f]/70 bg-[#f0e7cc] px-4 py-3 text-sm font-medium leading-6 text-[#334536]">
          {block.highlight}
        </p>
      )}
    </section>
  )
}
