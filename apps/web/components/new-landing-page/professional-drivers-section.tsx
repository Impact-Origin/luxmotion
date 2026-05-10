"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"

export function ProfessionalDriversSection() {
  const t = useTranslations("professionalDrivers")

  return (
    <section
      id="b2b-professional-drivers"
      className="bg-[#1A1A1A] py-10 md:py-24 px-4 md:px-[82px]"
    >
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row md:items-center gap-6 md:gap-20">
        <div className="flex-1 relative mb-32 md:mb-0">
          <div className="relative w-full aspect-[4/3] rounded-[4px] overflow-hidden">
            <Image
              src="/b2b/professional-drivers.png"
              alt={t("photoAlt")}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <DriverScheduleCard />
        </div>

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
            href="/drivers"
            className="group inline-flex items-center gap-1.5 text-[14px] md:text-[16px] tracking-[1px] text-[#C9A96E] font-semibold hover:text-white transition-colors w-fit pt-4"
            style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
          >
            <span>{t("cta")}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}

function DriverScheduleCard() {
  const t = useTranslations("professionalDrivers.card")

  const rides = [
    { time: "09:15", badge: t("onTime"), route: t("route1"), status: "ontime" as const },
    { time: "14:30", badge: t("onTime"), route: t("route2"), status: "ontime" as const },
    { time: "19:00", badge: t("scheduled"), route: t("route3"), status: "scheduled" as const },
  ]

  return (
    <div className="absolute bottom-[-20px] right-[-10px] md:right-[-20px] w-[304px] backdrop-blur-[6px] bg-[rgba(20,20,20,0.95)] border border-[rgba(201,169,110,0.15)] px-4 pt-4 pb-2 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6)]">
      <div className="flex items-center gap-1 mb-3">
        <span
          className="text-[12px] text-[#999]"
          style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
        >
          {t("dateLabel")}
        </span>
        <span
          className="text-[12px] text-[#C9A96E]"
          style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
        >
          {t("ridesCount")}
        </span>
      </div>

      {rides.map((ride, i) => (
        <div
          key={ride.time}
          className={`flex items-center gap-2 py-2 ${i < rides.length - 1 ? "border-b border-[rgba(255,255,255,0.06)]" : ""}`}
        >
          <span
            className="text-[13px] font-semibold text-white min-w-[40px]"
            style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
          >
            {ride.time}
          </span>
          <span
            className={`text-[8px] font-bold tracking-[0.64px] uppercase text-center min-w-[60px] px-[11px] py-[3px] border ${
              ride.status === "ontime"
                ? "bg-[rgba(76,175,80,0.15)] border-[rgba(76,175,80,0.25)] text-[#4CAF50]"
                : "bg-[rgba(201,169,110,0.1)] border-[rgba(201,169,110,0.2)] text-[#C9A96E]"
            }`}
            style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
          >
            {ride.badge}
          </span>
          <span
            className="text-[11px] text-[rgba(255,255,255,0.45)] whitespace-nowrap"
            style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
          >
            {ride.route}
          </span>
        </div>
      ))}
    </div>
  )
}
