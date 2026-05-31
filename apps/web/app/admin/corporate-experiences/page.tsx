"use client"

import { useMemo, useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@workspace/convex/api"
import type { Id } from "@workspace/convex/dataModel"
import {
  CheckCircle2,
  EyeOff,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  Inbox,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { CorporateExperienceForm } from "@/components/admin/corporate-experience-form"

type Status = "draft" | "published"
type Pillar = "standard" | "experiences" | "logistics"

const STATUS_FILTERS: Array<{ value: "all" | Status; label: string }> = [
  { value: "all", label: "All" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
]

const PILLAR_FILTERS: Array<{ value: "all" | Pillar; label: string }> = [
  { value: "all", label: "All pillars" },
  { value: "standard", label: "Events & MICE" },
  { value: "experiences", label: "Experiences & Teambuilding" },
  { value: "logistics", label: "Logistics & Concierge" },
]

const STATUS_BADGE: Record<Status, string> = {
  draft: "bg-amber-50 text-amber-800 border-amber-200",
  published: "bg-emerald-50 text-emerald-800 border-emerald-200",
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

  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all")
  const [pillarFilter, setPillarFilter] = useState<"all" | Pillar>("all")
  const [search, setSearch] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<Id<"corporateExperiences"> | null>(null)

  const filtered = useMemo(() => {
    if (!experiences) return undefined
    const q = search.trim().toLowerCase()
    return experiences.filter((e) => {
      if (statusFilter !== "all" && e.status !== statusFilter) return false
      if (pillarFilter !== "all" && e.pillar !== pillarFilter) return false
      if (!q) return true
      return [e.titlePrefix, e.titleAccent, e.shortDescription, e.location]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q))
    })
  }, [experiences, statusFilter, pillarFilter, search])

  const editingExperience = useMemo(() => {
    if (!editingId || !experiences) return null
    return experiences.find((e) => e._id === editingId) ?? null
  }, [editingId, experiences])

  const openCreate = () => {
    setEditingId(null)
    setFormOpen(true)
  }

  const openEdit = (id: Id<"corporateExperiences">) => {
    setEditingId(id)
    setFormOpen(true)
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Corporate Experiences</h1>
          <p className="text-sm text-zinc-500">
            Curated experiences shown on the /corporate/experiences page.
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="size-4" /> New experience
        </Button>
      </header>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setStatusFilter(f.value)}
              className={cn(
                "h-9 px-3 text-sm border rounded-md transition-colors",
                statusFilter === f.value
                  ? "bg-zinc-900 border-zinc-900 text-white"
                  : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50",
              )}
            >
              {f.label}
            </button>
          ))}
          <div className="ml-2 h-6 w-px bg-zinc-200" />
          {PILLAR_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setPillarFilter(f.value)}
              className={cn(
                "h-9 px-3 text-sm border rounded-md transition-colors",
                pillarFilter === f.value
                  ? "bg-zinc-900 border-zinc-900 text-white"
                  : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, description, location…"
            className="h-9 w-[280px] pl-9 pr-3 text-sm border border-zinc-200 rounded-md focus:outline-none focus:border-zinc-400"
          />
        </div>
      </div>

      {experiences === undefined ? (
        <div className="flex items-center justify-center py-20 text-zinc-400">
          <Loader2 className="size-6 animate-spin" />
        </div>
      ) : filtered && filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-400 gap-2">
          <Inbox className="size-8" />
          <p className="text-sm">No experiences match these filters.</p>
        </div>
      ) : (
        <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 text-zinc-500">
              <tr>
                <th className="text-left font-medium px-4 py-3 w-[80px]">Cover</th>
                <th className="text-left font-medium px-4 py-3">Title</th>
                <th className="text-left font-medium px-4 py-3">Pillar</th>
                <th className="text-left font-medium px-4 py-3">Duration</th>
                <th className="text-left font-medium px-4 py-3">Location</th>
                <th className="text-left font-medium px-4 py-3">Updated</th>
                <th className="text-left font-medium px-4 py-3">Sort</th>
                <th className="text-left font-medium px-4 py-3">Status</th>
                <th className="text-right font-medium px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered?.map((e) => {
                const status = e.status as Status
                return (
                  <tr key={e._id} className="hover:bg-zinc-50/60">
                    <td className="px-4 py-3">
                      {e.coverImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={e.coverImageUrl}
                          alt=""
                          className="h-12 w-16 object-cover rounded border border-zinc-200"
                        />
                      ) : (
                        <div className="h-12 w-16 rounded border border-dashed border-zinc-300 bg-zinc-50" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-zinc-900">
                        {e.titlePrefix} <span className="italic text-zinc-600">{e.titleAccent}</span>
                      </div>
                      <div className="text-xs text-zinc-500 mt-0.5 line-clamp-1">
                        {e.shortDescription}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-zinc-700 capitalize">
                      {e.pillar}
                      <div className="text-xs text-zinc-400">{e.subcategory}</div>
                    </td>
                    <td className="px-4 py-3 text-zinc-700">{e.durationLabel}</td>
                    <td className="px-4 py-3 text-zinc-700">{e.location}</td>
                    <td className="px-4 py-3 text-zinc-500">{formatDate(e.updatedAt)}</td>
                    <td className="px-4 py-3 text-zinc-700">{e.sortOrder}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2 h-6 text-[11px] uppercase tracking-wider border rounded-full",
                          STATUS_BADGE[status],
                        )}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setStatus({
                              id: e._id,
                              status: status === "published" ? "draft" : "published",
                            })
                          }
                          className="h-8 px-2"
                          title={status === "published" ? "Unpublish" : "Publish"}
                        >
                          {status === "published" ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <CheckCircle2 className="size-4 text-emerald-600" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(e._id)}
                          className="h-8 px-2"
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (confirm("Delete this experience? This cannot be undone."))
                              void remove({ id: e._id })
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
