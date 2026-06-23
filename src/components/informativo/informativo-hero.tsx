import type { Informativo } from "yes@/lib/informativo/types"

type InformativoHeroProps = {
  informativo: Informativo
}

export function InformativoHero({ informativo }: InformativoHeroProps) {
  return (
    <section className="py-8 sm:py-10">
      <div className="mb-5 flex flex-wrap gap-2">
        {informativo.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-[#efe5c8] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#54613e]"
          >
            {tag}
          </span>
        ))}
      </div>

      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8f7e43]">
        {informativo.practiceArea}
      </p>
      <h1 className="mt-4 max-w-4xl font-serif text-4xl leading-[1.08] text-[#223528] sm:text-5xl">
        {informativo.title}
      </h1>
      <p className="mt-5 max-w-3xl text-base leading-8 text-[#4d5c50] sm:text-lg">
        {informativo.subtitle}
      </p>

      <div className="mt-8 grid overflow-hidden border border-[#c7b56f]/80 sm:grid-cols-[1.35fr_0.65fr]">
        <div className="bg-[#304638] p-5 text-[#fbf8ef] sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d8c77d]">
            Resumo executivo
          </p>
          <p className="mt-3 text-base leading-7">{informativo.summary}</p>
        </div>
        <div className="bg-[#d5c27d] p-5 text-[#263628] sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em]">
            Tema da edição
          </p>
          <p className="mt-3 font-serif text-2xl leading-tight">
            Segurança documental
          </p>
        </div>
      </div>
    </section>
  )
}
