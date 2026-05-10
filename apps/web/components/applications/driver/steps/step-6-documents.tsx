"use client"

import { useId, useState, type ChangeEvent } from "react"
import { Check, Image as ImageIcon, Upload, User, X } from "lucide-react"
import { useTranslations } from "next-intl"
import {
  ApplicationBottomBar,
  LightFileUpload,
  StepHeader,
} from "@/components/applications/shared"
import { useDriverApplication } from "../driver-application-context"

const PHOTO_MAX_MB = 5

function ProfessionalPhotoUploader({
  file,
  onChange,
  hint,
  removeLabel,
}: {
  file: File | null
  onChange: (file: File | null) => void
  hint: string
  removeLabel: string
}) {
  const inputId = useId()
  const previewUrl = file ? URL.createObjectURL(file) : null

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const next = e.target.files?.[0] ?? null
    if (next && next.size > PHOTO_MAX_MB * 1024 * 1024) {
      e.target.value = ""
      return
    }
    onChange(next)
    e.target.value = ""
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <label
        htmlFor={inputId}
        className="relative size-[82px] rounded-full bg-white border border-[rgba(28,27,24,0.08)] flex items-center justify-center cursor-pointer hover:border-[rgba(154,117,53,0.4)] transition-colors overflow-hidden"
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt="" className="absolute inset-0 size-full object-cover" />
        ) : (
          <User size={30} strokeWidth={1.4} className="text-[rgba(28,27,24,0.35)]" />
        )}
        <span className="absolute -bottom-1 -right-1 size-[23px] bg-[#a08248] flex items-center justify-center">
          <Upload size={12} strokeWidth={2} className="text-white" />
        </span>
        <input
          id={inputId}
          type="file"
          className="sr-only"
          accept="image/jpeg,image/png"
          onChange={handleChange}
        />
      </label>
      {file ? (
        <button
          type="button"
          onClick={() => onChange(null)}
          aria-label={removeLabel}
          className="inline-flex items-center gap-1 text-[10px] text-[#9b2c2c] hover:text-[#7a2222] transition-colors"
        >
          <X size={10} strokeWidth={2} /> {file.name.slice(0, 22)}
        </button>
      ) : (
        <span className="text-[10px] text-[#696969] leading-none">{hint}</span>
      )}
    </div>
  )
}

function GuidelinePill({ label }: { label: string }) {
  return (
    <span className="bg-[rgba(154,117,53,0.07)] border border-[rgba(154,117,53,0.22)] flex items-center gap-[6px] px-[9px] py-[7px]">
      <Check size={12} strokeWidth={1.25} className="text-[#9a7535] shrink-0" />
      <span className="text-[12px] font-medium text-[#9a7535] leading-normal">
        {label}
      </span>
    </span>
  )
}

export function DriverStepDocuments() {
  const t = useTranslations("driverApplication.stepDocuments")
  const tCommon = useTranslations("common")
  const { state, updateDocuments, nextStep, prevStep } = useDriverApplication()
  const { documents } = state
  const [, setError] = useState<string>("")

  const guidelines = ["upright", "smile", "shirt", "background"] as const
  const removeLabel = tCommon("remove") || "Remove"

  const canContinue =
    documents.professionalPhoto !== null &&
    documents.professionalLicense !== null &&
    documents.vehicleInsurance !== null &&
    documents.proofOfAddress !== null

  return (
    <form
      className="w-full max-w-[600px] mx-auto flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault()
        if (canContinue) nextStep()
      }}
    >
      <StepHeader title={t("title")} subtitle={t("subtitle")} />

      <div className="flex flex-col gap-3 w-full">
        <div className="flex items-start justify-between gap-3 w-full">
          <div className="flex flex-col gap-1">
            <span className="text-[12px] font-semibold text-[#1a1a1a] leading-none">
              {t("photo.label")}
            </span>
            <span className="text-[12px] text-[#696969] leading-[1.3]">
              {t("photo.sublabel")}
            </span>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#a08248] hover:text-[#8c6f3e] transition-colors shrink-0 mt-0.5"
          >
            <ImageIcon size={14} strokeWidth={1.6} />
            {t("photo.viewModel")}
          </button>
        </div>

        <div className="flex justify-center w-full">
          <ProfessionalPhotoUploader
            file={documents.professionalPhoto}
            onChange={(file) => updateDocuments({ professionalPhoto: file })}
            hint={t("photo.hint")}
            removeLabel={removeLabel}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-[9px] w-full">
          {guidelines.map((g) => (
            <GuidelinePill key={g} label={t(`photo.guidelines.${g}`)} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <span className="text-[12px] font-semibold text-[#1a1a1a]">
          {t("license.label")}
        </span>
        <LightFileUpload
          value={documents.professionalLicense}
          onChange={(file) => updateDocuments({ professionalLicense: file })}
          idleTitle={t("license.idleTitle")}
          idleSubtitle={t("documentHint")}
          removeLabel={removeLabel}
          onError={setError}
          sizeErrorLabel={t("sizeError")}
        />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <span className="text-[12px] font-semibold text-[#1a1a1a]">
          {t("insurance.label")}
        </span>
        <LightFileUpload
          value={documents.vehicleInsurance}
          onChange={(file) => updateDocuments({ vehicleInsurance: file })}
          idleTitle={t("insurance.idleTitle")}
          idleSubtitle={t("documentHint")}
          removeLabel={removeLabel}
          onError={setError}
          sizeErrorLabel={t("sizeError")}
        />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <span className="text-[12px] font-semibold text-[#1a1a1a]">
          {t("address.label")}
        </span>
        <LightFileUpload
          value={documents.proofOfAddress}
          onChange={(file) => updateDocuments({ proofOfAddress: file })}
          idleTitle={t("address.idleTitle")}
          idleSubtitle={t("documentHint")}
          removeLabel={removeLabel}
          onError={setError}
          sizeErrorLabel={t("sizeError")}
        />
        <span className="text-[12px] text-[#696969] leading-[1.3]">
          {t("address.hint")}
        </span>
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
