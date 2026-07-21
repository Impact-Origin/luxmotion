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
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet"
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

export default function AdminDriverApplicationsPage() {
  const applications = useQuery(api.driverApplications.list)
  const setStatus = useMutation(api.driverApplications.setStatus)
  const remove = useMutation(api.driverApplications.remove)

  const [filter, setFilter] = useState<"all" | ApplicationStatus>("all")
  const [search, setSearch] = useState("")
  const [activeId, setActiveId] = useState<Id<"driverApplications"> | null>(null)
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
      return [a.fullName, a.email, a.phone, a.vehiclePlate, a.operatingZone]
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
    <div className="flex flex-col gap-6">
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
            placeholder="Search name, email, plate, zone…"
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
                <th className="text-left font-medium px-4 py-3">Driver</th>
                <th className="text-left font-medium px-4 py-3">Email</th>
                <th className="text-left font-medium px-4 py-3">Phone</th>
                <th className="text-left font-medium px-4 py-3">Zone</th>
                <th className="text-left font-medium px-4 py-3">Vehicle</th>
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
                      {a.fullName || <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="px-4 py-3 text-foreground">{a.email}</td>
                    <td className="px-4 py-3 text-foreground">{a.phone}</td>
                    <td className="px-4 py-3 text-foreground capitalize">
                      {a.operatingZone}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {[a.vehicleBrand, a.vehicleModel].filter(Boolean).join(" ") ||
                        "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(a.createdAt)}
                    </td>
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
                            if (
                              confirm(
                                "Delete this application? This cannot be undone.",
                              )
                            )
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

      <ApplicationDetailSheet
        id={activeId}
        onOpenChange={(open) => {
          if (!open) setActiveId(null)
        }}
        onSetStatus={(id, status) => setStatus({ id, status })}
      />
    </div>
  )
}

function ApplicationDetailSheet({
  id,
  onOpenChange,
  onSetStatus,
}: {
  id: Id<"driverApplications"> | null
  onOpenChange: (open: boolean) => void
  onSetStatus: (
    id: Id<"driverApplications">,
    status: ApplicationStatus,
  ) => Promise<unknown>
}) {
  const application = useQuery(
    api.driverApplications.get,
    id ? { id } : "skip",
  )

  return (
    <Sheet open={id !== null} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{application?.fullName || "Driver application"}</SheetTitle>
        </SheetHeader>

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

            <Section title="Operating zone">
              <Field label="Zone">
                <span className="capitalize">{application.operatingZone}</span>
              </Field>
            </Section>

            <Section title="Personal & contact">
              <Field label="Full name">{application.fullName}</Field>
              <Field label="Email" copyable>
                {application.email}
              </Field>
              <Field label="Representative email" copyable>
                {application.representativeEmail}
              </Field>
              <Field label="Phone" copyable>
                {application.phone}
              </Field>
              <Field label="WhatsApp" copyable>
                {application.whatsapp}
              </Field>
              <Field label="Referral">{application.referral}</Field>
              <Field label="Languages">
                {application.languages.length === 0
                  ? "—"
                  : application.languages
                      .map((l) => `${l.code} (${l.level})`)
                      .join(", ")}
              </Field>
            </Section>

            <Section title="Vehicle">
              <Field label="Category">{application.vehicleCategory}</Field>
              <Field label="Brand & model">
                {[application.vehicleBrand, application.vehicleModel]
                  .filter(Boolean)
                  .join(" ") || "—"}
              </Field>
              <Field label="License plate" copyable>
                {application.vehiclePlate}
              </Field>
              <Field label="Color">{application.vehicleColor}</Field>
              <Field label="Year">{application.vehicleYear}</Field>
              <Field label="Ownership">{application.vehicleOwnership}</Field>
              <Field label="Passenger capacity">
                {application.vehiclePassengerCapacity}
              </Field>
              <Field label="Luggage capacity">
                {application.vehicleLuggageCapacity}
              </Field>
              <Field label="TVDE licensed">{application.vehicleTvdeLicensed}</Field>
              <Field label="Surfboard rack">
                {application.surfboardRack ? "Yes" : "No"}
              </Field>
              <Field label="Child seats">
                {`Baby: ${application.childSeatBaby} · Child: ${application.childSeatChild} · Booster: ${application.childSeatBooster}`}
              </Field>
              <Field label="Amenities">
                {application.amenities.length === 0
                  ? "—"
                  : application.amenities.join(", ")}
              </Field>
            </Section>

            <Section title="Vehicle photos">
              <PhotoGallery
                label="Interior"
                urls={application.interiorPhotoUrls ?? []}
              />
              <PhotoGallery
                label="Exterior"
                urls={application.exteriorPhotoUrls ?? []}
              />
            </Section>

            <Section title="Driver documents">
              <FileLink
                label="Professional photo"
                url={application.fileUrls.professionalPhotoId}
              />
              <FileLink
                label="Professional license (TVDE)"
                url={application.fileUrls.professionalLicenseId}
              />
              <FileLink
                label="Vehicle insurance"
                url={application.fileUrls.vehicleInsuranceId}
              />
              <FileLink
                label="Proof of address"
                url={application.fileUrls.proofOfAddressId}
              />
            </Section>

            <Section title="Billing">
              <Field label="Account holder">
                {application.billingAccountHolder}
              </Field>
              <Field label="Invoice name">{application.billingInvoiceName}</Field>
              <Field label="SWIFT/BIC">{application.billingSwiftBic}</Field>
              <Field label="IBAN" copyable>
                {application.billingIban}
              </Field>
              <Field label="NIF">{application.billingNif}</Field>
              <Field label="Tax office">{application.billingTaxOffice}</Field>
              <Field label="Billing address">{application.billingAddress}</Field>
              <FileLink
                label="Bank proof"
                url={application.fileUrls.billingBankProofId}
              />
            </Section>

            <Section title="Availability">
              <Field label="Days">
                {application.availabilityDays.length === 0
                  ? "—"
                  : application.availabilityDays.join(", ")}
              </Field>
              <Field label="Shifts">
                {application.availabilityShifts.length === 0
                  ? "—"
                  : application.availabilityShifts.join(", ")}
              </Field>
            </Section>

            <Section title="Intro video">
              <FileLink
                label="Self-introduction video"
                url={application.fileUrls.introVideoId}
              />
            </Section>

            <Section title="Consents">
              <Field label="Terms accepted">
                {application.termsAccepted ? "Yes" : "No"}
              </Field>
            </Section>
          </div>
        )}

        <SheetClose asChild>
          <Button variant="outline" className="self-end">
            Close
          </Button>
        </SheetClose>
      </SheetContent>
    </Sheet>
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

function FileLink({
  label,
  url,
}: {
  label: string
  url: string | null | undefined
}) {
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

function PhotoGallery({
  label,
  urls,
}: {
  label: string
  urls: Array<string | null>
}) {
  const visible = urls.filter((u): u is string => Boolean(u))
  return (
    <div className="grid grid-cols-[200px_1fr] gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      {visible.length === 0 ? (
        <span className="text-muted-foreground">None uploaded</span>
      ) : (
        <div className="flex flex-wrap gap-2">
          {visible.map((u, i) => (
            <a
              key={i}
              href={u}
              target="_blank"
              rel="noopener noreferrer"
              className="block size-20 border border-border rounded overflow-hidden hover:border-ring transition-colors"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={u}
                alt={`${label} ${i + 1}`}
                className="size-full object-cover"
              />
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
