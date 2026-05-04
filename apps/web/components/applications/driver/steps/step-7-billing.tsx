"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import {
  ApplicationBottomBar,
  FieldLabel,
  LightFileUpload,
  LightInput,
  StepHeader,
} from "@/components/applications/shared"
import { useDriverApplication } from "../driver-application-context"

export function DriverStepBilling() {
  const t = useTranslations("driverApplication.stepBilling")
  const tCommon = useTranslations("common")
  const { state, updateBilling, nextStep, prevStep } = useDriverApplication()
  const { billing } = state
  const [, setError] = useState<string>("")

  const removeLabel = tCommon("remove") || "Remove"

  const canContinue =
    billing.accountHolder.trim().length > 0 &&
    billing.invoiceName.trim().length > 0 &&
    billing.swiftBic.trim().length > 0 &&
    billing.iban.trim().length > 0 &&
    billing.nif.trim().length > 0 &&
    billing.taxOffice.trim().length > 0 &&
    billing.billingAddress.trim().length > 0 &&
    billing.bankProof !== null

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
        <FieldLabel>{t("accountHolder.label")}</FieldLabel>
        <LightInput
          type="text"
          autoComplete="cc-name"
          placeholder={t("accountHolder.placeholder")}
          value={billing.accountHolder}
          onChange={(e) => updateBilling({ accountHolder: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel>{t("invoiceName.label")}</FieldLabel>
        <LightInput
          type="text"
          placeholder={t("invoiceName.placeholder")}
          value={billing.invoiceName}
          onChange={(e) => updateBilling({ invoiceName: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        <div className="flex flex-col gap-2">
          <FieldLabel>{t("swiftBic.label")}</FieldLabel>
          <LightInput
            type="text"
            placeholder={t("swiftBic.placeholder")}
            value={billing.swiftBic}
            onChange={(e) => updateBilling({ swiftBic: e.target.value.toUpperCase() })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel>{t("iban.label")}</FieldLabel>
          <LightInput
            type="text"
            placeholder={t("iban.placeholder")}
            value={billing.iban}
            onChange={(e) => updateBilling({ iban: e.target.value.toUpperCase() })}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel>{t("nif.label")}</FieldLabel>
        <LightInput
          type="text"
          inputMode="numeric"
          placeholder={t("nif.placeholder")}
          value={billing.nif}
          onChange={(e) => updateBilling({ nif: e.target.value.replace(/[^\d\s]/g, "") })}
        />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel>{t("taxOffice.label")}</FieldLabel>
        <LightInput
          type="text"
          placeholder={t("taxOffice.placeholder")}
          value={billing.taxOffice}
          onChange={(e) => updateBilling({ taxOffice: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel>{t("billingAddress.label")}</FieldLabel>
        <LightInput
          type="text"
          autoComplete="street-address"
          placeholder={t("billingAddress.placeholder")}
          value={billing.billingAddress}
          onChange={(e) => updateBilling({ billingAddress: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel>{t("bankProof.label")}</FieldLabel>
        <LightFileUpload
          value={billing.bankProof}
          onChange={(file) => updateBilling({ bankProof: file })}
          idleTitle={t("bankProof.idleTitle")}
          idleSubtitle={t("documentHint")}
          removeLabel={removeLabel}
          onError={setError}
          sizeErrorLabel={t("sizeError")}
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
