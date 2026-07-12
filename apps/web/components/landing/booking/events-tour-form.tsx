"use client"

import { useState, useCallback, type RefObject, type Dispatch, type SetStateAction } from "react"
import { ChevronDown, Users, BadgeCheck, MapPinned, X, Calendar, ExternalLink } from "lucide-react"
import { TourDateTimePicker } from "@/components/tours/tour-date-time-picker"
import { TourGuestsDropdownContent } from "./tour-guests-dropdown"
import type { TripType, TourPassengerState, WidgetProductItem } from "./types"
import { cn } from "@workspace/ui/lib/utils"
import { Themed } from "@/components/themed"
import { useMoney } from "@/components/currency-provider"
import { useTourAvailability } from "@/hooks/use-tour-data"
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover"
import { useIsMobile } from "@/hooks/use-is-mobile"
import { MobileDrawer } from "@/components/ui/mobile-drawer"
import { useDynamicTheme } from "@/components/dynamic-theme-provider"
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
  const { isPreviewMode } = useDynamicTheme()
  const { format } = useMoney()
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
    return `${day}/${month}/${year} - ${hours}:${minutes}`
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
        <div className="p-6 text-center text-[#808080] text-sm">
          {emptyMessage}
        </div>
      ) : (
        items.map((item) => (
          <div
            key={item._id}
            className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
          >
            <div
              onClick={() => handleSelectItem(item)}
              className="w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
            >
              {item.image ? (
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#29C5F6]/20 to-[#29C5F6]/5 flex items-center justify-center">
                  <MapPinned
                    data-theme-color="heroBookingIcon"
                    className="w-5 h-5"
                    style={{ color: "var(--theme-hero-booking-icon, #29C5F6)" }}
                  />
                </div>
              )}
            </div>
            <div
              onClick={() => handleSelectItem(item)}
              className="flex-1 min-w-0 cursor-pointer"
            >
              <span className="text-sm font-medium text-gray-900 line-clamp-1">{item.title}</span>
              {item.subtitle && (
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{item.subtitle}</p>
              )}
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                window.open(`${basePath}/${item.slug}`, "_blank")
              }}
              className="text-xs font-medium shrink-0 flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
              style={{ color: "var(--theme-hero-booking-accent, #29C5F6)" }}
            >
              {t.readMore}
              <ExternalLink
                data-theme-color="heroBookingIcon"
                className="w-3 h-3"
                style={{ color: "var(--theme-hero-booking-icon, #29C5F6)" }}
              />
            </button>
          </div>
        ))
      )}
    </div>
  )

  return (
    <div className="flex flex-col">
      <style dangerouslySetInnerHTML={{ __html: `
        [data-theme-provider] .BookingWidget .force-blue-icon,
        [data-theme-provider] .BookingWidget .force-blue-icon svg,
        [data-theme-provider] .BookingWidget svg.force-blue-icon {
          color: var(--theme-hero-booking-icon, #27C7FF) !important;
          stroke: var(--theme-hero-booking-icon, #27C7FF) !important;
          fill: none !important;
        }
      `}} />
      <div className="flex flex-col lg:flex-row items-stretch min-h-[64px]" style={{ borderColor: "var(--theme-hero-booking-border, #f0f0f0)" }}>
        <div className="relative flex-[1.6] min-w-0 border-b lg:border-b-0 lg:border-r border-gray-100 min-h-[64px] booking-section focus-within:z-30 lg:rounded-l-[20px]" style={{ backgroundColor: "var(--theme-hero-booking-bg, #ffffff)", borderColor: "var(--theme-hero-booking-border, #f0f0f0)" }}>
          <div
            data-theme-color="heroBookingIcon"
            className={cn("absolute left-6 top-1/2 -translate-y-1/2 z-10 force-blue-icon", !isPreviewMode && "pointer-events-none")}
          >
            <MapPinned data-theme-color="heroBookingIcon" className="w-5 h-5 force-blue-icon" strokeWidth={2.5} style={{ color: "var(--theme-hero-booking-icon, #27C7FF)" }} />
          </div>

          <Popover open={!isMobile && showEventDropdown} onOpenChange={setShowEventDropdown}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="w-full h-full pl-14 pr-10 py-4 md:py-3 bg-transparent cursor-pointer flex items-center outline-none hover:bg-zinc-50/50 transition-colors"
              >
                <span className={cn("text-[15px] font-medium leading-tight text-left flex-1 min-w-0 truncate", selectedItem ? "text-[#222]" : "text-[#808080]")} style={{ color: selectedItem ? "var(--theme-hero-booking-input-text, #222)" : "var(--theme-hero-booking-placeholder, #808080)" }}>
                  {selectedItem ? selectedItem.title : (isEvents ? t.chooseEvent : t.chooseTour)}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent
              side="bottom"
              align="start"
              sideOffset={8}
              className="p-0 rounded-xl shadow-xl border border-gray-100 bg-white overflow-hidden w-[var(--radix-popover-trigger-width)] min-w-[340px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 duration-200"
              style={{ backgroundColor: "var(--theme-hero-booking-bg, #ffffff)", borderColor: "var(--theme-hero-booking-border, #f3f4f6)" }}
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
                className="p-1 rounded-full hover:bg-gray-100 text-[#808080] hover:text-[#222] transition-colors"
                title={t.clearSelection}
                aria-label={t.clearSelection}
              >
                <X
                  data-theme-color="heroBookingIcon"
                  className="w-4 h-4"
                  strokeWidth={2.5}
                  style={{ color: "var(--theme-hero-booking-icon, #6B7280)" }}
                />
              </button>
            )}
            <ChevronDown
              data-theme-color="heroBookingIcon"
              className={cn("w-4 h-4 transition-transform duration-200", !isPreviewMode && "pointer-events-none", showEventDropdown && "rotate-180")}
              style={{ color: "var(--theme-hero-booking-icon, #27C7FF)" }}
            />
          </div>

          {isMobile && (
            <MobileDrawer
              open={showEventDropdown}
              onOpenChange={setShowEventDropdown}
              title={isEvents ? t.chooseEvent : t.chooseTour}
            >
              {eventContent}
            </MobileDrawer>
          )}
        </div>

        <div className="flex-1 border-b lg:border-b-0 lg:border-r border-gray-100 flex items-center booking-section" style={{ backgroundColor: "var(--theme-hero-booking-input-bg, transparent)", borderColor: "var(--theme-hero-booking-border, #f0f0f0)" }}>
          {selectedItem?.productType === "event" && selectedItem.eventDate ? (
            <div className="w-full h-full px-6 py-3 flex items-center gap-3">
              <Calendar data-theme-color="heroBookingIcon" className="w-5 h-5 shrink-0" style={{ color: "var(--theme-hero-booking-icon, #27C7FF)" }} />
              <span className="text-[15px] font-medium" style={{ color: "var(--theme-hero-booking-input-text, #222)" }}>{formatEventDate(selectedItem.eventDate)}</span>
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
              <Calendar data-theme-color="heroBookingIcon" className="w-5 h-5 shrink-0" style={{ color: "var(--theme-hero-booking-icon, #27C7FF)" }} />
              <span className="text-[15px]" style={{ color: "var(--theme-hero-booking-placeholder, #808080)" }}>{t.placeholderDeparture}</span>
            </div>
          )}
        </div>

        <div className="relative flex-[0.7] flex items-center border-b lg:border-b-0 lg:border-r border-gray-100" ref={passengersRef} style={{ borderColor: "var(--theme-hero-booking-border, #f0f0f0)" }}>
          <Popover open={showPassengersDropdown} onOpenChange={setShowPassengersDropdown}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="relative flex items-center justify-center gap-4 px-4 py-3 w-full h-full cursor-pointer transition-colors hover:bg-zinc-50/50 booking-section outline-none"
                style={{
                  backgroundColor: "var(--theme-hero-booking-input-bg, transparent)",
                  color: "var(--theme-hero-booking-accent, #27C7FF)",
                  borderColor: "var(--theme-hero-booking-border, #f0f0f0)"
                }}
              >
                <div className="flex items-center gap-[8px]" style={{ color: "var(--theme-hero-booking-icon, #27C7FF)" }}>
                  <Users data-theme-color="heroBookingIcon" className="w-5 h-5" style={{ color: "var(--theme-hero-booking-icon, #27C7FF)" }} strokeWidth={2.5} />
                  <span className="text-[14px] font-black leading-none" style={{ color: "var(--theme-hero-booking-icon, #27C7FF)" }}>{totalPassengers}</span>
                </div>
                <ChevronDown data-theme-color="heroBookingIcon" className="w-4 h-4" style={{ color: "var(--theme-hero-booking-icon, #27C7FF)" }} strokeWidth={3} />
              </button>
            </PopoverTrigger>
            <PopoverContent
              side="bottom"
              align="end"
              sideOffset={8}
              className="w-80 p-0 border border-gray-100 shadow-xl rounded-xl z-50"
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

        <div className="flex items-center w-full lg:w-auto p-1.5 shrink-0 lg:rounded-r-[20px]" style={{ backgroundColor: "var(--theme-hero-booking-bg, #ffffff)" }}>
          <Themed
            as="button"
            type="button"
            colorType="heroBookingAccent"
            applyTo="backgroundColor"
            className="text-white px-8 py-3 font-bold flex items-center justify-center gap-3 transition-all w-full lg:w-auto lg:min-w-[160px] rounded-xl hover:brightness-95 hover:scale-[1.02] active:scale-95 shadow-lg shadow-black/5 disabled:opacity-50 disabled:pointer-events-none"
            style={{ backgroundColor: "var(--theme-hero-booking-accent, #29C5F6)" }}
            onClick={handleContinue}
          >
            <BadgeCheck
              data-theme-color="heroBookingIcon"
              className="w-5 h-5 stroke-[2.5]"
              style={{ color: "var(--theme-hero-booking-icon, #0E4659)" }}
            />
            <span className="text-[15px] font-bold uppercase tracking-wide">
              {t.continue}
            </span>
          </Themed>
        </div>
      </div>

      {selectedItem && (
        <div className="flex flex-col md:flex-row gap-4 p-4 border-b border-gray-100">
          <div className="w-full md:w-72 h-44 rounded-xl overflow-hidden flex-shrink-0">
            {selectedItem.image ? (
              <img src={selectedItem.image} alt={selectedItem.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#29C5F6]/30 to-[#29C5F6]/5 flex items-center justify-center">
                <MapPinned
                  data-theme-color="heroBookingIcon"
                  className="w-12 h-12"
                  style={{ color: "var(--theme-hero-booking-icon, #29C5F6)" }}
                />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 line-clamp-2 break-words">{selectedItem.title}</h3>
                {selectedItem.subtitle && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-3">{selectedItem.subtitle}</p>
                )}
                <button
                  type="button"
                  onClick={() => window.open(`${basePath}/${selectedItem.slug}`, "_blank")}
                  className="text-sm font-medium mt-2 flex items-center gap-1 hover:underline"
                  style={{ color: "var(--theme-hero-booking-accent, #29C5F6)" }}
                >
                  {t.readMore}
                  <ExternalLink
                    data-theme-color="heroBookingIcon"
                    className="w-3.5 h-3.5"
                    style={{ color: "var(--theme-hero-booking-icon, #29C5F6)" }}
                  />
                </button>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-lg font-bold text-gray-900">{format(selectedItem.price * (passengers.adults + passengers.children || 1))}</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedItem(null)
                    setDepartureDateTime({ date: null, time: null })
                  }}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-[#808080] hover:text-[#222] transition-colors"
                  title={t.clearSelection}
                  aria-label={t.clearSelection}
                >
                  <X
                    data-theme-color="heroBookingIcon"
                    className="w-5 h-5"
                    strokeWidth={2.5}
                    style={{ color: "var(--theme-hero-booking-icon, #6B7280)" }}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
