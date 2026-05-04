"use client"

import { ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"
import {
  FieldLabel,
  LightButton,
  LightSelect,
  LightToggleGroup,
  OperatingZonesInput,
  StepHeader,
} from "@/components/applications/shared"
import { usePartnerApplication, type YesNo } from "../partner-application-context"

export function PartnerStepCompany() {
  const t = useTranslations("partnerApplication.stepCompany")
  const tCommon = useTranslations("common")
  const { state, updateCompany, nextStep } = usePartnerApplication()
  const { company } = state

  const driverCountOptions = [
    { value: "1-5", label: t("driverCount.options.s1to5") },
    { value: "6-15", label: t("driverCount.options.s6to15") },
    { value: "16-30", label: t("driverCount.options.s16to30") },
    { value: "31-50", label: t("driverCount.options.s31to50") },
    { value: "50+", label: t("driverCount.options.s50plus") },
  ]

  const yesNoOptions: { value: YesNo; label: string }[] = [
    { value: "yes", label: tCommon("yes") },
    { value: "no", label: tCommon("no") },
  ]

  const canContinue =
    company.operatingZones.length > 0 &&
    company.driverCount.length > 0 &&
    company.driversComfortableWithMobile !== null

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
        <FieldLabel required sublabel={t("zones.sublabel")}>
          {t("zones.label")}
        </FieldLabel>
        <OperatingZonesInput
          zones={company.operatingZones}
          onChange={(zones) => updateCompany({ operatingZones: zones })}
          placeholder={t("zones.placeholder")}
          addLabel={tCommon("add")}
        />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel>{t("driverCount.label")}</FieldLabel>
        <LightSelect
          value={company.driverCount}
          onChange={(value) => updateCompany({ driverCount: value })}
          placeholder={t("driverCount.placeholder")}
          options={driverCountOptions}
        />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel>{t("mobileApp.label")}</FieldLabel>
        <LightToggleGroup<YesNo>
          value={company.driversComfortableWithMobile}
          onChange={(value) => updateCompany({ driversComfortableWithMobile: value })}
          options={yesNoOptions}
          ariaLabel={t("mobileApp.label")}
        />
      </div>

      <LightButton
        type="submit"
        size="lg"
        disabled={!canContinue}
        iconRight={<ArrowRight size={18} strokeWidth={1.6} />}
        className="w-full"
      >
        {tCommon("continue")}
      </LightButton>
    </form>
  )
}
