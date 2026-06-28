"use client"

import * as React from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@workspace/convex/api"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useTranslations } from "next-intl"
import { tourScarcityDefaults, type MonthStatus, type TourScarcityData } from "@/hooks/use-tour-scarcity"

const MONTH_KEYS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
] as const

const STATUSES: MonthStatus[] = ["booked", "almost", "available"]

const NUMBER_FIELDS = [
  "year",
  "totalCapacity",
  "confirmedBookings",
  "inquiriesToday",
  "reservedThisWeek",
] as const

export default function AdminAvailabilityPage() {
  const t = useTranslations("adminAvailability")
  const tMonths = useTranslations("ultraLuxuryTours.scarcity.months")
  const settings = useQuery(api.tourScarcity.get)
  const upsert = useMutation(api.tourScarcity.upsert)
  const [form, setForm] = React.useState<TourScarcityData>(tourScarcityDefaults)
  const [isSaving, setIsSaving] = React.useState(false)

  React.useEffect(() => {
    if (settings) setForm(settings as TourScarcityData)
  }, [settings])

  const updateNumber =
    (key: (typeof NUMBER_FIELDS)[number]) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number.parseInt(event.target.value, 10)
      setForm((prev) => ({ ...prev, [key]: Number.isNaN(value) ? 0 : value }))
    }

  const updateMonth = (index: number, patch: Partial<{ status: MonthStatus; spotsLeft: number }>) => {
    setForm((prev) => ({
      ...prev,
      months: prev.months.map((m, i) => (i === index ? { ...m, ...patch } : m)),
    }))
  }

  const save = async () => {
    if (form.confirmedBookings > form.totalCapacity) {
      toast.error(t("errors.capacity"))
      return
    }
    try {
      setIsSaving(true)
      await upsert(form)
      toast.success(t("saveSuccess"))
    } catch {
      toast.error(t("saveError"))
    } finally {
      setIsSaving(false)
    }
  }

  if (!settings) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
        <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="space-y-4 rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">{t("sections.capacity")}</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {NUMBER_FIELDS.map((field) => (
            <div key={field} className="space-y-2">
              <Label htmlFor={field}>{t(`fields.${field}`)}</Label>
              <Input
                id={field}
                type="number"
                min={0}
                value={form[field] ?? 0}
                onChange={updateNumber(field)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">{t("sections.months")}</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {MONTH_KEYS.map((key, index) => {
            const month = form.months[index] ?? { status: "booked" as MonthStatus, spotsLeft: 0 }
            return (
              <div key={key} className="space-y-2 rounded-lg border border-border p-4">
                <p className="font-medium text-foreground">{tMonths(key)}</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs" htmlFor={`status-${key}`}>
                      {t("statusLabel")}
                    </Label>
                    <select
                      id={`status-${key}`}
                      value={month.status}
                      onChange={(e) => updateMonth(index, { status: e.target.value as MonthStatus })}
                      className="h-9 w-full rounded-md border border-border bg-card px-2 text-sm text-foreground"
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {t(`status.${status}`)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs" htmlFor={`spots-${key}`}>
                      {t("spotsLeftLabel")}
                    </Label>
                    <Input
                      id={`spots-${key}`}
                      type="number"
                      min={0}
                      value={month.spotsLeft ?? 0}
                      onChange={(e) =>
                        updateMonth(index, {
                          spotsLeft: Number.isNaN(Number.parseInt(e.target.value, 10))
                            ? 0
                            : Number.parseInt(e.target.value, 10),
                        })
                      }
                      disabled={month.status !== "almost"}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={save}
          disabled={isSaving}
          className="h-11 px-8 font-bold"
        >
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSaving ? t("saving") : t("save")}
        </Button>
      </div>
    </div>
  )
}
