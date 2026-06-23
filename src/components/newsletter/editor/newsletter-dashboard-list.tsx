"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ExternalLink, LayoutGrid, List, Search } from "lucide-react"

import { Badge } from "yes@/components/ui/badge"
import { Button } from "yes@/components/ui/button"
import type { NewsletterRow } from "yes@/lib/supabase/database.types"
import {
  publishNewsletterFromListAction,
  unpublishNewsletterFromListAction,
} from "yes@/app/dashboard/informativos/actions"
import { cn } from "yes@/lib/utils"

type NewsletterDashboardListProps = {
  newsletters: NewsletterRow[]
}

type ViewMode = "cards" | "list"
type StatusFilter = "all" | "draft" | "published"

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value))
}

export function NewsletterDashboardList({
  newsletters,
}: NewsletterDashboardListProps) {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<StatusFilter>("all")
  const [viewMode, setViewMode] = useState<ViewMode>("cards")

  const filteredNewsletters = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return newsletters.filter((newsletter) => {
      const matchesStatus = status === "all" || newsletter.status === status
      const matchesQuery =
        !normalizedQuery ||
        newsletter.title.toLowerCase().includes(normalizedQuery) ||
        newsletter.slug.toLowerCase().includes(normalizedQuery)

      return matchesStatus && matchesQuery
    })
  }, [newsletters, query, status])

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-3 rounded-xl border border-black/10 bg-white p-3 text-black shadow-[0_12px_34px_rgba(0,0,0,0.04)] lg:flex-row lg:items-center lg:justify-between">
        <label className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-black/10 bg-black/[0.03] px-3 py-2">
          <Search className="size-4 shrink-0 text-black/45" />
          <input
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-black/40"
            placeholder="Buscar por título ou slug"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        <div className="flex flex-wrap items-center gap-2">
          {[
            { label: "Todos", value: "all" },
            { label: "Rascunhos", value: "draft" },
            { label: "Publicados", value: "published" },
          ].map((item) => (
            <button
              key={item.value}
              className={cn(
                "h-8 rounded-lg px-3 text-xs font-semibold text-black/65 transition-colors hover:bg-black/5 hover:text-black",
                status === item.value && "bg-black text-white hover:bg-black hover:text-white"
              )}
              onClick={() => setStatus(item.value as StatusFilter)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="inline-flex w-fit rounded-lg border border-black/10 bg-black/[0.03] p-1">
          <button
            className={cn(
              "grid size-8 place-items-center rounded-md text-black/60 transition-colors hover:text-black",
              viewMode === "cards" && "bg-black text-white hover:text-white"
            )}
            onClick={() => setViewMode("cards")}
            type="button"
          >
            <LayoutGrid className="size-4" />
            <span className="sr-only">Ver como cards</span>
          </button>
          <button
            className={cn(
              "grid size-8 place-items-center rounded-md text-black/60 transition-colors hover:text-black",
              viewMode === "list" && "bg-black text-white hover:text-white"
            )}
            onClick={() => setViewMode("list")}
            type="button"
          >
            <List className="size-4" />
            <span className="sr-only">Ver como lista</span>
          </button>
        </div>
      </div>

      <div
        className={cn(
          "mt-5 grid gap-3",
          viewMode === "cards" && "md:grid-cols-2 xl:grid-cols-3"
        )}
      >
        {filteredNewsletters.map((newsletter) => (
          <NewsletterItem
            key={newsletter.id}
            newsletter={newsletter}
            viewMode={viewMode}
          />
        ))}
      </div>

      {filteredNewsletters.length === 0 && newsletters.length > 0 && (
        <div className="mt-5 rounded-xl border border-black/10 bg-white p-8 text-center text-sm text-black/55">
          Nenhum informativo encontrado com esses filtros.
        </div>
      )}
    </div>
  )
}

type NewsletterItemProps = {
  newsletter: NewsletterRow
  viewMode: ViewMode
}

function NewsletterItem({ newsletter, viewMode }: NewsletterItemProps) {
  const isPublished = newsletter.status === "published"

  return (
    <article
      className={cn(
        "rounded-xl border border-black/10 bg-white p-4 text-black shadow-[0_12px_34px_rgba(0,0,0,0.04)]",
        viewMode === "list" &&
          "grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"
      )}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold tracking-[-0.02em] text-black [overflow-wrap:anywhere]">
            {newsletter.title}
          </h2>
          <Badge
            className={
              isPublished
                ? "border-black bg-black text-white"
                : "border-black/10 bg-black/[0.04] text-black/65"
            }
            variant="outline"
          >
            {isPublished ? "Publicado" : "Rascunho"}
          </Badge>
        </div>
        <p className="mt-2 text-xs font-medium text-black/50">
          Atualizado em {formatDate(newsletter.updated_at)}
        </p>
        <p className="mt-1 truncate text-xs text-black/40">/{newsletter.slug}</p>
      </div>

      <div
        className={cn(
          "mt-5 flex flex-wrap gap-2",
          viewMode === "list" && "mt-0 lg:justify-end"
        )}
      >
        <Button
          asChild
          className="border-black/10 bg-white text-black hover:bg-black/5"
          size="sm"
          variant="outline"
        >
          <Link href={`/dashboard/informativos/${newsletter.id}/editar`}>
            Editar
          </Link>
        </Button>

        {isPublished && (
          <Button
            asChild
            className="border-black/10 bg-white text-black hover:bg-black/5"
            size="sm"
            variant="outline"
          >
            <Link href={`/informativo/${newsletter.slug}`}>
              <ExternalLink />
              Público
            </Link>
          </Button>
        )}

        {isPublished ? (
          <form action={unpublishNewsletterFromListAction}>
            <input name="id" type="hidden" value={newsletter.id} />
            <Button
              className="border-black/10 bg-white text-black hover:bg-black/5"
              size="sm"
              type="submit"
              variant="outline"
            >
              Despublicar
            </Button>
          </form>
        ) : (
          <form action={publishNewsletterFromListAction}>
            <input name="id" type="hidden" value={newsletter.id} />
            <Button className="bg-black text-white hover:bg-black/80" size="sm" type="submit">
              Publicar
            </Button>
          </form>
        )}
      </div>
    </article>
  )
}
