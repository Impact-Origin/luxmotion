"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { TourRouteMap } from "./tour-route-map"

interface ItineraryItem {
  time: string
  title: string
  description: string
  image?: string
  lat?: number
  lng?: number
}

interface MeetingPoint {
  title: string
  address: string
  description?: string
  lat?: number
  lng?: number
}

interface TourItineraryProps {
  items: ItineraryItem[]
  mapCenter?: {
    lat: number
    lng: number
  }
  pickup?: MeetingPoint
  dropoff?: MeetingPoint
}

function ItineraryCard({
  item,
  isOpen,
  onToggle,
  isFirst
}: {
  item: ItineraryItem
  isOpen: boolean
  onToggle: () => void
  isFirst: boolean
}) {
  return (
    <div className="relative">
      {!isFirst && (
        <div className="absolute left-[47px] bottom-[calc(100%-12px)] w-0 h-[28px] border-l-[2px] border-dotted border-black z-0" />
      )}

      <div
        onClick={onToggle}
        className={`relative z-10 w-full bg-white border border-[#e5ebf6] rounded-[16px] px-4 py-3 flex items-start justify-between cursor-pointer transition-all duration-150 ${
          isOpen ? "" : "hover:bg-[#fafafa]"
        }`}
      >
        <div className="flex gap-5 items-start flex-1 min-w-0">
          {item.image && (
            <div
              className={`relative overflow-hidden shrink-0 transition-all duration-200 ease-out ${
                isOpen
                  ? "w-[210px] h-[170px] rounded-[16px]"
                  : "w-[72px] h-[54px] lg:w-[64px] lg:h-[48px] rounded-[9px] lg:rounded-[8px]"
              }`}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div
            className={`flex flex-col items-start flex-1 min-w-0 transition-all duration-150 ${
              isOpen ? "gap-[17px] self-stretch" : "gap-0 justify-center"
            }`}
          >
            <div className="flex flex-col items-start w-full">
              <span
                className={`font-medium text-[#005fad] tracking-[0.2px] transition-all duration-150 ${
                  isOpen ? "text-[12.9px] leading-[22px]" : "text-[12px] lg:text-[12.9px] leading-[22px]"
                }`}
              >
                {item.time}
              </span>
              <span
                className={`text-[#111] text-left transition-all duration-150 ${
                  isOpen ? "text-[16.9px] leading-[21.6px]" : "text-[14px] lg:text-[16.9px] leading-[21.6px]"
                }`}
              >
                {item.title}
              </span>
            </div>
            <div
              className={`overflow-hidden transition-all duration-200 ease-out ${
                isOpen ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <p className="text-[14px] text-[#7a7a7a] leading-[1.2] text-left">
                {item.description}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center shrink-0 pt-1">
          <ChevronDown
            className={`size-[22px] text-[#808080] transition-transform duration-150 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>
      </div>
    </div>
  )
}

export function TourItinerary({ items, mapCenter, pickup, dropoff }: TourItineraryProps) {
  const t = useTranslations("tourDetails")
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const hasLocations =
    (pickup?.lat && pickup?.lng) ||
    (dropoff?.lat && dropoff?.lng) ||
    items.some((item) => item.lat && item.lng)

  return (
    <div className="w-full">
      <h2 className="text-[24px] font-bold text-[#0c171c] leading-[1.3] mb-6">
        {t("itinerary")}
      </h2>
      <TourRouteMap
        pickup={pickup}
        dropoff={dropoff}
        stops={items}
        className="h-[500px] mb-6"
      />

      <div className="flex flex-col gap-4 relative">
        {items.map((item, index) => (
          <ItineraryCard
            key={index}
            item={item}
            isOpen={openIndex === index}
            onToggle={() => handleToggle(index)}
            isFirst={index === 0}
          />
        ))}
      </div>
    </div>
  )
}
