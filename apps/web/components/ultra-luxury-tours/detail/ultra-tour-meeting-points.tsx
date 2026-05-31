"use client"

import { useTranslations } from "next-intl"
import { MapPin } from "lucide-react"
import { type MeetingPoint } from "@/app/(landing)/tours/tour/[slug]/page"

const SERIF_FONT = "var(--font-title), 'Cormorant Garamond', serif"

export function UltraTourMeetingPoints({ pickup, dropoff }: { pickup: MeetingPoint; dropoff: MeetingPoint }) {
  const t = useTranslations("tourDetails")
  if (!pickup?.address && !pickup?.title && !dropoff?.address && !dropoff?.title) return null

  const detailName = dropoff?.title || pickup?.title
  const detailSub = dropoff?.address || pickup?.address

  const words = t("meetingPoints").trim().split(" ")
  const lastWord = words.length > 1 ? words.pop() : ""
  const lead = words.join(" ")

  return (
    <div>
      <h2 className="text-[24px] leading-none text-[#0d0d0d] md:text-[28px]" style={{ fontFamily: SERIF_FONT }}>
        {lead} {lastWord && <span className="italic text-[#a08248]">{lastWord}</span>}
      </h2>

      <div className="mt-6 flex flex-col gap-[2px] bg-[rgba(201,169,110,0.05)] md:flex-row">
        <div className="flex flex-1 flex-col gap-2 border-l-[1.6px] border-[#c9a96e] bg-[rgba(154,117,53,0.1)] p-6">
          <span className="flex size-6 items-center justify-center rounded-full border-[0.857px] border-[rgba(201,169,110,0.3)] bg-[rgba(201,169,110,0.15)] text-[#a08248]">
            <MapPin className="size-[12px]" strokeWidth={1.8} />
          </span>
          <span className="text-[8px] font-bold uppercase tracking-[1.2px] text-[#a08248]">{t("pickupTag")}</span>
          <div className="flex flex-col gap-[2px]">
            <span className="text-[20px] leading-none text-[#0d0d0d]" style={{ fontFamily: SERIF_FONT }}>
              {pickup?.title || detailName}
            </span>
            {(pickup?.address || detailSub) && (
              <span className="text-[12px] text-[#696969]">{pickup?.address || detailSub}</span>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-[6px] p-6">
          <span className="text-[8px] font-semibold uppercase tracking-[1.2px] text-[#8c8680]">{t("meetingLocationLabel")}</span>
          <div className="flex flex-col gap-[2px]">
            <span className="text-[20px] font-light leading-none text-[#0d0d0d]" style={{ fontFamily: SERIF_FONT }}>
              {detailName}
            </span>
            {detailSub && <span className="text-[12px] text-[#696969]">{detailSub}</span>}
          </div>
          <p className="text-[11px] leading-[17.6px] text-[#696969]">{t("meetingNote")}</p>
        </div>
      </div>
    </div>
  )
}
