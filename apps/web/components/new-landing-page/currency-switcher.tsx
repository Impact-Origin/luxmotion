"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { useMoney } from "@/components/currency-provider"
import {
  CURRENCIES,
  CURRENCY_SYMBOLS,
  CURRENCY_NAMES,
  type Currency,
} from "@/lib/currency"

type HeaderVariant = "dark" | "light"

export function CurrencySwitcher({
  variant = "dark",
}: {
  variant?: HeaderVariant
}) {
  const { currency, setCurrency } = useMoney()
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isLight = variant === "light"

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleChange = (next: Currency) => {
    setCurrency(next)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Currency"
        className="flex items-center gap-[4px] h-[40px] px-[9px] border border-[rgba(201,169,110,0.22)] transition-colors hover:border-[rgba(201,169,110,0.4)] cursor-pointer"
      >
        <span
          className={cn(
            "text-[14px] font-medium tracking-[0.15px] whitespace-nowrap",
            isLight ? "text-[#A08248]" : "text-[#C9A96E]",
          )}
        >
          {CURRENCY_SYMBOLS[currency]} {currency}
        </span>
        <ChevronDown
          className={cn(
            "w-[13px] h-[13px] transition-transform",
            isLight ? "text-[#A08248]" : "text-[#C9A96E]",
            isOpen && "rotate-180",
          )}
        />
      </button>
      {isOpen && (
        <div
          className={cn(
            "absolute top-full mt-1 right-0 shadow-xl py-1 min-w-[190px] z-50 animate-in fade-in slide-in-from-top-2 duration-200",
            isLight
              ? "bg-white border border-[rgba(28,27,24,0.08)]"
              : "bg-[#1A1A1A] border border-[#2A2A2A]",
          )}
        >
          {CURRENCIES.map((c) => (
            <button
              key={c}
              onClick={() => handleChange(c)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 transition-colors",
                isLight
                  ? "text-[#8C8680] hover:text-[#A08248] hover:bg-black/[0.03]"
                  : "text-[#8C8680] hover:text-[#C9A96E] hover:bg-white/5",
                c === currency &&
                  (isLight ? "text-[#A08248] bg-black/[0.03]" : "text-[#C9A96E] bg-white/5"),
              )}
            >
              <span className="w-[28px] text-left text-sm font-semibold">
                {CURRENCY_SYMBOLS[c]}
              </span>
              <span className="flex-1 text-left text-sm font-medium">
                {c} · {CURRENCY_NAMES[c]}
              </span>
              {c === currency && (
                <Check
                  className={cn("w-4 h-4", isLight ? "text-[#A08248]" : "text-[#C9A96E]")}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
