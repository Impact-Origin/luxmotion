"use client"

import { BadgeCheck } from "lucide-react"
import { useTranslations } from "next-intl"

export function ExclusiveBadge() {
  const t = useTranslations()

  return (
    <div className="flex flex-col justify-center items-center gap-2 py-2 px-4 rounded-full border border-[#177799] bg-[#0e4659]">
      <div className="flex items-center">
        <BadgeCheck className="size-6 text-[#48CAE4]" />
        <div className="flex justify-center items-center gap-2.5 py-0 px-2 text-white text-sm leading-[normal]">
          {t("exclusive")}
        </div>
      </div>
    </div>
  )
}
