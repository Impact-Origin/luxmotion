"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, MapPin, Calendar } from "lucide-react"
import { useTranslations } from "next-intl"

export function TravelAgenciesSection() {
  const t = useTranslations("travelAgencies")

  return (
    <section
      id="b2b-travel-agencies"
      className="bg-[#1A1A1A] pt-10 pb-14 px-4 md:px-[82px]"
    >
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row md:items-center gap-6 md:gap-20">
        <div className="flex-1 relative order-2 md:order-1">
          <div className="relative w-full aspect-[4/3] rounded-[4px] overflow-hidden">
            <Image
              src="/b2b/travel-agencies.png"
              alt={t("photoAlt")}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <WhiteLabelBookingCard />
        </div>

        <div className="flex-1 flex flex-col gap-4 order-1 md:order-2">
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
            className="text-[32px] md:text-[48px] leading-[1.2] md:leading-[1.05] text-white"
            style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif" }}
          >
            {t("titleMain")}{" "}
            <span className="italic text-[#C9A96E]">{t("titleItalic")}</span>
          </h2>

          <p
            className="text-[14px] leading-[1.75] text-[#999]"
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
      </div>
    </section>
  )
}

function WhiteLabelBookingCard() {
  const t = useTranslations("travelAgencies.card")

  return (
    <div className="absolute bottom-[-20px] right-[-10px] md:right-[-20px] w-[260px] backdrop-blur-[6px] bg-[rgba(20,20,20,0.95)] border border-[rgba(201,169,110,0.15)] px-4 pt-4 pb-3 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6)]">
      <span
        className="text-[9px] tracking-[1.08px] uppercase text-[#C9A96E] font-semibold"
        style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
      >
        {t("label")}
      </span>

      <div className="flex items-center gap-2 mt-2">
        <MapPin className="w-3 h-3 text-[rgba(255,255,255,0.7)] shrink-0" />
        <span
          className="text-[12px] text-[rgba(255,255,255,0.7)] whitespace-nowrap"
          style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
        >
          {t("route")}
        </span>
      </div>

      <div className="flex items-center gap-2 mt-2.5">
        <Calendar className="w-3 h-3 text-[#999] shrink-0" />
        <span
          className="text-[12px] text-[#999]"
          style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
        >
          {t("date")}
        </span>
      </div>

      <button
        type="button"
        className="mt-4 bg-[#C9A96E] text-[#0D0D0D] text-[11px] tracking-[1.1px] uppercase font-bold py-[10px] px-[31px]"
        style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
      >
        ⊕ {t("button")}
      </button>
    </div>
  )
}
