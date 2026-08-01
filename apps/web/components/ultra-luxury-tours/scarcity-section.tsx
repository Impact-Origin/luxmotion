"use client"

import { useTranslations } from "next-intl"
import { ShieldCheck, ArrowRight } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { useTourScarcity, type MonthStatus } from "@/hooks/use-tour-scarcity"
import { scrollToCustomInquiry } from "@/components/ultra-luxury-tours/region-tab-strip"

const SERIF_FONT = "var(--font-title), 'Cormorant Garamond', serif"

const MONTH_KEYS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
] as const

function MonthCell({
  name,
  status,
  statusLabel,
}: {
  name: string
  status: MonthStatus
  statusLabel: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 border px-[11px] py-[15px]",
        status === "booked" && "border-[rgba(255,255,255,0.12)] bg-[#1a1916] opacity-40",
        status === "almost" && "border-[rgba(154,117,53,0.22)] bg-[rgba(154,117,53,0.07)]",
        status === "available" && "border-[#9a7535] bg-[#C9A96E]",
      )}
    >
      <span
        className={cn(
          "text-[11px] font-bold uppercase tracking-[0.44px]",
          status === "booked" && "text-[#999] line-through",
          status === "almost" && "text-[#7d5f2b]",
          status === "available" && "text-[#0d0d0d]",
        )}
      >
        {name}
      </span>
      <span
        className={cn(
          "font-semibold uppercase tracking-[1.12px]",
          status === "booked" ? "text-[8px] text-[#999]" : "text-[10px]",
          status === "almost" && "text-[#9a7535]",
          status === "available" && "text-[#0d0d0d]",
        )}
      >
        {statusLabel}
      </span>
    </div>
  )
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-[6px]">
      <span className="size-2" style={{ backgroundColor: color }} />
      <span className="text-[10px] font-medium tracking-[0.1px] text-[rgba(255,255,255,0.38)]">{label}</span>
    </span>
  )
}

export function UltraLuxuryScarcitySection() {
  const t = useTranslations("ultraLuxuryTours.scarcity")
  const scarcity = useTourScarcity()

  const { year, totalCapacity, confirmedBookings, inquiriesToday, reservedThisWeek } = scarcity
  const remaining = Math.max(totalCapacity - confirmedBookings, 0)
  const percent = totalCapacity > 0 ? Math.round((confirmedBookings / totalCapacity) * 100) : 0

  const stats = [
    { value: remaining, key: "statSpotsLeft" },
    { value: inquiriesToday, key: "statInquiries" },
    { value: reservedThisWeek, key: "statReserved" },
  ]

  const months = MONTH_KEYS.map((key, i) => ({
    key,
    status: scarcity.months[i]?.status ?? "booked",
    spots: scarcity.months[i]?.spotsLeft ?? 0,
  }))

  return (
    <section className="bg-[#0D0D0D] px-4 py-16 md:px-[82px] md:py-[100px]">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-10">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-8 max-w-[82px] min-w-[32px] bg-[#C9A96E]" />
            <span className="text-[12px] font-semibold uppercase leading-none tracking-[2px] text-[#C9A96E]">
              {t("eyebrow")}
            </span>
            <div className="h-px w-8 max-w-[82px] min-w-[32px] bg-[#C9A96E]" />
          </div>
          <h2 className="mt-3 text-[32px] leading-none text-white md:text-[48px]" style={{ fontFamily: SERIF_FONT }}>
            {t("heading")}{" "}
            <span className="italic text-[#C9A96E]">{t("headingAccent")}</span>
            <span className="text-[#C9A96E]">.</span>
          </h2>
          <p className="mt-6 max-w-[620px] text-[14px] leading-[1.5] text-[#999]">
            {t("subtitle", { max: totalCapacity, year: String(year) })}
          </p>
        </div>

        <div className="grid grid-cols-1 border border-[rgba(255,255,255,0.06)] bg-[#1a1916] md:grid-cols-2">
          <div className="flex flex-col justify-center border-b border-[rgba(255,255,255,0.06)] p-5 md:border-b-0 md:border-r md:px-12 md:py-[74px]">
            <span className="flex w-fit items-center gap-[10px] bg-[#0D0D0D] px-4 py-2">
              <span className="size-[7px] rounded-full bg-[#4ADE80] shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
              <span className="text-[9px] font-bold uppercase tracking-[1.62px] text-white">{t("liveStatus")}</span>
            </span>

            <h3
              className="mt-8 text-[28px] leading-[1.05] tracking-[-0.36px] text-white md:text-[40px]"
              style={{ fontFamily: SERIF_FONT }}
            >
              {t("capacityHeading", { year: String(year) })}{" "}
              <span className="font-semibold italic text-[#C9A96E]">{t("capacityHeadingAccent")}</span>
            </h3>

            <div className="mt-8 flex flex-col gap-[10px]">
              <div className="flex items-baseline justify-between">
                <span className="text-[12px] font-semibold uppercase tracking-[1.32px] text-[#999]">
                  {t("bookingsConfirmed")}
                </span>
                <span className="flex items-baseline gap-1" style={{ fontFamily: SERIF_FONT }}>
                  <span className="text-[40px] font-bold italic leading-none text-[#C9A96E] md:text-[48px]">
                    {confirmedBookings}
                  </span>
                  <span className="text-[14px] font-medium text-[#999]">/ {totalCapacity}</span>
                </span>
              </div>
              <div className="flex h-[6px] w-full overflow-hidden bg-[#252422]">
                <div
                  className="flex h-full justify-end bg-gradient-to-r from-[#7d5f2b] via-[#9a7535] to-[#c4973e]"
                  style={{ width: `${percent}%` }}
                >
                  <span className="h-full w-[8px] bg-white/60" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-[#999]">{t("reservedPercent", { percent })}</span>
                <span className="text-[12px] font-medium uppercase tracking-[0.12px] text-[#C9A96E]">
                  {t("spotsRemaining", { count: remaining })}
                </span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-3 border-t border-[rgba(255,255,255,0.06)] pt-8">
              {stats.map((stat, i) => (
                <div
                  key={stat.key}
                  className={cn(
                    "flex flex-col gap-[6px] pr-6",
                    i > 0 && "pl-6",
                    i < stats.length - 1 && "border-r border-[rgba(255,255,255,0.06)]",
                  )}
                >
                  <span
                    className="text-[28px] font-bold italic leading-none text-[#C9A96E] md:text-[32px]"
                    style={{ fontFamily: SERIF_FONT }}
                  >
                    {stat.value}
                  </span>
                  <span className="text-[12px] font-medium uppercase leading-[1.3] tracking-[1.4px] text-[#999]">
                    {t(stat.key)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-between gap-6 p-5 md:p-12">
            <div className="flex items-start justify-between">
              <p className="text-[24px] text-white" style={{ fontFamily: SERIF_FONT }}>
                {t("availabilityBy")} <span className="italic text-[#C9A96E]">{t("availabilityByAccent")}</span>
              </p>
              <span
                className="text-[32px] font-medium italic tracking-[1.28px] text-[#999]"
                style={{ fontFamily: SERIF_FONT }}
              >
                {year}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {months.map((month) => (
                <MonthCell
                  key={month.key}
                  name={t(`months.${month.key}`)}
                  status={month.status}
                  statusLabel={
                    month.status === "booked"
                      ? t("statusBooked")
                      : month.status === "almost"
                        ? t("statusSpotsLeft", { count: month.spots ?? 0 })
                        : t("statusOpen")
                  }
                />
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-x-[18px] gap-y-2 border-t border-[rgba(255,255,255,0.06)] pt-6">
              <LegendItem color="#999" label={t("legendBooked")} />
              <LegendItem color="#a08248" label={t("legendAlmost")} />
              <LegendItem color="#C9A96E" label={t("legendAvailable")} />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-6 border border-[rgba(255,255,255,0.06)] bg-[#1a1916] p-[25px]">
          <div className="flex items-center gap-[18px]">
            <span className="flex size-12 shrink-0 items-center justify-center border-2 border-[rgba(201,169,110,0.25)] bg-[rgba(201,169,110,0.08)]">
              <ShieldCheck className="size-6 text-[#C9A96E]" strokeWidth={1.5} />
            </span>
            <p className="text-[14px] text-white">
              {t.rich("footerText", {
                em: (chunks) => <span className="font-semibold italic text-[#C9A96E]">{chunks}</span>,
              })}
            </p>
          </div>
          {/* Ia para /checkout, que abre vazio: um itinerário de vários dias
              não se reserva por lá, pede-se pelo formulário à medida. */}
          <button
            type="button"
            onClick={scrollToCustomInquiry}
            className="flex h-12 w-full items-center justify-center gap-2 bg-[#C9A96E] px-[22px] text-[14px] font-medium uppercase tracking-[1.1px] text-[#0d0d0d] transition-colors hover:bg-[#b89558] md:w-auto"
          >
            <span className="px-2">{t("ctaReserve")}</span>
            <ArrowRight className="size-[18px]" strokeWidth={2} />
          </button>
        </div>
      </div>
    </section>
  )
}
