"use client"

import { ArrowRight } from "lucide-react"
import { LightButton } from "./light-button"

interface ApplicationBottomBarProps {
  backLabel: string
  continueLabel: string
  onBack?: () => void
  onContinue?: () => void
  canContinue?: boolean
  continueType?: "button" | "submit"
  hideBack?: boolean
}

export function ApplicationBottomBar({
  backLabel,
  continueLabel,
  onBack,
  onContinue,
  canContinue = true,
  continueType = "submit",
  hideBack = false,
}: ApplicationBottomBarProps) {
  return (
    <div className="flex items-stretch gap-4 md:gap-6 w-full pt-2">
      {!hideBack ? (
        <button
          type="button"
          onClick={onBack}
          className="h-[48px] w-[113px] shrink-0 inline-flex items-center justify-center bg-white border border-[rgba(28,27,24,0.08)] text-[#696969] text-[14px] font-medium uppercase tracking-[1.1px] hover:border-[rgba(28,27,24,0.18)] hover:text-[#1c1b18] transition-colors"
        >
          {backLabel}
        </button>
      ) : null}
      <LightButton
        type={continueType}
        size="lg"
        disabled={!canContinue}
        onClick={onContinue}
        iconRight={<ArrowRight size={18} strokeWidth={1.6} />}
        className="flex-1"
      >
        {continueLabel}
      </LightButton>
    </div>
  )
}
