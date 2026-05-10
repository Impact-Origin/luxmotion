"use client"

import { useEffect, useState, type FormEvent } from "react"
import { X } from "lucide-react"
import { useTranslations } from "next-intl"
import {
  FieldLabel,
  LightButton,
  LightInput,
  LightSelect,
  SERIF_FONT,
} from "@/components/applications/shared"
import type { PartnerVehicleEntry } from "../partner-application-context"

export const VEHICLE_CATEGORY_VALUES = [
  "classic",
  "supercar",
  "firstClass",
  "businessClass",
  "van",
  "firstClassVan",
  "vanLuxury",
  "minibus",
  "autocarro",
] as const

type VehicleDraft = Omit<PartnerVehicleEntry, "id">

interface VehicleFormModalProps {
  open: boolean
  onClose: () => void
  onSave: (entry: VehicleDraft) => void
  initial?: VehicleDraft
}

const EMPTY_DRAFT: VehicleDraft = {
  make: "",
  model: "",
  licensePlate: "",
  category: "",
}

export function VehicleFormModal({ open, onClose, onSave, initial }: VehicleFormModalProps) {
  const t = useTranslations("partnerApplication.stepVehicles")
  const tCat = useTranslations("driverApplication.stepVehicleCategory.categories")
  const tCommon = useTranslations("common")

  const [draft, setDraft] = useState<VehicleDraft>(initial ?? EMPTY_DRAFT)

  useEffect(() => {
    if (open) setDraft(initial ?? EMPTY_DRAFT)
  }, [open, initial])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  if (!open) return null

  const canSave =
    draft.make.trim().length > 0 &&
    draft.model.trim().length > 0 &&
    draft.licensePlate.trim().length > 0 &&
    draft.category.length > 0

  const categoryOptions = VEHICLE_CATEGORY_VALUES.map((value) => ({
    value,
    label: tCat(`${value}.title`),
  }))

  function commit() {
    if (!canSave) return
    onSave({
      make: draft.make.trim(),
      model: draft.model.trim(),
      licensePlate: draft.licensePlate.trim().toUpperCase(),
      category: draft.category,
    })
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    e.stopPropagation()
    commit()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      <div
        className="absolute inset-0 bg-[rgba(15,14,12,0.55)]"
        onClick={onClose}
        aria-hidden
      />
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-[520px] max-h-full overflow-y-auto bg-[#f7f4ee] border border-[rgba(28,27,24,0.08)] flex flex-col gap-6 p-6 md:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1 min-w-0">
            <h2
              className="text-[24px] md:text-[28px] leading-[1.1] text-[#1c1b18]"
              style={SERIF_FONT}
            >
              {t("modalTitle")}
            </h2>
            <p className="text-[13px] text-[#696969] leading-[1.4]">
              {t("modalSubtitle")}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={tCommon("close")}
            className="shrink-0 size-8 flex items-center justify-center text-[#696969] hover:text-[#1c1b18] transition-colors"
          >
            <X size={18} strokeWidth={1.6} />
          </button>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col gap-2">
              <FieldLabel required>{t("fields.make.label")}</FieldLabel>
              <LightInput
                value={draft.make}
                onChange={(e) => setDraft((d) => ({ ...d, make: e.target.value }))}
                placeholder={t("fields.make.placeholder")}
                autoFocus
              />
            </label>
            <label className="flex flex-col gap-2">
              <FieldLabel required>{t("fields.model.label")}</FieldLabel>
              <LightInput
                value={draft.model}
                onChange={(e) => setDraft((d) => ({ ...d, model: e.target.value }))}
                placeholder={t("fields.model.placeholder")}
              />
            </label>
          </div>

          <label className="flex flex-col gap-2">
            <FieldLabel required>{t("fields.licensePlate.label")}</FieldLabel>
            <LightInput
              value={draft.licensePlate}
              onChange={(e) =>
                setDraft((d) => ({ ...d, licensePlate: e.target.value.toUpperCase() }))
              }
              placeholder={t("fields.licensePlate.placeholder")}
              className="uppercase tracking-[1.5px]"
            />
          </label>

          <div className="flex flex-col gap-2">
            <FieldLabel required>{t("fields.category.label")}</FieldLabel>
            <LightSelect
              value={draft.category}
              onChange={(value) => setDraft((d) => ({ ...d, category: value }))}
              placeholder={t("fields.category.placeholder")}
              options={categoryOptions}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <LightButton variant="outline" size="md" onClick={onClose}>
            {tCommon("cancel")}
          </LightButton>
          <LightButton type="button" variant="primary" size="md" disabled={!canSave} onClick={commit}>
            {t("saveVehicle")}
          </LightButton>
        </div>
      </form>
    </div>
  )
}
