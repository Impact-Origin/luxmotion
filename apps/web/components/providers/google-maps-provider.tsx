"use client"

import { createContext, useContext, useMemo, ReactNode, useState, useEffect, useRef, useCallback } from "react"
import { NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, getGoogleMapsApiKey } from "@/lib/env"

interface GoogleMapsContextValue {
  isLoaded: boolean
  loadError: Error | undefined
  hasKey: boolean
  /** Chamado pelo useGoogleMaps: só quando alguém precisa é que o script entra. */
  requestLoad: () => void
}

const GoogleMapsContext = createContext<GoogleMapsContextValue>({
  isLoaded: false,
  loadError: undefined,
  hasKey: false,
  requestLoad: () => {},
})

interface GoogleMapsProviderProps {
  children: ReactNode
}

const CALLBACK_NAME = "__googleMapsCallback__"

/**
 * O script do Google Maps só entra quando há quem o use.
 *
 * O provider está montado em todas as páginas públicas, e injectava a API na
 * montagem: eram uns 300 KB de terceiros carregados no /privacy-policy, no
 * /faqs e em tudo o resto, onde não há mapa nenhum. Agora quem precisa dele
 * pede-o — o pedido é o próprio useGoogleMaps.
 */
export function GoogleMapsProvider({ children }: GoogleMapsProviderProps) {
  const hasKey = Boolean(NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadError, setLoadError] = useState<Error | undefined>(undefined)
  const [wanted, setWanted] = useState(false)
  const loadingRef = useRef(false)

  const requestLoad = useCallback(() => setWanted(true), [])

  useEffect(() => {
    if (typeof window === "undefined") return
    if (!wanted) return

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
  }, [hasKey, wanted])

  const value = useMemo(
    () => ({ isLoaded, loadError, hasKey, requestLoad }),
    [isLoaded, loadError, hasKey, requestLoad]
  )

  return (
    <GoogleMapsContext.Provider value={value}>
      {children}
    </GoogleMapsContext.Provider>
  )
}

/**
 * Usar este hook é declarar que o componente precisa do Google Maps. É isso que
 * dispara o carregamento do script — quem não o chama, não o paga.
 */
export function useGoogleMaps() {
  const context = useContext(GoogleMapsContext)
  const { requestLoad } = context

  useEffect(() => {
    requestLoad()
  }, [requestLoad])

  return context
}
