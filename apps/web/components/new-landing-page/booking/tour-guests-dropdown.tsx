"use client"

import { X, User, Baby, Minus, Plus } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import type { TourPassengerState } from "./types"

interface GuestRowProps {
  icon: React.ReactNode
  label: string
  description: string
  count: number
  onDecrement: () => void
  onIncrement: () => void
  minCount?: number
  disableIncrement?: boolean
  dark?: boolean
}

function GuestRow({ icon, label, description, count, onDecrement, onIncrement, minCount = 0, disableIncrement, dark = true }: GuestRowProps) {
  const buttonClass = cn(
    "size-[28px] rounded-full border flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-colors",
    dark
      ? "border-[rgba(var(--lm-text-rgb,255,255,255),0.15)] text-[var(--lm-muted,#696969)] hover:bg-white/10"
      : "border-[rgba(28,27,24,0.12)] text-[#8c8680] hover:bg-[rgba(28,27,24,0.05)]"
  )
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex gap-[10px] items-start">
        <div className="size-5" style={{ color: dark ? "var(--lm-accent,#C9A96E)" : "#a08248" }}>{icon}</div>
        <div className="flex flex-col">
          <span
            className={cn("text-[14px] font-semibold leading-[20px]", dark ? "text-[var(--lm-text,#fff)]" : "text-[#1a1612]")}
            style={{ fontFamily: "var(--font-sans), Inter, sans-serif" }}
          >
            {label}
          </span>
          <span
            className={cn("text-[12px] leading-[16px]", dark ? "text-[var(--lm-muted,#696969)]" : "text-[#8c8680]")}
            style={{ fontFamily: "var(--font-sans), Inter, sans-serif" }}
          >
            {description}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onDecrement}
          disabled={count <= minCount}
          className={buttonClass}
        >
          <Minus className="size-3.5" />
        </button>
        <span className={cn("text-[16px] font-semibold w-4 text-center", dark ? "text-[var(--lm-text,#fff)]" : "text-[#1a1612]")}>{count}</span>
        <button
          type="button"
          onClick={onIncrement}
          disabled={disableIncrement}
          className={buttonClass}
        >
          <Plus className="size-3.5" />
        </button>
      </div>
    </div>
  )
}

interface TourGuestsDropdownContentProps {
  passengers: TourPassengerState
  setPassengers: React.Dispatch<React.SetStateAction<TourPassengerState>>
  onClose: () => void
  maxPassengers?: number
  /** Light/dark theme. Defaults to dark so existing usages are unchanged. */
  dark?: boolean
  translations: {
    passengers: string
    adults: string
    adultAge: string
    children: string
    childrenAge: string
    infant: string
    infantAge: string
    done: string
  }
}

export function TourGuestsDropdownContent({
  passengers,
  setPassengers,
  onClose,
  maxPassengers,
  dark = true,
  translations: t,
}: TourGuestsDropdownContentProps) {
  const totalGuests = passengers.adults + passengers.children + passengers.infants
  const isAtMax = maxPassengers ? totalGuests >= maxPassengers : false
  return (
    <div className={cn("p-4", dark ? "bg-[var(--lm-surface,#1e1d1b)]" : "bg-[#faf7f2]")}>
      <div className="flex items-center justify-between mb-4">
        <h3
          className={cn("text-[20px] font-semibold", dark ? "text-[var(--lm-text,#fff)]" : "text-[#1a1612]")}
          style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif" }}
        >
          {t.passengers}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className={cn("p-1 rounded-lg transition-colors", dark ? "hover:bg-white/10" : "hover:bg-[rgba(28,27,24,0.05)]")}
        >
          <X className={cn("w-4 h-4", dark ? "text-[var(--lm-muted,#696969)]" : "text-[#8c8680]")} />
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <GuestRow
          icon={<User className="size-5" />}
          label={t.adults}
          description={t.adultAge}
          count={passengers.adults}
          onDecrement={() => setPassengers((p) => ({ ...p, adults: Math.max(1, p.adults - 1) }))}
          onIncrement={() => setPassengers((p) => ({ ...p, adults: p.adults + 1 }))}
          minCount={1}
          disableIncrement={isAtMax}
          dark={dark}
        />
        <GuestRow
          icon={<User className="size-5" />}
          label={t.children}
          description={t.childrenAge}
          count={passengers.children}
          onDecrement={() => setPassengers((p) => ({ ...p, children: Math.max(0, p.children - 1) }))}
          onIncrement={() => setPassengers((p) => ({ ...p, children: p.children + 1 }))}
          disableIncrement={isAtMax}
          dark={dark}
        />
        <GuestRow
          icon={<Baby className="size-5" />}
          label={t.infant}
          description={t.infantAge}
          count={passengers.infants}
          onDecrement={() => setPassengers((p) => ({ ...p, infants: Math.max(0, p.infants - 1) }))}
          onIncrement={() => setPassengers((p) => ({ ...p, infants: p.infants + 1 }))}
          disableIncrement={isAtMax}
          dark={dark}
        />
      </div>

      <button
        type="button"
        onClick={onClose}
        className={cn(
          "w-full mt-4 py-3 rounded-full font-bold text-[14px] uppercase tracking-wider transition-all",
          dark ? "text-[rgba(var(--lm-bg-rgb,13,13,13),0.96)]" : "text-white"
        )}
        style={{ backgroundColor: dark ? "var(--lm-accent,#C9A96E)" : "#a08248" }}
      >
        {t.done}
      </button>
    </div>
  )
}
