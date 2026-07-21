"use client"

import { useMemo } from "react"
import { useQueries } from "convex/react"
import { useTranslations } from "next-intl"
import { api } from "@workspace/convex/api"

export type PublicDriver = {
  id: string
  name: string
  location: string
  quote: string
  description: string
  languages: string
  vehicle: string
  rating: string
  rides: number
  image: string
}

/**
 * The single source of truth for the drivers shown on the home page carousel
 * and the About Us page. Both surfaces used to keep their own hardcoded list.
 */
const FALLBACK = [
  { id: "joao", image: "/about/driver-joao.png", rating: "4.98", rides: 1615 },
  { id: "maria", image: "/about/driver-maria.png", rating: "4.96", rides: 1247 },
  { id: "pedro", image: "/about/driver-pedro.png", rating: "4.99", rides: 2103 },
] as const

/**
 * Reads the published drivers SAFELY.
 *
 * Uses `useQueries` (not `useQuery`) on purpose: the `description`/`languages`/
 * `vehicle`/`rating`/`rides` fields need `npx convex deploy` to land on the
 * backend. If the Vercel frontend goes live first, the result comes back as an
 * Error VALUE instead of a thrown exception, so we fall back to the translated
 * defaults instead of crashing the page.
 */
export function usePublishedDrivers(): PublicDriver[] {
  const t = useTranslations("aboutPage.drivers")
  const queries = useMemo(
    () => ({ drivers: { query: api.drivers.listPublished, args: {} } }),
    [],
  )
  const raw = useQueries(queries).drivers

  return useMemo(() => {
    const fallback: PublicDriver[] = FALLBACK.map((d) => ({
      id: d.id,
      image: d.image,
      rating: d.rating,
      rides: d.rides,
      name: t(`items.${d.id}.name`),
      location: t(`items.${d.id}.location`),
      quote: t(`items.${d.id}.quote`),
      description: t(`items.${d.id}.description`),
      languages: t(`items.${d.id}.languages`),
      vehicle: t(`items.${d.id}.vehicle`),
    }))

    if (!raw || raw instanceof Error || !Array.isArray(raw) || raw.length === 0) {
      return fallback
    }

    // A published row wins, but any field the admin left empty falls back to the
    // translated copy so neither surface ever renders a blank slot.
    return raw.map((d: any, i: number) => {
      const base = fallback[i % fallback.length]!
      return {
        id: d._id,
        name: d.name || base.name,
        location: d.location || base.location,
        quote: d.quote || base.quote,
        description: d.description || base.description,
        languages: d.languages || base.languages,
        vehicle: d.vehicle || base.vehicle,
        rating: d.rating || base.rating,
        rides: typeof d.rides === "number" ? d.rides : base.rides,
        image: d.imageUrl ?? base.image,
      }
    })
  }, [raw, t])
}
