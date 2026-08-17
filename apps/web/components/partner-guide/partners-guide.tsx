"use client"

import { HeroSlider } from "./hero-slider"
import { useTranslations } from "next-intl"
import {
  Check, ArrowRight, Star, LayoutGrid,
} from "lucide-react"
import { Testimonials } from "@/components/new-landing-page/testimonials"
import { FeatureBar } from "./client-guide"
import { Reveal } from "@/components/common/reveal"

const sans = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const
const serif = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const

const card = "mx-auto w-full overflow-hidden border border-[rgba(255,255,255,0.12)] bg-[#15130e] shadow-[0_30px_70px_-32px_rgba(0,0,0,0.85)]"

type PStep = { tag: string; title: string; accent: string; body: string[]; bullets?: string[]; noteLabel: string; note: string; button?: string }

/* ----------------------------------- hero ---------------------------------- */

function PartnersHero({ t }: { t: ReturnType<typeof useTranslations> }) {
  const stats = t.raw("stats") as string[][]
  return (
    <section className="relative overflow-hidden bg-[#0D0D0D] px-4 py-12 lg:px-12 lg:py-16">
      <div aria-hidden className="pointer-events-none absolute -right-32 top-10 h-[520px] w-[520px] rounded-full" style={{ background: "radial-gradient(circle, rgba(201,169,110,0.10), transparent 65%)" }} />
      <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-8 lg:grid-cols-[1.04fr_0.96fr]">
        <div className="flex flex-col gap-6">
          <span className="w-fit border border-[rgba(201,169,110,0.4)] bg-[rgba(201,169,110,0.05)] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[1.5px] text-[#C9A96E]" style={sans}>
            {t("eyebrow")}
          </span>
          <h1 className="text-[44px] leading-[1.03] text-white sm:text-[58px]" style={serif}>
            {t("titlePrefix")}<br />
            <span className="italic text-[#C9A96E]">{t("titleAccent")}</span>
          </h1>
          <p className="max-w-[560px] text-[16px] leading-[1.55] text-[#9a9a9a]" style={sans}>{t("subtitle")}</p>
          <p className="flex items-center gap-3 text-[12px] font-medium uppercase tracking-[1.4px] text-[#C9A96E]" style={{ ...sans, fontStyle: "italic" }}>
            <span className="h-px w-7 bg-[#C9A96E]" /> {t("note")}
          </p>
          <div className="mt-2 grid grid-cols-2 border border-[rgba(201,169,110,0.18)] sm:grid-cols-4">
            {stats.map((s, i) => {
              const star = s[0]?.includes("★")
              return (
                <div key={i} className="flex flex-col gap-1 border-[rgba(255,255,255,0.08)] px-4 py-4 [&:not(:first-child)]:border-l">
                  <span className="flex items-center gap-1 text-[26px] leading-none text-[#dcc99e]" style={serif}>
                    {star ? s[0]!.replace("★", "") : s[0]}
                    {star && <Star className="h-4 w-4 text-[#C9A96E]" fill="#C9A96E" strokeWidth={0} />}
                  </span>
                  <span className="text-[10.5px] leading-tight text-[#8c8680]" style={sans}>{s[1]}</span>
                </div>
              )
            })}
          </div>
        </div>
        <HeroSlider className="order-first lg:order-none relative h-[300px] sm:h-[400px] lg:h-[480px]" />
      </div>
    </section>
  )
}

/* ------------------------------- step mockups ------------------------------- */

function ContractMockup() {
  return (
    <div className={`${card} max-w-[330px] p-6`}>
      <p className="text-[13px] text-[#d8d3c8]" style={serif}>
        Partnership Agreement · <span className="text-[#9a9a9a]">LuxMotion</span>
      </p>
      <div className="mt-5 space-y-2.5">
        {[92, 96, 70, 88, 62].map((w, i) => (
          <div key={i} className="h-2 rounded-sm bg-[rgba(255,255,255,0.07)]" style={{ width: `${w}%` }} />
        ))}
      </div>
      <div className="mt-7">
        <span className="text-[8px] font-semibold uppercase tracking-[1.5px] text-[#C9A96E]" style={sans}>Partner signature</span>
        <p className="mt-1.5 text-[15px] italic text-[#cfc9bf]" style={serif}>Hotel Manager</p>
        <div className="mt-2 h-px w-full bg-[rgba(255,255,255,0.12)]" />
      </div>
      <button type="button" className="mt-5 flex w-full items-center justify-center gap-1.5 bg-[#C9A96E] py-2.5 text-[9.5px] font-semibold uppercase tracking-[1px] text-[#1a1510]" style={sans}>
        Sign &amp; activate partnership <ArrowRight className="h-3 w-3" />
      </button>
    </div>
  )
}

function DashboardMockup() {
  const stats: [string, string][] = [["14", "Bookings today"], ["6", "In transit"], ["€2.4k", "This month"], ["4.9", "Avg rating"]]
  return (
    <div className={`${card} max-w-[400px]`}>
      <div className="flex items-center gap-2 border-b border-[rgba(255,255,255,0.07)] bg-[#1c1a14] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#e0726a]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#e0c14e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#5bbd6b]" />
        <span className="ml-3 h-3.5 flex-1 rounded bg-[rgba(255,255,255,0.06)]" />
      </div>
      <div className="p-5">
        <div className="grid grid-cols-2 gap-3">
          {stats.map(([v, l]) => (
            <div key={l} className="border border-[rgba(255,255,255,0.08)] px-3.5 py-3">
              <p className="text-[19px] leading-none text-[#C9A96E]" style={serif}>{v}</p>
              <p className="mt-1.5 text-[7.5px] font-medium uppercase tracking-[0.8px] text-[#8c8680]" style={sans}>{l}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-2 w-3/4 rounded-sm bg-[rgba(255,255,255,0.06)]" />
          <div className="h-2 w-1/2 rounded-sm bg-[rgba(255,255,255,0.06)]" />
        </div>
        <div className="mt-4 flex items-end gap-1.5">
          {[34, 28, 24, 40, 32, 46, 38].map((h, i) => (
            <div key={i} className="flex-1 bg-[rgba(255,255,255,0.05)]" style={{ height: `${h}px` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

function ConfirmMockup() {
  return (
    <div className={`${card} max-w-[360px]`}>
      <div className="border-b border-[rgba(255,255,255,0.08)] px-5 py-4">
        <p className="text-[9px] text-[#8c8680]" style={sans}>From: concierge@hotelexample.com</p>
        <p className="mt-1.5 flex items-center gap-1.5 text-[13px] font-semibold text-white" style={sans}>
          Your airport transfer is confirmed <Check className="h-3.5 w-3.5 text-[#5bbd6b]" strokeWidth={3} />
        </p>
      </div>
      <div className="px-5 py-5">
        <p className="text-[14px] text-[#d8d3c8]" style={serif}>Dear Mr. Williams,</p>
        <div className="mt-3 space-y-2">
          <div className="h-2 w-[78%] rounded-sm bg-[rgba(255,255,255,0.06)]" />
          <div className="h-2 w-[60%] rounded-sm bg-[rgba(255,255,255,0.06)]" />
        </div>
        <div className="mt-4 border border-[rgba(201,169,110,0.25)] bg-[rgba(201,169,110,0.05)] p-3.5">
          <span className="text-[8px] font-semibold uppercase tracking-[1px] text-[#C9A96E]" style={sans}>Your transfer</span>
          <p className="mt-1.5 text-[12px] text-white" style={sans}>Faro Airport → Bela Vista Hotel</p>
          <p className="mt-0.5 text-[10px] text-[#9a9a9a]" style={sans}>Thu 26 Mar · 14:30 · Mercedes E-Class</p>
        </div>
        <div className="mt-4">
          <div className="h-2 w-[70%] rounded-sm bg-[rgba(255,255,255,0.06)]" />
        </div>
        <button type="button" className="mt-5 flex w-full items-center justify-center gap-1.5 bg-[#C9A96E] py-2.5 text-[9.5px] font-semibold uppercase tracking-[1px] text-[#1a1510]" style={sans}>
          Track your transfer <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}

function TabletsMockup() {
  const tablet = "rounded-[18px] border border-[rgba(201,169,110,0.18)] bg-[#161616] p-2 shadow-[0_45px_75px_-32px_rgba(0,0,0,0.92)]"
  return (
    <div className="flex items-start justify-center py-2">
      {/* tour offer — left, lower, tilted clockwise */}
      <div className={`relative z-10 mt-14 -mr-4 w-[182px] shrink-0 rotate-[8deg] ${tablet}`}>
        <div className="overflow-hidden rounded-[12px] bg-[#0d0d0d]">
          <div className="flex h-[88px] items-center justify-center bg-gradient-to-br from-[#1c3a2a] to-[#0f1a14]">
            <p className="text-[7px] font-medium uppercase tracking-[1.2px] text-[rgba(255,255,255,0.4)]" style={sans}>Tour offer</p>
          </div>
          <div className="p-4">
            <div className="space-y-2">
              <div className="h-1.5 w-3/4 rounded bg-[rgba(255,255,255,0.07)]" />
              <div className="h-1.5 w-1/2 rounded bg-[rgba(255,255,255,0.05)]" />
            </div>
            <div className="mt-4 bg-[#C9A96E] py-2 text-center text-[6.5px] font-semibold uppercase tracking-[0.5px] text-[#1a1510]" style={sans}>View tours</div>
            <div className="mt-4 space-y-2">
              <div className="h-1.5 w-2/3 rounded bg-[rgba(255,255,255,0.05)]" />
              <div className="h-1.5 w-1/2 rounded bg-[rgba(255,255,255,0.05)]" />
            </div>
          </div>
        </div>
      </div>
      {/* email preview — right, higher, tilted counter-clockwise */}
      <div className={`relative z-0 w-[182px] shrink-0 -rotate-[8deg] ${tablet}`}>
        <div className="overflow-hidden rounded-[12px] bg-[#0d0d0d] p-4">
          <div className="h-1.5 w-2/5 rounded bg-[rgba(201,169,110,0.4)]" />
          <p className="mt-5 text-center text-[7px] font-medium uppercase tracking-[1.2px] text-[rgba(255,255,255,0.32)]" style={sans}>Email preview</p>
          <div className="mt-4 space-y-2">
            <div className="h-1.5 w-3/4 rounded bg-[rgba(255,255,255,0.06)]" />
            <div className="h-1.5 w-3/5 rounded bg-[rgba(255,255,255,0.06)]" />
          </div>
          <div className="mt-4 bg-[#C9A96E] py-2 text-center text-[6.5px] font-semibold uppercase tracking-[0.5px] text-[#1a1510]" style={sans}>Book transfer</div>
          <div className="mt-4 space-y-2">
            <div className="h-1.5 w-2/3 rounded bg-[rgba(255,255,255,0.05)]" />
            <div className="h-1.5 w-1/2 rounded bg-[rgba(255,255,255,0.05)]" />
            <div className="h-1.5 w-3/5 rounded bg-[rgba(255,255,255,0.05)]" />
          </div>
        </div>
      </div>
    </div>
  )
}

function FlyerMockup() {
  return (
    <div className="mx-auto w-full max-w-[360px] overflow-hidden border border-[rgba(201,169,110,0.18)] bg-[#0d0d0d] shadow-[0_40px_80px_-35px_rgba(0,0,0,0.9)]">
      <div className="relative h-[150px] bg-gradient-to-br from-[#0d100d] via-[#152e1d] to-[#1c3d26]">
        <span className="absolute bottom-0 left-5 translate-y-1/2 whitespace-nowrap bg-[#C9A96E] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.8px] text-[#1a1510]" style={sans}>
          LuxMotion · Private transfer
        </span>
      </div>
      <div className="px-5 pb-5 pt-9">
        <p className="text-[20px] leading-none text-white" style={serif}>LuxMotion</p>
        <div className="mt-2.5 flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 text-[#C9A96E]" fill="#C9A96E" strokeWidth={0} />
          ))}
        </div>
        <div className="mt-3 space-y-2">
          <div className="h-1.5 w-3/4 rounded bg-[rgba(255,255,255,0.07)]" />
          <div className="h-1.5 w-3/5 rounded bg-[rgba(255,255,255,0.06)]" />
        </div>
        <div className="mt-3.5 flex h-[68px] items-center justify-center bg-[rgba(255,255,255,0.035)]">
          <div className="h-8 w-28 border border-[rgba(201,169,110,0.3)] bg-[rgba(201,169,110,0.05)]" />
        </div>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <span className="text-[9px] font-medium uppercase tracking-[1.2px] text-[#8c8680]" style={sans}>From</span>
            <p className="mt-1 text-[22px] leading-none text-[#C9A96E]" style={serif}>€25</p>
          </div>
          <span className="flex h-10 w-10 items-center justify-center border border-[rgba(255,255,255,0.14)]">
            <LayoutGrid className="h-4 w-4 text-[#C9A96E]" strokeWidth={1.5} />
          </span>
        </div>
        <button type="button" className="mt-4 flex w-full items-center justify-center gap-2 bg-[#C9A96E] py-3 text-[10px] font-semibold uppercase tracking-[1px] text-[#1a1510]" style={sans}>
          Book your transfer <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

function ScriptMockup() {
  const lines: [string, boolean][] = [
    ["“Good morning! Are you planning to travel to or from the airport during your stay?”", false],
    ["“We work with a private chauffeur service — fixed price, no surge, guaranteed punctuality.”", true],
    ["“Most guests book it for peace of mind. It's the same price as a taxi, but with a Mercedes.”", false],
    ["“You can book directly here — it takes under a minute.”", false],
  ]
  return (
    <div className={`${card} max-w-[340px] p-5`}>
      <span className="text-[10px] text-[#bdb7ad]" style={serif}>Reception Script · English</span>
      <div className="mt-4 flex flex-col gap-2">
        {lines.map(([txt, hl], i) => (
          <div
            key={i}
            className={`px-3 py-2 text-[9.5px] leading-[1.4] ${hl ? "border-l-2 border-[#C9A96E] bg-[rgba(201,169,110,0.08)] text-[#e3d8c2]" : "bg-[rgba(255,255,255,0.03)] text-[#9a9a9a]"}`}
            style={sans}
          >
            {txt}
          </div>
        ))}
      </div>
      <div className="mt-4 border-l-2 border-[#C9A96E] bg-[rgba(201,169,110,0.06)] px-3 py-2.5" style={sans}>
        <p className="text-[8px] font-semibold uppercase tracking-[1px] text-[#C9A96E]">Conversion note</p>
        <p className="mt-1 text-[9px] leading-[1.4] text-[#b8b3a9]">When offered at check-in, 23% of guests book on the spot. Highest conversion: airport pickup requests.</p>
      </div>
    </div>
  )
}

const MOCKUPS = [ContractMockup, DashboardMockup, ConfirmMockup, TabletsMockup, FlyerMockup, ScriptMockup]

function PartnerStepRow({ step, index }: { step: PStep; index: number }) {
  const Mockup = MOCKUPS[index] ?? ContractMockup
  const textFirst = index % 2 === 0
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <div className={`flex flex-col justify-center bg-[#0b0b0b] px-7 py-14 md:px-12 md:py-16 ${textFirst ? "" : "lg:order-2"}`}>
        <div className="relative flex flex-col gap-4">
          <span className="pointer-events-none absolute -top-11 left-0 select-none text-[88px] leading-none text-[rgba(201,169,110,0.08)]" style={serif}>
            0{index + 1}
          </span>
          <span className="relative text-[11px] font-semibold uppercase tracking-[2px] text-[#C9A96E]" style={sans}>{step.tag}</span>
          <h3 className="text-[30px] leading-[1.14] text-white sm:text-[36px]" style={serif}>
            {step.title} <span className="italic text-[#C9A96E]">{step.accent}</span>
          </h3>
          <div className="flex max-w-[480px] flex-col gap-3">
            {step.body.map((p, i) => (
              <p key={i} className="text-[14.5px] leading-[1.6] text-[#9a9a9a]" style={sans}>{p}</p>
            ))}
          </div>
          {step.bullets && (
            <ul className="flex max-w-[480px] flex-col gap-2.5">
              {step.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-[13.5px] text-[#cfc9bf]" style={sans}>
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#C9A96E]" strokeWidth={2} />{b}
                </li>
              ))}
            </ul>
          )}
          <p className="mt-1 max-w-[480px] border-l-2 border-[#C9A96E] bg-[rgba(201,169,110,0.06)] px-4 py-3 text-[13px] leading-[1.5] text-[#cfc9bf]" style={sans}>
            <span className="font-semibold text-[#C9A96E]">{step.noteLabel}</span> {step.note}
          </p>
        </div>
      </div>
      <div className={`relative flex items-center justify-center overflow-hidden bg-[#141414] px-7 py-14 md:px-10 md:py-16 ${textFirst ? "" : "lg:order-1"}`}>
        <span aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(201,169,110,0.08) 0%, rgba(201,169,110,0) 65%)" }} />
        <div className="relative z-[1] w-full"><Mockup /></div>
      </div>
    </div>
  )
}

/* --------------------------------- export ---------------------------------- */

export function PartnersGuide() {
  const t = useTranslations("partnerGuide.partners")
  const tc = useTranslations("partnerGuide.clients")
  const steps = t.raw("steps") as PStep[]
  const features = tc.raw("features") as string[]

  return (
    <>
      <PartnersHero t={t} />
      <FeatureBar features={features} />
      <section id="guide-steps" className="bg-[#0b0b0b] py-16 lg:py-20">
        <div className="mx-auto max-w-[1280px]">
          {steps.map((s, i) => (
            <Reveal key={i}>
              <PartnerStepRow step={s} index={i} />
            </Reveal>
          ))}
        </div>
      </section>
      <Testimonials />
    </>
  )
}
