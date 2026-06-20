"use client"

import { useTranslations } from "next-intl"
import { Check } from "lucide-react"
import { PartnerLeadForm } from "./partner-lead-form"

const sans = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const
const serif = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const

export function PartnerApplicationHero() {
  const t = useTranslations("hotels.hero")
  const bullets = [t("bullet1"), t("bullet2"), t("bullet3")]
  const stats = [
    { v: t("stat1Value"), l: t("stat1Label") },
    { v: t("stat2Value"), l: t("stat2Label") },
    { v: t("stat3Value"), l: t("stat3Label") },
  ]

  return (
    <section className="relative bg-[#0D0D0D] lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
      {/* Left — content */}
      <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:py-24 lg:pl-12 lg:pr-10 xl:pl-[6vw]">
        <div className="w-full max-w-[700px]">
          <div className="mb-6 inline-flex w-fit items-center border border-[rgba(201,169,110,0.35)] px-3.5 py-2">
            <span className="text-[10px] font-semibold uppercase tracking-[2px] text-[#C9A96E]" style={sans}>
              {t("badge")}
            </span>
          </div>

          <h1 className="text-[42px] leading-[1.04] text-white sm:text-[54px] lg:max-w-[620px] lg:text-[62px]" style={serif}>
            {t("titleLine1")}
            <br />
            <span className="italic text-[#C9A96E]">{t("titleAccent")}</span> {t("titleSuffix")}
          </h1>

          <p className="mt-6 max-w-[560px] text-[15px] leading-[1.6] text-[#9a9a9a]" style={sans}>
            {t("intro")}
          </p>

          {/* bullets */}
          <div className="mt-7">
            <span className="text-[11px] font-semibold uppercase tracking-[1.8px] text-[#C9A96E]" style={sans}>
              {t("bulletsLabel")}
            </span>
            <ul className="mt-4 flex flex-col gap-3.5">
              {bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-[13.5px] leading-[1.5] text-[#cfcabf]" style={sans}>
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border border-[rgba(201,169,110,0.4)]">
                    <Check className="h-3 w-3 text-[#C9A96E]" strokeWidth={2.5} />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* stats */}
          <div className="mt-8 flex flex-wrap gap-x-10 gap-y-5 border-t border-[rgba(255,255,255,0.1)] pt-7">
            {stats.map((s, i) => (
              <div key={i} className="flex flex-col gap-1">
                <span className="text-[26px] italic leading-none text-[#C9A96E]" style={serif}>{s.v}</span>
                <span className="text-[10px] font-semibold uppercase tracking-[1.3px] text-[rgba(255,255,255,0.5)]" style={sans}>{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — partnership application form */}
      <div className="flex items-center justify-center border-t border-[rgba(201,169,110,0.12)] px-4 py-12 sm:px-6 lg:justify-end lg:border-t-0 lg:py-16 lg:pl-2 lg:pr-7">
        <div className="w-full max-w-[580px]">
          <PartnerLeadForm />
        </div>
      </div>
    </section>
  )
}
