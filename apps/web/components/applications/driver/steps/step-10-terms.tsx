"use client"

import { Check } from "lucide-react"
import { useTranslations } from "next-intl"
import { useMutation } from "convex/react"
import { api } from "@workspace/convex/api"
import type { Id } from "@workspace/convex/dataModel"
import {
  ApplicationBottomBar,
  StepHeader,
} from "@/components/applications/shared"
import {
  useDriverApplication,
  type DriverApplicationState,
} from "../driver-application-context"

type StorageId = Id<"_storage">

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
  state: DriverApplicationState,
  generateUploadUrl: () => Promise<string>,
) {
  const upload = (file: File | null) =>
    file ? uploadFileToConvex(generateUploadUrl, file) : Promise.resolve(undefined)

  const interiorFiles = state.vehicle.interiorPhotos.filter(
    (f): f is File => f !== null,
  )
  const exteriorFiles = state.vehicle.exteriorPhotos.filter(
    (f): f is File => f !== null,
  )

  const [
    professionalPhotoId,
    professionalLicenseId,
    vehicleInsuranceId,
    proofOfAddressId,
    billingBankProofId,
    introVideoId,
    vehicleInteriorPhotoIds,
    vehicleExteriorPhotoIds,
  ] = await Promise.all([
    upload(state.documents.professionalPhoto),
    upload(state.documents.professionalLicense),
    upload(state.documents.vehicleInsurance),
    upload(state.documents.proofOfAddress),
    upload(state.billing.bankProof),
    upload(state.videoIntro.videoFile),
    Promise.all(interiorFiles.map((f) => uploadFileToConvex(generateUploadUrl, f))),
    Promise.all(exteriorFiles.map((f) => uploadFileToConvex(generateUploadUrl, f))),
  ])

  return {
    operatingZone: state.zone.operatingZone,

    fullName: state.contact.fullName,
    email: state.contact.email,
    representativeEmail: state.contact.representativeEmail,
    phone: state.contact.phone,
    whatsapp: state.contact.whatsapp,
    languages: state.contact.languages.map((l) => ({
      code: l.code,
      level: l.level,
    })),
    referral: state.contact.referral,

    vehicleCategory: state.vehicle.category,
    vehicleBrand: state.vehicle.brand,
    vehicleModel: state.vehicle.model,
    vehiclePlate: state.vehicle.plate,
    vehicleColor: state.vehicle.color,
    vehicleYear: state.vehicle.year,
    vehicleOwnership: state.vehicle.ownership,
    vehiclePassengerCapacity: state.vehicle.passengerCapacity,
    vehicleLuggageCapacity: state.vehicle.luggageCapacity,
    vehicleTvdeLicensed: state.vehicle.tvdeLicensed,
    vehicleInteriorPhotoIds,
    vehicleExteriorPhotoIds,
    childSeatBaby: state.vehicle.childSeats.baby,
    childSeatChild: state.vehicle.childSeats.child,
    childSeatBooster: state.vehicle.childSeats.booster,
    surfboardRack: state.vehicle.surfboardRack,
    amenities: state.vehicle.amenities,

    professionalPhotoId,
    professionalLicenseId,
    vehicleInsuranceId,
    proofOfAddressId,

    billingAccountHolder: state.billing.accountHolder,
    billingInvoiceName: state.billing.invoiceName,
    billingSwiftBic: state.billing.swiftBic,
    billingIban: state.billing.iban,
    billingNif: state.billing.nif,
    billingTaxOffice: state.billing.taxOffice,
    billingAddress: state.billing.billingAddress,
    billingBankProofId,

    availabilityDays: state.availability.days,
    availabilityShifts: state.availability.shifts,

    introVideoId,

    termsAccepted: state.terms.accepted,
  }
}

export function DriverStepTerms() {
  const t = useTranslations("driverApplication.stepTerms")
  const tCommon = useTranslations("common")
  const {
    state,
    updateTerms,
    prevStep,
    setSubmitting,
    setSubmissionError,
    markSubmitted,
  } = useDriverApplication()
  const { terms } = state

  const generateUploadUrl = useMutation(api.driverApplications.generateUploadUrl)
  const submitMutation = useMutation(api.driverApplications.submit)

  const canSubmit = terms.accepted && !terms.submitting

  async function handleSubmit() {
    if (!terms.accepted || terms.submitting) return
    setSubmitting(true)
    try {
      const payload = await buildSubmissionPayload(state, generateUploadUrl)
      const result = await submitMutation(payload)
      markSubmitted({ submissionId: result.id, queuePosition: result.queuePosition })
    } catch (err) {
      console.error("Driver application submit failed", err)
      setSubmissionError(t("submissionError"))
    }
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

      <button
        type="button"
        onClick={() => updateTerms({ accepted: !terms.accepted })}
        aria-pressed={terms.accepted}
        className="w-full bg-white border border-[rgba(28,27,24,0.08)] flex items-start gap-3 px-4 py-3 text-left hover:border-[rgba(28,27,24,0.18)] transition-colors"
      >
        <span
          className={
            terms.accepted
              ? "size-[20px] shrink-0 mt-0.5 bg-[#a08248] border border-[#a08248] flex items-center justify-center"
              : "size-[20px] shrink-0 mt-0.5 bg-white border border-[rgba(28,27,24,0.18)]"
          }
        >
          {terms.accepted ? <Check size={12} strokeWidth={3} className="text-white" /> : null}
        </span>
        <span className="text-[14px] text-[#1c1b18] leading-[1.45]">
          {t.rich("acceptance", {
            terms: (chunks) => (
              <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="font-semibold underline text-[#1c1b18] hover:text-[#a08248] transition-colors"
              >
                {chunks}
              </a>
            ),
            privacy: (chunks) => (
              <a
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="font-semibold underline text-[#1c1b18] hover:text-[#a08248] transition-colors"
              >
                {chunks}
              </a>
            ),
          })}
        </span>
      </button>

      <p className="bg-[#f3eee5] border border-[rgba(28,27,24,0.04)] px-4 py-3 text-[13px] italic text-[#696969] leading-[1.45]">
        {t("disclaimer")}
      </p>

      {terms.submissionError ? (
        <div className="bg-[rgba(155,44,44,0.06)] border border-[rgba(155,44,44,0.18)] px-4 py-3 w-full">
          <p className="text-[13px] text-[#9b2c2c] leading-[1.3]">
            {terms.submissionError}
          </p>
        </div>
      ) : null}

      <ApplicationBottomBar
        backLabel={tCommon("back")}
        continueLabel={terms.submitting ? t("submittingCta") : t("submitCta")}
        onBack={prevStep}
        canContinue={canSubmit}
      />
    </form>
  )
}
