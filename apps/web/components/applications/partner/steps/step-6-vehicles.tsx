"use client"

import { Car, Plus, X } from "lucide-react"
import { useTranslations } from "next-intl"
import {
  ApplicationBottomBar,
  LightButton,
  StepHeader,
} from "@/components/applications/shared"
import { usePartnerApplication, type PartnerVehicleEntry } from "../partner-application-context"

function vehicleDisplayName(vehicle: PartnerVehicleEntry, fallback: string): string {
  return [vehicle.make, vehicle.model].filter(Boolean).join(" ").trim() || fallback
}

export function PartnerStepVehicles() {
  const t = useTranslations("partnerApplication.stepVehicles")
  const tCommon = useTranslations("common")
  const { state, removeVehicle, nextStep, prevStep } = usePartnerApplication()
  const vehicles = state.vehicles

  function handleAddVehicle() {
    // Vehicle creation modal will land in a future step.
  }

  return (
    <form
      className="w-full max-w-[600px] mx-auto flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault()
        nextStep()
      }}
    >
      <StepHeader title={t("title")} subtitle={t("subtitle")} />

      <div className="flex flex-col gap-4 w-full">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="flex items-center gap-4 bg-white p-4 w-full"
          >
            <div className="flex-1 min-w-0 flex items-center gap-4">
              <div className="size-8 shrink-0 bg-[rgba(201,169,110,0.08)] border-[0.727px] border-[rgba(201,169,110,0.18)] flex items-center justify-center text-[#a08248]">
                <Car size={17} strokeWidth={1.6} />
              </div>
              <p className="flex-1 min-w-0 text-[12px] font-semibold text-[#1a1a1a] truncate leading-none">
                {vehicleDisplayName(vehicle, t("untitledVehicle"))}
              </p>
            </div>
            <button
              type="button"
              onClick={() => removeVehicle(vehicle.id)}
              aria-label={t("removeVehicle")}
              className="size-8 shrink-0 bg-[rgba(155,44,44,0.08)] border-[0.727px] border-[rgba(155,44,44,0.1)] flex items-center justify-center text-[#9b2c2c] hover:bg-[rgba(155,44,44,0.14)] transition-colors"
            >
              <X size={16} strokeWidth={2} />
            </button>
          </div>
        ))}

        <LightButton
          variant="softGold"
          size="lg"
          onClick={handleAddVehicle}
          iconRight={<Plus size={18} strokeWidth={1.6} />}
          className="w-full"
        >
          {t("addVehicle")}
        </LightButton>
      </div>

      <ApplicationBottomBar
        backLabel={tCommon("back")}
        continueLabel={tCommon("continue")}
        onBack={prevStep}
        canContinue
      />
    </form>
  )
}
