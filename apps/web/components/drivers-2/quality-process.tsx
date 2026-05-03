"use client"

import {
  ArrowRight,
  CircleCheck,
  ClipboardCheck,
  FileText,
  Users,
  type LucideIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"

const SERIF_FONT = {
  fontFamily: "var(--font-title), 'Cormorant Garamond', serif",
} as const

const SANS_FONT = {
  fontFamily: "var(--font-sans), system-ui, sans-serif",
} as const

type Step = {
  num: string
  Icon: LucideIcon
  title: string
  body: string
}

function StepCard({ step }: { step: Step }) {
  const { Icon } = step
  return (
    <div className="snap-start bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] flex flex-col gap-3 p-6 w-[280px] lg:w-auto lg:flex-1 lg:basis-0 shrink-0">
      <p
        className="text-[48px] font-medium leading-[48px] text-[rgba(255,255,255,0.12)]"
        style={SERIF_FONT}
      >
        {step.num}
      </p>
      <div className="bg-[rgba(201,169,110,0.08)] border border-[rgba(201,169,110,0.18)] size-11 flex items-center justify-center shrink-0">
        <Icon className="size-[18px] text-[#C4973E]" strokeWidth={1.35} />
      </div>
      <p
        className="text-[14px] font-bold text-white leading-normal"
        style={SANS_FONT}
      >
        {step.title}
      </p>
      <p
        className="text-[14px] leading-[1.2] text-[rgba(255,255,255,0.4)] min-h-[100px]"
        style={SANS_FONT}
      >
        {step.body}
      </p>
    </div>
  )
}

function StepArrow() {
  return (
    <div className="size-8 bg-[#1C1B18] flex items-center justify-center">
      <ArrowRight className="size-[18px] text-[#C4973E]" strokeWidth={1.5} />
    </div>
  )
}

export function QualityProcess2() {
  const t = useTranslations("driversPage2.qualityProcess")

  const steps: Step[] = [
    {
      num: "01",
      Icon: Users,
      title: t("step1.title"),
      body: t("step1.body"),
    },
    {
      num: "02",
      Icon: FileText,
      title: t("step2.title"),
      body: t("step2.body"),
    },
    {
      num: "03",
      Icon: ClipboardCheck,
      title: t("step3.title"),
      body: t("step3.body"),
    },
    {
      num: "04",
      Icon: CircleCheck,
      title: t("step4.title"),
      body: t("step4.body"),
    },
  ]

  return (
    <section className="relative bg-[#1C1B18] py-16 lg:py-[80px] overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 40% at 30% 0%, rgba(154,117,53,0.08) 0%, transparent 60%)",
        }}
      />

      <div className="relative px-4 lg:px-[82px]">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="h-px w-[82px] bg-[#9A7535]" />
            <span
              className="text-[12px] font-semibold uppercase tracking-[2px] text-[#9A7535] leading-none whitespace-nowrap"
              style={SANS_FONT}
            >
              {t("eyebrow")}
            </span>
          </div>
          <h2
            className="text-white font-light text-[36px] lg:text-[48px] leading-[1.1] lg:leading-[48.4px]"
            style={SERIF_FONT}
          >
            {t("titleStart")}{" "}
            <span className="italic text-[#C4973E]">{t("titleAccent")}</span>
          </h2>
          <p
            className="text-[14px] leading-[1.2] text-[#999] max-w-[520px]"
            style={SANS_FONT}
          >
            {t("subtitle")}
          </p>
        </div>
      </div>

      <div className="relative mt-[52px] lg:px-[82px]">
        <div className="max-w-[1280px] mx-auto relative flex gap-[3px] overflow-x-auto lg:overflow-visible scrollbar-hide px-4 lg:px-0 snap-x snap-mandatory">
          {steps.map((step, i) => (
            <StepCard key={i} step={step} />
          ))}

          <div className="hidden lg:block pointer-events-none absolute inset-0">
            {[25, 50, 75].map((pct) => (
              <div
                key={pct}
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${pct}%` }}
              >
                <StepArrow />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
