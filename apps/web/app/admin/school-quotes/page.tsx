"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "@workspace/convex/api"
import { SubmissionsTable } from "@/components/admin/submissions-table"
import type { Id } from "@workspace/convex/dataModel"

function formatDateTime(iso: string | undefined) {
  if (!iso) return null
  const d = new Date(iso)
  if (!Number.isFinite(d.getTime())) return iso
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function AdminSchoolQuotesPage() {
  const submissions = useQuery(api.schoolQuoteSubmissions.list)
  const setStatus = useMutation(api.schoolQuoteSubmissions.setStatus)
  const remove = useMutation(api.schoolQuoteSubmissions.remove)

  return (
    <SubmissionsTable
      title="School Quote Requests"
      emptyTitle="No school quotes yet"
      emptyDescription="Quote requests from the schools page will appear here."
      data={submissions}
      nameKey="name"
      searchKeys={["name", "email", "phone", "route", "pickup", "dropoff", "message"]}
      onSetStatus={(id, status) =>
        setStatus({ id: id as Id<"schoolQuoteSubmissions">, status })
      }
      onDelete={(id) => remove({ id: id as Id<"schoolQuoteSubmissions"> })}
      columns={[
        { key: "name", label: "Name" },
        { key: "email", label: "Email", copyable: true },
        { key: "phone", label: "Phone", copyable: true },
        {
          key: "children",
          label: "Children",
          render: (r) => r.children ?? <span className="text-zinc-400">—</span>,
        },
        {
          key: "budget",
          label: "Budget",
          render: (r) =>
            typeof r.budget === "number" ? (
              `€${r.budget.toLocaleString("en-US")}`
            ) : (
              <span className="text-zinc-400">—</span>
            ),
        },
        {
          key: "route",
          label: "Route",
          render: (r) => r.route || <span className="text-zinc-400">—</span>,
        },
        {
          key: "vehicle",
          label: "Vehicle",
          render: (r) =>
            r.vehicle ? <span className="capitalize">{r.vehicle}</span> : <span className="text-zinc-400">—</span>,
        },
      ]}
      detailFields={[
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "children", label: "Children" },
        {
          key: "budget",
          label: "Budget",
          render: (r) =>
            typeof r.budget === "number" ? `€${r.budget.toLocaleString("en-US")}` : null,
        },
        { key: "route", label: "Route" },
        {
          key: "departureTime",
          label: "Departure",
          render: (r) => formatDateTime(r.departureTime),
        },
        { key: "pickup", label: "Pickup" },
        { key: "dropoff", label: "Dropoff" },
        {
          key: "vehicle",
          label: "Vehicle",
          render: (r) => (r.vehicle ? <span className="capitalize">{r.vehicle}</span> : null),
        },
        { key: "message", label: "Message" },
      ]}
    />
  )
}
