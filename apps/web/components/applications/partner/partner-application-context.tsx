"use client"

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"

export const PARTNER_TOTAL_STEPS = 10

function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID()
  return Math.random().toString(36).slice(2)
}

export type PartnerStepKey =
  | "company"
  | "representative"
  | "verification"
  | "introVideo"
  | "drivers"
  | "vehicles"
  | "documents"
  | "billing"
  | "priceAgreement"
  | "confirmation"

export interface PartnerStepMeta {
  key: PartnerStepKey
  number: number
}

export const PARTNER_STEPS: PartnerStepMeta[] = [
  { key: "company", number: 1 },
  { key: "representative", number: 2 },
  { key: "verification", number: 3 },
  { key: "introVideo", number: 4 },
  { key: "drivers", number: 5 },
  { key: "vehicles", number: 6 },
  { key: "documents", number: 7 },
  { key: "billing", number: 8 },
  { key: "priceAgreement", number: 9 },
  { key: "confirmation", number: 10 },
]

export type YesNo = "yes" | "no"

export interface PartnerCompanyData {
  operatingZones: string[]
  driverCount: string
  driversComfortableWithMobile: YesNo | null
}

export interface PartnerRepresentativeData {
  companyName: string
  fullName: string
  email: string
  phone: string
  whatsapp: string
}

export interface PartnerVerificationData {
  code: string
}

export interface PartnerDriverEntry {
  id: string
  fullName: string
  email: string
  phone: string
  hasVideo: boolean
}

export interface PartnerVehicleEntry {
  id: string
  make: string
  model: string
  licensePlate: string
  category: string
}

export interface PartnerCompanyDocuments {
  license: File | null
  addressProofPrimary: File | null
  addressProofSecondary: File | null
  liabilityInsurance: File | null
}

export interface PartnerBillingData {
  accountHolder: string
  invoiceName: string
  swiftBic: string
  iban: string
  taxId: string
  taxOffice: string
  billingAddress: string
  bankProof: File | null
}

export interface PartnerPriceAgreementData {
  acknowledged: boolean
}

export interface PartnerConfirmationData {
  acceptedTerms: boolean
  submitting: boolean
  submitted: boolean
  submissionId: string | null
  queuePosition: number | null
  submissionError: string | null
}

export interface PartnerApplicationState {
  step: number
  company: PartnerCompanyData
  representative: PartnerRepresentativeData
  verification: PartnerVerificationData
  drivers: PartnerDriverEntry[]
  vehicles: PartnerVehicleEntry[]
  documents: PartnerCompanyDocuments
  billing: PartnerBillingData
  priceAgreement: PartnerPriceAgreementData
  confirmation: PartnerConfirmationData
}

const INITIAL_STATE: PartnerApplicationState = {
  step: 0,
  company: {
    operatingZones: [],
    driverCount: "",
    driversComfortableWithMobile: null,
  },
  representative: {
    companyName: "",
    fullName: "",
    email: "",
    phone: "",
    whatsapp: "",
  },
  verification: {
    code: "",
  },
  drivers: [],
  vehicles: [],
  documents: {
    license: null,
    addressProofPrimary: null,
    addressProofSecondary: null,
    liabilityInsurance: null,
  },
  billing: {
    accountHolder: "",
    invoiceName: "",
    swiftBic: "",
    iban: "",
    taxId: "",
    taxOffice: "",
    billingAddress: "",
    bankProof: null,
  },
  priceAgreement: {
    acknowledged: false,
  },
  confirmation: {
    acceptedTerms: false,
    submitting: false,
    submitted: false,
    submissionId: null,
    queuePosition: null,
    submissionError: null,
  },
}

interface PartnerApplicationContextValue {
  state: PartnerApplicationState
  startApplication: () => void
  goToStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  updateCompany: (patch: Partial<PartnerCompanyData>) => void
  updateRepresentative: (patch: Partial<PartnerRepresentativeData>) => void
  updateVerification: (patch: Partial<PartnerVerificationData>) => void
  addDriver: (entry: Omit<PartnerDriverEntry, "id">) => void
  removeDriver: (id: string) => void
  updateDriver: (id: string, patch: Partial<Omit<PartnerDriverEntry, "id">>) => void
  addVehicle: (entry: Omit<PartnerVehicleEntry, "id">) => void
  removeVehicle: (id: string) => void
  updateVehicle: (id: string, patch: Partial<Omit<PartnerVehicleEntry, "id">>) => void
  updateDocuments: (patch: Partial<PartnerCompanyDocuments>) => void
  updateBilling: (patch: Partial<PartnerBillingData>) => void
  acknowledgePriceAgreement: () => void
  setAcceptedTerms: (accepted: boolean) => void
  setSubmitting: (submitting: boolean) => void
  setSubmissionError: (message: string | null) => void
  markSubmitted: (payload: { submissionId: string; queuePosition: number }) => void
}

const PartnerApplicationContext = createContext<PartnerApplicationContextValue | null>(null)

export function PartnerApplicationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PartnerApplicationState>(INITIAL_STATE)

  const startApplication = useCallback(() => {
    setState((prev) => ({ ...prev, step: 1 }))
  }, [])

  const goToStep = useCallback((step: number) => {
    setState((prev) => ({ ...prev, step: Math.max(0, Math.min(PARTNER_TOTAL_STEPS, step)) }))
  }, [])

  const nextStep = useCallback(() => {
    setState((prev) => ({ ...prev, step: Math.min(PARTNER_TOTAL_STEPS, prev.step + 1) }))
  }, [])

  const prevStep = useCallback(() => {
    setState((prev) => ({ ...prev, step: Math.max(0, prev.step - 1) }))
  }, [])

  const updateCompany = useCallback((patch: Partial<PartnerCompanyData>) => {
    setState((prev) => ({ ...prev, company: { ...prev.company, ...patch } }))
  }, [])

  const updateRepresentative = useCallback((patch: Partial<PartnerRepresentativeData>) => {
    setState((prev) => ({ ...prev, representative: { ...prev.representative, ...patch } }))
  }, [])

  const updateVerification = useCallback((patch: Partial<PartnerVerificationData>) => {
    setState((prev) => ({ ...prev, verification: { ...prev.verification, ...patch } }))
  }, [])

  const addDriver = useCallback((entry: Omit<PartnerDriverEntry, "id">) => {
    setState((prev) => ({
      ...prev,
      drivers: [...prev.drivers, { ...entry, id: generateId() }],
    }))
  }, [])

  const removeDriver = useCallback((id: string) => {
    setState((prev) => ({ ...prev, drivers: prev.drivers.filter((d) => d.id !== id) }))
  }, [])

  const updateDriver = useCallback((id: string, patch: Partial<Omit<PartnerDriverEntry, "id">>) => {
    setState((prev) => ({
      ...prev,
      drivers: prev.drivers.map((d) => (d.id === id ? { ...d, ...patch } : d)),
    }))
  }, [])

  const addVehicle = useCallback((entry: Omit<PartnerVehicleEntry, "id">) => {
    setState((prev) => ({
      ...prev,
      vehicles: [...prev.vehicles, { ...entry, id: generateId() }],
    }))
  }, [])

  const removeVehicle = useCallback((id: string) => {
    setState((prev) => ({ ...prev, vehicles: prev.vehicles.filter((v) => v.id !== id) }))
  }, [])

  const updateVehicle = useCallback((id: string, patch: Partial<Omit<PartnerVehicleEntry, "id">>) => {
    setState((prev) => ({
      ...prev,
      vehicles: prev.vehicles.map((v) => (v.id === id ? { ...v, ...patch } : v)),
    }))
  }, [])

  const updateDocuments = useCallback((patch: Partial<PartnerCompanyDocuments>) => {
    setState((prev) => ({ ...prev, documents: { ...prev.documents, ...patch } }))
  }, [])

  const updateBilling = useCallback((patch: Partial<PartnerBillingData>) => {
    setState((prev) => ({ ...prev, billing: { ...prev.billing, ...patch } }))
  }, [])

  const acknowledgePriceAgreement = useCallback(() => {
    setState((prev) => ({ ...prev, priceAgreement: { acknowledged: true } }))
  }, [])

  const setAcceptedTerms = useCallback((accepted: boolean) => {
    setState((prev) => ({
      ...prev,
      confirmation: { ...prev.confirmation, acceptedTerms: accepted },
    }))
  }, [])

  const setSubmitting = useCallback((submitting: boolean) => {
    setState((prev) => ({
      ...prev,
      confirmation: { ...prev.confirmation, submitting, submissionError: submitting ? null : prev.confirmation.submissionError },
    }))
  }, [])

  const setSubmissionError = useCallback((message: string | null) => {
    setState((prev) => ({
      ...prev,
      confirmation: { ...prev.confirmation, submissionError: message, submitting: false },
    }))
  }, [])

  const markSubmitted = useCallback(
    ({ submissionId, queuePosition }: { submissionId: string; queuePosition: number }) => {
      setState((prev) => ({
        ...prev,
        confirmation: {
          ...prev.confirmation,
          submitted: true,
          submitting: false,
          submissionId,
          queuePosition,
          submissionError: null,
        },
      }))
    },
    [],
  )

  const value = useMemo<PartnerApplicationContextValue>(
    () => ({
      state,
      startApplication,
      goToStep,
      nextStep,
      prevStep,
      updateCompany,
      updateRepresentative,
      updateVerification,
      addDriver,
      removeDriver,
      updateDriver,
      addVehicle,
      removeVehicle,
      updateVehicle,
      updateDocuments,
      updateBilling,
      acknowledgePriceAgreement,
      setAcceptedTerms,
      setSubmitting,
      setSubmissionError,
      markSubmitted,
    }),
    [
      state,
      startApplication,
      goToStep,
      nextStep,
      prevStep,
      updateCompany,
      updateRepresentative,
      updateVerification,
      addDriver,
      removeDriver,
      updateDriver,
      addVehicle,
      removeVehicle,
      updateVehicle,
      updateDocuments,
      updateBilling,
      acknowledgePriceAgreement,
      setAcceptedTerms,
      setSubmitting,
      setSubmissionError,
      markSubmitted,
    ],
  )

  return (
    <PartnerApplicationContext.Provider value={value}>
      {children}
    </PartnerApplicationContext.Provider>
  )
}

export function usePartnerApplication() {
  const ctx = useContext(PartnerApplicationContext)
  if (!ctx) {
    throw new Error("usePartnerApplication must be used inside PartnerApplicationProvider")
  }
  return ctx
}


