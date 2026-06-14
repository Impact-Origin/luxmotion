"use client"

import { useState } from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { Check, ArrowRight, Download, MessageSquare, Plane, Sparkles } from "lucide-react"
import { Testimonials } from "@/components/new-landing-page/testimonials"

const sans = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const
const serif = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const

type Step = { tag: string; title: string; accent: string; body: string; note: string; cta?: string }
type Comm = { title: string; body: string }

function FeatureRow({ features }: { features: string[] }) {
  return (
    <div className="border-y border-[rgba(255,255,255,0.1)] bg-[#0b0b0b]">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 py-4 lg:px-12">
        {features.map((f) => (
          <span key={f} className="flex items-center gap-2 text-[13px] text-[#bdb7ad]" style={sans}>
            <Check className="h-4 w-4 shrink-0 text-[#C9A96E]" strokeWidth={2} />
            {f}
          </span>
        ))}
      </div>
    </div>
  )
}

function StepMockup() {
  return (
    <div className="relative w-full overflow-hidden border border-[rgba(255,255,255,0.1)] bg-[#121009] p-5">
      <span aria-hidden className="absolute right-0 top-0 h-16 w-16 bg-[radial-gradient(circle_at_top_right,rgba(201,169,110,0.18),transparent_70%)]" />
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-[#C9A96E]/70" />
        <span className="h-2 w-2 rounded-full bg-[rgba(255,255,255,0.18)]" />
        <span className="h-2 w-2 rounded-full bg-[rgba(255,255,255,0.18)]" />
      </div>
      <div className="mt-5 space-y-3">
        <div className="h-2.5 w-2/5 rounded bg-[rgba(201,169,110,0.45)]" />
        <div className="h-9 w-full rounded border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)]" />
        <div className="h-9 w-full rounded border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)]" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-9 rounded border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)]" />
          <div className="h-9 rounded border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)]" />
        </div>
        <div className="mt-1 h-10 w-full rounded bg-[#C9A96E]/85" />
      </div>
    </div>
  )
}

function GuideStep({ step, index }: { step: Step; index: number }) {
  const textFirst = index % 2 === 0
  const text = (
    <div className="flex flex-col gap-4">
      <span className="text-[11px] font-semibold uppercase tracking-[2px] text-[#C9A96E]" style={sans}>
        {step.tag}
      </span>
      <h3 className="text-[30px] leading-[1.12] text-white sm:text-[34px]" style={serif}>
        {step.title} <span className="italic text-[#C9A96E]">{step.accent}</span>
      </h3>
      <p className="max-w-[460px] text-[15px] leading-[1.6] text-[#9a9a9a]" style={sans}>
        {step.body}
      </p>
      <p className="w-fit border-l-2 border-[#C9A96E] bg-[rgba(201,169,110,0.06)] px-4 py-2 text-[13px] text-[#cfc9bf]" style={sans}>
        {step.note}
      </p>
      {step.cta && (
        <button className="mt-1 flex w-fit items-center gap-2 border border-[rgba(201,169,110,0.4)] px-5 py-3 text-[12px] font-semibold uppercase tracking-[1px] text-[#C9A96E] transition-colors hover:bg-[rgba(201,169,110,0.08)]" style={sans}>
          <Download className="h-4 w-4" /> {step.cta}
        </button>
      )}
    </div>
  )
  return (
    <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
      {textFirst ? (
        <>
          {text}
          <StepMockup />
        </>
      ) : (
        <>
          <div className="order-2 lg:order-1">
            <StepMockup />
          </div>
          <div className="order-1 lg:order-2">{text}</div>
        </>
      )}
    </div>
  )
}

function GuideCta({
  prefix,
  accent,
  subtitle,
  primary,
  primaryHref,
  secondary,
  onSecondary,
}: {
  prefix: string
  accent: string
  subtitle: string
  primary: string
  primaryHref: string
  secondary: string
  onSecondary: () => void
}) {
  return (
    <section className="relative overflow-hidden bg-[#0D0D0D] px-4 py-24">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-[360px] w-[680px] -translate-x-1/2 rounded-full" style={{ background: "radial-gradient(circle, rgba(201,169,110,0.10), transparent 70%)" }} />
      <div className="relative mx-auto flex max-w-[720px] flex-col items-center gap-5 text-center">
        <h2 className="text-[40px] leading-[1.1] text-white sm:text-[52px]" style={serif}>
          {prefix} <span className="italic text-[#C9A96E]">{accent}</span>
        </h2>
        <p className="max-w-[520px] text-[16px] leading-[1.55] text-[#9a9a9a]" style={sans}>
          {subtitle}
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
          <Link href={primaryHref} className="inline-flex h-[54px] items-center justify-center gap-2 bg-[#C9A96E] px-8 text-[14px] font-semibold uppercase tracking-[1.2px] text-[#1a1510] transition-colors hover:bg-[#d4b87f]" style={sans}>
            {primary} <ArrowRight className="h-4 w-4" />
          </Link>
          <button onClick={onSecondary} className="inline-flex h-[54px] items-center justify-center gap-2 border border-[rgba(255,255,255,0.2)] px-8 text-[14px] font-semibold uppercase tracking-[1.2px] text-white transition-colors hover:border-[#C9A96E] hover:text-[#C9A96E]" style={sans}>
            {secondary} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  )
}

function GuideHero({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-[#0D0D0D] px-4 py-16 lg:px-12 lg:py-20">
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-32 h-[460px] w-[460px] rounded-full" style={{ background: "radial-gradient(circle, rgba(201,169,110,0.10), transparent 65%)" }} />
      <div className="relative mx-auto max-w-[1280px]">{children}</div>
    </section>
  )
}

const COMM_ICONS = [MessageSquare, Plane, Sparkles]

function GuideClients({ onSwitch }: { onSwitch: () => void }) {
  const t = useTranslations("partnerGuide.clients")
  const tg = useTranslations("partnerGuide")
  const steps = t.raw("steps") as Step[]
  const comms = t.raw("comms") as Comm[]
  const features = tg.raw("features") as string[]

  return (
    <>
      <GuideHero>
        <div className="flex max-w-[680px] flex-col gap-5">
          <span className="text-[11px] font-semibold uppercase tracking-[2px] text-[#C9A96E]" style={sans}>{t("eyebrow")}</span>
          <h1 className="text-[44px] leading-[1.05] text-white sm:text-[60px]" style={serif}>
            {t("titlePrefix")} <span className="italic text-[#C9A96E]">{t("titleAccent")}</span>
          </h1>
          <p className="max-w-[560px] text-[16px] leading-[1.55] text-[#9a9a9a]" style={sans}>{t("subtitle")}</p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Link href="/#booking" className="inline-flex h-12 items-center gap-2 bg-[#C9A96E] px-6 text-[13px] font-semibold uppercase tracking-[1px] text-[#1a1510] transition-colors hover:bg-[#d4b87f]" style={sans}>{t("ctaBook")} <ArrowRight className="h-4 w-4" /></Link>
            <a href="#guide-steps" className="inline-flex h-12 items-center gap-2 border border-[rgba(255,255,255,0.2)] px-6 text-[13px] font-semibold uppercase tracking-[1px] text-white transition-colors hover:border-[#C9A96E] hover:text-[#C9A96E]" style={sans}>{t("ctaHow")}</a>
          </div>
          <p className="mt-2 flex items-center gap-2 text-[12px] uppercase tracking-[1px] text-[#8c8680]" style={sans}>
            <span className="h-1.5 w-1.5 rounded-full bg-[#C9A96E]" /> {t("note")}
          </p>
        </div>
      </GuideHero>

      <FeatureRow features={features} />

      <section id="guide-steps" className="bg-[#0b0b0b] px-4 py-16 lg:px-12 lg:py-24">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-20">
          {steps.map((s, i) => <GuideStep key={i} step={s} index={i} />)}
        </div>
      </section>

      <section className="bg-[#0D0D0D] px-4 py-16 lg:px-12 lg:py-20">
        <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <span className="text-[11px] font-semibold uppercase tracking-[2px] text-[#C9A96E]" style={sans}>{t("commsEyebrow")}</span>
            <h2 className="text-[36px] leading-[1.1] text-white sm:text-[44px]" style={serif}>{t("commsPrefix")} <span className="italic text-[#C9A96E]">{t("commsAccent")}</span></h2>
            <div className="mt-4 flex flex-col">
              {comms.map((c, i) => {
                const Icon = COMM_ICONS[i % COMM_ICONS.length] ?? MessageSquare
                return (
                  <div key={i} className="flex gap-4 border-t border-[rgba(255,255,255,0.08)] py-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(201,169,110,0.3)] text-[#C9A96E]"><Icon className="h-[18px] w-[18px]" strokeWidth={1.6} /></span>
                    <div className="flex flex-col gap-1">
                      <p className="text-[16px] font-semibold text-white" style={sans}>{c.title}</p>
                      <p className="text-[14px] leading-[1.5] text-[#9a9a9a]" style={sans}>{c.body}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <StepMockup />
        </div>
      </section>

      <Testimonials />
      <GuideCta prefix={t("ctaPrefix")} accent={t("ctaAccent")} subtitle={t("ctaSubtitle")} primary={t("ctaPrimary")} primaryHref="/#booking" secondary={t("ctaSecondary")} onSecondary={onSwitch} />
    </>
  )
}

function GuidePartners({ onSwitch }: { onSwitch: () => void }) {
  const t = useTranslations("partnerGuide.partners")
  const tg = useTranslations("partnerGuide")
  const steps = t.raw("steps") as Step[]
  const features = tg.raw("features") as string[]
  const stats = t.raw("stats") as string[][]

  return (
    <>
      <GuideHero>
        <div className="flex max-w-[760px] flex-col gap-5">
          <span className="text-[11px] font-semibold uppercase tracking-[2px] text-[#C9A96E]" style={sans}>{t("eyebrow")}</span>
          <h1 className="text-[44px] leading-[1.05] text-white sm:text-[60px]" style={serif}>
            {t("titlePrefix")} <span className="italic text-[#C9A96E]">{t("titleAccent")}</span>
          </h1>
          <p className="max-w-[600px] text-[16px] leading-[1.55] text-[#9a9a9a]" style={sans}>{t("subtitle")}</p>
          <p className="mt-1 flex items-center gap-2 text-[12px] uppercase tracking-[1px] text-[#8c8680]" style={sans}>
            <span className="h-1.5 w-1.5 rounded-full bg-[#C9A96E]" /> {t("note")}
          </p>
          <div className="mt-6 grid max-w-[680px] grid-cols-2 gap-6 border-t border-[rgba(255,255,255,0.1)] pt-7 sm:grid-cols-4">
            {stats.map((s, i) => (
              <div key={i} className="flex flex-col gap-1">
                <span className="text-[32px] leading-none text-white" style={serif}>{s[0]}</span>
                <span className="text-[11px] font-medium uppercase tracking-[0.5px] text-[#8c8680]" style={sans}>{s[1]}</span>
              </div>
            ))}
          </div>
        </div>
      </GuideHero>

      <FeatureRow features={features} />

      <section id="guide-steps" className="bg-[#0b0b0b] px-4 py-16 lg:px-12 lg:py-24">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-20">
          {steps.map((s, i) => <GuideStep key={i} step={s} index={i} />)}
        </div>
      </section>

      <Testimonials />
      <GuideCta prefix={t("ctaPrefix")} accent={t("ctaAccent")} subtitle={t("ctaSubtitle")} primary={t("ctaPrimary")} primaryHref="/hotels#candidatura" secondary={t("ctaSecondary")} onSecondary={onSwitch} />
    </>
  )
}

export function PartnerGuide() {
  const t = useTranslations("partnerGuide.tabs")
  const [tab, setTab] = useState<"clients" | "partners">("clients")

  return (
    <>
      <div className="sticky top-[60px] z-30 border-b border-[rgba(255,255,255,0.1)] bg-[#0D0D0D]/90 backdrop-blur lg:top-[72px]">
        <div className="mx-auto flex max-w-[1280px] items-center justify-center gap-2 px-4 py-3">
          {(["clients", "partners"] as const).map((key) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[1.2px] transition-colors ${
                tab === key ? "bg-[#C9A96E] text-[#1a1510]" : "text-[#9a9a9a] hover:text-white"
              }`}
              style={sans}
            >
              {t(key)}
            </button>
          ))}
        </div>
      </div>

      {tab === "clients" ? (
        <GuideClients onSwitch={() => setTab("partners")} />
      ) : (
        <GuidePartners onSwitch={() => setTab("clients")} />
      )}
    </>
  )
}
