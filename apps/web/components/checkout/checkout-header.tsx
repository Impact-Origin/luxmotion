"use client"

import { Star, ChevronLeft } from "lucide-react"
import { useEffect, useRef } from "react"
import { useTranslations } from "next-intl"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
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
    if (allowStepSkip) {
      onStepClick?.(step)
    }
  }

  return (
    <header className="bg-[rgba(217,217,217,0.18)]">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-3 lg:py-4">
        <div className="flex items-center justify-between">
          <div className="bg-transparent rounded-lg px-3 py-2">
            <div className="relative h-6 w-28 lg:h-7 lg:w-36">
              <Image
                src="/svgs/easytransfer-logo.svg"
                alt="EasyTransfer"
                fill
                className="object-contain object-left hidden"
                priority
              />
            </div>
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
            <LanguageSwitcher variant="compact" />
          </div>
        </div>
      </div>

      <div className="lg:hidden py-2 flex items-center justify-center gap-2 text-black text-xs bg-[rgba(217,217,217,0.18)]">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} className="w-3 h-3 fill-[#00B67A] text-[#00B67A]" />
          ))}
        </div>
        <span>1000+ {tBanner("verifiedReviews")}</span>
      </div>

      <div className="lg:hidden px-4 py-3 w-full min-w-0 bg-[rgba(217,217,217,0.18)]">
        <div className="flex items-center gap-2 xs:gap-3 w-full min-w-0 max-w-full">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={() => handleStepClick(currentStep - 1)}
              aria-label={tCommon("back")}
              className="w-6 h-6 xs:w-7 xs:h-7 rounded-full flex items-center justify-center shrink-0 bg-[#0E4659] text-white border-2 border-[#0E4659] hover:opacity-90 transition-opacity"
            >
              <ChevronLeft className="w-3.5 h-3.5 xs:w-4 xs:h-4" strokeWidth={2.5} />
            </button>
          )}
          {mobileSteps.map((step, index) => {
            const isActive = currentStep === step!.number
            const isCompleted = currentStep > step!.number
            const circleClasses = isActive || isCompleted ? "bg-[#0E4659] text-white" : "bg-black text-white"
            const labelClasses = isActive ? "text-[#0E4659]" : "text-black"
            const mobileLabel = step!.shortLabel ? `${step!.shortLabel}${step!.sublabel ? ` ${step!.sublabel}` : ""}` : step!.label

            return (
              <div
                key={step!.number}
                className={`flex items-center gap-2 xs:gap-3 min-w-0 flex-1 transition-all duration-500 ease-out ${
                  isActive ? "transform translate-y-0" : "transform translate-y-[1px] opacity-95"
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
                    className={`w-6 h-6 xs:w-7 xs:h-7 rounded-full flex items-center justify-center text-[11px] xs:text-[13px] font-extrabold transition-all duration-500 ease-out shrink-0 ${circleClasses} ${
                      isActive ? "scale-110 shadow-sm" : "scale-95"
                    }`}
                  >
                    {step!.number}
                  </div>
                  <span
                    className={`text-[11px] xs:text-[13px] font-medium truncate transition-all duration-500 ease-out ${labelClasses} ${
                      isActive ? "opacity-100 translate-x-0" : "opacity-80 translate-x-0.5"
                    }`}
                  >
                    {mobileLabel}
                  </span>
                </button>

                {index < mobileSteps.length - 1 && (
                  <div className="w-6 xs:w-8 h-[1.5px] bg-[#D9D9D9] rounded-full shrink-0" />
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
        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
          isActive || isCompleted ? "bg-[#0E4659] text-white" : "bg-black text-white"
        }`}
      >
        {number}
      </div>
      <div className="flex flex-col leading-tight">
        <span className={`text-xs font-medium ${isActive ? "text-[#0E4659]" : "text-black"}`}>
          {label}
        </span>
        {sublabel && (
          <span className={`text-xs font-medium ${isActive ? "text-[#0E4659]" : "text-black"}`}>
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
    <div className="relative w-12 h-[2px] bg-gray-400 mx-2">
      <div
        className={`absolute inset-0 bg-[#0E4659] transition-all duration-500 origin-left`}
        style={{
          width: isCompleted ? "100%" : "0%",
          transitionDelay: `${delay}ms`,
        }}
      />
    </div>
  )
}
