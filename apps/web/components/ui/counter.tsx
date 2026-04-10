"use client"

import { Minus, Plus } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

type CounterVariant = "default" | "compact" | "mobile" | "tiny"

interface CounterProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  variant?: CounterVariant
  className?: string
  buttonClassName?: string
  valueClassName?: string
}

const variantStyles: Record<CounterVariant, { container: string; button: string; value: string; icon: string }> = {
  default: {
    container: "checkout-counter flex items-center justify-between rounded-lg p-2.5",
    button: "w-7 h-7 rounded-full flex items-center justify-center transition-colors",
    value: "text-[18px] font-medium min-w-[32px] text-center",
    icon: "w-3.5 h-3.5",
  },
  compact: {
    container: "checkout-counter flex items-center justify-between rounded-lg px-3 py-2",
    button: "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
    value: "text-base font-medium min-w-[20px] text-center",
    icon: "w-4 h-4",
  },
  mobile: {
    container: "checkout-counter flex items-center justify-between rounded-[6px] px-2.5 h-12",
    button: "w-7 h-7 rounded-full flex items-center justify-center shadow-[0px_4px_6px_rgba(0,0,0,0.07)]",
    value: "text-[14px] font-medium min-w-[32px] text-center",
    icon: "w-3 h-3",
  },
  tiny: {
    container: "checkout-counter flex items-center justify-between rounded-[6px] px-2 h-[38px] min-w-[100px]",
    button: "w-[21px] h-[21px] rounded-full flex items-center justify-center shadow-[0px_2px_4px_rgba(0,0,0,0.05)]",
    value: "text-[14px] font-medium min-w-[24px] text-center",
    icon: "w-2.5 h-2.5",
  },
}

export function Counter({
  value,
  onChange,
  min = 0,
  max = Infinity,
  variant = "default",
  className,
  buttonClassName,
  valueClassName,
}: CounterProps) {
  const styles = variantStyles[variant]

  const handleDecrease = () => {
    if (value > min) {
      onChange(value - 1)
    }
  }

  const handleIncrease = () => {
    if (value < max) {
      onChange(value + 1)
    }
  }

  return (
    <div
      className={cn(styles.container, className)}
      style={{
        backgroundColor: "var(--theme-checkout-counter-bg, #FFFFFF)",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "var(--theme-checkout-counter-border, #E5E7EB)"
      }}
    >
      <button
        type="button"
        onClick={handleDecrease}
        disabled={value <= min}
        className={cn(styles.button, "disabled:opacity-50 disabled:cursor-not-allowed", buttonClassName)}
        style={{
          backgroundColor: "var(--theme-checkout-counter-button-bg, #27C7FF)",
        }}
      >
        <Minus className={styles.icon} style={{ color: "var(--theme-checkout-counter-button-icon, #FFFFFF)" }} />
      </button>
      <span
        className={cn(styles.value, valueClassName)}
        style={{ color: "var(--theme-checkout-counter-value-text, #222222)" }}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={handleIncrease}
        disabled={value >= max}
        className={cn(styles.button, "disabled:opacity-50 disabled:cursor-not-allowed", buttonClassName)}
        style={{
          backgroundColor: "var(--theme-checkout-counter-button-bg, #27C7FF)",
        }}
      >
        <Plus className={styles.icon} style={{ color: "var(--theme-checkout-counter-button-icon, #FFFFFF)" }} />
      </button>
    </div>
  )
}

