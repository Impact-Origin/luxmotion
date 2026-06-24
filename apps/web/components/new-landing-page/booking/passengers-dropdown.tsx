"use client"

import { useState, useEffect } from "react"
import { X, Users, Baby, Backpack, Luggage, Briefcase } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { CounterRow } from "./counter-row"
import type { PassengerState, LuggageState } from "./types"

interface PassengersDropdownContentProps {
  passengers: PassengerState
  luggage: LuggageState
  onClose: () => void
  setPassengers: React.Dispatch<React.SetStateAction<PassengerState>>
  setLuggage: React.Dispatch<React.SetStateAction<LuggageState>>
  /** Light/dark theme. Defaults to dark so existing usages are unchanged. */
  dark?: boolean
  translations: {
    passengers: string
    adults: string
    children: string
    childrenAge: string
    backpack: string
    handLuggage: string
    checkedBaggage: string
    done: string
  }
}

// Content component for use inside Radix Popover
export function PassengersDropdownContent({
  passengers,
  luggage,
  onClose,
  setPassengers,
  setLuggage,
  dark = true,
  translations: t,
}: PassengersDropdownContentProps) {
  const iconColor = dark ? "var(--lm-accent,#C9A96E)" : "#a08248"
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
          onClick={onClose}
          className={cn("p-1 rounded-lg transition-colors", dark ? "hover:bg-white/10" : "hover:bg-[rgba(28,27,24,0.05)]")}
        >
          <X className={cn("w-4 h-4", dark ? "text-[var(--lm-muted,#696969)]" : "text-[#8c8680]")} />
        </button>
      </div>

      <div className="space-y-4">
        <CounterRow
          icon={<Users className="w-5 h-5" style={{ color: iconColor }} />}
          label={t.adults}
          value={passengers.adults}
          onDecrease={() => setPassengers((p) => ({ ...p, adults: Math.max(1, p.adults - 1) }))}
          onIncrease={() => setPassengers((p) => ({ ...p, adults: p.adults + 1 }))}
          dark={dark}
        />

        <CounterRow
          icon={<Baby className="w-5 h-5" style={{ color: iconColor }} />}
          label={t.children}
          sublabel={t.childrenAge}
          value={passengers.children}
          onDecrease={() => setPassengers((p) => ({ ...p, children: Math.max(0, p.children - 1) }))}
          onIncrease={() => setPassengers((p) => ({ ...p, children: p.children + 1 }))}
          dark={dark}
        />

        <div className={cn("h-[1px] my-2", dark ? "bg-[rgba(var(--lm-text-rgb,255,255,255),0.08)]" : "bg-[rgba(28,27,24,0.08)]")} />

        <CounterRow
          icon={<Backpack className="w-5 h-5" style={{ color: iconColor }} />}
          label={t.backpack}
          value={luggage.backpack}
          onDecrease={() => setLuggage((l) => ({ ...l, backpack: Math.max(0, l.backpack - 1) }))}
          onIncrease={() => setLuggage((l) => ({ ...l, backpack: l.backpack + 1 }))}
          dark={dark}
        />

        <CounterRow
          icon={<Luggage className="w-5 h-5" style={{ color: iconColor }} />}
          label={t.handLuggage}
          value={luggage.handLuggage}
          onDecrease={() => setLuggage((l) => ({ ...l, handLuggage: Math.max(0, l.handLuggage - 1) }))}
          onIncrease={() => setLuggage((l) => ({ ...l, handLuggage: l.handLuggage + 1 }))}
          dark={dark}
        />

        <CounterRow
          icon={<Briefcase className="w-5 h-5" style={{ color: iconColor }} />}
          label={t.checkedBaggage}
          value={luggage.checkedBaggage}
          onDecrease={() => setLuggage((l) => ({ ...l, checkedBaggage: Math.max(0, l.checkedBaggage - 1) }))}
          onIncrease={() => setLuggage((l) => ({ ...l, checkedBaggage: l.checkedBaggage + 1 }))}
          dark={dark}
        />

        <button
          onClick={onClose}
          className={cn(
            "w-full mt-2 hover:brightness-110 py-3 rounded-full font-black text-[14px] uppercase tracking-wider transition-all",
            dark
              ? "bg-[var(--lm-accent,#C9A96E)] text-[rgba(var(--lm-bg-rgb,13,13,13),0.96)]"
              : "bg-[#a08248] text-white"
          )}
        >
          {t.done}
        </button>
      </div>
    </div>
  )
}

// Legacy wrapper for backwards compatibility (uses absolute positioning)
interface PassengersDropdownProps extends PassengersDropdownContentProps {}

export function PassengersDropdown({
  passengers,
  luggage,
  onClose,
  setPassengers,
  setLuggage,
  translations: t,
}: PassengersDropdownProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
  }, [])

  return (
    <div
      className={cn(
        "absolute top-full right-0 mt-2 w-72 rounded-xl shadow-2xl border border-[rgba(var(--lm-text-rgb,255,255,255),0.12)] z-50 transition-all duration-200 ease-out transform origin-top",
        visible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-1"
      )}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <PassengersDropdownContent
        passengers={passengers}
        luggage={luggage}
        onClose={onClose}
        setPassengers={setPassengers}
        setLuggage={setLuggage}
        translations={t}
      />
    </div>
  )
}

interface PassengersDropdownSimpleProps {
  passengers: PassengerState
  onClose: () => void
  setPassengers: React.Dispatch<React.SetStateAction<PassengerState>>
  translations: {
    passengers: string
    adults: string
    children: string
    childrenAge: string
    done: string
  }
}

export function PassengersDropdownSimple({
  passengers,
  onClose,
  setPassengers,
  translations: t,
}: PassengersDropdownSimpleProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
  }, [])

  return (
    <div
      className={cn(
        "absolute top-full right-0 mt-2 w-72 bg-[var(--lm-surface,#1e1d1b)] rounded-xl shadow-xl border border-[rgba(var(--lm-text-rgb,255,255,255),0.12)] z-50 p-4 transition-all duration-200 ease-out transform origin-top",
        visible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-1"
      )}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-[20px] font-semibold text-[var(--lm-text,#fff)]"
          style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif" }}
        >
          {t.passengers}
        </h3>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
          <X className="w-4 h-4 text-[var(--lm-muted,#696969)]" />
        </button>
      </div>

      <CounterRow
        icon={<Users className="w-5 h-5" style={{ color: "var(--lm-accent,#C9A96E)" }} />}
        label={t.adults}
        value={passengers.adults}
        onDecrease={() => setPassengers((p) => ({ ...p, adults: Math.max(1, p.adults - 1) }))}
        onIncrease={() => setPassengers((p) => ({ ...p, adults: p.adults + 1 }))}
      />

      <CounterRow
        icon={<Baby className="w-5 h-5" style={{ color: "var(--lm-accent,#C9A96E)" }} />}
        label={t.children}
        sublabel={t.childrenAge}
        value={passengers.children}
        onDecrease={() => setPassengers((p) => ({ ...p, children: Math.max(0, p.children - 1) }))}
        onIncrease={() => setPassengers((p) => ({ ...p, children: p.children + 1 }))}
      />

      <button
        onClick={onClose}
        className="w-full mt-4 bg-[var(--lm-accent,#C9A96E)] hover:brightness-110 text-[rgba(var(--lm-bg-rgb,13,13,13),0.96)] py-3 rounded-full font-black text-[14px] uppercase tracking-wider transition-all"
      >
        {t.done}
      </button>
    </div>
  )
}
