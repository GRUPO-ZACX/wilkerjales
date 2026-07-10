"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import {
  ArrowUpRight,
  Copy,
  LayoutGrid,
  List,
  Pencil,
  Search,
  Trash2,
} from "lucide-react"

import { Badge } from "yes@/components/ui/badge"
import { Button } from "yes@/components/ui/button"
import type { NewsletterRow } from "yes@/lib/supabase/database.types"
import {
  deleteNewsletterFromListAction,
  duplicateNewsletterFromListAction,
  publishNewsletterFromListAction,
  renameNewsletterFromListAction,
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
  const [copiedPublicLink, setCopiedPublicLink] = useState(false)
  const [isRenaming, setIsRenaming] = useState(false)
  const [draftTitle, setDraftTitle] = useState(newsletter.title)
  const isPublished = newsletter.status === "published"
  const editHref = `/dashboard/informativos/${newsletter.id}/editar`
  const publicHref = `/informativo/${newsletter.slug}`
  const publicationLabel =
    isPublished && newsletter.published_at
      ? `Publicado em ${formatDate(newsletter.published_at)}`
      : null

  async function copyPublicLink() {
    const origin = window.location.origin
    await navigator.clipboard.writeText(`${origin}${publicHref}`)
    setCopiedPublicLink(true)
    window.setTimeout(() => setCopiedPublicLink(false), 1600)
  }

  return (
    <article
      aria-label={`Editar informativo ${newsletter.title}`}
      className={cn(
        "rounded-xl border border-black/10 bg-white p-4 text-black shadow-[0_12px_34px_rgba(0,0,0,0.04)] transition-[border-color,box-shadow,transform] hover:border-black/25 hover:shadow-[0_18px_44px_rgba(0,0,0,0.08)]",
        viewMode === "list" &&
          "grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"
      )}
    >
      <div className="min-w-0">
        {isRenaming ? (
          <form
            action={renameNewsletterFromListAction}
            className="grid gap-2"
            onSubmit={() => setIsRenaming(false)}
          >
            <input name="id" type="hidden" value={newsletter.id} />
            <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-black/45">
              Nome do projeto
              <input
                autoFocus
                className="h-9 rounded-lg border border-black/15 bg-white px-3 text-sm font-semibold tracking-[-0.01em] text-black outline-none transition-colors focus:border-black/35 focus:ring-3 focus:ring-black/10"
                name="title"
                onChange={(event) => setDraftTitle(event.target.value)}
                required
                value={draftTitle}
              />
            </label>
            <div className="flex flex-wrap gap-2">
              <Button
                className="bg-black text-white hover:bg-black/80"
                size="sm"
                type="submit"
              >
                Salvar nome
              </Button>
              <Button
                className="border-black/10 bg-white text-black hover:bg-black/5"
                onClick={() => {
                  setDraftTitle(newsletter.title)
                  setIsRenaming(false)
                }}
                size="sm"
                type="button"
                variant="outline"
              >
                Cancelar
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <Link
              className="text-lg font-semibold tracking-[-0.02em] text-black [overflow-wrap:anywhere] hover:underline"
              href={editHref}
              title="Abrir projeto"
            >
              {newsletter.title}
            </Link>
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
        )}
        <p className="mt-2 text-xs font-medium text-black/50">
          Atualizado em {formatDate(newsletter.updated_at)}
        </p>
        {publicationLabel ? (
          <p className="mt-1 text-xs font-semibold text-black/60">
            {publicationLabel}
          </p>
        ) : null}
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
          <Link href={editHref}>Abrir</Link>
        </Button>

        <Button
          className="border-black/10 bg-white text-black hover:bg-black/5"
          disabled={isRenaming}
          onClick={() => {
            setDraftTitle(newsletter.title)
            setIsRenaming(true)
          }}
          size="sm"
          type="button"
          variant="outline"
        >
          <Pencil />
          Renomear
        </Button>

        {isPublished && (
          <div className="inline-flex overflow-hidden rounded-lg border border-black/10 bg-white">
            <Button
              asChild
              aria-label="Abrir link público"
              className="rounded-none border-0 bg-white text-black hover:bg-black/5"
              size="icon-sm"
              title="Abrir link público"
              variant="outline"
            >
              <Link href={publicHref} target="_blank">
                <ArrowUpRight />
              </Link>
            </Button>
            <Button
              aria-label="Copiar link público"
              className="rounded-none border-0 border-l border-black/10 bg-white text-black hover:bg-black/5"
              size="icon-sm"
              title="Copiar link público"
              type="button"
              variant="outline"
              onClick={copyPublicLink}
            >
              <Copy />
            </Button>
          </div>
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

        <form action={duplicateNewsletterFromListAction}>
          <input name="id" type="hidden" value={newsletter.id} />
          <Button
            className="border-black/10 bg-white text-black hover:bg-black/5"
            size="sm"
            type="submit"
            variant="outline"
          >
            Duplicar
          </Button>
        </form>

        <form
          action={deleteNewsletterFromListAction}
          onSubmit={(event) => {
            if (
              !window.confirm(
                `Excluir definitivamente o projeto "${newsletter.title}"?`
              )
            ) {
              event.preventDefault()
            }
          }}
        >
          <input name="id" type="hidden" value={newsletter.id} />
          <Button
            className="border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
            size="sm"
            type="submit"
            variant="outline"
          >
            <Trash2 />
            Excluir
          </Button>
        </form>

        {copiedPublicLink && (
          <span className="self-center text-xs font-semibold text-black/55">
            Link copiado
          </span>
        )}
      </div>
    </article>
  )
}
