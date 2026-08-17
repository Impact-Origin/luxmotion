"use client"

import Image from "next/image"
import { Plane, Search, Info, Backpack, Luggage, Briefcase, Lock, Plus, Minus, MapPin, Calendar, Users } from "lucide-react"
import { useTranslations } from "next-intl"

export function TransferInfoPreview() {
  const t = useTranslations("transfer")

  return (
    <div className="checkout-form-card w-full">
      <div
        className="rounded-lg shadow-sm p-6 mb-6"
        style={{ backgroundColor: "var(--theme-checkout-form-card-bg, #FFFFFF)" }}
      >
        <h2
          className="text-[22px] font-bold mb-6"
          style={{ color: "var(--theme-checkout-form-card-title, #222222)" }}
        >
          {t("title")}
        </h2>

        <div className="flex gap-3 mb-6">
          <button
            className="flex-1 py-3 rounded-lg font-semibold text-[15px] transition-colors"
            style={{
              backgroundColor: "var(--theme-checkout-form-tab-active-bg, #27C7FF)",
              color: "var(--theme-checkout-form-tab-active-text, #FFFFFF)"
            }}
          >
            {t("outbound")}
          </button>
          <button
            className="flex-1 py-3 rounded-lg font-semibold text-[15px] transition-colors"
            style={{
              backgroundColor: "var(--theme-checkout-form-tab-inactive-bg, #F7F7F7)",
              color: "var(--theme-checkout-form-tab-inactive-text, #222222)"
            }}
          >
            {t("return")}
          </button>
        </div>

        <div
          className="mb-4 p-2.5 rounded"
          style={{ backgroundColor: "var(--theme-checkout-form-checkbox-bg, #F7F7F7)" }}
        >
          <label className="flex items-center gap-2 cursor-pointer">
            <div className="w-4 h-4 border-2 rounded border-gray-300" />
            <span
              className="text-[13px]"
              style={{ color: "var(--theme-checkout-form-label-text, #222222)" }}
            >
              {t("bookReturn")}
            </span>
          </label>
        </div>

        <div className="mb-6">
          <label
            className="checkout-input-label block text-[15px] font-semibold mb-2"
            style={{ color: "var(--theme-checkout-form-label-text, #222222)" }}
          >
            {t("from")}
          </label>
          <div
            className="checkout-input-field flex items-center gap-3 p-3 rounded-lg border"
            style={{
              backgroundColor: "var(--theme-checkout-input-bg, #FFFFFF)",
              borderColor: "var(--theme-checkout-input-border, #E5E7EB)"
            }}
          >
            <MapPin
              className="checkout-input-icon w-5 h-5"
              style={{ color: "var(--theme-checkout-input-icon, #27C7FF)" }}
            />
            <span
              className="checkout-input-placeholder text-[14px]"
              style={{ color: "var(--theme-checkout-input-placeholder, #9CA3AF)" }}
            >
              {t("departureLocation")}
            </span>
          </div>
        </div>

        <button
          className="checkout-link-button flex items-center gap-2 text-[14px] font-semibold transition-colors mb-6"
          style={{ color: "var(--theme-checkout-form-link-text, #27C7FF)" }}
        >
          <Plus className="w-4 h-4" style={{ color: "var(--theme-checkout-form-link-text, #27C7FF)" }} />
          {t("addStop") || "Add stop"}
        </button>

        <div className="mb-6">
          <label
            className="checkout-input-label block text-[15px] font-semibold mb-2"
            style={{ color: "var(--theme-checkout-form-label-text, #222222)" }}
          >
            {t("to")}
          </label>
          <div
            className="checkout-input-field flex items-center gap-3 p-3 rounded-lg border"
            style={{
              backgroundColor: "var(--theme-checkout-input-bg, #FFFFFF)",
              borderColor: "var(--theme-checkout-input-border, #E5E7EB)"
            }}
          >
            <MapPin
              className="checkout-input-icon w-5 h-5"
              style={{ color: "var(--theme-checkout-input-icon, #27C7FF)" }}
            />
            <span
              className="checkout-input-placeholder text-[14px]"
              style={{ color: "var(--theme-checkout-input-placeholder, #9CA3AF)" }}
            >
              {t("destinationLocation")}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <label
            className="checkout-input-label block text-[15px] font-semibold mb-2"
            style={{ color: "var(--theme-checkout-form-label-text, #222222)" }}
          >
            {t("dateTime")}
          </label>
          <div
            className="checkout-input-field flex items-center gap-3 p-3 rounded-lg border"
            style={{
              backgroundColor: "var(--theme-checkout-input-bg, #FFFFFF)",
              borderColor: "var(--theme-checkout-input-border, #E5E7EB)"
            }}
          >
            <Calendar
              className="checkout-input-icon w-5 h-5"
              style={{ color: "var(--theme-checkout-input-icon, #27C7FF)" }}
            />
            <span
              className="checkout-input-placeholder text-[14px]"
              style={{ color: "var(--theme-checkout-input-placeholder, #9CA3AF)" }}
            >
              Select date and time
            </span>
          </div>
        </div>

        <div className="mb-4">
          <label
            className="checkout-input-label block text-[15px] font-semibold mb-2"
            style={{ color: "var(--theme-checkout-form-label-text, #222222)" }}
          >
            {t("flightNumber")}
          </label>
          <div
            className="checkout-input-field flex items-center gap-3 p-3 rounded-lg border"
            style={{
              backgroundColor: "var(--theme-checkout-input-bg, #FFFFFF)",
              borderColor: "var(--theme-checkout-input-border, #E5E7EB)"
            }}
          >
            <Plane
              className="checkout-input-icon w-5 h-5"
              style={{ color: "var(--theme-checkout-input-icon, #27C7FF)" }}
            />
            <span
              className="checkout-input-placeholder flex-1 text-[14px]"
              style={{ color: "var(--theme-checkout-input-placeholder, #9CA3AF)" }}
            >
              TP1691
            </span>
            <Search
              className="checkout-input-icon w-5 h-5 cursor-pointer"
              style={{ color: "var(--theme-checkout-input-icon, #27C7FF)" }}
            />
          </div>
        </div>

        <div
          className="flex gap-3 p-3 rounded-lg mb-6"
          style={{ backgroundColor: "var(--theme-checkout-form-info-box-bg, #F5F5F5)" }}
        >
          <Info
            data-theme-color="checkoutFormInfoBoxIcon"
            className="w-5 h-5 flex-shrink-0 mt-0.5"
            style={{
              color: "var(--theme-checkout-form-info-box-icon, #27C7FF)",
              stroke: "var(--theme-checkout-form-info-box-icon, #27C7FF)",
              fill: "none",
            }}
          />
          <p
            className="text-[13px] leading-relaxed"
            style={{ color: "var(--theme-checkout-form-info-box-text, #404040)" }}
          >
            {t("flightInfo")}
          </p>
        </div>

        <div className="mb-6">
          <label
            className="block text-[15px] font-semibold mb-3"
            style={{ color: "var(--theme-checkout-form-label-text, #222222)" }}
          >
            {t("passengers")}
          </label>
          <div
            className="checkout-counter flex items-center justify-between rounded-lg border p-2.5"
            style={{
              backgroundColor: "var(--theme-checkout-counter-bg, #FFFFFF)",
              borderColor: "var(--theme-checkout-counter-border, #E5E7EB)"
            }}
          >
            <button
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "var(--theme-checkout-counter-button-bg, #27C7FF)",
              }}
            >
              <Minus
                className="w-3.5 h-3.5"
                style={{ color: "var(--theme-checkout-counter-button-icon, #FFFFFF)" }}
              />
            </button>
            <span
              className="text-[18px] font-bold min-w-[32px] text-center"
              style={{ color: "var(--theme-checkout-counter-value-text, #222222)" }}
            >
              2
            </span>
            <button
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "var(--theme-checkout-counter-button-bg, #27C7FF)",
              }}
            >
              <Plus
                className="w-3.5 h-3.5"
                style={{ color: "var(--theme-checkout-counter-button-icon, #FFFFFF)" }}
              />
            </button>
          </div>
        </div>

        <div className="mb-4">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: t("backpack"), icon: Backpack },
              { label: t("handLuggage"), icon: Luggage },
              { label: t("checkedBaggage"), icon: Briefcase },
            ].map((item) => (
              <div key={item.label} className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 mb-3 min-w-0 h-10">
                  <item.icon
                    className="w-6 h-6"
                    style={{ color: "var(--theme-checkout-form-label-text, #222222)" }}
                  />
                  <span
                    className="text-base font-semibold leading-tight"
                    style={{ color: "var(--theme-checkout-form-label-text, #222222)" }}
                  >
                    {item.label}
                  </span>
                </div>
                <div
                  className="checkout-counter flex items-center justify-between rounded-lg border px-4 py-2"
                  style={{
                    backgroundColor: "var(--theme-checkout-counter-bg, #FFFFFF)",
                    borderColor: "var(--theme-checkout-counter-border, #E5E7EB)"
                  }}
                >
                  <button
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: "var(--theme-checkout-counter-button-bg, #27C7FF)",
                    }}
                  >
                    <Minus
                      className="w-3.5 h-3.5"
                      style={{ color: "var(--theme-checkout-counter-button-icon, #FFFFFF)" }}
                    />
                  </button>
                  <span
                    className="text-[18px] font-bold min-w-[32px] text-center"
                    style={{ color: "var(--theme-checkout-counter-value-text, #222222)" }}
                  >
                    0
                  </span>
                  <button
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: "var(--theme-checkout-counter-button-bg, #27C7FF)",
                    }}
                  >
                    <Plus
                      className="w-3.5 h-3.5"
                      style={{ color: "var(--theme-checkout-counter-button-icon, #FFFFFF)" }}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="flex items-center justify-between p-4 rounded-lg mb-6"
          style={{ backgroundColor: "var(--theme-checkout-form-highlight-bg, #DFF7FF)" }}
        >
          <p
            className="text-[14px]"
            style={{ color: "var(--theme-checkout-form-highlight-text, #0E4659)" }}
          >
            {t("luggageLimit")}
          </p>
          <button
            className="px-5 h-9 text-[14px] font-semibold rounded-lg"
            style={{
              backgroundColor: "var(--theme-checkout-primary-button-bg, #27C7FF)",
              color: "var(--theme-checkout-primary-button-text, #FFFFFF)"
            }}
          >
            {t("upgrade").toUpperCase()}
          </button>
        </div>

        <div className="mb-6">
          <div className="mb-4 flex items-center gap-2">
            <div
              className="w-4 h-4 border-2 rounded flex items-center justify-center"
              style={{
                borderColor: "var(--theme-checkout-primary-button-bg, #27C7FF)",
                backgroundColor: "var(--theme-checkout-primary-button-bg, #27C7FF)"
              }}
            >
              <span className="text-white text-xs">✓</span>
            </div>
            <label
              className="text-base font-semibold inline-flex items-center gap-2 cursor-pointer"
              style={{ color: "var(--theme-checkout-form-label-text, #222222)" }}
            >
              <Image
                src="/shared/icons/baby-car-seat.svg"
                alt="Baby car seat"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              {t("childSeat")}
            </label>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              {
                title: t("babySeat"),
                ageRange: t("babySeatAge"),
                image: "/shared/c589411c-9d31-4b5a-82af.jpeg",
                isSelected: true
              },
              {
                title: t("childSeatLabel"),
                ageRange: t("childSeatAge"),
                image: "/shared/cadeira-crianca.jpeg",
                isSelected: false
              },
              {
                title: t("boosterSeat"),
                ageRange: t("boosterSeatAge"),
                image: "/shared/banco-elevatorio.jpeg",
                isSelected: false
              },
            ].map((seat) => (
              <div
                key={seat.title}
                className="border-2 rounded-2xl overflow-hidden flex flex-col"
                style={{
                  backgroundColor: "var(--theme-checkout-form-card-bg, #FFFFFF)",
                  borderColor: seat.isSelected
                    ? "var(--theme-checkout-primary-button-bg, #27C7FF)"
                    : "var(--theme-checkout-input-border, #D0D0D0)"
                }}
              >
                <div className="h-36 flex items-center justify-center p-4 pt-4">
                  <Image
                    src={seat.image}
                    alt={seat.title}
                    width={240}
                    height={140}
                    className="max-h-full w-auto object-contain scale-125"
                  />
                </div>
                <div className="px-4 pb-4 flex-1 flex flex-col">
                  <h4
                    className="text-sm font-bold mb-0.5"
                    style={{ color: "var(--theme-checkout-form-label-text, #222222)" }}
                  >
                    {seat.title}
                  </h4>
                  <p
                    className="text-xs mb-3 uppercase tracking-wide"
                    style={{ color: "var(--theme-checkout-order-summary-muted-text, #808080)" }}
                  >
                    {seat.ageRange}
                  </p>
                  <div
                    className="checkout-counter flex items-center justify-between rounded-lg border px-3 py-1.5 mt-auto"
                    style={{
                      backgroundColor: "var(--theme-checkout-counter-bg, #FFFFFF)",
                      borderColor: "var(--theme-checkout-counter-border, #E5E7EB)"
                    }}
                  >
                    <button
                      className="w-7 h-7 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: "var(--theme-checkout-counter-button-bg, #27C7FF)",
                      }}
                    >
                      <Minus
                        className="w-3 h-3"
                        style={{ color: "var(--theme-checkout-counter-button-icon, #FFFFFF)" }}
                      />
                    </button>
                    <span
                      className="text-[16px] font-bold min-w-[24px] text-center"
                      style={{ color: "var(--theme-checkout-counter-value-text, #222222)" }}
                    >
                      {seat.isSelected ? 1 : 0}
                    </span>
                    <button
                      className="w-7 h-7 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: "var(--theme-checkout-counter-button-bg, #27C7FF)",
                      }}
                    >
                      <Plus
                        className="w-3 h-3"
                        style={{ color: "var(--theme-checkout-counter-button-icon, #FFFFFF)" }}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-4 h-4 border-2 rounded flex items-center justify-center"
              style={{
                borderColor: "var(--theme-checkout-primary-button-bg, #27C7FF)",
                backgroundColor: "var(--theme-checkout-primary-button-bg, #27C7FF)"
              }}
            >
              <span className="text-white text-xs">✓</span>
            </div>
            <label
              className="text-[15px] font-semibold flex items-center gap-2"
              style={{ color: "var(--theme-checkout-form-label-text, #222222)" }}
            >
              <Image src="/shared/icons/surf.svg" alt="Surfboard" width={24} height={24} className="w-5 h-5" />
              {t("surfboard")}
            </label>
          </div>
          <div
            className="checkout-counter flex items-center justify-between rounded-lg border px-4 py-2.5 max-w-[200px]"
            style={{
              backgroundColor: "var(--theme-checkout-counter-bg, #FFFFFF)",
              borderColor: "var(--theme-checkout-counter-border, #E5E7EB)"
            }}
          >
            <button
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "var(--theme-checkout-counter-button-bg, #27C7FF)",
              }}
            >
              <Minus
                className="w-3.5 h-3.5"
                style={{ color: "var(--theme-checkout-counter-button-icon, #FFFFFF)" }}
              />
            </button>
            <span
              className="text-[18px] font-bold min-w-[32px] text-center"
              style={{ color: "var(--theme-checkout-counter-value-text, #222222)" }}
            >
              1
            </span>
            <button
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "var(--theme-checkout-counter-button-bg, #27C7FF)",
              }}
            >
              <Plus
                className="w-3.5 h-3.5"
                style={{ color: "var(--theme-checkout-counter-button-icon, #FFFFFF)" }}
              />
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-4 h-4 border-2 rounded flex items-center justify-center"
              style={{
                borderColor: "var(--theme-checkout-primary-button-bg, #27C7FF)",
                backgroundColor: "var(--theme-checkout-primary-button-bg, #27C7FF)"
              }}
            >
              <span className="text-white text-xs">✓</span>
            </div>
            <label
              className="text-[15px] font-semibold flex items-center gap-2"
              style={{ color: "var(--theme-checkout-form-label-text, #222222)" }}
            >
              <Image src="/shared/icons/paw.svg" alt="Pet" width={24} height={24} className="w-5 h-5" />
              {t("pet")}
            </label>
          </div>
          <div
            className="checkout-counter flex items-center justify-between rounded-lg border px-4 py-2.5 max-w-[200px]"
            style={{
              backgroundColor: "var(--theme-checkout-counter-bg, #FFFFFF)",
              borderColor: "var(--theme-checkout-counter-border, #E5E7EB)"
            }}
          >
            <button
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "var(--theme-checkout-counter-button-bg, #27C7FF)",
              }}
            >
              <Minus
                className="w-3.5 h-3.5"
                style={{ color: "var(--theme-checkout-counter-button-icon, #FFFFFF)" }}
              />
            </button>
            <span
              className="text-[18px] font-bold min-w-[32px] text-center"
              style={{ color: "var(--theme-checkout-counter-value-text, #222222)" }}
            >
              1
            </span>
            <button
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "var(--theme-checkout-counter-button-bg, #27C7FF)",
                color: "var(--theme-checkout-counter-button-icon, #FFFFFF)"
              }}
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div
            className="flex items-center gap-3 p-4 rounded-lg"
            style={{ backgroundColor: "var(--theme-checkout-form-highlight-bg, #DFF7FF)" }}
          >
            <div className="w-4 h-4 border-2 rounded border-gray-300" />
            <label
              className="text-[14px]"
              style={{ color: "var(--theme-checkout-form-highlight-text, #0E4659)" }}
            >
              {t("agreeTerms")}
            </label>
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
          {t("continueWithPrice", { price: "45,00" })}
        </button>
      </div>
    </div>
  )
}
