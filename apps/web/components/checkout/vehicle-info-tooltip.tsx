"use client"

import { X, Check } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useTranslations } from "next-intl"

interface VehicleInfoTooltipProps {
  vehicleName: string
  /** Modelos concretos desta classe, ex. "Renault Clio, Fiat Tipo". */
  examples?: string
  onClose: () => void
}

type DrawerPhase = "entering" | "entered" | "exiting"

const EXIT_ANIMATION_MS = 320

const SERIF_FONT = {
  fontFamily: "var(--font-title), 'Cormorant Garamond', serif",
} as const

type InfoItem = { text: string; sub?: string }

export function VehicleInfoTooltip({ vehicleName, examples, onClose }: VehicleInfoTooltipProps) {
  const t = useTranslations("vehicle")
  const tCommon = useTranslations("common")
  const [phase, setPhase] = useState<DrawerPhase>("entering")
  const drawerRef = useRef<HTMLDivElement>(null)
  const onCloseCalledRef = useRef(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setPhase("entered")
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  const handleClose = () => {
    if (phase !== "entered") return
    setPhase("exiting")
    onCloseCalledRef.current = false
  }

  useEffect(() => {
    if (phase !== "exiting") return
    const timeout = window.setTimeout(() => {
      if (!onCloseCalledRef.current) {
        onCloseCalledRef.current = true
        onClose()
      }
    }, EXIT_ANIMATION_MS)
    return () => window.clearTimeout(timeout)
  }, [phase, onClose])

  const handleTransitionEnd = (e: React.TransitionEvent) => {
    if (e.target !== drawerRef.current) return
    if (phase === "exiting" && (e.propertyName === "transform" || e.propertyName === "opacity")) {
      if (!onCloseCalledRef.current) {
        onCloseCalledRef.current = true
        onClose()
      }
    }
  }

  const handleBackdropClick = () => {
    if (phase !== "entered") return
    handleClose()
  }

  const included: InfoItem[] = [
    { text: t("welcomeCard"), sub: t("meetingSign") },
    { text: t("professionalDriver") },
    { text: t("doorToDoor") },
    { text: t("fuel") },
    { text: t("vatAndFees") },
    { text: `${t("waitingTime")} ${t("waitingTimeDesc")}` },
    { text: t("flightMonitoring"), sub: t("airportPickup") },
    { text: t("wifiOnBoard") },
    { text: t("tollsIncluded") },
  ]

  const notIncluded: InfoItem[] = [
    { text: t("babySeat"), sub: t("babySeatExtra") },
    { text: `${t("extraHours")} ${t("beyondIncluded")}` },
    { text: t("tips") },
  ]

  return (
    <div
      data-phase={phase}
      className="checkout-dark fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/50 max-md:transition-opacity max-md:duration-300 max-md:data-[phase=entering]:opacity-0 max-md:data-[phase=entered]:opacity-100 max-md:data-[phase=exiting]:opacity-0 max-md:data-[phase=exiting]:pointer-events-none md:opacity-100"
      onClick={handleBackdropClick}
    >
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={vehicleName}
        data-phase={phase}
        className="bg-[var(--ck-bg,#0d0d0d)] border-x border-t md:border border-[rgba(var(--ck-text-rgb,255,255,255),0.12)] rounded-t-2xl md:rounded-none shadow-2xl w-full md:max-w-2xl max-h-[90vh] md:max-h-[85vh] overflow-y-auto flex flex-col max-md:translate-y-full max-md:data-[phase=entered]:translate-y-0 max-md:data-[phase=exiting]:translate-y-full max-md:transition-transform max-md:duration-300 max-md:ease-out md:animate-in md:fade-in md:zoom-in-95 md:duration-200 md:data-[phase=exiting]:opacity-0 md:transition-opacity md:duration-200"
        onTransitionEnd={handleTransitionEnd}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-[var(--ck-bg,#0d0d0d)] z-10 px-4 md:px-6 pt-4 md:pt-6 pb-3 md:pb-4">
          <h2
            className="text-lg md:text-2xl font-normal text-[var(--ck-text,#f7f4ef)] pr-12"
            style={SERIF_FONT}
          >
            {examples ? `${vehicleName} - ${examples}` : vehicleName}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-4 top-4 md:right-6 md:top-5 flex items-center justify-center w-9 h-9 rounded-full bg-[rgba(var(--ck-text-rgb,255,255,255),0.06)] hover:bg-[rgba(var(--ck-text-rgb,255,255,255),0.12)] text-[var(--ck-text,#f7f4ef)] transition-colors"
            aria-label={tCommon("close")}
          >
            <X className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>

        {/* Caixa única dividida ao meio — não dois cartões soltos. */}
        <div className="mx-4 md:mx-6 mb-4 md:mb-6 border border-[rgba(var(--ck-text-rgb,255,255,255),0.12)] grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[rgba(var(--ck-text-rgb,255,255,255),0.12)]">
          <InfoColumn title={t("included")} items={included} tone="included" />
          <InfoColumn title={t("notIncluded")} items={notIncluded} tone="notIncluded" />
        </div>
      </div>
    </div>
  )
}

function InfoColumn({
  title,
  items,
  tone,
}: {
  title: string
  items: InfoItem[]
  tone: "included" | "notIncluded"
}) {
  const Icon = tone === "included" ? Check : X
  const iconColor = tone === "included" ? "text-[#2E7D52]" : "text-[#E32828]"
  // Fundo verde/vermelho por trás de cada coluna (inline: a classe arbitrária
  // com rgba não é fiável no Tailwind).
  const colBg =
    tone === "included" ? "rgba(46,125,82,0.16)" : "rgba(227,40,40,0.14)"

  return (
    <div className="p-4 md:p-5" style={{ backgroundColor: colBg }}>
      <h3 className="text-sm md:text-base font-semibold text-[var(--ck-text,#f7f4ef)] mb-3">
        {title}
      </h3>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${iconColor}`} strokeWidth={3} />
            <p className="text-[var(--ck-text,#f7f4ef)] text-sm leading-snug">
              {item.text}
              {item.sub && (
                <span className="text-[var(--ck-text-muted,#999)]"> {item.sub}</span>
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
