"use client"

import { useTranslations } from "next-intl"
import { cn } from "@workspace/ui/lib/utils"

export const REGION_TABS = ["regions", "tours", "foodWine", "riverCruises", "wellness"] as const
export type RegionTab = (typeof REGION_TABS)[number]

export const CUSTOM_INQUIRY_ID = "custom-tours-inquiry"

/** Salta para o formulário de pedido à medida, no fim da página. */
export function scrollToCustomInquiry() {
  document
    .getElementById(CUSTOM_INQUIRY_ID)
    ?.scrollIntoView({ behavior: "smooth", block: "start" })
}

export function RegionTabStrip({
  active = "tours",
  onChange,
}: {
  active?: RegionTab
  onChange?: (tab: RegionTab) => void
}) {
  const t = useTranslations("ultraLuxuryTours.regionTabs")

  return (
    <div className="flex items-stretch justify-center gap-0 border-y-[0.8px] border-[rgba(201,169,110,0.1)] bg-[#0d0d0d] px-4 md:px-[60px]">
      <div className="flex items-stretch overflow-x-auto">
        {REGION_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onChange?.(tab)}
            className={cn(
              "flex items-center justify-center whitespace-nowrap border-b-[1.6px] px-[28px] pt-4 pb-[17.6px] text-[12px] font-semibold uppercase tracking-[1.2px] transition-colors",
              tab === active
                ? "border-[#C9A96E] text-[#C9A96E]"
                : "border-transparent text-[#8c8680] hover:text-[#C9A96E]",
            )}
          >
            {t(tab)}
          </button>
        ))}
      </div>
      <div className="flex items-center pl-2">
        <button
          type="button"
          onClick={scrollToCustomInquiry}
          className="flex h-[40px] items-center justify-center whitespace-nowrap bg-[#C9A96E] px-[22px] text-[14px] font-medium uppercase tracking-[1.1px] text-[#0d0d0d] transition-colors hover:bg-[#b89558]"
        >
          {t("customTours")}
        </button>
      </div>
    </div>
  )
}
