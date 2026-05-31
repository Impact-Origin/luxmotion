"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "@workspace/convex/api"
import { SubmissionsTable } from "@/components/admin/submissions-table"
import type { Id } from "@workspace/convex/dataModel"

const fmtBudget = (r: { budgetMin?: number; budgetMax?: number }) =>
  r.budgetMin != null && r.budgetMax != null
    ? `€${r.budgetMin.toLocaleString("de-DE")} – €${r.budgetMax.toLocaleString("de-DE")}`
    : "—"

export default function AdminTourInquiriesPage() {
  const inquiries = useQuery(api.tourInquiries.list)
  const setStatus = useMutation(api.tourInquiries.setStatus)
  const remove = useMutation(api.tourInquiries.remove)

  return (
    <SubmissionsTable
      title="Ultra-Luxury Inquiries"
      emptyTitle="No inquiries yet"
      emptyDescription="Inquiries from the ultra-luxury tour pages will appear here."
      data={inquiries}
      nameKey="name"
      searchKeys={["name", "email", "phone", "tourTitle", "interests", "country"]}
      onSetStatus={(id, status) => setStatus({ id: id as Id<"tourInquiries">, status })}
      onDelete={(id) => remove({ id: id as Id<"tourInquiries"> })}
      columns={[
        { key: "name", label: "Name" },
        { key: "email", label: "Email", copyable: true },
        { key: "phone", label: "Phone", copyable: true },
        {
          key: "tourTitle",
          label: "Tour",
          className: "max-w-[220px]",
          render: (r) => <span className="line-clamp-1 text-zinc-600">{r.tourTitle || "—"}</span>,
        },
        { key: "people", label: "People", render: (r) => r.people || "—" },
        { key: "budget", label: "Budget", render: (r) => fmtBudget(r) },
      ]}
      detailFields={[
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "country", label: "Country" },
        { key: "tourTitle", label: "Tour" },
        { key: "date", label: "Preferred date" },
        { key: "datesFlexible", label: "Dates flexible", render: (r) => (r.datesFlexible ? "Yes" : "No") },
        { key: "people", label: "People" },
        { key: "ageRange", label: "Age range" },
        { key: "budget", label: "Budget per person", render: (r) => fmtBudget(r) },
        { key: "interests", label: "Interests" },
        { key: "marketingOptIn", label: "Marketing opt-in", render: (r) => (r.marketingOptIn ? "Yes" : "No") },
      ]}
    />
  )
}
