"use client"

import { useTranslations } from "next-intl"
import { useCallback } from "react"

function ensureDate(date: Date | string | number | undefined | null): Date | undefined {
  if (!date) return undefined
  if (date instanceof Date) return date
  const d = new Date(date)
  return Number.isFinite(d.getTime()) ? d : undefined
}

export function useDateFormatter() {
  const t = useTranslations("common")

  const formatDate = useCallback(
    (date: Date | string | number | undefined | null): string => {
      const d = ensureDate(date)
      if (!d) return ""

      const weekdays = t.raw("weekdays") as string[]
      const months = t.raw("months") as string[]

      const weekday = weekdays[d.getDay()] ?? ""
      const day = d.getDate()
      const month = months[d.getMonth()] ?? ""

      return t("dateFormat", { weekday, day, month })
    },
    [t]
  )

  const formatTime = useCallback(
    (date: Date | string | number | undefined | null): string => {
      const d = ensureDate(date)
      if (!d) return ""
      const hh = String(d.getHours()).padStart(2, "0")
      const min = String(d.getMinutes()).padStart(2, "0")
      return `${hh}:${min}`
    },
    []
  )

  const formatDateTime = useCallback(
    (date: Date | string | number | undefined | null): string => {
      const dateStr = formatDate(date)
      const timeStr = formatTime(date)
      return dateStr && timeStr ? `${dateStr} - ${timeStr}` : dateStr
    },
    [formatDate, formatTime]
  )

  return { formatDate, formatTime, formatDateTime }
}

