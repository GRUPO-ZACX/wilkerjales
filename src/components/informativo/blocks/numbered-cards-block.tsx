import type { NumberedCardsBlock } from "yes@/lib/informativo/types"

type NumberedCardsBlockViewProps = {
  block: NumberedCardsBlock
}

export function NumberedCardsBlockView({
  block,
}: NumberedCardsBlockViewProps) {
  return (
    <section>
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8f7e43]">
          {block.eyebrow}
        </p>
        <h2 className="mt-2 font-serif text-3xl leading-tight text-[#25382a]">
          {block.title}
        </h2>
        <p className="mt-3 text-[15px] leading-7 text-[#4f5e51]">
          {block.description}
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {block.cards.map((card) => (
          <article
            key={card.number}
            className="border border-[#c7b56f]/70 bg-[#fffaf0] p-4"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-[#304638] font-serif text-lg text-[#f6eed8]">
              {card.number}
            </span>
            <h3 className="mt-4 font-serif text-xl leading-tight text-[#283b2d]">
              {card.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-[#566255]">
              {card.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
