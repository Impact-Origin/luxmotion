"use client"

import { useTranslations } from "next-intl"
import {
  ApplicationBottomBar,
  FieldLabel,
  LanguageProficiencyInput,
  LightInput,
  StepHeader,
  type LanguageLevel,
} from "@/components/applications/shared"
import { PhoneInput } from "@/components/ui/phone-input"
import { useDriverApplication } from "../driver-application-context"

const LANGUAGE_OPTIONS = [
  "pt",
  "en",
  "es",
  "fr",
  "de",
  "it",
  "nl",
] as const

const LEVEL_VALUES: LanguageLevel[] = ["survival", "intermediate", "fluent"]

export function DriverStepContact() {
  const t = useTranslations("driverApplication.stepContact")
  const tCommon = useTranslations("common")
  const { state, updateContact, nextStep, prevStep } = useDriverApplication()
  const { contact } = state

  const languageOptions = LANGUAGE_OPTIONS.map((code) => ({
    value: code,
    label: t(`languages.${code}`),
  }))

  const levelOptions = LEVEL_VALUES.map((value) => ({
    value,
    label: t(`levels.${value}`),
  }))

  const canContinue =
    contact.fullName.trim().length > 0 &&
    contact.email.trim().length > 0 &&
    contact.representativeEmail.trim().length > 0 &&
    contact.phone.length > 3 &&
    contact.whatsapp.length > 3

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
        <FieldLabel required>{t("fullName.label")}</FieldLabel>
        <LightInput
          type="text"
          autoComplete="name"
          placeholder={t("fullName.placeholder")}
          value={contact.fullName}
          onChange={(e) => updateContact({ fullName: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel required>{t("email.label")}</FieldLabel>
        <LightInput
          type="email"
          autoComplete="email"
          placeholder={t("email.placeholder")}
          value={contact.email}
          onChange={(e) => updateContact({ email: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel required>{t("representativeEmail.label")}</FieldLabel>
        <LightInput
          type="email"
          placeholder={t("representativeEmail.placeholder")}
          value={contact.representativeEmail}
          onChange={(e) => updateContact({ representativeEmail: e.target.value })}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <FieldLabel required>{t("phone.label")}</FieldLabel>
          <PhoneInput
            partner
            value={contact.phone}
            onChange={(value) => updateContact({ phone: value })}
            autoComplete="tel"
          />
        </div>
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <FieldLabel required>{t("whatsapp.label")}</FieldLabel>
          <PhoneInput
            partner
            value={contact.whatsapp}
            onChange={(value) => updateContact({ whatsapp: value })}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel>{t("languages.label")}</FieldLabel>
        <LanguageProficiencyInput
          value={contact.languages}
          onChange={(languages) => updateContact({ languages })}
          languageOptions={languageOptions}
          levelOptions={levelOptions}
          addPlaceholder={t("languages.placeholder")}
          addLabel={tCommon("add")}
        />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel>
          {t("referral.label")}{" "}
          <span className="font-normal text-[#696969]">{t("referral.optional")}</span>
        </FieldLabel>
        <LightInput
          type="text"
          placeholder={t("referral.placeholder")}
          value={contact.referral}
          onChange={(e) => updateContact({ referral: e.target.value })}
        />
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
