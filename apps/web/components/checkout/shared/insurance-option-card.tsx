"use client"

import { type ReactNode } from "react"
import { Check } from "lucide-react"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { cn } from "@workspace/ui/lib/utils"

interface InsuranceBenefit {
  text: string
  subtext?: string
}

interface InsuranceOptionCardProps {
  id: string
  title: string
  price: string
  subtitle?: string
  benefits: InsuranceBenefit[]
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  recommendedLabel?: string
  className?: string
}

export function InsuranceOptionCard({
  id,
  title,
  price,
  subtitle,
  benefits,
  checked,
  onCheckedChange,
  recommendedLabel,
  className,
}: InsuranceOptionCardProps) {
  return (
    <div
      className={cn("checkout-insurance-card border rounded-lg relative", className)}
      style={{ borderColor: "var(--theme-checkout-input-border, #e0e0e0)" }}
    >
      {recommendedLabel && (
        <div className="absolute -top-3 right-4 z-20">
          <span
            className="checkout-insurance-recommended text-[11px] font-bold px-2.5 py-1 rounded shadow-sm"
            style={{
              backgroundColor: "var(--theme-checkout-insurance-recommended-bg, #48d9a4)",
              color: "var(--theme-checkout-insurance-recommended-text, #FFFFFF)",
            }}
          >
            {recommendedLabel}
          </span>
        </div>
      )}
      <div
        className="checkout-insurance-header p-4 rounded-t-lg"
        style={{ backgroundColor: "var(--theme-checkout-insurance-header-bg, rgba(72, 217, 164, 0.1))" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Checkbox
              id={id}
              checked={checked}
              onCheckedChange={(c: boolean) => onCheckedChange(c)}
            />
            <label
              htmlFor={id}
              className="text-[16px] font-bold"
              style={{ color: "var(--theme-checkout-form-card-title, #222222)" }}
            >
              {title}
            </label>
          </div>
          <span
            className="text-[18px] font-bold"
            style={{ color: "var(--theme-checkout-form-card-title, #222222)" }}
          >
            {price}
          </span>
        </div>
      </div>

      <div
        className="p-4 rounded-b-lg"
        style={{ backgroundColor: "var(--theme-checkout-form-card-bg, #FFFFFF)" }}
      >
        {subtitle && (
          <h4
            className="text-[14px] font-bold mb-3"
            style={{ color: "var(--theme-checkout-form-card-title, #222222)" }}
          >
            {subtitle}
          </h4>
        )}
        <div className="space-y-2">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-2">
              <div
                className="checkout-insurance-check w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: "var(--theme-checkout-insurance-check-bg, #48d9a4)" }}
              >
                <Check
                  className="checkout-insurance-check-icon w-3 h-3"
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
  )
}

