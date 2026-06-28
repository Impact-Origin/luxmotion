"use client"

import { useEffect, useMemo, useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@workspace/convex/api"
import type { Id } from "@workspace/convex/dataModel"
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  FileText,
  Inbox,
  Loader2,
  Search,
  Trash2,
  XCircle,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { cn } from "@workspace/ui/lib/utils"

type RequestStatus = "submitted" | "reviewing" | "approved" | "rejected"

const STATUS_FILTERS: Array<{ value: "all" | RequestStatus; label: string }> = [
  { value: "all", label: "All" },
  { value: "submitted", label: "Submitted" },
  { value: "reviewing", label: "Reviewing" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
]

const STATUS_BADGE: Record<RequestStatus, string> = {
  submitted: "bg-[#fef3c7] text-[#92400e] border-[#fde68a]",
  reviewing: "bg-muted text-muted-foreground border-border",
  approved: "bg-[#dcfce7] text-[#166534] border-[#bbf7d0]",
  rejected: "bg-[#fee2e2] text-[#991b1b] border-[#fecaca]",
}

const STATUS_LABEL: Record<RequestStatus, string> = {
  submitted: "Submitted",
  reviewing: "Reviewing",
  approved: "Approved",
  rejected: "Rejected",
}

function formatDateTime(ts: number) {
  return new Date(ts).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function formatBudget(b?: number) {
  if (b === undefined) return "—"
  return `€${b.toLocaleString("en-US")}`
}

export default function AdminCorporateRequestsPage() {
  const requests = useQuery(api.corporateRequests.list)
  const setStatus = useMutation(api.corporateRequests.setStatus)
  const remove = useMutation(api.corporateRequests.remove)

  const [filter, setFilter] = useState<"all" | RequestStatus>("all")
  const [search, setSearch] = useState("")
  const [activeId, setActiveId] = useState<Id<"corporateRequests"> | null>(null)
  const [page, setPage] = useState(0)

  useEffect(() => {
    setPage(0)
  }, [filter, search])

  const filtered = useMemo(() => {
    if (!requests) return undefined
    const q = search.trim().toLowerCase()
    return requests.filter((r) => {
      if (filter !== "all" && r.status !== filter) return false
      if (!q) return true
      return [r.fullName, r.email, r.phone, r.companyName]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q))
    })
  }, [requests, filter, search])

  const counts = useMemo(() => {
    const acc: Record<RequestStatus | "all", number> = {
      all: 0,
      submitted: 0,
      reviewing: 0,
      approved: 0,
      rejected: 0,
    }
    for (const r of requests ?? []) {
      acc.all++
      acc[r.status as RequestStatus]++
    }
    return acc
  }, [requests])

  const pageSize = 10
  const total = filtered?.length ?? 0
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(page, pageCount - 1)
  const rangeStart = total === 0 ? 0 : safePage * pageSize + 1
  const rangeEnd = Math.min((safePage + 1) * pageSize, total)
  const pageRows = filtered?.slice(safePage * pageSize, safePage * pageSize + pageSize)

  return (
    <div className="flex flex-col gap-6 p-6">
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Corporate Requests</h1>
          <p className="text-sm text-muted-foreground">
            Proposal requests submitted from the corporate landing page.
          </p>
        </div>
      </header>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={cn(
                "h-9 px-3 text-sm border rounded-md transition-colors",
                filter === f.value
                  ? "bg-primary border-primary text-primary-foreground"
                  : "bg-card border-border text-foreground hover:bg-accent",
              )}
            >
              {f.label}
              <span
                className={cn(
                  "ml-2 text-xs",
                  filter === f.value ? "text-primary-foreground/70" : "text-muted-foreground",
                )}
              >
                {counts[f.value]}
              </span>
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, phone, company…"
            className="h-9 w-[280px] pl-9 pr-3 text-sm border border-border rounded-md focus:outline-none focus:border-ring"
          />
        </div>
      </div>

      {requests === undefined ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="size-6 animate-spin" />
        </div>
      ) : filtered && filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground gap-2">
          <Inbox className="size-8" />
          <p className="text-sm">No requests match these filters yet.</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="text-left font-medium px-4 py-3">Contact</th>
                <th className="text-left font-medium px-4 py-3">Company</th>
                <th className="text-left font-medium px-4 py-3">Email</th>
                <th className="text-left font-medium px-4 py-3">Phone</th>
                <th className="text-left font-medium px-4 py-3">Event date</th>
                <th className="text-left font-medium px-4 py-3">Guests</th>
                <th className="text-left font-medium px-4 py-3">Budget</th>
                <th className="text-left font-medium px-4 py-3">Submitted</th>
                <th className="text-left font-medium px-4 py-3">#</th>
                <th className="text-left font-medium px-4 py-3">Status</th>
                <th className="text-right font-medium px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pageRows?.map((r) => {
                const status = r.status as RequestStatus
                return (
                  <tr key={r._id} className="hover:bg-accent">
                    <td className="px-4 py-3 font-medium text-foreground">
                      {r.fullName || <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="px-4 py-3 text-foreground">{r.companyName}</td>
                    <td className="px-4 py-3 text-foreground">{r.email}</td>
                    <td className="px-4 py-3 text-foreground">{r.phone}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {r.eventDate ? formatDate(r.eventDate) : "—"}
                    </td>
                    <td className="px-4 py-3 text-foreground">{r.guests ?? "—"}</td>
                    <td className="px-4 py-3 text-foreground">{formatBudget(r.budget)}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDateTime(r.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-foreground font-medium">
                      #{r.queuePosition}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2 h-6 text-[11px] uppercase tracking-wider border rounded-full",
                          STATUS_BADGE[status],
                        )}
                      >
                        {STATUS_LABEL[status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setActiveId(r._id)}
                          className="h-8 px-2"
                        >
                          <Eye className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (confirm("Delete this request? This cannot be undone."))
                              void remove({ id: r._id })
                          }}
                          className="h-8 px-2 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {requests !== undefined && total > 0 && (
        <div className="flex shrink-0 items-center justify-between gap-2 px-1 text-sm text-muted-foreground">
          <span className="tabular-nums">{rangeStart}–{rangeEnd} of {total}</span>
          <div className="flex items-center gap-2">
            <span className="tabular-nums">Page {safePage + 1} of {pageCount}</span>
            <Button variant="outline" size="icon" className="size-8" disabled={safePage <= 0} onClick={() => setPage((p) => Math.max(0, p - 1))} aria-label="Previous page"><ChevronLeft className="size-4" /></Button>
            <Button variant="outline" size="icon" className="size-8" disabled={safePage >= pageCount - 1} onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))} aria-label="Next page"><ChevronRight className="size-4" /></Button>
          </div>
        </div>
      )}

      <RequestDetailDialog
        id={activeId}
        onOpenChange={(open) => {
          if (!open) setActiveId(null)
        }}
        onSetStatus={(id, status) => setStatus({ id, status })}
      />
    </div>
  )
}

function RequestDetailDialog({
  id,
  onOpenChange,
  onSetStatus,
}: {
  id: Id<"corporateRequests"> | null
  onOpenChange: (open: boolean) => void
  onSetStatus: (
    id: Id<"corporateRequests">,
    status: RequestStatus,
  ) => Promise<unknown>
}) {
  const request = useQuery(api.corporateRequests.get, id ? { id } : "skip")

  return (
    <Dialog open={id !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{request?.fullName || "Corporate request"}</DialogTitle>
        </DialogHeader>

        {!request ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="size-6 animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>#{request.queuePosition}</span>
                <span>·</span>
                <span>{formatDateTime(request.createdAt)}</span>
              </div>
              <StatusActions
                current={request.status as RequestStatus}
                onSetStatus={(status) => onSetStatus(request._id, status)}
              />
            </div>

            <Section title="Contact">
              <Field label="Full name">{request.fullName}</Field>
              <Field label="Company">{request.companyName}</Field>
              <Field label="Email" copyable>
                {request.email}
              </Field>
              <Field label="Phone / WhatsApp" copyable>
                {request.phone}
              </Field>
            </Section>

            <Section title="Event">
              <Field label="Event date">
                {request.eventDate ? formatDate(request.eventDate) : "—"}
              </Field>
              <Field label="Guests">
                {request.guests !== undefined ? String(request.guests) : "—"}
              </Field>
              <Field label="Estimated budget">{formatBudget(request.budget)}</Field>
              <Field label="Preferred vehicle">{request.vehicleType ?? "—"}</Field>
            </Section>

            <Section title="Notes">
              <div className="text-sm text-foreground whitespace-pre-wrap">
                {request.notes || <span className="text-muted-foreground">No additional notes.</span>}
              </div>
            </Section>
          </div>
        )}

        <DialogClose asChild>
          <Button variant="outline" className="self-end">
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}

function StatusActions({
  current,
  onSetStatus,
}: {
  current: RequestStatus
  onSetStatus: (status: RequestStatus) => Promise<unknown>
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <StatusButton
        active={current === "reviewing"}
        onClick={() => onSetStatus("reviewing")}
        icon={<Clock className="size-3.5" />}
        label="Mark reviewing"
      />
      <StatusButton
        active={current === "approved"}
        onClick={() => onSetStatus("approved")}
        icon={<CheckCircle2 className="size-3.5" />}
        label="Approve"
        tone="success"
      />
      <StatusButton
        active={current === "rejected"}
        onClick={() => onSetStatus("rejected")}
        icon={<XCircle className="size-3.5" />}
        label="Reject"
        tone="danger"
      />
    </div>
  )
}

function StatusButton({
  active,
  onClick,
  icon,
  label,
  tone = "neutral",
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
  tone?: "neutral" | "success" | "danger"
}) {
  const TONES: Record<typeof tone, { active: string; idle: string }> = {
    neutral: {
      active: "bg-primary border-primary text-primary-foreground",
      idle: "bg-card border-border text-foreground hover:bg-accent",
    },
    success: {
      active: "bg-emerald-600 border-emerald-600 text-white",
      idle: "bg-card border-border text-foreground hover:bg-emerald-50 hover:border-emerald-200",
    },
    danger: {
      active: "bg-rose-600 border-rose-600 text-white",
      idle: "bg-card border-border text-foreground hover:bg-rose-50 hover:border-rose-200",
    },
  }
  const t = TONES[tone]
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={active}
      className={cn(
        "inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium border rounded-md transition-colors",
        active ? t.active : t.idle,
      )}
    >
      {icon}
      {label}
    </button>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
        {title}
      </h3>
      <div className="flex flex-col gap-2">{children}</div>
    </section>
  )
}

function Field({
  label,
  children,
  copyable,
}: {
  label: string
  children: React.ReactNode
  copyable?: boolean
}) {
  const text = typeof children === "string" ? children : ""
  return (
    <div className="grid grid-cols-[200px_1fr] gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-foreground break-words">{children || "—"}</span>
        {copyable && text ? (
          <button
            type="button"
            onClick={() => void navigator.clipboard.writeText(text)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Copy"
          >
            <FileText className="size-3.5" />
          </button>
        ) : null}
      </div>
    </div>
  )
}
