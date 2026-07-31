"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { LightSelect } from "@/components/applications/shared"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { cn } from "@workspace/ui/lib/utils"

const SANS = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const
const SERIF = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const

const GOLD = "#9A7535"
const INK = "#1C1B18"
const MUTED = "#6B6862"
const LINE = "rgba(28,27,24,0.12)"

const WEDDINGS_OPTIONS = ["1", "2", "3", "4", "5", "6", "8", "10"]
const TICKET_OPTIONS = [30000, 35000, 40000, 45000, 50000, 60000]
const COMMISSION_OPTIONS = [5, 8, 10, 12, 15]

/*
 * O ticket médio do casamento serve para estimar quanto os noivos gastarão em
 * mobilidade LuxMotion — transfers dos noivos e convidados, clássicos,
 * chauffeur privado. A comissão incide sobre essa despesa, não sobre o ticket.
 *
 *   ticket <= 35.000     -> mobilidade 1.000 a 2.500, referência 2.500
 *   ticket 40.000-45.000 -> mobilidade 2.500 a 4.000, referência 4.000
 *   ticket >= 50.000     -> mobilidade 4.000 a 6.000, referência 10% do ticket
 *                           com piso de 4.000 e tecto de 6.000
 */
const BANDS = {
  low: { min: 1000, max: 2500 },
  mid: { min: 2500, max: 4000 },
  high: { min: 4000, max: 6000 },
} as const

function mobilityForTicket(ticket: number) {
  if (ticket <= 35000) return { ...BANDS.low, reference: 2500 }
  if (ticket <= 45000) return { ...BANDS.mid, reference: 4000 }
  return {
    ...BANDS.high,
    reference: Math.min(BANDS.high.max, Math.max(BANDS.high.min, ticket * 0.1)),
  }
}

/** Formato PT-PT: milhares com ponto, sem casas decimais. */
function euro(value: number) {
  return "€" + Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-[11px] font-semibold uppercase leading-none tracking-[1.3px]"
      style={{ ...SANS, color: INK }}
    >
      {children}
    </span>
  )
}

function ResultRow({
  label,
  value,
  strong,
}: {
  label: string
  value: string
  strong?: boolean
}) {
  return (
    <div
      className="flex flex-col items-start justify-between gap-1 border-b py-[14px] sm:flex-row sm:items-baseline sm:gap-5"
      style={{ borderColor: LINE }}
    >
      <span className="text-[14px] leading-tight" style={{ ...SANS, color: MUTED }}>
        {label}
      </span>
      <span
        className="whitespace-nowrap text-left text-[16px] font-semibold tabular-nums sm:text-right"
        style={{ ...SANS, color: strong ? GOLD : INK }}
      >
        {value}
      </span>
    </div>
  )
}

export function WeddingPlannerCalculator() {
  const t = useTranslations("weddingPlanner.calculator")

  const [weddings, setWeddings] = useState("4")
  const [ticket, setTicket] = useState("45000")
  const [commission, setCommission] = useState("10")

  const result = useMemo(() => {
    const w = Number(weddings)
    const ticketValue = Number(ticket)
    const percent = Number(commission)
    const mobility = mobilityForTicket(ticketValue)
    const perWedding = mobility.reference * (percent / 100)
    const monthly = perWedding * w
    return { mobility, perWedding, monthly, yearly: monthly * 12 }
  }, [weddings, ticket, commission])

  const { ref, reveal } = useScrollReveal<HTMLElement>()

  return (
    <section
      id="wedding-revenue-calculator"
      ref={ref}
      className="scroll-mt-[80px] bg-[#f7f4ef] px-4 pb-[72px] pt-[71px] md:px-[82px]"
    >
      <div className={cn("mx-auto flex max-w-[1280px] flex-col gap-2", reveal())}>
        <div className="flex items-center justify-center gap-2">
          <div className="h-px w-8" style={{ background: GOLD }} />
          <span
            className="whitespace-nowrap text-[12px] font-semibold uppercase tracking-[2px]"
            style={{ ...SANS, color: GOLD }}
          >
            {t("eyebrow")}
          </span>
          <div className="h-px w-8" style={{ background: GOLD }} />
        </div>
        <h2
          className="text-center text-[36px] leading-none md:text-[48px]"
          style={{ ...SERIF, color: INK }}
        >
          {t("titleStart")}{" "}
          <em className="italic" style={{ ...SERIF, color: GOLD }}>
            {t("titleAccent")}
          </em>
        </h2>

        <div className="flex flex-col items-stretch justify-center gap-6 pt-8 md:flex-row md:gap-10">
          <div className="group relative min-h-[280px] w-full overflow-hidden md:min-h-[480px] md:flex-1 md:self-stretch">
            <Image
              src="/wedding-planner/calculator-visual.webp"
              alt={t("photoAlt")}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            {/* Filete dourado, assinatura da marca. */}
            <span
              className="absolute bottom-0 left-0 h-[3px] w-24"
              style={{ background: GOLD }}
            />
          </div>

          <div className="flex w-full flex-col gap-6 md:w-[618px]">
            <p
              className="text-[16px] leading-[1.45] md:text-[18px]"
              style={{ ...SANS, color: MUTED }}
            >
              {t("body1")}
              <br className="hidden md:inline" />
              <span className="md:hidden"> </span>
              {t("body2")}
            </p>

            <div
              className="flex w-full flex-col gap-[22px] border bg-white px-[29px] py-[28px]"
              style={{ borderColor: LINE }}
            >
              <div className="flex w-full flex-col gap-[9px]">
                <FieldLabel>{t("weddingsLabel")}</FieldLabel>
                <LightSelect
                  value={weddings}
                  onChange={setWeddings}
                  placeholder={t("placeholderSelect")}
                  options={WEDDINGS_OPTIONS.map((v) => ({ value: v, label: v }))}
                />
              </div>
              <div className="flex w-full flex-col gap-[9px]">
                <FieldLabel>{t("ticketLabel")}</FieldLabel>
                <LightSelect
                  value={ticket}
                  onChange={setTicket}
                  placeholder={t("placeholderSelect")}
                  options={TICKET_OPTIONS.map((v) => ({
                    value: String(v),
                    label:
                      v === TICKET_OPTIONS[TICKET_OPTIONS.length - 1]
                        ? t("ticketOrMore", { value: euro(v) })
                        : euro(v),
                  }))}
                />
              </div>
              <div className="flex w-full flex-col gap-[9px]">
                <FieldLabel>{t("commissionLabel")}</FieldLabel>
                <LightSelect
                  value={commission}
                  onChange={setCommission}
                  placeholder={t("placeholderSelect")}
                  options={COMMISSION_OPTIONS.map((v) => ({
                    value: String(v),
                    label:
                      v === 10 ? t("commissionRecommended", { value: v }) : `${v}%`,
                  }))}
                />
              </div>
            </div>

            <div
              className="flex flex-col"
              role="region"
              aria-live="polite"
              aria-atomic="true"
            >
              <div className="border-t" style={{ borderColor: LINE }}>
                <ResultRow
                  label={t("rowRange")}
                  value={`${euro(result.mobility.min)} — ${euro(result.mobility.max)}`}
                />
                <ResultRow
                  label={t("rowReference")}
                  value={euro(result.mobility.reference)}
                />
                <ResultRow
                  label={t("rowPerWedding")}
                  value={euro(result.perWedding)}
                  strong
                />
              </div>

              <div className="mt-5 grid gap-3">
                <div className="bg-[#111110] px-6 py-[22px] text-center">
                  <span
                    className="text-[11px] font-semibold uppercase tracking-[1.6px] text-[rgba(247,244,239,0.82)]"
                    style={SANS}
                  >
                    {t("monthlyLabel")}
                  </span>
                  <p
                    className="mt-1.5 text-[34px] font-medium leading-[1.1] tabular-nums text-[#c9a96e] md:text-[42px]"
                    style={SERIF}
                  >
                    {euro(result.monthly)}
                  </p>
                </div>
                <div
                  className="px-6 py-[22px] text-center"
                  style={{ background: GOLD }}
                >
                  <span
                    className="text-[11px] font-semibold uppercase tracking-[1.6px] text-[rgba(255,255,255,0.82)]"
                    style={SANS}
                  >
                    {t("yearlyLabel")}
                  </span>
                  <p
                    className="mt-1.5 text-[34px] font-medium leading-[1.1] tabular-nums text-white md:text-[42px]"
                    style={SERIF}
                  >
                    {euro(result.yearly)}
                  </p>
                </div>
              </div>

              <p
                className="mt-5 border-l-[3px] pl-[14px] text-[13.5px] leading-[1.6]"
                style={{ ...SANS, color: MUTED, borderColor: GOLD }}
              >
                {t("note")}
              </p>
              <p
                className="mt-3.5 text-[12px] leading-[1.6] opacity-85"
                style={{ ...SANS, color: MUTED }}
              >
                {t("disclaimer")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
