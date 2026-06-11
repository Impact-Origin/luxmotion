"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { ArrowRight, Check, MessageSquare } from "lucide-react"

const SERIF_FONT = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const
const SANS_FONT = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const

const TRUST_KEYS = ["trust1", "trust2", "trust3", "trust4"] as const

export function DriversCtaFinal() {
  const t = useTranslations("driversPage.ctaFinal")

  return (
    <section className="relative bg-[#111110] px-4 md:px-[80px] lg:px-[200px] xl:px-[380px] py-16 md:py-[96px] overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 1018px 798px at 50% -51px, rgba(154,117,53,0.18) 0%, rgba(154,117,53,0) 55%)",
        }}
      />
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(196,151,62,0) 0%, #c4973e 50%, rgba(196,151,62,0) 100%)",
        }}
      />

      <div className="relative flex flex-col gap-[14px] items-center max-w-[680px] mx-auto">
        <div className="flex items-center gap-2 md:gap-0">
          <span className="md:hidden h-px w-8 bg-[#C9A96E]" />
          <p
            className="text-[9px] md:text-[10px] font-bold uppercase tracking-[2.34px] text-[rgba(201,169,110,0.6)] text-center whitespace-nowrap leading-none"
            style={SANS_FONT}
          >
            {t("eyebrow")}
          </p>
          <span className="md:hidden h-px w-8 bg-[#C9A96E]" />
        </div>

        <h2
          className="text-white font-light text-center text-[36px] md:text-[48px] leading-[1.2]"
          style={SERIF_FONT}
        >
          <span className="block">{t("heading")}</span>
          <span className="block italic text-[#c4973e]">{t("headingAccent")}</span>
        </h2>

        <p
          className="max-w-[500px] pt-[1.42px] text-[14px] text-[rgba(255,255,255,0.45)] text-center leading-[1.2]"
          style={SANS_FONT}
        >
          {t("subtitle")}
        </p>

        <div className="flex flex-col md:flex-row flex-wrap items-stretch md:items-center justify-center gap-3 pt-[26px] w-full">
          <Link
            href={t("primaryHref")}
            className="h-12 inline-flex items-center justify-center bg-[#C9A96E] hover:bg-[#b8954f] transition-colors px-6 group"
          >
            <span
              className="px-2 text-[14px] font-medium uppercase tracking-[1.1px] text-[#0D0D0D]"
              style={SANS_FONT}
            >
              {t("primaryCta")}
            </span>
            <ArrowRight className="size-[18px] text-[#0D0D0D] transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
          </Link>
          <Link
            href={t("secondaryHref")}
            target="_blank"
            rel="noopener noreferrer"
            className="group h-12 inline-flex items-center justify-center border border-[rgba(255,255,255,0.12)] hover:border-[rgba(201,169,110,0.5)] hover:bg-[rgba(201,169,110,0.06)] transition-colors duration-200 px-6"
          >
            <span
              className="px-2 text-[14px] font-medium uppercase tracking-[1.1px] text-[#999] group-hover:text-[#C9A96E] transition-colors duration-200"
              style={SANS_FONT}
            >
              {t("secondaryCta")}
            </span>
            <MessageSquare className="size-[18px] text-[#999] group-hover:text-[#C9A96E] transition-colors duration-200" strokeWidth={2} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:flex md:flex-wrap items-center justify-center gap-x-5 gap-y-3 pt-[14px] w-full">
          {TRUST_KEYS.map((key) => (
            <div key={key} className="flex items-center gap-[6px]">
              <Check className="size-[11px] text-[#C9A96E] shrink-0" strokeWidth={2.5} />
              <span
                className="text-[12px] text-[#999] whitespace-nowrap leading-none"
                style={SANS_FONT}
              >
                {t(key)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
