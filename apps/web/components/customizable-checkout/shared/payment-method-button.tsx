"use client"

import type { ReactNode } from "react"
import { cn } from "@workspace/ui/lib/utils"

interface PaymentMethodButtonProps {
  selected: boolean
  onSelect: () => void
  icon: ReactNode
  label: string
}

export function PaymentMethodButton({ selected, onSelect, icon, label }: PaymentMethodButtonProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "flex flex-col items-start gap-1.5 md:gap-2 p-2 md:p-3 rounded-lg border-2 transition-all min-h-[68px] md:min-h-0",
        selected
          ? "border-[#27c7ff] bg-[#e9f9ff]"
          : "border-[#e0e0e0] bg-white hover:border-[#bfbfbf]"
      )}
    >
      {icon}
      <span className="text-[12px] md:text-[13px] font-medium text-[#222222]">{label}</span>
    </button>
  )
}

