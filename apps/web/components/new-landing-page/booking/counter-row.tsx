"use client"

import { type ReactNode } from "react"
import { CircleMinus, CirclePlus } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

interface CounterRowProps {
  icon: ReactNode
  label: string
  sublabel?: string
  value: number
  onDecrease: () => void
  onIncrease: () => void
  /** Light/dark theme. Defaults to dark so existing usages are unchanged. */
  dark?: boolean
}

export function CounterRow({
  icon,
  label,
  sublabel,
  value,
  onDecrease,
  onIncrease,
  dark = true,
}: CounterRowProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "p-2 rounded-full",
            dark ? "bg-[rgba(var(--lm-text-rgb,255,255,255),0.06)]" : "bg-[rgba(28,27,24,0.05)]"
          )}
        >
          {icon}
        </div>
        <div>
          <span
            className={cn("text-[14px] font-semibold", dark ? "text-[var(--lm-text,#fff)]" : "text-[#1a1612]")}
            style={{ fontFamily: "var(--font-sans), Inter, sans-serif" }}
          >
            {label}
          </span>
          {sublabel && (
            <p
              className={cn("text-[12px] leading-none mt-0.5", dark ? "text-[var(--lm-muted,#696969)]" : "text-[#8c8680]")}
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
          className={cn(
            "w-7 h-7 rounded-full border flex items-center justify-center transition-colors",
            dark
              ? "border-[rgba(var(--lm-text-rgb,255,255,255),0.15)] hover:bg-white/10"
              : "border-[rgba(28,27,24,0.12)] hover:bg-[rgba(28,27,24,0.05)]"
          )}
        >
          <CircleMinus className={cn("w-4 h-4", dark ? "text-[var(--lm-muted,#696969)]" : "text-[#8c8680]")} />
        </button>
        <span className={cn("w-4 text-center text-[14px] font-black", dark ? "text-[var(--lm-text,#fff)]" : "text-[#1a1612]")}>{value}</span>
        <button
          type="button"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation()
            onIncrease()
          }}
          className={cn(
            "w-7 h-7 rounded-full border flex items-center justify-center transition-colors",
            dark
              ? "border-[rgba(var(--lm-text-rgb,255,255,255),0.15)] hover:bg-white/10"
              : "border-[rgba(28,27,24,0.12)] hover:bg-[rgba(28,27,24,0.05)]"
          )}
        >
          <CirclePlus className="w-4 h-4" style={{ color: dark ? "var(--lm-accent,#C9A96E)" : "#a08248" }} />
        </button>
      </div>
    </div>
  )
}
