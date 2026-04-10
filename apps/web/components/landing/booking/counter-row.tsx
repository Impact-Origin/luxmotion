"use client"

import { type ReactNode } from "react"
import { CircleMinus, CirclePlus } from "lucide-react"

interface CounterRowProps {
  icon: ReactNode
  label: string
  sublabel?: string
  value: number
  onDecrease: () => void
  onIncrease: () => void
}

export function CounterRow({
  icon,
  label,
  sublabel,
  value,
  onDecrease,
  onIncrease,
}: CounterRowProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <span className="text-sm font-medium text-gray-900">{label}</span>
          {sublabel && <p className="text-xs text-gray-500">{sublabel}</p>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation()
            onDecrease()
          }}
          className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <CircleMinus
            data-theme-color="heroBookingIcon"
            className="w-5 h-5"
            style={{ color: "var(--theme-hero-booking-icon, #9CA3AF)" }}
          />
        </button>
        <span className="w-6 text-center font-medium text-gray-900">{value}</span>
        <button
          type="button"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation()
            onIncrease()
          }}
          className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <CirclePlus
            data-theme-color="heroBookingIcon"
            className="w-5 h-5"
            style={{ color: "var(--theme-hero-booking-icon, #29C5F6)" }}
          />
        </button>
      </div>
    </div>
  )
}

