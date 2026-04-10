"use client"

import { useState } from "react"
import { User, Mail, FileText, Lock } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { InputWithIcon } from "@/components/ui/input-with-icon"
import { RadioOption } from "@/components/ui/radio-option"
import { PhoneInput } from "@/components/ui/phone-input"
import { useTranslations } from "next-intl"
import { useCheckout } from "@/components/checkout/checkout-context"
import { registContactInformation } from "@/lib/orders"
import { useConvex } from "convex/react"
import { api } from "@workspace/convex/api"

interface PassengerInfoFormProps {
  onContinue: () => void
}

export function PassengerInfoForm({ onContinue }: PassengerInfoFormProps) {
  const convex = useConvex()
  const t = useTranslations("passengerForm")
  const tTransfer = useTranslations("transfer")
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

      // Get order to check if it's a round trip
      const order = await convex.query(api.orders.getByOrderNumber, { orderNumber: String(orderId) })
      const relatedOrderId = order?.relatedOrderId
      
      // Register contact info for outbound order
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
      
      // If round trip, also register contact info for return order
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

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-[22px] font-bold text-[#222222] mb-6">{tTransfer("title")}</h2>

      <div className="space-y-4 mb-6">
        <RadioOption
          label={t("iAmMainPassenger")}
          selected={passenger.isMainPassenger}
          onSelect={() => updatePassenger({ isMainPassenger: true })}
        />
        <RadioOption
          label={t("bookingForOther")}
          selected={!passenger.isMainPassenger}
          onSelect={() => updatePassenger({ isMainPassenger: false })}
        />
      </div>

      <div className="mb-6">
        <label className="block text-[15px] font-semibold text-[#222222] mb-2">
          {t("name")}
          <span className="text-[#ff0000]">*</span>
        </label>
        <InputWithIcon
          icon={<User className="w-5 h-5" />}
          value={passenger.name}
          onChange={(v) => updatePassenger({ name: v })}
          placeholder={t("namePlaceholder")}
          autoComplete="name"
        />
      </div>

      <div className="mb-6">
        <label className="block text-[15px] font-semibold text-[#222222] mb-2">
          {t("email")}
          <span className="text-[#ff0000]">*</span>
        </label>
        <InputWithIcon
          icon={<Mail className="w-5 h-5" />}
          value={passenger.email}
          onChange={handleEmailChange}
          placeholder={t("emailPlaceholder")}
          type="email"
          autoComplete="email"
        />
        <div
          className={`text-[12px] text-[#d60510] overflow-hidden transition-all duration-200 ease-in-out ${
            emailWarning ? "opacity-100 translate-y-0 max-h-10" : "opacity-0 -translate-y-1 max-h-0"
          }`}
          aria-live="polite"
        >
          {emailWarning}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-[15px] font-semibold text-[#222222] mb-2">
          {t("whatsapp")}
          <span className="text-[#ff0000]">*</span>
        </label>
        <PhoneInput 
          value={passenger.phone} 
          onChange={(v) => updatePassenger({ phone: v })} 
          defaultCountry="pt"
          autoComplete="tel"
        />
      </div>

      <div className="mb-4">
        <label className="block text-[15px] font-semibold text-[#222222] mb-2">{t("nifVat")}</label>
        <InputWithIcon
          icon={<FileText className="w-5 h-5" />}
          value={passenger.nif}
          onChange={(v) => updatePassenger({ nif: v })}
          placeholder={t("nifPlaceholder")}
          autoComplete="off"
        />
      </div>

      <div className="flex items-start gap-2 mb-6">
        <div className="w-4 h-4 rounded-full border-2 border-[#bfbfbf] flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-[10px] text-[#bfbfbf] font-bold">i</span>
        </div>
        <p className="text-[13px] text-[#808080]">{t("nifInfo")}</p>
      </div>

      <div 
        className={`grid transition-all duration-300 ease-in-out ${
          !passenger.isMainPassenger ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-[#e0e0e0] my-8" />

          <div className="mb-6">
            <label className="block text-[15px] font-semibold text-[#222222] mb-2">
              {t("passengerName")}
              <span className="text-[#ff0000]">*</span>
            </label>
            <InputWithIcon
              icon={<User className="w-5 h-5" />}
              value={passenger.passengerName}
              onChange={(v) => updatePassenger({ passengerName: v })}
              placeholder={t("passengerNamePlaceholder")}
              autoComplete="name"
            />
          </div>

          <div className="mb-6">
            <label className="block text-[15px] font-semibold text-[#222222] mb-2">
              {t("passengerEmail")}
              <span className="text-[#ff0000]">*</span>
            </label>
            <InputWithIcon
              icon={<Mail className="w-5 h-5" />}
              value={passenger.passengerEmail}
              onChange={handlePassengerEmailChange}
              placeholder={t("passengerEmailPlaceholder")}
              type="email"
              autoComplete="email"
            />
            <div
              className={`text-[12px] text-[#d60510] overflow-hidden transition-all duration-200 ease-in-out ${
                passengerEmailWarning ? "opacity-100 translate-y-0 max-h-10" : "opacity-0 -translate-y-1 max-h-0"
              }`}
              aria-live="polite"
            >
              {passengerEmailWarning}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-[15px] font-semibold text-[#222222] mb-2">
              {t("passengerWhatsapp")}
              <span className="text-[#ff0000]">*</span>
            </label>
            <PhoneInput 
              value={passenger.passengerPhone} 
              onChange={(v) => updatePassenger({ passengerPhone: v })} 
              defaultCountry="pt"
              autoComplete="tel"
            />
          </div>

          <div className="mb-6">
            <h3 className="text-[15px] font-semibold text-[#222222] mb-4">{t("relationshipTitle")}</h3>
            <div className="space-y-3">
              {relationshipOptions.map((option) => (
                <RadioOption
                  key={option.value}
                  label={option.label}
                  selected={passenger.relationship === option.value}
                  onSelect={() => updatePassenger({ relationship: option.value })}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Button 
        onClick={handleContinue}
        disabled={isSubmitting}
        className="w-full bg-[#27c7ff] hover:bg-[#23b3e6] text-white h-14 text-[16px] font-bold rounded-lg"
      >
        <Lock className="w-5 h-5 mr-2" />
        {!passenger.isMainPassenger ? `${tCommon("continue").toUpperCase()} (€ 45.00)` : tCommon("continue").toUpperCase()}
      </Button>

      {submitError && (
        <div className="mt-3 text-[13px] text-[#d60510]" aria-live="polite">
          {submitError}
        </div>
      )}
    </div>
  )
}
