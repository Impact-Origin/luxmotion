"use client"

import { ArrowRight, Moon, SunMedium } from "lucide-react"
import { useTranslations } from "next-intl"
import {
  ApplicationBottomBar,
  StepHeader,
} from "@/components/applications/shared"
import { usePartnerApplication } from "../partner-application-context"

const SERIF_FONT = {
  fontFamily: "var(--font-title), 'Cormorant Garamond', serif",
} as const

type Period = "day" | "night"

interface RouteRow {
  route: string
  period: Period
  price: string
}

const ROUTES: RouteRow[] = [
  { route: "Aeroporto LIS → Lisboa Centro", period: "day", price: "€25,00" },
  { route: "Aeroporto LIS → Cascais", period: "day", price: "€40,00" },
  { route: "Aeroporto LIS → Sintra", period: "day", price: "€38,00" },
  { route: "Aeroporto LIS → Lisboa Centro", period: "night", price: "€28,00" },
  { route: "Aeroporto LIS → Cascais", period: "night", price: "€44,00" },
  { route: "Aeroporto LIS → Sintra", period: "night", price: "€42,00" },
]

export function PartnerStepPriceAgreement() {
  const t = useTranslations("partnerApplication.stepPriceAgreement")
  const tCommon = useTranslations("common")
  const { acknowledgePriceAgreement, nextStep, prevStep } = usePartnerApplication()

  function handleConfirm() {
    acknowledgePriceAgreement()
    nextStep()
  }

  return (
    <form
      className="w-full max-w-[600px] mx-auto flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault()
        handleConfirm()
      }}
    >
      <StepHeader title={t("title")} subtitle={t("subtitle")} />

      <div className="bg-white border border-[rgba(28,27,24,0.08)] w-full">
        <div className="bg-[#0d0d0d] flex flex-col items-center justify-center gap-2 text-center px-6 py-[25px]">
          <p className="text-[24px] leading-tight text-white" style={SERIF_FONT}>
            {t("table.title")}
          </p>
          <p className="text-[14px] leading-none text-[#999]">{t("table.subtitle")}</p>
        </div>

        <div className="flex items-center w-full border-b border-[rgba(28,27,24,0.08)]">
          <div className="flex-1 min-w-0 p-[10px]">
            <span className="text-[10px] font-medium uppercase tracking-[1.1px] text-[#a08248]">
              {t("table.cols.route")}
            </span>
          </div>
          <div className="shrink-0 w-[120px] flex items-center justify-center p-[10px]">
            <span className="text-[10px] font-medium uppercase tracking-[1.1px] text-[#a08248]">
              {t("table.cols.period")}
            </span>
          </div>
          <div className="shrink-0 w-[100px] flex items-center justify-center p-[10px]">
            <span className="text-[10px] font-medium uppercase tracking-[1.1px] text-[#a08248]">
              {t("table.cols.amount")}
            </span>
          </div>
        </div>

        {ROUTES.map((row, idx) => {
          const Icon = row.period === "day" ? SunMedium : Moon
          const periodLabel = row.period === "day" ? t("table.day") : t("table.night")
          return (
            <div
              key={`${row.route}-${row.period}`}
              className={
                "flex items-center w-full" +
                (idx === ROUTES.length - 1 ? "" : " border-b border-[rgba(28,27,24,0.08)]")
              }
            >
              <div className="flex-1 min-w-0 p-[10px]">
                <p className="text-[12px] text-[#0d0d0d] truncate">{row.route}</p>
              </div>
              <div className="shrink-0 w-[120px] flex items-center justify-center gap-2 p-[10px]">
                <Icon size={16} strokeWidth={1.6} className="text-[#0d0d0d]" />
                <span className="text-[12px] text-[#0d0d0d]">{periodLabel}</span>
              </div>
              <div className="shrink-0 w-[100px] flex items-center justify-center p-[10px]">
                <span className="text-[12px] font-semibold text-[#0d0d0d]">{row.price}</span>
              </div>
            </div>
          )
        })}
      </div>

      <ApplicationBottomBar
        backLabel={tCommon("back")}
        continueLabel={t("confirmCta")}
        onBack={prevStep}
        canContinue
      />
    </form>
  )
}
