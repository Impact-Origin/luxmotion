"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "@workspace/convex/api"
import { SubmissionsTable } from "@/components/admin/submissions-table"
import type { Id } from "@workspace/convex/dataModel"

export default function AdminWeddingQuotesPage() {
  const submissions = useQuery(api.weddingQuoteSubmissions.list)
  const setStatus = useMutation(api.weddingQuoteSubmissions.setStatus)
  const remove = useMutation(api.weddingQuoteSubmissions.remove)

  return (
    <SubmissionsTable
      title="Wedding Quote Requests"
      emptyTitle="No wedding quotes yet"
      emptyDescription="Quote requests from the wedding page will appear here."
      data={submissions}
      nameKey="fullName"
      searchKeys={["fullName", "email", "phone", "venue", "message"]}
      onSetStatus={(id, status) =>
        setStatus({ id: id as Id<"weddingQuoteSubmissions">, status })
      }
      onDelete={(id) => remove({ id: id as Id<"weddingQuoteSubmissions"> })}
      columns={[
        { key: "fullName", label: "Couple" },
        { key: "email", label: "Email", copyable: true },
        { key: "phone", label: "Phone", copyable: true },
        {
          key: "weddingDate",
          label: "Wedding date",
          render: (r) => r.weddingDate || <span className="text-zinc-400">—</span>,
        },
        {
          key: "guests",
          label: "Guests",
          render: (r) => r.guests ?? <span className="text-zinc-400">—</span>,
        },
        {
          key: "vehicle",
          label: "Vehicle",
          render: (r) =>
            r.vehicle ? (
              <span className="capitalize">{r.vehicle}</span>
            ) : (
              <span className="text-zinc-400">—</span>
            ),
        },
      ]}
      detailFields={[
        { key: "fullName", label: "Couple" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "weddingDate", label: "Wedding date" },
        { key: "guests", label: "Guests" },
        { key: "venue", label: "Venue" },
        { key: "pickup", label: "Pickup" },
        { key: "numVehicles", label: "Number of vehicles" },
        {
          key: "vehicle",
          label: "Vehicle preference",
          render: (r) => (r.vehicle ? <span className="capitalize">{r.vehicle}</span> : null),
        },
        { key: "message", label: "Notes" },
      ]}
    />
  )
}
