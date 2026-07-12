"use client"

import { useMemo } from "react"
import { useQueries } from "convex/react"
import { api } from "@workspace/convex/api"
import { DEFAULT_RATES, type ExchangeRates } from "@/lib/currency"
import { AIRPORT_SURCHARGE_PERCENT } from "@/lib/airport"

export type SiteSettings = {
  minAdvanceBookingHours: number
  announcementsEnabled: boolean
  announcements: string[]
  exchangeRates: ExchangeRates
  airportSurchargePercent: number
}

const DEFAULTS: SiteSettings = {
  minAdvanceBookingHours: 2,
  announcementsEnabled: false,
  announcements: [],
  exchangeRates: DEFAULT_RATES,
  airportSurchargePercent: AIRPORT_SURCHARGE_PERCENT,
}

/**
 * Reads the global `siteSettings` singleton SAFELY.
 *
 * Uses `useQueries` (not `useQuery`) on purpose: if `siteSettings.get` isn't
 * deployed on the backend yet — e.g. the Vercel frontend went live before
 * `npx convex deploy` ran — the result comes back as an Error VALUE instead of a
 * thrown exception, so callers fall back to defaults instead of crashing the app.
 *
 * The queries object MUST be memoized (an inline object every render re-subscribes
 * and loops → React #301), and the mapped result is memoized so its identity is
 * stable while the underlying data is unchanged (safe to use as an effect dep).
 */
export function useSiteSettings(): SiteSettings {
  const queries = useMemo(
    () => ({ siteSettings: { query: api.siteSettings.get, args: {} } }),
    [],
  )
  const results = useQueries(queries)
  const raw = results.siteSettings
  return useMemo(() => {
    const r = raw as Partial<SiteSettings> | Error | undefined
    if (!r || r instanceof Error) return DEFAULTS
    return {
      minAdvanceBookingHours:
        typeof r.minAdvanceBookingHours === "number"
          ? r.minAdvanceBookingHours
          : DEFAULTS.minAdvanceBookingHours,
      announcementsEnabled: r.announcementsEnabled ?? false,
      announcements: r.announcements ?? [],
      exchangeRates: r.exchangeRates ?? DEFAULT_RATES,
      airportSurchargePercent:
        r.airportSurchargePercent ?? DEFAULTS.airportSurchargePercent,
    }
  }, [raw])
}
