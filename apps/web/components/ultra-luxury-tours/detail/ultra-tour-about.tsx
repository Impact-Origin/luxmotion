"use client"

import { useTranslations } from "next-intl"
import { TipTapRenderer } from "@/components/shared/tiptap-renderer"

const SERIF_FONT = "var(--font-title), 'Cormorant Garamond', serif"

export function UltraTourAbout({ description }: { description: string | Record<string, any> }) {
  const t = useTranslations("tourDetails")

  return (
    <div>
      <h2 className="text-[24px] leading-none text-[#0d0d0d] md:text-[28px]" style={{ fontFamily: SERIF_FONT }}>
        {t("aboutPrefix")} <span className="italic text-[#a08248]">{t("aboutAccent")}</span>
      </h2>
      <div className="mt-5 text-[15px] leading-[1.6] text-[#4a4a4a] [&_a]:text-[#a08248] [&_strong]:text-[#1c1b18]">
        <TipTapRenderer content={description} />
      </div>
    </div>
  )
}
