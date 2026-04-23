"use client"

import { useRef, useState, useEffect } from "react"
import { MapPin, Search } from "lucide-react"
import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"
import { useGoogleMaps } from "@/components/providers/google-maps-provider"
import { useGoogleAutocomplete } from "@/hooks/use-google-autocomplete"
import { LocationDropdown } from "@/components/landing/booking/location-dropdown"
import type { LocationSuggestion } from "@/components/landing/booking/types"
import { Popover, PopoverContent, PopoverAnchor } from "@workspace/ui/components/popover"

export interface GooglePlaceValue {
  location: string
  placeId: string | null
  lat: number | null
  lng: number | null
}

interface GooglePlacesInputProps {
  value: GooglePlaceValue
  onChange: (next: GooglePlaceValue) => void
  placeholder?: string
  /** Shown in the iOS keyboard bar above the input; use e.g. "De onde?" so it doesn't show "home". */
  ariaLabel?: string
  className?: string
  variant?: "default" | "widget" | "new-widget" | "hero-inline" | "tours-hero" | "tours-hero-dark" | "tours-results"
  /** When true, render suggestions inline below the input (e.g. inside a bottom drawer). Drawer closes only on selection. */
  inlineDropdown?: boolean
  hideLeftIcon?: boolean
}

export function GooglePlacesInput({
  value,
  onChange,
  placeholder,
  ariaLabel,
  className,
  variant = "default",
  inlineDropdown = false,
  hideLeftIcon = false,
}: GooglePlacesInputProps) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [defaultSuggestions, setDefaultSuggestions] = useState<LocationSuggestion[]>([])
  const [isLoadingDefaults, setIsLoadingDefaults] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { isLoaded, hasKey } = useGoogleMaps()
  const { predictions, isLoading, fetchPredictions, getPlaceDetails, getDefaultSuggestions } = useGoogleAutocomplete()

  // In drawer (inlineDropdown): show suggestions as soon as the drawer opens, without needing to focus the input
  useEffect(() => {
    if (inlineDropdown) setShowDropdown(true)
  }, [inlineDropdown])

  // Load default suggestions when Google Maps is loaded
  useEffect(() => {
    if (isLoaded && hasKey && defaultSuggestions.length === 0 && !isLoadingDefaults) {
      setIsLoadingDefaults(true)
      getDefaultSuggestions().then((suggestions) => {
        setDefaultSuggestions(suggestions)
        setIsLoadingDefaults(false)
      })
    }
  }, [isLoaded, hasKey, getDefaultSuggestions, defaultSuggestions.length, isLoadingDefaults])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    onChange({ location: val, placeId: null, lat: null, lng: null })

    if (val.trim()) {
      fetchPredictions(val)
      setShowDropdown(true)
    } else {
      setShowDropdown(inlineDropdown)
    }
  }

  const handleSelectSuggestion = async (suggestion: LocationSuggestion) => {
    setShowDropdown(false)
    if (suggestion.placeId) {
      const details = await getPlaceDetails(suggestion.placeId)
      if (details) {
        onChange({
          location: details.address || suggestion.name,
          placeId: suggestion.placeId,
          lat: details.lat,
          lng: details.lng,
        })
      } else {
        onChange({
          location: suggestion.name,
          placeId: suggestion.placeId,
          lat: null,
          lng: null,
        })
      }
    } else {
      onChange({
        location: suggestion.name,
        placeId: null,
        lat: null,
        lng: null,
      })
    }
  }

  const isWidget = variant === "widget"
  const isNewWidget = variant === "new-widget"
  const isHeroInline = variant === "hero-inline"
  const isToursHero = variant === "tours-hero"
  const isToursHeroDark = variant === "tours-hero-dark"
  const isToursResults = variant === "tours-results"

  const triggerInput = (
    <div className="relative w-full h-full flex items-center">
      {isHeroInline ? (
        <input
          suppressHydrationWarning
          value={value.location}
          onChange={handleInputChange}
          onFocus={() => {
            if (value.location.trim()) {
              fetchPredictions(value.location)
            }
            setShowDropdown(true)
          }}
          placeholder={placeholder}
          className={cn(
            "w-full h-full pl-8 pr-4 bg-transparent border-0 focus:outline-none focus:ring-0 text-[14px] font-normal placeholder:text-[#696969]",
            !inlineDropdown && "truncate"
          )}
          style={{
            color: "white",
            caretColor: "#C9A96E"
          }}
        />
      ) : isToursResults ? (
        <div className="w-full h-full relative flex items-center gap-[12px]">
          <Search className="w-[24px] h-[24px] text-[#a2a2a2] shrink-0" />
          <input
            suppressHydrationWarning
            value={value.location}
            onChange={handleInputChange}
            onFocus={() => {
              if (value.location.trim()) {
                fetchPredictions(value.location)
              }
              setShowDropdown(true)
            }}
            placeholder={placeholder}
            className="flex-1 text-[16px] text-[#222] placeholder:text-[#a2a2a2] font-normal outline-none bg-transparent"
          />
        </div>
      ) : isToursHeroDark ? (
        <div className="w-full h-full relative flex items-center gap-2">
          {!hideLeftIcon && <Search className="w-[24px] h-[24px] text-[#C9A96E] shrink-0" />}
          <input
            suppressHydrationWarning
            value={value.location}
            onChange={handleInputChange}
            onFocus={() => {
              if (value.location.trim()) {
                fetchPredictions(value.location)
              }
              setShowDropdown(true)
            }}
            placeholder={placeholder}
            className="flex-1 text-[13px] text-white placeholder:text-[rgba(255,255,255,0.22)] font-normal outline-none bg-transparent"
            style={{ caretColor: "#C9A96E" }}
          />
        </div>
      ) : isToursHero ? (
        <div className="w-full h-full relative flex items-center">
          <MapPin className="w-[24px] h-[24px] text-[#a2a2a2] shrink-0" />
          <input
            suppressHydrationWarning
            value={value.location}
            onChange={handleInputChange}
            onFocus={() => {
              if (value.location.trim()) {
                fetchPredictions(value.location)
              }
              setShowDropdown(true)
            }}
            placeholder={placeholder}
            className="flex-1 ml-[9px] text-[14px] text-[#222] placeholder:text-[#a2a2a2] font-normal outline-none bg-transparent"
          />
        </div>
      ) : isNewWidget ? (
        <div
          className={cn(
            "w-full min-h-[52px] rounded-xl flex items-center gap-3 pl-4 pr-4 py-2 border bg-white",
            "border-[#e0e0e0] focus-within:border-[#27C7FF] focus-within:ring-2 focus-within:ring-[#27C7FF]/20 transition-colors"
          )}
        >
          <Search className="w-5 h-5 text-[#a2a2a2] shrink-0" aria-hidden />
          <input
            suppressHydrationWarning
            value={value.location}
            onChange={handleInputChange}
            onFocus={() => {
              if (value.location.trim()) {
                fetchPredictions(value.location)
                setShowDropdown(true)
              } else {
                setShowDropdown(true)
              }
            }}
            placeholder={placeholder}
            autoFocus={inlineDropdown}
            aria-label={ariaLabel}
            className={cn(
              "flex-1 min-w-0 bg-transparent border-0 focus:outline-none focus:ring-0 font-medium leading-[1.4] placeholder:text-[#808080]",
              inlineDropdown ? "text-[16px]" : "text-[14px] md:text-[15px]",
              !inlineDropdown && "truncate"
            )}
            style={{
              color: "#222",
              caretColor: "#27C7FF"
            }}
          />
        </div>
      ) : isWidget ? (
        <input
          suppressHydrationWarning
          value={value.location}
          onChange={handleInputChange}
          onFocus={() => {
            if (value.location.trim()) {
              fetchPredictions(value.location)
              setShowDropdown(true)
            }
          }}
          placeholder={placeholder}
          className="w-full h-full pl-12 pr-4 py-4 md:py-3 bg-transparent border-0 focus:outline-none focus:ring-0 text-sm font-medium"
          style={{
            color: "var(--theme-hero-booking-input-text, #1A1A1A)",
            caretColor: "var(--theme-hero-booking-accent, #27C7FF)"
          }}
        />
      ) : (
        <div className="relative w-full">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#bfbfbf] z-10">
            <MapPin className="w-5 h-5" />
          </div>
          <Input
            suppressHydrationWarning
            value={value.location}
            onChange={handleInputChange}
            onFocus={() => {
              if (value.location.trim()) {
                fetchPredictions(value.location)
                setShowDropdown(true)
              } else {
                // Show default suggestions when field is empty and focused
                setShowDropdown(true)
              }
            }}
            placeholder={placeholder}
            className="pl-10 h-12 border-[#e0e0e0] text-[#222222] placeholder:text-[#a2a2a2] focus-visible:ring-[#27c7ff] w-full"
          />
        </div>
      )}
    </div>
  )

  if (!hasKey || !isLoaded) {
    return <div className={cn("relative", className)}>{triggerInput}</div>
  }

  if (inlineDropdown) {
    return (
      <div
        className={cn("relative flex flex-col min-h-0 flex-1", className)}
        ref={containerRef}
      >
        <div className="relative w-full shrink-0">{triggerInput}</div>
        {showDropdown && (
          <div className="relative w-full mt-2 flex-1 min-h-[200px] overflow-hidden flex flex-col">
            <LocationDropdown
              inline
              suggestions={value.location.trim() ? predictions : defaultSuggestions}
              isLoading={value.location.trim() ? isLoading : isLoadingDefaults}
              onSelect={handleSelectSuggestion}
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div 
      className={cn(
        "relative h-full", 
        showDropdown && "z-[100]",
        className
      )} 
      ref={containerRef}
    >
      <Popover open={showDropdown} onOpenChange={setShowDropdown}>
        <PopoverAnchor asChild>
          {triggerInput}
        </PopoverAnchor>
        <PopoverContent
          side="bottom"
          align="start"
          sideOffset={8}
          className="p-0 border-none bg-transparent shadow-none w-[var(--radix-popover-trigger-width)] min-w-[300px]"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <LocationDropdown
            suggestions={value.location.trim() ? predictions : defaultSuggestions}
            isLoading={value.location.trim() ? isLoading : isLoadingDefaults}
            onSelect={handleSelectSuggestion}
            dark={isHeroInline || isToursHeroDark}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

