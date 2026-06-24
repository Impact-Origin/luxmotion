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
        <div className="bg-[rgba(var(--lm-text-rgb,255,255,255),0.06)] p-2 rounded-full">
          {icon}
        </div>
        <div>
          <span
            className="text-[14px] font-semibold text-[var(--lm-text,#fff)]"
            style={{ fontFamily: "var(--font-sans), Inter, sans-serif" }}
          >
            {label}
          </span>
          {sublabel && (
            <p
              className="text-[12px] text-[var(--lm-muted,#696969)] leading-none mt-0.5"
              style={{ fontFamily: "var(--font-sans), Inter, sans-serif" }}
            >
              {sublabel}
            </p>
          )}
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
          className="w-7 h-7 rounded-full border border-[rgba(var(--lm-text-rgb,255,255,255),0.15)] flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <CircleMinus className="w-4 h-4 text-[var(--lm-muted,#696969)]" />
        </button>
        <span className="w-4 text-center text-[14px] font-black text-[var(--lm-text,#fff)]">{value}</span>
        <button
          type="button"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation()
            onIncrease()
          }}
          className="w-7 h-7 rounded-full border border-[rgba(var(--lm-text-rgb,255,255,255),0.15)] flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <CirclePlus className="w-4 h-4" style={{ color: "var(--lm-accent,#C9A96E)" }} />
        </button>
      </div>
    </div>
  )
}

