"use client"

import { useTranslations } from "next-intl"
import {
  ApplicationBottomBar,
  EmailVerificationBanner,
  OtpInput,
  StepHeader,
} from "@/components/applications/shared"
import { useDriverApplication } from "../driver-application-context"

export function DriverStepVerifyEmail() {
  const t = useTranslations("driverApplication.stepVerifyEmail")
  const tCommon = useTranslations("common")
  const { state, updateContact, nextStep, prevStep } = useDriverApplication()
  const { contact } = state

  const code = contact.emailVerificationCode
  const canContinue = code.length === 6

  return (
    <form
      className="w-full max-w-[600px] mx-auto flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault()
        if (canContinue) nextStep()
      }}
    >
      <StepHeader title={t("title")} subtitle={t("subtitle")} />

      <EmailVerificationBanner email={contact.representativeEmail || t("placeholderEmail")} />

      <OtpInput
        value={code}
        onChange={(value) => updateContact({ emailVerificationCode: value })}
        ariaLabel={t("title")}
      />

      <button
        type="button"
        className="text-[14px] font-semibold text-[#a08248] hover:text-[#8c6f3e] transition-colors mx-auto"
      >
        {t("resend")}
      </button>

      <ApplicationBottomBar
        backLabel={tCommon("back")}
        continueLabel={t("verify")}
        onBack={prevStep}
        canContinue={canContinue}
      />
    </form>
  )
}
