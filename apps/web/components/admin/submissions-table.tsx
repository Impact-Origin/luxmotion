"use client"

import * as React from "react"
import { Loader2, Mail, Search, Copy, Trash2, Inbox, Archive, Eye, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@workspace/ui/components/dialog"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { StatusBadge } from "@/components/admin/status-badge"
import { AdminEmptyState } from "@/components/admin/empty-state"

/**
 * Antes isto era o literal `"new" | "read" | "archived"`, e era exactamente o
 * que impedia as outras caixas de entrada de usarem esta tabela: os pedidos de
 * orçamento têm `inProgress|resolved`, os pedidos corporate têm
 * `submitted|reviewing|approved|rejected`. Cada tipo passa a declarar o seu
 * conjunto em `statuses`.
 */
export type SubmissionStatus = string

export type StatusDef = {
  value: string
  label: string
  /** Texto do item no menu de acção ("Arquivar", "Aprovar"…). */
  action?: string
}

export const DEFAULT_STATUSES: StatusDef[] = [
  { value: "new", label: "Novo", action: "Marcar como novo" },
  { value: "read", label: "Lido", action: "Marcar como lido" },
  { value: "archived", label: "Arquivado", action: "Arquivar" },
]

export type FieldDef<T> = {
  key: string
  label: string
  render?: (row: T) => React.ReactNode
  className?: string
  copyable?: boolean
}

export interface BaseSubmission {
  _id: string
  _creationTime?: number
  createdAt: number
  status?: SubmissionStatus
  email?: string
  phone?: string
  name?: string
  fullName?: string
}

interface Props<T extends BaseSubmission> {
  /** Page title is shown by the shell breadcrumb; kept for callers, not rendered. */
  title?: string
  emptyTitle: string
  emptyDescription?: string
  data: T[] | undefined
  columns: FieldDef<T>[]
  detailFields?: FieldDef<T>[]
  onSetStatus: (id: string, status: SubmissionStatus) => Promise<unknown>
  onDelete: (id: string) => Promise<unknown>
  searchKeys?: (keyof T | string)[]
  nameKey?: keyof T
  /** Conjunto de estados deste tipo. Omitido = novo/lido/arquivado. */
  statuses?: StatusDef[]
  /**
   * Coluna de atribuição a parceiro. Só metade das tabelas tem
   * `partnershipName`; era desenhada sempre, com um "Easy Transfer" inventado
   * nas que não têm.
   */
  showPartner?: boolean
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function SubmissionsTable<T extends BaseSubmission>({
  emptyTitle,
  emptyDescription,
  data,
  columns,
  detailFields,
  onSetStatus,
  onDelete,
  searchKeys = [],
  nameKey,
  statuses = DEFAULT_STATUSES,
  showPartner = false,
}: Props<T>) {
  const firstStatus = statuses[0]?.value ?? "new"
  const archiveStatus = statuses.find((s) => s.value === "archived")?.value
  const readStatus = statuses.find((s) => s.value === "read")?.value
  const statusLabel = React.useCallback(
    (value: string) => statuses.find((s) => s.value === value)?.label ?? value,
    [statuses],
  )
  const [statusFilter, setStatusFilter] = React.useState<"all" | SubmissionStatus>("all")
  const [search, setSearch] = React.useState("")
  const [selected, setSelected] = React.useState<T | null>(null)
  const [page, setPage] = React.useState(0)

  // Reset to the first page whenever the search query or status filter changes,
  // so we never land on a now-empty page.
  React.useEffect(() => {
    setPage(0)
  }, [search, statusFilter])

  const filtered = React.useMemo(() => {
    if (!data) return []
    let rows = data
    if (statusFilter !== "all") {
      rows = rows.filter((r) => (r.status ?? firstStatus) === statusFilter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      rows = rows.filter((r) =>
        searchKeys.some((k) => {
          const v = (r as Record<string, unknown>)[k as string]
          return v && v.toString().toLowerCase().includes(q)
        }),
      )
    }
    return rows
  }, [data, statusFilter, search, searchKeys, firstStatus])

  const counts = React.useMemo(() => {
    const out: Record<string, number> = { all: data?.length ?? 0 }
    for (const s of statuses) {
      out[s.value] =
        data?.filter((r) => (r.status ?? firstStatus) === s.value).length ?? 0
    }
    return out
  }, [data, statuses, firstStatus])

  const pageSize = 10
  const total = filtered.length
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const rangeStart = total === 0 ? 0 : page * pageSize + 1
  const rangeEnd = Math.min((page + 1) * pageSize, total)
  const pageRows = filtered.slice(page * pageSize, page * pageSize + pageSize)

  function copy(text: string) {
    navigator.clipboard.writeText(text)
    toast.success("Copiado")
  }

  async function handleSetStatus(id: string, status: SubmissionStatus) {
    try {
      await onSetStatus(id, status)
      toast.success(`Marcado como ${statusLabel(status).toLowerCase()}`)
    } catch {
      toast.error("Não foi possível actualizar o estado")
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Apagar esta submissão definitivamente?")) return
    try {
      await onDelete(id)
      toast.success("Apagado")
      if (selected?._id === id) setSelected(null)
    } catch {
      toast.error("Não foi possível apagar")
    }
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-1 bg-muted border border-border rounded-lg p-1">
          {[{ value: "all", label: "Todos" }, ...statuses].map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setStatusFilter(s.value)}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                statusFilter === s.value ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {s.label} ({counts[s.value] ?? 0})
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Procurar nome, e-mail, telefone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 border border-border rounded-lg text-sm bg-card placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <AdminEmptyState icon={Mail} title={emptyTitle} description={emptyDescription} />
      ) : (
        <div className="flex flex-col gap-3">
        <div className="border border-border rounded-lg overflow-hidden bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground w-[100px]">Status</th>
                {columns.map((c) => (
                  <th key={c.key} className={cn("text-left px-4 py-3 font-medium text-muted-foreground", c.className)}>
                    {c.label}
                  </th>
                ))}
                {showPartner && (
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground w-[130px]">Parceiro</th>
                )}
                <th className="text-left px-4 py-3 font-medium text-muted-foreground w-[160px]">Data</th>
                <th className="px-4 py-3 w-[120px]" />
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row) => {
                const status = row.status ?? firstStatus
                return (
                  <tr key={row._id} className="border-b border-border last:border-b-0 hover:bg-accent transition-colors">
                    <td className="px-4 py-3">
                      <StatusBadge status={status} label={statusLabel(status)} />
                    </td>
                    {columns.map((c) => (
                      <td key={c.key} className={cn("px-4 py-3", c.className)}>
                        {c.copyable ? (
                          <button
                            onClick={() => {
                              const v = (row as Record<string, unknown>)[c.key]
                              if (v) copy(v.toString())
                            }}
                            className="flex items-center gap-1.5 text-foreground hover:text-foreground group"
                          >
                            {c.render ? c.render(row) : ((row as Record<string, unknown>)[c.key] as React.ReactNode)}
                            <Copy className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        ) : c.render ? (
                          c.render(row)
                        ) : (
                          ((row as Record<string, unknown>)[c.key] as React.ReactNode) ?? (
                            <span className="text-muted-foreground">—</span>
                          )
                        )}
                      </td>
                    ))}
                    {showPartner && (
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        {((row as Record<string, unknown>).partnershipName as string) ?? "Easy Transfer"}
                      </td>
                    )}
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{formatDate(row.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setSelected(row)
                            // Abrir marca como lido — só onde "lido" existe.
                            if (readStatus && status === firstStatus) {
                              void handleSetStatus(row._id, readStatus)
                            }
                          }}
                          className="size-8 rounded-md hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground"
                          aria-label="View"
                        >
                          <Eye className="size-4" />
                        </button>
                        <Select
                          value={status}
                          onValueChange={(v) => handleSetStatus(row._id, v as SubmissionStatus)}
                        >
                          <SelectTrigger
                            className="h-8 w-8 p-0 border-0 shadow-none bg-transparent hover:bg-accent rounded-md flex items-center justify-center [&>svg:last-child]:hidden focus:ring-0 focus-visible:ring-0"
                            aria-label="Change status"
                          >
                            <span className="flex items-center justify-center">
                              <Inbox className="size-4 text-muted-foreground" />
                            </span>
                          </SelectTrigger>
                          <SelectContent align="end">
                            {statuses.map((s) => (
                              <SelectItem key={s.value} value={s.value}>
                                {s.action ?? s.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <button
                          type="button"
                          onClick={() => handleDelete(row._id)}
                          className="size-8 rounded-md hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive"
                          aria-label="Delete"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
          <div className="flex shrink-0 items-center justify-between gap-2 px-1 text-sm text-muted-foreground">
            <span className="tabular-nums">{rangeStart}–{rangeEnd} of {total}</span>
            <div className="flex items-center gap-2">
              <span className="tabular-nums">Page {page + 1} of {pageCount}</span>
              <Button variant="outline" size="icon" className="size-8" disabled={page <= 0} onClick={() => setPage((p) => Math.max(0, p - 1))} aria-label="Previous page"><ChevronLeft className="size-4" /></Button>
              <Button variant="outline" size="icon" className="size-8" disabled={page >= pageCount - 1} onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))} aria-label="Next page"><ChevronRight className="size-4" /></Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent showCloseButton={false} className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl">
              {selected ? (nameKey ? (selected[nameKey] as string) : selected.name ?? selected.fullName ?? "Submission") : "Submission"}
              {selected?.status && (
                <StatusBadge status={selected.status} label={statusLabel(selected.status)} />
              )}
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {(detailFields ?? columns).map((f) => {
                const value = (selected as Record<string, unknown>)[f.key]
                /* Um campo com `render` não tem de existir como chave na linha:
                   o orçamento dos pedidos de ultra-luxo é calculado a partir de
                   `budgetMin`/`budgetMax`, e não há nenhum campo chamado
                   `budget`. A verificação antiga olhava só para a chave crua, e
                   por isso descartava esses campos em silêncio — quem submetia
                   o formulário preenchia dados que nunca ninguém via. */
                const rendered = f.render ? f.render(selected) : null
                if (f.render ? rendered == null || rendered === "" : !value && value !== 0) {
                  return null
                }
                return (
                  <div key={f.key} className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{f.label}</span>
                    <div className="text-sm text-foreground break-words whitespace-pre-wrap">
                      {f.render ? rendered : (value as React.ReactNode)}
                    </div>
                  </div>
                )
              })}
              <div className="flex flex-col gap-1 md:col-span-2">
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Recebido</span>
                <span className="text-sm text-foreground">{formatDate(selected.createdAt)}</span>
              </div>
            </div>
          )}
          <div className="flex flex-wrap gap-2 mt-6">
            {selected?.email && (
              <Button asChild variant="outline" size="sm">
                <a href={`mailto:${selected.email}`}>
                  <Mail className="size-4 mr-1" /> Email
                  <ArrowUpRight className="size-3 ml-0.5" />
                </a>
              </Button>
            )}
            {selected?.phone && (
              <Button asChild variant="outline" size="sm">
                <a href={`tel:${selected.phone}`}>
                  Telefonar <ArrowUpRight className="size-3 ml-0.5" />
                </a>
              </Button>
            )}
            {selected && archiveStatus && (selected.status ?? firstStatus) !== archiveStatus && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSetStatus(selected._id, archiveStatus)}
              >
                <Archive className="size-4 mr-1" /> Arquivar
              </Button>
            )}
            {selected && (
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => handleDelete(selected._id)}
              >
                <Trash2 className="size-4 mr-1" /> Apagar
              </Button>
            )}
            <DialogClose asChild>
              <Button size="sm" className="ml-auto">
                Fechar
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
