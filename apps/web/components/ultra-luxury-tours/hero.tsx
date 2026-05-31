"use client"

import { useTranslations } from "next-intl"

const SERIF_FONT = "var(--font-title), 'Cormorant Garamond', serif"

const METRICS = [
  { value: "+311", labelKey: "metricReviewsLabel" },
  { value: "5.0", labelKey: "metricRatingLabel" },
  { value: "100%", labelKey: "metricTailoredLabel" },
] as const

export function UltraLuxuryToursHero() {
  const t = useTranslations("ultraLuxuryTours.hero")

  return (
    <section className="flex flex-col items-center justify-center bg-[#0D0D0D] px-4 py-6 md:min-h-[600px] md:px-12 md:py-10">
      <div className="flex w-full max-w-[680px] flex-col gap-6">
        <div className="flex items-center justify-center gap-2">
          <div className="h-px w-8 max-w-[82px] min-w-[32px] bg-[#C9A96E]" />
          <span className="text-[12px] font-semibold uppercase leading-none tracking-[2px] text-[#C9A96E]">
            {t("eyebrow")}
          </span>
          <div className="h-px w-8 max-w-[82px] min-w-[32px] bg-[#C9A96E]" />
        </div>

        <h1
          className="text-center leading-none"
          style={{ fontFamily: SERIF_FONT }}
        >
          <span className="block text-[48px] text-white md:text-[64px]">
            {t("titleLine1")}
          </span>
          <span className="block text-[48px] italic text-[#C9A96E] md:text-[64px]">
            {t("titleLine2")}
          </span>
        </h1>

        <p className="text-center text-[18px] font-light leading-[1.3] text-[#999]">
          {t("subtitle")}
        </p>

        <div className="flex h-[104px] w-full items-stretch justify-center gap-[2px] border border-[rgba(28,27,24,0.08)] bg-[rgba(28,27,24,0.08)] p-px md:h-[84px]">
          {METRICS.map((metric) => (
            <div key={metric.labelKey} className="flex flex-col gap-1 px-4 py-[18px]">
              <span
                className="text-[32px] italic leading-[30px] text-[#C9A96E]"
                style={{ fontFamily: SERIF_FONT }}
              >
                {metric.value}
              </span>
              <span className="text-[12px] uppercase leading-[1.3] tracking-[2px] text-[#999]">
                {t(metric.labelKey)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
