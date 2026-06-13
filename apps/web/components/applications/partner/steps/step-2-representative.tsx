"use client"

import { useTranslations } from "next-intl"
import { PhoneInput } from "@/components/ui/phone-input"
import {
  ApplicationBottomBar,
  FieldLabel,
  LightInput,
  StepHeader,
} from "@/components/applications/shared"
import { usePartnerApplication } from "../partner-application-context"

export function PartnerStepRepresentative() {
  const t = useTranslations("partnerApplication.stepRepresentative")
  const tCommon = useTranslations("common")
  const { state, updateRepresentative, nextStep, prevStep } = usePartnerApplication()
  const { representative } = state

  const canContinue =
    representative.companyName.trim().length > 0 &&
    representative.fullName.trim().length > 0 &&
    representative.email.trim().length > 0 &&
    representative.phone.trim().length > 0 &&
    representative.whatsapp.trim().length > 0

  return (
    <form
      className="w-full max-w-[600px] mx-auto flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault()
        if (canContinue) nextStep()
      }}
    >
      <StepHeader title={t("title")} subtitle={t("subtitle")} />

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel required>{t("companyName.label")}</FieldLabel>
        <LightInput
          value={representative.companyName}
          onChange={(e) => updateRepresentative({ companyName: e.target.value })}
          placeholder={t("companyName.placeholder")}
          name="companyName"
          autoComplete="organization"
        />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel required>{t("fullName.label")}</FieldLabel>
        <LightInput
          value={representative.fullName}
          onChange={(e) => updateRepresentative({ fullName: e.target.value })}
          placeholder={t("fullName.placeholder")}
          name="fullName"
          autoComplete="name"
        />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel required>{t("email.label")}</FieldLabel>
        <LightInput
          type="email"
          value={representative.email}
          onChange={(e) => updateRepresentative({ email: e.target.value })}
          placeholder={t("email.placeholder")}
          name="email"
          autoComplete="email"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full">
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <FieldLabel required>{t("phone.label")}</FieldLabel>
          <PhoneInput
            value={representative.phone}
            onChange={(value) => updateRepresentative({ phone: value })}
            partner
            required
          />
        </div>
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <FieldLabel required>{t("whatsapp.label")}</FieldLabel>
          <PhoneInput
            value={representative.whatsapp}
            onChange={(value) => updateRepresentative({ whatsapp: value })}
            partner
            required
          />
        </div>
      </div>

      <ApplicationBottomBar
        backLabel={tCommon("back")}
        continueLabel={tCommon("continue")}
        onBack={prevStep}
        canContinue={canContinue}
      />
    </form>
  )
}
