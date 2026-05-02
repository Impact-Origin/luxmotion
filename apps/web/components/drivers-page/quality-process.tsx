"use client"

import {
  ArrowRight,
  CircleCheck,
  FileText,
  GraduationCap,
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
  heading: string
  body: string
}

function StepCard({ step }: { step: Step }) {
  const { Icon } = step
  return (
    <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] p-6 flex flex-col gap-3 w-[317px] lg:w-auto lg:flex-1 shrink-0 self-stretch">
      <p
        className="text-[48px] font-medium leading-none text-[rgba(255,255,255,0.12)]"
        style={SERIF_FONT}
      >
        {step.num}
      </p>
      <div className="size-11 flex items-center justify-center bg-[rgba(201,169,110,0.08)] border border-[rgba(201,169,110,0.18)]">
        <Icon className="size-[18px] text-[#C9A96E]" strokeWidth={1.75} />
      </div>
      <h3
        className="text-[14px] font-bold text-white leading-normal"
        style={SANS_FONT}
      >
        {step.heading}
      </h3>
      <p
        className="text-[14px] leading-[1.2] text-[rgba(255,255,255,0.4)]"
        style={SANS_FONT}
      >
        {step.body}
      </p>
    </div>
  )
}

function ArrowConnector({ leftPercent }: { leftPercent: number }) {
  return (
    <div
      className="hidden lg:flex absolute size-8 bg-[#1C1B18] items-center justify-center pointer-events-none -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${leftPercent}%`, top: "50%" }}
    >
      <ArrowRight className="size-[18px] text-[#C9A96E]" strokeWidth={2} />
    </div>
  )
}

export function QualityProcess() {
  const t = useTranslations("driversPage.qualityProcess")

  const steps: Step[] = [
    {
      num: "01",
      Icon: Users,
      heading: t("step1.heading"),
      body: t("step1.body"),
    },
    {
      num: "02",
      Icon: FileText,
      heading: t("step2.heading"),
      body: t("step2.body"),
    },
    {
      num: "03",
      Icon: GraduationCap,
      heading: t("step3.heading"),
      body: t("step3.body"),
    },
    {
      num: "04",
      Icon: CircleCheck,
      heading: t("step4.heading"),
      body: t("step4.body"),
    },
  ]

  return (
    <section className="relative bg-[#1C1B18] px-4 lg:px-[82px] pt-14 lg:pt-20 pb-8 lg:pb-20 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 1425px 917px at 30% 0%, rgba(154,117,53,0.08), rgba(154,117,53,0) 50%)",
        }}
      />

      <div className="relative max-w-[1280px] mx-auto flex flex-col gap-13 lg:gap-[52px]">
        <div className="flex flex-col gap-4 items-start">
          <div className="flex items-center gap-2">
            <div className="h-px w-[82px] bg-[#9A7535]" />
            <span
              className="text-[12px] font-semibold uppercase tracking-[2px] text-[#9A7535] leading-none"
              style={SANS_FONT}
            >
              {t("eyebrow")}
            </span>
          </div>
          <h2
            className="text-[40px] lg:text-[48px] font-light leading-[1.05] text-white"
            style={SERIF_FONT}
          >
            {t("titlePre")}{" "}
            <span className="italic text-[#C4973E]">{t("titleAccent")}</span>
          </h2>
          <p
            className="text-[14px] leading-[1.2] text-[#999] max-w-[520px]"
            style={SANS_FONT}
          >
            {t("subtitle")}
          </p>
        </div>

        <div className="relative">
          <div className="flex gap-[3px] lg:items-stretch overflow-x-auto lg:overflow-visible scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
            {steps.map((step, i) => (
              <StepCard key={i} step={step} />
            ))}
          </div>

          <ArrowConnector leftPercent={25} />
          <ArrowConnector leftPercent={50} />
          <ArrowConnector leftPercent={75} />
        </div>
      </div>
    </section>
  )
}
