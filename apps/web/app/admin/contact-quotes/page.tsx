"use client"

import { useEffect, useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@workspace/convex/api"
import {
  Search,
  Mail,
  Phone,
  Building2,
  Calendar,
  X,
  Trash2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"

const STATUS_CONFIG = {
  new: { label: "New", color: "bg-muted text-muted-foreground" },
  inProgress: { label: "In Progress", color: "bg-[#fef3c7] text-[#92400e]" },
  resolved: { label: "Resolved", color: "bg-[#dcfce7] text-[#166534]" },
  archived: { label: "Archived", color: "bg-muted text-muted-foreground" },
} as const

type Status = keyof typeof STATUS_CONFIG

export default function ContactQuotesPage() {
  const requests = useQuery(api.contactQuotes.list)
  const setStatus = useMutation(api.contactQuotes.setStatus)
  const remove = useMutation(api.contactQuotes.remove)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [page, setPage] = useState(0)

  useEffect(() => {
    setPage(0)
  }, [search, statusFilter])

  const filtered = (requests ?? []).filter((r) => {
    const matchesSearch =
      search === "" ||
      r.fullName.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.company.toLowerCase().includes(search.toLowerCase()) ||
      r.subject.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || r.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const selected = filtered.find((r) => r._id === selectedId) ?? null

  const pageSize = 10
  const total = filtered.length
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(page, pageCount - 1)
  const rangeStart = total === 0 ? 0 : safePage * pageSize + 1
  const rangeEnd = Math.min((safePage + 1) * pageSize, total)
  const pageRows = filtered.slice(safePage * pageSize, safePage * pageSize + pageSize)

  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, email, company, or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Status | "all")}
              className="appearance-none pl-4 pr-10 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 bg-card"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="inProgress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="archived">Archived</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">
                  Name
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">
                  Company
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">
                  Parceiro
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">
                  Subject
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">
                  Status
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">
                  Date
                </th>
                <th className="w-10 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-muted-foreground text-sm">
                    No quote requests found
                  </td>
                </tr>
              ) : (
                pageRows.map((r) => (
                  <tr
                    key={r._id}
                    onClick={() => setSelectedId(r._id)}
                    className={`border-b border-border last:border-0 cursor-pointer transition-colors ${
                      selectedId === r._id ? "bg-muted" : "hover:bg-accent"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground text-sm">
                        {r.fullName}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                        {r.company}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-muted-foreground">
                        {r.partnershipName ?? "Easy Transfer"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-muted-foreground max-w-[260px] truncate">
                        {r.subject}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_CONFIG[r.status].color}`}
                      >
                        {STATUS_CONFIG[r.status].label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        {new Date(r.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (confirm("Delete this quote request?")) remove({ id: r._id })
                        }}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {total > 0 && (
          <div className="mt-4 flex shrink-0 items-center justify-between gap-2 px-1 text-sm text-muted-foreground">
            <span className="tabular-nums">{rangeStart}–{rangeEnd} of {total}</span>
            <div className="flex items-center gap-2">
              <span className="tabular-nums">Page {safePage + 1} of {pageCount}</span>
              <Button variant="outline" size="icon" className="size-8" disabled={safePage <= 0} onClick={() => setPage((p) => Math.max(0, p - 1))} aria-label="Previous page"><ChevronLeft className="size-4" /></Button>
              <Button variant="outline" size="icon" className="size-8" disabled={safePage >= pageCount - 1} onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))} aria-label="Next page"><ChevronRight className="size-4" /></Button>
            </div>
          </div>
        )}
      </div>

      {selected && (
        <div className="w-[400px] border-l border-border bg-card overflow-y-auto">
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  {selected.fullName}
                </h2>
                <p className="text-sm text-muted-foreground">{selected.company}</p>
              </div>
              <button
                onClick={() => setSelectedId(null)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Status
              </label>
              <div className="relative mt-2">
                <select
                  value={selected.status}
                  onChange={(e) =>
                    setStatus({ id: selected._id, status: e.target.value as Status })
                  }
                  className="appearance-none w-full pl-4 pr-10 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 bg-card"
                >
                  <option value="new">New</option>
                  <option value="inProgress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="archived">Archived</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${selected.email}`} className="hover:text-foreground">
                  {selected.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href={`tel:${selected.phone}`} className="hover:text-foreground">
                  {selected.phone}
                </a>
              </div>

              <div className="pt-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Subject
                </label>
                <p className="text-sm text-foreground mt-1">{selected.subject}</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Message
                </label>
                <p className="text-sm text-foreground mt-1 whitespace-pre-wrap leading-relaxed">
                  {selected.message}
                </p>
              </div>

              <div className="pt-2 text-xs text-muted-foreground">
                Submitted {new Date(selected.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
