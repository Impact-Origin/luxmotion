"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@workspace/convex/api"
import {
  Search,
  Mail,
  Phone,
  Building2,
  Calendar,
  X,
  Trash2,
  ChevronDown,
} from "lucide-react"

const STATUS_CONFIG = {
  new: { label: "New", color: "bg-blue-100 text-blue-700" },
  inProgress: { label: "In Progress", color: "bg-amber-100 text-amber-700" },
  resolved: { label: "Resolved", color: "bg-green-100 text-green-700" },
  archived: { label: "Archived", color: "bg-zinc-100 text-zinc-600" },
} as const

type Status = keyof typeof STATUS_CONFIG

export default function ContactQuotesPage() {
  const requests = useQuery(api.contactQuotes.list)
  const setStatus = useMutation(api.contactQuotes.setStatus)
  const remove = useMutation(api.contactQuotes.remove)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all")
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filtered = (requests ?? []).filter((r) => {
    const matchesSearch =
      search === "" ||
      r.fullName.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.company.toLowerCase().includes(search.toLowerCase()) ||
      r.subject.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || r.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const selected = filtered.find((r) => r._id === selectedId) ?? null

  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900">Quote Requests</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Quote requests submitted from the corporate contact page
          </p>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by name, email, company, or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Status | "all")}
              className="appearance-none pl-4 pr-10 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="inProgress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="archived">Archived</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider px-4 py-3">
                  Name
                </th>
                <th className="text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider px-4 py-3">
                  Company
                </th>
                <th className="text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider px-4 py-3">
                  Subject
                </th>
                <th className="text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider px-4 py-3">
                  Status
                </th>
                <th className="text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider px-4 py-3">
                  Date
                </th>
                <th className="w-10 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-zinc-400 text-sm">
                    No quote requests found
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr
                    key={r._id}
                    onClick={() => setSelectedId(r._id)}
                    className={`border-b border-zinc-100 last:border-0 cursor-pointer transition-colors ${
                      selectedId === r._id ? "bg-zinc-50" : "hover:bg-zinc-50/50"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-zinc-900 text-sm">
                        {r.fullName}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-zinc-600 flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-zinc-400" />
                        {r.company}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-zinc-600 max-w-[260px] truncate">
                        {r.subject}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_CONFIG[r.status].color}`}
                      >
                        {STATUS_CONFIG[r.status].label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-zinc-500 flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                        {new Date(r.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (confirm("Delete this quote request?")) remove({ id: r._id })
                        }}
                        className="text-zinc-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="w-[400px] border-l border-zinc-200 bg-white overflow-y-auto">
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-zinc-900">
                  {selected.fullName}
                </h2>
                <p className="text-sm text-zinc-500">{selected.company}</p>
              </div>
              <button
                onClick={() => setSelectedId(null)}
                className="text-zinc-400 hover:text-zinc-900 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Status
              </label>
              <div className="relative mt-2">
                <select
                  value={selected.status}
                  onChange={(e) =>
                    setStatus({ id: selected._id, status: e.target.value as Status })
                  }
                  className="appearance-none w-full pl-4 pr-10 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 bg-white"
                >
                  <option value="new">New</option>
                  <option value="inProgress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="archived">Archived</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-zinc-700">
                <Mail className="h-4 w-4 text-zinc-400" />
                <a href={`mailto:${selected.email}`} className="hover:text-zinc-900">
                  {selected.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-700">
                <Phone className="h-4 w-4 text-zinc-400" />
                <a href={`tel:${selected.phone}`} className="hover:text-zinc-900">
                  {selected.phone}
                </a>
              </div>

              <div className="pt-2">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Subject
                </label>
                <p className="text-sm text-zinc-800 mt-1">{selected.subject}</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Message
                </label>
                <p className="text-sm text-zinc-700 mt-1 whitespace-pre-wrap leading-relaxed">
                  {selected.message}
                </p>
              </div>

              <div className="pt-2 text-xs text-zinc-400">
                Submitted {new Date(selected.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
