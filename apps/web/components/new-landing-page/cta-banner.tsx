"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"

export function CTABanner() {
  const t = useTranslations("ctaBanner")

  return (
    <section
      className="relative overflow-hidden pt-10 pb-16 px-4 md:px-[82px] 2xl:px-[300px] flex flex-col items-center justify-center gap-6 bg-[#0D0D0D]"
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 85% at 50% 50%, rgba(26,16,5,1) 0%, rgba(22,14,6,0.85) 35%, rgba(17,13,9,0.5) 60%, rgba(13,13,13,0) 85%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 w-[22%] pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, #0D0D0D 0%, rgba(13,13,13,0.6) 50%, rgba(13,13,13,0) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 w-[22%] pointer-events-none"
        style={{
          background:
            "linear-gradient(to left, #0D0D0D 0%, rgba(13,13,13,0.6) 50%, rgba(13,13,13,0) 100%)",
        }}
      />
      <div className="flex flex-col items-center gap-2 text-center max-w-[1280px] relative z-10">
        <h2
          className="text-[36px] md:text-[48px] text-[#F5F5F5] leading-none"
          style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif", fontWeight: 300 }}
        >
          {t("line1")}
          <br />
          <span className="italic font-medium text-[#C9A96E]">{t("line2")}</span>
        </h2>
        <p
          className="text-[16px] md:text-[18px] leading-[1.3] text-[#999] text-center"
          style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
        >
          {t("subtitle1")}
          <br />
          {t("subtitle2")}
        </p>
      </div>

      <Link
        href="/booking"
        className="group relative z-10 inline-flex items-center gap-2 border border-[#C9A96E] h-12 px-6 text-[#C9A96E] hover:bg-[rgba(201,169,110,0.08)] transition-colors"
        style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
      >
        <span className="text-[14px] font-medium tracking-[1.1px] uppercase">
          {t("cta")}
        </span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </section>
  )
}
