"use client"

import * as React from "react"
import {
  LayoutGrid,
  LayoutList,
  ArrowUp,
  ArrowDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { ToggleGroup, ToggleGroupItem } from "@workspace/ui/components/toggle-group"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Button } from "@workspace/ui/components/button"
import { AdminEmptyState } from "@/components/admin/empty-state"

export type SortDir = "asc" | "desc"

export interface DataTableColumn<T> {
  id: string
  header: React.ReactNode
  cell: (row: T) => React.ReactNode
  /** Presence makes the header sortable. In server mode the column id is sent as `sortBy`. */
  sortAccessor?: (row: T) => string | number
  headerClassName?: string
  cellClassName?: string
  align?: "left" | "right" | "center"
}

export interface DataTableFilter<T> {
  id: string
  label: string
  options: { value: string; label: string }[]
  /** Used in client mode only; in server mode the value is sent under `filters[id]`. */
  predicate?: (row: T, value: string) => boolean
  width?: string
}

/** Emitted to the parent in server mode whenever search/sort/filter/page changes. */
export interface DataTableQuery {
  page: number
  pageSize: number
  search?: string
  sortBy?: string
  sortDir?: SortDir
  filters: Record<string, string>
}

export interface DataTableProps<T> {
  /** undefined => loading. In server mode this is just the current page of rows. */
  data: T[] | undefined
  columns: DataTableColumn<T>[]
  /** "client" (default): paginate/search/sort/filter in-memory. "server": parent supplies the page + total. */
  mode?: "client" | "server"
  /** Server mode: total row count (for the pager). */
  total?: number
  pageSize?: number
  /** Server mode: called when search/sort/filter/page changes — wire to your query args. */
  onQueryChange?: (q: DataTableQuery) => void
  searchKeys?: (keyof T | ((row: T) => string | null | undefined))[]
  searchPlaceholder?: string
  filters?: DataTableFilter<T>[]
  views?: ("table" | "card")[]
  defaultView?: "table" | "card"
  renderCard?: (row: T) => React.ReactNode
  rowActions?: (row: T) => React.ReactNode
  toolbarActions?: React.ReactNode
  getRowId?: (row: T) => string
  initialSort?: { columnId: string; dir: SortDir }
  emptyTitle?: string
  emptyDescription?: string
  emptyIcon?: React.ComponentType<{ className?: string }>
  loadingRows?: number
  className?: string
  /** When set, clicking a table row calls this. Row-action cells stop propagation. */
  onRowClick?: (row: T) => void
}

const ALL = "__all__"
const alignClass = { left: "text-left", right: "text-right", center: "text-center" } as const

export function DataTable<T extends { _id: string }>({
  data,
  columns,
  mode = "client",
  total: totalProp,
  pageSize = 10,
  onQueryChange,
  searchKeys = [],
  searchPlaceholder = "Search…",
  filters = [],
  views = ["table", "card"],
  defaultView = "table",
  renderCard,
  rowActions,
  toolbarActions,
  getRowId = (r) => r._id,
  initialSort,
  emptyTitle = "Nothing here yet",
  emptyDescription,
  emptyIcon: EmptyIcon,
  loadingRows = 6,
  className,
  onRowClick,
}: DataTableProps<T>) {
  const server = mode === "server"
  const [view, setView] = React.useState<"table" | "card">(defaultView)
  const [query, setQuery] = React.useState("")
  const [sort, setSort] = React.useState<{ columnId: string; dir: SortDir } | null>(initialSort ?? null)
  const [filterValues, setFilterValues] = React.useState<Record<string, string>>({})
  const [page, setPage] = React.useState(0)

  const hasCard = views.includes("card") && !!renderCard
  const showViewToggle = views.length > 1 && hasCard

  // Server mode: emit the query state to the parent (which owns the Convex query).
  const onQueryChangeRef = React.useRef(onQueryChange)
  onQueryChangeRef.current = onQueryChange
  React.useEffect(() => {
    if (!server) return
    const cleanFilters: Record<string, string> = {}
    for (const [k, v] of Object.entries(filterValues)) if (v && v !== ALL) cleanFilters[k] = v
    onQueryChangeRef.current?.({
      page,
      pageSize,
      search: query.trim() || undefined,
      sortBy: sort?.columnId,
      sortDir: sort?.dir,
      filters: cleanFilters,
    })
  }, [server, page, pageSize, query, sort, filterValues])

  // Client mode: search + filter + sort the full array in-memory.
  const processed = React.useMemo(() => {
    if (server || !data) return undefined
    const q = query.trim().toLowerCase()
    let rows = data
    if (q && searchKeys.length) {
      rows = rows.filter((row) =>
        searchKeys.some((key) => {
          const val = typeof key === "function" ? key(row) : row[key]
          return String(val ?? "").toLowerCase().includes(q)
        }),
      )
    }
    for (const f of filters) {
      const val = filterValues[f.id]
      if (val && val !== ALL && f.predicate) rows = rows.filter((row) => f.predicate!(row, val))
    }
    if (sort) {
      const col = columns.find((c) => c.id === sort.columnId)
      if (col?.sortAccessor) {
        const acc = col.sortAccessor
        rows = [...rows].sort((a, b) => {
          const av = acc(a)
          const bv = acc(b)
          if (av < bv) return sort.dir === "asc" ? -1 : 1
          if (av > bv) return sort.dir === "asc" ? 1 : -1
          return 0
        })
      }
    }
    return rows
  }, [server, data, query, searchKeys, filters, filterValues, sort, columns])

  const loading = data === undefined
  const total = server ? totalProp ?? 0 : processed?.length ?? 0
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(page, pageCount - 1)
  const pageRows: T[] = server
    ? data ?? []
    : (processed ?? []).slice(safePage * pageSize, safePage * pageSize + pageSize)

  const resetToFirstPage = () => setPage(0)
  const toggleSort = (columnId: string) => {
    setPage(0)
    setSort((prev) => {
      if (!prev || prev.columnId !== columnId) return { columnId, dir: "asc" }
      if (prev.dir === "asc") return { columnId, dir: "desc" }
      return null
    })
  }

  const rangeStart = total === 0 ? 0 : safePage * pageSize + 1
  const rangeEnd = Math.min((safePage + 1) * pageSize, total)

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-wrap items-center gap-2">
        {searchKeys.length > 0 && (
          <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                resetToFirstPage()
              }}
              placeholder={searchPlaceholder}
              className="pl-8"
            />
          </div>
        )}
        {filters.map((f) => (
          <Select
            key={f.id}
            value={filterValues[f.id] ?? ALL}
            onValueChange={(v) => {
              setFilterValues((s) => ({ ...s, [f.id]: v }))
              resetToFirstPage()
            }}
          >
            <SelectTrigger className={cn("h-9", f.width ?? "w-[160px]")}>
              <SelectValue placeholder={f.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>{f.label}</SelectItem>
              {f.options
                .filter((o) => o.value !== "")
                .map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        ))}
        <div className="ml-auto flex items-center gap-2">
          {toolbarActions}
          {showViewToggle && (
            <ToggleGroup
              type="single"
              variant="outline"
              value={view}
              onValueChange={(v) => v && setView(v as "table" | "card")}
            >
              <ToggleGroupItem value="table" aria-label="List view">
                <LayoutList className="size-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="card" aria-label="Card view">
                <LayoutGrid className="size-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          )}
        </div>
      </div>

      {loading ? (
        view === "card" && hasCard ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: loadingRows }).map((_, i) => (
              <Skeleton key={i} className="h-44 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card">
            {Array.from({ length: loadingRows }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 border-b border-border px-4 py-3 last:border-0"
              >
                <Skeleton className="size-9 rounded-md" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        )
      ) : total === 0 ? (
        <AdminEmptyState icon={EmptyIcon} title={emptyTitle} description={emptyDescription} />
      ) : (
        <>
          {view === "card" && hasCard ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {pageRows.map((row) => (
                <React.Fragment key={getRowId(row)}>{renderCard!(row)}</React.Fragment>
              ))}
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    {columns.map((col) => {
                      const active = sort?.columnId === col.id
                      return (
                        <TableHead
                          key={col.id}
                          className={cn(col.align && alignClass[col.align], col.headerClassName)}
                        >
                          {col.sortAccessor ? (
                            <button
                              type="button"
                              onClick={() => toggleSort(col.id)}
                              className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
                            >
                              {col.header}
                              {active ? (
                                sort!.dir === "asc" ? (
                                  <ArrowUp className="size-3.5" />
                                ) : (
                                  <ArrowDown className="size-3.5" />
                                )
                              ) : (
                                <ChevronsUpDown className="size-3.5 opacity-40" />
                              )}
                            </button>
                          ) : (
                            col.header
                          )}
                        </TableHead>
                      )
                    })}
                    {rowActions && <TableHead className="w-10" />}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageRows.map((row) => (
                    <TableRow
                      key={getRowId(row)}
                      onClick={onRowClick ? () => onRowClick(row) : undefined}
                      className={onRowClick ? "cursor-pointer" : undefined}
                    >
                      {columns.map((col) => (
                        <TableCell
                          key={col.id}
                          className={cn(col.align && alignClass[col.align], col.cellClassName)}
                        >
                          {col.cell(row)}
                        </TableCell>
                      ))}
                      {rowActions && (
                        <TableCell
                          className="text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {rowActions(row)}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="flex shrink-0 items-center justify-between gap-2 px-1 text-sm text-muted-foreground">
            <span className="tabular-nums">
              {rangeStart}–{rangeEnd} of {total}
            </span>
            <div className="flex items-center gap-2">
              <span className="tabular-nums">
                Page {safePage + 1} of {pageCount}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                disabled={safePage <= 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                aria-label="Previous page"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                disabled={safePage >= pageCount - 1}
                onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                aria-label="Next page"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
