"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

export interface DarkSelectOption {
  value: string
  label: string
}

interface DarkSelectProps {
  value: string
  options: DarkSelectOption[]
  onChange: (value: string) => void
  placeholder?: string
  align?: "left" | "right"
}

export function DarkSelect({ value, options, onChange, placeholder, align = "left" }: DarkSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener("mousedown", onClickOutside)
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [isOpen])

  const selected = options.find((o) => o.value === value)

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex h-[44px] items-center gap-2 border border-[rgba(255,255,255,0.12)] bg-[#1e1d1b] px-[13px] text-[14px] text-white transition-colors hover:border-[rgba(201,169,110,0.4)]"
      >
        <span className="px-2 whitespace-nowrap">{selected?.label ?? placeholder}</span>
        <ChevronDown
          className={cn("size-6 text-[#999] transition-transform duration-200", isOpen && "rotate-180")}
          strokeWidth={2}
        />
      </button>

      <div
        className={cn(
          "absolute top-full z-30 mt-1 min-w-full origin-top border border-[rgba(255,255,255,0.12)] bg-[#1e1d1b] transition-all duration-200",
          align === "right" ? "right-0" : "left-0",
          isOpen ? "scale-y-100 opacity-100" : "pointer-events-none scale-y-0 opacity-0",
        )}
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              onChange(option.value)
              setIsOpen(false)
            }}
            className={cn(
              "block w-full whitespace-nowrap px-[21px] py-[10px] text-left text-[14px] transition-colors hover:bg-[rgba(255,255,255,0.04)]",
              option.value === value ? "text-[#C9A96E]" : "text-[#999]",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
