"use client"

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react"
import { cn } from "@workspace/ui/lib/utils"

type Variant = "primary" | "outline" | "softGold"
type Size = "lg" | "md"

interface LightButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  iconLeft?: ReactNode
  iconRight?: ReactNode
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-[#c9a96e] border border-[#c9a96e] text-white hover:bg-[#b89558] hover:border-[#b89558] disabled:opacity-50 disabled:cursor-not-allowed",
  outline:
    "bg-transparent border border-[#a08248] text-[#a08248] hover:bg-[rgba(154,117,53,0.07)] disabled:opacity-50 disabled:cursor-not-allowed",
  softGold:
    "bg-[rgba(154,117,53,0.07)] border border-[rgba(154,117,53,0.07)] text-[#a08248] hover:bg-[rgba(154,117,53,0.12)] hover:border-[rgba(154,117,53,0.22)] disabled:opacity-50 disabled:cursor-not-allowed",
}

const SIZE_CLASSES: Record<Size, string> = {
  lg: "h-[48px] px-[22px] text-[14px]",
  md: "h-[40px] px-[22px] text-[14px]",
}

export const LightButton = forwardRef<HTMLButtonElement, LightButtonProps>(
  function LightButton(
    {
      className,
      variant = "primary",
      size = "lg",
      iconLeft,
      iconRight,
      type = "button",
      children,
      ...rest
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium uppercase tracking-[1.1px] transition-colors",
          VARIANT_CLASSES[variant],
          SIZE_CLASSES[size],
          className,
        )}
        {...rest}
      >
        {iconLeft}
        <span className="px-2">{children}</span>
        {iconRight}
      </button>
    )
  },
)
