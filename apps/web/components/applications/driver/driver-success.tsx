"use client"

import Link from "next/link"
import { Check } from "lucide-react"
import { useTranslations } from "next-intl"
import { LightButton, SERIF_FONT } from "@/components/applications/shared"
import { useDriverApplication } from "./driver-application-context"

const SUMMARY_KEYS = [
  "personal",
  "emailVerified",
  "vehicle",
  "documents",
  "billing",
  "availability",
  "videoIntro",
] as const

export function DriverSuccess() {
  const t = useTranslations("driverApplication.success")
  const { state } = useDriverApplication()
  const queuePosition = state.terms.queuePosition ?? 0

  return (
    <div className="w-full max-w-[600px] mx-auto flex flex-col gap-6 items-center">
      <div className="size-16 bg-[rgba(154,117,53,0.07)] border border-[rgba(154,117,53,0.22)] flex items-center justify-center">
        <Check size={26} strokeWidth={1.6} className="text-[#a08248]" />
      </div>

      <h1
        className="text-center text-[32px] leading-none text-[#1c1b18]"
        style={SERIF_FONT}
      >
        {t("title")}
      </h1>

      <p className="text-center text-[14px] text-[#696969] leading-[1.4] max-w-[480px]">
        {t("subtitle")}
      </p>

      <div className="w-full bg-[#0d0d0d] flex flex-col items-center gap-2 px-6 py-6">
        <span
          className="text-[#a08248] text-[44px] leading-none"
          style={SERIF_FONT}
        >
          #{queuePosition}
        </span>
        <p className="text-[13px] italic text-[rgba(255,255,255,0.7)] text-center leading-[1.4]">
          {t.rich("queueMessage", {
            position: () => (
              <span className="font-semibold not-italic text-white">{queuePosition}</span>
            ),
          })}
        </p>
      </div>

      <div className="w-full flex flex-col gap-0">
        <span className="text-[12px] font-semibold uppercase tracking-[0.5px] text-[#1c1b18] leading-none pb-3 border-b border-[rgba(28,27,24,0.08)]">
          {t("summaryLabel")}
        </span>
        {SUMMARY_KEYS.map((key) => (
          <div
            key={key}
            className="flex items-center gap-3 py-3 border-b border-[rgba(28,27,24,0.04)] last:border-b-0"
          >
            <span className="size-[34px] shrink-0 rounded-full bg-[rgba(46,125,82,0.08)] flex items-center justify-center">
              <Check size={14} strokeWidth={2} className="text-[#2e7d52]" />
            </span>
            <span className="text-[14px] text-[#1c1b18]">
              {t(`summary.${key}`)}
            </span>
          </div>
        ))}
      </div>

      <Link href="/" className="inline-flex">
        <LightButton size="lg" className="w-auto px-10">
          {t("backHome")}
        </LightButton>
      </Link>
    </div>
  )
}
