"use client"

import * as React from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@workspace/convex/api"
import { Building2, Mail, Phone, MapPin, Trash2, MoreHorizontal, Users } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { StatusBadge } from "@/components/admin/status-badge"
import { DataTable, type DataTableColumn, type DataTableFilter } from "@/components/admin/data-table"

const STATUS_CONFIG = {
  new: { label: "New" },
  contacted: { label: "Contacted" },
  qualified: { label: "Qualified" },
  archived: { label: "Archived" },
} as const

type Status = keyof typeof STATUS_CONFIG

export default function PartnerLeadsPage() {
  const leads = useQuery(api.partnerLeads.list)
  const setStatus = useMutation(api.partnerLeads.setStatus)
  const remove = useMutation(api.partnerLeads.remove)

  type Lead = NonNullable<typeof leads>[number]

  const rowActions = (lead: Lead) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          onClick={() => remove({ id: lead._id })}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 size-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  const columns: DataTableColumn<Lead>[] = [
    {
      id: "contact",
      header: "Contact",
      sortAccessor: (r) => r.fullName.toLowerCase(),
      cell: (r) => (
        <div className="min-w-0">
          <div className="font-medium text-foreground">{r.fullName}</div>
          <div className="mt-0.5 flex flex-col gap-0.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Mail className="size-3" />
              {r.email}
            </span>
            <span className="flex items-center gap-1">
              <Phone className="size-3" />
              {r.phone}
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "company",
      header: "Company",
      sortAccessor: (r) => r.companyName.toLowerCase(),
      cell: (r) => (
        <span className="flex items-center gap-1.5 text-foreground">
          <Building2 className="size-3.5 text-muted-foreground" />
          {r.companyName}
        </span>
      ),
    },
    {
      id: "type",
      header: "Type · Volume",
      cell: (r) => (
        <div className="text-foreground">
          <div>{r.partnerType}</div>
          <div className="text-xs text-muted-foreground">{r.estimatedMonthlyVolume}</div>
        </div>
      ),
    },
    {
      id: "city",
      header: "City",
      sortAccessor: (r) => r.city.toLowerCase(),
      cell: (r) => (
        <span className="flex items-center gap-1 text-foreground">
          <MapPin className="size-3.5 text-muted-foreground" />
          {r.city}
        </span>
      ),
    },
    {
      id: "source",
      header: "Source",
      cell: (r) => <span className="text-xs text-muted-foreground">{r.howDidYouHear}</span>,
    },
    {
      id: "status",
      header: "Status",
      cell: (r) => (
        <Select
          value={r.status}
          onValueChange={(value) => setStatus({ id: r._id, status: value as Status })}
        >
          <SelectTrigger className="h-8 w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => (
              <SelectItem key={k} value={k}>
                {v.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
  ]

  const filters: DataTableFilter<Lead>[] = [
    {
      id: "status",
      label: "All statuses",
      width: "w-[150px]",
      options: Object.entries(STATUS_CONFIG).map(([k, v]) => ({ value: k, label: v.label })),
      predicate: (r, val) => r.status === val,
    },
  ]

  const renderCard = (lead: Lead) => (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-medium text-foreground">{lead.fullName}</div>
          <span className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Building2 className="size-3.5" />
            {lead.companyName}
          </span>
        </div>
        <StatusBadge
          status={lead.status}
          label={STATUS_CONFIG[lead.status as Status]?.label ?? lead.status}
        />
      </div>
      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Mail className="size-3" />
          {lead.email}
        </span>
        <span className="flex items-center gap-1.5">
          <Phone className="size-3" />
          {lead.phone}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin className="size-3" />
          {lead.city}
        </span>
      </div>
      <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-3">
        <div className="min-w-0 text-xs text-muted-foreground">
          <span className="text-foreground">{lead.partnerType}</span> · {lead.estimatedMonthlyVolume}
        </div>
        {rowActions(lead)}
      </div>
    </div>
  )

  return (
    <DataTable<Lead>
      data={leads}
      columns={columns}
      searchKeys={["fullName", "email", "companyName", "city"]}
      searchPlaceholder="Pesquisar por nome, empresa, email, cidade…"
      filters={filters}
      renderCard={renderCard}
      rowActions={rowActions}
      emptyTitle="No leads yet."
      emptyDescription="Candidaturas de parceria submetidas na página Hotéis aparecem aqui."
      emptyIcon={Users}
    />
  )
}
