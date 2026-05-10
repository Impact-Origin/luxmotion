"use client"

import { useState, useCallback, type RefObject, type Dispatch, type SetStateAction } from "react"
import { ChevronDown, Users, BadgeCheck, MapPinned, X, Calendar, ExternalLink } from "lucide-react"
import { TourDateTimePicker } from "@/components/tours/tour-date-time-picker"
import { TourGuestsDropdownContent } from "./tour-guests-dropdown"
import type { TripType, TourPassengerState, WidgetProductItem } from "./types"
import { useIsMobile } from "@/hooks/use-is-mobile"
import { MobileDrawer } from "../../ui/mobile-drawer"
import { cn } from "@workspace/ui/lib/utils"
import { useTourAvailability } from "@/hooks/use-tour-data"
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover"
import { toast } from "sonner"

interface EventsTourFormProps {
  tripType: TripType
  passengers: TourPassengerState
  showPassengersDropdown: boolean
  setShowPassengersDropdown: (show: boolean) => void
  passengersRef: RefObject<HTMLDivElement | null>
  setPassengers: Dispatch<SetStateAction<TourPassengerState>>
  selectedItem: WidgetProductItem | null
  setSelectedItem: (item: WidgetProductItem | null) => void
  departureDateTime: { date: Date | null; time: string | null }
  setDepartureDateTime: (value: { date: Date | null; time: string | null }) => void
  items: WidgetProductItem[]
  onContinue?: (item: WidgetProductItem, dateTime: { date: Date | null; time: string | null }, passengers: TourPassengerState) => void
  translations: {
    chooseEvent: string
    chooseTour: string
    noEvents: string
    noTours: string
    clearSelection: string
    placeholderDeparture: string
    continue: string
    passengers: string
    adults: string
    adultAge: string
    children: string
    childrenAge: string
    infant: string
    infantAge: string
    done: string
    readMore: string
  }
}

export function EventsTourForm({
  tripType,
  passengers,
  showPassengersDropdown,
  setShowPassengersDropdown,
  passengersRef,
  setPassengers,
  selectedItem,
  setSelectedItem,
  departureDateTime,
  setDepartureDateTime,
  items,
  onContinue,
  translations: t,
}: EventsTourFormProps) {
  const [showEventDropdown, setShowEventDropdown] = useState(false)
  const isMobile = useIsMobile()
  const totalPassengers = passengers.adults + passengers.children + passengers.infants
  const isEvents = tripType === "events"
  const hasRequiredDateTime =
    selectedItem?.productType === "event"
      ? Boolean(selectedItem?.eventDate)
      : Boolean(departureDateTime.date && departureDateTime.time)
  const isContinueDisabled =
    !selectedItem ||
    !hasRequiredDateTime ||
    (selectedItem?.minPassengers ? totalPassengers < selectedItem.minPassengers : false)

  const handleContinue = () => {
    if (!selectedItem) {
      toast.error(isEvents ? t.chooseEvent : t.chooseTour, { position: "top-center" })
      return
    }
    if (!hasRequiredDateTime) {
      toast.error(t.placeholderDeparture, { position: "top-center" })
      return
    }
    if (selectedItem?.minPassengers && totalPassengers < selectedItem.minPassengers) {
      toast.error(`${t.passengers}: ${selectedItem.minPassengers}+`, { position: "top-center" })
      return
    }
    if (onContinue) {
      onContinue(selectedItem, departureDateTime, passengers)
    }
  }

  const [dateRange, setDateRange] = useState(() => {
    const now = new Date()
    return {
      startDate: Date.UTC(now.getFullYear(), now.getMonth(), 1),
      endDate: Date.UTC(now.getFullYear(), now.getMonth() + 2, 0, 23, 59, 59, 999)
    }
  })

  const tourId = selectedItem?.productType !== "event" ? selectedItem?._id : null
  const { availability, bookingDeadlineHours, isLoading: isLoadingAvailability } = useTourAvailability(
    tourId || null,
    dateRange.startDate,
    dateRange.endDate
  )

  const handleMonthChange = useCallback((startDate: number, endDate: number) => {
    const extendedEnd = new Date(endDate)
    extendedEnd.setMonth(extendedEnd.getMonth() + 1)
    setDateRange({ startDate, endDate: extendedEnd.getTime() })
  }, [])

  const formatEventDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")
    return `${day}/${month}/${year} • ${hours}:${minutes}`
  }

  const handleSelectItem = (item: WidgetProductItem) => {
    setSelectedItem(item)
    setShowEventDropdown(false)
    if (item.productType === "event" && item.eventDate) {
      const eventDate = new Date(item.eventDate)
      const timeStr = eventDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
      setDepartureDateTime({ date: eventDate, time: timeStr })
    } else {
      setDepartureDateTime({ date: null, time: null })
    }
  }

  const basePath = isEvents ? "/events" : "/tours/tour"

  const emptyMessage = isEvents ? t.noEvents : t.noTours
  const eventContent = (
    <div className={cn("flex flex-col overflow-y-auto max-h-96", isMobile && "-mx-4")}>
      {items.length === 0 ? (
        <div className="p-6 text-center text-[#696969] text-sm">
          {emptyMessage}
        </div>
      ) : (
        items.map((item) => (
          <div
            key={item._id}
            className="flex items-center gap-3 p-3 hover:bg-white/5 border-b border-[rgba(255,255,255,0.08)] last:border-b-0"
          >
            <div
              onClick={() => handleSelectItem(item)}
              className="w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
            >
              {item.image ? (
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#C9A96E]/20 to-[#C9A96E]/5 flex items-center justify-center">
                  <MapPinned className="w-5 h-5 text-[#C9A96E]/50" />
                </div>
              )}
            </div>
            <div
              onClick={() => handleSelectItem(item)}
              className="flex-1 min-w-0 cursor-pointer"
            >
              <span className="text-sm font-medium text-white line-clamp-1">{item.title}</span>
              {item.subtitle && (
                <p className="text-xs text-[#999] mt-0.5 line-clamp-2">{item.subtitle}</p>
              )}
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                window.open(`${basePath}/${item.slug}`, "_blank")
              }}
              className="text-xs font-medium shrink-0 flex items-center gap-1 px-2 py-1 rounded hover:bg-white/10 transition-colors"
              style={{ color: "#C9A96E" }}
            >
              {t.readMore}
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        ))
      )}
    </div>
  )

  return (
    <div className="flex flex-col">
      <div className="flex flex-col lg:flex-row items-stretch min-h-[64px]" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="relative flex-[1.6] min-w-0 border-b lg:border-b-0 lg:border-r border-[rgba(255,255,255,0.08)] min-h-[64px] booking-section focus-within:z-30 " style={{ backgroundColor: "transparent", borderColor: "rgba(255,255,255,0.08)" }}>
          <Popover open={!isMobile && showEventDropdown} onOpenChange={setShowEventDropdown}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="w-full h-full pl-6 pr-12 py-3 bg-transparent cursor-pointer flex items-center gap-3 outline-none hover:bg-white/5 transition-colors"
              >
                <MapPinned className="w-5 h-5 shrink-0" strokeWidth={1.2} style={{ color: "#C9A96E" }} />
                <span className={cn("text-[15px] font-medium leading-tight text-left flex-1 min-w-0 truncate", selectedItem ? "text-white" : "text-[#696969]")}>
                  {selectedItem ? selectedItem.title : (isEvents ? t.chooseEvent : t.chooseTour)}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent
              side="bottom"
              align="start"
              sideOffset={8}
              className="p-0 rounded-none shadow-xl border border-[rgba(255,255,255,0.12)] bg-[#1e1d1b] overflow-hidden w-[var(--radix-popover-trigger-width)] min-w-[340px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 duration-200"
            >
              {eventContent}
            </PopoverContent>
          </Popover>

          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {selectedItem && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedItem(null)
                  setDepartureDateTime({ date: null, time: null })
                  setShowEventDropdown(false)
                }}
                className="p-1 rounded-full hover:bg-white/10 text-[#696969] hover:text-white transition-colors"
                title={t.clearSelection}
                aria-label={t.clearSelection}
              >
                <X className="w-4 h-4" strokeWidth={1.2} />
              </button>
            )}
            <ChevronDown className={cn("w-4 h-4 pointer-events-none transition-transform duration-200", showEventDropdown && "rotate-180")} style={{ color: "#C9A96E" }} />
          </div>

          {isMobile && (
            <MobileDrawer
              dark
              open={showEventDropdown}
              onOpenChange={setShowEventDropdown}
              title={isEvents ? t.chooseEvent : t.chooseTour}
            >
              {eventContent}
            </MobileDrawer>
          )}
        </div>

        <div className="flex-1 border-b lg:border-b-0 lg:border-r border-[rgba(255,255,255,0.08)] flex items-center booking-section" style={{ backgroundColor: "transparent", borderColor: "rgba(255,255,255,0.08)" }}>
          {selectedItem?.productType === "event" && selectedItem.eventDate ? (
            <div className="w-full h-full px-6 py-3 flex items-center gap-3">
              <Calendar className="w-5 h-5 shrink-0" style={{ color: "#C9A96E" }} />
              <span className="text-[15px] font-medium text-white">{formatEventDate(selectedItem.eventDate)}</span>
            </div>
          ) : selectedItem ? (
            <div className="w-full px-2">
              <TourDateTimePicker
                value={departureDateTime}
                onChange={setDepartureDateTime}
                availability={availability}
                bookingDeadlineHours={bookingDeadlineHours}
                isLoading={isLoadingAvailability}
                onMonthChange={handleMonthChange}
              />
            </div>
          ) : (
            <div className="w-full h-full px-6 py-3 flex items-center gap-3">
              <Calendar className="w-5 h-5 shrink-0" style={{ color: "#C9A96E" }} />
              <span className="text-[15px] text-[#696969]">{t.placeholderDeparture}</span>
            </div>
          )}
        </div>

        <div className="relative flex-[0.7] flex items-center border-b lg:border-b-0 lg:border-r border-[rgba(255,255,255,0.08)]" ref={passengersRef} style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <Popover open={showPassengersDropdown} onOpenChange={setShowPassengersDropdown}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="relative flex items-center justify-center gap-4 px-6 py-3 w-full h-full cursor-pointer transition-colors hover:bg-white/5 booking-section outline-none"
                style={{
                  backgroundColor: "transparent",
                  color: "#C9A96E",
                  borderColor: "rgba(255,255,255,0.08)"
                }}
              >
                <div className="flex items-center gap-[8px] text-[#C9A96E]">
                  <Users className="w-5 h-5" style={{ color: "#C9A96E" }} strokeWidth={1.2} />
                  <span className="text-[14px] font-black leading-none" style={{ color: "#C9A96E" }}>{totalPassengers}</span>
                </div>
                <ChevronDown className="w-4 h-4" style={{ color: "#C9A96E" }} strokeWidth={1.2} />
              </button>
            </PopoverTrigger>
            <PopoverContent
              side="bottom"
              align="end"
              sideOffset={8}
              className="w-80 p-0 border border-[rgba(255,255,255,0.12)] bg-[#1e1d1b] shadow-xl rounded-none z-50"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <TourGuestsDropdownContent
                passengers={passengers}
                setPassengers={setPassengers}
                onClose={() => setShowPassengersDropdown(false)}
                maxPassengers={selectedItem?.maxPassengers}
                translations={t}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center self-stretch w-full lg:w-auto shrink-0">
          <button
            type="button"
            onClick={handleContinue}
            className="bg-[#C9A96E] flex items-center justify-center gap-3 px-6 py-[22px] h-full w-full lg:w-[283px] transition-all hover:brightness-95 active:scale-95 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            <span className="text-[14px] font-semibold uppercase tracking-[1.1px] text-[rgba(13,13,13,0.96)]">
              {t.continue}
            </span>
            <BadgeCheck className="w-5 h-5 stroke-[1.2] text-[rgba(13,13,13,0.96)]" />
          </button>
        </div>
      </div>

      {selectedItem && (
        <div className="flex flex-col md:flex-row gap-4 p-4 border-b border-[rgba(255,255,255,0.08)]">
          <div className="w-full md:w-72 h-44 rounded-xl overflow-hidden flex-shrink-0">
            {selectedItem.image ? (
              <img src={selectedItem.image} alt={selectedItem.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#C9A96E]/30 to-[#C9A96E]/5 flex items-center justify-center">
                <MapPinned className="w-12 h-12 text-[#C9A96E]/50" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white line-clamp-2 break-words">{selectedItem.title}</h3>
                {selectedItem.subtitle && (
                  <p className="text-sm text-[#999] mt-1 line-clamp-3">{selectedItem.subtitle}</p>
                )}
                <button
                  type="button"
                  onClick={() => window.open(`${basePath}/${selectedItem.slug}`, "_blank")}
                  className="text-sm font-medium mt-2 flex items-center gap-1 hover:underline"
                  style={{ color: "#C9A96E" }}
                >
                  {t.readMore}
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-lg font-bold text-white">€ {(selectedItem.price * (passengers.adults + passengers.children || 1)).toFixed(2)}</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedItem(null)
                    setDepartureDateTime({ date: null, time: null })
                  }}
                  className="p-1.5 rounded-full hover:bg-white/10 text-[#696969] hover:text-white transition-colors"
                  title={t.clearSelection}
                  aria-label={t.clearSelection}
                >
                  <X className="w-5 h-5" strokeWidth={1.2} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
