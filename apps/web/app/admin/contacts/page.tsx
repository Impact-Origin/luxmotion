"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "@workspace/convex/api"
import { SubmissionsTable } from "@/components/admin/submissions-table"
import type { Id } from "@workspace/convex/dataModel"

export default function AdminContactsPage() {
  const submissions = useQuery(api.contactSubmissions.list)
  const setStatus = useMutation(api.contactSubmissions.setStatus)
  const remove = useMutation(api.contactSubmissions.remove)

  return (
    <SubmissionsTable
      title="Contact Submissions"
      emptyTitle="No contact submissions yet"
      emptyDescription="Messages from the general contact form will appear here."
      data={submissions}
      nameKey="name"
      searchKeys={["name", "email", "phone", "message"]}
      onSetStatus={(id, status) =>
        setStatus({ id: id as Id<"contactSubmissions">, status })
      }
      onDelete={(id) => remove({ id: id as Id<"contactSubmissions"> })}
      columns={[
        { key: "name", label: "Name" },
        { key: "email", label: "Email", copyable: true },
        {
          key: "phone",
          label: "Phone",
          copyable: true,
          render: (r) =>
            r.phone ? r.phone : <span className="text-zinc-400">—</span>,
        },
        {
          key: "message",
          label: "Message",
          className: "max-w-[320px]",
          render: (r) => (
            <span className="line-clamp-1 text-zinc-600">{r.message}</span>
          ),
        },
      ]}
      detailFields={[
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "message", label: "Message" },
      ]}
    />
  )
}
