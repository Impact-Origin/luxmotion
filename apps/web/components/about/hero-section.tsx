"use client"

import { useTranslations } from "next-intl"
import Image from "next/image"
import { ArrowRight, Users } from "lucide-react"

function FoundersWatermark({ size = "desktop" }: { size?: "desktop" | "mobile" }) {
  const isDesktop = size === "desktop"
  const square = isDesktop ? 68.862 : 35.223
  const border = isDesktop ? 2.898 : 1.482
  const monogramW = isDesktop ? 34.327 : 17.559
  const monogramH = isDesktop ? 18.859 : 9.646
  const wordmarkW = isDesktop ? 123.189 : 63.012
  const wordmarkH = isDesktop ? 14.013 : 7.168
  const tagSize = isDesktop ? 10.85 : 5.55
  const tagTracking = isDesktop ? 1.519 : 0.777
  const gap = isDesktop ? 12 : 6

  return (
    <div className="flex items-center" style={{ gap }}>
      <div
        className="border-[#C9A96E] flex items-center justify-center shrink-0"
        style={{ width: square, height: square, borderWidth: border }}
      >
        <div className="relative" style={{ width: monogramW, height: monogramH }}>
          <Image src="/svgs/lm-monogram.svg" alt="" fill className="object-contain" priority />
        </div>
      </div>
      <div className="flex flex-col">
        <div className="relative" style={{ width: wordmarkW, height: wordmarkH }}>
          <Image src="/svgs/luxmotion-text.svg" alt="LuxMotion" fill className="object-contain object-left" priority />
        </div>
        <span
          className="text-[#999] uppercase whitespace-nowrap"
          style={{
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            fontSize: tagSize,
            letterSpacing: tagTracking,
            marginTop: isDesktop ? 8 : 4,
          }}
        >
          BY EASYTRANSFER
        </span>
      </div>
    </div>
  )
}

export function HeroSection() {
  const t = useTranslations("aboutPage.hero")

  return (
    <section className="bg-[#0D0D0D] text-white pb-8 lg:pb-12">
      <div className="hidden lg:flex items-stretch w-full max-w-[1440px] mx-auto min-h-[782px]">
        <div className="flex flex-col justify-center gap-[29px] px-12 py-20 w-[700px] shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-[82px] h-px bg-[#C9A96E]" />
            <span
              className="text-[12px] font-semibold uppercase tracking-[2px] text-[#C9A96E] whitespace-nowrap"
              style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
            >
              {t("eyebrow")}
            </span>
          </div>
          <h1
            className="text-white font-normal leading-[1.02]"
            style={{
              fontFamily: "var(--font-title), 'Cormorant Garamond', serif",
              fontSize: "clamp(2.5rem, 4vw, 4.5rem)",
            }}
          >
            <span className="block whitespace-nowrap">{t("headingLine1")}</span>
            <span className="block whitespace-nowrap">
              {t("headingLine2Pre")}
              <span className="italic text-[#C9A96E]">{t("headingAccent")}</span>
            </span>
          </h1>
          <p
            className="text-[18px] leading-[1.3] text-[#999]"
            style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
          >
            {t("subtitle")}
          </p>
          <div className="flex items-center gap-3">
            <a
              href="#our-story"
              className="h-12 px-6 flex items-center gap-2 bg-[#C9A96E] text-[#0D0D0D] hover:bg-[#d4b67e] transition-colors"
            >
              <span className="px-2 text-[14px] font-medium uppercase tracking-[1.1px]">{t("ctaPrimary")}</span>
              <ArrowRight className="w-[18px] h-[18px]" strokeWidth={2} />
            </a>
            <a
              href="#team"
              className="h-12 px-6 flex items-center gap-2 border border-[rgba(255,255,255,0.12)] text-[#999] hover:text-white hover:border-[rgba(255,255,255,0.3)] transition-colors"
            >
              <span className="px-2 text-[14px] font-medium uppercase tracking-[1.1px]">{t("ctaSecondary")}</span>
              <Users className="w-[18px] h-[18px]" strokeWidth={2} />
            </a>
          </div>
        </div>
        <div
          className="relative flex-1 flex items-end justify-center min-h-[782px] overflow-hidden bg-[#0D0D0D]"
        >
          <div className="absolute top-[60px] left-1/2 -translate-x-1/2 z-10">
            <FoundersWatermark size="desktop" />
          </div>
          <div className="relative w-[720px] h-[720px] mt-[20px]">
            <Image
              src="/about/founders.png"
              alt={t("imageAlt")}
              fill
              className="object-cover object-bottom"
              sizes="740px"
              priority
            />
          </div>
          <div
            className="absolute inset-y-0 left-0 w-[140px] pointer-events-none"
            style={{ backgroundImage: "linear-gradient(to right, #0D0D0D, rgba(13,13,13,0))" }}
          />
        </div>
      </div>

      <div className="lg:hidden flex flex-col">
        <div
          className="relative w-full aspect-[430/411] overflow-hidden bg-[#0D0D0D]"
        >
          <div className="absolute top-[31px] left-1/2 -translate-x-1/2 z-10">
            <FoundersWatermark size="mobile" />
          </div>
          <div
            className="absolute left-1/2 -translate-x-1/2 w-[370px] h-[370px]"
            style={{ top: 10 }}
          >
            <Image
              src="/about/founders.png"
              alt={t("imageAlt")}
              fill
              className="object-cover object-bottom"
              sizes="430px"
              priority
            />
          </div>
        </div>
        <div className="flex flex-col gap-[29px] pt-6 pb-10 px-4 bg-[#0D0D0D]">
          <div className="flex items-center gap-2">
            <div className="w-[82px] h-px bg-[#C9A96E]" />
            <span
              className="text-[12px] font-semibold uppercase tracking-[2px] text-[#C9A96E] whitespace-nowrap"
              style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
            >
              {t("eyebrow")}
            </span>
          </div>
          <h1
            className="text-white font-normal leading-[1.05]"
            style={{
              fontFamily: "var(--font-title), 'Cormorant Garamond', serif",
              fontSize: "clamp(2.25rem, 10vw, 3rem)",
            }}
          >
            <span className="block">{t("headingLine1")}</span>
            <span className="block">
              {t("headingLine2Pre")}
              <span className="italic text-[#C9A96E]">{t("headingAccent")}</span>
            </span>
          </h1>
          <p
            className="text-[18px] leading-[1.3] text-[#999]"
            style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
          >
            {t("subtitle")}
          </p>
          <div className="flex flex-col gap-3 w-full">
            <a
              href="#team"
              className="h-12 w-full flex items-center justify-center gap-2 border border-[rgba(255,255,255,0.12)] text-[#999] hover:text-white hover:border-[rgba(255,255,255,0.3)] transition-colors"
            >
              <span className="px-2 text-[14px] font-medium uppercase tracking-[1.1px]">{t("ctaSecondary")}</span>
              <Users className="w-[18px] h-[18px]" strokeWidth={2} />
            </a>
            <a
              href="#our-story"
              className="h-12 w-full flex items-center justify-center gap-2 bg-[#C9A96E] text-[#0D0D0D] hover:bg-[#d4b67e] transition-colors"
            >
              <span className="px-2 text-[14px] font-medium uppercase tracking-[1.1px]">{t("ctaPrimary")}</span>
              <ArrowRight className="w-[18px] h-[18px]" strokeWidth={2} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
