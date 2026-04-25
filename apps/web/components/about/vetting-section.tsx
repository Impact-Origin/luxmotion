"use client"

import { Fragment } from "react"
import { useTranslations } from "next-intl"
import { User, Search, Shield, Check, type LucideIcon } from "lucide-react"

type Step = {
  icon: LucideIcon
  titleKey: string
  descKey: string
  highlight?: boolean
}

const STEPS: Step[] = [
  { icon: User, titleKey: "interview.title", descKey: "interview.desc" },
  { icon: Search, titleKey: "background.title", descKey: "background.desc" },
  { icon: Shield, titleKey: "training.title", descKey: "training.desc" },
  { icon: Check, titleKey: "approved.title", descKey: "approved.desc", highlight: true },
]

function StepDot({ icon: Icon, highlight }: { icon: LucideIcon; highlight?: boolean }) {
  return (
    <div
      className={
        highlight
          ? "size-14 rounded-full bg-[#C9A96E] flex items-center justify-center"
          : "size-14 rounded-full bg-[#1a1a1a] border border-[rgba(201,169,110,0.2)] flex items-center justify-center"
      }
    >
      <Icon
        className={highlight ? "size-6 text-[#0D0D0D]" : "size-6 text-[#C9A96E]"}
        strokeWidth={highlight ? 2.5 : 1.5}
      />
    </div>
  )
}

function StepNode({ step, t }: { step: Step; t: ReturnType<typeof useTranslations> }) {
  return (
    <div className="flex flex-col items-center gap-[14px] shrink-0 min-w-[220px] px-4">
      <StepDot icon={step.icon} highlight={step.highlight} />
      <h3
        className="text-white text-[14px] font-semibold tracking-[0.48px] text-center whitespace-nowrap"
        style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
      >
        {t(step.titleKey)}
      </h3>
      <p
        className="text-[#999] text-[14px] leading-[1.2] text-center max-w-[200px]"
        style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
      >
        {t(step.descKey)}
      </p>
    </div>
  )
}

function Connector({ flexBased }: { flexBased: boolean }) {
  return (
    <div
      className={`${flexBased ? "flex-1" : "w-[120px] shrink-0"} h-px self-start mt-[28px]`}
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(201,169,110,0.3), rgba(201,169,110,0.1), rgba(201,169,110,0.3))",
      }}
    />
  )
}

export function VettingSection() {
  const t = useTranslations("aboutPage.vetting")

  return (
    <section className="bg-[#0D0D0D] flex flex-col items-center px-4 md:px-[120px] pt-4 pb-20">
      <div className="flex flex-col gap-6 items-center w-full max-w-[1280px]">
        <div className="flex flex-col gap-[14px] items-center w-full">
          <div className="flex gap-2 items-center">
            <div className="w-8 h-px bg-[#C9A96E]" />
            <span
              className="text-[12px] font-semibold uppercase tracking-[2px] text-[#C9A96E] whitespace-nowrap"
              style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
            >
              {t("eyebrow")}
            </span>
            <div className="w-8 h-px bg-[#C9A96E]" />
          </div>
          <h2
            className="text-white font-normal text-center leading-[1.2]"
            style={{
              fontFamily: "var(--font-title), 'Cormorant Garamond', serif",
              fontSize: "clamp(2rem, 3.4vw, 3rem)",
            }}
          >
            <span className="block">{t("headingLine1")}</span>
            <span className="block italic text-[#C9A96E]">{t("headingLine2")}</span>
          </h2>
          <p
            className="text-[14px] text-center text-[rgba(255,255,255,0.4)] max-w-[640px] leading-[1.4]"
            style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
          >
            <span className="font-semibold text-white">{t("subHighlight")}</span>{" "}
            {t("subRest")}
          </p>
          <p
            className="text-[12px] font-semibold text-[#C9A96E] uppercase tracking-[2px] mt-2"
            style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
          >
            {t("processLabel")}
          </p>
        </div>

        <div className="hidden md:flex items-start w-full pt-3">
          {STEPS.map((s, i) => (
            <Fragment key={s.titleKey}>
              <StepNode step={s} t={t} />
              {i < STEPS.length - 1 && <Connector flexBased />}
            </Fragment>
          ))}
        </div>

        <div className="md:hidden w-full overflow-x-auto no-scrollbar">
          <div className="flex items-start min-w-max pt-3">
            {STEPS.map((s, i) => (
              <Fragment key={s.titleKey}>
                <div className="w-[200px] shrink-0 flex justify-center">
                  <StepNode step={s} t={t} />
                </div>
                {i < STEPS.length - 1 && <Connector flexBased={false} />}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
