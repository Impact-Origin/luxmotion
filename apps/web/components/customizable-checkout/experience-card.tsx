"use client"

import { Plus, Clock, MapPin } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { useMoney } from "@/components/currency-provider"

interface ExperienceCardProps {
  title: string
  price: number
  duration: string
  image: string
  distanceKm?: number
  onAdd?: () => void
}

export function ExperienceCard({ title, price, duration, image, distanceKm, onAdd }: ExperienceCardProps) {
  const t = useTranslations("experiences")
  const { format } = useMoney()

  return (
    <div
      data-theme-color="checkoutFormCardBg"
      className="checkout-form-card rounded-2xl overflow-hidden border"
      style={{
        backgroundColor: "var(--theme-checkout-form-card-bg, #FFFFFF)",
        borderColor: "var(--theme-checkout-input-border, #DEDEDE)",
      }}
    >
      <div className="relative h-56">
        <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
        {distanceKm !== undefined && (
          <div
            data-theme-color="checkoutFormCheckboxBg"
            className="absolute top-3 left-3 flex items-center gap-1 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: "var(--theme-checkout-form-checkbox-bg, #F7F7F7)" }}
          >
            <MapPin
              data-theme-color="checkoutFormInfoBoxIcon"
              className="w-3.5 h-3.5"
              style={{ color: "var(--theme-checkout-form-info-box-icon, #27C7FF)" }}
            />
            <span
              data-theme-color="checkoutFormInfoBoxText"
              style={{ color: "var(--theme-checkout-form-info-box-text, #0E4659)" }}
            >
              {t("distanceAway", { distance: distanceKm })}
            </span>
          </div>
        )}
      </div>
      <div className="p-4 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <h3
            data-theme-color="checkoutFormCardTitle"
            className="text-lg font-bold truncate"
            style={{ color: "var(--theme-checkout-form-card-title, #222222)" }}
          >
            {title}
          </h3>
          <div
            data-theme-color="checkoutFormHighlightBg"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-2xl w-fit mt-1"
            style={{ backgroundColor: "var(--theme-checkout-form-highlight-bg, #E9F9FF)" }}
          >
            <Clock
              data-theme-color="checkoutFormHighlightText"
              className="w-4 h-4"
              style={{ color: "var(--theme-checkout-form-highlight-text, #0E4659)" }}
            />
            <span
              data-theme-color="checkoutFormHighlightText"
              className="text-sm font-medium"
              style={{ color: "var(--theme-checkout-form-highlight-text, #0E4659)" }}
            >
              {duration}
            </span>
          </div>
        </div>
        <div
          data-theme-color="checkoutOrderSummaryTotalPrice"
          className="text-xl font-extrabold shrink-0"
          style={{ color: "var(--theme-checkout-order-summary-total-price, #222222)" }}
        >
          {format(price)}
        </div>
        <button
          data-theme-color="checkoutPrimaryButtonBg"
          onClick={onAdd}
          className="size-10 shrink-0 rounded-full transition-colors flex items-center justify-center"
          style={{
            backgroundColor: "var(--theme-checkout-primary-button-bg, #27C7FF)",
            color: "var(--theme-checkout-primary-button-icon, #FFFFFF)",
          }}
        >
          <Plus
            data-theme-color="checkoutPrimaryButtonIcon"
            className="size-5"
            strokeWidth={3}
            style={{ color: "var(--theme-checkout-primary-button-icon, #FFFFFF)" }}
          />
        </button>
      </div>
    </div>
  )
}
