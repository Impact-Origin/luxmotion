"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import { Minus, Plus, CalendarClock, Users, Layers, ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { TourDateTimePicker } from "@/components/tours/tour-date-time-picker"
import { useTourAvailability } from "@/hooks/use-tour-data"
import { BookingAddonsSelector, type BookingAddon } from "@/components/shared/booking-addons-selector"
import { useMoney } from "@/components/currency-provider"

interface TourBookingCardProps {
  price: number
  currency?: string
  rating: number
  reviewCount: number
  tourId?: string
  skipAvailability?: boolean
  fixedDateTime?: number
  hideReviews?: boolean
  minPassengers?: number
  maxPassengers?: number
  addons?: BookingAddon[]
  onBook?: (data: BookingData) => void
}

interface BookingData {
  date: Date | null
  time: string | null
  adults: number
  children: number
  infants: number
  total: number
  selectedAddons?: Array<{
    addonId: string
    title: string
    price: number
    pricingType: "per_person" | "flat"
    quantity: number
    subtotal: number
  }>
  addonsTotal?: number
}

function CounterButton({ onClick, disabled, children }: { onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="size-[32px] border border-[rgba(255,255,255,0.12)] flex items-center justify-center text-[#999] hover:border-[rgba(201,169,110,0.5)] hover:text-[#C9A96E] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
    >
      {children}
    </button>
  )
}

function PaxRow({ label, desc, count, onDec, onInc, disableInc }: { label: string; desc: string; count: number; onDec: () => void; onInc: () => void; disableInc?: boolean }) {
  return (
    <div className="flex items-center justify-between px-[14px] py-[12px] border-b border-[rgba(255,255,255,0.04)] last:border-b-0">
      <div className="flex flex-col">
        <span className="text-[12px] font-medium text-white">{label}</span>
        <span className="text-[10px] text-[#8c8680]">{desc}</span>
      </div>
      <div className="flex items-center">
        <CounterButton onClick={onDec} disabled={count <= 0}>
          <Minus className="size-[14px]" />
        </CounterButton>
        <div className="w-[40px] text-center text-[14px] font-medium text-white">{count}</div>
        <CounterButton onClick={onInc} disabled={disableInc}>
          <Plus className="size-[14px]" />
        </CounterButton>
      </div>
    </div>
  )
}

export function TourBookingCard({ price, currency = "€", rating, reviewCount, tourId, skipAvailability, fixedDateTime, hideReviews, minPassengers, maxPassengers, addons, onBook }: TourBookingCardProps) {
  const t = useTranslations("tourDetails")
  const { format } = useMoney()
  const [dateTime, setDateTime] = useState<{ date: Date | null; time: string | null }>({ date: null, time: null })
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [infants, setInfants] = useState(0)
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([])

  useEffect(() => {
    if (fixedDateTime) {
      const fixedDate = new Date(fixedDateTime)
      const timeStr = fixedDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
      setDateTime({ date: fixedDate, time: timeStr })
    }
  }, [fixedDateTime])

  const [dateRange, setDateRange] = useState(() => {
    const now = new Date()
    const startDate = Date.UTC(now.getFullYear(), now.getMonth(), 1)
    const endDate = Date.UTC(now.getFullYear(), now.getMonth() + 2, 0, 23, 59, 59, 999)
    return { startDate, endDate }
  })

  const { availability, bookingDeadlineHours, isLoading: isLoadingAvailability } = useTourAvailability(
    skipAvailability ? null : (tourId || null),
    dateRange.startDate,
    dateRange.endDate
  )

  const handleMonthChange = useCallback((startDate: number, endDate: number) => {
    const extendedEnd = new Date(endDate)
    extendedEnd.setMonth(extendedEnd.getMonth() + 1)
    setDateRange({ startDate, endDate: extendedEnd.getTime() })
  }, [])

  const formatFixedDateTime = () => {
    if (!fixedDateTime) return null
    const date = new Date(fixedDateTime)
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    const time = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
    return `${day}/${month}/${year} ${t("at")} ${time}`
  }

  const totalGuests = adults + children + infants

  const handleToggleAddon = useCallback((addonId: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    )
  }, [])

  const addonsTotal = useMemo(() => {
    if (!addons) return 0
    return addons
      .filter((a) => selectedAddonIds.includes(a._id))
      .reduce((sum, a) => sum + (a.pricingType === "per_person" ? a.price * (totalGuests || 1) : a.price), 0)
  }, [addons, selectedAddonIds, totalGuests])

  const payingGuests = adults + children
  const total = price * (totalGuests || 1) + addonsTotal
  const isAtMax = maxPassengers ? totalGuests >= maxPassengers : false
  const isBelowMin = minPassengers ? payingGuests < minPassengers : false

  const handleBook = () => {
    const selectedAddonsData = addons
      ?.filter((a) => selectedAddonIds.includes(a._id))
      .map((a) => ({
        addonId: a._id,
        title: a.title,
        price: a.price,
        pricingType: a.pricingType,
        quantity: a.pricingType === "per_person" ? (totalGuests || 1) : 1,
        subtotal: a.pricingType === "per_person" ? a.price * (totalGuests || 1) : a.price,
      }))

    onBook?.({
      date: dateTime.date,
      time: dateTime.time,
      adults,
      children,
      infants,
      total,
      selectedAddons: selectedAddonsData?.length ? selectedAddonsData : undefined,
      addonsTotal: addonsTotal > 0 ? addonsTotal : undefined,
    })
  }

  return (
    <div className="bg-[#1A1A1A] border border-[rgba(201,169,110,0.12)] overflow-hidden" style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
      <div className="h-[2px] bg-gradient-to-r from-[#C9A96E] to-[rgba(201,169,110,0.2)]" />

      <div className="border-b border-[rgba(255,255,255,0.05)] px-6 pt-6 pb-5">
        <span className="text-[12px] font-semibold text-[#8c8680] tracking-[1.35px] uppercase">{t("from")}</span>
        <div className="flex items-baseline gap-[10px] mt-1">
          <span className="text-[48px] font-semibold text-[#C9A96E] leading-[48px]" style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif" }}>
            {format(price)}
          </span>
          <span className="text-[14px] text-[rgba(255,255,255,0.3)]">{t("perPerson")}</span>
        </div>
        {!hideReviews && (
          <div className="flex items-center gap-[6px] mt-1">
            <span className="text-[12px] text-[#C9A96E] tracking-[0.5px]">★★★★★</span>
            <span className="text-[12px] font-semibold text-white">{rating.toFixed(1)}</span>
            <span className="text-[12px] text-[#999]">· {reviewCount} {t("reviews")}</span>
          </div>
        )}
      </div>

      <div className="px-6 py-6 flex flex-col gap-[10px]">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <CalendarClock className="size-4 text-[#999]" strokeWidth={1.2} />
            <span className="text-[12px] font-semibold text-[#999] tracking-[1.35px] uppercase">{t("dateAndTime")}</span>
          </div>
          {fixedDateTime ? (
            <div className="w-full h-[44px] px-[13px] border border-[rgba(255,255,255,0.12)] bg-[#1E1D1B] flex items-center gap-3">
              <span className="flex-1 text-[14px] text-[#999]">{formatFixedDateTime()}</span>
              <CalendarClock className="size-6 text-[#999]" strokeWidth={1.2} />
            </div>
          ) : (
            <TourDateTimePicker
              value={dateTime}
              onChange={setDateTime}
              availability={availability}
              bookingDeadlineHours={bookingDeadlineHours}
              isLoading={isLoadingAvailability}
              onMonthChange={handleMonthChange}
            />
          )}
        </div>

        <div className="flex items-center gap-2 pt-3">
          <Users className="size-4 text-[#999]" strokeWidth={1.2} />
          <span className="text-[12px] font-semibold text-[#999] tracking-[1.35px] uppercase">{t("passengers")}</span>
        </div>

        <div className="border border-[rgba(255,255,255,0.06)]">
          <PaxRow label={t("adult")} desc={t("adultAge")} count={adults} onDec={() => setAdults(Math.max(1, adults - 1))} onInc={() => setAdults(adults + 1)} disableInc={isAtMax} />
          <PaxRow label={t("children")} desc={t("childrenAge")} count={children} onDec={() => setChildren(Math.max(0, children - 1))} onInc={() => setChildren(children + 1)} disableInc={isAtMax} />
          <PaxRow label={t("infant")} desc={t("infantAge")} count={infants} onDec={() => setInfants(Math.max(0, infants - 1))} onInc={() => setInfants(infants + 1)} disableInc={isAtMax} />
        </div>

        {addons && addons.length > 0 && (
          <>
            <div className="flex items-center gap-2 pt-3">
              <Layers className="size-4 text-[#999]" strokeWidth={1.2} />
              <span className="text-[12px] font-semibold text-[#999] tracking-[1.35px] uppercase">{t("addOns")}</span>
            </div>
            <BookingAddonsSelector
              addons={addons}
              selectedAddonIds={selectedAddonIds}
              onToggleAddon={handleToggleAddon}
              totalGuests={totalGuests || 1}
              currency={currency}
            />
          </>
        )}

        <div className="border-t border-[rgba(255,255,255,0.06)] pt-4 pb-4 flex items-center justify-between">
          <span className="text-[12px] font-bold text-[#999] tracking-[1px] uppercase">{t("total")}</span>
          <span className="text-[32px] font-bold text-white" style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif" }}>
            {format(total)}
          </span>
        </div>

        <button
          onClick={handleBook}
          disabled={(!fixedDateTime && !dateTime.time) || isBelowMin}
          className="w-full h-[48px] bg-[#C9A96E] border border-[#C9A96E] flex items-center justify-center gap-2 hover:bg-[#b8954f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-[14px] font-medium text-[#0D0D0D] uppercase tracking-[1.1px]">{t("bookNow")}</span>
          <ArrowRight className="size-[18px] text-[#0D0D0D]" />
        </button>

        <div
          aria-hidden={!isBelowMin}
          className={`grid transition-all duration-300 ease-out ${
            isBelowMin ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <p className="text-[12px] text-[#999] text-center pt-1">
              {t("minPassengersRequired", { count: minPassengers ?? 1 })}
            </p>
          </div>
        </div>

        <div className="border-t border-[rgba(255,255,255,0.04)] pt-4 flex items-center justify-center gap-2">
          <span className="relative inline-flex size-2">
            <span className="absolute inset-0 rounded-full bg-[#4ADE80] opacity-75 animate-ping" />
            <span className="relative inline-flex size-2 rounded-full bg-[#4ADE80]" />
          </span>
          <span className="text-[10px] font-semibold text-[#C9A96E]">141 {t("travelers")}</span>
          <span className="text-[10px] text-[#999]">{t("bookedToday")}</span>
        </div>
      </div>
    </div>
  )
}
