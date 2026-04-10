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
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        <div className="bg-[#f7f7f7] p-2 rounded-full">
          {icon}
        </div>
        <div>
          <span className="text-[14px] font-bold text-[#222]">{label}</span>
          {sublabel && <p className="text-[11px] text-[#808080] leading-none mt-0.5">{sublabel}</p>}
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
          className="w-7 h-7 rounded-full border border-[#f0f0f0] flex items-center justify-center hover:bg-zinc-50 transition-colors"
        >
          <CircleMinus className="w-4 h-4 text-[#808080]" />
        </button>
        <span className="w-4 text-center text-[14px] font-black text-[#222]">{value}</span>
        <button
          type="button"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation()
            onIncrease()
          }}
          className="w-7 h-7 rounded-full border border-[#f0f0f0] flex items-center justify-center hover:bg-zinc-50 transition-colors"
        >
          <CirclePlus className="w-4 h-4" style={{ color: "#27C7FF" }} />
        </button>
      </div>
    </div>
  )
}

