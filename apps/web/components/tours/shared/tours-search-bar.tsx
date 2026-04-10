"use client"

import { Search } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { GooglePlacesInput, type GooglePlaceValue } from "@/components/ui/google-places-input"

interface ToursSearchBarProps {
  value: GooglePlaceValue
  onChange: (value: GooglePlaceValue) => void
  onSearch: (value?: GooglePlaceValue) => void
  placeholder?: string
  className?: string
}

export function ToursSearchBar({ value, onChange, onSearch, placeholder, className }: ToursSearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch()
    }
  }

  const handleChange = (next: GooglePlaceValue) => {
    onChange(next)
    if (next.lat !== null && next.lng !== null) {
      onSearch(next)
    }
  }

  return (
    <div
      className={cn(
        "bg-white border border-[#bfbfbf] rounded-[53px] h-[56px] w-full flex items-center px-[16px] gap-[9px]",
        className
      )}
      onKeyDown={handleKeyDown}
    >
      <GooglePlacesInput
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        variant="tours-hero"
        className="flex-1"
      />
      <button
        onClick={() => onSearch()}
        className="shrink-0 hover:opacity-70 transition-opacity"
        aria-label="Search"
      >
        <Search className="w-[24px] h-[24px] text-[#a2a2a2]" />
      </button>
    </div>
  )
}
