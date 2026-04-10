"use client"

import { createContext, useContext, useMemo, ReactNode, useState, useEffect, useRef } from "react"
import { NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, getGoogleMapsApiKey } from "@/lib/env"

interface GoogleMapsContextValue {
  isLoaded: boolean
  loadError: Error | undefined
  hasKey: boolean
}

const GoogleMapsContext = createContext<GoogleMapsContextValue>({
  isLoaded: false,
  loadError: undefined,
  hasKey: false,
})

interface GoogleMapsProviderProps {
  children: ReactNode
}

const CALLBACK_NAME = "__googleMapsCallback__"

export function GoogleMapsProvider({ children }: GoogleMapsProviderProps) {
  const hasKey = Boolean(NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadError, setLoadError] = useState<Error | undefined>(undefined)
  const loadingRef = useRef(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    if (window.google?.maps?.DirectionsService) {
      setIsLoaded(true)
      return
    }

    if (loadingRef.current) return
    loadingRef.current = true

    if (!hasKey) {
      setLoadError(new Error("Missing Google Maps API key"))
      return
    }

    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
    if (existingScript) {
      const checkLoaded = setInterval(() => {
        if (window.google?.maps?.DirectionsService) {
          setIsLoaded(true)
          clearInterval(checkLoaded)
        }
      }, 100)

      setTimeout(() => {
        clearInterval(checkLoaded)
        if (!window.google?.maps?.DirectionsService) {
          setLoadError(new Error("Google Maps script exists but failed to fully load"))
        }
      }, 10000)
      return
    }

    (window as unknown as Record<string, () => void>)[CALLBACK_NAME] = () => {
      setIsLoaded(true)
      delete (window as unknown as Record<string, () => void>)[CALLBACK_NAME]
    }

    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${getGoogleMapsApiKey()}&libraries=places&callback=${CALLBACK_NAME}`
    script.async = true
    script.defer = true
    script.onerror = () => {
      setLoadError(new Error("Failed to load Google Maps script"))
      delete (window as unknown as Record<string, () => void>)[CALLBACK_NAME]
    }

    document.head.appendChild(script)

    return () => {
      delete (window as unknown as Record<string, () => void>)[CALLBACK_NAME]
    }
  }, [hasKey])

  const value = useMemo(
    () => ({ isLoaded, loadError, hasKey }),
    [isLoaded, loadError, hasKey]
  )

  return (
    <GoogleMapsContext.Provider value={value}>
      {children}
    </GoogleMapsContext.Provider>
  )
}

export function useGoogleMaps() {
  return useContext(GoogleMapsContext)
}
