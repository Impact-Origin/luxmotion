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
  translations: t,
}: PassengersDropdownContentProps) {
  return (
    <div className="bg-[#1e1d1b] p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-black text-white">{t.passengers}</h3>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
          <X className="w-4 h-4 text-[#696969]" />
        </button>
      </div>

      <div className="space-y-4">
        <CounterRow
          icon={<Users className="w-5 h-5" style={{ color: "#C9A96E" }} />}
          label={t.adults}
          value={passengers.adults}
          onDecrease={() => setPassengers((p) => ({ ...p, adults: Math.max(1, p.adults - 1) }))}
          onIncrease={() => setPassengers((p) => ({ ...p, adults: p.adults + 1 }))}
        />

        <CounterRow
          icon={<Baby className="w-5 h-5" style={{ color: "#C9A96E" }} />}
          label={t.children}
          sublabel={t.childrenAge}
          value={passengers.children}
          onDecrease={() => setPassengers((p) => ({ ...p, children: Math.max(0, p.children - 1) }))}
          onIncrease={() => setPassengers((p) => ({ ...p, children: p.children + 1 }))}
        />

        <div className="h-[1px] bg-[rgba(255,255,255,0.08)] my-2" />

        <CounterRow
          icon={<Backpack className="w-5 h-5" style={{ color: "#C9A96E" }} />}
          label={t.backpack}
          value={luggage.backpack}
          onDecrease={() => setLuggage((l) => ({ ...l, backpack: Math.max(0, l.backpack - 1) }))}
          onIncrease={() => setLuggage((l) => ({ ...l, backpack: l.backpack + 1 }))}
        />

        <CounterRow
          icon={<Luggage className="w-5 h-5" style={{ color: "#C9A96E" }} />}
          label={t.handLuggage}
          value={luggage.handLuggage}
          onDecrease={() => setLuggage((l) => ({ ...l, handLuggage: Math.max(0, l.handLuggage - 1) }))}
          onIncrease={() => setLuggage((l) => ({ ...l, handLuggage: l.handLuggage + 1 }))}
        />

        <CounterRow
          icon={<Briefcase className="w-5 h-5" style={{ color: "#C9A96E" }} />}
          label={t.checkedBaggage}
          value={luggage.checkedBaggage}
          onDecrease={() => setLuggage((l) => ({ ...l, checkedBaggage: Math.max(0, l.checkedBaggage - 1) }))}
          onIncrease={() => setLuggage((l) => ({ ...l, checkedBaggage: l.checkedBaggage + 1 }))}
        />

        <button
          onClick={onClose}
          className="w-full mt-2 bg-[#C9A96E] hover:brightness-110 text-[rgba(13,13,13,0.96)] py-3 rounded-full font-black text-[14px] uppercase tracking-wider transition-all"
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
        "absolute top-full right-0 mt-2 w-72 rounded-xl shadow-2xl border border-[rgba(255,255,255,0.12)] z-50 transition-all duration-200 ease-out transform origin-top",
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
        "absolute top-full right-0 mt-2 w-72 bg-[#1e1d1b] rounded-xl shadow-xl border border-[rgba(255,255,255,0.12)] z-50 p-4 transition-all duration-200 ease-out transform origin-top",
        visible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-1"
      )}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-black text-white">{t.passengers}</h3>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
          <X className="w-4 h-4 text-[#696969]" />
        </button>
      </div>

      <CounterRow
        icon={<Users className="w-5 h-5" style={{ color: "#C9A96E" }} />}
        label={t.adults}
        value={passengers.adults}
        onDecrease={() => setPassengers((p) => ({ ...p, adults: Math.max(1, p.adults - 1) }))}
        onIncrease={() => setPassengers((p) => ({ ...p, adults: p.adults + 1 }))}
      />

      <CounterRow
        icon={<Baby className="w-5 h-5" style={{ color: "#C9A96E" }} />}
        label={t.children}
        sublabel={t.childrenAge}
        value={passengers.children}
        onDecrease={() => setPassengers((p) => ({ ...p, children: Math.max(0, p.children - 1) }))}
        onIncrease={() => setPassengers((p) => ({ ...p, children: p.children + 1 }))}
      />

      <button
        onClick={onClose}
        className="w-full mt-4 bg-[#C9A96E] hover:brightness-110 text-[rgba(13,13,13,0.96)] py-3 rounded-full font-black text-[14px] uppercase tracking-wider transition-all"
      >
        {t.done}
      </button>
    </div>
  )
}
