"use client"

import { useTranslations } from "next-intl"
import {
  ApplicationBottomBar,
  FieldLabel,
  LightFileUpload,
  LightInput,
  StepHeader,
} from "@/components/applications/shared"
import {
  usePartnerApplication,
  type PartnerBillingData,
} from "../partner-application-context"

type TextField = Exclude<keyof PartnerBillingData, "bankProof">

export function PartnerStepBilling() {
  const t = useTranslations("partnerApplication.stepBilling")
  const tCommon = useTranslations("common")
  const { state, updateBilling, nextStep, prevStep } = usePartnerApplication()
  const { billing } = state

  function setField(field: TextField, value: string) {
    updateBilling({ [field]: value } as Partial<PartnerBillingData>)
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

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel>{t("accountHolder.label")}</FieldLabel>
        <LightInput
          value={billing.accountHolder}
          onChange={(e) => setField("accountHolder", e.target.value)}
          placeholder={t("accountHolder.placeholder")}
          name="accountHolder"
          autoComplete="off"
        />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel>{t("invoiceName.label")}</FieldLabel>
        <LightInput
          value={billing.invoiceName}
          onChange={(e) => setField("invoiceName", e.target.value)}
          placeholder={t("invoiceName.placeholder")}
          name="invoiceName"
          autoComplete="off"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-6 w-full">
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <FieldLabel>{t("swiftBic.label")}</FieldLabel>
          <LightInput
            value={billing.swiftBic}
            onChange={(e) => setField("swiftBic", e.target.value)}
            placeholder={t("swiftBic.placeholder")}
            name="swiftBic"
            autoComplete="off"
            inputMode="text"
          />
        </div>
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <FieldLabel>{t("iban.label")}</FieldLabel>
          <LightInput
            value={billing.iban}
            onChange={(e) => setField("iban", e.target.value)}
            placeholder={t("iban.placeholder")}
            name="iban"
            autoComplete="off"
            inputMode="text"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel>{t("taxId.label")}</FieldLabel>
        <LightInput
          value={billing.taxId}
          onChange={(e) => setField("taxId", e.target.value)}
          placeholder={t("taxId.placeholder")}
          name="taxId"
          inputMode="numeric"
          autoComplete="off"
        />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel>{t("taxOffice.label")}</FieldLabel>
        <LightInput
          value={billing.taxOffice}
          onChange={(e) => setField("taxOffice", e.target.value)}
          placeholder={t("taxOffice.placeholder")}
          name="taxOffice"
          autoComplete="off"
        />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel>{t("billingAddress.label")}</FieldLabel>
        <LightInput
          value={billing.billingAddress}
          onChange={(e) => setField("billingAddress", e.target.value)}
          placeholder={t("billingAddress.placeholder")}
          name="billingAddress"
          autoComplete="street-address"
        />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel>{t("bankProof.label")}</FieldLabel>
        <LightFileUpload
          value={billing.bankProof}
          onChange={(file) => updateBilling({ bankProof: file })}
          idleTitle={t("bankProof.idleTitle")}
          idleSubtitle={t("bankProof.idleSubtitle")}
          removeLabel={t("bankProof.removeFile")}
          sizeErrorLabel={t("bankProof.sizeError")}
        />
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
