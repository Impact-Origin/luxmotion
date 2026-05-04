"use client"

import { Check } from "lucide-react"
import { useTranslations } from "next-intl"
import {
  ApplicationBottomBar,
  StepHeader,
} from "@/components/applications/shared"
import { useDriverApplication } from "../driver-application-context"

export function DriverStepTerms() {
  const t = useTranslations("driverApplication.stepTerms")
  const tCommon = useTranslations("common")
  const { state, updateTerms, nextStep, prevStep } = useDriverApplication()
  const { terms } = state

  const canSubmit = terms.accepted

  return (
    <form
      className="w-full max-w-[600px] mx-auto flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault()
        if (canSubmit) nextStep()
      }}
    >
      <StepHeader title={t("title")} subtitle={t("subtitle")} />

      <button
        type="button"
        onClick={() => updateTerms({ accepted: !terms.accepted })}
        aria-pressed={terms.accepted}
        className="w-full bg-white border border-[rgba(28,27,24,0.08)] flex items-start gap-3 px-4 py-3 text-left hover:border-[rgba(28,27,24,0.18)] transition-colors"
      >
        <span
          className={
            terms.accepted
              ? "size-[20px] shrink-0 mt-0.5 bg-[#a08248] border border-[#a08248] flex items-center justify-center"
              : "size-[20px] shrink-0 mt-0.5 bg-white border border-[rgba(28,27,24,0.18)]"
          }
        >
          {terms.accepted ? <Check size={12} strokeWidth={3} className="text-white" /> : null}
        </span>
        <span className="text-[14px] text-[#1c1b18] leading-[1.45]">
          {t.rich("acceptance", {
            terms: (chunks) => (
              <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="font-semibold underline text-[#1c1b18] hover:text-[#a08248] transition-colors"
              >
                {chunks}
              </a>
            ),
            privacy: (chunks) => (
              <a
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="font-semibold underline text-[#1c1b18] hover:text-[#a08248] transition-colors"
              >
                {chunks}
              </a>
            ),
          })}
        </span>
      </button>

      <p className="bg-[#f3eee5] border border-[rgba(28,27,24,0.04)] px-4 py-3 text-[13px] italic text-[#696969] leading-[1.45]">
        {t("disclaimer")}
      </p>

      <ApplicationBottomBar
        backLabel={tCommon("back")}
        continueLabel={t("submitCta")}
        onBack={prevStep}
        canContinue={canSubmit}
      />
    </form>
  )
}
