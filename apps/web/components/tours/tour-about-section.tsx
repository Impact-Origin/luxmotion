"use client"

import { useTranslations } from "next-intl"
import { TipTapRenderer } from "@/components/shared/tiptap-renderer"

interface TourAboutSectionProps {
  description: string | Record<string, any>
}

export function TourAboutSection({ description }: TourAboutSectionProps) {
  const t = useTranslations("tourDetails")

  return (
    <div className="w-full">
      <h2 className="text-[24px] font-bold text-[#27c7ff] leading-[1.3] mb-4">
        {t("aboutThisTour")}
      </h2>
      <TipTapRenderer
        content={description}
        className="text-[14px] lg:text-[16px] text-[#5f686c] leading-[1.6]"
      />
    </div>
  )
}
