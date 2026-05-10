"use client"

import { useTranslations } from "next-intl"
import { ApplicationProgress } from "@/components/applications/shared"
import {
  DriverApplicationProvider,
  useDriverApplication,
  DRIVER_TOTAL_STEPS,
} from "./driver-application-context"
import { DriverIntro } from "./driver-intro"
import { DriverSuccess } from "./driver-success"
import { DriverStepZone } from "./steps/step-1-zone"
import { DriverStepContact } from "./steps/step-2-contact"
import { DriverStepVerifyEmail } from "./steps/step-3-verify-email"
import { DriverStepVehicleCategory } from "./steps/step-4-vehicle-category"
import { DriverStepVehicleDetails } from "./steps/step-5-vehicle-details"
import { DriverStepDocuments } from "./steps/step-6-documents"
import { DriverStepBilling } from "./steps/step-7-billing"
import { DriverStepAvailability } from "./steps/step-8-availability"
import { DriverStepVideoIntro } from "./steps/step-9-video-intro"
import { DriverStepTerms } from "./steps/step-10-terms"

const STEP_LABEL_KEY: Record<number, string> = {
  1: "zone",
  2: "contact",
  3: "verifyEmail",
  4: "vehicleCategory",
  5: "vehicleDetails",
  6: "documents",
  7: "billing",
  8: "availability",
  9: "videoIntro",
  10: "terms",
}

function ApplicationView() {
  const t = useTranslations("driverApplication.steps")
  const { state } = useDriverApplication()

  if (state.terms.submitted) {
    return (
      <div className="flex-1 flex items-start justify-center px-4 pt-10 pb-32 md:pt-16 md:pb-48 md:px-[82px]">
        <DriverSuccess />
      </div>
    )
  }

  if (state.step === 0) {
    return (
      <div className="flex-1 flex items-center justify-center px-4 py-20 md:py-32 md:px-[82px]">
        <DriverIntro />
      </div>
    )
  }

  const labelKey = STEP_LABEL_KEY[state.step] ?? "zone"

  return (
    <>
      <ApplicationProgress
        label={t(labelKey)}
        currentStep={state.step}
        totalSteps={DRIVER_TOTAL_STEPS}
      />
      <div className="flex-1 flex items-start justify-center px-4 pt-6 pb-32 md:pt-10 md:pb-48 md:px-[82px]">
        {state.step === 1 ? <DriverStepZone /> : null}
        {state.step === 2 ? <DriverStepContact /> : null}
        {state.step === 3 ? <DriverStepVerifyEmail /> : null}
        {state.step === 4 ? <DriverStepVehicleCategory /> : null}
        {state.step === 5 ? <DriverStepVehicleDetails /> : null}
        {state.step === 6 ? <DriverStepDocuments /> : null}
        {state.step === 7 ? <DriverStepBilling /> : null}
        {state.step === 8 ? <DriverStepAvailability /> : null}
        {state.step === 9 ? <DriverStepVideoIntro /> : null}
        {state.step === 10 ? <DriverStepTerms /> : null}
      </div>
    </>
  )
}

export function DriverApplication() {
  return (
    <DriverApplicationProvider>
      <ApplicationView />
    </DriverApplicationProvider>
  )
}
