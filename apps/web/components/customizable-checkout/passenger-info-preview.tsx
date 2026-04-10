"use client"

import { User, Mail, Phone, FileText, Lock } from "lucide-react"
import { useTranslations } from "next-intl"

export function PassengerInfoPreview() {
  const t = useTranslations("passengerForm")
  const tTransfer = useTranslations("transfer")
  const tCommon = useTranslations("common")

  return (
    <div className="checkout-form-card w-full">
      <div
        className="rounded-lg shadow-sm p-6"
        style={{ backgroundColor: "var(--theme-checkout-form-card-bg, #FFFFFF)" }}
      >
        <h2
          className="text-[22px] font-bold mb-6"
          style={{ color: "var(--theme-checkout-form-card-title, #222222)" }}
        >
          {t("title") || "Passenger Information"}
        </h2>

        <div className="space-y-4 mb-6">
          <label className="checkout-radio flex items-center gap-3 cursor-pointer">
            <div
              className="checkout-radio-selected w-5 h-5 rounded-full border-2 flex items-center justify-center"
              style={{ borderColor: "var(--theme-checkout-radio-selected-fill, #27C7FF)" }}
            >
              <div
                className="checkout-radio-fill w-3 h-3 rounded-full"
                style={{ backgroundColor: "var(--theme-checkout-radio-selected-fill, #27C7FF)" }}
              />
            </div>
            <span
              className="text-[15px]"
              style={{ color: "var(--theme-checkout-form-label-text, #222222)" }}
            >
              {t("iAmMainPassenger") || "I am the main passenger"}
            </span>
          </label>

          <label className="checkout-radio flex items-center gap-3 cursor-pointer">
            <div
              className="checkout-radio-unselected w-5 h-5 rounded-full border-2 flex items-center justify-center"
              style={{ borderColor: "var(--theme-checkout-input-border, #D0D0D0)" }}
            />
            <span
              className="text-[15px]"
              style={{ color: "var(--theme-checkout-form-label-text, #222222)" }}
            >
              {t("bookingForOther") || "I am booking for someone else"}
            </span>
          </label>
        </div>

        <div className="mb-6">
          <label
            className="checkout-input-label block text-[15px] font-semibold mb-2"
            style={{ color: "var(--theme-checkout-form-label-text, #222222)" }}
          >
            {t("name") || "Name"}
            <span className="checkout-required-asterisk" style={{ color: "var(--theme-checkout-form-error-text, #FF0000)" }}>*</span>
          </label>
          <div
            className="checkout-input-field flex items-center gap-3 p-3 rounded-lg border h-12"
            style={{
              backgroundColor: "var(--theme-checkout-input-bg, #FFFFFF)",
              borderColor: "var(--theme-checkout-input-border, #E0E0E0)"
            }}
          >
            <User
              className="checkout-input-icon w-5 h-5"
              style={{ color: "var(--theme-checkout-input-icon, #BFBFBF)" }}
            />
            <span
              className="checkout-input-placeholder text-[14px]"
              style={{ color: "var(--theme-checkout-input-placeholder, #A2A2A2)" }}
            >
              {t("namePlaceholder") || "Enter your full name"}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <label
            className="checkout-input-label block text-[15px] font-semibold mb-2"
            style={{ color: "var(--theme-checkout-form-label-text, #222222)" }}
          >
            {t("email") || "Email"}
            <span className="checkout-required-asterisk" style={{ color: "var(--theme-checkout-form-error-text, #FF0000)" }}>*</span>
          </label>
          <div
            className="checkout-input-field flex items-center gap-3 p-3 rounded-lg border h-12"
            style={{
              backgroundColor: "var(--theme-checkout-input-bg, #FFFFFF)",
              borderColor: "var(--theme-checkout-input-border, #E0E0E0)"
            }}
          >
            <Mail
              className="checkout-input-icon w-5 h-5"
              style={{ color: "var(--theme-checkout-input-icon, #BFBFBF)" }}
            />
            <span
              className="checkout-input-placeholder text-[14px]"
              style={{ color: "var(--theme-checkout-input-placeholder, #A2A2A2)" }}
            >
              {t("emailPlaceholder") || "Enter your email address"}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <label
            className="checkout-input-label block text-[15px] font-semibold mb-2"
            style={{ color: "var(--theme-checkout-form-label-text, #222222)" }}
          >
            {t("whatsapp") || "WhatsApp / Phone"}
            <span className="checkout-required-asterisk" style={{ color: "var(--theme-checkout-form-error-text, #FF0000)" }}>*</span>
          </label>
          <div
            className="checkout-input-field flex items-center gap-3 p-3 rounded-lg border h-12"
            style={{
              backgroundColor: "var(--theme-checkout-input-bg, #FFFFFF)",
              borderColor: "var(--theme-checkout-input-border, #E0E0E0)"
            }}
          >
            <Phone
              className="checkout-input-icon w-5 h-5"
              style={{ color: "var(--theme-checkout-input-icon, #BFBFBF)" }}
            />
            <span
              className="checkout-input-placeholder text-[14px]"
              style={{ color: "var(--theme-checkout-input-placeholder, #A2A2A2)" }}
            >
              +351 963 650 278
            </span>
          </div>
        </div>

        <div className="mb-4">
          <label
            className="checkout-input-label block text-[15px] font-semibold mb-2"
            style={{ color: "var(--theme-checkout-form-label-text, #222222)" }}
          >
            {t("nifVat") || "NIF / VAT"}
          </label>
          <div
            className="checkout-input-field flex items-center gap-3 p-3 rounded-lg border h-12"
            style={{
              backgroundColor: "var(--theme-checkout-input-bg, #FFFFFF)",
              borderColor: "var(--theme-checkout-input-border, #E0E0E0)"
            }}
          >
            <FileText
              className="checkout-input-icon w-5 h-5"
              style={{ color: "var(--theme-checkout-input-icon, #BFBFBF)" }}
            />
            <span
              className="checkout-input-placeholder text-[14px]"
              style={{ color: "var(--theme-checkout-input-placeholder, #A2A2A2)" }}
            >
              {t("nifPlaceholder") || "Enter NIF/VAT number (optional)"}
            </span>
          </div>
        </div>

        <div className="checkout-info-text flex items-start gap-2 mb-6">
          <div
            className="checkout-info-icon w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ borderColor: "var(--theme-checkout-input-border, #BFBFBF)" }}
          >
            <span
              className="text-[10px] font-bold"
              style={{ color: "var(--theme-checkout-input-border, #BFBFBF)" }}
            >
              i
            </span>
          </div>
          <p
            className="checkout-muted-text text-[13px]"
            style={{ color: "var(--theme-checkout-order-summary-muted-text, #808080)" }}
          >
            {t("nifInfo") || "NIF is required for invoice purposes in Portugal"}
          </p>
        </div>

        <div
          className="checkout-divider border-t my-8"
          style={{ borderColor: "var(--theme-checkout-order-summary-divider, #E0E0E0)" }}
        />

        <div className="mb-6">
          <label
            className="checkout-input-label block text-[15px] font-semibold mb-2"
            style={{ color: "var(--theme-checkout-form-label-text, #222222)" }}
          >
            {t("passengerName") || "Passenger Name"}
            <span className="checkout-required-asterisk" style={{ color: "var(--theme-checkout-form-error-text, #FF0000)" }}>*</span>
          </label>
          <div
            className="checkout-input-field flex items-center gap-3 p-3 rounded-lg border h-12"
            style={{
              backgroundColor: "var(--theme-checkout-input-bg, #FFFFFF)",
              borderColor: "var(--theme-checkout-input-border, #E0E0E0)"
            }}
          >
            <User
              className="checkout-input-icon w-5 h-5"
              style={{ color: "var(--theme-checkout-input-icon, #BFBFBF)" }}
            />
            <span
              className="checkout-input-placeholder text-[14px]"
              style={{ color: "var(--theme-checkout-input-placeholder, #A2A2A2)" }}
            >
              {t("passengerNamePlaceholder") || "Passenger's full name"}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <h3
            className="checkout-section-title text-[15px] font-semibold mb-4"
            style={{ color: "var(--theme-checkout-form-label-text, #222222)" }}
          >
            {t("relationshipTitle") || "What is your relationship to the passenger?"}
          </h3>
          <div className="space-y-3">
            {[
              { label: t("familyOrFriend") || "Family or Friend", selected: true },
              { label: t("travelAgent") || "Travel Agent", selected: false },
              { label: t("colleagueOrBusiness") || "Colleague / Business", selected: false },
              { label: t("preferNotToAnswer") || "Prefer not to answer", selected: false },
            ].map((option, index) => (
              <label key={index} className="checkout-radio flex items-center gap-3 cursor-pointer">
                <div
                  className={`${option.selected ? 'checkout-radio-selected' : 'checkout-radio-unselected'} w-5 h-5 rounded-full border-2 flex items-center justify-center`}
                  style={{
                    borderColor: option.selected
                      ? "var(--theme-checkout-radio-selected-fill, #27C7FF)"
                      : "var(--theme-checkout-input-border, #D0D0D0)"
                  }}
                >
                  {option.selected && (
                    <div
                      className="checkout-radio-fill w-3 h-3 rounded-full"
                      style={{ backgroundColor: "var(--theme-checkout-radio-selected-fill, #27C7FF)" }}
                    />
                  )}
                </div>
                <span
                  className="text-[15px]"
                  style={{ color: "var(--theme-checkout-form-label-text, #222222)" }}
                >
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div
          className="error-message mb-4 text-[13px]"
          style={{ color: "var(--theme-checkout-form-error-text, #D60510)" }}
        >
          Example error message
        </div>

        <div
          className="success-message mb-4 text-[13px]"
          style={{ color: "var(--theme-checkout-form-success-text, #27C7FF)" }}
        >
          Example success message
        </div>

        <button
          className="checkout-primary-button w-full h-14 text-[16px] font-bold rounded-lg flex items-center justify-center gap-2"
          style={{
            backgroundColor: "var(--theme-checkout-primary-button-bg, #27C7FF)",
            color: "var(--theme-checkout-primary-button-text, #FFFFFF)"
          }}
        >
          <Lock
            className="w-5 h-5"
            style={{ color: "var(--theme-checkout-primary-button-icon, #FFFFFF)" }}
          />
          {tCommon("continue")?.toUpperCase() || "CONTINUE"} (€ 45.00)
        </button>
      </div>
    </div>
  )
}
