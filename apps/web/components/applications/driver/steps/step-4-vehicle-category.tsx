"use client"

import { useTranslations } from "next-intl"
import {
  ApplicationBottomBar,
  SelectableMediaCard,
  StepHeader,
} from "@/components/applications/shared"
import { useDriverApplication } from "../driver-application-context"

interface CategoryDef {
  value: string
  image: string
}

const CATEGORIES: CategoryDef[] = [
  { value: "classic", image: "/fleet/cat-standard.png" },
  { value: "supercar", image: "/fleet/cat-executivo.png" },
  { value: "firstClass", image: "/fleet/cat-xl.png" },
  { value: "businessClass", image: "/fleet/cat-executivo.png" },
  { value: "van", image: "/fleet/cat-van.png" },
  { value: "firstClassVan", image: "/fleet/cat-van.png" },
  { value: "vanLuxury", image: "/fleet/cat-van.png" },
  { value: "minibus", image: "/fleet/cat-minibus.png" },
  { value: "autocarro", image: "/fleet/cat-bus.png" },
]

export function DriverStepVehicleCategory() {
  const t = useTranslations("driverApplication.stepVehicleCategory")
  const tCommon = useTranslations("common")
  const { state, updateVehicle, nextStep, prevStep } = useDriverApplication()
  const { vehicle } = state

  const canContinue = vehicle.category.length > 0

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
        {CATEGORIES.map((cat) => (
          <SelectableMediaCard
            key={cat.value}
            imageSrc={cat.image}
            imageAlt={t(`categories.${cat.value}.title`)}
            title={t(`categories.${cat.value}.title`)}
            description={t(`categories.${cat.value}.description`)}
            selected={vehicle.category === cat.value}
            onSelect={() => updateVehicle({ category: cat.value })}
          />
        ))}
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
