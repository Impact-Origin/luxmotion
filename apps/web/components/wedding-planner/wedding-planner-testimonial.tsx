"use client"

import { useTranslations } from "next-intl"

const SERIF_FONT = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const
const SANS_FONT = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const

const SHADOW =
  "0px 9px 10px rgba(0,0,0,0.1), 0px 37px 18.5px rgba(0,0,0,0.09), 0px 83px 25px rgba(0,0,0,0.05), 0px 148px 29.5px rgba(0,0,0,0.01)"

export function WeddingPlannerTestimonial() {
  const t = useTranslations("weddingPlanner.testimonial")

  return (
    <section className="bg-white px-4 md:px-[82px] pt-12 md:pt-[71px] pb-12 md:pb-[72px]">
      <div className="max-w-[1280px] mx-auto flex justify-center">
        <div
          className="w-full max-w-[700px] bg-white border border-[rgba(28,27,24,0.08)] p-6 md:p-[40px] flex flex-col items-center text-center"
          style={{ boxShadow: SHADOW }}
        >
          <span
            className="text-[40px] leading-none text-[#9a7535] font-medium"
            style={SERIF_FONT}
          >
            &ldquo;
          </span>
          <p
            className="text-[18px] md:text-[24px] leading-[1.2] italic font-semibold text-[#1c1b18]"
            style={SERIF_FONT}
          >
            {t("quote")}
          </p>
          <p
            className="mt-4 text-[14px] font-semibold text-[#9a7535] leading-[20.59px]"
            style={SANS_FONT}
          >
            {t("author")}
          </p>
          <p
            className="text-[12px] text-[rgba(28,27,24,0.38)] leading-[17.95px]"
            style={SANS_FONT}
          >
            {t("role")}
          </p>
        </div>
      </div>
    </section>
  )
}
