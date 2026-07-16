"use client"

import { ShieldCheck, User, Clock } from "lucide-react"
import { useTranslations } from "next-intl"

export function TrustBanner() {
  const t = useTranslations("checkout.trustBanner")

  const items = [
    { icon: ShieldCheck, text: t("shortRating") },
    { icon: User, text: t("shortDrivers") },
    { icon: Clock, text: t("shortFlight") },
  ]

  return (
    <div className="bg-[#A08248] border-b border-[rgba(var(--ck-text-rgb,255,255,255),0.12)]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-[48px] 2xl:px-[130px] py-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
        {items.map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-[5px]">
            <Icon className="size-[12px] text-[var(--ck-text,#f7f4ef)]" strokeWidth={2} />
            <span
              className="text-[12px] text-[var(--ck-text,#f7f4ef)] leading-none whitespace-nowrap"
              style={{ fontFamily: "var(--font-sans), Inter, system-ui, sans-serif" }}
            >
              {text}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
