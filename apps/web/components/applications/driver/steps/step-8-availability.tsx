"use client"

import { Check, Moon, SunMedium } from "lucide-react"
import { useTranslations } from "next-intl"
import {
  ApplicationBottomBar,
  FieldLabel,
  StepHeader,
} from "@/components/applications/shared"
import { useDriverApplication } from "../driver-application-context"

const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const
const SHIFT_KEYS = ["morning", "afternoon", "night"] as const

interface RouteRow {
  route: string
  period: "day" | "night"
  amount: string
}

const LISBOA_ROUTES: RouteRow[] = [
  { route: "Aeroporto LIS → Lisboa Centro", period: "day", amount: "€25,00" },
  { route: "Aeroporto LIS → Cascais", period: "day", amount: "€40,00" },
  { route: "Aeroporto LIS → Sintra", period: "day", amount: "€38,00" },
  { route: "Aeroporto LIS → Lisboa Centro", period: "night", amount: "€28,00" },
  { route: "Aeroporto LIS → Cascais", period: "night", amount: "€44,00" },
  { route: "Aeroporto LIS → Sintra", period: "night", amount: "€42,00" },
]

function CheckChip({
  label,
  selected,
  onToggle,
}: {
  label: string
  selected: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={
        selected
          ? "h-[44px] inline-flex items-center gap-2 px-3 bg-white border border-[#a08248] text-[#1c1b18] transition-colors"
          : "h-[44px] inline-flex items-center gap-2 px-3 bg-white border border-[rgba(28,27,24,0.08)] hover:border-[rgba(28,27,24,0.18)] text-[#1c1b18] transition-colors"
      }
    >
      <span
        className={
          selected
            ? "size-[20px] shrink-0 bg-[#a08248] border border-[#a08248] flex items-center justify-center"
            : "size-[20px] shrink-0 bg-white border border-[rgba(28,27,24,0.18)]"
        }
      >
        {selected ? <Check size={12} strokeWidth={3} className="text-white" /> : null}
      </span>
      <span className="text-[14px]">{label}</span>
    </button>
  )
}

export function DriverStepAvailability() {
  const t = useTranslations("driverApplication.stepAvailability")
  const tCommon = useTranslations("common")
  const { state, updateAvailability, nextStep, prevStep } = useDriverApplication()
  const { availability } = state

  const allDaysSelected = DAY_KEYS.every((d) => availability.days.includes(d))

  function toggleDay(day: string) {
    const next = availability.days.includes(day)
      ? availability.days.filter((d) => d !== day)
      : [...availability.days, day]
    updateAvailability({ days: next })
  }

  function toggleAllDays() {
    updateAvailability({ days: allDaysSelected ? [] : [...DAY_KEYS] })
  }

  const allShiftsSelected = SHIFT_KEYS.every((s) => availability.shifts.includes(s))

  function toggleShift(shift: string) {
    const next = availability.shifts.includes(shift)
      ? availability.shifts.filter((s) => s !== shift)
      : [...availability.shifts, shift]
    updateAvailability({ shifts: next })
  }

  function toggleAllShifts() {
    updateAvailability({ shifts: allShiftsSelected ? [] : [...SHIFT_KEYS] })
  }

  const cityLabel = t("cityLisboa")

  const canContinue = availability.days.length > 0 && availability.shifts.length > 0

  return (
    <form
      className="w-full max-w-[600px] mx-auto flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault()
        if (canContinue) nextStep()
      }}
    >
      <StepHeader title={t("title")} subtitle={t("subtitle")} />

      <div className="w-full bg-white border border-[rgba(28,27,24,0.08)] flex flex-col">
        <div className="bg-[#0d0d0d] flex flex-col items-center gap-1 py-6 px-6">
          <h3
            className="text-white text-[22px] leading-[1.3]"
            style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif" }}
          >
            {t("tableTitle", { city: cityLabel })}
          </h3>
          <p className="text-[12px] text-[rgba(255,255,255,0.7)] text-center">
            {t("tableSubtitle")}
          </p>
        </div>
        <div className="grid grid-cols-[1fr_120px_100px] border-b border-[rgba(28,27,24,0.06)]">
          <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.5px] text-[#a08248]">
            {t("table.route")}
          </div>
          <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.5px] text-[#a08248]">
            {t("table.period")}
          </div>
          <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.5px] text-[#a08248] text-right">
            {t("table.receive")}
          </div>
        </div>
        {LISBOA_ROUTES.map((row, idx) => (
          <div
            key={idx}
            className="grid grid-cols-[1fr_120px_100px] items-center border-b border-[rgba(28,27,24,0.04)] last:border-b-0"
          >
            <div className="px-3 py-2.5 text-[13px] text-[#1c1b18]">{row.route}</div>
            <div className="px-3 py-2.5 text-[13px] text-[#1c1b18] inline-flex items-center gap-1.5">
              {row.period === "day" ? (
                <SunMedium size={14} strokeWidth={1.6} className="text-[#a08248]" />
              ) : (
                <Moon size={14} strokeWidth={1.6} className="text-[#a08248]" />
              )}
              {t(`periods.${row.period}`)}
            </div>
            <div className="px-3 py-2.5 text-[13px] font-semibold text-[#1c1b18] text-right">
              {row.amount}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-1 w-full pt-2">
        <span className="text-[12px] font-semibold uppercase tracking-[0.5px] text-[#1c1b18] leading-none">
          {t("preferences.title")}
        </span>
        <p className="text-[12px] text-[#696969] leading-[1.3]">
          {t("preferences.subtitle")}
        </p>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel required>{t("days.label")}</FieldLabel>
        <div className="flex flex-wrap gap-2">
          <CheckChip
            label={t("days.all")}
            selected={allDaysSelected}
            onToggle={toggleAllDays}
          />
          {DAY_KEYS.map((day) => (
            <CheckChip
              key={day}
              label={t(`days.${day}`)}
              selected={availability.days.includes(day)}
              onToggle={() => toggleDay(day)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <FieldLabel required>{t("shifts.label")}</FieldLabel>
        <div className="flex flex-wrap gap-2">
          <CheckChip
            label={t("shifts.allDay")}
            selected={allShiftsSelected}
            onToggle={toggleAllShifts}
          />
          {SHIFT_KEYS.map((shift) => (
            <CheckChip
              key={shift}
              label={t(`shifts.${shift}`)}
              selected={availability.shifts.includes(shift)}
              onToggle={() => toggleShift(shift)}
            />
          ))}
        </div>
      </div>

      <ApplicationBottomBar
        backLabel={tCommon("back")}
        continueLabel={t("confirmCta")}
        onBack={prevStep}
        canContinue={canContinue}
      />
    </form>
  )
}
