"use client"

import { forwardRef, type InputHTMLAttributes } from "react"
import { useTranslations } from "next-intl"
import { cn } from "@workspace/ui/lib/utils"

type LightInputProps = InputHTMLAttributes<HTMLInputElement>

export const LightInput = forwardRef<HTMLInputElement, LightInputProps>(
  function LightInput({ className, onInvalid, onInput, ...rest }, ref) {
    const t = useTranslations("validation")

    const messageFor = (el: HTMLInputElement) => {
      const v = el.validity
      if (v.valueMissing) return t("required")
      if (v.typeMismatch) return el.type === "email" ? t("email") : t("invalid")
      if (v.patternMismatch) return t("invalid")
      return ""
    }

    return (
      <input
        ref={ref}
        className={cn(
          "w-full h-[44px] px-[13px] bg-white border border-[rgba(28,27,24,0.08)] text-[14px] text-[#1c1b18] placeholder:text-[rgba(140,134,128,0.6)] focus:outline-none focus:border-[#a08248] transition-colors",
          className,
        )}
        onInvalid={(e) => {
          e.currentTarget.setCustomValidity(messageFor(e.currentTarget))
          onInvalid?.(e)
        }}
        onInput={(e) => {
          e.currentTarget.setCustomValidity("")
          onInput?.(e)
        }}
        {...rest}
      />
    )
  },
)
