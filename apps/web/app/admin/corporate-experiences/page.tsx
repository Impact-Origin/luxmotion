"use client"

import { useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@workspace/convex/api"
import type { Id } from "@workspace/convex/dataModel"
import {
  CheckCircle2,
  EyeOff,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
  Inbox,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { CorporateExperienceForm } from "@/components/admin/corporate-experience-form"
import { StatusBadge } from "@/components/admin/status-badge"
import { DataTable, type DataTableColumn, type DataTableFilter } from "@/components/admin/data-table"

type Status = "draft" | "published"
type Pillar = "standard" | "experiences" | "logistics"

const PILLAR_LABELS: Record<Pillar, string> = {
  standard: "Events & MICE",
  experiences: "Experiences & Teambuilding",
  logistics: "Logistics & Concierge",
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default function AdminCorporateExperiencesPage() {
  const experiences = useQuery(api.corporateExperiences.list)
  const setStatus = useMutation(api.corporateExperiences.setStatus)
  const remove = useMutation(api.corporateExperiences.remove)

  type ExperienceRow = NonNullable<typeof experiences>[number]

  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<Id<"corporateExperiences"> | null>(null)

  const editingExperience =
    (editingId && experiences?.find((e) => e._id === editingId)) || null

  const openCreate = () => {
    setEditingId(null)
    setFormOpen(true)
  }

  const openEdit = (id: Id<"corporateExperiences">) => {
    setEditingId(id)
    setFormOpen(true)
  }

  const rowActions = (e: ExperienceRow) => {
    const status = e.status as Status
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => openEdit(e._id)}>
            <Pencil className="mr-2 size-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              setStatus({
                id: e._id,
                status: status === "published" ? "draft" : "published",
              })
            }
          >
            {status === "published" ? (
              <>
                <EyeOff className="mr-2 size-4" />
                Unpublish
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 size-4" />
                Publish
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              if (confirm("Delete this experience? This cannot be undone."))
                void remove({ id: e._id })
            }}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  const columns: DataTableColumn<ExperienceRow>[] = [
    {
      id: "title",
      header: "Title",
      sortAccessor: (e) => `${e.titlePrefix} ${e.titleAccent}`.toLowerCase(),
      cell: (e) => (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
            {e.coverImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={e.coverImageUrl} alt="" className="h-full w-full object-cover" />
            ) : null}
          </div>
          <div className="min-w-0">
            <div className="font-medium text-foreground">
              {e.titlePrefix} <span className="italic text-muted-foreground">{e.titleAccent}</span>
            </div>
            <div className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
              {e.shortDescription}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "pillar",
      header: "Pillar",
      sortAccessor: (e) => e.pillar,
      cell: (e) => (
        <div className="text-sm">
          <span className="capitalize text-foreground">{e.pillar}</span>
          <div className="text-xs text-muted-foreground">{e.subcategory}</div>
        </div>
      ),
    },
    {
      id: "duration",
      header: "Duration",
      cell: (e) => <span className="text-sm text-muted-foreground">{e.durationLabel}</span>,
    },
    {
      id: "location",
      header: "Location",
      cell: (e) => <span className="text-sm text-muted-foreground">{e.location}</span>,
    },
    {
      id: "sortOrder",
      header: "Sort",
      align: "right",
      sortAccessor: (e) => e.sortOrder,
      cell: (e) => <span className="tabular-nums text-muted-foreground">{e.sortOrder}</span>,
    },
    {
      id: "updated",
      header: "Updated",
      sortAccessor: (e) => e.updatedAt,
      cell: (e) => <span className="text-sm text-muted-foreground">{formatDate(e.updatedAt)}</span>,
    },
    {
      id: "status",
      header: "Status",
      cell: (e) => <StatusBadge status={e.status} />,
    },
  ]

  const filters: DataTableFilter<ExperienceRow>[] = [
    {
      id: "status",
      label: "All status",
      width: "w-[140px]",
      options: [
        { value: "published", label: "Published" },
        { value: "draft", label: "Draft" },
      ],
      predicate: (e, val) => e.status === val,
    },
    {
      id: "pillar",
      label: "All pillars",
      width: "w-[220px]",
      options: [
        { value: "standard", label: PILLAR_LABELS.standard },
        { value: "experiences", label: PILLAR_LABELS.experiences },
        { value: "logistics", label: PILLAR_LABELS.logistics },
      ],
      predicate: (e, val) => e.pillar === val,
    },
  ]

  const renderCard = (e: ExperienceRow) => (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="relative aspect-[16/9] border-b border-border bg-muted/40">
        {e.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={e.coverImageUrl} alt="" className="h-full w-full object-cover" />
        ) : null}
        <div className="absolute left-2 top-2">
          <StatusBadge status={e.status} />
        </div>
        <div className="absolute right-2 top-2">{rowActions(e)}</div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="font-medium text-foreground">
          {e.titlePrefix} <span className="italic text-muted-foreground">{e.titleAccent}</span>
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">{e.shortDescription}</p>
        <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
          <span className="capitalize">{e.pillar}</span>
          <span>{e.durationLabel}</span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col gap-6 p-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Corporate Experiences</h1>
          <p className="text-sm text-muted-foreground">
            Curated experiences shown on the /corporate/experiences page.
          </p>
        </div>
      </header>

      {experiences && experiences.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <Inbox className="size-8 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">No experiences yet</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Create your first curated experience to show on the page.
          </p>
          <Button onClick={openCreate} className="mt-2">
            <Plus className="mr-2 size-4" /> New experience
          </Button>
        </div>
      ) : (
        <DataTable<ExperienceRow>
          data={experiences}
          columns={columns}
          searchKeys={[
            "titlePrefix",
            "titleAccent",
            "shortDescription",
            "location",
          ]}
          searchPlaceholder="Search title, description, location…"
          filters={filters}
          renderCard={renderCard}
          rowActions={rowActions}
          initialSort={{ columnId: "sortOrder", dir: "asc" }}
          toolbarActions={
            <Button onClick={openCreate}>
              <Plus className="mr-2 size-4" /> New experience
            </Button>
          }
          emptyTitle="No experiences found"
          emptyDescription="No experiences match these filters."
          emptyIcon={Inbox}
        />
      )}

      <CorporateExperienceForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setEditingId(null)
        }}
        initialData={editingExperience}
      />
    </div>
  )
}
