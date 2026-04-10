"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { useGoogleMaps } from "@/components/providers/google-maps-provider"
import { MapPin, Plane, Hotel, TrainFront, Ship } from "lucide-react"
import type { LocationSuggestion } from "@/components/landing/booking/types"

export function useGoogleAutocomplete() {
  const { isLoaded } = useGoogleMaps()
  const [predictions, setPredictions] = useState<LocationSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null)
  const placesService = useRef<google.maps.places.PlacesService | null>(null)
  const sessionToken = useRef<google.maps.places.AutocompleteSessionToken | null>(null)

  useEffect(() => {
    if (isLoaded && !autocompleteService.current) {
      autocompleteService.current = new google.maps.places.AutocompleteService()
      sessionToken.current = new google.maps.places.AutocompleteSessionToken()

      // needs to be HTML element, even if not used for rendering
      const div = document.createElement("div")
      placesService.current = new google.maps.places.PlacesService(div)
    }
  }, [isLoaded])

  const AIRPORT_KEYWORDS = ["airport", "aeroporto", "aeropuerto", "aéroport", "flughafen"]
  const TRAIN_KEYWORDS = ["estação", "estacion", "ferroviária", "ferroviario", "train station", "gare", "bahnhof", "hauptbahnhof", "hbf", "railway"]
  const CRUISE_KEYWORDS = ["cruise", "cruzeiro", "cruzeiros", "terminal marítimo", "terminal maritimo", "kreuzfahrt"]

  const primaryName = (name: string) => name.split(/\s[–—-]\s/)[0] ?? name

  const matchesKeywords = (name: string, keywords: string[]) => {
    const lower = name.toLowerCase()
    return keywords.some((kw) => lower.includes(kw))
  }

  const getIcon = (types: string[], name: string) => {
    if (types.includes("airport") || matchesKeywords(name, AIRPORT_KEYWORDS)) return Plane
    if (types.includes("lodging") || types.includes("hotel") || types.includes("resort")) return Hotel
    if (types.includes("train_station") || types.includes("transit_station") || types.includes("subway_station")) return TrainFront
    if (matchesKeywords(primaryName(name), TRAIN_KEYWORDS)) return TrainFront
    if (matchesKeywords(primaryName(name), CRUISE_KEYWORDS)) return Ship
    return MapPin
  }

  const getType = (types: string[], name: string): LocationSuggestion["type"] => {
    if (types.includes("airport") || matchesKeywords(name, AIRPORT_KEYWORDS)) return "airport"
    if (types.includes("lodging") || types.includes("hotel") || types.includes("resort")) return "hotel"
    if (types.includes("train_station") || types.includes("transit_station") || types.includes("subway_station")) return "station"
    if (matchesKeywords(primaryName(name), TRAIN_KEYWORDS)) return "station"
    if (matchesKeywords(primaryName(name), CRUISE_KEYWORDS)) return "cruise"
    return "address"
  }

  const fetchPredictions = useCallback(async (input: string) => {
    if (!input || !autocompleteService.current) {
      setPredictions([])
      return
    }

    setIsLoading(true)
    try {
      autocompleteService.current.getPlacePredictions(
        {
          input,
          sessionToken: sessionToken.current || undefined,
          types: ["geocode", "establishment"], 
        },
        (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            const suggestions: LocationSuggestion[] = results.map((res) => ({
              type: getType(res.types, res.structured_formatting.main_text),
              name: res.structured_formatting.main_text,
              description: res.structured_formatting.secondary_text,
              icon: getIcon(res.types, res.structured_formatting.main_text),
              placeId: res.place_id,
            }))
            setPredictions(suggestions)
          } else {
            setPredictions([])
          }
          setIsLoading(false)
        }
      )
    } catch (error) {
      console.error("Error fetching predictions:", error)
      setPredictions([])
      setIsLoading(false)
    }
  }, [])

  const getPlaceDetails = useCallback(async (placeId: string): Promise<{ lat: number; lng: number; address: string } | null> => {
    if (!placesService.current) return null

    return new Promise((resolve) => {
      placesService.current?.getDetails(
        {
          placeId,
          fields: ["geometry", "formatted_address"],
          sessionToken: sessionToken.current || undefined,
        },
        (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
            sessionToken.current = new google.maps.places.AutocompleteSessionToken()
            
            resolve({
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
              address: place.formatted_address || "",
            })
          } else {
            resolve(null)
          }
        }
      )
    })
  }, [])

  const getDefaultSuggestions = useCallback(async (): Promise<LocationSuggestion[]> => {
    if (!autocompleteService.current) return []

    // Popular Portuguese locations to suggest
    const popularLocations = [
      "Aeroporto de Lisboa",
      "Aeroporto do Porto",
      "Aeroporto de Faro",
      "Estação de Santa Apolónia",
      "Estação do Oriente",
    ]

    const suggestions: LocationSuggestion[] = []

    // Fetch place IDs for each popular location
    for (const location of popularLocations) {
      try {
        await new Promise<void>((resolve) => {
          autocompleteService.current?.getPlacePredictions(
            {
              input: location,
              types: ["geocode", "establishment"],
            },
            (results, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
                const firstResult = results[0]
                if (firstResult) {
                  suggestions.push({
                    type: getType(firstResult.types, firstResult.structured_formatting.main_text),
                    name: firstResult.structured_formatting.main_text,
                    description: firstResult.structured_formatting.secondary_text,
                    icon: getIcon(firstResult.types, firstResult.structured_formatting.main_text),
                    placeId: firstResult.place_id,
                  })
                }
              }
              resolve()
            }
          )
        })
      } catch (error) {
        console.error(`Error fetching suggestion for ${location}:`, error)
      }
    }

    return suggestions
  }, [])

  return { predictions, isLoading, fetchPredictions, getPlaceDetails, getDefaultSuggestions }
}

