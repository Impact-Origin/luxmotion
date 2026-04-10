"use client"

import { useState, useEffect, useRef } from "react"
import { useGoogleMaps } from "@/components/providers/google-maps-provider"

interface Location {
  lat: number | null
  lng: number | null
}

interface Stop {
  lat: number | null
  lng: number | null
}

interface UseRouteDistanceProps {
  from: Location
  to: Location
  stops?: Stop[]
}

interface RouteDistanceResult {
  distance: number | null
  duration: number | null
  isCalculating: boolean
  error: "no_route" | "api_error" | null
}

export function useRouteDistance({ from, to, stops = [] }: UseRouteDistanceProps): RouteDistanceResult {
  const [distance, setDistance] = useState<number | null>(null)
  const [duration, setDuration] = useState<number | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [error, setError] = useState<"no_route" | "api_error" | null>(null)
  const lastRequestRef = useRef<string>("")

  const { isLoaded } = useGoogleMaps()

  const fromLat = from.lat
  const fromLng = from.lng
  const toLat = to.lat
  const toLng = to.lng

  const hasValidLocations = fromLat !== null && fromLng !== null && toLat !== null && toLng !== null

  useEffect(() => {
    if (!isLoaded || !hasValidLocations) {
      return
    }

    const stopsKey = stops
      .filter(s => s.lat !== null && s.lng !== null)
      .map(s => `${s.lat},${s.lng}`)
      .join("|")

    const requestKey = `${fromLat},${fromLng}-${toLat},${toLng}-${stopsKey}`

    if (requestKey === lastRequestRef.current) {
      return
    }

    lastRequestRef.current = requestKey
    setIsCalculating(true)
    setError(null)

    const directionsService = new google.maps.DirectionsService()

    const waypoints = stops
      .filter((stop) => stop.lat !== null && stop.lng !== null)
      .map((stop) => ({
        location: { lat: stop.lat!, lng: stop.lng! },
        stopover: true,
      }))

    directionsService.route(
      {
        origin: { lat: fromLat!, lng: fromLng! },
        destination: { lat: toLat!, lng: toLng! },
        waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: false,
      },
      (result, status) => {
        setIsCalculating(false)

        if (status === google.maps.DirectionsStatus.OK && result) {
          let totalDistanceMeters = 0
          let totalDurationSeconds = 0

          result.routes[0]?.legs.forEach((leg) => {
            totalDistanceMeters += leg.distance?.value || 0
            totalDurationSeconds += leg.duration?.value || 0
          })

          const distanceKm = totalDistanceMeters / 1000
          const durationMinutes = Math.round(totalDurationSeconds / 60)

          setDistance(distanceKm)
          setDuration(durationMinutes)
        } else {
          setDistance(null)
          setDuration(null)
          if (status === google.maps.DirectionsStatus.ZERO_RESULTS) {
            setError("no_route")
          } else {
            setError("api_error")
          }
        }
      }
    )
  }, [isLoaded, hasValidLocations, fromLat, fromLng, toLat, toLng, stops])

  return {
    distance,
    duration,
    isCalculating,
    error,
  }
}
