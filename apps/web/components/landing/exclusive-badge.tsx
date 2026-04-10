"use client"

import { BadgeCheck } from "lucide-react"
import { useTranslations } from "next-intl"

export function ExclusiveBadge() {
  const t = useTranslations()

  return (
    <div
      data-theme-color="exclusiveBadgeBg"
      className="exclusive-badge flex flex-col justify-center items-center gap-2 py-2 px-4 rounded-full border"
      style={{
        borderColor: "color-mix(in srgb, var(--theme-payment-exclusive-badge-icon, #177799) 35%, transparent)",
        backgroundColor: "var(--theme-exclusive-badge-bg, #0e4659)",
      }}
    >
      <div className="flex items-center">
        <BadgeCheck data-theme-color="paymentExclusiveBadgeIcon" className="size-6" style={{ color: "var(--theme-payment-exclusive-badge-icon, #48CAE4)" }} />
        <div
          data-theme-color="buttonText"
          className="flex justify-center items-center gap-2.5 py-0 px-2 text-sm leading-[normal]"
          style={{ color: "var(--theme-button-text, #ffffff)" }}
        >
          {t("exclusive")}
        </div>
      </div>
    </div>
  )
}
