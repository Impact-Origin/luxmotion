"use client"

import { useState } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { ChevronDown, Clock, MapPin, Moon } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { TourRouteMap } from "@/components/tours/tour-route-map"
import { type TourData } from "@/app/(landing)/tours/tour/[slug]/page"
import type { ItineraryDay } from "@/hooks/use-tour-data"

const SERIF_FONT = "var(--font-title), 'Cormorant Garamond', serif"

interface StopVM {
  time?: string
  label?: string
  title: string
  description?: string
  image?: string | null
}

interface DayVM {
  title: string
  titleAccent?: string
  hoursActive?: string
  nights?: number
  hotel?: string
  stops: StopVM[]
}

interface UltraTourItineraryProps {
  items: TourData["itinerary"]
  days?: ItineraryDay[]
  mapCenter: TourData["mapCenter"]
  pickup: TourData["pickup"]
  dropoff: TourData["dropoff"]
  dayTitle: string
  duration: string
}

function StopItem({ stop }: { stop: StopVM }) {
  const [open, setOpen] = useState(false)
  const hasDetail = Boolean(stop.description)

  return (
    <div className="relative border-[0.8px] border-[rgba(154,117,53,0.22)] bg-[#f7f4ef]">
      <div className="flex items-stretch">
        <div className="flex w-[70px] shrink-0 flex-col items-center justify-center gap-1 border-r-[0.8px] border-[rgba(201,169,110,0.08)] px-2 py-4">
          <span className="text-[10px] font-semibold tracking-[0.6px] text-[#a08248]">{stop.time || "—"}</span>
          {stop.label && <span className="text-[10px] tracking-[0.2px] text-[#696969]">{stop.label}</span>}
        </div>
        <div className="flex w-[84px] shrink-0 items-center justify-center px-[14px] py-[10px]">
          <div className="relative h-[48px] w-[64px] overflow-hidden border border-[rgba(201,169,110,0.1)] bg-[#1a1a1a]">
            {stop.image && <Image src={stop.image} alt={stop.title} fill className="object-cover" sizes="64px" />}
          </div>
        </div>
        <div className="flex flex-1 items-center justify-between py-4 pr-5">
          <span className="text-[14px] font-medium text-[#0d0d0d]">{stop.title}</span>
          {hasDetail && (
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="flex size-[32px] shrink-0 items-center justify-center border-[1.143px] border-[rgba(154,117,53,0.22)] text-[#a08248] transition-colors hover:border-[#a08248]"
              aria-label={stop.title}
            >
              <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>
      {hasDetail && (
        <div className={cn("grid transition-all duration-300", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
          <div className="overflow-hidden">
            <p className="px-6 pb-4 pl-[154px] text-[13px] leading-[1.6] text-[#4a4a4a]">{stop.description}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function DayAccordion({ day, index, fallbackDuration, defaultOpen }: { day: DayVM; index: number; fallbackDuration: string; defaultOpen: boolean }) {
  const t = useTranslations("tourDetails")
  const [open, setOpen] = useState(defaultOpen)
  const activeLabel = day.hoursActive || fallbackDuration

  return (
    <div className="border-[0.8px] border-[rgba(154,117,53,0.22)] bg-[#f7f4ef]">
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full items-stretch text-left">
        <div className="flex w-[70px] shrink-0 flex-col items-center justify-center border-r-[0.8px] border-[rgba(201,169,110,0.08)] py-4">
          <span className="text-[10px] font-semibold uppercase tracking-[1.98px] text-[#a08248]">{t("day")}</span>
          <span className="text-[40px] italic leading-[44px] text-[#0d0d0d]" style={{ fontFamily: SERIF_FONT }}>
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <div className="flex flex-1 items-center gap-4 py-4 pr-5 pl-5">
          <div className="flex flex-1 flex-col gap-[5px]">
            <span className="text-[20px] font-semibold tracking-[-0.24px] text-[#1c1b18]" style={{ fontFamily: SERIF_FONT }}>
              {day.title}
              {day.titleAccent && <span className="italic text-[#9a7535]"> {day.titleAccent}</span>}
            </span>
            {day.stops.length > 0 && (
              <span className="text-[13px] leading-[1.5]">
                <span className="font-semibold text-[#1c1b18]">{day.stops[0]!.title}</span>
                {day.stops.length > 1 && (
                  <span className="text-[rgba(28,27,24,0.62)]"> · {day.stops.slice(1).map((s) => s.title).join(" · ")}</span>
                )}
              </span>
            )}
          </div>
          <span className="flex size-[40px] shrink-0 items-center justify-center border-[1.143px] border-[rgba(154,117,53,0.22)] text-[#a08248]">
            <ChevronDown className={cn("size-5 transition-transform", open && "rotate-180")} strokeWidth={2} />
          </span>
        </div>
      </button>

      <div className={cn("grid transition-all duration-300", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
        <div className="overflow-hidden">
          <div className="relative flex flex-col gap-4 px-6 pb-6 pt-2">
            {day.stops.length > 1 && (
              <span className="pointer-events-none absolute left-[97px] top-8 bottom-[88px] w-px bg-[rgba(154,117,53,0.3)]" />
            )}
            {day.stops.map((stop, i) => (
              <StopItem key={i} stop={stop} />
            ))}

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border border-[rgba(154,117,53,0.22)] bg-[#f7f4ef] px-5 py-[17px]">
              {activeLabel && (
                <span className="flex items-center gap-2 text-[10px] text-[rgba(28,27,24,0.62)]">
                  <Clock className="size-[13px] text-[#a08248]" strokeWidth={1.8} />
                  <span className="font-semibold text-[#1c1b18]">{activeLabel}</span>
                </span>
              )}
              <span className="flex items-center gap-2 text-[10px]">
                <MapPin className="size-[13px] text-[#a08248]" strokeWidth={1.8} />
                <span className="font-semibold text-[#1c1b18]">{t("stopsCount", { count: day.stops.length })}</span>
              </span>
              {day.nights != null && day.nights > 0 && (
                <span className="flex items-center gap-2 text-[10px] text-[rgba(28,27,24,0.62)]">
                  <Moon className="size-[13px] text-[#a08248]" strokeWidth={1.8} />
                  <span>
                    {t("nightsCount", { count: day.nights })}
                    {day.hotel && <span className="font-semibold text-[#1c1b18]"> · {day.hotel}</span>}
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function UltraTourItinerary({ items, days, pickup, dropoff, dayTitle, duration }: UltraTourItineraryProps) {
  const t = useTranslations("tourDetails")

  const dayVMs: DayVM[] =
    days && days.length > 0
      ? days.map((d) => ({
          title: d.title,
          titleAccent: d.titleAccent,
          hoursActive: d.hoursActive,
          nights: d.nights,
          hotel: d.hotel,
          stops: d.stops.map((s) => ({ time: s.time, label: s.label, title: s.title, description: s.description, image: s.imageUrl })),
        }))
      : [
          {
            title: dayTitle,
            stops: items.map((s) => ({ time: s.time, title: s.title, description: s.description, image: s.image })),
          },
        ]

  const mapStops =
    days && days.length > 0
      ? days.flatMap((d) => d.stops).filter((s) => s.lat != null && s.lng != null).map((s) => ({ title: s.title, lat: s.lat, lng: s.lng }))
      : items.filter((s) => s.lat != null && s.lng != null).map((s) => ({ title: s.title, lat: s.lat, lng: s.lng }))

  return (
    <div>
      <h2 className="text-[24px] leading-none md:text-[28px]" style={{ fontFamily: SERIF_FONT }}>
        <span className="italic text-[#a08248]">{t("itinerary")}</span>
      </h2>

      {mapStops.length > 0 && (
        <div className="mt-6 overflow-hidden rounded-[2px] border border-[rgba(28,27,24,0.08)]">
          <TourRouteMap pickup={pickup} dropoff={dropoff} stops={mapStops} className="h-[404px] w-full" />
        </div>
      )}

      <div className="mt-6 flex flex-col gap-4">
        {dayVMs.map((day, i) => (
          <DayAccordion key={i} day={day} index={i} fallbackDuration={duration} defaultOpen={i === 0} />
        ))}
      </div>
    </div>
  )
}
