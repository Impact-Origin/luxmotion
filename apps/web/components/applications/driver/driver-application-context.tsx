"use client"

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"
import type { LanguageEntry } from "@/components/applications/shared"

export const DRIVER_TOTAL_STEPS = 10

export type DriverStepKey =
  | "zone"
  | "contact"
  | "verifyEmail"
  | "vehicleCategory"
  | "vehicleDetails"
  | "documents"
  | "billing"
  | "availability"
  | "videoIntro"
  | "terms"

export interface DriverStepMeta {
  key: DriverStepKey
  number: number
}

export const DRIVER_STEPS: DriverStepMeta[] = [
  { key: "zone", number: 1 },
  { key: "contact", number: 2 },
  { key: "verifyEmail", number: 3 },
  { key: "vehicleCategory", number: 4 },
  { key: "vehicleDetails", number: 5 },
  { key: "documents", number: 6 },
  { key: "billing", number: 7 },
  { key: "availability", number: 8 },
  { key: "videoIntro", number: 9 },
  { key: "terms", number: 10 },
]

export interface DriverZoneData {
  operatingZone: string
}

export interface DriverContactData {
  fullName: string
  email: string
  representativeEmail: string
  phone: string
  whatsapp: string
  languages: LanguageEntry[]
  referral: string
  emailVerificationCode: string
}

export interface DriverVehicleData {
  category: string
  brand: string
  model: string
  plate: string
  color: string
  year: string
  ownership: string
  passengerCapacity: string
  luggageCapacity: string
  tvdeLicensed: string
  interiorPhotos: (File | null)[]
  exteriorPhotos: (File | null)[]
  childSeats: { baby: number; child: number; booster: number }
  surfboardRack: boolean
  amenities: string[]
}

export interface DriverDocumentsData {
  professionalPhoto: File | null
  professionalLicense: File | null
  vehicleInsurance: File | null
  proofOfAddress: File | null
}

export interface DriverBillingData {
  accountHolder: string
  invoiceName: string
  swiftBic: string
  iban: string
  nif: string
  taxOffice: string
  billingAddress: string
  bankProof: File | null
}

export interface DriverAvailabilityData {
  days: string[]
  shifts: string[]
}

export interface DriverVideoIntroData {
  videoFile: File | null
}

export interface DriverTermsData {
  accepted: boolean
}

interface DriverApplicationState {
  step: number
  zone: DriverZoneData
  contact: DriverContactData
  vehicle: DriverVehicleData
  documents: DriverDocumentsData
  billing: DriverBillingData
  availability: DriverAvailabilityData
  videoIntro: DriverVideoIntroData
  terms: DriverTermsData
}

const INITIAL_STATE: DriverApplicationState = {
  step: 0,
  zone: {
    operatingZone: "",
  },
  contact: {
    fullName: "",
    email: "",
    representativeEmail: "",
    phone: "",
    whatsapp: "",
    languages: [],
    referral: "",
    emailVerificationCode: "",
  },
  vehicle: {
    category: "",
    brand: "",
    model: "",
    plate: "",
    color: "",
    year: "",
    ownership: "",
    passengerCapacity: "",
    luggageCapacity: "",
    tvdeLicensed: "",
    interiorPhotos: [null, null, null],
    exteriorPhotos: [null, null, null],
    childSeats: { baby: 0, child: 0, booster: 0 },
    surfboardRack: false,
    amenities: [],
  },
  documents: {
    professionalPhoto: null,
    professionalLicense: null,
    vehicleInsurance: null,
    proofOfAddress: null,
  },
  billing: {
    accountHolder: "",
    invoiceName: "",
    swiftBic: "",
    iban: "",
    nif: "",
    taxOffice: "",
    billingAddress: "",
    bankProof: null,
  },
  availability: {
    days: [],
    shifts: [],
  },
  videoIntro: {
    videoFile: null,
  },
  terms: {
    accepted: false,
  },
}

interface DriverApplicationContextValue {
  state: DriverApplicationState
  startApplication: () => void
  goToStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  updateZone: (patch: Partial<DriverZoneData>) => void
  updateContact: (patch: Partial<DriverContactData>) => void
  updateVehicle: (patch: Partial<DriverVehicleData>) => void
  updateDocuments: (patch: Partial<DriverDocumentsData>) => void
  updateBilling: (patch: Partial<DriverBillingData>) => void
  updateAvailability: (patch: Partial<DriverAvailabilityData>) => void
  updateVideoIntro: (patch: Partial<DriverVideoIntroData>) => void
  updateTerms: (patch: Partial<DriverTermsData>) => void
}

const DriverApplicationContext = createContext<DriverApplicationContextValue | null>(null)

export function DriverApplicationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DriverApplicationState>(INITIAL_STATE)

  const startApplication = useCallback(() => {
    setState((prev) => ({ ...prev, step: 1 }))
  }, [])

  const goToStep = useCallback((step: number) => {
    setState((prev) => ({ ...prev, step: Math.max(0, Math.min(DRIVER_TOTAL_STEPS + 1, step)) }))
  }, [])

  const nextStep = useCallback(() => {
    setState((prev) => ({ ...prev, step: Math.min(DRIVER_TOTAL_STEPS + 1, prev.step + 1) }))
  }, [])

  const prevStep = useCallback(() => {
    setState((prev) => ({ ...prev, step: Math.max(0, prev.step - 1) }))
  }, [])

  const updateZone = useCallback((patch: Partial<DriverZoneData>) => {
    setState((prev) => ({ ...prev, zone: { ...prev.zone, ...patch } }))
  }, [])

  const updateContact = useCallback((patch: Partial<DriverContactData>) => {
    setState((prev) => ({ ...prev, contact: { ...prev.contact, ...patch } }))
  }, [])

  const updateVehicle = useCallback((patch: Partial<DriverVehicleData>) => {
    setState((prev) => ({ ...prev, vehicle: { ...prev.vehicle, ...patch } }))
  }, [])

  const updateDocuments = useCallback((patch: Partial<DriverDocumentsData>) => {
    setState((prev) => ({ ...prev, documents: { ...prev.documents, ...patch } }))
  }, [])

  const updateBilling = useCallback((patch: Partial<DriverBillingData>) => {
    setState((prev) => ({ ...prev, billing: { ...prev.billing, ...patch } }))
  }, [])

  const updateAvailability = useCallback((patch: Partial<DriverAvailabilityData>) => {
    setState((prev) => ({ ...prev, availability: { ...prev.availability, ...patch } }))
  }, [])

  const updateVideoIntro = useCallback((patch: Partial<DriverVideoIntroData>) => {
    setState((prev) => ({ ...prev, videoIntro: { ...prev.videoIntro, ...patch } }))
  }, [])

  const updateTerms = useCallback((patch: Partial<DriverTermsData>) => {
    setState((prev) => ({ ...prev, terms: { ...prev.terms, ...patch } }))
  }, [])

  const value = useMemo<DriverApplicationContextValue>(
    () => ({ state, startApplication, goToStep, nextStep, prevStep, updateZone, updateContact, updateVehicle, updateDocuments, updateBilling, updateAvailability, updateVideoIntro, updateTerms }),
    [state, startApplication, goToStep, nextStep, prevStep, updateZone, updateContact, updateVehicle, updateDocuments, updateBilling, updateAvailability, updateVideoIntro, updateTerms],
  )

  return (
    <DriverApplicationContext.Provider value={value}>
      {children}
    </DriverApplicationContext.Provider>
  )
}

export function useDriverApplication() {
  const ctx = useContext(DriverApplicationContext)
  if (!ctx) {
    throw new Error("useDriverApplication must be used inside DriverApplicationProvider")
  }
  return ctx
}
