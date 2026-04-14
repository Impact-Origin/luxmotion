"use client"

import { Clock, Tag, Users, Globe } from "lucide-react"
import { useTranslations } from "next-intl"

interface TourInfoBoxesProps {
  duration: string
  tourType: string
  groupSize: string
  languages: string[]
}

function InfoBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex-1 min-w-0 flex items-center gap-[10px] bg-[#141414] border-[0.8px] border-[rgba(154,117,53,0.22)] pl-[16.8px] pr-[16.8px] py-[8.8px]">
      <div className="shrink-0 size-[32px] md:size-[32px] bg-[rgba(201,169,110,0.08)] border-[1.333px] border-[rgba(201,169,110,0.25)] flex items-center justify-center">
        {icon}
      </div>
      <div className="flex flex-col gap-[2px] min-w-0">
        <span
          className="text-[8px] font-semibold text-[#999] tracking-[1.2px] uppercase leading-none whitespace-nowrap"
          style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
        >
          {label}
        </span>
        <span
          className="text-[12px] font-medium text-white leading-none whitespace-nowrap"
          style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
        >
          {value}
        </span>
      </div>
    </div>
  )
}

function InfoBoxMobile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-[10px] bg-[#141414] border-[0.8px] border-[rgba(154,117,53,0.22)] pl-[16.8px] pr-[16.8px] py-[8.8px]">
      <div className="shrink-0 size-[40px] bg-[rgba(201,169,110,0.08)] border-[1.667px] border-[rgba(201,169,110,0.25)] flex items-center justify-center">
        {icon}
      </div>
      <div className="flex flex-col gap-[2px] min-w-0">
        <span
          className="text-[8px] font-semibold text-[#999] tracking-[1.2px] uppercase leading-none whitespace-nowrap"
          style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
        >
          {label}
        </span>
        <span
          className="text-[12px] font-medium text-white leading-none whitespace-nowrap"
          style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
        >
          {value}
        </span>
      </div>
    </div>
  )
}

export function TourInfoBoxes({ duration, tourType, groupSize, languages }: TourInfoBoxesProps) {
  const t = useTranslations("tourDetails")

  const items = [
    { key: "duration", icon: Clock, label: t("duration"), value: duration },
    { key: "tourType", icon: Tag, label: t("tourType"), value: tourType },
    { key: "groupSize", icon: Users, label: t("groupSize"), value: groupSize },
    { key: "languages", icon: Globe, label: t("languages"), value: languages.join(" · ") },
  ]

  return (
    <>
      <div className="hidden md:flex gap-[2px] w-full max-w-[1280px]">
        {items.map(({ key, icon: Icon, label, value }) => (
          <InfoBox
            key={key}
            icon={<Icon className="size-[16px] text-[#C9A96E]" strokeWidth={1.5} />}
            label={label}
            value={value}
          />
        ))}
      </div>
      <div className="md:hidden grid grid-cols-2 gap-2 w-full">
        {items.map(({ key, icon: Icon, label, value }) => (
          <InfoBoxMobile
            key={key}
            icon={<Icon className="size-[20px] text-[#C9A96E]" strokeWidth={1.5} />}
            label={label}
            value={value}
          />
        ))}
      </div>
    </>
  )
}
