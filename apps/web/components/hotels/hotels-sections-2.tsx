"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { Check, Quote, ArrowRight } from "lucide-react"

const sans = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const
const serif = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const

function Header({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <div className="flex items-center gap-2">
        <span className="h-px w-7 bg-[#C9A96E]" />
        <span className="text-[11px] font-semibold uppercase tracking-[2px] text-[#C9A96E]" style={sans}>{eyebrow}</span>
        <span className="h-px w-7 bg-[#C9A96E]" />
      </div>
      <h2 className="max-w-[760px] text-[36px] leading-[1.1] text-white sm:text-[44px]" style={serif}>{title}</h2>
      {subtitle && <p className="max-w-[620px] text-[15px] leading-[1.55] text-[#9a9a9a]" style={sans}>{subtitle}</p>}
    </div>
  )
}

export function HotelsFounders() {
  const t = useTranslations("hotels.founders")
  return (
    <section className="bg-[#0D0D0D] px-4 py-16 lg:px-12 lg:py-24">
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[4/3] w-full overflow-hidden border border-[rgba(201,169,110,0.2)]">
          <Image src="/aboutus_team.png" alt="LuxMotion" fill className="object-cover" sizes="(min-width:1024px) 50vw, 100vw" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <span className="h-px w-7 bg-[#C9A96E]" />
            <span className="text-[11px] font-semibold uppercase tracking-[2px] text-[#C9A96E]" style={sans}>{t("eyebrow")}</span>
          </div>
          <h2 className="text-[38px] leading-[1.1] text-white sm:text-[46px]" style={serif}>{t("title")}</h2>
          <p className="text-[15px] leading-[1.6] text-[#9a9a9a]" style={sans}>{t("body")}</p>
          <div className="mt-2 border-l-2 border-[#C9A96E] pl-5">
            <Quote className="mb-2 h-6 w-6 text-[#C9A96E]" />
            <p className="text-[22px] leading-[1.35] text-white" style={serif}>{t("quote")}</p>
            <p className="mt-2 text-[12px] font-semibold uppercase tracking-[1.5px] text-[#C9A96E]" style={sans}>{t("quoteRole")}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export function HotelsEarnings() {
  const t = useTranslations("hotels.earnings")
  const tiers = t.raw("tiers") as { name: string; rate: string; desc: string }[]
  const [reservas, setReservas] = useState(40)
  const [ticket, setTicket] = useState(120)
  const rate = 0.12
  const revenue = Math.round(reservas * ticket * rate)

  return (
    <section className="bg-[#0b0b0b] px-4 py-16 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-[1180px]">
        <Header eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          {tiers.map((tier, i) => (
            <div key={tier.name} className={`flex flex-col gap-3 border p-7 ${i === 1 ? "border-[#C9A96E] bg-[rgba(201,169,110,0.05)]" : "border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)]"}`}>
              <span className="text-[12px] font-semibold uppercase tracking-[1.5px] text-[#C9A96E]" style={sans}>{tier.name}</span>
              <span className="text-[44px] leading-none text-white" style={serif}>{tier.rate}</span>
              <p className="text-[14px] leading-[1.5] text-[#9a9a9a]" style={sans}>{tier.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 items-center gap-8 border border-[rgba(201,169,110,0.2)] bg-[#13110d] p-7 lg:grid-cols-[1fr_auto] lg:gap-12 lg:p-10">
          <div className="flex flex-col gap-7">
            <div>
              <h3 className="text-[26px] leading-none text-white" style={serif}>{t("calcTitle")}</h3>
              <p className="mt-2 text-[14px] text-[#9a9a9a]" style={sans}>{t("calcSubtitle")}</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-[13px]" style={sans}>
                <span className="text-[#bdb7ad]">{t("calcReservas")}</span>
                <span className="font-semibold text-[#C9A96E]">{reservas}</span>
              </div>
              <input type="range" min={5} max={400} step={5} value={reservas} onChange={(e) => setReservas(+e.target.value)} className="budget-slider w-full" style={{ background: `linear-gradient(to right, #C9A96E ${(reservas / 400) * 100}%, rgba(255,255,255,0.12) ${(reservas / 400) * 100}%)` }} />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-[13px]" style={sans}>
                <span className="text-[#bdb7ad]">{t("calcTicket")}</span>
                <span className="font-semibold text-[#C9A96E]">€{ticket}</span>
              </div>
              <input type="range" min={20} max={500} step={10} value={ticket} onChange={(e) => setTicket(+e.target.value)} className="budget-slider w-full" style={{ background: `linear-gradient(to right, #C9A96E ${((ticket - 20) / 480) * 100}%, rgba(255,255,255,0.12) ${((ticket - 20) / 480) * 100}%)` }} />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 border-t border-[rgba(255,255,255,0.1)] pt-6 text-center lg:min-w-[260px] lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
            <span className="text-[11px] font-semibold uppercase tracking-[1.5px] text-[#8c8680]" style={sans}>{t("calcResult")}</span>
            <span className="text-[52px] leading-none text-[#C9A96E]" style={serif}>€{revenue.toLocaleString("pt-PT")}</span>
            <span className="text-[12px] text-[#8c8680]" style={sans}>{t("calcRate")}: 12%</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export function HotelsPlans() {
  const t = useTranslations("hotels.plans")
  const items = t.raw("items") as { name: string; price: string; period: string; features: string[]; cta: string; highlight: boolean }[]
  return (
    <section className="bg-[#0D0D0D] px-4 py-16 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-[1180px]">
        <Header eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {items.map((p) => (
            <div key={p.name} className={`flex flex-col gap-5 border p-8 ${p.highlight ? "border-[#C9A96E] bg-[rgba(201,169,110,0.05)]" : "border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)]"}`}>
              {p.highlight && <span className="w-fit bg-[#C9A96E] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[1.5px] text-[#1a1510]" style={sans}>Popular</span>}
              <span className="text-[13px] font-semibold uppercase tracking-[1.5px] text-[#C9A96E]" style={sans}>{p.name}</span>
              <div className="flex items-end gap-1">
                <span className="text-[40px] leading-none text-white" style={serif}>{p.price}</span>
                <span className="pb-1 text-[13px] text-[#8c8680]" style={sans}>{p.period}</span>
              </div>
              <ul className="flex flex-col gap-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[14px] text-[#bdb7ad]" style={sans}>
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#C9A96E]" strokeWidth={2} />{f}
                  </li>
                ))}
              </ul>
              <Link href="#candidatura" className={`mt-auto flex h-12 items-center justify-center gap-2 text-[13px] font-semibold uppercase tracking-[1px] transition-colors ${p.highlight ? "bg-[#C9A96E] text-[#1a1510] hover:bg-[#d4b87f]" : "border border-[rgba(201,169,110,0.4)] text-[#C9A96E] hover:bg-[rgba(201,169,110,0.08)]"}`} style={sans}>
                {p.cta} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function HotelsFleet() {
  const t = useTranslations("hotels.fleet")
  const names = t.raw("names") as string[]
  return (
    <section className="bg-[#0b0b0b] px-4 py-16 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-[1280px]">
        <Header eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {names.map((name, i) => (
            <div key={name} className="group overflow-hidden border border-[rgba(255,255,255,0.1)] bg-[#141414] transition-colors hover:border-[rgba(201,169,110,0.4)]">
              <div className="relative aspect-[16/10] w-full bg-[#0d0d0d]">
                <Image src={`/fleet/car${(i % 7) + 1}.webp`} alt={name} fill className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.04]" sizes="(min-width:1024px) 33vw, 50vw" />
              </div>
              <div className="border-t border-[rgba(255,255,255,0.08)] px-5 py-4">
                <span className="text-[16px] text-white" style={serif}>{name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function HotelsResults() {
  const t = useTranslations("hotels.results")
  const stats = t.raw("stats") as string[][]
  return (
    <section className="relative overflow-hidden border-y border-[rgba(201,169,110,0.15)] bg-[#0D0D0D] px-4 py-16 lg:px-12 lg:py-20">
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(60% 100% at 50% 0%, rgba(201,169,110,0.06), transparent 70%)" }} />
      <div className="relative mx-auto max-w-[1180px]">
        <Header eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
        <div className="mt-12 grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-1 text-center">
              <span className="text-[46px] leading-none text-[#C9A96E]" style={serif}>{s[0]}</span>
              <span className="text-[12px] font-medium uppercase tracking-[1px] text-[#9a9a9a]" style={sans}>{s[1]}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
