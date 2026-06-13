"use client"

import { useEffect, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import { useAction, useMutation } from "convex/react"
import { api } from "@workspace/convex/api"
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
  const tev = useTranslations("emailVerification")
  const { state, updateVerification, nextStep, prevStep } = usePartnerApplication()

  const sendCode = useAction(api.emailVerification.send)
  const verifyCode = useMutation(api.emailVerification.verify)

  const code = state.verification.code
  const email = state.representative.email
  const canContinue = code.length === OTP_LENGTH

  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const sentForEmail = useRef<string | null>(null)

  useEffect(() => {
    if (!email || sentForEmail.current === email) return
    sentForEmail.current = email
    setSending(true)
    setError(null)
    sendCode({ email })
      .catch(() => setError(tev("errorSend")))
      .finally(() => setSending(false))
  }, [email, sendCode, tev])

  async function handleResend() {
    if (sending || !email) return
    setSending(true)
    setError(null)
    setStatus(null)
    try {
      await sendCode({ email })
      setStatus(tev("sent"))
    } catch {
      setError(tev("errorSend"))
    } finally {
      setSending(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canContinue || verifying) return
    setVerifying(true)
    setError(null)
    setStatus(null)
    try {
      const result = await verifyCode({ email, code })
      if (result.ok) {
        nextStep()
      } else {
        setError(result.reason === "expired" ? tev("errorExpired") : tev("errorMismatch"))
      }
    } catch {
      setError(tev("errorSend"))
    } finally {
      setVerifying(false)
    }
  }

  return (
    <form
      className="w-full max-w-[600px] mx-auto flex flex-col gap-6"
      onSubmit={handleSubmit}
    >
      <StepHeader title={t("title")} subtitle={t("subtitle")} />

      <EmailVerificationBanner email={email || t("emailFallback")} />

      <OtpInput
        value={code}
        onChange={(v) => {
          updateVerification({ code: v })
          setError(null)
        }}
        length={OTP_LENGTH}
        groupSize={3}
        ariaLabel={t("title")}
      />

      {error ? (
        <p className="text-center text-[13px] text-[#c0392b]">{error}</p>
      ) : status ? (
        <p className="text-center text-[13px] text-[#2e7d52]">{status}</p>
      ) : null}

      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleResend}
          disabled={sending}
          className="text-[14px] font-semibold text-[#a08248] hover:text-[#8a6f3d] disabled:opacity-60 transition-colors"
        >
          {sending ? tev("sending") : t("resend")}
        </button>
      </div>

      <ApplicationBottomBar
        backLabel={tCommon("back")}
        continueLabel={verifying ? tev("verifying") : t("verify")}
        onBack={prevStep}
        canContinue={canContinue && !verifying}
      />
    </form>
  )
}
