"use client"

import { HeroSlider } from "./hero-slider"
import Link from "next/link"
import { useTranslations } from "next-intl"
import {
  Check, ArrowRight, Info, ShieldCheck, MessageSquare, Clock, Headphones,
  Plane, UserCheck,
} from "lucide-react"
import { Testimonials } from "@/components/new-landing-page/testimonials"
import { Reveal } from "@/components/common/reveal"

const sans = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const
const serif = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const

type Step = { tag: string; title: string; accent: string; body: string[]; noteLabel: string; note: string }
type Comm = { title: string; body: string }

/* ----------------------------------- hero ---------------------------------- */

function ClientHero({ t }: { t: ReturnType<typeof useTranslations> }) {
  return (
    <section className="relative overflow-hidden bg-[#0D0D0D] px-4 py-12 lg:px-12 lg:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-0 h-[520px] w-[520px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(201,169,110,0.10), transparent 65%)" }}
      />
      <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-8 lg:grid-cols-[1.04fr_0.96fr]">
        <div className="flex flex-col gap-6">
          <span className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[2px] text-[#C9A96E]" style={sans}>
            <span className="h-px w-7 bg-[#C9A96E]" /> {t("eyebrow")}
          </span>
          <h1 className="text-[46px] leading-[1.04] text-white sm:text-[62px]" style={serif}>
            {t("titlePrefix")} <span className="italic text-[#C9A96E]">{t("titleAccent")}</span>{t("titleSuffix")}
          </h1>
          <p className="max-w-[560px] text-[16px] leading-[1.55] text-[#9a9a9a]" style={sans}>{t("subtitle")}</p>
          <p className="flex items-center gap-3 text-[12px] font-medium uppercase tracking-[1.4px] text-[#C9A96E]" style={{ ...sans, fontStyle: "italic" }}>
            <span className="h-px w-7 bg-[#C9A96E]" /> {t("note")}
          </p>
          <div className="mt-1 flex flex-wrap gap-3">
            <Link href="/#booking" className="group inline-flex h-[52px] items-center gap-2 bg-[#C9A96E] px-7 text-[12.5px] font-semibold uppercase tracking-[1.1px] text-[#1a1510] transition-colors hover:bg-[#d4b87f]" style={sans}>
              {t("ctaBook")} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a href="#guide-steps" className="inline-flex h-[52px] items-center gap-2 border border-[rgba(255,255,255,0.2)] px-7 text-[12.5px] font-semibold uppercase tracking-[1.1px] text-white transition-colors hover:border-[#C9A96E] hover:text-[#C9A96E]" style={sans}>
              {t("ctaHow")} <Info className="h-4 w-4" />
            </a>
          </div>
        </div>
        {/* Em ecrã largo a fotografia sai da grelha e encosta ao bordo, como
            no hero da página principal: lá é `absolute top-0 right-0` fora do
            contentor de 1280px, senão sobrava sempre uma faixa vazia à direita.
            A célula da grelha fica, vazia, a reservar a largura do texto. */}
        <HeroSlider
          className="order-first relative h-[330px] sm:h-[420px] lg:hidden"
          objectPosition="object-bottom"
        />
        <div className="hidden lg:block" aria-hidden />
      </div>

      <HeroSlider
        className="pointer-events-none absolute right-0 top-0 hidden h-full w-[46%] max-w-[850px] lg:block xl:w-[48%] 2xl:w-[50%]"
        objectPosition="object-bottom"
      />
    </section>
  )
}

/* -------------------------------- feature bar ------------------------------- */

const FEATURE_ICONS = [Check, ShieldCheck, MessageSquare, Clock, Headphones]

export function FeatureBar({ features }: { features: string[] }) {
  return (
    <div className="border-y border-[rgba(255,255,255,0.1)] bg-[#0b0b0b]">
      <div className="mx-auto flex max-w-[1280px] flex-col divide-y divide-[rgba(255,255,255,0.08)] px-4 lg:flex-row lg:divide-x lg:divide-y-0 lg:px-12">
        {features.map((f, i) => {
          const Icon = FEATURE_ICONS[i] ?? Check
          return (
            <span key={f} className="flex flex-1 items-center gap-2.5 py-4 text-[12.5px] leading-tight text-[#bdb7ad] lg:px-5 lg:first:pl-0 lg:last:pr-0" style={sans}>
              <Icon className="h-[18px] w-[18px] shrink-0 text-[#C9A96E]" strokeWidth={1.6} />
              {f}
            </span>
          )
        })}
      </div>
    </div>
  )
}

/* ------------------------------- step mockups ------------------------------- */

const card = "w-full overflow-hidden border border-[rgba(255,255,255,0.12)] bg-[#15130e] shadow-[0_30px_70px_-32px_rgba(0,0,0,0.85)]"
const fieldLabel = "text-[9px] font-semibold uppercase tracking-[1.2px] text-[#8c8680]"

function BookingMockup() {
  return (
    <div className={`${card} max-w-[440px]`}>
      <div className="flex items-center gap-2 border-b border-[rgba(255,255,255,0.08)] bg-[#1c1a14] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#C9A96E]/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-[rgba(255,255,255,0.18)]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[rgba(255,255,255,0.18)]" />
        <span className="ml-3 h-3.5 w-[150px] rounded bg-[rgba(255,255,255,0.06)]" />
      </div>
      <div className="flex flex-col gap-3 p-5">
        <div className="h-2.5 w-1/3 rounded bg-[rgba(201,169,110,0.4)]" />
        <div className="border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] px-4 py-2.5">
          <span className={fieldLabel} style={sans}>Pickup</span>
          <p className="mt-0.5 text-[14px] text-white" style={sans}>Faro Airport, T1</p>
        </div>
        <div className="border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] px-4 py-2.5">
          <span className={fieldLabel} style={sans}>Destination</span>
          <p className="mt-0.5 text-[14px] text-white" style={sans}>Hotel Bela Vista, Portimão</p>
        </div>
        <div className="mt-1 flex items-center justify-between border border-[rgba(201,169,110,0.3)] bg-[rgba(201,169,110,0.06)] px-4 py-3">
          <span className={fieldLabel} style={sans}>Your price</span>
          <span className="text-[18px] text-[#C9A96E]" style={serif}>€65</span>
        </div>
        <div className="h-2 w-2/3 rounded bg-[rgba(255,255,255,0.05)]" />
        <div className="h-2 w-1/2 rounded bg-[rgba(255,255,255,0.05)]" />
      </div>
    </div>
  )
}

function OrderSummaryMockup() {
  const rows: [string, string][] = [
    ["Service", "Private Transfer"],
    ["Route", "OPO → Douro Valley Hotel"],
    ["Vehicle", "Mercedes E-Class"],
    ["Passengers", "2 Adults"],
    ["Date", "26 Mar 2026 · 14:30"],
    ["Welcome Pack", "+€25"],
  ]
  return (
    <div className={`${card} max-w-[380px] p-6`}>
      <h4 className="text-[18px] text-white" style={serif}>Order Summary</h4>
      <div className="mt-3 flex flex-col">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between border-t border-[rgba(255,255,255,0.07)] py-2.5 text-[12.5px]" style={sans}>
            <span className="text-[#8c8680]">{k}</span>
            <span className="text-right text-white">{v}</span>
          </div>
        ))}
        <div className="mt-1 flex items-center justify-between border-t border-[rgba(201,169,110,0.3)] pt-3.5">
          <span className="text-[11px] font-semibold uppercase tracking-[1px] text-[#8c8680]" style={sans}>Total</span>
          <span className="text-[22px] text-[#C9A96E]" style={serif}>€140</span>
        </div>
      </div>
    </div>
  )
}

function FlightMockup() {
  return (
    <div className={`${card} max-w-[400px] p-6`}>
      <div className="flex items-center justify-between">
        <span className="text-[19px] text-white" style={serif}>TP 351</span>
        <span className="border border-[rgba(76,175,80,0.4)] bg-[rgba(76,175,80,0.15)] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[1px] text-[#81c784]" style={sans}>On time</span>
      </div>
      <div className="mt-5 flex items-center justify-between">
        <div>
          <p className="text-[26px] leading-none text-white" style={serif}>LHR</p>
          <p className="mt-1 text-[11px] text-[#8c8680]" style={sans}>10:15</p>
        </div>
        <div className="flex flex-1 items-center px-4">
          <span className="h-px flex-1 bg-[rgba(255,255,255,0.15)]" />
          <Plane className="mx-1 h-4 w-4 -rotate-45 text-[#C9A96E]" />
          <span className="h-px flex-1 bg-[rgba(255,255,255,0.15)]" />
        </div>
        <div className="text-right">
          <p className="text-[26px] leading-none text-white" style={serif}>LIS</p>
          <p className="mt-1 text-[11px] text-[#8c8680]" style={sans}>13:45</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between text-[10px] text-[#8c8680]" style={sans}>
        <span>Departed</span><span>85% complete</span><span>Est. on time</span>
      </div>
      <div className="mt-1.5 h-1 w-full rounded-full bg-[rgba(255,255,255,0.08)]">
        <div className="h-1 w-[85%] rounded-full bg-[#C9A96E]" />
      </div>
      <div className="mt-5 border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] p-3.5">
        <span className={fieldLabel} style={sans}>Your chauffeur</span>
        <p className="mt-1 text-[12.5px] text-white" style={sans}>
          Miguel F. · Mercedes E-Class · <span className="text-[#C9A96E]">Tracking your flight</span>
        </p>
      </div>
    </div>
  )
}

function PaymentMockup() {
  return (
    <div className={`${card} max-w-[350px] p-6`}>
      <span className={fieldLabel} style={sans}>Payment method</span>
      <div className="mt-3 flex flex-wrap gap-2">
        {["VISA", "MC", "MB", "PayPal"].map((m) => (
          <span key={m} className="border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.03)] px-2.5 py-1.5 text-[10px] font-semibold tracking-[0.5px] text-[#cfc9bf]" style={sans}>{m}</span>
        ))}
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-2 w-full rounded bg-[rgba(255,255,255,0.05)]" />
        <div className="h-2 w-2/3 rounded bg-[rgba(255,255,255,0.05)]" />
      </div>
      <p className="mt-5 text-[26px] leading-none text-[#C9A96E]" style={serif}>€140</p>
      <button type="button" className="mt-4 flex w-full items-center justify-center gap-2 bg-[#C9A96E] py-3 text-[11px] font-semibold uppercase tracking-[1px] text-[#1a1510]" style={sans}>
        Pay securely <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

const MOCKUPS = [BookingMockup, OrderSummaryMockup, FlightMockup, PaymentMockup]

function StepRow({ step, index }: { step: Step; index: number }) {
  const Mockup = MOCKUPS[index] ?? BookingMockup
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
          <p className="mt-1 max-w-[480px] border-l-2 border-[#C9A96E] bg-[rgba(201,169,110,0.06)] px-4 py-3 text-[13px] leading-[1.5] text-[#cfc9bf]" style={sans}>
            <span className="font-semibold text-[#C9A96E]">{step.noteLabel}</span> {step.note}
          </p>
        </div>
      </div>
      <div className={`relative flex items-center justify-center overflow-hidden bg-[#141414] px-7 py-14 md:px-10 md:py-16 ${textFirst ? "" : "lg:order-1"}`}>
        <span aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(201,169,110,0.08) 0%, rgba(201,169,110,0) 65%)" }} />
        <div className="relative z-[1]"><Mockup /></div>
      </div>
    </div>
  )
}

/* ------------------------------ communication ------------------------------ */

function Phone({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[2.1rem] bg-[#1b1b1d] p-[6px] shadow-[0_55px_95px_-38px_rgba(0,0,0,0.95)] ring-1 ring-[rgba(255,255,255,0.07)] ${className}`}>
      <div className="relative overflow-hidden rounded-[1.75rem] bg-[#0c0c0d] px-3 pb-5 pt-7">
        <span aria-hidden className="absolute left-1/2 top-[9px] h-1 w-11 -translate-x-1/2 rounded-full bg-[#39393b]" />
        {children}
      </div>
    </div>
  )
}

function Bubble({ children, time, out }: { children: React.ReactNode; time: string; out?: boolean }) {
  return (
    <div
      className={`w-fit max-w-[88%] px-2.5 py-1.5 text-[9.5px] leading-[1.35] ${
        out ? "self-end bg-[#1f3d2c] text-[#e6f0e6]" : "self-start bg-[#2c2c30] text-[#d8d8da]"
      }`}
      style={sans}
    >
      {children}
      <span className="mt-1 block text-right text-[7px] text-[rgba(255,255,255,0.35)]">{time}</span>
    </div>
  )
}

function PhoneRow() {
  return (
    <div className="flex items-center gap-2">
      <span className="h-5 w-5 shrink-0 rounded-full bg-[rgba(255,255,255,0.06)]" />
      <span className="h-5 flex-1 rounded bg-[rgba(255,255,255,0.05)]" />
    </div>
  )
}

function PhoneMockups() {
  return (
    <div className="relative mx-auto h-[560px] w-full max-w-[560px] lg:mx-0">
      {/* back phone — closer, lower, tilted clockwise */}
      <Phone className="absolute left-[45%] top-[112px] z-0 hidden w-[204px] rotate-[6deg] sm:block">
        <div className="flex flex-col gap-2">
          <PhoneRow />
          <PhoneRow />
          <div className="my-0.5 flex h-[80px] items-center justify-center bg-[#16171a] px-3">
            <p className="text-center text-[6.5px] font-medium uppercase leading-[1.6] tracking-[0.6px] text-[rgba(255,255,255,0.3)]" style={sans}>
              Replace · Meet &amp; greet · Chauffeur holding sign · Arrival hall
            </p>
          </div>
          <div className="bg-[#C9A96E] px-2.5 py-2 text-center text-[9px] font-semibold text-[#1a1510]" style={sans}>
            Driver en route · 4 min away
          </div>
          <PhoneRow />
          <PhoneRow />
        </div>
      </Phone>

      {/* front phone — left, tilted counter-clockwise */}
      <Phone className="absolute left-1/2 top-[14px] z-10 w-[214px] -translate-x-1/2 -rotate-[6deg] sm:left-[2%] sm:translate-x-0">
        <div className="flex flex-col gap-2">
          <Bubble time="14:32"><span className="text-[#C9A96E]">🚗</span> Your LuxMotion transfer is confirmed!</Bubble>
          <div className="w-fit max-w-[88%] self-start border border-[rgba(76,175,80,0.4)] bg-[rgba(76,175,80,0.1)] px-2.5 py-1.5" style={sans}>
            <p className="text-[7.5px] font-semibold uppercase tracking-[0.8px] text-[#7ec488]">Booking confirmed</p>
            <p className="mt-0.5 text-[9.5px] text-[#d8d3c8]">Faro Airport → Vila Vita Parc</p>
          </div>
          <Bubble time="14:32">
            Driver: <span className="text-white">Miguel F.</span>
            <br />
            Vehicle: <span className="text-white">Mercedes E-Class</span>
            <br />
            Plate: <span className="text-white">XX-000-XX</span>
          </Bubble>
          <Bubble time="14:33" out>Perfect, thank you! 🙏</Bubble>
          <Bubble time="14:33">We&apos;re tracking your flight TP351. We&apos;ll alert you if anything changes ✅</Bubble>
        </div>
      </Phone>
    </div>
  )
}

const COMM_ICONS = [MessageSquare, Plane, UserCheck]

function Communication({ t }: { t: ReturnType<typeof useTranslations> }) {
  const comms = t.raw("comms") as Comm[]
  return (
    <section className="bg-[#141414] px-4 py-16 lg:px-12 lg:py-24">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <PhoneMockups />
        <div className="flex flex-col gap-5">
          <span className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[2px] text-[#C9A96E]" style={sans}>
            <span className="h-px w-7 bg-[#C9A96E]" /> {t("commsEyebrow")}
          </span>
          <h2 className="text-[38px] leading-[1.08] text-white sm:text-[46px]" style={serif}>
            {t("commsPrefix")} <span className="italic text-[#C9A96E]">{t("commsAccent")}</span>
          </h2>
          <p className="max-w-[520px] text-[15px] leading-[1.55] text-[#9a9a9a]" style={sans}>{t("commsSubtitle")}</p>
          <div className="mt-2 flex flex-col gap-3">
            {comms.map((c, i) => {
              const Icon = COMM_ICONS[i] ?? MessageSquare
              return (
                <div key={i} className="flex gap-4 border border-[rgba(201,169,110,0.2)] bg-[rgba(201,169,110,0.08)] p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-[rgba(201,169,110,0.3)] text-[#C9A96E]">
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
                  </span>
                  <div className="flex flex-col gap-1">
                    <p className="text-[15px] font-semibold text-white" style={sans}>{c.title}</p>
                    <p className="text-[13px] leading-[1.5] text-[#9a9a9a]" style={sans}>{c.body}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

/* --------------------------------- export ---------------------------------- */

export function ClientGuide() {
  const t = useTranslations("partnerGuide.clients")
  const steps = t.raw("steps") as Step[]
  const features = t.raw("features") as string[]

  return (
    <>
      <ClientHero t={t} />
      <FeatureBar features={features} />
      <section id="guide-steps" className="bg-[#0b0b0b] py-16 lg:py-20">
        <div className="mx-auto max-w-[1280px]">
          {steps.map((s, i) => (
            <Reveal key={i}>
              <StepRow step={s} index={i} />
            </Reveal>
          ))}
        </div>
      </section>
      <Reveal><Communication t={t} /></Reveal>
      <Testimonials />
    </>
  )
}
