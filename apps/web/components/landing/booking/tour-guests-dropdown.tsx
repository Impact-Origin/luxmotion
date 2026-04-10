"use client"

import { X, User, Baby, Minus, Plus } from "lucide-react"
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
}

function GuestRow({ icon, label, description, count, onDecrement, onIncrement, minCount = 0, disableIncrement }: GuestRowProps) {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex gap-[10px] items-start">
        <div data-theme-color="heroBookingIcon" className="size-5" style={{ color: "var(--theme-hero-booking-icon, #27C7FF)" }}>{icon}</div>
        <div className="flex flex-col">
          <span className="text-[14px] font-semibold text-[#0c171c] leading-[20px]">{label}</span>
          <span className="text-[12px] text-[#5f686c] leading-[16px]">{description}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onDecrement}
          disabled={count <= minCount}
          className="size-[28px] rounded-full border border-[#dedede] flex items-center justify-center text-[#5f686c] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Minus
            data-theme-color="heroBookingIcon"
            className="size-3.5"
            style={{ color: "var(--theme-hero-booking-icon, #5f686c)" }}
          />
        </button>
        <span className="text-[16px] font-semibold text-[#0c171c] w-4 text-center">{count}</span>
        <button
          type="button"
          onClick={onIncrement}
          disabled={disableIncrement}
          className="size-[28px] rounded-full border border-[#dedede] flex items-center justify-center text-[#5f686c] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Plus
            data-theme-color="heroBookingIcon"
            className="size-3.5"
            style={{ color: "var(--theme-hero-booking-icon, #5f686c)" }}
          />
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
  translations: t,
}: TourGuestsDropdownContentProps) {
  const totalGuests = passengers.adults + passengers.children + passengers.infants
  const isAtMax = maxPassengers ? totalGuests >= maxPassengers : false
  return (
    <div className="bg-white rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-bold text-gray-900">{t.passengers}</h3>
        <button type="button" onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
          <X
            data-theme-color="heroBookingIcon"
            className="w-4 h-4"
            style={{ color: "var(--theme-hero-booking-icon, #6B7280)" }}
          />
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
        />
        <GuestRow
          icon={<User className="size-5" />}
          label={t.children}
          description={t.childrenAge}
          count={passengers.children}
          onDecrement={() => setPassengers((p) => ({ ...p, children: Math.max(0, p.children - 1) }))}
          onIncrement={() => setPassengers((p) => ({ ...p, children: p.children + 1 }))}
          disableIncrement={isAtMax}
        />
        <GuestRow
          icon={<Baby className="size-5" />}
          label={t.infant}
          description={t.infantAge}
          count={passengers.infants}
          onDecrement={() => setPassengers((p) => ({ ...p, infants: Math.max(0, p.infants - 1) }))}
          onIncrement={() => setPassengers((p) => ({ ...p, infants: p.infants + 1 }))}
          disableIncrement={isAtMax}
        />
      </div>

      <button
        type="button"
        onClick={onClose}
        className="w-full mt-4 py-3 rounded-lg font-bold transition-colors text-white"
        style={{ backgroundColor: "var(--theme-hero-booking-accent, #29C5F6)" }}
      >
        {t.done}
      </button>
    </div>
  )
}
