"use client"

import { Plus, Trash2, Video, VideoOff } from "lucide-react"
import { useTranslations } from "next-intl"
import {
  ApplicationBottomBar,
  LightButton,
  StepHeader,
} from "@/components/applications/shared"
import { usePartnerApplication } from "../partner-application-context"

export function PartnerStepDrivers() {
  const t = useTranslations("partnerApplication.stepDrivers")
  const tCommon = useTranslations("common")
  const { state, removeDriver, nextStep, prevStep } = usePartnerApplication()
  const drivers = state.drivers

  function handleAddDriver() {
    // Driver creation modal will land in a future step.
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

      {drivers.length > 0 ? (
        <div className="flex flex-col gap-2 w-full">
          {drivers.map((driver) => (
            <div
              key={driver.id}
              className="flex items-center gap-3 bg-white border border-[rgba(28,27,24,0.08)] px-4 py-3"
            >
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <p className="text-[14px] font-semibold text-[#1c1b18] truncate leading-tight">
                  {driver.fullName}
                </p>
                <p className="text-[12px] text-[#696969] truncate leading-tight">
                  {driver.email}
                </p>
              </div>
              <span
                className="inline-flex items-center gap-1 text-[12px] font-medium text-[#a08248]"
                aria-label={driver.hasVideo ? t("hasVideoYes") : t("hasVideoNo")}
              >
                {driver.hasVideo ? (
                  <Video size={14} strokeWidth={1.6} />
                ) : (
                  <VideoOff size={14} strokeWidth={1.6} className="text-[#696969]" />
                )}
              </span>
              <button
                type="button"
                onClick={() => removeDriver(driver.id)}
                aria-label={t("removeDriver")}
                className="p-1.5 text-[#696969] hover:text-[#1c1b18] transition-colors"
              >
                <Trash2 size={16} strokeWidth={1.6} />
              </button>
            </div>
          ))}
        </div>
      ) : null}

      <LightButton
        variant="softGold"
        size="lg"
        onClick={handleAddDriver}
        iconRight={<Plus size={18} strokeWidth={1.6} />}
        className="w-full"
      >
        {t("addDriver")}
      </LightButton>

      <ApplicationBottomBar
        backLabel={tCommon("back")}
        continueLabel={tCommon("continue")}
        onBack={prevStep}
        canContinue
      />
    </form>
  )
}
