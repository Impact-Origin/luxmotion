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
    <div className="bg-white rounded-xl">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">{t.passengers}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X
              data-theme-color="heroBookingIcon"
              className="w-5 h-5"
              style={{ color: "var(--theme-hero-booking-icon, #6B7280)" }}
            />
          </button>
        </div>

        <CounterRow
          icon={<Users data-theme-color="heroBookingIcon" className="w-5 h-5" style={{ color: "var(--theme-hero-booking-icon, #27C7FF)" }} />}
          label={t.adults}
          value={passengers.adults}
          onDecrease={() => setPassengers((p) => ({ ...p, adults: Math.max(1, p.adults - 1) }))}
          onIncrease={() => setPassengers((p) => ({ ...p, adults: p.adults + 1 }))}
        />

        <CounterRow
          icon={<Baby data-theme-color="heroBookingIcon" className="w-5 h-5" style={{ color: "var(--theme-hero-booking-icon, #27C7FF)" }} />}
          label={t.children}
          sublabel={t.childrenAge}
          value={passengers.children}
          onDecrease={() => setPassengers((p) => ({ ...p, children: Math.max(0, p.children - 1) }))}
          onIncrease={() => setPassengers((p) => ({ ...p, children: p.children + 1 }))}
        />
      </div>

      <div className="p-4">
        <CounterRow
          icon={<Backpack data-theme-color="heroBookingIcon" className="w-5 h-5" style={{ color: "var(--theme-hero-booking-icon, #27C7FF)" }} />}
          label={t.backpack}
          value={luggage.backpack}
          onDecrease={() => setLuggage((l) => ({ ...l, backpack: Math.max(0, l.backpack - 1) }))}
          onIncrease={() => setLuggage((l) => ({ ...l, backpack: l.backpack + 1 }))}
        />

        <CounterRow
          icon={<Luggage data-theme-color="heroBookingIcon" className="w-5 h-5" style={{ color: "var(--theme-hero-booking-icon, #27C7FF)" }} />}
          label={t.handLuggage}
          value={luggage.handLuggage}
          onDecrease={() => setLuggage((l) => ({ ...l, handLuggage: Math.max(0, l.handLuggage - 1) }))}
          onIncrease={() => setLuggage((l) => ({ ...l, handLuggage: l.handLuggage + 1 }))}
        />

        <CounterRow
          icon={<Briefcase data-theme-color="heroBookingIcon" className="w-5 h-5" style={{ color: "var(--theme-hero-booking-icon, #27C7FF)" }} />}
          label={t.checkedBaggage}
          value={luggage.checkedBaggage}
          onDecrease={() => setLuggage((l) => ({ ...l, checkedBaggage: Math.max(0, l.checkedBaggage - 1) }))}
          onIncrease={() => setLuggage((l) => ({ ...l, checkedBaggage: l.checkedBaggage + 1 }))}
        />

        <button
          onClick={onClose}
          className="w-full mt-4 bg-[#29C5F6] hover:bg-[#20aadd] text-white py-3 rounded-lg font-bold transition-colors"
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
        "absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 transition-all duration-200 ease-out transform origin-top",
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

interface PassengersDropdownSimpleContentProps {
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

// Content component for use inside Radix Popover (simple version - no luggage)
export function PassengersDropdownSimpleContent({
  passengers,
  onClose,
  setPassengers,
  translations: t,
}: PassengersDropdownSimpleContentProps) {
  return (
    <div className="bg-white rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900">{t.passengers}</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
          <X
            data-theme-color="heroBookingIcon"
            className="w-5 h-5"
            style={{ color: "var(--theme-hero-booking-icon, #6B7280)" }}
          />
        </button>
      </div>

      <CounterRow
        icon={<Users data-theme-color="heroBookingIcon" className="w-5 h-5" style={{ color: "var(--theme-hero-booking-icon, #27C7FF)" }} />}
        label={t.adults}
        value={passengers.adults}
        onDecrease={() => setPassengers((p) => ({ ...p, adults: Math.max(1, p.adults - 1) }))}
        onIncrease={() => setPassengers((p) => ({ ...p, adults: p.adults + 1 }))}
      />

      <CounterRow
        icon={<Baby data-theme-color="heroBookingIcon" className="w-5 h-5" style={{ color: "var(--theme-hero-booking-icon, #27C7FF)" }} />}
        label={t.children}
        sublabel={t.childrenAge}
        value={passengers.children}
        onDecrease={() => setPassengers((p) => ({ ...p, children: Math.max(0, p.children - 1) }))}
        onIncrease={() => setPassengers((p) => ({ ...p, children: p.children + 1 }))}
      />

      <button
        onClick={onClose}
        className="w-full mt-4 bg-[#29C5F6] hover:bg-[#20aadd] text-white py-3 rounded-lg font-bold transition-colors"
      >
        {t.done}
      </button>
    </div>
  )
}

// Legacy wrapper for backwards compatibility (uses absolute positioning)
interface PassengersDropdownSimpleProps extends PassengersDropdownSimpleContentProps {}

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
        "absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-50 transition-all duration-200 ease-out transform origin-top",
        visible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-1"
      )}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <PassengersDropdownSimpleContent
        passengers={passengers}
        onClose={onClose}
        setPassengers={setPassengers}
        translations={t}
      />
    </div>
  )
}
