"use client"

import { Fragment, useRef } from "react"
import { useTranslations } from "next-intl"
import { User, Search, Shield, Check, type LucideIcon } from "lucide-react"
import { useAutoScrollMarquee } from "@/hooks/use-auto-scroll-marquee"

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

function StepDot({ icon: Icon, highlight, index }: { icon: LucideIcon; highlight?: boolean; index: number }) {
  const delay = `${index * 0.4}s`
  return (
    <div className="relative size-14">
      <span
        className="absolute inset-0 rounded-full border border-[rgba(201,169,110,0.6)] animate-icon-halo motion-reduce:hidden pointer-events-none"
        style={{ animationDelay: delay }}
      />
      <div
        className={`relative size-14 animate-icon-breathe motion-reduce:animate-none transition-shadow duration-300 ease-out ${
          highlight
            ? "rounded-full bg-[#C9A96E] flex items-center justify-center group-hover:shadow-[0_0_24px_rgba(201,169,110,0.55)]"
            : "rounded-full bg-[#1a1a1a] border border-[rgba(201,169,110,0.2)] flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(201,169,110,0.35)]"
        }`}
        style={{ animationDelay: delay }}
      >
        <Icon
          className={highlight ? "size-6 text-[#0D0D0D]" : "size-6 text-[#C9A96E]"}
          strokeWidth={highlight ? 2.5 : 1.5}
        />
      </div>
    </div>
  )
}

function StepNode({ step, t, index }: { step: Step; t: ReturnType<typeof useTranslations>; index: number }) {
  return (
    <div className="group flex flex-col items-center gap-[14px] flex-1 min-w-0 px-4">
      <StepDot icon={step.icon} highlight={step.highlight} index={index} />
      <h3
        className="text-white text-[14px] font-semibold tracking-[0.48px] text-center"
        style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
      >
        {t(step.titleKey)}
      </h3>
      <p
        className="text-[#999] text-[14px] leading-[1.4] text-center text-balance max-w-[190px]"
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
      className={`${flexBased ? "flex-1 max-w-[120px]" : "w-[120px] shrink-0"} h-px self-start mt-[28px]`}
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(201,169,110,0.3), rgba(201,169,110,0.1), rgba(201,169,110,0.3))",
      }}
    />
  )
}

export function VettingSection() {
  const t = useTranslations("aboutPage.vetting")
  const marqueeRef = useRef<HTMLDivElement>(null)
  useAutoScrollMarquee(marqueeRef, { activeBelow: 1024 })

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

        <div className="hidden lg:flex items-start justify-center w-full pt-3">
          {STEPS.map((s, i) => (
            <Fragment key={s.titleKey}>
              <StepNode step={s} t={t} index={i} />
              {i < STEPS.length - 1 && <Connector flexBased />}
            </Fragment>
          ))}
        </div>

        <div
          ref={marqueeRef}
          className="lg:hidden w-full overflow-x-auto scrollbar-hide"
        >
          <div className="flex items-start min-w-max pt-3">
            {[...STEPS, ...STEPS].map((s, i) => (
              <Fragment key={`${s.titleKey}-${i}`}>
                <div className="w-[200px] shrink-0 flex justify-center">
                  <StepNode step={s} t={t} index={i % STEPS.length} />
                </div>
                {i < STEPS.length * 2 - 1 && <Connector flexBased={false} />}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
