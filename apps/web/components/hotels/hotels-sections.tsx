"use client"

import { useTranslations } from "next-intl"
import Link from "next/link"
import { Car, MapPinned, Gem, PartyPopper, Heart, Crown, Check, ArrowRight } from "lucide-react"

const sans = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const
const serif = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const

function SectionHeader({ eyebrow, title, subtitle, center = true }: { eyebrow: string; title: string; subtitle?: string; center?: boolean }) {
  return (
    <div className={`flex flex-col gap-3 ${center ? "items-center text-center" : ""}`}>
      <div className="flex items-center gap-2">
        <span className="h-px w-7 bg-[#C9A96E]" />
        <span className="text-[11px] font-semibold uppercase tracking-[2px] text-[#C9A96E]" style={sans}>
          {eyebrow}
        </span>
        {center && <span className="h-px w-7 bg-[#C9A96E]" />}
      </div>
      <h2 className="max-w-[760px] text-[36px] leading-[1.1] text-white sm:text-[44px]" style={serif}>
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-[620px] text-[15px] leading-[1.55] text-[#9a9a9a]" style={sans}>
          {subtitle}
        </p>
      )}
    </div>
  )
}

const OFFER_ICONS = [Car, MapPinned, Crown, PartyPopper, Heart, Gem]

export function HotelsOffers() {
  const t = useTranslations("hotels.offers")
  const items = t.raw("items") as string[]
  return (
    <section className="bg-[#0b0b0b] px-4 py-16 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-[1280px]">
        <SectionHeader eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {items.map((label, i) => {
            const Icon = OFFER_ICONS[i % OFFER_ICONS.length] ?? Car
            return (
              <div
                key={label}
                className="group flex flex-col items-center gap-4 border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] px-4 py-7 text-center transition-colors hover:border-[rgba(201,169,110,0.4)] hover:bg-[rgba(201,169,110,0.05)]"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(201,169,110,0.3)] text-[#C9A96E] transition-colors group-hover:bg-[rgba(201,169,110,0.1)]">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </span>
                <span className="text-[13px] font-medium leading-tight text-[#cfc9bf]" style={sans}>
                  {label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function HotelsWhy() {
  const t = useTranslations("hotels.why")
  const items = t.raw("items") as { q: string; a: string }[]
  return (
    <section className="bg-[#0D0D0D] px-4 py-16 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-[1280px]">
        <SectionHeader eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.08)] md:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <div key={it.q} className="flex flex-col gap-3 bg-[#0D0D0D] p-7 transition-colors hover:bg-[#121009]">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(201,169,110,0.1)] text-[#C9A96E]">
                <Check className="h-[18px] w-[18px]" strokeWidth={2} />
              </span>
              <h3 className="text-[18px] font-semibold text-white" style={sans}>
                {it.q}
              </h3>
              <p className="text-[14px] leading-[1.55] text-[#9a9a9a]" style={sans}>
                {it.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function HotelsHow() {
  const t = useTranslations("hotels.how")
  const steps = t.raw("steps") as { title: string; body: string }[]
  return (
    <section className="bg-[#0b0b0b] px-4 py-16 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-[1180px]">
        <SectionHeader eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-6">
          {steps.map((s, i) => (
            <div key={s.title} className="relative flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <span className="text-[44px] leading-none text-[#C9A96E]" style={serif}>
                  0{i + 1}
                </span>
                <span className="h-px flex-1 bg-[rgba(201,169,110,0.25)]" />
              </div>
              <h3 className="text-[22px] text-white" style={serif}>
                {s.title}
              </h3>
              <p className="text-[14px] leading-[1.6] text-[#9a9a9a]" style={sans}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function HotelsCta() {
  const t = useTranslations("hotels.ctaFinal")
  return (
    <section className="relative overflow-hidden bg-[#0D0D0D] px-4 py-20 lg:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(201,169,110,0.10), transparent 70%)" }}
      />
      <div className="relative mx-auto flex max-w-[760px] flex-col items-center gap-5 text-center">
        <span className="text-[11px] font-semibold uppercase tracking-[2px] text-[#C9A96E]" style={sans}>
          {t("eyebrow")}
        </span>
        <h2 className="text-[40px] leading-[1.1] text-white sm:text-[52px]" style={serif}>
          {t("title")}
        </h2>
        <p className="max-w-[520px] text-[16px] leading-[1.55] text-[#9a9a9a]" style={sans}>
          {t("subtitle")}
        </p>
        <Link
          href="#candidatura"
          className="mt-3 inline-flex h-[54px] items-center justify-center gap-2 bg-[#C9A96E] px-9 text-[14px] font-semibold uppercase tracking-[1.2px] text-[#1a1510] transition-colors hover:bg-[#d4b87f]"
          style={sans}
        >
          {t("button")} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}
