type PhotoPlaceholderProps = {
  initials?: string
  label: string
  wide?: boolean
}

export function PhotoPlaceholder({
  initials,
  label,
  wide = false,
}: PhotoPlaceholderProps) {
  return (
    <div
      className={[
        "site-photo-placeholder flex w-full items-center justify-center overflow-hidden border border-[#d8d4c6] bg-[#eef0e8]",
        wide ? "h-64 sm:aspect-[16/10] sm:h-auto" : "aspect-[4/5] min-h-72",
      ].join(" ")}
      aria-label={label}
    >
      <div className="grid place-items-center gap-3 text-center text-[#336666]">
        {initials ? (
          <span className="site-serif grid size-20 place-items-center border border-[#336666]/30 bg-[#fbfaf5]/70 text-3xl">
            {initials}
          </span>
        ) : null}
        <span className="text-sm text-[#5e7272]">Imagem em breve</span>
      </div>
    </div>
  )
}
