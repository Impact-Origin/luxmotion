"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@workspace/convex/api"
import { Search, Trash2, Building2, Mail, Phone, MapPin } from "lucide-react"

const STATUS_CONFIG = {
  new: { label: "New", color: "bg-blue-100 text-blue-700" },
  contacted: { label: "Contacted", color: "bg-amber-100 text-amber-700" },
  qualified: { label: "Qualified", color: "bg-green-100 text-green-700" },
  archived: { label: "Archived", color: "bg-[#f1e8d8] text-[#5c554c]" },
} as const

type Status = keyof typeof STATUS_CONFIG

export default function PartnerLeadsPage() {
  const leads = useQuery(api.partnerLeads.list)
  const setStatus = useMutation(api.partnerLeads.setStatus)
  const remove = useMutation(api.partnerLeads.remove)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all")

  const filtered = (leads ?? []).filter((r) => {
    const q = search.toLowerCase()
    const matchesSearch =
      q === "" ||
      r.fullName.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.companyName.toLowerCase().includes(q) ||
      r.city.toLowerCase().includes(q)
    const matchesStatus = statusFilter === "all" || r.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[26px] leading-none text-[#211c16]" style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif" }}>
          Partner Leads
        </h1>
        <p className="mt-1.5 text-sm text-[#8a8074]">
          Candidaturas de parceria submetidas na página Hotéis
        </p>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a99e8c]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar por nome, empresa, email, cidade…"
            className="h-10 w-full rounded-lg border border-[#e2d7c1] bg-white pl-9 pr-3 text-sm text-[#211c16] outline-none focus:border-[#A08248] focus:ring-2 focus:ring-[#A08248]/25"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as Status | "all")}
          className="h-10 rounded-lg border border-[#e2d7c1] bg-white px-3 text-sm text-[#211c16] outline-none focus:border-[#A08248]"
        >
          <option value="all">All statuses</option>
          {Object.entries(STATUS_CONFIG).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
        <span className="text-sm text-[#8a8074]">{filtered.length} lead{filtered.length === 1 ? "" : "s"}</span>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#e7ddca] bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#e7ddca] bg-[#faf6ee] text-[11px] uppercase tracking-[0.6px] text-[#8a8074]">
              <th className="px-4 py-3 font-semibold">Contact</th>
              <th className="px-4 py-3 font-semibold">Company</th>
              <th className="px-4 py-3 font-semibold">Type · Volume</th>
              <th className="px-4 py-3 font-semibold">City</th>
              <th className="px-4 py-3 font-semibold">Source</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {leads === undefined && (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-[#8a8074]">Loading…</td></tr>
            )}
            {leads !== undefined && filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-[#8a8074]">No leads yet.</td></tr>
            )}
            {filtered.map((r) => (
              <tr key={r._id} className="border-b border-[#efe7d8] last:border-0 hover:bg-[#faf6ee]">
                <td className="px-4 py-3">
                  <div className="font-medium text-[#211c16]">{r.fullName}</div>
                  <div className="mt-0.5 flex flex-col gap-0.5 text-xs text-[#8a8074]">
                    <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{r.email}</span>
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{r.phone}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1.5 text-[#4a443c]"><Building2 className="h-3.5 w-3.5 text-[#A08248]" />{r.companyName}</span>
                </td>
                <td className="px-4 py-3 text-[#4a443c]">
                  <div>{r.partnerType}</div>
                  <div className="text-xs text-[#8a8074]">{r.estimatedMonthlyVolume}</div>
                </td>
                <td className="px-4 py-3 text-[#4a443c]">
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-[#A08248]" />{r.city}</span>
                </td>
                <td className="px-4 py-3 text-xs text-[#8a8074]">{r.howDidYouHear}</td>
                <td className="px-4 py-3">
                  <select
                    value={r.status}
                    onChange={(e) => setStatus({ id: r._id, status: e.target.value as Status })}
                    className={`rounded-full border-0 px-2.5 py-1 text-xs font-semibold outline-none ${STATUS_CONFIG[r.status as Status].color}`}
                  >
                    {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => remove({ id: r._id })}
                    aria-label="Delete"
                    className="text-[#a99e8c] transition-colors hover:text-[#b4452f]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
