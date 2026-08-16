"use client"

import { Star } from "lucide-react"
import { useEffect, useRef } from "react"
import { useTranslations } from "next-intl"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { useDynamicTheme } from "@/components/dynamic-theme-provider"
import Image from "next/image"

interface CheckoutHeaderProps {
  currentStep?: number
  onStepClick?: (step: number) => void
  allowStepSkip?: boolean
  hasNearbyTours?: boolean
}

export function CheckoutHeader({ currentStep = 1, onStepClick, allowStepSkip = false, hasNearbyTours = false }: CheckoutHeaderProps) {
  const t = useTranslations("checkout.steps")
  const tBanner = useTranslations("checkout")
  const { logoUrl } = useDynamicTheme()

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
    if (allowStepSkip) {
      onStepClick?.(step)
    }
  }

  return (
    <header 
      className="checkout-header"
      style={{ backgroundColor: "var(--theme-checkout-header-bg, #27C7FF)" }}
    >
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-3 lg:py-4">
        <div className="flex items-center justify-between">
          <div className="checkout-header-logo opacity-0 pointer-events-none select-none" aria-hidden="true">
            {logoUrl ? (
              <div className="relative h-10 w-40">
                <Image 
                  src={logoUrl} 
                  alt="Logo" 
                  fill 
                  className="object-contain object-left"
                />
              </div>
            ) : (
              <div 
                className="px-6 lg:px-10 py-2 lg:py-3 rounded-full border-2"
                style={{ 
                  backgroundColor: "var(--theme-logo-bg, #000000)",
                  borderColor: "var(--theme-accent, #FBB03B)"
                }}
              >
                <span 
                  className="font-bold text-sm lg:text-base tracking-widest"
                  style={{ color: "var(--theme-logo-text, #FFFFFF)" }}
                >
                  LOGOMARCA
                </span>
              </div>
            )}
          </div>

          <div className="hidden lg:flex items-center">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
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

          <div className="flex items-center gap-2">
            <LanguageSwitcher variant="checkout" />
          </div>
        </div>
      </div>

      <div className="lg:hidden bg-[#4A5568] py-2 flex items-center justify-center gap-2 text-white text-xs">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} className="w-3 h-3 fill-[#00B67A] text-[#00B67A]" />
          ))}
        </div>
        <span>1000+ {tBanner("verifiedReviews")}</span>
      </div>

      <div className="lg:hidden bg-white px-4 py-3 w-full min-w-0">
        <div className="flex items-center justify-between gap-2 xs:gap-3 w-full min-w-0 max-w-full">
          {mobileSteps.map((step, index) => {
            const isActive = currentStep === step!.number
            const isCompleted = currentStep > step!.number
            const mobileLabel = step!.shortLabel ? `${step!.shortLabel}${step!.sublabel ? ` ${step!.sublabel}` : ""}` : step!.label

            return (
              <div
                key={step!.number}
                className={`flex items-center gap-2 xs:gap-3 min-w-0 flex-1 transition-all duration-500 ease-out ${
                  isActive ? "transform translate-y-0" : "transform translate-y-px opacity-95"
                }`}
              >
                <button
                  onClick={() => handleStepClick(step!.number)}
                  disabled={!allowStepSkip}
                  className={`flex items-center gap-1.5 xs:gap-2 transition-all duration-500 ease-out min-w-0 flex-1 ${
                    allowStepSkip ? "cursor-pointer" : "cursor-default"
                  }`}
                >
                  <div
                    /* pt: centragem óptica do algarismo — ver checkout-header.tsx */
                    className={`w-6 h-6 xs:w-7 xs:h-7 rounded-full flex items-center justify-center pt-[0.5px] xs:pt-[1px] text-[11px] xs:text-[13px] font-extrabold transition-all duration-500 ease-out shrink-0 ${
                      isActive ? "scale-110 shadow-sm" : "scale-95"
                    }`}
                    style={{
                      backgroundColor: isActive || isCompleted
                        ? "var(--theme-checkout-step-active-bg, #0E4659)"
                        : "var(--theme-checkout-step-inactive-bg, #F7F7F7)",
                      color: isActive || isCompleted
                        ? "var(--theme-checkout-step-active-text, #FFFFFF)"
                        : "var(--theme-checkout-step-inactive-text, #BFBFBF)",
                    }}
                  >
                    {step!.number}
                  </div>
                  <span
                    className={`text-[11px] xs:text-[13px] font-medium truncate transition-all duration-500 ease-out ${
                      isActive ? "opacity-100 translate-x-0" : "opacity-80 translate-x-0.5"
                    }`}
                    style={{
                      color: isActive || isCompleted
                        ? "var(--theme-checkout-step-active-text, #222222)"
                        : "var(--theme-checkout-step-inactive-text, #6B7280)"
                    }}
                  >
                    {mobileLabel}
                  </span>
                </button>

                {index < mobileSteps.length - 1 && (
                  <div
                    className="w-6 xs:w-8 h-[1.5px] rounded-full shrink-0"
                    style={{ backgroundColor: "var(--theme-checkout-step-connector-inactive, #D9D9D9)" }}
                  />
                )}
              </div>
            )
          })}
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
  return (
    <button
      onClick={onClick}
      disabled={!allowClick}
      className={`flex items-center gap-2 transition ${
        allowClick ? "cursor-pointer hover:opacity-80" : "cursor-default"
      }`}
    >
      <div
        /* pt: centragem óptica do algarismo — ver checkout-header.tsx */
        className="w-7 h-7 rounded-full flex items-center justify-center pt-[1px] text-xs font-bold transition-all duration-500"
        style={{
          backgroundColor: isActive || isCompleted 
            ? "var(--theme-checkout-step-active-bg, #0E4659)" 
            : "var(--theme-checkout-step-inactive-bg, #FFFFFF)",
          color: isActive || isCompleted 
            ? "var(--theme-checkout-step-active-text, #FFFFFF)" 
            : "var(--theme-checkout-step-inactive-text, #6B7280)",
          border: isActive || isCompleted ? "none" : "1px solid #D1D5DB",
        }}
      >
        {number}
      </div>
      <div className="flex flex-col leading-tight">
        <span
          className="text-xs font-medium transition-colors duration-300"
          style={{ 
            color: isActive || isCompleted 
              ? "var(--theme-checkout-step-active-text, #FFFFFF)" 
              : "var(--theme-checkout-step-inactive-text, #6B7280)" 
          }}
        >
          {label}
        </span>
        {sublabel && (
          <span
            className="text-xs font-medium transition-colors duration-300"
            style={{ 
              color: isActive || isCompleted 
                ? "var(--theme-checkout-step-active-text, #FFFFFF)" 
                : "var(--theme-checkout-step-inactive-text, #6B7280)" 
            }}
          >
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

  if (isGoingBackward && !isCompleted) {
    delay = (prevStep - step - 1) * 600
  } else if (isGoingForward && isCompleted) {
    delay = (step - prevStep) * 600
  }

  return (
    <div 
      className="relative w-12 h-[2px] mx-2"
      style={{ backgroundColor: "var(--theme-checkout-step-connector-inactive, #9CA3AF)" }}
    >
      <div
        className="absolute inset-0 transition-all duration-500 origin-left"
        style={{
          backgroundColor: "var(--theme-checkout-step-connector-active, #0E4659)",
          width: isCompleted ? "100%" : "0%",
          transitionDelay: `${delay}ms`,
        }}
      />
    </div>
  )
}
