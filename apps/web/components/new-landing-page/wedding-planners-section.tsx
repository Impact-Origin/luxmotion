"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"

export function WeddingPlannersSection() {
  const t = useTranslations("weddingPlanners")

  return (
    <section
      id="b2b-wedding-planners"
      className="bg-[#0D0D0D] py-10 md:py-24 px-4 md:px-[82px]"
    >
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row md:items-center gap-6 md:gap-20">
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center gap-[10px]">
            <div className="w-8 h-px bg-[#C9A96E]" />
            <span
              className="text-[12px] tracking-[1.8px] uppercase text-[#C9A96E] font-semibold"
              style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
            >
              {t("sectionLabel")}
            </span>
          </div>

          <h2
            className="text-[32px] md:text-[48px] leading-none text-white"
            style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif" }}
          >
            {t("titleLine1")}
            <br />
            <span className="italic text-[#C9A96E]">{t("titleLine2")}</span>
          </h2>

          <p
            className="text-[14px] leading-[1.5] text-[#999]"
            style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
          >
            {t("body")}
          </p>

          <Link
            href="/b2b"
            className="group inline-flex items-center gap-1 text-[12px] tracking-[1.2px] text-[#C9A96E] font-semibold hover:text-white transition-colors w-fit pt-4"
            style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
          >
            <span>{t("cta")}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="flex-1 relative">
          <div className="relative w-full aspect-[4/3] rounded-[4px] overflow-hidden">
            <Image
              src="/b2b/wedding-planners.png"
              alt={t("photoAlt")}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <RideStatusCard />
        </div>
      </div>
    </section>
  )
}

function RideStatusCard() {
  const t = useTranslations("weddingPlanners.card")

  return (
    <div className="absolute bottom-[-20px] right-[-10px] md:right-[-20px] min-w-[220px] backdrop-blur-[6px] bg-[rgba(20,20,20,0.95)] border border-[rgba(201,169,110,0.15)] p-4 flex flex-col gap-3 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6)]">
      <div>
        <span
          className="inline-block bg-[#C9A96E] text-[#0D0D0D] text-[9px] tracking-[0.9px] uppercase font-bold px-[10px] py-1"
          style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
        >
          {t("badge")}
        </span>
      </div>

      <div className="h-[3px] rounded-[2px] bg-gradient-to-r from-[#C9A96E] to-[rgba(201,169,110,0.2)] w-full" />

      <div className="flex items-center gap-1">
        <span
          className="text-[12px] font-semibold text-white"
          style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
        >
          {t("arrival")}
        </span>
        <span
          className="bg-[rgba(201,169,110,0.1)] border border-[rgba(201,169,110,0.3)] px-[11px] py-1 text-[9px] tracking-[0.72px] uppercase font-semibold text-[#C9A96E]"
          style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
        >
          {t("status")}
        </span>
      </div>
    </div>
  )
}
