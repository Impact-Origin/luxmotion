"use client"

import * as React from "react"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { MapPin, Loader2 } from "lucide-react"
import { useGoogleMaps } from "@/components/providers/google-maps-provider"
import { useGoogleAutocomplete } from "@/hooks/use-google-autocomplete"
import type { LocationSuggestion } from "@/components/landing/booking/types"
import { cn } from "@workspace/ui/lib/utils"

interface GoogleMapsInputProps {
  value: {
    title: string
    address: string
    description?: string
    lat?: number
    lng?: number
    placeId?: string
  } | null
  onChange: (value: {
    title: string
    address: string
    description?: string
    lat?: number
    lng?: number
    placeId?: string
  }) => void
  label?: string
  disabled?: boolean
}

export function GoogleMapsInput({
  value,
  onChange,
  label = "Location",
  disabled = false,
}: GoogleMapsInputProps) {
  const [localTitle, setLocalTitle] = React.useState(value?.title || "")
  const [localAddress, setLocalAddress] = React.useState(value?.address || "")
  const [localDescription, setLocalDescription] = React.useState(value?.description || "")
  const [showDropdown, setShowDropdown] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const { isLoaded, hasKey } = useGoogleMaps()
  const { predictions, isLoading, fetchPredictions, getPlaceDetails } = useGoogleAutocomplete()

  React.useEffect(() => {
    setLocalTitle(value?.title || "")
    setLocalAddress(value?.address || "")
    setLocalDescription(value?.description || "")
  }, [value])

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setLocalTitle(newTitle)
    onChange({
      title: newTitle,
      address: localAddress,
      description: localDescription || undefined,
      lat: value?.lat,
      lng: value?.lng,
      placeId: value?.placeId,
    })
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value
    setLocalAddress(newAddress)
    onChange({
      title: localTitle,
      address: newAddress,
      description: localDescription || undefined,
      lat: undefined,
      lng: undefined,
      placeId: undefined,
    })

    if (newAddress.trim() && isLoaded && hasKey) {
      fetchPredictions(newAddress)
      setShowDropdown(true)
    } else {
      setShowDropdown(false)
    }
  }

  const handleSelectSuggestion = async (suggestion: LocationSuggestion) => {
    setShowDropdown(false)

    if (suggestion.placeId) {
      const details = await getPlaceDetails(suggestion.placeId)
      if (details) {
        const fullAddress = details.address || `${suggestion.name}, ${suggestion.description || ""}`
        setLocalAddress(fullAddress)
        if (!localTitle) {
          setLocalTitle(suggestion.name)
        }
        onChange({
          title: localTitle || suggestion.name,
          address: fullAddress,
          description: localDescription || undefined,
          lat: details.lat,
          lng: details.lng,
          placeId: suggestion.placeId,
        })
      }
    } else {
      const fullAddress = `${suggestion.name}${suggestion.description ? `, ${suggestion.description}` : ""}`
      setLocalAddress(fullAddress)
      onChange({
        title: localTitle || suggestion.name,
        address: fullAddress,
        description: localDescription || undefined,
      })
    }
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDescription = e.target.value
    setLocalDescription(newDescription)
    onChange({
      title: localTitle,
      address: localAddress,
      description: newDescription || undefined,
      lat: value?.lat,
      lng: value?.lng,
      placeId: value?.placeId,
    })
  }

  return (
    <div className="space-y-3">
      <Label className="text-sm font-semibold flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        {label}
      </Label>

      <div className="space-y-3 p-4 rounded-lg border border-zinc-200 bg-zinc-50/50">
        <div className="space-y-2">
          <Label className="text-xs text-zinc-600">Title</Label>
          <Input
            value={localTitle}
            onChange={handleTitleChange}
            placeholder="e.g., Hard Rock Café"
            disabled={disabled}
            className="h-10 bg-white"
          />
        </div>

        <div className="space-y-2 relative" ref={containerRef}>
          <Label className="text-xs text-zinc-600">Address</Label>
          <div className="relative">
            <Input
              value={localAddress}
              onChange={handleAddressChange}
              onFocus={() => {
                if (localAddress.trim() && isLoaded && hasKey) {
                  fetchPredictions(localAddress)
                  setShowDropdown(true)
                }
              }}
              placeholder="Search for an address..."
              disabled={disabled}
              className="h-10 bg-white pr-10"
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
              </div>
            )}
          </div>

          {showDropdown && (isLoading || predictions.length > 0) && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-zinc-200 shadow-lg z-50 overflow-hidden">
              <div className="max-h-[240px] overflow-y-auto">
                {isLoading && predictions.length === 0 && (
                  <div className="px-4 py-6 text-center">
                    <Loader2 className="h-5 w-5 animate-spin text-zinc-400 mx-auto mb-2" />
                    <p className="text-xs text-zinc-500">Searching...</p>
                  </div>
                )}

                {predictions.map((suggestion, index) => (
                  <button
                    key={suggestion.placeId || index}
                    type="button"
                    onClick={() => handleSelectSuggestion(suggestion)}
                    className="w-full flex items-start gap-3 px-4 py-3 hover:bg-zinc-50 transition-colors text-left border-b border-zinc-100 last:border-0"
                  >
                    <div className="mt-0.5 shrink-0 w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center">
                      <suggestion.icon className="w-4 h-4 text-zinc-500" />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-sm font-medium text-zinc-900 truncate">
                        {suggestion.name}
                      </span>
                      {suggestion.description && (
                        <span className="text-xs text-zinc-500 mt-0.5 truncate">
                          {suggestion.description}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <div className="bg-zinc-50 px-3 py-1.5 flex justify-end border-t border-zinc-100">
                <img
                  src="https://maps.gstatic.com/mapfiles/api-3/images/powered-by-google-on-white3.png"
                  alt="Powered by Google"
                  className="h-3 opacity-50"
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-zinc-600">Description (optional)</Label>
          <Input
            value={localDescription}
            onChange={handleDescriptionChange}
            placeholder="Additional directions..."
            disabled={disabled}
            className="h-10 bg-white"
          />
        </div>

        {value?.lat && value?.lng && (
          <div className="text-xs text-zinc-500 pt-2 border-t border-zinc-200 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded">
              <MapPin className="h-3 w-3" />
              Coordinates verified
            </span>
            <span className="text-zinc-400">
              {value.lat.toFixed(6)}, {value.lng.toFixed(6)}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
