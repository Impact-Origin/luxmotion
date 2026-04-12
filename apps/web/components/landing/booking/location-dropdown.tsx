"use client"

import { forwardRef } from "react"
import type { LocationSuggestion } from "./types"
import { cn } from "@workspace/ui/lib/utils"

interface LocationDropdownProps {
  suggestions: LocationSuggestion[]
  onSelect: (suggestion: LocationSuggestion) => void
  isLoading?: boolean
  inline?: boolean
  dark?: boolean
}

export const LocationDropdown = forwardRef<HTMLDivElement, LocationDropdownProps>(
  ({ suggestions, onSelect, isLoading, inline, dark }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "z-[100] overflow-hidden",
          inline
            ? "relative flex-1 min-h-0 flex flex-col bg-transparent"
            : cn(
                "absolute top-full left-0 right-0 mt-2 shadow-[0_10px_40px_rgba(0,0,0,0.25)] border animate-in fade-in slide-in-from-top-2 duration-200",
                dark ? "bg-[#1e1d1b] border-[rgba(255,255,255,0.12)] rounded-none" : "bg-white border-gray-100 rounded-2xl"
              )
        )}
      >
        <div
          className={cn("overflow-y-auto py-2 custom-scrollbar", inline ? "flex-1 min-h-0 -mx-4 px-4" : "max-h-[320px]")}
          style={inline ? { touchAction: "pan-y" } : undefined}
        >
          {isLoading && suggestions.length === 0 && (
            <div className="px-4 py-8 text-center">
              <div className={cn("inline-block w-6 h-6 border-2 border-t-transparent rounded-full animate-spin mb-2", dark ? "border-[#C9A96E]" : "border-[#29C5F6]")} />
              <p className={cn("text-xs font-medium", dark ? "text-[rgba(255,255,255,0.4)]" : "text-gray-400")}>Searching locations...</p>
            </div>
          )}

          {!isLoading && suggestions.length === 0 && (
            <div className={cn("px-4 py-8 text-center", dark ? "text-[rgba(255,255,255,0.4)]" : "text-gray-400")}>
              <p className="text-xs font-medium">No locations found</p>
            </div>
          )}

          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.placeId || index}
              type="button"
              onClick={() => onSelect(suggestion)}
              className={cn(
                "w-full flex items-start gap-4 py-3.5 transition-all duration-150 group text-left touch-manipulation",
                dark
                  ? cn("hover:bg-[rgba(255,255,255,0.06)]", inline ? "px-0 border-b border-[rgba(255,255,255,0.06)] last:border-0" : "px-4 border-b border-[rgba(255,255,255,0.06)] last:border-0")
                  : cn("hover:bg-[#F8FDFF]", inline ? "px-0 border-b border-gray-100/80 last:border-0" : "px-4 border-b border-gray-50 last:border-0")
              )}
            >
              <div className={cn(
                "mt-0.5 shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                dark ? "bg-[rgba(255,255,255,0.06)] group-hover:bg-[rgba(201,169,110,0.15)]" : "bg-gray-100/80 group-hover:bg-[#E9F9FF]"
              )}>
                <suggestion.icon className={cn("w-4 h-4 transition-colors", dark ? "text-[rgba(255,255,255,0.4)] group-hover:text-[#C9A96E]" : "text-gray-400 group-hover:text-[#29C5F6]")} />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className={cn("text-[14px] font-semibold leading-tight transition-colors truncate", dark ? "text-white group-hover:text-[#C9A96E]" : "text-gray-900 group-hover:text-[#29C5F6]")}>
                  {suggestion.name}
                </span>
                {suggestion.description && (
                  <span className={cn("text-[12px] font-medium mt-1 truncate", dark ? "text-[rgba(255,255,255,0.35)]" : "text-gray-400")}>
                    {suggestion.description}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
        <div className={cn(
          "px-4 py-2 flex justify-end flex-shrink-0",
          inline ? "bg-transparent" : dark ? "bg-[rgba(255,255,255,0.03)]" : "bg-gray-50"
        )}>
          <img
            src={dark ? "https://maps.gstatic.com/mapfiles/api-3/images/powered-by-google-on-non-white3.png" : "https://maps.gstatic.com/mapfiles/api-3/images/powered-by-google-on-white3.png"}
            alt="Powered by Google"
            className="h-3 opacity-50"
          />
        </div>
      </div>
    )
  }
)

LocationDropdown.displayName = "LocationDropdown"

