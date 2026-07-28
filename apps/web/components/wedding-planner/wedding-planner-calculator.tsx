"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { LightSelect } from "@/components/applications/shared"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { cn } from "@workspace/ui/lib/utils"

const SANS = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const
const SERIF = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const

const WEDDINGS_OPTIONS = ["2", "4", "6", "8", "10", "15", "20"]
const GUESTS_OPTIONS = ["60", "80", "100", "120", "150", "200"]
const COMMISSION_OPTIONS = ["10", "12", "15", "18", "20"]

const AVG_GUEST_SPEND = 80

function formatEuro(n: number) {
  return "€ " + n.toLocaleString("pt-PT").replace(/,/g, " ")
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-[12px] font-semibold text-[#0d0d0d] leading-none"
      style={SANS}
    >
      {children}
    </span>
  )
}

export function WeddingPlannerCalculator() {
  const t = useTranslations("weddingPlanner.calculator")

  const [weddings, setWeddings] = useState("4")
  const [guests, setGuests] = useState("100")
  const [commission, setCommission] = useState("15")

  const monthly = useMemo(() => {
    const w = Number(weddings)
    const g = Number(guests)
    const c = Number(commission)
    if (!w || !g || !c) return 0
    return Math.round(w * g * AVG_GUEST_SPEND * (c / 100))
  }, [weddings, guests, commission])

  const yearly = monthly * 12
  const { ref, reveal } = useScrollReveal<HTMLElement>()

  return (
    <section id="wedding-revenue-calculator" ref={ref} className="scroll-mt-[80px] bg-[#f7f4ef] px-4 md:px-[82px] pt-[71px] pb-[72px]">
      <div className={cn("max-w-[1280px] mx-auto flex flex-col gap-2 items-stretch", reveal())}>
        <div className="flex gap-2 items-center justify-center">
          <div className="w-8 h-px bg-[#a08248]" />
          <span
            className="text-[12px] font-semibold uppercase tracking-[2px] text-[#a08248] whitespace-nowrap"
            style={SANS}
          >
            {t("eyebrow")}
          </span>
          <div className="w-8 h-px bg-[#a08248]" />
        </div>
        <h2
          className="text-[36px] md:text-[48px] text-[#1c1b18] text-center leading-none"
          style={SERIF}
        >
          {t("titleStart")}{" "}
          <em className="not-italic italic text-[#a08248]" style={SERIF}>
            {t("titleAccent")}
          </em>
        </h2>

        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-center gap-6 md:gap-10 pt-8">
          <div className="group relative w-full md:flex-1 md:self-stretch min-h-[280px] md:min-h-[480px] overflow-hidden">
            <Image
              src="/wedding-planner/calculator-visual.webp"
              alt={t("photoAlt")}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </div>

          <div className="w-full md:w-[618px] flex flex-col gap-6">
            <p
              className="text-[16px] md:text-[18px] text-[#696969] leading-[1.3]"
              style={SANS}
            >
              {t("body1")}
              <br className="hidden md:inline" />
              <span className="md:hidden"> </span>
              {t("body2")}
            </p>

            <div className="bg-white border border-[rgba(28,27,24,0.08)] flex flex-col gap-[13px] px-[29px] py-[28px] w-full">
              <div className="flex flex-col gap-2 w-full">
                <FieldLabel>{t("weddingsLabel")}</FieldLabel>
                <LightSelect
                  value={weddings}
                  onChange={setWeddings}
                  placeholder={t("placeholderSelect")}
                  options={WEDDINGS_OPTIONS.map((v) => ({ value: v, label: v }))}
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <FieldLabel>{t("guestsLabel")}</FieldLabel>
                <LightSelect
                  value={guests}
                  onChange={setGuests}
                  placeholder={t("placeholderSelect")}
                  options={GUESTS_OPTIONS.map((v) => ({ value: v, label: v }))}
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <FieldLabel>{t("commissionLabel")}</FieldLabel>
                <LightSelect
                  value={commission}
                  onChange={setCommission}
                  placeholder={t("placeholderSelect")}
                  options={COMMISSION_OPTIONS.map((v) => ({ value: v, label: `${v}%` }))}
                />
              </div>

              <div className="bg-[#111110] flex flex-col gap-1 items-center px-4 pt-[15px] pb-4 w-full">
                <span
                  className="text-[12px] font-semibold uppercase tracking-[1.04px] text-[#999] text-center leading-[17.16px]"
                  style={SANS}
                >
                  {t("monthlyLabel")}
                </span>
                <span
                  className="text-[32px] font-semibold text-[#c9a96e] leading-none"
                  style={SERIF}
                >
                  {formatEuro(monthly)}
                </span>
              </div>

              <div className="bg-[#9a7535] flex flex-col gap-1 items-center px-4 pt-[15px] pb-4 w-full">
                <span
                  className="text-[12px] font-semibold uppercase tracking-[1.04px] text-white text-center leading-[17.16px]"
                  style={SANS}
                >
                  {t("yearlyLabel")}
                </span>
                <span
                  className="text-[32px] font-semibold text-white leading-none"
                  style={SERIF}
                >
                  {formatEuro(yearly)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
