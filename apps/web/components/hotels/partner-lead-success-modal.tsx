"use client"

import { useEffect } from "react"
import { useTranslations } from "next-intl"
import { Check, X, ArrowRight } from "lucide-react"

const sans = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const
const serif = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const

const EMAIL = "geral@luxmotionportugal.com"
const WHATSAPP_DISPLAY = "+351 963 650 278"
const WHATSAPP_LINK = "https://wa.me/351963650278"
const SCHEDULE_LINK = WHATSAPP_LINK

const STEPS = [1, 2, 3] as const

export function PartnerLeadSuccessModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations("hotels.modal")

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative my-8 w-full max-w-[560px] border border-[rgba(201,169,110,0.22)] bg-[#161310] px-6 py-10 shadow-[0_30px_80px_rgba(0,0,0,0.5)] sm:px-12"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center border border-[rgba(201,169,110,0.3)] text-[rgba(255,255,255,0.6)] transition-colors hover:border-[#C9A96E] hover:text-[#C9A96E]"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#C9A96E] text-[#C9A96E]">
            <Check className="h-7 w-7" strokeWidth={2.5} />
          </span>
          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[2.5px] text-[#C9A96E]" style={sans}>
            {t("eyebrow")}
          </p>
          <h2 className="mt-3 text-[34px] leading-[1.1] text-white" style={serif}>
            {t("titlePrefix")} <span className="italic text-[#C9A96E]">{t("titleAccent")}</span>
          </h2>
          <p className="mt-3 max-w-[420px] text-[14px] leading-[1.5] text-[rgba(255,255,255,0.55)]" style={sans}>
            {t("subtitle")}
          </p>
        </div>

        <div className="my-8 h-px w-full bg-[rgba(201,169,110,0.18)]" />

        <p className="mb-5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[2px] text-[#C9A96E]" style={sans}>
          <span className="h-px w-6 bg-[#C9A96E]" />
          {t("stepsLabel")}
        </p>

        <div className="flex flex-col">
          {STEPS.map((n, i) => (
            <div
              key={n}
              className={`flex gap-4 py-4 ${i < STEPS.length - 1 ? "border-b border-[rgba(255,255,255,0.08)]" : ""}`}
            >
              <span className="shrink-0 text-[12px] font-semibold tracking-[1px] text-[#C9A96E]" style={sans}>
                — 0{n}
              </span>
              <div className="flex flex-col gap-1">
                <p className="text-[15px] font-semibold text-white" style={sans}>
                  {t(`step${n}Title`)}
                </p>
                <p className="text-[13px] leading-[1.5] text-[rgba(255,255,255,0.5)]" style={sans}>
                  {t(`step${n}Body`)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <a
          href={SCHEDULE_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 flex h-[54px] w-full items-center justify-center gap-2 bg-[#C9A96E] text-[14px] font-semibold uppercase tracking-[1.2px] text-[#1a1510] transition-colors hover:bg-[#d4b87f]"
          style={sans}
        >
          {t("cta")} <ArrowRight className="h-4 w-4" />
        </a>

        <p className="mt-6 text-center text-[12px] leading-[1.6] text-[rgba(255,255,255,0.4)]" style={sans}>
          {t("contactPrefix")}{" "}
          <a href={`mailto:${EMAIL}`} className="text-[#C9A96E] hover:underline">
            {EMAIL}
          </a>{" "}
          {t("contactMiddle")}{" "}
          <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="text-[#C9A96E] hover:underline">
            {WHATSAPP_DISPLAY}
          </a>
          .
        </p>
      </div>
    </div>
  )
}
