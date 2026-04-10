"use client"

import { useState, useMemo, useCallback, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from "@workspace/ui/components/popover"
import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"
import { COUNTRY_OPTIONS, type CountryOption } from "@/lib/countries"

interface CountryComboboxProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  emptyLabel?: string
  className?: string
  inputClassName?: string
}

function normalizeForSearch(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}

function matchesSearch(country: CountryOption, search: string): boolean {
  const normalized = normalizeForSearch(search)
  if (!normalized) return true
  const labelNorm = normalizeForSearch(country.label)
  const valueNorm = normalizeForSearch(country.value)
  return labelNorm.includes(normalized) || valueNorm.includes(normalized)
}

export function CountryCombobox({
  value,
  onChange,
  placeholder = "Nationality",
  emptyLabel = "— Nationality (optional)",
  className,
  inputClassName,
}: CountryComboboxProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return COUNTRY_OPTIONS
    return COUNTRY_OPTIONS.filter((c) => matchesSearch(c, search))
  }, [search])

  const selectedCountry = useMemo(
    () => COUNTRY_OPTIONS.find((c) => c.value === value),
    [value]
  )

  const displayValue = selectedCountry
    ? `${selectedCountry.flag} ${selectedCountry.label}`
    : ""

  const handleSelect = useCallback(
    (countryValue: string) => {
      onChange(countryValue)
      setSearch("")
      setOpen(false)
    },
    [onChange]
  )

  const handleClear = useCallback(() => {
    onChange("")
    setSearch("")
    setOpen(false)
  }, [onChange])

  const handleOpenChange = useCallback((next: boolean) => {
    setOpen(next)
    if (!next) setSearch("")
  }, [])

  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
    }
  }, [open])

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverAnchor asChild>
        <div className={cn("relative w-full cursor-text", className)}>
          <Input
            ref={inputRef}
            value={open ? search : displayValue}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              if (open && e.key === "Enter") e.preventDefault()
            }}
            placeholder={placeholder}
            readOnly={!open}
            className={cn(
              "w-full h-[48px] px-4 pr-10 bg-white border border-[#dedede] rounded-[8px] text-[14px] text-[#0c171c] placeholder:!text-[#9ca3af] focus:border-[#27c7ff] focus:outline-none transition-colors",
              inputClassName
            )}
          />
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-[#9ca3af] pointer-events-none"
            aria-hidden
          />
        </div>
      </PopoverAnchor>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0 max-h-[280px] overflow-hidden flex flex-col bg-white shadow-lg"
        align="start"
        sideOffset={4}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="overflow-y-auto max-h-[280px] py-1">
          <button
            type="button"
            onClick={handleClear}
            className={cn(
              "w-full px-3 py-2 text-left text-[14px] text-[#9ca3af] hover:bg-[#f5f5f5] transition-colors",
              !value && "bg-[#f5f5f5]"
            )}
          >
            {emptyLabel}
          </button>
          {filteredOptions.map((country) => (
            <button
              key={country.code}
              type="button"
              onClick={() => handleSelect(country.value)}
              className={cn(
                "w-full px-3 py-2 text-left text-[14px] flex items-center gap-2 hover:bg-[#f5f5f5] transition-colors",
                value === country.value && "bg-[#e8f7fc] text-[#0e4659]"
              )}
            >
              <span className="text-[16px]">{country.flag}</span>
              {country.label}
            </button>
          ))}
          {filteredOptions.length === 0 && (
            <div className="px-3 py-4 text-[14px] text-[#9ca3af] text-center">
              No results
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
