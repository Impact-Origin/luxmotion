"use client"

import type { ReactNode } from "react"
import { ArrowRight } from "lucide-react"
import { SERIF_FONT } from "./fonts"
import { BenefitCard } from "./benefit-card"
import { LightButton } from "./light-button"
import { useEnterAnimation } from "@/hooks/use-enter-animation"
import { cn } from "@workspace/ui/lib/utils"

interface IntroBenefit {
  icon: ReactNode
  label: string
}

interface IntroShellProps {
  badgeIcon: ReactNode
  badgeLabel: string
  headingPrefix: string
  headingAccent: string
  headingSuffix?: string
  subtitle: string
  benefits: IntroBenefit[]
  ctaLabel: string
  onCta: () => void
  extra?: ReactNode
  benefitIconClassName?: string
  accentOnNewLine?: boolean
}

export function IntroShell({
  badgeIcon,
  badgeLabel,
  headingPrefix,
  headingAccent,
  headingSuffix,
  subtitle,
  benefits,
  ctaLabel,
  onCta,
  extra,
  benefitIconClassName,
  accentOnNewLine,
}: IntroShellProps) {
  const { enter } = useEnterAnimation()
  return (
    <div className="w-full max-w-[800px] mx-auto flex flex-col items-center gap-6">
      <div className={cn("flex flex-col gap-2 items-center w-full", enter("delay-0"))}>
        <div className="inline-flex items-center gap-2 bg-[rgba(201,169,110,0.08)] border border-[rgba(201,169,110,0.2)] px-[14.8px] py-[5.8px]">
          <span className="text-[#a08248] flex items-center">{badgeIcon}</span>
          <span className="text-[10px] font-semibold uppercase tracking-[1.5px] text-[#a08248] leading-none">
            {badgeLabel}
          </span>
        </div>
        <h1
          className="text-center text-[40px] md:text-[48px] leading-none text-[#1c1b18]"
          style={SERIF_FONT}
        >
          <span className="font-normal">{headingPrefix}</span>
          {accentOnNewLine ? <br /> : " "}
          <span className="italic text-[#a08248]">{headingAccent}</span>
          {headingSuffix ? <span className="font-normal">{headingSuffix}</span> : null}
        </h1>
      </div>
      <p className={cn("text-center text-[16px] md:text-[18px] leading-[1.3] text-[#696969] max-w-[614px]", enter("delay-100"))}>
        {subtitle}
      </p>
      {extra ? <div className={enter("delay-200")}>{extra}</div> : null}
      <div className="grid grid-cols-1 md:grid-cols-2 auto-rows-fr gap-2 w-full max-w-[614px]">
        {benefits.map((benefit, idx) => (
          <div
            key={idx}
            className={cn(enter(), "h-full")}
            style={{ transitionDelay: `${300 + idx * 90}ms` }}
          >
            <BenefitCard
              icon={benefit.icon}
              label={benefit.label}
              iconClassName={benefitIconClassName}
            />
          </div>
        ))}
      </div>
      <div className={enter("delay-[700ms]")}>
        <LightButton
          size="lg"
          onClick={onCta}
          iconRight={<ArrowRight size={18} strokeWidth={1.6} />}
          className="w-full md:w-auto"
        >
          {ctaLabel}
        </LightButton>
      </div>
    </div>
  )
}
