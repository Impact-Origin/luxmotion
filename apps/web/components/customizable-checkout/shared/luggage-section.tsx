"use client"

import type { LucideIcon } from "lucide-react"
import { Counter } from "@/components/ui/counter"

interface LuggageSectionProps {
  label: string
  icon: LucideIcon
  value: number
  onChange: (v: number) => void
  variant: "mobile" | "desktop"
  max?: number
}

export function LuggageSection({ label, icon: Icon, value, onChange, variant, max }: LuggageSectionProps) {
  if (variant === "mobile") {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-2 h-[66px] justify-center">
          <Icon className="w-6 h-6 text-[#222222]" />
          <span className="text-[14px] font-bold text-[#222222] text-center leading-tight">{label}</span>
        </div>
        <Counter value={value} onChange={onChange} min={0} max={max} variant="tiny" />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-w-0">
      <div className="flex items-center gap-1.5 mb-3 min-w-0 h-10">
        <Icon className="w-6 h-6 text-[#222222]" />
        <span className="text-base font-semibold text-[#222222] leading-tight">{label}</span>
      </div>
      <Counter value={value} onChange={onChange} min={0} max={max} variant="tiny" />
    </div>
  )
}

