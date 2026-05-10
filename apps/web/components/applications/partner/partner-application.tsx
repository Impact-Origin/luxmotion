"use client"

import { useTranslations } from "next-intl"
import { ApplicationProgress } from "@/components/applications/shared"
import {
  PartnerApplicationProvider,
  usePartnerApplication,
  PARTNER_TOTAL_STEPS,
} from "./partner-application-context"
import { PartnerIntro } from "./partner-intro"
import { PartnerStepCompany } from "./steps/step-1-company"
import { PartnerStepRepresentative } from "./steps/step-2-representative"
import { PartnerStepVerification } from "./steps/step-3-verification"
import { PartnerStepIntroVideo } from "./steps/step-4-intro-video"
import { PartnerStepDrivers } from "./steps/step-5-drivers"
import { PartnerStepVehicles } from "./steps/step-6-vehicles"
import { PartnerStepDocuments } from "./steps/step-7-documents"
import { PartnerStepBilling } from "./steps/step-8-billing"
import { PartnerStepPriceAgreement } from "./steps/step-9-price-agreement"
import { PartnerStepConfirmation } from "./steps/step-10-confirmation"

const STEP_LABEL_KEY: Record<number, string> = {
  1: "company",
  2: "representative",
  3: "verification",
  4: "introVideo",
  5: "drivers",
  6: "vehicles",
  7: "documents",
  8: "billing",
  9: "priceAgreement",
  10: "confirmation",
}

function ApplicationView() {
  const t = useTranslations("partnerApplication.steps")
  const { state } = usePartnerApplication()

  if (state.step === 0) {
    return (
      <div className="flex-1 flex items-center justify-center px-4 py-20 md:py-32 md:px-[82px]">
        <PartnerIntro />
      </div>
    )
  }

  const labelKey = STEP_LABEL_KEY[state.step] ?? "company"

  return (
    <>
      <ApplicationProgress
        label={t(labelKey)}
        currentStep={state.step}
        totalSteps={PARTNER_TOTAL_STEPS}
      />
      <div className="flex-1 flex items-start justify-center px-4 pt-6 md:pt-10 pb-16 md:pb-24 md:px-[82px]">
        {state.step === 1 ? <PartnerStepCompany /> : null}
        {state.step === 2 ? <PartnerStepRepresentative /> : null}
        {state.step === 3 ? <PartnerStepVerification /> : null}
        {state.step === 4 ? <PartnerStepIntroVideo /> : null}
        {state.step === 5 ? <PartnerStepDrivers /> : null}
        {state.step === 6 ? <PartnerStepVehicles /> : null}
        {state.step === 7 ? <PartnerStepDocuments /> : null}
        {state.step === 8 ? <PartnerStepBilling /> : null}
        {state.step === 9 ? <PartnerStepPriceAgreement /> : null}
        {state.step === 10 ? <PartnerStepConfirmation /> : null}
      </div>
    </>
  )
}

export function PartnerApplication() {
  return (
    <PartnerApplicationProvider>
      <ApplicationView />
    </PartnerApplicationProvider>
  )
}
