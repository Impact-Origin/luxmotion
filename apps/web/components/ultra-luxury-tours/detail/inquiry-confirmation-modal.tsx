"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { X, Plus, Check, Clock, Calendar, ArrowRight } from "lucide-react"

const SERIF_FONT = "var(--font-title), 'Cormorant Garamond', serif"

const WHATSAPP_DISPLAY = "+351 963 650 278"
const WHATSAPP_HREF = "https://wa.me/351963650278"

interface InquiryConfirmationModalProps {
  name: string
  email: string
  reference: string
  onClose: () => void
}

function Step({ num, title, desc, time, done }: { num: string; title: string; desc: string; time: string; done?: boolean }) {
  return (
    <div className="flex w-full gap-4 border-b-[0.8px] border-[rgba(255,255,255,0.06)] py-[18px] last:border-b-0">
      <div className="min-w-[28px] pt-[2px]" style={{ fontFamily: SERIF_FONT }}>
        <p className="italic text-[#c9a96e]">
          <span className="text-[14px] font-bold">— </span>
          <span className="text-[20px] font-bold">{num}</span>
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-[3px]">
        <p className="text-[14px] font-bold text-white">{title}</p>
        <p className="text-[12px] leading-[19.2px] text-[#999]">{desc}</p>
        <div className="flex items-center gap-[5px] pt-[3px]">
          {done ? (
            <Check className="size-[11px] text-[#c9a96e]" strokeWidth={2.4} />
          ) : (
            <Clock className="size-[11px] text-[#c9a96e]" strokeWidth={2} />
          )}
          <span className="text-[10px] font-semibold uppercase tracking-[0.6px] text-[#c9a96e]">{time}</span>
        </div>
      </div>
    </div>
  )
}

function SecondaryAction({ icon, label, href, onClick }: { icon: React.ReactNode; label: string; href?: string; onClick?: () => void }) {
  const cls =
    "flex flex-1 items-center justify-center gap-2 border border-[rgba(255,255,255,0.06)] p-[15px] text-[10px] font-bold uppercase tracking-[1px] text-[rgba(255,255,255,0.6)] transition-colors hover:border-[rgba(201,169,110,0.4)] hover:text-[#c9a96e]"
  const inner = (
    <>
      <span className="flex size-[12px] items-center justify-center">{icon}</span>
      {label}
    </>
  )
  return href ? (
    <Link href={href} onClick={onClick} className={cls}>
      {inner}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  )
}

export function InquiryConfirmationModal({ name, email, reference, onClose }: InquiryConfirmationModalProps) {
  const t = useTranslations("tourDetails.inquiry.confirmation")
  const [mounted, setMounted] = useState(false)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    setMounted(true)
    const raf = requestAnimationFrame(() => setEntered(true))
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    return () => {
      cancelAnimationFrame(raf)
      document.body.style.overflow = prev
      document.removeEventListener("keydown", onKey)
    }
  }, [onClose])

  if (!mounted) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex min-h-full justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-[2px] md:p-8"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative my-auto w-full max-w-[578px] border border-[rgba(255,255,255,0.06)] bg-[#1e1d1b] transition-all duration-300 ${
          entered ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t("close")}
          className="absolute right-[20px] top-[20px] z-[2] flex size-[36px] items-center justify-center border border-[rgba(255,255,255,0.06)] text-white/70 transition-colors hover:border-[rgba(201,169,110,0.4)] hover:text-[#c9a96e]"
        >
          <X className="size-[14px]" strokeWidth={1.8} />
        </button>

        <div
          className="relative flex flex-col items-center gap-[13px] overflow-hidden border-b-[0.8px] border-[rgba(255,255,255,0.06)] px-12 pb-[41px] pt-14"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(154,117,53,0.08), rgba(154,117,53,0) 60%), linear-gradient(#252422, #1e1d1b)",
          }}
        >
          <span className="absolute right-6 top-6 flex size-[32px] items-center justify-center border-[1.143px] border-[rgba(154,117,53,0.22)] bg-[rgba(154,117,53,0.07)] text-[#c9a96e]">
            <Plus className="size-[18px]" strokeWidth={1.6} />
          </span>

          <div className="relative flex size-[88px] items-center justify-center">
            <span
              className={`absolute inset-[-8px] rounded-[52px] border border-[rgba(154,117,53,0.22)] transition-all duration-500 ${
                entered ? "scale-100 opacity-100" : "scale-90 opacity-0"
              }`}
            />
            <span
              className={`absolute inset-0 rounded-[44px] border border-[#9a7535] bg-[rgba(154,117,53,0.07)] transition-all duration-500 ${
                entered ? "scale-100 opacity-100" : "scale-75 opacity-0"
              }`}
            />
            <Check
              className={`relative size-[36px] text-[#c9a96e] transition-all delay-150 duration-500 ${
                entered ? "scale-100 opacity-100" : "scale-0 opacity-0"
              }`}
              strokeWidth={1.8}
            />
          </div>

          <span className="pt-[14px] text-[10px] font-bold uppercase tracking-[2px] text-[#c9a96e]">{t("requestReceived")}</span>

          <h2 className="text-center text-[36px] font-bold tracking-[-0.36px] text-white" style={{ fontFamily: SERIF_FONT }}>
            {t.rich("thankYou", {
              name,
              i: (chunks) => <span className="italic text-[#c9a96e]">{chunks}</span>,
            })}
          </h2>

          <p className="max-w-[420px] text-center text-[14px] leading-[1.3] text-white">
            {t.rich("subtitle", {
              email,
              b: (chunks) => <span className="font-bold">{chunks}</span>,
            })}
          </p>

          <div className="flex items-center gap-[10px] border border-[rgba(154,117,53,0.22)] bg-[rgba(154,117,53,0.06)] px-[18px] py-[10px]">
            <span className="text-[9px] font-semibold uppercase tracking-[1.44px] text-white/40">{t("referenceLabel")}</span>
            <span className="text-[11px] font-bold tracking-[0.44px] text-[#c9a96e]">{reference}</span>
          </div>
        </div>

        <div className="flex flex-col gap-6 px-12 pt-[44px]">
          <div className="flex items-center gap-[10px]">
            <span className="h-px w-6 bg-[#c9a96e]" />
            <span className="text-[10px] font-bold uppercase tracking-[1.6px] text-[#c9a96e]">{t("whatHappensNext")}</span>
          </div>

          <div className="flex flex-col">
            <Step num="01" title={t("step1Title")} desc={t("step1Desc")} time={t("step1Time")} />
            <Step num="02" title={t("step2Title")} desc={t("step2Desc")} time={t("step2Time")} />
            <Step num="03" title={t("step3Title")} desc={t("step3Desc")} time={t("step3Time")} done />
          </div>
        </div>

        <div className="flex flex-col gap-[10px] px-12 pb-12 pt-8">
          <Link
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-[48px] w-full items-center justify-center gap-2 bg-[#a08248] px-6 transition-colors hover:bg-[#8a6f3c]"
          >
            <span className="text-[14px] font-medium uppercase tracking-[1.1px] text-white">{t("continueWhatsapp")}</span>
            <ArrowRight className="size-[14px] text-white" strokeWidth={2} />
          </Link>
          <div className="flex gap-[10px]">
            <SecondaryAction icon={<Calendar className="size-[12px]" strokeWidth={2} />} label={t("scheduleCall")} href={WHATSAPP_HREF} />
            <SecondaryAction
              icon={<ArrowRight className="size-[12px]" strokeWidth={2} />}
              label={t("exploreServices")}
              href="/ultra-luxury-tours/tours"
              onClick={onClose}
            />
          </div>
        </div>

        <div className="border-t-[0.8px] border-[rgba(255,255,255,0.06)] bg-black/20 px-12 pb-[18px] pt-[19px]">
          <p className="text-center text-[12px] leading-[17.6px] text-[#999]">
            {t.rich("footerNote", {
              phone: WHATSAPP_DISPLAY,
              reply: (chunks) => <span className="font-semibold text-[#c9a96e]">{chunks}</span>,
              num: (chunks) => <span className="font-semibold text-[#c9a96e]">{chunks}</span>,
            })}
          </p>
        </div>
      </div>
    </div>,
    document.body,
  )
}
