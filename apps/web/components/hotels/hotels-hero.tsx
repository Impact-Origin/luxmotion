"use client"

import { useTranslations } from "next-intl"
import { Check } from "lucide-react"
import { PartnerLeadForm } from "./partner-lead-form"

const sans = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const
const serif = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const

export function HotelsHero() {
  const t = useTranslations("hotels.hero")
  const bullets = [t("bullet1"), t("bullet2"), t("bullet3")]
  const stats = [
    [t("stat1Value"), t("stat1Label")],
    [t("stat2Value"), t("stat2Label")],
    [t("stat3Value"), t("stat3Label")],
  ]

  return (
    <section className="relative overflow-hidden bg-[#0D0D0D]">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(201,169,110,0.10), transparent 65%)" }}
      />
      <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 gap-12 px-4 py-14 lg:grid-cols-[1fr_minmax(440px,520px)] lg:gap-16 lg:px-12 lg:py-20">
        {/* Left */}
        <div className="flex flex-col">
          <div className="mb-6 inline-flex w-fit items-center border border-[rgba(201,169,110,0.3)] px-3 py-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-[2px] text-[#C9A96E]" style={sans}>
              {t("badge")}
            </span>
          </div>

          <h1 className="text-[44px] leading-[1.05] text-white sm:text-[56px] lg:text-[64px]" style={serif}>
            {t("titleLine1")}
            <br />
            <span className="italic text-[#C9A96E]">{t("titleAccent")}</span> {t("titleSuffix")}
          </h1>

          <p className="mt-6 max-w-[560px] text-[16px] leading-[1.55] text-[#9a9a9a]" style={sans}>
            {t("intro")}
          </p>

          <p className="mt-9 text-[11px] font-semibold uppercase tracking-[2px] text-[#C9A96E]" style={sans}>
            {t("bulletsLabel")}
          </p>
          <ul className="mt-4 flex flex-col gap-4">
            {bullets.map((b, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center border border-[rgba(201,169,110,0.4)] text-[#C9A96E]">
                  <Check className="h-3.5 w-3.5" strokeWidth={2.2} />
                </span>
                <span className="text-[14px] leading-[1.5] text-[#bdb7ad]" style={sans}>
                  {b}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-10 grid max-w-[560px] grid-cols-3 gap-4 border-t border-[rgba(255,255,255,0.1)] pt-7">
            {stats.map(([value, label], i) => (
              <div key={i} className="flex flex-col gap-1">
                <span className="text-[34px] leading-none text-white" style={serif}>
                  {value}
                </span>
                <span className="text-[11px] font-medium uppercase tracking-[1px] text-[#8c8680]" style={sans}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <div id="candidatura" className="scroll-mt-24 lg:pt-2">
          <PartnerLeadForm />
        </div>
      </div>
    </section>
  )
}
