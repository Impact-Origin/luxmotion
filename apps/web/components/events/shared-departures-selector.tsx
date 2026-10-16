"use client"

import { useLocale, useTranslations } from "next-intl"
import type { SharedDeparture } from "@workspace/convex/convex/lib/sharedDepartures"
import { isReturnFor } from "@workspace/convex/convex/lib/sharedDepartures"
import { useMoney } from "@/components/currency-provider"
import { useId } from "react"

export function SharedDeparturesSelector({ departures, defaultPrice, departureId, returnId, onChange }: {
  departures: SharedDeparture[]
  defaultPrice: number
  departureId: string
  returnId: string
  onChange: (departureId: string, returnId: string) => void
}) {
  const t = useTranslations("tourDetails.sharedDepartures")
  const locale = useLocale()
  const { format } = useMoney()
  const id = useId()
  const available = departures.filter(row => row.departureAt > Date.now()).sort((a, b) => a.departureAt - b.departureAt)
  const first = available.find(row => row.id === departureId)
  const returns = first ? available.filter(row => isReturnFor(first, row)) : []
  const selectClass = "w-full min-w-0 h-11 border border-[rgba(var(--lm-text-rgb,255,255,255),0.16)] bg-[var(--lm-surface,#1e1d1b)] px-2 text-sm text-[var(--lm-text,#fff)]"
  const label = (row: SharedDeparture) => `${new Intl.DateTimeFormat(locale, { timeZone: "Europe/Lisbon", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(row.departureAt)} · ${row.origin} → ${row.destination} · ${format(row.price ?? defaultPrice)}`
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <label htmlFor={`${id}-departure`} className="block text-xs text-[var(--lm-muted,#999)]">{t("departure")}</label>
        <select id={`${id}-departure`} className={selectClass} value={first?.id ?? ""} onChange={e => onChange(e.target.value, "")}>
          <option value="">{available.length ? t("choose") : t("unavailable")}</option>
          {(["outbound", "return"] as const).map(direction => (
            <optgroup key={direction} label={t(direction)}>
              {available.filter(row => row.direction === direction).map(row => <option key={row.id} value={row.id}>{label(row)}</option>)}
            </optgroup>
          ))}
        </select>
      </div>
      {first && returns.length > 0 && (
        <div className="space-y-1.5">
          <label htmlFor={`${id}-return`} className="block text-xs text-[var(--lm-muted,#999)]">{t("optionalReturn")}</label>
          <select id={`${id}-return`} className={selectClass} value={returns.some(row => row.id === returnId) ? returnId : ""} onChange={e => onChange(departureId, e.target.value)}>
            <option value="">{t("noReturn")}</option>
            {returns.map(row => <option key={row.id} value={row.id}>{label(row)}</option>)}
          </select>
        </div>
      )}
      <p className="text-[11px] leading-relaxed text-[var(--lm-muted,#999)]">{t("priceHint")}</p>
    </div>
  )
}
