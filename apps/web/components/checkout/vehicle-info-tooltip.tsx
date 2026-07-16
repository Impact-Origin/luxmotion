"use client"

import { X, Check } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useTranslations } from "next-intl"

interface VehicleInfoTooltipProps {
  vehicleName: string
  onClose: () => void
}

type DrawerPhase = "entering" | "entered" | "exiting"

const EXIT_ANIMATION_MS = 320

const SERIF_FONT = {
  fontFamily: "var(--font-title), 'Cormorant Garamond', serif",
} as const

type InfoItem = { text: string; sub?: string }

export function VehicleInfoTooltip({ vehicleName, onClose }: VehicleInfoTooltipProps) {
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
        <div className="sticky top-0 bg-[var(--ck-bg,#0d0d0d)] z-10 px-4 md:px-8 pt-4 md:pt-8 pb-2 md:pb-0 md:mb-6">
          <h2
            className="text-2xl md:text-4xl font-semibold text-center text-[var(--ck-text,#f7f4ef)] pr-12 md:pr-0"
            style={SERIF_FONT}
          >
            {vehicleName}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-4 top-4 md:right-6 md:top-6 flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full bg-[rgba(var(--ck-text-rgb,255,255,255),0.06)] hover:bg-[rgba(var(--ck-text-rgb,255,255,255),0.12)] text-[var(--ck-text,#f7f4ef)] transition-colors"
            aria-label={tCommon("close")}
          >
            <X className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 px-4 md:px-8 pb-6 md:pb-8 pt-2 md:pt-0">
          <div className="bg-[rgba(var(--ck-text-rgb,255,255,255),0.03)] border border-[rgba(var(--ck-text-rgb,255,255,255),0.1)] p-4 md:p-6">
            <h3 className="text-base md:text-2xl font-bold text-[var(--ck-text,#f7f4ef)] mb-3 md:mb-4">
              {t("included")}
            </h3>

            <div className="space-y-2 md:space-y-3">
              {included.map((item, i) => (
                <div key={i} className="flex items-start gap-2 md:gap-3">
                  <Check
                    className="w-4 h-4 md:w-5 md:h-5 text-[#2E7D52] flex-shrink-0 mt-0.5"
                    strokeWidth={3}
                  />
                  <div>
                    <p className="text-[var(--ck-text,#f7f4ef)] text-sm md:text-base font-semibold leading-snug">
                      {item.text}
                    </p>
                    {item.sub && (
                      <p className="text-[var(--ck-text-muted,#999)] text-xs md:text-sm">{item.sub}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[rgba(var(--ck-text-rgb,255,255,255),0.03)] border border-[rgba(var(--ck-text-rgb,255,255,255),0.1)] p-4 md:p-6">
            <h3 className="text-base md:text-2xl font-bold text-[var(--ck-text,#f7f4ef)] mb-3 md:mb-4">
              {t("notIncluded")}
            </h3>

            <div className="space-y-2 md:space-y-3">
              {notIncluded.map((item, i) => (
                <div key={i} className="flex items-start gap-2 md:gap-3">
                  <X
                    className="w-4 h-4 md:w-5 md:h-5 text-[#E32828] flex-shrink-0 mt-0.5"
                    strokeWidth={3}
                  />
                  <div>
                    <p className="text-[var(--ck-text,#f7f4ef)] text-sm md:text-base font-semibold leading-snug">
                      {item.text}
                    </p>
                    {item.sub && (
                      <p className="text-[var(--ck-text-muted,#999)] text-xs md:text-sm">{item.sub}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
