"use client"

import { ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"
import {
  FieldLabel,
  LightButton,
  LightSelect,
  StepHeader,
} from "@/components/applications/shared"
import { useDriverApplication } from "../driver-application-context"

const ZONE_OPTIONS = [
  "aveiro",
  "beja",
  "braga",
  "braganca",
  "castelo-branco",
  "coimbra",
  "evora",
  "faro",
  "guarda",
  "leiria",
  "lisboa",
  "portalegre",
  "porto",
  "santarem",
  "setubal",
  "viana-do-castelo",
  "vila-real",
  "viseu",
  "acores",
  "madeira",
] as const

export function DriverStepZone() {
  const t = useTranslations("driverApplication.stepZone")
  const tCommon = useTranslations("common")
  const { state, updateZone, nextStep } = useDriverApplication()

  const options = ZONE_OPTIONS.map((value) => ({
    value,
    label: t(`zones.${value}`),
  }))

  const canContinue = state.zone.operatingZone.length > 0

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
        <FieldLabel>{t("zone.label")}</FieldLabel>
        <LightSelect
          value={state.zone.operatingZone}
          onChange={(value) => updateZone({ operatingZone: value })}
          placeholder={t("zone.placeholder")}
          options={options}
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
