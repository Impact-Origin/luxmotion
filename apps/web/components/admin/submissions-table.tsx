"use client"

import * as React from "react"
import { Loader2, Mail, Search, Copy, Trash2, Inbox, Archive, Eye, ArrowUpRight } from "lucide-react"
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

export type SubmissionStatus = "new" | "read" | "archived"

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
  title: string
  emptyTitle: string
  emptyDescription?: string
  data: T[] | undefined
  columns: FieldDef<T>[]
  detailFields?: FieldDef<T>[]
  onSetStatus: (id: string, status: SubmissionStatus) => Promise<unknown>
  onDelete: (id: string) => Promise<unknown>
  searchKeys?: (keyof T | string)[]
  nameKey?: keyof T
}

const STATUS_STYLES: Record<SubmissionStatus, string> = {
  new: "bg-amber-50 text-amber-800 border-amber-200",
  read: "bg-[#faf6ee] text-[#4a443c] border-[#e7ddca]",
  archived: "bg-[#f1e8d8] text-[#8a8074] border-[#e7ddca]",
}

const STATUS_LABEL: Record<SubmissionStatus, string> = {
  new: "New",
  read: "Read",
  archived: "Archived",
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
  title,
  emptyTitle,
  emptyDescription,
  data,
  columns,
  detailFields,
  onSetStatus,
  onDelete,
  searchKeys = [],
  nameKey,
}: Props<T>) {
  const [statusFilter, setStatusFilter] = React.useState<"all" | SubmissionStatus>("all")
  const [search, setSearch] = React.useState("")
  const [selected, setSelected] = React.useState<T | null>(null)

  const filtered = React.useMemo(() => {
    if (!data) return []
    let rows = data
    if (statusFilter !== "all") {
      rows = rows.filter((r) => (r.status ?? "new") === statusFilter)
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
  }, [data, statusFilter, search, searchKeys])

  const counts = React.useMemo(() => {
    if (!data) return { all: 0, new: 0, read: 0, archived: 0 }
    return {
      all: data.length,
      new: data.filter((r) => (r.status ?? "new") === "new").length,
      read: data.filter((r) => r.status === "read").length,
      archived: data.filter((r) => r.status === "archived").length,
    }
  }, [data])

  function copy(text: string) {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard")
  }

  async function handleSetStatus(id: string, status: SubmissionStatus) {
    try {
      await onSetStatus(id, status)
      toast.success(`Marked as ${STATUS_LABEL[status].toLowerCase()}`)
    } catch {
      toast.error("Could not update status")
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this submission permanently?")) return
    try {
      await onDelete(id)
      toast.success("Deleted")
      if (selected?._id === id) setSelected(null)
    } catch {
      toast.error("Could not delete")
    }
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#a99e8c]" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#211c16]">{title}</h1>
          <p className="text-[#8a8074] mt-1">
            {counts.all} total · {counts.new} new · {counts.read} read · {counts.archived} archived
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-1 bg-[#faf6ee] border rounded-lg p-1">
          {(["all", "new", "read", "archived"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors capitalize",
                statusFilter === s ? "bg-white text-[#211c16] shadow-sm" : "text-[#8a8074] hover:text-[#211c16]",
              )}
            >
              {s} ({counts[s]})
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#a99e8c]" />
          <input
            type="search"
            placeholder="Search name, email, phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 border rounded-lg text-sm bg-white placeholder:text-[#a99e8c] focus:outline-none focus:ring-2 focus:ring-[#A08248]/10"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-[#faf6ee] rounded-lg border-2 border-dashed border-[#e7ddca]">
          <Mail className="h-12 w-12 mx-auto text-[#c9bfae] mb-4" />
          <h3 className="text-lg font-medium text-[#211c16] mb-2">{emptyTitle}</h3>
          {emptyDescription && (
            <p className="text-sm text-[#8a8074] max-w-sm mx-auto">{emptyDescription}</p>
          )}
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden bg-white">
          <table className="w-full text-sm">
            <thead className="bg-[#faf6ee] border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-[#8a8074] w-[100px]">Status</th>
                {columns.map((c) => (
                  <th key={c.key} className={cn("text-left px-4 py-3 font-medium text-[#8a8074]", c.className)}>
                    {c.label}
                  </th>
                ))}
                <th className="text-left px-4 py-3 font-medium text-[#8a8074] w-[160px]">Date</th>
                <th className="px-4 py-3 w-[120px]" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => {
                const status = row.status ?? "new"
                return (
                  <tr key={row._id} className="border-b last:border-b-0 hover:bg-[#A08248]/[0.06]/60 transition-colors">
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider border rounded",
                          STATUS_STYLES[status],
                        )}
                      >
                        {STATUS_LABEL[status]}
                      </span>
                    </td>
                    {columns.map((c) => (
                      <td key={c.key} className={cn("px-4 py-3", c.className)}>
                        {c.copyable ? (
                          <button
                            onClick={() => {
                              const v = (row as Record<string, unknown>)[c.key]
                              if (v) copy(v.toString())
                            }}
                            className="flex items-center gap-1.5 text-[#4a443c] hover:text-[#211c16] group"
                          >
                            {c.render ? c.render(row) : ((row as Record<string, unknown>)[c.key] as React.ReactNode)}
                            <Copy className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        ) : c.render ? (
                          c.render(row)
                        ) : (
                          ((row as Record<string, unknown>)[c.key] as React.ReactNode) ?? (
                            <span className="text-[#a99e8c]">—</span>
                          )
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-[#8a8074] whitespace-nowrap">{formatDate(row.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setSelected(row)
                            if (status === "new") void handleSetStatus(row._id, "read")
                          }}
                          className="size-8 rounded-md hover:bg-[#A08248]/[0.09] flex items-center justify-center text-[#8a8074] hover:text-[#211c16]"
                          aria-label="View"
                        >
                          <Eye className="size-4" />
                        </button>
                        <Select
                          value={status}
                          onValueChange={(v) => handleSetStatus(row._id, v as SubmissionStatus)}
                        >
                          <SelectTrigger
                            className="h-8 w-8 p-0 border-0 shadow-none bg-transparent hover:bg-[#A08248]/[0.09] rounded-md flex items-center justify-center [&>svg:last-child]:hidden focus:ring-0 focus-visible:ring-0"
                            aria-label="Change status"
                          >
                            <span className="flex items-center justify-center">
                              <Inbox className="size-4 text-[#8a8074]" />
                            </span>
                          </SelectTrigger>
                          <SelectContent align="end">
                            <SelectItem value="new">Mark New</SelectItem>
                            <SelectItem value="read">Mark Read</SelectItem>
                            <SelectItem value="archived">Archive</SelectItem>
                          </SelectContent>
                        </Select>
                        <button
                          type="button"
                          onClick={() => handleDelete(row._id)}
                          className="size-8 rounded-md hover:bg-red-50 flex items-center justify-center text-[#8a8074] hover:text-red-600"
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
      )}

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent showCloseButton={false} className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl">
              {selected ? (nameKey ? (selected[nameKey] as string) : selected.name ?? selected.fullName ?? "Submission") : "Submission"}
              {selected?.status && (
                <span className={cn("text-[10px] font-medium uppercase tracking-wider border rounded px-2 py-0.5", STATUS_STYLES[selected.status])}>
                  {STATUS_LABEL[selected.status]}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {(detailFields ?? columns).map((f) => {
                const value = (selected as Record<string, unknown>)[f.key]
                if (!value && value !== 0) return null
                return (
                  <div key={f.key} className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-[#8a8074]">{f.label}</span>
                    <div className="text-sm text-[#211c16] break-words whitespace-pre-wrap">
                      {f.render ? f.render(selected) : (value as React.ReactNode)}
                    </div>
                  </div>
                )
              })}
              <div className="flex flex-col gap-1 md:col-span-2">
                <span className="text-[11px] font-medium uppercase tracking-wider text-[#8a8074]">Received</span>
                <span className="text-sm text-[#211c16]">{formatDate(selected.createdAt)}</span>
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
                  Call <ArrowUpRight className="size-3 ml-0.5" />
                </a>
              </Button>
            )}
            {selected && (selected.status ?? "new") !== "archived" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSetStatus(selected._id, "archived")}
              >
                <Archive className="size-4 mr-1" /> Archive
              </Button>
            )}
            {selected && (
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700"
                onClick={() => handleDelete(selected._id)}
              >
                <Trash2 className="size-4 mr-1" /> Delete
              </Button>
            )}
            <DialogClose asChild>
              <Button
                size="sm"
                className="ml-auto bg-[#221c15] text-white hover:bg-[#3a3026]"
              >
                Close
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
