"use client"

import Image from "next/image"
import { Counter } from "@/components/ui/counter"
import { cn } from "@workspace/ui/lib/utils"

interface ExtrasCardProps {
  title: string
  subtitle: string
  image: string
  value: number
  onChange: (value: number) => void
  isSelected?: boolean
  variant?: "mobile" | "desktop"
  badge?: string
  infoText?: string
  imageRotation?: string
  className?: string
}

export function ExtrasCard({
  title,
  subtitle,
  image,
  value,
  onChange,
  isSelected = false,
  variant = "desktop",
  badge,
  infoText,
  imageRotation,
  className,
}: ExtrasCardProps) {
  const borderColor = isSelected
    ? "var(--theme-checkout-primary-button-bg, #27C7FF)"
    : "var(--theme-checkout-input-border, #BFBFBF)"

  if (variant === "mobile") {
    return (
      <div
        className={cn(
          "min-w-0 w-full border rounded-xl p-2.5 flex flex-col shadow-[0px_4px_10px_rgba(0,0,0,0.05)] relative overflow-visible",
          className
        )}
        style={{
          backgroundColor: "var(--theme-checkout-form-card-bg, #FFFFFF)",
          borderColor,
        }}
      >
        {badge && (
          <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#E9F9FF] rounded-full px-2 py-1 z-10 flex items-center justify-center">
            <span className="text-[10px] font-medium text-[#0E4659] leading-none truncate max-w-[100px]">{badge}</span>
          </div>
        )}
        <div className="h-[58px] flex items-center justify-center overflow-visible">
          <Image
            src={image}
            alt={title}
            width={100}
            height={58}
            className={cn("max-h-full w-auto object-contain", imageRotation)}
          />
        </div>
        <div className="flex flex-col gap-0.5 min-h-[36px]">
          <h4
            className="text-[11px] font-bold leading-tight line-clamp-2"
            style={{ color: "var(--theme-checkout-form-label-text, #222222)" }}
          >
            {title}
          </h4>
          <p
            className="text-[9px] uppercase tracking-wide line-clamp-1"
            style={{ color: "var(--theme-checkout-order-summary-muted-text, #808080)" }}
          >
            {subtitle}
          </p>
          {infoText && (
            <p className="text-[9px] tracking-wide text-[#125A73] line-clamp-1">
              {infoText}
            </p>
          )}
        </div>
        <Counter
          value={value}
          onChange={onChange}
          min={0}
          variant="tiny"
          className="w-full max-w-[90px] mx-auto relative z-10"
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        "border rounded-2xl p-4 flex flex-col gap-2 relative min-h-[200px]",
        className
      )}
      style={{
        backgroundColor: "var(--theme-checkout-form-card-bg, #FFFFFF)",
        borderColor,
      }}
    >
      {badge && (
        <div className="absolute top-2 right-2 bg-[#E9F9FF] rounded-full px-3 py-0.5 z-10">
          <span className="text-[12px] font-medium text-[#0E4659] whitespace-nowrap">{badge}</span>
        </div>
      )}
      <div className="flex-1 flex items-start gap-2">
        <div className="flex flex-col gap-1 shrink-0 w-[107px]">
          <h4
            className="text-[14px] font-bold leading-snug max-w-[50px]"
            style={{ color: "var(--theme-checkout-form-label-text, #222222)" }}
          >
            {title}
          </h4>
          <p
            className="text-[11px] uppercase tracking-wide max-w-[80px]"
            style={{ color: "var(--theme-checkout-order-summary-muted-text, #808080)" }}
          >
            {subtitle}
          </p>
          {infoText && (
            <p className="text-[11px] tracking-wide text-[#125A73]">
              {infoText}
            </p>
          )}
        </div>
        <div className="flex-1 flex items-center justify-center h-[100px] mt-6 overflow-visible">
          <Image
            src={image}
            alt={title}
            width={180}
            height={100}
            className={cn("max-h-full w-auto object-contain", imageRotation)}
          />
        </div>
      </div>
      <Counter
        value={value}
        onChange={onChange}
        min={0}
        variant="tiny"
        className="w-[130px] mx-auto relative z-10"
      />
    </div>
  )
}
