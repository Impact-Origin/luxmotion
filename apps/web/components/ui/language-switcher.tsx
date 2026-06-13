"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, Check } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { locales, localeNames, localeCountryIso, type Locale } from "@/i18n/config"
import { FlagImage } from "react-international-phone"
import { cn } from "@workspace/ui/lib/utils"

interface LanguageSwitcherProps {
  variant?: "default" | "compact" | "flag-only" | "navbar" | "checkout"
  className?: string
  chevronColor?: string
  useThemeStyles?: boolean
}

export function LanguageSwitcher({ 
  variant = "default", 
  className = "",
  chevronColor,
  useThemeStyles = true,
}: LanguageSwitcherProps) {
  const locale = useLocale() as Locale
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLocaleChange = (newLocale: Locale) => {
    if (newLocale === locale) {
      setIsOpen(false)
      return
    }
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`
    setIsOpen(false)
    router.refresh()
  }

  const isNavbar = variant === "navbar"
  const isCheckout = variant === "checkout"

  const bgVar = isCheckout ? "var(--theme-checkout-lang-switcher-bg, #ffffff)" : "var(--theme-landing-header-menu-bg, #ffffff)"
  const borderVar = isCheckout ? "var(--theme-checkout-lang-switcher-border, #e5e7eb)" : "var(--theme-landing-header-menu-border, #e5e7eb)"
  const textVar = isCheckout ? "var(--theme-checkout-lang-switcher-text, #374151)" : "var(--theme-landing-header-text, #374151)"
  const chevronVar = isCheckout ? "var(--theme-checkout-lang-switcher-chevron, #27c7ff)" : "#6b7280"
  const dropdownBgVar = isCheckout ? "var(--theme-checkout-lang-switcher-dropdown-bg, #ffffff)" : "var(--theme-landing-header-menu-bg, #ffffff)"
  const dropdownBorderVar = isCheckout ? "var(--theme-checkout-lang-switcher-dropdown-border, #f3f4f6)" : "var(--theme-landing-header-menu-border, #f3f4f6)"
  const dropdownHoverVar = isCheckout ? "var(--theme-checkout-lang-switcher-dropdown-hover-bg, #f3f4f6)" : "var(--theme-landing-header-menu-item-hover-bg, rgba(0,0,0,0.05))"
  const checkIconVar = isCheckout ? "var(--theme-checkout-lang-switcher-check-icon, #27C7FF)" : "var(--theme-landing-header-menu-icon, #27C7FF)"

  return (
    <div className="relative checkout-lang-switcher" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center transition-all duration-200 whitespace-nowrap outline-none cursor-pointer",
          !isNavbar && "shadow-sm border rounded-md px-2 py-1.5 gap-1.5",
          isNavbar && "h-[32px] px-[8px] py-[6px] rounded-[10px] border border-[#e5e7eb] bg-white gap-[8px] hover:bg-zinc-50 shadow-sm",
          className
        )}
        style={useThemeStyles ? {
          backgroundColor: bgVar,
          borderColor: borderVar,
          color: textVar,
        } : undefined}
      >
        <div className="flex-shrink-0 flex items-center justify-center w-[20px] h-[20px] overflow-hidden rounded-[2px]">
          <FlagImage iso2={localeCountryIso[locale]} size={20} className="object-cover scale-125" />
        </div>
        {(variant === "default" || variant === "compact" || variant === "checkout") && (
          <span className={cn("font-medium", variant === "default" ? "text-sm" : "text-xs")}>
            {locale.toUpperCase()}
          </span>
        )}
        <ChevronDown
          className={cn(
            "w-[12px] h-[12px] transition-transform duration-200 flex-shrink-0", 
            isOpen ? "rotate-180" : ""
          )}
          style={{ color: chevronColor || (isNavbar ? "#27c7ff" : chevronVar) }}
        />
      </button>

      {isOpen && (
        <div 
          className="absolute top-full mt-1 right-0 rounded-lg shadow-xl border py-1 min-w-[180px] z-50 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[70vh] overflow-y-auto overscroll-contain"
          style={{ 
            backgroundColor: dropdownBgVar,
            borderColor: dropdownBorderVar
          }}
        >
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => handleLocaleChange(loc)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 transition-colors"
              )}
              style={{ 
                color: textVar,
                backgroundColor: loc === locale ? dropdownHoverVar : "transparent"
              }}
              onMouseEnter={(e) => {
                if (loc !== locale) e.currentTarget.style.backgroundColor = dropdownHoverVar;
              }}
              onMouseLeave={(e) => {
                if (loc !== locale) e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <FlagImage iso2={localeCountryIso[loc]} size={24} />
              <span className="flex-1 text-left text-sm font-medium">{localeNames[loc]}</span>
              {loc === locale && <Check className="w-4 h-4" style={{ color: checkIconVar }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
