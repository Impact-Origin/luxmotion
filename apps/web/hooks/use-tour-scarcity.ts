"use client"

import { useQuery } from "convex/react"
import { api } from "@workspace/convex/api"

export type MonthStatus = "booked" | "almost" | "available"

export interface TourScarcityData {
  year: number
  totalCapacity: number
  confirmedBookings: number
  inquiriesToday: number
  reservedThisWeek: number
  months: { status: MonthStatus; spotsLeft: number }[]
}

export const tourScarcityDefaults: TourScarcityData = {
  year: 2026,
  totalCapacity: 200,
  confirmedBookings: 173,
  inquiriesToday: 14,
  reservedThisWeek: 3,
  months: [
    { status: "booked", spotsLeft: 0 },
    { status: "booked", spotsLeft: 0 },
    { status: "booked", spotsLeft: 0 },
    { status: "booked", spotsLeft: 0 },
    { status: "booked", spotsLeft: 0 },
    { status: "booked", spotsLeft: 0 },
    { status: "booked", spotsLeft: 0 },
    { status: "booked", spotsLeft: 0 },
    { status: "almost", spotsLeft: 2 },
    { status: "almost", spotsLeft: 4 },
    { status: "available", spotsLeft: 0 },
    { status: "available", spotsLeft: 0 },
  ],
}

export function useTourScarcity(): TourScarcityData {
  const data = useQuery(api.tourScarcity.get)
  return (data as TourScarcityData | undefined) ?? tourScarcityDefaults
}
