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
  Loader2,
  Search,
  Trash2,
  XCircle,
  Inbox,
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

type ApplicationStatus = "submitted" | "reviewing" | "approved" | "rejected"

const STATUS_FILTERS: Array<{ value: "all" | ApplicationStatus; label: string }> = [
  { value: "all", label: "All" },
  { value: "submitted", label: "Submitted" },
  { value: "reviewing", label: "Reviewing" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
]

const STATUS_BADGE: Record<ApplicationStatus, string> = {
  submitted: "bg-[#fef3c7] text-[#92400e] border-[#fde68a]",
  reviewing: "bg-muted text-muted-foreground border-border",
  approved: "bg-[#dcfce7] text-[#166534] border-[#bbf7d0]",
  rejected: "bg-[#fee2e2] text-[#991b1b] border-[#fecaca]",
}

const STATUS_LABEL: Record<ApplicationStatus, string> = {
  submitted: "Submitted",
  reviewing: "Reviewing",
  approved: "Approved",
  rejected: "Rejected",
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function AdminPartnerApplicationsPage() {
  const applications = useQuery(api.partnerApplications.list)
  const setStatus = useMutation(api.partnerApplications.setStatus)
  const remove = useMutation(api.partnerApplications.remove)

  const [filter, setFilter] = useState<"all" | ApplicationStatus>("all")
  const [search, setSearch] = useState("")
  const [activeId, setActiveId] = useState<Id<"partnerApplications"> | null>(null)
  const [page, setPage] = useState(0)

  useEffect(() => {
    setPage(0)
  }, [filter, search])

  const filtered = useMemo(() => {
    if (!applications) return undefined
    const q = search.trim().toLowerCase()
    return applications.filter((a) => {
      if (filter !== "all" && a.status !== filter) return false
      if (!q) return true
      return [
        a.companyName,
        a.representativeFullName,
        a.representativeEmail,
        a.representativePhone,
      ]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q))
    })
  }, [applications, filter, search])

  const counts = useMemo(() => {
    const acc: Record<ApplicationStatus | "all", number> = {
      all: 0,
      submitted: 0,
      reviewing: 0,
      approved: 0,
      rejected: 0,
    }
    for (const a of applications ?? []) {
      acc.all++
      acc[a.status as ApplicationStatus]++
    }
    return acc
  }, [applications])

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
          <h1 className="text-2xl font-semibold text-foreground">Partner Applications</h1>
          <p className="text-sm text-muted-foreground">
            Review companies that have submitted the partnership application form.
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
              <span className={cn(
                "ml-2 text-xs",
                filter === f.value ? "text-primary-foreground/70" : "text-muted-foreground",
              )}>
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
            placeholder="Search company, name, email…"
            className="h-9 w-[280px] pl-9 pr-3 text-sm border border-border rounded-md focus:outline-none focus:border-ring"
          />
        </div>
      </div>

      {applications === undefined ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="size-6 animate-spin" />
        </div>
      ) : filtered && filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground gap-2">
          <Inbox className="size-8" />
          <p className="text-sm">No applications match these filters yet.</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="text-left font-medium px-4 py-3">Company</th>
                <th className="text-left font-medium px-4 py-3">Representative</th>
                <th className="text-left font-medium px-4 py-3">Email</th>
                <th className="text-left font-medium px-4 py-3">Submitted</th>
                <th className="text-left font-medium px-4 py-3">#</th>
                <th className="text-left font-medium px-4 py-3">Status</th>
                <th className="text-right font-medium px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pageRows?.map((a) => {
                const status = a.status as ApplicationStatus
                return (
                  <tr key={a._id} className="hover:bg-accent">
                    <td className="px-4 py-3 font-medium text-foreground">
                      {a.companyName || <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {a.representativeFullName}
                    </td>
                    <td className="px-4 py-3 text-foreground">{a.representativeEmail}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(a.createdAt)}</td>
                    <td className="px-4 py-3 text-foreground font-medium">
                      #{a.queuePosition}
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
                          onClick={() => setActiveId(a._id)}
                          className="h-8 px-2"
                        >
                          <Eye className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (confirm("Delete this application? This cannot be undone."))
                              void remove({ id: a._id })
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

      {applications !== undefined && total > 0 && (
        <div className="flex shrink-0 items-center justify-between gap-2 px-1 text-sm text-muted-foreground">
          <span className="tabular-nums">{rangeStart}–{rangeEnd} of {total}</span>
          <div className="flex items-center gap-2">
            <span className="tabular-nums">Page {safePage + 1} of {pageCount}</span>
            <Button variant="outline" size="icon" className="size-8" disabled={safePage <= 0} onClick={() => setPage((p) => Math.max(0, p - 1))} aria-label="Previous page"><ChevronLeft className="size-4" /></Button>
            <Button variant="outline" size="icon" className="size-8" disabled={safePage >= pageCount - 1} onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))} aria-label="Next page"><ChevronRight className="size-4" /></Button>
          </div>
        </div>
      )}

      <ApplicationDetailDialog
        id={activeId}
        onOpenChange={(open) => {
          if (!open) setActiveId(null)
        }}
        onSetStatus={(id, status) => setStatus({ id, status })}
      />
    </div>
  )
}

function ApplicationDetailDialog({
  id,
  onOpenChange,
  onSetStatus,
}: {
  id: Id<"partnerApplications"> | null
  onOpenChange: (open: boolean) => void
  onSetStatus: (id: Id<"partnerApplications">, status: ApplicationStatus) => Promise<unknown>
}) {
  const application = useQuery(
    api.partnerApplications.get,
    id ? { id } : "skip",
  )

  return (
    <Dialog open={id !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {application?.companyName || "Partner application"}
          </DialogTitle>
        </DialogHeader>

        {!application ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="size-6 animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>#{application.queuePosition}</span>
                <span>·</span>
                <span>{formatDate(application.createdAt)}</span>
              </div>
              <StatusActions
                current={application.status as ApplicationStatus}
                onSetStatus={(status) => onSetStatus(application._id, status)}
              />
            </div>

            <Section title="Company">
              <Field label="Operating zones">
                {application.operatingZones.length === 0
                  ? "—"
                  : application.operatingZones.join(", ")}
              </Field>
              <Field label="Driver count range">{application.driverCount}</Field>
              <Field label="Drivers comfortable with mobile app">
                {application.driversComfortableWithMobile}
              </Field>
            </Section>

            <Section title="Representative">
              <Field label="Full name">{application.representativeFullName}</Field>
              <Field label="Email" copyable>
                {application.representativeEmail}
              </Field>
              <Field label="Phone" copyable>
                {application.representativePhone}
              </Field>
              <Field label="WhatsApp" copyable>
                {application.representativeWhatsapp}
              </Field>
            </Section>

            <Section title={`Drivers (${application.drivers.length})`}>
              {application.drivers.length === 0 ? (
                <p className="text-sm text-muted-foreground">No drivers added.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {application.drivers.map((d, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 border border-border rounded px-3 py-2 text-sm"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {d.fullName}
                        </p>
                        <p className="text-muted-foreground truncate">
                          {d.email} · {d.phone}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {d.hasVideo ? "video uploaded" : "no video"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            <Section title={`Vehicles (${application.vehicles.length})`}>
              {application.vehicles.length === 0 ? (
                <p className="text-sm text-muted-foreground">No vehicles added.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {application.vehicles.map((v, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 border border-border rounded px-3 py-2 text-sm"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {[v.make, v.model].filter(Boolean).join(" ") || "—"}
                        </p>
                        <p className="text-muted-foreground truncate">
                          {[v.category, v.licensePlate].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            <Section title="Documents">
              <FileLink label="Operating license / TVDE" url={application.fileUrls.documentLicenseId} />
              <FileLink
                label="Address proof (primary)"
                url={application.fileUrls.documentAddressProofPrimaryId}
              />
              <FileLink
                label="Address proof (secondary)"
                url={application.fileUrls.documentAddressProofSecondaryId}
              />
              <FileLink
                label="Liability insurance"
                url={application.fileUrls.documentLiabilityInsuranceId}
              />
            </Section>

            <Section title="Billing">
              <Field label="Account holder">{application.billingAccountHolder}</Field>
              <Field label="Invoice name">{application.billingInvoiceName}</Field>
              <Field label="SWIFT/BIC">{application.billingSwiftBic}</Field>
              <Field label="IBAN" copyable>
                {application.billingIban}
              </Field>
              <Field label="Tax ID (NIF/NIPC)">{application.billingTaxId}</Field>
              <Field label="Tax office">{application.billingTaxOffice}</Field>
              <Field label="Billing address">{application.billingAddress}</Field>
              <FileLink label="Bank proof" url={application.fileUrls.billingBankProofId} />
            </Section>

            <Section title="Consents">
              <Field label="Price agreement acknowledged">
                {application.priceAgreementAcknowledged ? "Yes" : "No"}
              </Field>
              <Field label="Terms accepted">
                {application.termsAccepted ? "Yes" : "No"}
              </Field>
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
  current: ApplicationStatus
  onSetStatus: (status: ApplicationStatus) => Promise<unknown>
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

function FileLink({ label, url }: { label: string; url: string | null | undefined }) {
  return (
    <div className="grid grid-cols-[200px_1fr] gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground hover:text-foreground/80 underline truncate"
        >
          Open file
        </a>
      ) : (
        <span className="text-muted-foreground">Not uploaded</span>
      )}
    </div>
  )
}
