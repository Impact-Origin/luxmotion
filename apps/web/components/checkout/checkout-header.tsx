"use client"

import { ChevronLeft, ChevronDown, Menu, Moon, Sun, Check } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@workspace/ui/lib/utils"
import { FlagImage } from "react-international-phone"
import { locales, localeNames, localeCountryIso, type Locale } from "@/i18n/config"
import { TrustBanner } from "@/components/checkout/trust-banner"
import { useCheckoutTheme } from "@/components/checkout/checkout-theme"

interface CheckoutHeaderProps {
  currentStep?: number
  onStepClick?: (step: number) => void
  allowStepSkip?: boolean
  hasNearbyTours?: boolean
  reservationsToday?: number
}

function LuxMotionLogo() {
  return (
    <Link href="/" className="flex items-center gap-[10px] shrink-0">
      <div className="relative w-[45px] h-[45px] border-[1.9px] border-[var(--ck-accent,#c9a96e)] flex items-center justify-center shrink-0">
        <div className="relative w-[23px] h-[13px]">
          <Image src="/svgs/lm-monogram.svg" alt="" fill className="object-contain" priority />
        </div>
      </div>
      <div className="flex flex-col justify-center">
        <div className="relative w-[82px] h-[9px]">
          <Image
            src="/svgs/luxmotion-text.svg"
            alt="LuxMotion"
            fill
            className="object-contain object-left"
            priority
          />
        </div>
        <span className="text-[7.2px] tracking-[1px] text-[rgba(var(--ck-text-rgb,255,255,255),0.55)] mt-[4px] whitespace-nowrap">
          BY EASYTRANSFER
        </span>
      </div>
    </Link>
  )
}

function LangPill() {
  const locale = useLocale() as Locale
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [])

  const onChange = (l: Locale) => {
    document.cookie = `NEXT_LOCALE=${l};path=/;max-age=31536000`
    setOpen(false)
    window.location.reload()
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-[4px] h-[40px] px-[9px] border border-[rgba(var(--ck-accent-rgb,201,169,110),0.22)] hover:border-[rgba(var(--ck-accent-rgb,201,169,110),0.4)] transition-colors cursor-pointer"
      >
        <FlagImage iso2={localeCountryIso[locale]} size={20} className="rounded-[2px]" />
        <span className="text-[14px] font-medium text-[var(--ck-accent,#c9a96e)] tracking-[0.15px]">
          {locale.toUpperCase()}
        </span>
        <ChevronDown
          className={cn("w-[13px] h-[13px] text-[var(--ck-accent,#c9a96e)] transition-transform", open && "rotate-180")}
        />
      </button>
      {open && (
        <div className="absolute top-full mt-1 right-0 bg-[var(--ck-surface,#1a1a1a)] border border-[#2A2A2A] shadow-xl py-1 min-w-[180px] z-50">
          {locales.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => onChange(l)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-[var(--ck-text-muted,#8c8680)] hover:text-[var(--ck-accent,#c9a96e)] hover:bg-white/5",
                l === locale && "text-[var(--ck-accent,#c9a96e)] bg-white/5"
              )}
            >
              <FlagImage iso2={localeCountryIso[l]} size={20} />
              <span className="flex-1 text-left text-sm font-medium">{localeNames[l]}</span>
              {l === locale && <Check className="w-4 h-4 text-[var(--ck-accent,#c9a96e)]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ThemeToggle({ label }: { label: string }) {
  const { theme, toggle } = useCheckoutTheme()
  const isDark = theme === "dark"
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={cn(
        "flex items-center justify-center size-[40px] border transition-colors cursor-pointer",
        isDark
          ? "border-[rgba(var(--ck-accent-rgb,201,169,110),0.22)] text-[var(--ck-accent,#c9a96e)] hover:border-[rgba(var(--ck-accent-rgb,201,169,110),0.4)]"
          : "border-[rgba(160,130,72,0.28)] text-[#A08248] hover:border-[rgba(160,130,72,0.5)]",
      )}
    >
      {isDark ? (
        <Sun className="w-4 h-4" strokeWidth={1.5} />
      ) : (
        <Moon className="w-4 h-4" strokeWidth={1.5} />
      )}
    </button>
  )
}

function LiveCount({ text }: { text: string }) {
  return (
    <div className="hidden lg:flex items-center gap-[12px] pr-2">
      <span className="inline-block size-[6px] rounded-[3px] bg-[#2e7d52] shadow-[0_0_6px_rgba(46,125,82,0.7)]" />
      <span className="text-[12px] text-[rgba(var(--ck-text-rgb,247,244,239),0.38)] whitespace-nowrap">{text}</span>
    </div>
  )
}

export function CheckoutHeader({
  currentStep = 1,
  onStepClick,
  allowStepSkip = false,
  hasNearbyTours = false,
  reservationsToday = 13,
}: CheckoutHeaderProps) {
  const t = useTranslations("checkout.steps")
  const tNav = useTranslations("checkout.nav")
  const tCommon = useTranslations("common")

  const steps = hasNearbyTours
    ? [
        { number: 1, label: t("tripDetails"), shortLabel: t("trip"), sublabel: t("details") },
        { number: 2, label: t("experiences") },
        { number: 3, label: t("passengerInfo"), shortLabel: t("passenger"), sublabel: t("info") },
        { number: 4, label: t("payment") },
        { number: 5, label: t("confirmation") },
      ]
    : [
        { number: 1, label: t("tripDetails"), shortLabel: t("trip"), sublabel: t("details") },
        { number: 2, label: t("passengerInfo"), shortLabel: t("passenger"), sublabel: t("info") },
        { number: 3, label: t("payment") },
        { number: 4, label: t("confirmation") },
      ]

  const mobileSteps = steps.filter((s) => s.number === currentStep || s.number === currentStep + 1)

  const handleStepClick = (step: number) => {
    if (allowStepSkip) onStepClick?.(step)
  }

  return (
    <header className="bg-[var(--ck-bg,#0d0d0d)] border-b border-[var(--ck-divider,rgba(var(--ck-text-rgb,247,244,239),0.08))]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-[48px] 2xl:px-[130px] h-[60px] md:h-[72px] flex items-center justify-between">
        <LuxMotionLogo />

        <div className="flex items-center gap-[12px]">
          <LiveCount text={tNav("reservationsToday", { count: reservationsToday })} />
          <LangPill />
          <ThemeToggle label={tNav("themeToggle")} />
          <Link
            href="/"
            aria-label={tNav("menu")}
            className="md:hidden flex items-center justify-center size-[40px] border border-[rgba(var(--ck-accent-rgb,201,169,110),0.22)] text-[var(--ck-accent,#c9a96e)] hover:border-[rgba(var(--ck-accent-rgb,201,169,110),0.4)] transition-colors"
          >
            <Menu className="w-4 h-4" strokeWidth={1.5} />
          </Link>
        </div>
      </div>

      <TrustBanner />

      <div className="bg-[var(--ck-surface-2,#222)] border-b-[0.8px] border-[rgba(var(--ck-text-rgb,247,244,239),0.08)]">
        <div className="hidden md:flex max-w-[1440px] mx-auto px-[16px] py-[12px] items-center justify-center gap-[4px]">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center gap-[4px]">
              {index > 0 && <StepConnector step={steps[index - 1]!.number} currentStep={currentStep} />}
              <StepItem
                number={step.number}
                label={step.shortLabel || step.label}
                sublabel={step.sublabel}
                isActive={currentStep === step.number}
                isCompleted={currentStep > step.number}
                onClick={() => handleStepClick(step.number)}
                allowClick={allowStepSkip}
              />
            </div>
          ))}
        </div>

        <div className="md:hidden px-4 py-[12px]">
          <div className="flex items-center justify-center gap-[4px] w-full min-w-0">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => handleStepClick(currentStep - 1)}
                aria-label={tCommon("back")}
                className="size-6 rounded-full flex items-center justify-center shrink-0 border border-[rgba(var(--ck-text-rgb,247,244,239),0.2)] text-[rgba(var(--ck-text-rgb,247,244,239),0.55)] hover:border-[rgba(var(--ck-accent-rgb,201,169,110),0.5)] hover:text-[var(--ck-accent,#c9a96e)] transition-colors mr-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" strokeWidth={2.5} />
              </button>
            )}
            {mobileSteps.map((step, index) => {
              const isActive = currentStep === step!.number
              const isCompleted = currentStep > step!.number
              const mobileLabel = step!.shortLabel
                ? `${step!.shortLabel}${step!.sublabel ? ` ${step!.sublabel}` : ""}`
                : step!.label

              return (
                <div key={step!.number} className="flex items-center gap-[4px] min-w-0">
                  <StepItem
                    number={step!.number}
                    label={mobileLabel}
                    isActive={isActive}
                    isCompleted={isCompleted}
                    onClick={() => handleStepClick(step!.number)}
                    allowClick={allowStepSkip}
                  />
                  {index < mobileSteps.length - 1 && (
                    <StepConnector
                      step={step!.number}
                      currentStep={currentStep}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </header>
  )
}

function StepItem({
  number,
  label,
  sublabel,
  isActive,
  isCompleted,
  onClick,
  allowClick,
}: {
  number: number
  label: string
  sublabel?: string
  isActive: boolean
  isCompleted: boolean
  onClick?: () => void
  allowClick?: boolean
}) {
  const circleCls = isCompleted
    ? "bg-[#2E7D52] border-transparent text-[var(--ck-text,#f7f4ef)]"
    : isActive
      ? "bg-[var(--ck-accent,#c9a96e)] border-[rgba(var(--ck-text-rgb,247,244,239),0.08)] text-[var(--ck-text,#f7f4ef)]"
      : "bg-transparent border-[rgba(var(--ck-text-rgb,247,244,239),0.08)] text-[rgba(var(--ck-text-rgb,247,244,239),0.38)]"

  const labelCls = isCompleted
    ? "text-[var(--ck-text,#f7f4ef)]"
    : isActive
      ? "text-[var(--ck-text,#f7f4ef)]"
      : "text-[rgba(var(--ck-text-rgb,247,244,239),0.38)]"

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!allowClick}
      className={cn(
        "flex items-center transition",
        allowClick ? "cursor-pointer hover:opacity-80" : "cursor-default"
      )}
    >
      <div
        className={cn(
          "size-6 rounded-full border flex items-center justify-center text-[10.4px] font-extrabold leading-none transition-all duration-500",
          circleCls
        )}
      >
        {number}
      </div>
      <div className="flex flex-col leading-tight text-left px-[6px]">
        <span className={cn("text-[12px] font-semibold leading-[16.64px] whitespace-nowrap", labelCls)}>
          {label}
        </span>
        {sublabel && (
          <span className={cn("text-[12px] font-semibold leading-[16.64px] whitespace-nowrap", labelCls)}>
            {sublabel}
          </span>
        )}
      </div>
    </button>
  )
}

function StepConnector({ step, currentStep }: { step: number; currentStep: number }) {
  const prevStepRef = useRef(currentStep)
  const isCompleted = currentStep > step

  useEffect(() => {
    prevStepRef.current = currentStep
  }, [currentStep])

  const prevStep = prevStepRef.current
  const isGoingBackward = currentStep < prevStep
  const isGoingForward = currentStep > prevStep

  let delay = 0
  if (isGoingBackward && !isCompleted) delay = (prevStep - step - 1) * 600
  else if (isGoingForward && isCompleted) delay = (step - prevStep) * 600

  return (
    <div className="relative w-[32px] max-w-[32px] h-[2px] bg-[rgba(var(--ck-text-rgb,247,244,239),0.08)] shrink-0">
      <div
        className="absolute inset-0 bg-[#2E7D52] transition-all duration-500 origin-left"
        style={{
          width: isCompleted ? "100%" : "0%",
          transitionDelay: `${delay}ms`,
        }}
      />
    </div>
  )
}
