"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"

export function CinematicBanner() {
  const t = useTranslations("cinematicBanner")

  return (
    <section className="bg-[#0D0D0D]">
      <div className="relative w-full h-[280px] md:h-[400px] overflow-hidden">
        <Image
          src="/cinematic-banner.png"
          alt={t("photoAlt")}
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[rgba(13,13,13,0.4)] to-[rgba(13,13,13,0.3)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(13,13,13,0.6)] to-transparent" />
      </div>

      <div className="relative bg-gradient-to-b from-[rgba(201,169,110,0.06)] to-[#0D0D0D] px-4 md:px-[82px] 2xl:px-[300px]">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row md:items-center md:justify-between py-8 md:py-10 gap-6">
          <h2
            className="text-[28px] md:text-[36px] leading-none text-white"
            style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif" }}
          >
            {t("line1")}
            <br />
            <span className="italic text-[#C9A96E]">{t("line2")}</span>
          </h2>

          <Link
            href="/booking"
            className="group inline-flex items-center gap-3 border border-[#C9A96E] px-6 py-3 text-[#C9A96E] hover:bg-[rgba(201,169,110,0.08)] transition-colors w-fit shrink-0"
            style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
          >
            <span className="text-[12px] font-semibold tracking-[1.2px] uppercase">
              {t("cta")}
            </span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
