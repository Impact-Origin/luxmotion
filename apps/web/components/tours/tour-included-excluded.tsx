"use client"

import { Check, X } from "lucide-react"
import { useTranslations } from "next-intl"

interface TourIncludedExcludedProps {
  included: string[]
  excluded: string[]
}

export function TourIncludedExcluded({ included, excluded }: TourIncludedExcludedProps) {
  const t = useTranslations("tourDetails")

  return (
    <div className="flex flex-col lg:flex-row gap-[2px] w-full">
      <div
        className="flex-1 border border-[#2e7d52] p-6 flex flex-col gap-[18px] self-stretch"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(46, 125, 82, 0.1) 0%, rgba(46, 125, 82, 0.1) 100%), linear-gradient(90deg, #1a1a1a 0%, #1a1a1a 100%)",
        }}
      >
        <h3
          className="text-[12px] font-bold text-[#81c784] tracking-[1.5px] uppercase leading-none"
          style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
        >
          {t("included")}
        </h3>
        <ul className="flex flex-col gap-[10px]">
          {included.map((item, index) => (
            <li key={index} className="flex gap-[10px] items-start">
              <div className="shrink-0 size-[18px] rounded-full bg-[rgba(76,175,80,0.15)] flex items-center justify-center mt-px">
                <Check className="size-[10px] text-[#81c784]" strokeWidth={2.5} />
              </div>
              <span
                className="text-[12px] text-[#999] leading-[18.6px]"
                style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
              >
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div
        className="flex-1 border border-[#9b2c2c] p-6 flex flex-col gap-[18px] self-stretch"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(155, 44, 44, 0.06) 0%, rgba(155, 44, 44, 0.06) 100%), linear-gradient(90deg, #1a1a1a 0%, #1a1a1a 100%)",
        }}
      >
        <h3
          className="text-[12px] font-bold text-[#ef9a9a] tracking-[1.5px] uppercase leading-none"
          style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
        >
          {t("excluded")}
        </h3>
        <ul className="flex flex-col gap-[10px]">
          {excluded.map((item, index) => (
            <li key={index} className="flex gap-[10px] items-start">
              <div className="shrink-0 size-[18px] rounded-full bg-[rgba(244,67,54,0.1)] flex items-center justify-center mt-px">
                <X className="size-[10px] text-[#ef9a9a]" strokeWidth={2.5} />
              </div>
              <span
                className="text-[12px] text-[#999] leading-[18.6px]"
                style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
              >
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
