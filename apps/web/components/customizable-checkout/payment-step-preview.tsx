"use client"

import { CreditCard, Banknote, Lock, CheckCircle2, Calendar, MessageSquare, ShieldCheck, ChevronDown, Check } from "lucide-react"
import { useTranslations } from "next-intl"
import type { LucideIcon } from "lucide-react"

type PaymentMethod = 
  | { id: string; icon: LucideIcon; label: string; selected: boolean; customIcon?: never }
  | { id: string; label: string; selected: boolean; customIcon: true; icon?: never }

export function PaymentStepPreview() {
  const t = useTranslations("payment")
  const tCommon = useTranslations("common")

  const paymentMethods: PaymentMethod[] = [
    { id: "card", icon: CreditCard, label: t("card") || "Card", selected: true },
    { id: "cash", icon: Banknote, label: t("cash") || "Cash", selected: false },
    { id: "multibanco", label: t("multibanco") || "Multibanco", selected: false, customIcon: true },
    { id: "mbway", label: t("mbway") || "MB Way", selected: false, customIcon: true },
  ]

  const premiumBenefits = [
    { text: t("cancelUpTo4h") || "Free cancellation up to 4 hours before" },
    { text: t("fullRefund") || "Full refund", subtext: t("fullRefundDesc") || "100% of your money back" },
    { text: t("dateTimeChangeFree") || "Free date/time change" },
  ]

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
          {t("title") || "Payment"}
        </h2>

        <div className="checkout-payment-methods grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              className={`checkout-payment-method-button flex flex-col items-start gap-1.5 p-3 rounded-lg border-2 transition-all min-h-[68px] ${method.selected ? 'checkout-payment-method-selected' : 'checkout-payment-method-unselected'}`}
              style={{
                backgroundColor: method.selected
                  ? "var(--theme-checkout-payment-method-selected-bg, #E9F9FF)"
                  : "var(--theme-checkout-payment-method-unselected-bg, #FFFFFF)",
                borderColor: method.selected
                  ? "var(--theme-checkout-payment-method-selected-border, #27C7FF)"
                  : "var(--theme-checkout-payment-method-unselected-border, #E0E0E0)"
              }}
            >
              {method.customIcon ? (
                method.id === "multibanco" ? (
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="3" y="6" width="18" height="12" rx="2" fill="#253b80" />
                    <text x="12" y="14" fontSize="8" fill="white" textAnchor="middle" fontWeight="bold">MB</text>
                  </svg>
                ) : (
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="4" y="4" width="16" height="16" rx="2" fill="#d60510" />
                    <text x="12" y="14" fontSize="6" fill="white" textAnchor="middle" fontWeight="bold">MB</text>
                  </svg>
                )
              ) : (
                (() => {
                  const IconComponent = method.icon
                  return IconComponent ? (
                    <IconComponent
                      className="checkout-payment-method-icon w-7 h-7"
                      style={{ color: "var(--theme-checkout-payment-method-icon, #222222)" }}
                    />
                  ) : null
                })()
              )}
              <span
                className="checkout-payment-method-text text-[13px] font-medium"
                style={{ color: "var(--theme-checkout-payment-method-text, #222222)" }}
              >
                {method.label}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <span
            className="checkout-muted-text text-[14px]"
            style={{ color: "var(--theme-checkout-order-summary-muted-text, #808080)" }}
          >
            {t("cardFee") || "Card fee"}
          </span>
          <span
            className="text-[16px] font-semibold"
            style={{ color: "var(--theme-checkout-form-label-text, #222222)" }}
          >
            € 0,00
          </span>
        </div>

        <div className="mb-6">
          <label
            className="checkout-input-label block text-[15px] font-semibold mb-2"
            style={{ color: "var(--theme-checkout-form-label-text, #222222)" }}
          >
            {t("cardNumber") || "Card Number"}
            <span className="checkout-required-asterisk" style={{ color: "var(--theme-checkout-form-error-text, #FF0000)" }}>*</span>
          </label>
          <div
            className="checkout-input-field flex items-center gap-3 p-3 rounded-lg border h-12"
            style={{
              backgroundColor: "var(--theme-checkout-input-bg, #FFFFFF)",
              borderColor: "var(--theme-checkout-input-border, #E0E0E0)"
            }}
          >
            <CreditCard
              className="checkout-input-icon w-5 h-5"
              style={{ color: "var(--theme-checkout-input-icon, #BFBFBF)" }}
            />
            <span
              className="checkout-input-placeholder text-[14px]"
              style={{ color: "var(--theme-checkout-input-placeholder, #A2A2A2)" }}
            >
              {t("cardPlaceholder") || "1234 5678 9012 3456"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label
              className="checkout-input-label block text-[15px] font-semibold mb-2"
              style={{ color: "var(--theme-checkout-form-label-text, #222222)" }}
            >
              {t("expiry") || "Expiry"}
              <span className="checkout-required-asterisk" style={{ color: "var(--theme-checkout-form-error-text, #FF0000)" }}>*</span>
            </label>
            <div
              className="checkout-input-field flex items-center gap-3 p-3 rounded-lg border h-12"
              style={{
                backgroundColor: "var(--theme-checkout-input-bg, #FFFFFF)",
                borderColor: "var(--theme-checkout-input-border, #E0E0E0)"
              }}
            >
              <Calendar
                className="checkout-input-icon w-5 h-5"
                style={{ color: "var(--theme-checkout-input-icon, #BFBFBF)" }}
              />
              <span
                className="checkout-input-placeholder text-[14px]"
                style={{ color: "var(--theme-checkout-input-placeholder, #A2A2A2)" }}
              >
                {t("expiryPlaceholder") || "MM/YY"}
              </span>
            </div>
          </div>
          <div>
            <label
              className="checkout-input-label block text-[15px] font-semibold mb-2"
              style={{ color: "var(--theme-checkout-form-label-text, #222222)" }}
            >
              {t("cvc") || "CVC"}
              <span className="checkout-required-asterisk" style={{ color: "var(--theme-checkout-form-error-text, #FF0000)" }}>*</span>
            </label>
            <div
              className="checkout-input-field flex items-center gap-3 p-3 rounded-lg border h-12"
              style={{
                backgroundColor: "var(--theme-checkout-input-bg, #FFFFFF)",
                borderColor: "var(--theme-checkout-input-border, #E0E0E0)"
              }}
            >
              <Lock
                className="checkout-input-icon w-5 h-5"
                style={{ color: "var(--theme-checkout-input-icon, #BFBFBF)" }}
              />
              <span
                className="checkout-input-placeholder text-[14px]"
                style={{ color: "var(--theme-checkout-input-placeholder, #A2A2A2)" }}
              >
                {t("cvcPlaceholder") || "123"}
              </span>
            </div>
          </div>
        </div>

        <div
          className="mb-6 border rounded-lg p-5"
          style={{ borderColor: "var(--theme-checkout-input-border, #E0E0E0)" }}
        >
          <h3
            className="checkout-section-title text-[15px] font-bold mb-3"
            style={{ color: "var(--theme-checkout-form-label-text, #222222)" }}
          >
            {t("discountCoupon") || "Discount Coupon"}
          </h3>
          <div
            className="checkout-input-field flex items-center gap-3 p-3 rounded-lg border h-12"
            style={{
              backgroundColor: "var(--theme-checkout-input-bg, #FFFFFF)",
              borderColor: "var(--theme-checkout-input-border, #E0E0E0)"
            }}
          >
            <span
              className="checkout-input-placeholder flex-1 text-[14px]"
              style={{ color: "var(--theme-checkout-input-placeholder, #A2A2A2)" }}
            >
              {t("couponPlaceholder") || "Enter coupon code"}
            </span>
            <CheckCircle2
              className="w-8 h-8"
              style={{ color: "var(--theme-checkout-primary-button-bg, #27C7FF)" }}
            />
          </div>
        </div>

        <div
          className="mb-6 rounded-lg border overflow-hidden"
          style={{ borderColor: "var(--theme-checkout-input-border, #E0E0E0)" }}
        >
          <button
            className="w-full flex items-center justify-between p-4 transition-all"
            style={{ backgroundColor: "var(--theme-checkout-form-highlight-bg, #DFF7FF)" }}
          >
            <h3
              className="font-bold text-[15px]"
              style={{ color: "var(--theme-checkout-form-label-text, #222222)" }}
            >
              {t("extras") || "Extras"}
            </h3>
            <ChevronDown
              className="w-5 h-5"
              style={{ color: "var(--theme-checkout-primary-button-bg, #27C7FF)" }}
            />
          </button>
        </div>

        <div className="mb-6">
          <h3
            className="checkout-section-title text-[15px] font-bold mb-3"
            style={{ color: "var(--theme-checkout-form-label-text, #222222)" }}
          >
            {t("specialRequest") || "Special Request"}
          </h3>
          <div
            className="checkout-input-field relative rounded-lg border"
            style={{
              backgroundColor: "var(--theme-checkout-input-bg, #FFFFFF)",
              borderColor: "var(--theme-checkout-input-border, #E0E0E0)"
            }}
          >
            <MessageSquare
              className="checkout-input-icon absolute left-3 top-3.5 w-5 h-5"
              style={{ color: "var(--theme-checkout-input-icon, #BFBFBF)" }}
            />
            <div
              className="w-full min-h-[100px] pl-10 pr-4 py-3 text-[15px]"
              style={{ color: "var(--theme-checkout-input-placeholder, #A2A2A2)" }}
            >
              {t("specialRequestPlaceholder") || "Any special requests..."}
            </div>
          </div>
        </div>

        <div
          className="checkout-divider border-t mb-6"
          style={{ borderColor: "var(--theme-checkout-order-summary-divider, #E0E0E0)" }}
        />

        <div className="mb-6">
          <div
            className="flex items-start gap-3 p-3 rounded-lg"
            style={{ backgroundColor: "var(--theme-checkout-form-highlight-bg, #E9F9FF)" }}
          >
            <div
              className="w-4 h-4 mt-0.5 border-2 rounded flex items-center justify-center"
              style={{
                borderColor: "var(--theme-checkout-primary-button-bg, #27C7FF)",
                backgroundColor: "var(--theme-checkout-primary-button-bg, #27C7FF)"
              }}
            >
              <span className="text-white text-xs">✓</span>
            </div>
            <label
              className="text-[14px] leading-relaxed"
              style={{ color: "var(--theme-checkout-form-highlight-text, #0E4659)" }}
            >
              <span className="font-bold">{t("refundToOriginal") || "Refund to original payment method"}</span>
              <br />
              {t("refundToOriginalDesc") || "In case of cancellation, the refund will be made to the original payment method."}
            </label>
          </div>
        </div>

        <div
          className="checkout-insurance-card mb-6 border rounded-lg relative overflow-hidden"
          style={{ borderColor: "var(--theme-checkout-input-border, #E0E0E0)" }}
        >
          <div className="absolute -top-0 right-4 z-20">
            <span
              className="checkout-insurance-recommended text-[11px] font-bold px-2.5 py-1 rounded shadow-sm"
              style={{
                backgroundColor: "var(--theme-checkout-insurance-recommended-bg, #48D9A4)",
                color: "var(--theme-checkout-insurance-recommended-text, #FFFFFF)"
              }}
            >
              {tCommon("recommended") || "Recommended"}
            </span>
          </div>

          <div
            className="checkout-insurance-header p-4 rounded-t-lg"
            style={{ backgroundColor: "var(--theme-checkout-insurance-header-bg, #48D9A4)", opacity: 0.1 }}
          />
          <div
            className="absolute top-0 left-0 right-0 p-4"
            style={{ backgroundColor: `color-mix(in srgb, var(--theme-checkout-insurance-header-bg, #48D9A4) 10%, transparent)` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 border-2 rounded flex items-center justify-center"
                  style={{
                    borderColor: "var(--theme-checkout-insurance-check-bg, #48D9A4)",
                    backgroundColor: "var(--theme-checkout-insurance-check-bg, #48D9A4)"
                  }}
                >
                  <Check
                    className="w-3 h-3"
                    style={{ color: "var(--theme-checkout-insurance-check-icon, #FFFFFF)" }}
                  />
                </div>
                <label
                  className="text-[16px] font-bold"
                  style={{ color: "var(--theme-checkout-form-label-text, #222222)" }}
                >
                  {t("premiumInsurance") || "Premium Insurance"}
                </label>
              </div>
              <span
                className="text-[18px] font-bold"
                style={{ color: "var(--theme-checkout-form-label-text, #222222)" }}
              >
                € 9
              </span>
            </div>
          </div>

          <div
            className="p-4 pt-16"
            style={{ backgroundColor: "var(--theme-checkout-form-card-bg, #FFFFFF)" }}
          >
            <h4
              className="text-[14px] font-bold mb-3"
              style={{ color: "var(--theme-checkout-form-label-text, #222222)" }}
            >
              {t("cancellationProtection") || "Cancellation Protection"}
            </h4>
            <div className="space-y-2">
              {premiumBenefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div
                    className="checkout-insurance-check w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: "var(--theme-checkout-insurance-check-bg, #48D9A4)" }}
                  >
                    <Check
                      className="w-3 h-3"
                      style={{ color: "var(--theme-checkout-insurance-check-icon, #FFFFFF)" }}
                    />
                  </div>
                  <span
                    className="text-[13px]"
                    style={{ color: "var(--theme-checkout-form-label-text, #222222)" }}
                  >
                    {benefit.text}
                    {benefit.subtext && (
                      <>
                        <br />
                        <span style={{ color: "var(--theme-checkout-order-summary-muted-text, #808080)" }}>
                          {benefit.subtext}
                        </span>
                      </>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="checkout-security-banner flex items-center gap-4 rounded-[8px] p-4 mb-6"
          style={{
            backgroundColor: "var(--theme-checkout-security-banner-bg, #E9F9FF)",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "var(--theme-checkout-security-banner-border, #1D95BF)"
          }}
        >
          <div className="shrink-0 w-8 h-8">
            <ShieldCheck
              className="checkout-security-banner-icon w-full h-full"
              style={{ color: "var(--theme-checkout-security-banner-icon, #0E4659)" }}
            />
          </div>
          <p
            className="checkout-security-banner-title flex-1 text-[16px] font-bold leading-[1.2]"
            style={{ color: "var(--theme-checkout-security-banner-title, #0E4659)" }}
          >
            {t("sslProtection") || "SSL Protected Payment"}
          </p>
          <div
            className="shrink-0 w-[1.5px] h-[44px]"
            style={{ backgroundColor: "var(--theme-checkout-order-summary-muted-text, #9A9A9A)" }}
          />
          <p
            className="checkout-security-banner-text flex-1 text-[14px] leading-[1.2]"
            style={{ color: "var(--theme-checkout-security-banner-text, #177799)" }}
          >
            {t("termsAcceptance") || "By proceeding you accept our terms and conditions."}
          </p>
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
          {t("payButton") || "PAY NOW"}
        </button>
      </div>
    </div>
  )
}
