"use client"

import { useMemo } from "react"
import { useQueries } from "convex/react"
import { api } from "@workspace/convex/api"

const DEFAULT_MIN_ADVANCE_HOURS = 2

/**
 * Admin-configured minimum booking lead time (in hours), read SAFELY.
 *
 * Uses `useQueries` (not `useQuery`) on purpose: if `siteSettings.get` isn't deployed
 * on the backend yet — e.g. the Vercel frontend went live before `npx convex deploy`
 * ran — the result comes back as an Error VALUE instead of a thrown exception, so the
 * booking widget and date pickers fall back to the default instead of crashing.
 *
 * The queries object MUST be memoized: `useQueries` re-subscribes whenever its identity
 * changes, so an inline object every render triggers an infinite re-render loop
 * (React #301). Memoizing with an empty dep list keeps a single stable subscription.
 */
export function useMinAdvanceBookingHours(): number {
  const queries = useMemo(
    () => ({ siteSettings: { query: api.siteSettings.get, args: {} } }),
    [],
  )
  const results = useQueries(queries)
  const r = results.siteSettings as
    | { minAdvanceBookingHours?: number }
    | Error
    | undefined
  if (!r || r instanceof Error) return DEFAULT_MIN_ADVANCE_HOURS
  return typeof r.minAdvanceBookingHours === "number"
    ? r.minAdvanceBookingHours
    : DEFAULT_MIN_ADVANCE_HOURS
}
