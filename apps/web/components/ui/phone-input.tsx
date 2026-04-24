"use client"

import { useState, useRef, useEffect, useLayoutEffect } from "react"
import { createPortal } from "react-dom"
import { defaultCountries, parseCountry, FlagImage, CountryIso2 } from "react-international-phone"
import { ChevronDown } from "lucide-react"

interface PhoneInputProps {
  value?: string
  onChange?: (value: string) => void
  defaultCountry?: CountryIso2
  placeholder?: string
  autoComplete?: string
  dark?: boolean
}

const allCountries = defaultCountries.map((country) => parseCountry(country))

const validateNumber = (input: string, country: typeof allCountries[0]) => {
  const digitsOnly = input.replace(/[^\d]/g, "")
  let normalized = digitsOnly.startsWith(country.dialCode) ? digitsOnly.slice(country.dialCode.length) : digitsOnly

  return { normalized, warning: "" }
}

export function PhoneInput({
  value = "",
  onChange,
  defaultCountry = "pt",
  placeholder = "",
  autoComplete = "tel",
  dark = false,
}: PhoneInputProps) {
  const defaultSelectedCountry =
    allCountries.find((c) => c.iso2 === defaultCountry) || allCountries.find((c) => c.iso2 === "pt")!
  const [selectedCountry, setSelectedCountry] = useState(defaultSelectedCountry)
  const initialNormalized = validateNumber(value, defaultSelectedCountry).normalized
  const [phoneNumber, setPhoneNumber] = useState(initialNormalized)
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [warning, setWarning] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [popoverPos, setPopoverPos] = useState<{ top: number; left: number } | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        containerRef.current && !containerRef.current.contains(target) &&
        popoverRef.current && !popoverRef.current.contains(target)
      ) {
        setIsOpen(false)
        setSearchQuery("")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useLayoutEffect(() => {
    if (!isOpen) return
    const updatePosition = () => {
      if (!buttonRef.current) return
      const rect = buttonRef.current.getBoundingClientRect()
      setPopoverPos({ top: rect.bottom + 4, left: rect.left })
    }
    updatePosition()
    window.addEventListener("scroll", updatePosition, true)
    window.addEventListener("resize", updatePosition)
    return () => {
      window.removeEventListener("scroll", updatePosition, true)
      window.removeEventListener("resize", updatePosition)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus({ preventScroll: true })
    }
  }, [isOpen])

  useEffect(() => {
    const { normalized, warning: normalizedWarning } = validateNumber(value, selectedCountry)
    setPhoneNumber(normalized)
    setWarning(normalizedWarning)
  }, [value, selectedCountry])

  const filteredCountries = allCountries.filter((country) => {
    const query = searchQuery.toLowerCase()
    return (
      country.name.toLowerCase().includes(query) ||
      country.dialCode.includes(query) ||
      country.iso2.toLowerCase().includes(query)
    )
  })

  const handleCountrySelect = (country: typeof allCountries[0]) => {
    const { normalized, warning: normalizedWarning } = validateNumber(phoneNumber, country)
    setSelectedCountry(country)
    setPhoneNumber(normalized)
    setWarning(normalizedWarning)
    setIsOpen(false)
    setSearchQuery("")
    onChange?.(`+${country.dialCode}${normalized}`)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { normalized, warning: normalizedWarning } = validateNumber(e.target.value, selectedCountry)
    setPhoneNumber(normalized)
    setWarning(normalizedWarning)
    onChange?.(`+${selectedCountry.dialCode}${normalized}`)
  }

  return (
    <div className="flex flex-col gap-1 min-w-0" ref={containerRef}>
      <div className="flex gap-0 relative min-w-0">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={
            dark
              ? "h-[44px] pl-2 pr-3 border border-r-0 border-[rgba(255,255,255,0.12)] bg-[#1E1D1B] text-white text-[14px] flex items-center gap-2 cursor-pointer hover:bg-[#23221F] transition-colors focus:outline-none shrink-0"
              : "h-12 pl-3 pr-2 border border-r-0 border-[#e0e0e0] rounded-l-md bg-white text-[#222222] text-[15px] flex items-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#27c7ff] focus:border-[#27c7ff] shrink-0"
          }
        >
          <FlagImage iso2={selectedCountry.iso2} size={20} />
          <span className="font-normal">+{selectedCountry.dialCode}</span>
          <ChevronDown className={`w-4 h-4 ${dark ? "text-[#F7F4EF]" : "text-[#666]"} transition-transform shrink-0 ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && mounted && popoverPos && createPortal(
          <div
            ref={popoverRef}
            style={{ position: "fixed", top: popoverPos.top, left: popoverPos.left }}
            className={`w-[280px] max-h-[320px] ${dark ? "bg-[#0D0D0D] border-[rgba(255,255,255,0.12)]" : "bg-white border-[#e0e0e0] rounded-lg"} border shadow-lg z-[100] overflow-hidden`}
          >
            <div className={`p-2 border-b ${dark ? "border-[rgba(255,255,255,0.12)]" : "border-[#e0e0e0]"}`}>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search country..."
                className={
                  dark
                    ? "w-full h-9 px-3 bg-[#1E1D1B] border border-[rgba(255,255,255,0.12)] text-[14px] text-white placeholder:text-[#696969] focus:outline-none focus:border-[#C9A96E] transition-colors"
                    : "w-full h-9 px-3 border border-[#e0e0e0] rounded-md text-[14px] focus:outline-none focus:ring-2 focus:ring-[#27c7ff] focus:border-[#27c7ff] text-black"
                }
              />
            </div>
            <div className="max-h-[260px] overflow-y-auto">
              {filteredCountries.map((country) => (
                <button
                  key={country.iso2}
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  className={`w-full px-3 py-2.5 flex items-center gap-3 transition-colors text-left ${
                    dark
                      ? `hover:bg-[rgba(255,255,255,0.04)] ${selectedCountry.iso2 === country.iso2 ? "bg-[rgba(201,169,110,0.08)]" : ""}`
                      : `hover:bg-[#f5f5f5] ${selectedCountry.iso2 === country.iso2 ? "bg-[#e9f9ff]" : ""}`
                  }`}
                >
                  <FlagImage iso2={country.iso2} size={24} />
                  <span className={`flex-1 text-[14px] truncate ${dark ? "text-[#F7F4EF]" : "text-[#222222]"}`}>{country.name}</span>
                  <span className={`text-[14px] font-medium ${dark ? "text-[#999]" : "text-[#808080]"}`}>+{country.dialCode}</span>
                </button>
              ))}
              {filteredCountries.length === 0 && (
                <div className={`px-3 py-4 text-center text-[14px] ${dark ? "text-[#999]" : "text-[#808080]"}`}>
                  No countries found
                </div>
              )}
            </div>
          </div>,
          document.body
        )}

        <input
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={
            dark
              ? "flex-1 min-w-0 w-0 h-[44px] px-3 bg-[#1E1D1B] border border-[rgba(255,255,255,0.12)] text-[14px] text-white placeholder:text-[#696969] focus:outline-none focus:border-[#C9A96E] transition-colors"
              : "flex-1 min-w-0 w-0 h-12 px-3 border border-[#e0e0e0] rounded-r-md text-[15px] text-[#222222] placeholder:text-[#a2a2a2] focus:outline-none focus:ring-2 focus:ring-[#27c7ff] focus:border-[#27c7ff]"
          }
        />
      </div>

      <div
        className={`text-[12px] text-[#d60510] overflow-hidden transition-all duration-200 ease-in-out ${
          warning ? "opacity-100 translate-y-0 max-h-10" : "opacity-0 -translate-y-1 max-h-0"
        }`}
        aria-live="polite"
      >
        {warning}
      </div>
    </div>
  )
}

