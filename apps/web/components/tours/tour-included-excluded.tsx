"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"

interface TourIncludedExcludedProps {
  included: string[]
  excluded: string[]
}

export function TourIncludedExcluded({ included, excluded }: TourIncludedExcludedProps) {
  const t = useTranslations("tourDetails")

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      <div className="flex-1 bg-[rgba(210,255,226,0.2)] border border-[#bbf7d0] rounded-[8px] p-6">
        <h3 className="text-[18px] font-bold text-[#0c171c] leading-none mb-4">{t("included")}</h3>
        <div className="flex flex-col gap-4 py-[5px]">
          {included.map((item, index) => (
            <div key={index} className="flex gap-[10px] items-center">
              <Image
                src="/svgs/included_check.svg"
                alt=""
                width={23}
                height={23}
                className="shrink-0"
              />
              <span className="text-[14px] text-[#7a7a7a] leading-[1.2]">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-[#ffeadf] border border-[#ffb188] rounded-[8px] px-6 py-[19px]">
        <h3 className="text-[18px] font-bold text-[#0c171c] leading-none mb-4">{t("excluded")}</h3>
        <div className="flex flex-col gap-4 py-[5px]">
          {excluded.map((item, index) => (
            <div key={index} className="flex gap-[10px] items-center">
              <Image
                src="/svgs/excluded_cross.svg"
                alt=""
                width={23}
                height={23}
                className="shrink-0"
              />
              <span className="text-[14px] text-[#7a7a7a] leading-[1.2]">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
