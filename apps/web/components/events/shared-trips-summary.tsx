"use client"

import { useLocale } from "next-intl"
import type { SharedTrip } from "@workspace/convex/convex/lib/sharedDepartures"

export function SharedTripsSummary({ trips }: { trips?: SharedTrip[] }) {
  const locale = useLocale()
  if (!trips?.length) return null
  const date = new Intl.DateTimeFormat(locale, { timeZone: "Europe/Lisbon", dateStyle: "short", timeStyle: "short", hourCycle: "h23" })
  return <ul className="mt-2 space-y-2 text-xs text-[#999]">
    {trips.map(trip => <li key={trip.id}><span className="block">{trip.origin} → {trip.destination}</span><span className="block">{date.format(trip.departureAt)}</span></li>)}
  </ul>
}
