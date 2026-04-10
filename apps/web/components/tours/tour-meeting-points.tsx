"use client"

import { ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"

interface MeetingPoint {
  title: string
  address: string
  description?: string
  lat?: number
  lng?: number
}

interface TourMeetingPointsProps {
  pickup: MeetingPoint
  dropoff: MeetingPoint
  hasMapSection?: boolean
}

export function TourMeetingPoints({ pickup, dropoff, hasMapSection }: TourMeetingPointsProps) {
  const t = useTranslations("tourDetails")

  const handleClick = (point: MeetingPoint, type: "pickup" | "dropoff") => {
    if (hasMapSection) {
      const mapSection = document.getElementById("tour-map")
      if (mapSection) {
        mapSection.scrollIntoView({ behavior: "smooth" })
        if (point.lat && point.lng) {
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent("tour-map-focus", {
              detail: { type, lat: point.lat, lng: point.lng }
            }))
          }, 500)
        }
      }
    } else {
      if (point.lat && point.lng) {
        window.open(`https://www.google.com/maps/search/?api=1&query=${point.lat},${point.lng}`, "_blank")
      } else {
        const query = encodeURIComponent(point.address || point.title)
        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank")
      }
    }
  }

  return (
    <div className="w-full">
      <h2 className="text-[24px] font-bold text-[#0c171c] leading-[1.3] mb-6">
        {t("meetingPoints")}
      </h2>

      <div className="flex flex-col lg:flex-row gap-6">
        <button
          onClick={() => handleClick(pickup, "pickup")}
          className="group flex-1 text-left bg-[#27c7ff] rounded-[20px] px-5 py-6 flex flex-col gap-4 hover:bg-[#20b8ef] transition-colors cursor-pointer"
        >
          <h3 className="text-[18px] lg:text-[18.6px] font-bold text-white leading-[1.2] tracking-[-0.5px]">
            {pickup.title}
          </h3>
          <p className="text-[14px] text-white/90 leading-[22.4px] tracking-[-0.2px]">
            {pickup.address}
          </p>
          <div className="flex items-center gap-2">
            {pickup.description && (
              <span className="text-[15px] lg:text-[15.1px] font-medium text-white leading-[19.2px]">
                {pickup.description}
              </span>
            )}
            <div className="size-[28px] rounded-full bg-white flex items-center justify-center transition-transform group-hover:translate-x-1 shrink-0">
              <ArrowRight className="size-[18px] text-[#27c7ff]" />
            </div>
          </div>
        </button>

        <button
          onClick={() => handleClick(dropoff, "dropoff")}
          className="group flex-1 text-left bg-white border border-[#dedede] rounded-[20px] px-5 py-6 flex flex-col gap-4 hover:border-[#27c7ff] transition-colors cursor-pointer"
        >
          <h3 className="text-[18px] lg:text-[18.8px] font-bold text-[#111] leading-[1.2] tracking-[-0.5px]">
            {dropoff.title}
          </h3>
          <p className="text-[14px] text-[#222] leading-[22.4px] tracking-[-0.2px]">
            {dropoff.address}
          </p>
          <div className="flex items-center gap-2">
            {dropoff.description && (
              <span className="text-[15px] lg:text-[15.1px] font-medium text-[#222] leading-[19.2px]">
                {dropoff.description}
              </span>
            )}
            <div className="size-[28px] rounded-full bg-[#27c7ff] flex items-center justify-center transition-transform group-hover:translate-x-1">
              <ArrowRight className="size-[18px] text-white" />
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}
