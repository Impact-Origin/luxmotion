"use client"

import Link from "next/link"
import { Check } from "lucide-react"
import { useTranslations } from "next-intl"
import { useMutation } from "convex/react"
import { api } from "@workspace/convex/api"
import type { Id } from "@workspace/convex/dataModel"
import {
  ApplicationBottomBar,
  LightButton,
  StepHeader,
} from "@/components/applications/shared"
import {
  usePartnerApplication,
  type PartnerApplicationState,
} from "../partner-application-context"

const SERIF_FONT = {
  fontFamily: "var(--font-title), 'Cormorant Garamond', serif",
} as const

type StorageId = Id<"_storage">

function TermsCheckbox({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (next: boolean) => void
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="size-6 shrink-0 flex items-center justify-center"
    >
      <span
        className="size-[18px] rounded-[2px] border bg-[rgba(154,117,53,0.22)] border-[rgba(154,117,53,0.22)] flex items-center justify-center transition-colors"
      >
        {checked ? (
          <svg
            width="10"
            height="8"
            viewBox="0 0 10.4062 7.7793"
            fill="none"
            stroke="#A08248"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M9.40625 1L3.62695 6.7793L1 4.15234" />
          </svg>
        ) : null}
      </span>
    </button>
  )
}

function SummaryRow({
  label,
  isLast,
}: {
  label: string
  isLast?: boolean
}) {
  return (
    <div
      className={
        "flex items-center gap-2.5 w-full pb-2" +
        (isLast ? "" : " border-b border-[rgba(28,27,24,0.08)]")
      }
    >
      <span className="size-[34px] shrink-0 rounded-full bg-[#e8ebe2] flex items-center justify-center">
        <Check size={14} strokeWidth={2.2} className="text-[#5a8a3e]" />
      </span>
      <span className="text-[12px] text-[#0d0d0d]">{label}</span>
    </div>
  )
}

function PartnerSubmittedView() {
  const t = useTranslations("partnerApplication.stepConfirmation.submitted")
  const { state } = usePartnerApplication()

  const driverCount = state.drivers.length
  const vehicleCount = state.vehicles.length
  const queuePosition = state.confirmation.queuePosition ?? 0

  const summaryItems: string[] = [
    t("summary.companyAndRepresentative"),
    t("summary.emailVerified"),
    t("summary.driversAdded", { count: driverCount }),
    t("summary.vehiclesAdded", { count: vehicleCount }),
    t("summary.documentsAndBilling"),
    t("summary.priceAgreement"),
    t("summary.introVideo"),
  ]

  return (
    <div className="w-full max-w-[600px] mx-auto flex flex-col items-center gap-6">
      <span className="size-[64px] rounded-full bg-[rgba(154,117,53,0.07)] flex items-center justify-center">
        <Check size={26} strokeWidth={2} className="text-[#a08248]" />
      </span>

      <div className="flex flex-col gap-2 w-full">
        <h1
          className="text-[32px] leading-none text-[#1c1b18] text-center font-medium"
          style={SERIF_FONT}
        >
          {t("title")}
        </h1>
        <p className="text-[14px] leading-[1.3] text-[#696969]">{t("subtitle")}</p>
      </div>

      <div className="bg-[#0d0d0d] flex flex-col gap-2 px-6 py-4 w-full text-center">
        <p
          className="text-[48px] leading-[1.2] font-semibold text-[#a08248]"
          style={SERIF_FONT}
        >
          #{queuePosition}
        </p>
        <p className="text-[14px] italic leading-[1.2] text-[#999] whitespace-pre-line">
          {t("queueDescription", { position: queuePosition })}
        </p>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-center pb-2 border-b border-[rgba(28,27,24,0.08)]">
          <span className="text-[12px] font-medium uppercase tracking-[1.1px] text-[#696969]">
            {t("summaryHeader")}
          </span>
        </div>
        {summaryItems.map((label, idx) => (
          <SummaryRow key={idx} label={label} isLast={idx === summaryItems.length - 1} />
        ))}
      </div>

      <Link href="/" className="inline-flex">
        <LightButton size="lg" type="button">
          {t("backHome")}
        </LightButton>
      </Link>
    </div>
  )
}

async function uploadFileToConvex(
  generateUploadUrl: () => Promise<string>,
  file: File,
): Promise<StorageId> {
  const url = await generateUploadUrl()
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": file.type },
    body: file,
  })
  if (!res.ok) throw new Error(`Upload failed (${res.status})`)
  const json = (await res.json()) as { storageId: StorageId }
  return json.storageId
}

async function buildSubmissionPayload(
  state: PartnerApplicationState,
  generateUploadUrl: () => Promise<string>,
) {
  const upload = (file: File | null) =>
    file ? uploadFileToConvex(generateUploadUrl, file) : Promise.resolve(undefined)

  const [
    documentLicenseId,
    documentAddressProofPrimaryId,
    documentAddressProofSecondaryId,
    documentLiabilityInsuranceId,
    billingBankProofId,
  ] = await Promise.all([
    upload(state.documents.license),
    upload(state.documents.addressProofPrimary),
    upload(state.documents.addressProofSecondary),
    upload(state.documents.liabilityInsurance),
    upload(state.billing.bankProof),
  ])

  return {
    operatingZones: state.company.operatingZones,
    driverCount: state.company.driverCount,
    driversComfortableWithMobile:
      state.company.driversComfortableWithMobile ?? "no",

    companyName: state.representative.companyName,
    representativeFullName: state.representative.fullName,
    representativeEmail: state.representative.email,
    representativePhone: state.representative.phone,
    representativeWhatsapp: state.representative.whatsapp,

    drivers: state.drivers.map((d) => ({
      fullName: d.fullName,
      email: d.email,
      phone: d.phone,
      hasVideo: d.hasVideo,
    })),
    vehicles: state.vehicles.map((v) => ({
      make: v.make,
      model: v.model,
      licensePlate: v.licensePlate,
      category: v.category,
    })),

    documentLicenseId,
    documentAddressProofPrimaryId,
    documentAddressProofSecondaryId,
    documentLiabilityInsuranceId,

    billingAccountHolder: state.billing.accountHolder,
    billingInvoiceName: state.billing.invoiceName,
    billingSwiftBic: state.billing.swiftBic,
    billingIban: state.billing.iban,
    billingTaxId: state.billing.taxId,
    billingTaxOffice: state.billing.taxOffice,
    billingAddress: state.billing.billingAddress,
    billingBankProofId,

    priceAgreementAcknowledged: state.priceAgreement.acknowledged,
    termsAccepted: state.confirmation.acceptedTerms,
  }
}

export function PartnerStepConfirmation() {
  const t = useTranslations("partnerApplication.stepConfirmation")
  const tCommon = useTranslations("common")
  const {
    state,
    setAcceptedTerms,
    setSubmitting,
    setSubmissionError,
    markSubmitted,
    prevStep,
  } = usePartnerApplication()
  const { confirmation } = state

  const generateUploadUrl = useMutation(api.partnerApplications.generateUploadUrl)
  const submitMutation = useMutation(api.partnerApplications.submit)

  async function handleSubmit() {
    if (!confirmation.acceptedTerms || confirmation.submitting) return
    setSubmitting(true)
    try {
      const payload = await buildSubmissionPayload(state, generateUploadUrl)
      const result = await submitMutation(payload)
      markSubmitted({ submissionId: result.id, queuePosition: result.queuePosition })
    } catch (err) {
      console.error("Partner application submit failed", err)
      setSubmissionError(t("submissionError"))
    }
  }

  if (confirmation.submitted) {
    return <PartnerSubmittedView />
  }

  return (
    <form
      className="w-full max-w-[600px] mx-auto flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault()
        void handleSubmit()
      }}
    >
      <StepHeader title={t("title")} subtitle={t("subtitle")} />

      <div className="flex items-start gap-2 bg-white border border-[rgba(28,27,24,0.08)] pl-[15px] pr-4 py-[11px] w-full">
        <TermsCheckbox checked={confirmation.acceptedTerms} onChange={setAcceptedTerms} />
        <p className="flex-1 text-[14px] leading-[1.2] text-[#696969]">
          {t.rich("acceptText", {
            terms: (chunks) => (
              <Link
                href="/terms-and-conditions"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline text-[#696969] hover:text-[#1c1b18] transition-colors"
              >
                {chunks}
              </Link>
            ),
            privacy: (chunks) => (
              <Link
                href="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline text-[#696969] hover:text-[#1c1b18] transition-colors"
              >
                {chunks}
              </Link>
            ),
          })}
        </p>
      </div>

      <div className="bg-[rgba(28,27,24,0.08)] border border-[rgba(28,27,24,0.08)] pl-[15px] pr-4 py-[11px] w-full">
        <p className="text-[14px] font-light italic leading-[1.2] text-[#696969]">
          {t("disclaimer")}
        </p>
      </div>

      {confirmation.submissionError ? (
        <div className="bg-[rgba(155,44,44,0.06)] border border-[rgba(155,44,44,0.18)] px-4 py-3 w-full">
          <p className="text-[13px] text-[#9b2c2c] leading-[1.3]">
            {confirmation.submissionError}
          </p>
        </div>
      ) : null}

      <ApplicationBottomBar
        backLabel={tCommon("back")}
        continueLabel={
          confirmation.submitting ? t("submittingCta") : t("submitCta")
        }
        onBack={prevStep}
        canContinue={confirmation.acceptedTerms && !confirmation.submitting}
      />
    </form>
  )
}
