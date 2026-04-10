"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import { Star, User, Baby, CalendarCheck2, Minus, Plus, CalendarDays, Calendar } from "lucide-react"
import { useTranslations } from "next-intl"
import { TourDateTimePicker } from "./tour-date-time-picker"
import { useTourAvailability } from "@/hooks/use-tour-data"
import { BookingAddonsSelector, type BookingAddon } from "@/components/shared/booking-addons-selector"

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
        <div className="size-5 text-[#27c7ff]">{icon}</div>
        <div className="flex flex-col">
          <span className="text-[16px] font-semibold text-[#0c171c] leading-[23px]">{label}</span>
          <span className="text-[14px] text-[#5f686c] leading-[20px]">{description}</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={onDecrement}
          disabled={count <= minCount}
          className="size-[31px] rounded-full border border-[#dedede] flex items-center justify-center text-[#5f686c] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Minus className="size-4" />
        </button>
        <span className="text-[18px] font-semibold text-[#0c171c] w-4 text-center">{count}</span>
        <button
          onClick={onIncrement}
          disabled={disableIncrement}
          className="size-[31px] rounded-full border border-[#dedede] flex items-center justify-center text-[#5f686c] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  )
}

export function TourBookingCard({ price, currency = "€", rating, reviewCount, tourId, skipAvailability, fixedDateTime, hideReviews, minPassengers, maxPassengers, addons, onBook }: TourBookingCardProps) {
  const t = useTranslations("tourDetails")
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

  const total = price * (totalGuests || 1) + addonsTotal
  const isAtMax = maxPassengers ? totalGuests >= maxPassengers : false
  const isBelowMin = minPassengers ? totalGuests < minPassengers : false

  const formatPrice = (value: number) => {
    return value.toLocaleString("de-DE")
  }

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
    <div className="bg-white border border-[#dedede] rounded-[19px] shadow-[0px_4px_19px_rgba(0,0,0,0.08)] overflow-hidden">
      <div className="border-b border-[#dedede] px-6 py-6">
        <span className="text-[14px] text-[#5f686c]">{t("from")}</span>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-[35px] font-bold text-[#0c171c] leading-none">
            {currency}{formatPrice(price)}
          </span>
          {!hideReviews && (
            <div className="flex items-center gap-2">
              <Star className="size-[23px] text-[#f5a623] fill-[#f5a623]" />
              <span className="text-[14px] text-[#5f686c]">
                {rating.toFixed(1)} ({reviewCount} {t("reviews")})
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="flex flex-col gap-3 mb-6">
          <div className="flex items-center gap-1">
            <CalendarDays className="size-5 text-[#27C7FF]" />
            <span className="text-[16px] font-semibold text-[#0c171c]">{t("dateAndTime")}</span>
          </div>
          {fixedDateTime ? (
            <div className="w-full h-[47px] px-4 border border-[#27c7ff] rounded-[12px] bg-[#f8f9fa] flex items-center gap-3 cursor-not-allowed">
              <Calendar className="w-5 h-5 shrink-0 text-[#27c7ff]" />
              <span className="flex-1 text-left text-[15px] text-[#222222]">
                {formatFixedDateTime()}
              </span>
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

        <div className="bg-[#f8f9fa] rounded-[16px] p-6 flex flex-col gap-4">
          <GuestRow
            icon={<User className="size-5" />}
            label={t("adult")}
            description={t("adultAge")}
            count={adults}
            onDecrement={() => setAdults(Math.max(1, adults - 1))}
            onIncrement={() => setAdults(adults + 1)}
            minCount={1}
            disableIncrement={isAtMax}
          />
          <GuestRow
            icon={<User className="size-5" />}
            label={t("children")}
            description={t("childrenAge")}
            count={children}
            onDecrement={() => setChildren(Math.max(0, children - 1))}
            onIncrement={() => setChildren(children + 1)}
            disableIncrement={isAtMax}
          />
          <GuestRow
            icon={<Baby className="size-5" />}
            label={t("infant")}
            description={t("infantAge")}
            count={infants}
            onDecrement={() => setInfants(Math.max(0, infants - 1))}
            onIncrement={() => setInfants(infants + 1)}
            disableIncrement={isAtMax}
          />
        </div>

        {addons && addons.length > 0 && (
          <BookingAddonsSelector
            addons={addons}
            selectedAddonIds={selectedAddonIds}
            onToggleAddon={handleToggleAddon}
            totalGuests={totalGuests || 1}
            currency={currency}
          />
        )}

        <div className="border-t border-[#dedede] mt-6 pt-6">
          <div className="flex items-center justify-between mb-6">
            <span className="text-[14px] text-[#5f686c] tracking-[1px] uppercase">{t("total")}</span>
            <span className="text-[31px] font-bold text-[#0c171c]">
              {currency}{formatPrice(total)}
            </span>
          </div>

          <button
            onClick={handleBook}
            disabled={(!fixedDateTime && !dateTime.time) || isBelowMin}
            className="w-full h-[56px] bg-[#27c7ff] rounded-[8px] flex items-center justify-center gap-2 hover:bg-[#1eb8f0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#27c7ff]"
          >
            <CalendarCheck2 className="size-6 text-[#0e4659]" />
            <span className="text-[16px] font-bold text-[#0e4659] uppercase tracking-[0.16px]">
              {t("bookNow")}
            </span>
          </button>
          {isBelowMin && (
            <p className="text-[13px] text-[#e74c3c] text-center mt-2">
              {t("minPassengersRequired", { count: minPassengers ?? 1 })}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
