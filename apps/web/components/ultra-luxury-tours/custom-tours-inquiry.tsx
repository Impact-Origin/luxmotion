"use client"

import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@workspace/convex/api"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { Check, ArrowRight, Sparkles, Clock, ShieldCheck } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { PhoneInput } from "@/components/ui/phone-input"
import { DarkSelect } from "./dark-select"
import { CUSTOM_INQUIRY_ID } from "./region-tab-strip"

const SERIF_FONT = "var(--font-title), 'Cormorant Garamond', serif"

const INPUT_CLS =
  "h-[48px] w-full border border-[rgba(255,255,255,0.12)] bg-[#1e1d1b] px-[15px] text-[14px] text-white placeholder:text-[#777] focus:border-[rgba(201,169,110,0.5)] focus:outline-none transition-colors"

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <span className="text-[10px] font-semibold uppercase tracking-[1.35px] text-[#8c8680]">
      {children}
      {required && <span className="text-[#C9A96E]">*</span>}
    </span>
  )
}

function Promise_({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center border border-[rgba(201,169,110,0.3)] text-[#C9A96E]">
        {icon}
      </span>
      <span className="text-[14px] leading-[1.4] text-[#bcb8b0]">{text}</span>
    </div>
  )
}

export function CustomToursInquiry() {
  const t = useTranslations("ultraLuxuryTours.customInquiry")
  const submitInquiry = useMutation(api.tourInquiries.submit)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [people, setPeople] = useState("")
  const [message, setMessage] = useState("")
  const [optIn, setOptIn] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const peopleRaw = t.raw("peopleOptions")
  const peopleOptions = (Array.isArray(peopleRaw) ? (peopleRaw as string[]) : []).map((o) => ({ value: o, label: o }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !phone.trim() || !message.trim()) return
    setIsSubmitting(true)
    try {
      await submitInquiry({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        datesFlexible: true,
        people: people || undefined,
        interests: message.trim(),
        marketingOptIn: optIn,
      })
      toast.success(t("successTitle"), { description: t("successBody") })
      setName("")
      setEmail("")
      setPhone("")
      setPeople("")
      setMessage("")
    } catch {
      toast.error(t("errorTitle"))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id={CUSTOM_INQUIRY_ID} className="scroll-mt-[60px] bg-[#0D0D0D] px-4 py-20 md:px-[82px] md:py-28">
      <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <span className="flex items-center gap-[10px] text-[11px] font-semibold uppercase tracking-[2.4px] text-[#C9A96E]">
              <span className="h-px w-8 bg-[#C9A96E]" />
              {t("eyebrow")}
            </span>
            <h2 className="text-[40px] leading-[1.15] text-white md:text-[52px]" style={{ fontFamily: SERIF_FONT }}>
              {t("heading")} <span className="italic text-[#C9A96E]">{t("headingAccent")}</span>
            </h2>
            <p className="max-w-[480px] text-[17px] leading-[1.5] text-[#999]">{t("subheading")}</p>
          </div>

          <div className="flex flex-col gap-5 border-t border-[rgba(255,255,255,0.08)] pt-8">
            <Promise_ icon={<Sparkles className="size-[18px]" strokeWidth={1.6} />} text={t("promiseBespoke")} />
            <Promise_ icon={<Clock className="size-[18px]" strokeWidth={1.6} />} text={t("promiseResponse")} />
            <Promise_ icon={<ShieldCheck className="size-[18px]" strokeWidth={1.6} />} text={t("promiseConcierge")} />
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 border border-[rgba(201,169,110,0.22)] bg-[#141311] p-7 md:p-10"
        >
          <label className="flex flex-col gap-2">
            <FieldLabel required>{t("name")}</FieldLabel>
            <input
              className={INPUT_CLS}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("namePlaceholder")}
              required
              suppressHydrationWarning
            />
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <FieldLabel required>{t("email")}</FieldLabel>
              <input
                type="email"
                className={INPUT_CLS}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("emailPlaceholder")}
                required
                suppressHydrationWarning
              />
            </label>
            <div className="flex flex-col gap-2">
              <FieldLabel required>{t("phone")}</FieldLabel>
              <PhoneInput dark value={phone} onChange={setPhone} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <FieldLabel>{t("people")}</FieldLabel>
            <DarkSelect value={people} onChange={setPeople} placeholder={t("peoplePlaceholder")} options={peopleOptions} />
          </div>

          <label className="flex flex-col gap-2">
            <FieldLabel required>{t("message")}</FieldLabel>
            <textarea
              className="min-h-[140px] w-full resize-none border border-[rgba(255,255,255,0.12)] bg-[#1e1d1b] px-[15px] py-[13px] text-[14px] leading-[1.5] text-white placeholder:text-[#777] focus:border-[rgba(201,169,110,0.5)] focus:outline-none transition-colors"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("messagePlaceholder")}
              required
              suppressHydrationWarning
            />
          </label>

          <button type="button" onClick={() => setOptIn((o) => !o)} className="flex items-start gap-[10px] text-left">
            <span
              className={cn(
                "mt-[1px] flex size-[18px] shrink-0 items-center justify-center border transition-colors",
                optIn ? "border-[#C9A96E] bg-[#C9A96E]" : "border-[rgba(255,255,255,0.25)]",
              )}
            >
              {optIn && <Check className="size-[12px] text-[#0d0d0d]" strokeWidth={3} />}
            </span>
            <span className="text-[13px] leading-[1.35] text-[#999]">{t("marketingOptIn")}</span>
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-[52px] items-center justify-center gap-2 bg-[#C9A96E] transition-colors hover:bg-[#b8975c] disabled:opacity-50"
          >
            <span className="text-[14px] font-medium uppercase tracking-[1.1px] text-[#0d0d0d]">
              {isSubmitting ? t("sending") : t("send")}
            </span>
            {!isSubmitting && <ArrowRight className="size-[18px] text-[#0d0d0d]" strokeWidth={2} />}
          </button>
        </form>
      </div>
    </section>
  )
}
