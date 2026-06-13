"use client"

import { useMemo, useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@workspace/convex/api"
import type { Id } from "@workspace/convex/dataModel"
import {
  CheckCircle2,
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
  submitted: "bg-amber-50 text-amber-800 border-amber-200",
  reviewing: "bg-sky-50 text-sky-800 border-sky-200",
  approved: "bg-emerald-50 text-emerald-800 border-emerald-200",
  rejected: "bg-rose-50 text-rose-800 border-rose-200",
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

  return (
    <div className="flex flex-col gap-6 p-6">
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-[#211c16]">Corporate Requests</h1>
          <p className="text-sm text-[#8a8074]">
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
                  ? "bg-[#221c15] border-[#221c15] text-white"
                  : "bg-white border-[#e7ddca] text-[#4a443c] hover:bg-[#A08248]/[0.06]",
              )}
            >
              {f.label}
              <span
                className={cn(
                  "ml-2 text-xs",
                  filter === f.value ? "text-[#c9bfae]" : "text-[#a99e8c]",
                )}
              >
                {counts[f.value]}
              </span>
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a99e8c]" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, phone, company…"
            className="h-9 w-[280px] pl-9 pr-3 text-sm border border-[#e7ddca] rounded-md focus:outline-none focus:border-[#A08248]"
          />
        </div>
      </div>

      {requests === undefined ? (
        <div className="flex items-center justify-center py-20 text-[#a99e8c]">
          <Loader2 className="size-6 animate-spin" />
        </div>
      ) : filtered && filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-[#a99e8c] gap-2">
          <Inbox className="size-8" />
          <p className="text-sm">No requests match these filters yet.</p>
        </div>
      ) : (
        <div className="bg-white border border-[#e7ddca] rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#faf6ee] text-[#8a8074]">
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
            <tbody className="divide-y divide-[#efe7d8]">
              {filtered?.map((r) => {
                const status = r.status as RequestStatus
                return (
                  <tr key={r._id} className="hover:bg-[#A08248]/[0.06]/60">
                    <td className="px-4 py-3 font-medium text-[#211c16]">
                      {r.fullName || <span className="text-[#a99e8c]">—</span>}
                    </td>
                    <td className="px-4 py-3 text-[#4a443c]">{r.companyName}</td>
                    <td className="px-4 py-3 text-[#4a443c]">{r.email}</td>
                    <td className="px-4 py-3 text-[#4a443c]">{r.phone}</td>
                    <td className="px-4 py-3 text-[#8a8074]">
                      {r.eventDate ? formatDate(r.eventDate) : "—"}
                    </td>
                    <td className="px-4 py-3 text-[#4a443c]">{r.guests ?? "—"}</td>
                    <td className="px-4 py-3 text-[#4a443c]">{formatBudget(r.budget)}</td>
                    <td className="px-4 py-3 text-[#8a8074]">
                      {formatDateTime(r.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-[#4a443c] font-medium">
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
                          className="h-8 px-2 text-rose-600 hover:text-rose-700"
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
          <div className="flex items-center justify-center py-16 text-[#a99e8c]">
            <Loader2 className="size-6 animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-sm text-[#8a8074]">
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
              <div className="text-sm text-[#211c16] whitespace-pre-wrap">
                {request.notes || <span className="text-[#a99e8c]">No additional notes.</span>}
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
      active: "bg-sky-600 border-sky-600 text-white",
      idle: "bg-white border-[#e7ddca] text-[#4a443c] hover:bg-sky-50 hover:border-sky-200",
    },
    success: {
      active: "bg-emerald-600 border-emerald-600 text-white",
      idle: "bg-white border-[#e7ddca] text-[#4a443c] hover:bg-emerald-50 hover:border-emerald-200",
    },
    danger: {
      active: "bg-rose-600 border-rose-600 text-white",
      idle: "bg-white border-[#e7ddca] text-[#4a443c] hover:bg-rose-50 hover:border-rose-200",
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
      <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8a8074] border-b border-[#e7ddca] pb-2">
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
      <span className="text-[#8a8074]">{label}</span>
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-[#211c16] break-words">{children || "—"}</span>
        {copyable && text ? (
          <button
            type="button"
            onClick={() => void navigator.clipboard.writeText(text)}
            className="text-[#a99e8c] hover:text-[#4a443c] transition-colors"
            aria-label="Copy"
          >
            <FileText className="size-3.5" />
          </button>
        ) : null}
      </div>
    </div>
  )
}
