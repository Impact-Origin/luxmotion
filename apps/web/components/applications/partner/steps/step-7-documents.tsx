"use client"

import { useTranslations } from "next-intl"
import {
  ApplicationBottomBar,
  FieldLabel,
  LightFileUpload,
  StepHeader,
} from "@/components/applications/shared"
import {
  usePartnerApplication,
  type PartnerCompanyDocuments,
} from "../partner-application-context"

type DocumentKey = keyof PartnerCompanyDocuments

const DOCUMENTS: ReadonlyArray<DocumentKey> = [
  "license",
  "addressProofPrimary",
  "addressProofSecondary",
  "liabilityInsurance",
]

export function PartnerStepDocuments() {
  const t = useTranslations("partnerApplication.stepDocuments")
  const tCommon = useTranslations("common")
  const { state, updateDocuments, nextStep, prevStep } = usePartnerApplication()
  const { documents } = state

  return (
    <form
      className="w-full max-w-[600px] mx-auto flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault()
        nextStep()
      }}
    >
      <StepHeader title={t("title")} subtitle={t("subtitle")} />

      {DOCUMENTS.map((key) => (
        <div key={key} className="flex flex-col gap-2 w-full">
          <FieldLabel>{t(`fields.${key}.label`)}</FieldLabel>
          <LightFileUpload
            value={documents[key]}
            onChange={(file) => updateDocuments({ [key]: file } as Partial<PartnerCompanyDocuments>)}
            idleTitle={t(`fields.${key}.idleTitle`)}
            idleSubtitle={t("idleSubtitle")}
            removeLabel={t("removeFile")}
            sizeErrorLabel={t("sizeError")}
          />
        </div>
      ))}

      <ApplicationBottomBar
        backLabel={tCommon("back")}
        continueLabel={tCommon("continue")}
        onBack={prevStep}
        canContinue
      />
    </form>
  )
}
