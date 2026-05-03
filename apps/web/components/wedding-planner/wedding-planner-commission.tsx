"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Check } from "lucide-react"

const SERIF_FONT = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const
const SANS_FONT = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const

type Tier = "classic" | "firstClass"

const TIER_DATA: Record<
  Tier,
  {
    vehicle: string
    commissionPct: string
    basePrice: string
    clientPrice: string
    earning: string
  }
> = {
  classic: {
    vehicle: "Classic",
    commissionPct: "15%",
    basePrice: "€ 38,00",
    clientPrice: "€ 44,65",
    earning: "€ 6,70",
  },
  firstClass: {
    vehicle: "First Class",
    commissionPct: "20%",
    basePrice: "€ 68,00",
    clientPrice: "€ 81,60",
    earning: "€ 13,60",
  },
}

const FEATURES = [1, 2, 3, 4] as const
const ROUTE_LABEL = "LIS → Ericeira"

function Row({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-[rgba(28,27,24,0.08)] py-[10px] w-full">
      <span
        className="text-[12px] text-[#696969] leading-[21.65px]"
        style={SANS_FONT}
      >
        {label}
      </span>
      <span
        className={
          "text-[14px] font-semibold leading-[21.65px] whitespace-nowrap " +
          (valueClass ?? "text-[#1c1b18]")
        }
        style={SANS_FONT}
      >
        {value}
      </span>
    </div>
  )
}

function ToggleButton({
  active,
  label,
  onClick,
}: {
  active: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "flex-1 h-10 inline-flex items-center justify-center transition-colors " +
        (active
          ? "bg-[#9a7535] text-white"
          : "bg-transparent text-[rgba(28,27,24,0.38)] hover:text-[#1c1b18]")
      }
    >
      <span
        className="text-[12px] font-bold"
        style={{ fontFamily: "Arial, var(--font-sans), sans-serif" }}
      >
        {label}
      </span>
    </button>
  )
}

export function WeddingPlannerCommission() {
  const t = useTranslations("weddingPlanner.commission")
  const [tier, setTier] = useState<Tier>("classic")
  const data = TIER_DATA[tier]

  return (
    <section className="bg-white px-4 md:px-[82px] pt-12 md:pt-[71px] pb-12 md:pb-[72px]">
      <div className="max-w-[1280px] mx-auto flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-px bg-[#a08248]" />
            <span
              className="text-[12px] font-semibold uppercase tracking-[2px] text-[#a08248] whitespace-nowrap"
              style={SANS_FONT}
            >
              {t("eyebrow")}
            </span>
            <div className="w-8 h-px bg-[#a08248]" />
          </div>
          <h2
            className="text-[32px] md:text-[48px] leading-none text-[#1c1b18] text-center font-normal"
            style={SERIF_FONT}
          >
            {t("titleStart")}{" "}
            <span className="italic text-[#a08248]">{t("titleAccent")}</span>
          </h2>
        </div>

        <div className="bg-white border border-[rgba(28,27,24,0.08)] w-full max-w-[420px] p-6 md:p-[29px] flex flex-col gap-[9px]">
          <div className="flex border border-[rgba(28,27,24,0.08)] w-full">
            <ToggleButton
              active={tier === "classic"}
              label={t("toggle.classic")}
              onClick={() => setTier("classic")}
            />
            <ToggleButton
              active={tier === "firstClass"}
              label={t("toggle.firstClass")}
              onClick={() => setTier("firstClass")}
            />
          </div>

          <Row label={t("rows.vehicle")} value={data.vehicle} />
          <Row
            label={t("rows.commission")}
            value={data.commissionPct}
            valueClass="text-[#9a7535]"
          />
          <Row
            label={`${t("rows.basePrice")} (${ROUTE_LABEL})`}
            value={data.basePrice}
          />
          <Row label={t("rows.clientPrice")} value={data.clientPrice} />

          <div
            className="bg-[#111110] flex flex-col gap-2 items-center px-4 pt-[15px] pb-4 w-full"
            style={SANS_FONT}
          >
            <span
              className="text-[12px] uppercase tracking-[1px] text-[#999] leading-[16.37px]"
            >
              {t("totalLabel")}
            </span>
            <span
              className="text-[32px] font-semibold text-[#c9a96e] leading-none"
              style={SERIF_FONT}
            >
              {data.earning}
            </span>
          </div>

          <div className="flex flex-col gap-[6px] w-full pt-1">
            {FEATURES.map((n) => (
              <div key={n} className="flex items-center gap-[6px]">
                <Check className="size-3 text-[#4ade80] shrink-0" strokeWidth={2.5} />
                <span
                  className="text-[12px] leading-none text-[#696969]"
                  style={SANS_FONT}
                >
                  {t(`feat${n}`)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
