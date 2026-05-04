"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import {
  ApplicationBottomBar,
  EmailVerificationBanner,
  OtpInput,
  StepHeader,
} from "@/components/applications/shared"
import { usePartnerApplication } from "../partner-application-context"

const OTP_LENGTH = 6

export function PartnerStepVerification() {
  const t = useTranslations("partnerApplication.stepVerification")
  const tCommon = useTranslations("common")
  const { state, updateVerification, nextStep, prevStep } = usePartnerApplication()
  const [resending, setResending] = useState(false)

  const code = state.verification.code
  const email = state.representative.email
  const canContinue = code.length === OTP_LENGTH

  function handleResend() {
    if (resending) return
    setResending(true)
    setTimeout(() => setResending(false), 2000)
  }

  return (
    <form
      className="w-full max-w-[600px] mx-auto flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault()
        if (canContinue) nextStep()
      }}
    >
      <StepHeader title={t("title")} subtitle={t("subtitle")} />

      <EmailVerificationBanner email={email || t("emailFallback")} />

      <OtpInput
        value={code}
        onChange={(v) => updateVerification({ code: v })}
        length={OTP_LENGTH}
        groupSize={3}
        ariaLabel={t("title")}
      />

      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleResend}
          disabled={resending}
          className="text-[14px] font-semibold text-[#a08248] hover:text-[#8a6f3d] disabled:opacity-60 transition-colors"
        >
          {resending ? t("resending") : t("resend")}
        </button>
      </div>

      <ApplicationBottomBar
        backLabel={tCommon("back")}
        continueLabel={t("verify")}
        onBack={prevStep}
        canContinue={canContinue}
      />
    </form>
  )
}
