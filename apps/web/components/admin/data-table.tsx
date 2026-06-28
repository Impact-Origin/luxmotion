"use client"

import * as React from "react"
import { LayoutGrid, LayoutList, ArrowUp, ArrowDown, ChevronsUpDown, Search } from "lucide-react"
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

export type SortDir = "asc" | "desc"

export interface DataTableColumn<T> {
  id: string
  header: React.ReactNode
  cell: (row: T) => React.ReactNode
  /** Presence makes the header sortable. */
  sortAccessor?: (row: T) => string | number
  headerClassName?: string
  cellClassName?: string
  align?: "left" | "right" | "center"
}

export interface DataTableFilter<T> {
  id: string
  label: string
  options: { value: string; label: string }[]
  predicate: (row: T, value: string) => boolean
  width?: string
}

export interface DataTableProps<T> {
  /** undefined => loading (Convex hasn't resolved yet). */
  data: T[] | undefined
  columns: DataTableColumn<T>[]
  /** Property names or accessor fns (for derived fields like partnershipName). */
  searchKeys?: (keyof T | ((row: T) => string | null | undefined))[]
  searchPlaceholder?: string
  filters?: DataTableFilter<T>[]
  views?: ("table" | "card")[]
  defaultView?: "table" | "card"
  renderCard?: (row: T) => React.ReactNode
  /** Trailing actions column (typically a DropdownMenu). */
  rowActions?: (row: T) => React.ReactNode
  /** Right side of the toolbar (e.g. an "Add" button). */
  toolbarActions?: React.ReactNode
  getRowId?: (row: T) => string
  initialSort?: { columnId: string; dir: SortDir }
  emptyTitle?: string
  emptyDescription?: string
  emptyIcon?: React.ComponentType<{ className?: string }>
  loadingRows?: number
  className?: string
}

const ALL = "__all__"
const alignClass = { left: "text-left", right: "text-right", center: "text-center" } as const

export function DataTable<T extends { _id: string }>({
  data,
  columns,
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
}: DataTableProps<T>) {
  const [view, setView] = React.useState<"table" | "card">(defaultView)
  const [query, setQuery] = React.useState("")
  const [sort, setSort] = React.useState<{ columnId: string; dir: SortDir } | null>(initialSort ?? null)
  const [filterValues, setFilterValues] = React.useState<Record<string, string>>({})

  const hasCard = views.includes("card") && !!renderCard
  const showViewToggle = views.length > 1 && hasCard

  const processed = React.useMemo(() => {
    if (!data) return undefined
    const q = query.trim().toLowerCase()
    let rows = data
    if (q && searchKeys.length) {
      rows = rows.filter((row) =>
        searchKeys.some((key) => {
          const v = typeof key === "function" ? key(row) : row[key]
          return String(v ?? "").toLowerCase().includes(q)
        }),
      )
    }
    for (const f of filters) {
      const val = filterValues[f.id]
      if (val && val !== ALL) rows = rows.filter((row) => f.predicate(row, val))
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
  }, [data, query, searchKeys, filters, filterValues, sort, columns])

  const toggleSort = (columnId: string) => {
    setSort((prev) => {
      if (!prev || prev.columnId !== columnId) return { columnId, dir: "asc" }
      if (prev.dir === "asc") return { columnId, dir: "desc" }
      return null
    })
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap items-center gap-2">
        {searchKeys.length > 0 && (
          <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="pl-8"
            />
          </div>
        )}
        {filters.map((f) => (
          <Select
            key={f.id}
            value={filterValues[f.id] ?? ALL}
            onValueChange={(v) => setFilterValues((s) => ({ ...s, [f.id]: v }))}
          >
            <SelectTrigger className={cn("h-9", f.width ?? "w-[160px]")}>
              <SelectValue placeholder={f.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>{f.label}</SelectItem>
              {f.options.map((o) => (
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

      {processed === undefined ? (
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
      ) : processed.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
          {EmptyIcon && <EmptyIcon className="size-8 text-muted-foreground" />}
          <p className="text-sm font-medium text-foreground">{emptyTitle}</p>
          {emptyDescription && (
            <p className="max-w-sm text-sm text-muted-foreground">{emptyDescription}</p>
          )}
        </div>
      ) : view === "card" && hasCard ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {processed.map((row) => (
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
              {processed.map((row) => (
                <TableRow key={getRowId(row)}>
                  {columns.map((col) => (
                    <TableCell
                      key={col.id}
                      className={cn(col.align && alignClass[col.align], col.cellClassName)}
                    >
                      {col.cell(row)}
                    </TableCell>
                  ))}
                  {rowActions && <TableCell className="text-right">{rowActions(row)}</TableCell>}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
