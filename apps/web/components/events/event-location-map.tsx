"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useGoogleMaps } from "@/components/providers/google-maps-provider"
import { Loader2 } from "lucide-react"

interface EventLocationMapProps {
  title: string
  address: string
  lat: number
  lng: number
  className?: string
}

export function EventLocationMap({ title, address, lat, lng, className }: EventLocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markerRef = useRef<google.maps.Marker | null>(null)
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null)
  const { isLoaded, hasKey } = useGoogleMaps()
  const [mapType, setMapType] = useState<"roadmap" | "satellite">("roadmap")

  const focusOnPoint = useCallback(() => {
    if (mapInstanceRef.current && markerRef.current && infoWindowRef.current) {
      mapInstanceRef.current.panTo({ lat, lng })
      mapInstanceRef.current.setZoom(16)
      infoWindowRef.current.open(mapInstanceRef.current, markerRef.current)
    }
  }, [lat, lng])

  useEffect(() => {
    const handleFocusEvent = () => {
      focusOnPoint()
    }

    window.addEventListener("event-map-focus" as any, handleFocusEvent)
    return () => window.removeEventListener("event-map-focus" as any, handleFocusEvent)
  }, [focusOnPoint])

  useEffect(() => {
    if (!isLoaded || !hasKey || !mapRef.current) return

    if (!mapInstanceRef.current) {
      const map = new google.maps.Map(mapRef.current, {
        zoom: 15,
        center: { lat, lng },
        mapTypeId: mapType,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      })
      mapInstanceRef.current = map
    }

    if (markerRef.current) {
      markerRef.current.setMap(null)
    }

    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: mapInstanceRef.current,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 14,
        fillColor: "#27c7ff",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 3,
      },
      title,
    })

    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="
          padding: 0;
          min-width: 200px;
          max-width: 300px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        ">
          <div style="
            display: flex;
            flex-direction: column;
            gap: 4px;
            padding: 14px 44px 14px 16px;
          ">
            <p style="
              margin: 0;
              font-weight: 600;
              font-size: 15px;
              color: #0c171c;
              line-height: 1.3;
            ">${title}</p>
            <p style="
              margin: 0;
              font-size: 13px;
              color: #5f686c;
              line-height: 1.4;
            ">${address}</p>
          </div>
        </div>
      `,
    })

    marker.addListener("click", () => {
      infoWindow.open(mapInstanceRef.current, marker)
    })

    markerRef.current = marker
    infoWindowRef.current = infoWindow
  }, [isLoaded, hasKey, lat, lng, title, address, mapType])

  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setMapTypeId(mapType)
    }
  }, [mapType])

  const handleOpenInMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
    window.open(url, "_blank")
  }

  if (!hasKey) {
    return (
      <div className={`bg-zinc-100 flex items-center justify-center ${className}`}>
        <span className="text-zinc-500">Map unavailable</span>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <style>{`
        .gm-style-iw-c {
          padding: 0 !important;
          border-radius: 16px !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
        }
        .gm-style-iw-d {
          overflow: hidden !important;
        }
        .gm-style-iw-tc {
          display: none !important;
        }
        .gm-style-iw-chr {
          position: absolute !important;
          top: 8px !important;
          right: 8px !important;
        }
        .gm-style-iw-chr button {
          width: 28px !important;
          height: 28px !important;
          background: #f3f4f6 !important;
          border-radius: 50% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          opacity: 1 !important;
        }
        .gm-style-iw-chr button:hover {
          background: #e5e7eb !important;
        }
      `}</style>
      {!isLoaded && (
        <div className="absolute inset-0 bg-zinc-100 flex items-center justify-center z-10">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />

      <div className="absolute top-3 left-3 flex shadow-md rounded-md overflow-hidden">
        <button
          onClick={() => setMapType("roadmap")}
          className={`px-4 py-2 text-sm transition-all ${
            mapType === "roadmap"
              ? "bg-white text-zinc-900 font-medium"
              : "bg-white/90 text-zinc-600 hover:bg-white"
          }`}
        >
          Map
        </button>
        <button
          onClick={() => setMapType("satellite")}
          className={`px-4 py-2 text-sm transition-all ${
            mapType === "satellite"
              ? "bg-white text-zinc-900 font-medium"
              : "bg-white/90 text-zinc-600 hover:bg-white"
          }`}
        >
          Satellite
        </button>
      </div>

      <button
        onClick={handleOpenInMaps}
        className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md text-sm font-medium text-[#0e4659] hover:bg-white transition-colors"
      >
        Open in Google Maps
      </button>
    </div>
  )
}
