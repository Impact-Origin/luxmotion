"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Clock, Mail, Phone, Plane } from "lucide-react"
import { useTranslations } from "next-intl"

export function B2BSection() {
  const t = useTranslations("b2b")

  return (
    <section
      id="b2b-hotels"
      className="bg-[#0D0D0D] pt-10 pb-[56px] px-4 md:px-[82px]"
    >
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row md:items-center gap-10 md:gap-20">
        <div className="flex-1 flex flex-col gap-6">
          <span
            className="text-[11px] md:text-[12px] tracking-[0.24em] uppercase text-[#C9A96E]"
            style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
          >
            {t("sectionLabel")}
          </span>
          <h2
            className="text-[36px] md:text-[48px] leading-[1.05] text-white"
            style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif" }}
          >
            {t("titleMain")}
            <br />
            <span className="italic text-[#C9A96E]">{t("titleItalic")}</span>
          </h2>
          <p
            className="text-[15px] md:text-[16px] leading-[1.7] text-[#C9C9C9] max-w-[520px]"
            style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
          >
            {t("body1")}
          </p>
          <p
            className="text-[14px] md:text-[15px] leading-[1.7] text-[#999] max-w-[520px]"
            style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
          >
            {t("body2")}
          </p>
          <Link
            href="/b2b"
            className="group inline-flex items-center gap-2 text-[14px] tracking-[0.12em] uppercase text-[#C9A96E] hover:text-white transition-colors w-fit"
            style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
          >
            <span>{t("cta")}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="flex-1 relative">
          <div className="relative w-full aspect-[4/3] overflow-hidden rounded-[2px]">
            <Image
              src="/b2b/hotel-arrival.png"
              alt={t("photoAlt")}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>

          <GuestCheckInCard />
        </div>
      </div>
    </section>
  )
}

function GuestCheckInCard() {
  const t = useTranslations("b2b.card")

  return (
    <div className="absolute bottom-[-30px] right-[-12px] md:right-[-20px] w-[280px] md:w-[300px] bg-[#141414] border border-[rgba(201,169,110,0.22)] rounded-[4px] p-5 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-between mb-4">
        <span
          className="text-[10px] tracking-[0.2em] uppercase text-[#C9A96E]"
          style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
        >
          {t("label")}
        </span>
        <span className="w-2 h-2 rounded-full bg-[#4ADE80] shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-full bg-[rgba(201,169,110,0.12)] border border-[rgba(201,169,110,0.3)] flex items-center justify-center text-[#C9A96E] text-[14px]"
          style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif" }}
        >
          {t("guestInitial")}
        </div>
        <div className="flex flex-col">
          <span
            className="text-[14px] text-white"
            style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
          >
            {t("guestName")}
          </span>
          <span
            className="text-[11px] text-[#999]"
            style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
          >
            {t("guestMeta")}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center gap-2 text-[11px] text-[#C9C9C9]">
          <Plane className="w-3.5 h-3.5 text-[#C9A96E]" />
          <span style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
            {t("tag1")}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[#C9C9C9]">
          <Clock className="w-3.5 h-3.5 text-[#C9A96E]" />
          <span style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
            {t("tag2")}
          </span>
        </div>
      </div>

      <div className="flex gap-2 pt-3 border-t border-[rgba(255,255,255,0.08)]">
        <button
          type="button"
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[2px] bg-[rgba(201,169,110,0.12)] border border-[rgba(201,169,110,0.3)] text-[11px] text-[#C9A96E] hover:bg-[rgba(201,169,110,0.2)] transition-colors"
          style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
        >
          <Phone className="w-3 h-3" />
          {t("call")}
        </button>
        <button
          type="button"
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[2px] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[11px] text-[#C9C9C9] hover:bg-[rgba(255,255,255,0.08)] transition-colors"
          style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
        >
          <Mail className="w-3 h-3" />
          {t("message")}
        </button>
      </div>
    </div>
  )
}
