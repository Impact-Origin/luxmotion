"use client"

import { type Dispatch, type SetStateAction, useState } from "react"
import { MapPin, Home, ChevronDown, Briefcase, Luggage, Users, BadgeCheck, MapPinCheckInside, MapPinPlus } from "lucide-react"
import { DateTimePicker } from "@/components/checkout/date-time-picker"
import { PassengersDropdownContent } from "./passengers-dropdown"
import { GooglePlacesInput } from "@/components/ui/google-places-input"
import type { PassengerState, LuggageState } from "./types"
import { Themed } from "@/components/themed"
import { cn } from "@workspace/ui/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover"
import { motion, AnimatePresence } from "framer-motion"
import { useIsMobile } from "@/hooks/use-is-mobile"
import { MobileDrawer } from "@/components/ui/mobile-drawer"
import { MobileLocationPanel } from "@/components/ui/mobile-location-panel"
import { useDynamicTheme } from "@/components/dynamic-theme-provider"
import { toast } from "sonner"

interface LocationState {
  text: string
  placeId: string | null
  lat: number | null
  lng: number | null
}

interface TransferFormProps {
  fromLocation: LocationState
  setFromLocation: (value: string, details?: { placeId: string; lat: number; lng: number }) => void
  destinations: LocationState[]
  setDestination: (index: number, value: string, details?: { placeId: string; lat: number; lng: number }) => void
  passengers: PassengerState
  luggage: LuggageState
  showPassengersDropdown: boolean
  setShowPassengersDropdown: (show: boolean) => void
  setPassengers: Dispatch<SetStateAction<PassengerState>>
  setLuggage: Dispatch<SetStateAction<LuggageState>>
  departureDate: Date | undefined
  setDepartureDate: (date: Date | undefined) => void
  onContinue: () => void
  translations: {
    whereFrom: string
    whereTo: string
    placeholderFrom: string
    placeholderTo: string
    placeholderDeparture: string
    continue: string
    passengers: string
    adults: string
    children: string
    childrenAge: string
    backpack: string
    handLuggage: string
    checkedBaggage: string
    done: string
    fillLocations: string
    selectDateFirst: string
  }
}

export function TransferForm({
  fromLocation,
  setFromLocation,
  destinations,
  setDestination,
  passengers: passengerState,
  luggage: luggageState,
  showPassengersDropdown,
  setShowPassengersDropdown,
  setPassengers,
  setLuggage,
  departureDate,
  setDepartureDate,
  onContinue,
  translations: t,
}: TransferFormProps) {
  const isMobile = useIsMobile()
  const { isPreviewMode } = useDynamicTheme()
  const [fromDrawerOpen, setFromDrawerOpen] = useState(false)
  const [toDrawerOpen, setToDrawerOpen] = useState(false)
  const [toDrawerIndex, setToDrawerIndex] = useState(0)

  const totalPassengers = (passengerState?.adults || 0) + (passengerState?.children || 0)
  const totalLuggage = (luggageState?.backpack || 0) + (luggageState?.handLuggage || 0) + (luggageState?.checkedBaggage || 0)
  const handleContinue = () => {
    if (!fromLocation.placeId || !destinations.every((dest) => Boolean(dest.placeId))) {
      toast.error(t.fillLocations || "Please fill in origin and destination.", {
        position: "top-center",
      })
      return
    }
    if (!departureDate) {
      toast.error(t.selectDateFirst || "Please select a date first", {
        position: "top-center",
      })
      return
    }
    onContinue()
  }

  const handleFromSelect = (v: { location: string; placeId: string | null; lat: number | null; lng: number | null }) => {
    setFromLocation(v.location, v.placeId ? { placeId: v.placeId, lat: v.lat!, lng: v.lng! } : undefined)
    if (v.placeId != null) setFromDrawerOpen(false)
  }

  const handleToSelect = (index: number) => (v: { location: string; placeId: string | null; lat: number | null; lng: number | null }) => {
    setDestination(index, v.location, v.placeId ? { placeId: v.placeId, lat: v.lat!, lng: v.lng! } : undefined)
    if (v.placeId != null) setToDrawerOpen(false)
  }

  return (
    <div className="flex flex-col lg:flex-row items-stretch min-h-[64px]">
      <motion.div
        layout
        className="relative flex-[1.6] min-w-0 lg:min-w-[200px] border-b lg:border-b-0 lg:border-r border-gray-100 min-h-[64px] flex items-center booking-section focus-within:z-30 lg:rounded-l-[20px]" 
        style={{ backgroundColor: "var(--theme-hero-booking-bg, #ffffff)", borderColor: "var(--theme-hero-booking-border, #f0f0f0)" }}
      >
        {isMobile ? (
          <MobileLocationPanel
            open={fromDrawerOpen}
            onOpenChange={(open) => {
              if (open && fromLocation.text) setFromLocation("", undefined)
              setFromDrawerOpen(open)
            }}
            title={t.whereFrom}
            trigger={
              <button
                type="button"
                className="w-full h-full flex items-center gap-3 pl-14 pr-4 py-3 text-left cursor-pointer"
              >
                <div
                  data-theme-color="heroBookingIcon"
                  className={cn("absolute left-6 top-1/2 -translate-y-1/2 z-10", !isPreviewMode && "pointer-events-none")}
                  style={{ color: "var(--theme-hero-booking-icon, #27C7FF)" }}
                >
                  <div className="relative">
                    <MapPin data-theme-color="heroBookingIcon" className="w-5 h-5" strokeWidth={2.5} style={{ color: "var(--theme-hero-booking-icon, #27C7FF)" }} />
                    <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-[1px]">
                      <Home data-theme-color="heroBookingIcon" className="w-2.5 h-2.5" strokeWidth={2.5} style={{ color: "var(--theme-hero-booking-icon, #27C7FF)" }} />
                    </div>
                  </div>
                </div>
                <span className={fromLocation.text ? "text-[14px] font-medium text-[#222]" : "text-[14px] text-[#808080]"}>
                  {fromLocation.text || t.placeholderFrom}
                </span>
              </button>
            }
          >
            <div className="flex flex-col flex-1 min-h-0 gap-2">
              <GooglePlacesInput
                value={{
                  location: fromLocation.text,
                  placeId: fromLocation.placeId,
                  lat: fromLocation.lat,
                  lng: fromLocation.lng,
                }}
                onChange={handleFromSelect}
                placeholder={t.placeholderFrom}
                ariaLabel={t.whereFrom}
                className="w-full"
                variant="new-widget"
                inlineDropdown
              />
            </div>
          </MobileLocationPanel>
        ) : (
          <>
            <div
              data-theme-color="heroBookingIcon"
              className={cn("absolute left-6 top-1/2 -translate-y-1/2 z-10", !isPreviewMode && "pointer-events-none")}
              style={{ color: "var(--theme-hero-booking-icon, #27C7FF)" }}
            >
              <div className="relative">
                <MapPin data-theme-color="heroBookingIcon" className="w-5 h-5" strokeWidth={2.5} style={{ color: "var(--theme-hero-booking-icon, #27C7FF)" }} />
                <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-[1px]">
                  <Home data-theme-color="heroBookingIcon" className="w-2.5 h-2.5" strokeWidth={2.5} style={{ color: "var(--theme-hero-booking-icon, #27C7FF)" }} />
                </div>
              </div>
            </div>
            <GooglePlacesInput
              value={{
                location: fromLocation.text,
                placeId: fromLocation.placeId,
                lat: fromLocation.lat,
                lng: fromLocation.lng,
              }}
              onChange={(v) =>
                setFromLocation(
                  v.location,
                  v.placeId ? { placeId: v.placeId, lat: v.lat!, lng: v.lng! } : undefined
                )
              }
              placeholder={t.placeholderFrom}
              className="w-full h-full"
              variant="hero-inline"
            />
          </>
        )}
      </motion.div>

      <AnimatePresence mode="popLayout" initial={false}>
        {destinations.map((dest, index) => (
          <motion.div
            key={index}
            layout
            initial={{ opacity: 0, x: -20, flex: 0 }}
            animate={{ opacity: 1, x: 0, flex: 1.6 }}
            exit={{ opacity: 0, x: -20, flex: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative min-w-0 lg:min-w-[200px] border-b lg:border-b-0 lg:border-r border-gray-100 min-h-[64px] flex items-center booking-section focus-within:z-30 overflow-hidden"
            style={{ backgroundColor: "var(--theme-hero-booking-bg, #ffffff)", borderColor: "var(--theme-hero-booking-border, #f0f0f0)" }}
          >
            {isMobile ? (
              <MobileLocationPanel
                open={toDrawerOpen && toDrawerIndex === index}
                onOpenChange={(open) => {
                  if (open && destinations[index]?.text) setDestination(index, "", undefined)
                  setToDrawerOpen(open)
                  if (!open) setToDrawerIndex(0)
                }}
                title={t.whereTo}
                trigger={
                  <button
                    type="button"
                    onClick={() => {
                      setToDrawerIndex(index)
                      setToDrawerOpen(true)
                    }}
                    className="w-full h-full flex items-center gap-3 pl-14 pr-4 py-3 text-left cursor-pointer"
                  >
                    <div
                      data-theme-color="heroBookingIcon"
                      className={cn("absolute left-6 top-1/2 -translate-y-1/2 z-10", !isPreviewMode && "pointer-events-none")}
                      style={{ color: "var(--theme-hero-booking-icon, #27C7FF)" }}
                    >
                      {index === destinations.length - 1 ? (
                        <MapPinCheckInside data-theme-color="heroBookingIcon" className="w-5 h-5" strokeWidth={2.5} style={{ color: "var(--theme-hero-booking-icon, #27C7FF)" }} />
                      ) : (
                        <MapPinPlus data-theme-color="heroBookingIcon" className="w-5 h-5" strokeWidth={2.5} style={{ color: "var(--theme-hero-booking-icon, #27C7FF)" }} />
                      )}
                    </div>
                    <span className={dest.text ? "text-[14px] font-medium text-[#222]" : "text-[14px] text-[#808080]"}>
                      {dest.text || t.placeholderTo}
                    </span>
                  </button>
                }
              >
                <div className="flex flex-col flex-1 min-h-0 gap-2">
                  <GooglePlacesInput
                    value={{
                      location: dest.text,
                      placeId: dest.placeId,
                      lat: dest.lat,
                      lng: dest.lng,
                    }}
                    onChange={handleToSelect(index)}
                    placeholder={t.placeholderTo}
                    ariaLabel={t.whereTo}
                    className="w-full"
                    variant="new-widget"
                    inlineDropdown
                  />
                </div>
              </MobileLocationPanel>
            ) : (
              <>
                <div
                  data-theme-color="heroBookingIcon"
                  className={cn("absolute left-6 top-1/2 -translate-y-1/2 z-10", !isPreviewMode && "pointer-events-none")}
                  style={{ color: "var(--theme-hero-booking-icon, #27C7FF)" }}
                >
                  {index === destinations.length - 1 ? (
                    <MapPinCheckInside data-theme-color="heroBookingIcon" className="w-5 h-5" strokeWidth={2.5} style={{ color: "var(--theme-hero-booking-icon, #27C7FF)" }} />
                  ) : (
                    <MapPinPlus data-theme-color="heroBookingIcon" className="w-5 h-5" strokeWidth={2.5} style={{ color: "var(--theme-hero-booking-icon, #27C7FF)" }} />
                  )}
                </div>
                <GooglePlacesInput
                  value={{
                    location: dest.text,
                    placeId: dest.placeId,
                    lat: dest.lat,
                    lng: dest.lng,
                  }}
                  onChange={(v) =>
                    setDestination(
                      index,
                      v.location,
                      v.placeId ? { placeId: v.placeId, lat: v.lat!, lng: v.lng! } : undefined
                    )
                  }
                  placeholder={t.placeholderTo}
                  className="w-full h-full"
                  variant="hero-inline"
                />
              </>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.div layout className="flex-[0.9] min-w-0 lg:min-w-[160px] border-b lg:border-b-0 lg:border-r border-gray-100 flex items-center booking-section" style={{ backgroundColor: "var(--theme-hero-booking-bg, #ffffff)", borderColor: "var(--theme-hero-booking-border, #f0f0f0)" }}>
        <DateTimePicker
          value={departureDate}
          onChange={setDepartureDate}
          placeholder={t.placeholderDeparture}
          label={t.placeholderDeparture}
          variant="new-widget"
        />
      </motion.div>

      <motion.div layout className="relative flex-[0.7] min-w-0 lg:min-w-[120px] flex items-center border-b lg:border-b-0 border-gray-100" style={{ borderColor: "var(--theme-hero-booking-border, #f0f0f0)" }}>
        {isMobile ? (
          <MobileDrawer
            open={showPassengersDropdown}
            onOpenChange={setShowPassengersDropdown}
            title={t.passengers}
            trigger={
              <button
                type="button"
                className="relative flex items-center justify-start lg:justify-center gap-4 md:gap-5 px-6 py-3 w-full h-full cursor-pointer transition-colors hover:bg-zinc-50/50 booking-section outline-none"
                style={{
                  backgroundColor: "var(--theme-hero-booking-bg, #ffffff)",
                  borderColor: "var(--theme-hero-booking-border, #f0f0f0)"
                }}
              >
                <div className="flex items-center gap-5" style={{ color: "var(--theme-hero-booking-icon, #27C7FF)" }}>
                  <div className="flex items-center gap-2">
                    <Users data-theme-color="heroBookingIcon" className="w-[22px] h-[22px]" strokeWidth={2.5} style={{ color: "var(--theme-hero-booking-icon, #27C7FF)" }} />
                    <span className="text-[17px] font-semibold leading-none text-[#808080]">
                      {totalPassengers}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase data-theme-color="heroBookingIcon" className="w-[22px] h-[22px]" strokeWidth={2.5} style={{ color: "var(--theme-hero-booking-icon, #27C7FF)" }} />
                    <Luggage data-theme-color="heroBookingIcon" className="w-[22px] h-[22px]" strokeWidth={2.5} style={{ color: "var(--theme-hero-booking-icon, #27C7FF)" }} />
                    <span className="text-[17px] font-semibold leading-none text-[#808080]">
                      {totalLuggage}
                    </span>
                  </div>
                </div>
                <ChevronDown data-theme-color="heroBookingIcon" className="w-4 h-4" strokeWidth={3} style={{ color: "var(--theme-hero-booking-icon, #27C7FF)" }} />
              </button>
            }
          >
            <PassengersDropdownContent
              passengers={passengerState}
              luggage={luggageState}
              setPassengers={setPassengers}
              setLuggage={setLuggage}
              onClose={() => setShowPassengersDropdown(false)}
              translations={t}
            />
          </MobileDrawer>
        ) : (
          <Popover open={showPassengersDropdown} onOpenChange={setShowPassengersDropdown}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="relative flex items-center justify-start lg:justify-center gap-4 md:gap-5 px-6 py-3 w-full h-full cursor-pointer transition-colors hover:bg-zinc-50/50 booking-section outline-none"
                style={{
                  backgroundColor: "var(--theme-hero-booking-bg, #ffffff)",
                  borderColor: "var(--theme-hero-booking-border, #f0f0f0)"
                }}
              >
                <div className="flex items-center gap-5" style={{ color: "var(--theme-hero-booking-icon, #27C7FF)" }}>
                  <div className="flex items-center gap-2">
                    <Users data-theme-color="heroBookingIcon" className="w-[22px] h-[22px]" strokeWidth={2.5} style={{ color: "var(--theme-hero-booking-icon, #27C7FF)" }} />
                    <span className="text-[17px] font-semibold leading-none text-[#808080]">
                      {totalPassengers}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase data-theme-color="heroBookingIcon" className="w-[22px] h-[22px]" strokeWidth={2.5} style={{ color: "var(--theme-hero-booking-icon, #27C7FF)" }} />
                    <Luggage data-theme-color="heroBookingIcon" className="w-[22px] h-[22px]" strokeWidth={2.5} style={{ color: "var(--theme-hero-booking-icon, #27C7FF)" }} />
                    <span className="text-[17px] font-semibold leading-none text-[#808080]">
                      {totalLuggage}
                    </span>
                  </div>
                </div>
                <ChevronDown data-theme-color="heroBookingIcon" className="w-4 h-4" strokeWidth={3} style={{ color: "var(--theme-hero-booking-icon, #27C7FF)" }} />
              </button>
            </PopoverTrigger>
            <PopoverContent
              side="bottom"
              align="end"
              sideOffset={8}
              className="w-80 p-0 border border-gray-100 shadow-xl rounded-xl z-50"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <PassengersDropdownContent
                passengers={passengerState}
                luggage={luggageState}
                setPassengers={setPassengers}
                setLuggage={setLuggage}
                onClose={() => setShowPassengersDropdown(false)}
                translations={t}
              />
            </PopoverContent>
          </Popover>
        )}
      </motion.div>

      <motion.div layout className="flex items-center p-1.5 shrink-0 lg:rounded-r-[20px] w-full lg:w-auto" style={{ backgroundColor: "var(--theme-hero-booking-bg, #ffffff)" }}>
        <Themed
          as="button"
          type="button"
          colorType="heroBookingAccent"
          applyTo="backgroundColor"
          onClick={handleContinue}
          className="text-white px-8 py-3 font-bold flex items-center justify-center gap-3 transition-all w-full lg:w-auto lg:min-w-[160px] rounded-xl hover:brightness-95 hover:scale-[1.02] active:scale-95 shadow-lg shadow-black/5"
          style={{ backgroundColor: "var(--theme-hero-booking-accent, #29C5F6)" }}
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
      </motion.div>
    </div>
  )
}

