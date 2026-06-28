"use client"

import * as React from "react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { ImageUpload } from "./image-upload"
import {
  Plus,
  Trash2,
  GripVertical,
  Clock,
  MapPin,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { useGoogleMaps } from "@/components/providers/google-maps-provider"
import { useGoogleAutocomplete } from "@/hooks/use-google-autocomplete"
import type { LocationSuggestion } from "@/components/landing/booking/types"

interface TourStop {
  _id?: string
  time: string
  title: string
  description?: string
  imageId?: string
  imageUrl?: string
  showImage: boolean
  address?: string
  placeId?: string
  lat?: number
  lng?: number
  order: number
}

interface TourStopsBuilderProps {
  tourId?: string
  stops: TourStop[]
  onChange: (stops: TourStop[]) => void
  disabled?: boolean
}

function AddressAutocomplete({
  value,
  onChange,
  disabled,
}: {
  value: string
  onChange: (address: string, placeId?: string, lat?: number, lng?: number) => void
  disabled?: boolean
}) {
  const [showDropdown, setShowDropdown] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const { isLoaded, hasKey } = useGoogleMaps()
  const { predictions, isLoading, fetchPredictions, getPlaceDetails } = useGoogleAutocomplete()

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue, undefined, undefined, undefined)

    if (newValue.trim() && isLoaded && hasKey) {
      fetchPredictions(newValue)
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
        onChange(details.address || suggestion.name, suggestion.placeId, details.lat, details.lng)
      } else {
        onChange(suggestion.name, suggestion.placeId)
      }
    } else {
      onChange(suggestion.name)
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <Input
          value={value}
          onChange={handleInputChange}
          onFocus={() => {
            if (value.trim() && isLoaded && hasKey) {
              fetchPredictions(value)
              setShowDropdown(true)
            }
          }}
          placeholder="Search for location..."
          disabled={disabled}
          className="h-10 pr-10"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {showDropdown && (isLoading || predictions.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card rounded-lg border border-border shadow-lg z-50 overflow-hidden">
          <div className="max-h-[200px] overflow-y-auto">
            {isLoading && predictions.length === 0 && (
              <div className="px-4 py-4 text-center">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Searching...</p>
              </div>
            )}

            {predictions.map((suggestion, index) => (
              <button
                key={suggestion.placeId || index}
                type="button"
                onClick={() => handleSelectSuggestion(suggestion)}
                className="w-full flex items-start gap-2 px-3 py-2 hover:bg-accent transition-colors text-left border-b border-border last:border-0"
              >
                <div className="mt-0.5 shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                  <suggestion.icon className="w-3 h-3 text-muted-foreground" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-sm font-medium text-foreground truncate">
                    {suggestion.name}
                  </span>
                  {suggestion.description && (
                    <span className="text-xs text-muted-foreground truncate">
                      {suggestion.description}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
          <div className="bg-muted px-2 py-1 flex justify-end border-t border-border">
            <img
              src="https://maps.gstatic.com/mapfiles/api-3/images/powered-by-google-on-white3.png"
              alt="Powered by Google"
              className="h-2.5 opacity-50"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export function TourStopsBuilder({
  tourId,
  stops,
  onChange,
  disabled = false,
}: TourStopsBuilderProps) {
  const [expandedStop, setExpandedStop] = React.useState<number | null>(null)
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null)

  const addStop = () => {
    const newStop: TourStop = {
      time: "",
      title: "",
      description: "",
      showImage: false,
      order: stops.length,
    }
    onChange([...stops, newStop])
    setExpandedStop(stops.length)
  }

  const removeStop = (index: number) => {
    const newStops = stops.filter((_, i) => i !== index).map((stop, i) => ({
      ...stop,
      order: i,
    }))
    onChange(newStops)
    setExpandedStop(null)
  }

  const updateStop = (index: number, updates: Partial<TourStop>) => {
    const newStops = stops.map((stop, i) =>
      i === index ? { ...stop, ...updates } : stop
    )
    onChange(newStops)
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newStops = [...stops]
    const draggedStop = newStops[draggedIndex]
    if (!draggedStop) return
    newStops.splice(draggedIndex, 1)
    newStops.splice(index, 0, draggedStop)

    const reorderedStops = newStops.map((stop, i) => ({ ...stop, order: i }))
    onChange(reorderedStops)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const moveStop = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === stops.length - 1)
    ) {
      return
    }

    const newIndex = direction === "up" ? index - 1 : index + 1
    const newStops = [...stops]
    const temp = newStops[index]
    const targetStop = newStops[newIndex]
    if (!temp || !targetStop) return
    newStops[index] = targetStop
    newStops[newIndex] = temp

    const reorderedStops = newStops.map((stop, i) => ({ ...stop, order: i }))
    onChange(reorderedStops)

    if (expandedStop === index) {
      setExpandedStop(newIndex)
    } else if (expandedStop === newIndex) {
      setExpandedStop(index)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-bold">Itinerary Stops</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addStop}
          disabled={disabled}
          className="h-9"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Stop
        </Button>
      </div>

      {stops.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-border rounded-lg">
          No stops added yet. Click "Add Stop" to create an itinerary.
        </div>
      ) : (
        <div className="space-y-2">
          {stops.map((stop, index) => (
            <div
              key={index}
              draggable={!disabled}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={cn(
                "border rounded-lg bg-card transition-all",
                draggedIndex === index && "opacity-50",
                expandedStop === index ? "border-border" : "border-border"
              )}
            >
              <div
                className="flex items-center gap-3 p-3 cursor-pointer"
                onClick={() => setExpandedStop(expandedStop === index ? null : index)}
              >
                <div
                  className="cursor-grab active:cursor-grabbing p-1 hover:bg-accent rounded"
                  onClick={(e) => e.stopPropagation()}
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                </div>

                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground min-w-[60px]">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  {stop.time || "--:--"}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {stop.title || "Untitled stop"}
                  </p>
                  {stop.address && (
                    <p className="text-xs text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" />
                      {stop.address}
                      {stop.lat && stop.lng && (
                        <span className="text-green-600 ml-1">✓</span>
                      )}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      moveStop(index, "up")
                    }}
                    disabled={disabled || index === 0}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      moveStop(index, "down")
                    }}
                    disabled={disabled || index === stops.length - 1}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeStop(index)
                    }}
                    disabled={disabled}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {expandedStop === index && (
                <div className="px-4 pb-4 pt-2 border-t border-border space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs">Time</Label>
                      <Input
                        type="time"
                        value={stop.time}
                        onChange={(e) => updateStop(index, { time: e.target.value })}
                        disabled={disabled}
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Title *</Label>
                      <Input
                        value={stop.title}
                        onChange={(e) => updateStop(index, { title: e.target.value })}
                        placeholder="Stop title..."
                        disabled={disabled}
                        className="h-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Description</Label>
                    <Textarea
                      value={stop.description || ""}
                      onChange={(e) => updateStop(index, { description: e.target.value })}
                      placeholder="Describe this stop..."
                      disabled={disabled}
                      className="min-h-[80px] resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      Address (optional)
                    </Label>
                    <AddressAutocomplete
                      value={stop.address || ""}
                      onChange={(address, placeId, lat, lng) =>
                        updateStop(index, { address, placeId, lat, lng })
                      }
                      disabled={disabled}
                    />
                    {stop.lat && stop.lng && (
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Coordinates: {stop.lat.toFixed(5)}, {stop.lng.toFixed(5)}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Checkbox
                        checked={stop.showImage}
                        onCheckedChange={(checked) =>
                          updateStop(index, { showImage: checked as boolean })
                        }
                        disabled={disabled}
                      />
                      <span className="text-sm text-muted-foreground">Show image for this stop</span>
                    </label>

                    {stop.showImage && (
                      <ImageUpload
                        value={stop.imageUrl || null}
                        onChange={(id) => updateStop(index, { imageId: id })}
                        disabled={disabled}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
