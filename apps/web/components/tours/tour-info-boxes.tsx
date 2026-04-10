"use client"

import { Calendar, Compass, Users, Globe } from "lucide-react"
import { useTranslations } from "next-intl"

interface TourInfoBoxesProps {
  duration: string
  tourType: string
  groupSize: string
  languages: string[]
}

interface InfoBoxProps {
  icon: React.ReactNode
  label: string
  value: string
}

function InfoBox({ icon, label, value }: InfoBoxProps) {
  return (
    <div className="flex gap-[15px] items-center shrink-0">
      <div className="size-[42px] rounded-[10px] border border-[#adadad] bg-white flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-[13px] font-medium text-[#222] leading-[16px]">{label}</span>
        <span className="text-[13px] text-[#808080] leading-[1.2]">{value}</span>
      </div>
    </div>
  )
}

export function TourInfoBoxes({ duration, tourType, groupSize, languages }: TourInfoBoxesProps) {
  const t = useTranslations("tourDetails")

  return (
    <div className="flex flex-wrap gap-6 items-start">
      <InfoBox
        icon={<Calendar className="size-5 text-[#222]" strokeWidth={1.5} />}
        label={t("duration")}
        value={duration}
      />
      <InfoBox
        icon={<Compass className="size-5 text-[#222]" strokeWidth={1.5} />}
        label={t("tourType")}
        value={tourType}
      />
      <InfoBox
        icon={<Users className="size-5 text-[#222]" strokeWidth={1.5} />}
        label={t("groupSize")}
        value={groupSize}
      />
      <InfoBox
        icon={<Globe className="size-5 text-[#222]" strokeWidth={1.5} />}
        label={t("languages")}
        value={languages.join(", ")}
      />
    </div>
  )
}
