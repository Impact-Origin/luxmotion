"use client"

import type { ReactNode } from "react"
import { cn } from "@workspace/ui/lib/utils"

interface PaymentMethodButtonProps {
  selected: boolean
  onSelect: () => void
  icon: ReactNode
  label: string
}

export function PaymentMethodButton({ selected, onSelect, icon, label }: PaymentMethodButtonProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "checkout-payment-method-button flex flex-col items-start gap-1.5 md:gap-2 p-2 md:p-3 rounded-lg border-2 transition-all min-h-[68px] md:min-h-0",
        selected && "checkout-payment-method-selected"
      )}
      style={{
        backgroundColor: selected
          ? "var(--theme-checkout-payment-method-selected-bg, #e9f9ff)"
          : "var(--theme-checkout-payment-method-unselected-bg, #FFFFFF)",
        borderColor: selected
          ? "var(--theme-checkout-payment-method-selected-border, #27c7ff)"
          : "var(--theme-checkout-payment-method-unselected-border, #e0e0e0)",
      }}
    >
      <span
        className="checkout-payment-method-icon"
        style={{ color: "var(--theme-checkout-payment-method-icon, #222222)" }}
      >
        {icon}
      </span>
      <span
        className="checkout-payment-method-text text-[12px] md:text-[13px] font-medium"
        style={{ color: "var(--theme-checkout-payment-method-text, #222222)" }}
      >
        {label}
      </span>
    </button>
  )
}

