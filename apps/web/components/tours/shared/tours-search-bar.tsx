"use client"

import { useTranslations } from "next-intl"
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
  const t = useTranslations("toursHero")

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
        "flex flex-col w-full max-w-[552px]",
        className
      )}
      onKeyDown={handleKeyDown}
    >
      <div className="w-full min-w-0 h-[56px] bg-[#1e1d1b] border border-[rgba(255,255,255,0.12)] flex items-center">
        <GooglePlacesInput
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          variant="tours-hero-dark"
          className="flex-1 h-full"
        />
      </div>
      <button
        onClick={() => onSearch()}
        className="w-full h-[56px] bg-[#c9a96e] border border-[#c9a96e] flex items-center justify-center transition-colors hover:bg-[#b8954f]"
      >
        <span className="text-[14px] font-medium text-[#0d0d0d] tracking-[1.1px] uppercase whitespace-nowrap">
          {t("redesign.searchButton")}
        </span>
      </button>
    </div>
  )
}
