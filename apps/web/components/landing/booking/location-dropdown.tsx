"use client"

import { forwardRef } from "react"
import type { LocationSuggestion } from "./types"
import { cn } from "@workspace/ui/lib/utils"

interface LocationDropdownProps {
  suggestions: LocationSuggestion[]
  onSelect: (suggestion: LocationSuggestion) => void
  isLoading?: boolean
  /** When true, render in document flow (e.g. inside drawer below input) instead of absolute. */
  inline?: boolean
}

export const LocationDropdown = forwardRef<HTMLDivElement, LocationDropdownProps>(
  ({ suggestions, onSelect, isLoading, inline }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "z-[100] overflow-hidden",
          inline
            ? "relative flex-1 min-h-0 flex flex-col bg-transparent"
            : "absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200"
        )}
      >
        <div
          className={cn("overflow-y-auto py-2 custom-scrollbar", inline ? "flex-1 min-h-0 -mx-4 px-4" : "max-h-[320px]")}
          style={inline ? { touchAction: "pan-y" } : undefined}
        >
          {isLoading && suggestions.length === 0 && (
            <div className="px-4 py-8 text-center">
              <div className="inline-block w-6 h-6 border-2 border-[#29C5F6] border-t-transparent rounded-full animate-spin mb-2" />
              <p className="text-xs text-gray-400 font-medium">Searching locations...</p>
            </div>
          )}
          
          {!isLoading && suggestions.length === 0 && (
            <div className="px-4 py-8 text-center text-gray-400">
              <p className="text-xs font-medium">No locations found</p>
            </div>
          )}

          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.placeId || index}
              type="button"
              onClick={() => onSelect(suggestion)}
              className={cn(
                "w-full flex items-start gap-4 py-3.5 hover:bg-[#F8FDFF] transition-all duration-150 group text-left touch-manipulation",
                inline ? "px-0 border-b border-gray-100/80 last:border-0" : "px-4 border-b border-gray-50 last:border-0"
              )}
            >
              <div className="mt-0.5 shrink-0 w-8 h-8 rounded-full bg-gray-100/80 flex items-center justify-center group-hover:bg-[#E9F9FF] transition-colors">
                <suggestion.icon className="w-4 h-4 text-gray-400 group-hover:text-[#29C5F6] transition-colors" />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-[14px] font-semibold text-gray-900 leading-tight group-hover:text-[#29C5F6] transition-colors truncate">
                  {suggestion.name}
                </span>
                {suggestion.description && (
                  <span className="text-[12px] font-medium text-gray-400 mt-1 truncate">
                    {suggestion.description}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
        <div className={cn(
          "px-4 py-2 flex justify-end flex-shrink-0",
          inline ? "bg-transparent" : "bg-gray-50"
        )}>
          <img 
            src="https://maps.gstatic.com/mapfiles/api-3/images/powered-by-google-on-white3.png" 
            alt="Powered by Google"
            className="h-3 opacity-50"
          />
        </div>
      </div>
    )
  }
)

LocationDropdown.displayName = "LocationDropdown"

