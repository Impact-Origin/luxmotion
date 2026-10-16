"use client"

import { useTranslations } from "next-intl"
import { Plus, Copy, Trash2 } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import type { SharedDeparture } from "@workspace/convex/convex/lib/sharedDepartures"
import { combineLocalDateTime, localDateTimeFields } from "@/lib/event-date-time"
import { TimeSelect } from "./time-select"

export type SharedDepartureDraft = Omit<SharedDeparture, "departureAt" | "price"> & { date: string; time: string; price: string }

export function sharedDepartureDrafts(rows: SharedDeparture[]): SharedDepartureDraft[] {
  return rows.map(({ departureAt, price, ...row }) => ({ ...row, ...localDateTimeFields(departureAt), price: price === undefined ? "" : String(price) }))
}

export function serializeSharedDepartures(rows: SharedDepartureDraft[]): SharedDeparture[] {
  return rows.map(({ date, time, price, ...row }) => ({
    ...row, departureAt: date && time ? combineLocalDateTime(date, time)! : NaN,
    ...(price.trim() ? { price: Number(price) } : {}),
  }))
}

export function SharedDeparturesEditor({ value, onChange, origin, destination, startDate, defaultPrice, disabled }: {
  value: SharedDepartureDraft[]
  onChange: (rows: SharedDepartureDraft[]) => void
  origin: string
  destination: string
  startDate: string
  defaultPrice: string
  disabled?: boolean
}) {
  const t = useTranslations("adminEvents.sharedDepartures")
  const update = (id: string, patch: Partial<SharedDepartureDraft>) => onChange(value.map(row => row.id === id ? { ...row, ...patch } : row))
  const add = (direction: SharedDeparture["direction"]) => onChange([...value, {
    id: crypto.randomUUID(), direction, date: startDate, time: "", price: "",
    origin: direction === "outbound" ? origin : destination,
    destination: direction === "outbound" ? destination : origin,
  }])
  return (
    <section className="space-y-4 rounded-lg border p-4">
      <div>
        <h3 className="font-semibold">{t("title")}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{t("description")}</p>
      </div>
      {value.map((row, index) => (
        <fieldset key={row.id} disabled={disabled} className="space-y-3 rounded-md border bg-muted/20 p-3">
          <legend className="px-1 text-sm font-medium">{t("departure")} {index + 1}</legend>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor={`direction-${row.id}`}>{t("direction")}</Label>
              <select id={`direction-${row.id}`} value={row.direction} onChange={e => update(row.id, { direction: e.target.value as SharedDeparture["direction"], origin: row.destination, destination: row.origin })} className="h-9 w-full rounded-md border bg-background px-3 text-sm">
                <option value="outbound">{t("outbound")}</option><option value="return">{t("return")}</option>
              </select>
            </div>
            <div className="space-y-1.5"><Label htmlFor={`date-${row.id}`}>{t("date")}</Label><Input id={`date-${row.id}`} type="date" value={row.date} onChange={e => update(row.id, { date: e.target.value })} /></div>
            <div className="space-y-1.5"><Label htmlFor={`time-${row.id}`}>{t("time")}</Label><TimeSelect id={`time-${row.id}`} value={row.time} onChange={time => update(row.id, { time })} disabled={disabled} /></div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1.5"><Label htmlFor={`origin-${row.id}`}>{t("origin")}</Label><Input id={`origin-${row.id}`} value={row.origin} onChange={e => update(row.id, { origin: e.target.value })} /></div>
            <div className="space-y-1.5"><Label htmlFor={`destination-${row.id}`}>{t("destination")}</Label><Input id={`destination-${row.id}`} value={row.destination} onChange={e => update(row.id, { destination: e.target.value })} /></div>
            <div className="space-y-1.5"><Label htmlFor={`price-${row.id}`}>{t("price")}</Label><Input id={`price-${row.id}`} type="number" min="0.01" step="0.01" value={row.price} placeholder={defaultPrice || "—"} onChange={e => update(row.id, { price: e.target.value })} /></div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" size="sm" variant="outline" onClick={() => onChange([...value, { ...row, id: crypto.randomUUID() }])}><Copy className="size-3.5" />{t("duplicate")}</Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => onChange(value.filter(item => item.id !== row.id))}><Trash2 className="size-3.5" />{t("remove")}</Button>
          </div>
        </fieldset>
      ))}
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" disabled={disabled} onClick={() => add("outbound")}><Plus className="size-4" />{t("addOutbound")}</Button>
        <Button type="button" variant="outline" disabled={disabled} onClick={() => add("return")}><Plus className="size-4" />{t("addReturn")}</Button>
      </div>
      <p className="text-xs text-muted-foreground">{t("priceHint")}</p>
    </section>
  )
}
