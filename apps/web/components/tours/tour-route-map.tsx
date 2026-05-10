"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useGoogleMaps } from "@/components/providers/google-maps-provider"
import { Loader2 } from "lucide-react"

interface Location {
  title: string
  lat: number
  lng: number
  type: "pickup" | "stop" | "dropoff"
  order?: number
}

interface TourRouteMapProps {
  pickup?: { title: string; lat?: number; lng?: number }
  dropoff?: { title: string; lat?: number; lng?: number }
  stops?: { title: string; lat?: number; lng?: number }[]
  className?: string
}

export function TourRouteMap({ pickup, dropoff, stops, className }: TourRouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const infoWindowsRef = useRef<Map<string, google.maps.InfoWindow>>(new Map())
  const polylineRef = useRef<google.maps.Polyline | null>(null)
  const { isLoaded, hasKey } = useGoogleMaps()
  const [mapType, setMapType] = useState<"roadmap" | "satellite">("roadmap")

  const focusOnPoint = useCallback((type: "pickup" | "dropoff", lat: number, lng: number) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo({ lat, lng })
      mapInstanceRef.current.setZoom(16)

      const infoWindow = infoWindowsRef.current.get(type)
      const marker = markersRef.current.find(m => m.getTitle()?.includes(type === "pickup" ? "Pickup" : "Dropoff") || m.get("locationType") === type)
      if (infoWindow && marker) {
        infoWindowsRef.current.forEach(iw => iw.close())
        infoWindow.open(mapInstanceRef.current, marker)
      }
    }
  }, [])

  useEffect(() => {
    const handleFocusEvent = (e: CustomEvent<{ type: "pickup" | "dropoff"; lat: number; lng: number }>) => {
      focusOnPoint(e.detail.type, e.detail.lat, e.detail.lng)
    }

    window.addEventListener("tour-map-focus" as any, handleFocusEvent)
    return () => window.removeEventListener("tour-map-focus" as any, handleFocusEvent)
  }, [focusOnPoint])

  const locations: Location[] = []

  if (pickup?.lat && pickup?.lng) {
    locations.push({ title: pickup.title, lat: pickup.lat, lng: pickup.lng, type: "pickup" })
  }

  stops?.forEach((stop, index) => {
    if (stop.lat && stop.lng) {
      locations.push({ title: stop.title, lat: stop.lat, lng: stop.lng, type: "stop", order: index + 1 })
    }
  })

  if (dropoff?.lat && dropoff?.lng) {
    locations.push({ title: dropoff.title, lat: dropoff.lat, lng: dropoff.lng, type: "dropoff" })
  }

  useEffect(() => {
    if (!isLoaded || !hasKey || !mapRef.current || locations.length === 0) return

    if (!mapInstanceRef.current) {
      const bounds = new google.maps.LatLngBounds()
      locations.forEach((loc) => bounds.extend({ lat: loc.lat, lng: loc.lng }))

      const map = new google.maps.Map(mapRef.current, {
        zoom: 12,
        center: bounds.getCenter(),
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

      map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 })
      mapInstanceRef.current = map
    }

    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current = []

    if (polylineRef.current) {
      polylineRef.current.setMap(null)
    }

    const path: google.maps.LatLngLiteral[] = []

    locations.forEach((location) => {
      path.push({ lat: location.lat, lng: location.lng })

      let icon: google.maps.Symbol | google.maps.Icon
      let label: google.maps.MarkerLabel | undefined

      if (location.type === "pickup") {
        icon = {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: "#22c55e",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 3,
        }
        label = { text: "P", color: "#ffffff", fontSize: "11px", fontWeight: "bold" }
      } else if (location.type === "dropoff") {
        icon = {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: "#ef4444",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 3,
        }
        label = { text: "D", color: "#ffffff", fontSize: "11px", fontWeight: "bold" }
      } else {
        icon = {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: "#27c7ff",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 3,
        }
        label = location.order
          ? { text: String(location.order), color: "#ffffff", fontSize: "11px", fontWeight: "bold" }
          : undefined
      }

      const marker = new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: mapInstanceRef.current,
        icon,
        label,
        title: location.title,
      })
      marker.set("locationType", location.type)

      const typeConfig = {
          pickup: { label: "Pickup Point", color: "#22c55e", icon: "P" },
          dropoff: { label: "Dropoff Point", color: "#ef4444", icon: "D" },
          stop: { label: `Stop ${location.order}`, color: "#27c7ff", icon: String(location.order || "") },
        }
        const config = typeConfig[location.type]

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="
              padding: 0;
              min-width: 220px;
              max-width: 320px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            ">
              <div style="
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 14px 44px 14px 16px;
              ">
                <div style="
                  width: 36px;
                  height: 36px;
                  border-radius: 50%;
                  background: ${config.color};
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  flex-shrink: 0;
                  box-shadow: 0 2px 8px ${config.color}40;
                ">
                  <span style="color: white; font-weight: 700; font-size: 14px;">${config.icon}</span>
                </div>
                <div style="flex: 1; min-width: 0;">
                  <p style="
                    margin: 0;
                    font-weight: 600;
                    font-size: 15px;
                    color: #0c171c;
                    line-height: 1.3;
                    word-wrap: break-word;
                  ">${location.title}</p>
                  <p style="
                    margin: 3px 0 0;
                    font-size: 12px;
                    color: ${config.color};
                    font-weight: 500;
                  ">${config.label}</p>
                </div>
              </div>
            </div>
          `,
        })

      if (location.type === "pickup" || location.type === "dropoff") {
        infoWindowsRef.current.set(location.type, infoWindow)
      }

      marker.addListener("click", () => {
        infoWindow.open(mapInstanceRef.current, marker)
      })

      markersRef.current.push(marker)
    })

    if (path.length > 1) {
      const polyline = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: "#27c7ff",
        strokeOpacity: 0.9,
        strokeWeight: 4,
      })
      polyline.setMap(mapInstanceRef.current)
      polylineRef.current = polyline
    }
  }, [isLoaded, hasKey, locations.length, locations, mapType])

  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setMapTypeId(mapType)
    }
  }, [mapType])

  if (!hasKey) {
    return (
      <div className={`bg-zinc-100 flex items-center justify-center ${className}`}>
        <span className="text-zinc-500">Map unavailable</span>
      </div>
    )
  }

  if (locations.length === 0) {
    return (
      <div className={`bg-zinc-100 flex items-center justify-center ${className}`}>
        <span className="text-zinc-500">No locations to display</span>
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
        .gm-style-iw-chr button span {
          margin: 0 !important;
        }
        .gm-ui-hover-effect {
          opacity: 1 !important;
        }
        .gm-ui-hover-effect > span {
          background-color: #6b7280 !important;
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

      <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow" />
            <span className="text-zinc-700">Pickup</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#27c7ff] border-2 border-white shadow" />
            <span className="text-zinc-700">Stops</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 border-2 border-white shadow" />
            <span className="text-zinc-700">Dropoff</span>
          </div>
        </div>
      </div>
    </div>
  )
}
