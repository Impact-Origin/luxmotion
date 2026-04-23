"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { PhoneInput } from "@/components/ui/phone-input"
import { useTranslations } from "next-intl"
import { useCheckout } from "@/components/checkout/checkout-context"
import { registContactInformation } from "@/lib/orders"
import { useConvex } from "convex/react"
import { api } from "@workspace/convex/api"
import { cn } from "@workspace/ui/lib/utils"

interface PassengerInfoFormProps {
  onContinue: () => void
  onBack?: () => void
}

const SERIF_FONT = {
  fontFamily: "var(--font-title), 'Cormorant Garamond', serif",
} as const

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-[12px] font-semibold text-white mb-2 leading-none">
      {children}
      {required && <span className="text-[#E32828]">*</span>}
    </label>
  )
}

function DarkInput({
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  autoComplete?: string
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoComplete={autoComplete}
      className="w-full h-[44px] px-[13px] bg-[#1E1D1B] border border-[rgba(255,255,255,0.12)] text-[14px] text-white placeholder:text-[#696969] focus:outline-none focus:border-[#C9A96E] transition-colors"
    />
  )
}

function RadioCard({
  label,
  selected,
  onSelect,
}: {
  label: string
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full h-[44px] flex items-center gap-2 px-[15px] bg-[#1E1D1B] border transition-colors",
        selected ? "border-[#C9A96E]" : "border-[rgba(255,255,255,0.12)] hover:border-[rgba(255,255,255,0.2)]",
      )}
    >
      <span
        className={cn(
          "relative w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-colors",
          selected ? "border-[#C9A96E]" : "border-[rgba(255,255,255,0.35)]",
        )}
      >
        {selected && <span className="w-[10px] h-[10px] rounded-full bg-[#C9A96E]" />}
      </span>
      <span
        className={cn(
          "text-[14px] font-normal leading-[20.992px]",
          selected ? "text-white" : "text-[#999]",
        )}
      >
        {label}
      </span>
    </button>
  )
}

export function PassengerInfoForm({ onContinue, onBack }: PassengerInfoFormProps) {
  const convex = useConvex()
  const t = useTranslations("passengerForm")
  const tCommon = useTranslations("common")
  const { state, updatePassenger } = useCheckout()
  const { passenger, orderId } = state

  const [emailWarning, setEmailWarning] = useState("")
  const [passengerEmailWarning, setPassengerEmailWarning] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const relationshipOptions = [
    { value: "family", label: t("familyOrFriend") },
    { value: "agent", label: t("travelAgent") },
    { value: "business", label: t("colleagueOrBusiness") },
    { value: "prefer-not", label: t("preferNotToAnswer") },
  ]

  const validateEmail = (value: string) => {
    if (!value) return ""
    if (value.length > 254) return t("emailTooLong")
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(value)) return t("emailInvalid")
    return ""
  }

  const handleEmailChange = (value: string) => {
    updatePassenger({ email: value })
    setEmailWarning(validateEmail(value))
  }

  const handlePassengerEmailChange = (value: string) => {
    updatePassenger({ passengerEmail: value })
    setPassengerEmailWarning(validateEmail(value))
  }

  const handleContinue = async () => {
    setSubmitError("")
    if (!orderId) {
      setSubmitError(t("orderNotInitialized"))
      return
    }
    if (passenger.isMainPassenger) {
      if (!passenger.name || !passenger.email || !passenger.phone) {
        setSubmitError(t("fillRequired"))
        return
      }
    } else {
      if (!passenger.passengerName || !passenger.passengerEmail || !passenger.passengerPhone) {
        setSubmitError(t("fillTravelerRequired"))
        return
      }
    }

    if (emailWarning || passengerEmailWarning) {
      setSubmitError(emailWarning || passengerEmailWarning)
      return
    }

    setIsSubmitting(true)
    try {
      const contactName = passenger.isMainPassenger ? passenger.name : passenger.passengerName
      const contactEmail = passenger.isMainPassenger ? passenger.email : passenger.passengerEmail
      const contactPhone = passenger.isMainPassenger ? passenger.phone : passenger.passengerPhone

      if (!contactPhone || !contactPhone.trim()) {
        setSubmitError(t("phoneRequired"))
        setIsSubmitting(false)
        return
      }

      const order = await convex.query(api.orders.getByOrderNumber, { orderNumber: String(orderId) })
      const relatedOrderId = order?.relatedOrderId

      await registContactInformation(convex, orderId, {
        name: contactName.trim(),
        email: contactEmail.trim(),
        phoneNumber: contactPhone.trim(),
        nif: passenger.nif?.trim() || undefined,
        bookedForAnotherPerson: !passenger.isMainPassenger,
        passengerName: (passenger.isMainPassenger ? passenger.name : passenger.passengerName).trim(),
        passengerEmail: (passenger.isMainPassenger ? passenger.email : passenger.passengerEmail).trim(),
        passengerWhatsapp: (passenger.isMainPassenger ? passenger.phone : passenger.passengerPhone).trim(),
        passengerRelationship: passenger.isMainPassenger ? undefined : passenger.relationship,
      })

      if (relatedOrderId) {
        const returnOrder = await convex.query(api.orders.getById, { orderId: relatedOrderId })
        if (returnOrder?.orderNumber) {
          await registContactInformation(convex, returnOrder.orderNumber, {
            name: contactName.trim(),
            email: contactEmail.trim(),
            phoneNumber: contactPhone.trim(),
            nif: passenger.nif?.trim() || undefined,
            bookedForAnotherPerson: !passenger.isMainPassenger,
            passengerName: (passenger.isMainPassenger ? passenger.name : passenger.passengerName).trim(),
            passengerEmail: (passenger.isMainPassenger ? passenger.email : passenger.passengerEmail).trim(),
            passengerWhatsapp: (passenger.isMainPassenger ? passenger.phone : passenger.passengerPhone).trim(),
            passengerRelationship: passenger.isMainPassenger ? undefined : passenger.relationship,
          })
        }
      }
      onContinue()
    } catch (e: any) {
      setSubmitError(e?.message || t("saveError"))
    } finally {
      setIsSubmitting(false)
    }
  }

  const isForOther = !passenger.isMainPassenger

  return (
    <div className="flex flex-col gap-4 pb-10">
      <h1
        className="text-[24px] font-semibold leading-none text-[#F7F4EF]"
        style={SERIF_FONT}
      >
        {t("title")}
      </h1>

      <div className="flex flex-col gap-[7px]">
        <RadioCard
          label={t("iAmMainPassenger")}
          selected={passenger.isMainPassenger}
          onSelect={() => updatePassenger({ isMainPassenger: true })}
        />
        <RadioCard
          label={t("bookingForOther")}
          selected={!passenger.isMainPassenger}
          onSelect={() => updatePassenger({ isMainPassenger: false })}
        />
      </div>

      <div>
        <FieldLabel required>{t("name")}</FieldLabel>
        <DarkInput
          value={passenger.name}
          onChange={(v) => updatePassenger({ name: v })}
          placeholder={t("namePlaceholder")}
          autoComplete="name"
        />
      </div>

      <div>
        <FieldLabel required>{t("email")}</FieldLabel>
        <DarkInput
          value={passenger.email}
          onChange={handleEmailChange}
          placeholder={t("namePlaceholder")}
          type="email"
          autoComplete="email"
        />
        <div
          className={`text-[12px] text-[#E32828] overflow-hidden transition-all duration-200 ease-in-out ${
            emailWarning ? "opacity-100 translate-y-0 max-h-10 mt-1" : "opacity-0 -translate-y-1 max-h-0"
          }`}
          aria-live="polite"
        >
          {emailWarning}
        </div>
      </div>

      <div>
        <FieldLabel required>{t("whatsapp")}</FieldLabel>
        <PhoneInput
          value={passenger.phone}
          onChange={(v) => updatePassenger({ phone: v })}
          defaultCountry="pt"
          autoComplete="tel"
          dark
        />
      </div>

      <div>
        <FieldLabel>{t("nifVat")}</FieldLabel>
        <DarkInput
          value={passenger.nif}
          onChange={(v) => updatePassenger({ nif: v })}
          placeholder={t("namePlaceholder")}
          autoComplete="off"
        />
      </div>

      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          isForOther ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-4">
            <div>
              <FieldLabel>{t("relationshipTitle")}</FieldLabel>
              <div className="flex flex-col gap-4">
                {relationshipOptions.map((option) => (
                  <RadioCard
                    key={option.value}
                    label={option.label}
                    selected={passenger.relationship === option.value}
                    onSelect={() => updatePassenger({ relationship: option.value })}
                  />
                ))}
              </div>
            </div>

            <div className="border-b-[0.8px] border-[rgba(247,244,239,0.08)] pb-[0.8px] h-6 flex items-center">
              <span className="text-[12px] font-bold text-[#999] uppercase tracking-[1.152px] leading-none">
                {t("mainPassengerData")}
              </span>
            </div>

            <div>
              <FieldLabel required>{t("passengerName")}</FieldLabel>
              <DarkInput
                value={passenger.passengerName}
                onChange={(v) => updatePassenger({ passengerName: v })}
                placeholder={t("passengerNamePlaceholder")}
                autoComplete="name"
              />
            </div>

            <div>
              <FieldLabel required>{t("passengerEmail")}</FieldLabel>
              <DarkInput
                value={passenger.passengerEmail}
                onChange={handlePassengerEmailChange}
                placeholder={t("passengerEmailPlaceholder")}
                type="email"
                autoComplete="email"
              />
              <div
                className={`text-[12px] text-[#E32828] overflow-hidden transition-all duration-200 ease-in-out ${
                  passengerEmailWarning ? "opacity-100 translate-y-0 max-h-10 mt-1" : "opacity-0 -translate-y-1 max-h-0"
                }`}
                aria-live="polite"
              >
                {passengerEmailWarning}
              </div>
            </div>

            <div>
              <FieldLabel required>{t("passengerWhatsapp")}</FieldLabel>
              <PhoneInput
                value={passenger.passengerPhone}
                onChange={(v) => updatePassenger({ passengerPhone: v })}
                defaultCountry="pt"
                autoComplete="tel"
                dark
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-6">
        <button
          type="button"
          onClick={onBack}
          className="h-12 px-8 border border-[#999] text-[#999] text-[14px] font-medium uppercase tracking-[1.1px] inline-flex items-center gap-2 hover:border-[#F7F4EF] hover:text-[#F7F4EF] transition-colors"
        >
          <ArrowLeft className="w-[18px] h-[18px]" strokeWidth={2} />
          <span className="px-2">{tCommon("back")}</span>
        </button>
        <button
          type="button"
          onClick={handleContinue}
          disabled={isSubmitting}
          className="h-12 px-8 bg-[#C9A96E] border border-[#C9A96E] text-[#0D0D0D] text-[14px] font-medium uppercase tracking-[1.1px] inline-flex items-center gap-2 hover:bg-[#b89558] hover:border-[#b89558] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="px-2">{tCommon("continue")}</span>
          <ArrowRight className="w-[18px] h-[18px]" strokeWidth={2} />
        </button>
      </div>

      {submitError && (
        <div className="text-[13px] text-[#E32828]" aria-live="polite">
          {submitError}
        </div>
      )}
    </div>
  )
}
