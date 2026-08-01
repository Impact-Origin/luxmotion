"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { Mail, Phone, Shield, ArrowRight, Check, Clock, CalendarDays, ArrowLeft } from "lucide-react"
import { useMutation } from "convex/react"
import { api } from "@workspace/convex/api"
import { PhoneInput } from "@/components/ui/phone-input"
import { readReferralCookie } from "@/lib/referral"

const sans = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const
const serif = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const

const EMAIL_GROUPS = "events@luxmotion.pt"
const PHONE = "+351 963 650 278"
const EMAIL_PARTNER = "partner@luxmotion.pt"

const INPUT_CLASS =
  "h-[44px] w-full border border-[rgba(154,117,53,0.22)] bg-[#faf7f2] px-[13px] text-[14px] text-[#0d0d0d] placeholder:text-[#999] focus:border-[#a08248] focus:outline-none transition-colors"

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.02ZM12.04 20.15a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24a8.2 8.2 0 0 1 5.83 2.42 8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.41-.56-.42h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[10px] font-semibold uppercase tracking-[2px] text-[#a08248]"
      style={sans}
    >
      {children}
    </p>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-[10px] font-semibold uppercase tracking-[1.35px] text-[#7a746e]"
      style={sans}
    >
      {children}
      <span className="text-[#e32828]">*</span>
    </span>
  )
}

function Divider() {
  return <div className="h-px w-full bg-[rgba(28,27,24,0.08)]" />
}

const WHATSAPP_URL = "https://wa.me/351963650278"
const CALENDLY_URL = "https://calendly.com/easytransfer/30min"

/** Referência legível para o cliente citar, derivada do id da submissão. */
function buildReference(id?: string): string {
  const year = new Date().getFullYear()
  const seed = id ?? String(Date.now())
  let n = 0
  for (const ch of seed) n = (n * 31 + ch.charCodeAt(0)) % 100000
  return `LM-${year}-${String(n).padStart(5, "0")}`
}

/** Confirmação depois de enviar o pedido — ocupa o lugar do formulário. */
function QuoteSubmitted({
  name,
  email,
  reference,
}: {
  name: string
  email: string
  reference: string
}) {
  const t = useTranslations("corporatePage.contact.reachOut.form.success")

  const steps = [
    { title: t("step1Title"), body: t("step1Body"), time: t("step1Time"), icon: Clock },
    { title: t("step2Title"), body: t("step2Body"), time: t("step2Time"), icon: Clock },
    { title: t("step3Title"), body: t("step3Body"), time: t("step3Time"), icon: Check },
  ]

  return (
    <div className="flex w-full max-w-[600px] flex-col overflow-hidden border border-[rgba(168,131,58,0.25)] bg-[#0d0d0d] shadow-[0px_4px_40px_0px_rgba(0,0,0,0.18)]">
      <div className="flex flex-col items-center gap-3 px-6 py-10 text-center md:px-[49px]">
        <div className="flex size-16 items-center justify-center rounded-full border border-[rgba(201,169,110,0.45)] bg-[rgba(201,169,110,0.08)]">
          <Check className="size-7 text-[#c9a96e]" strokeWidth={2} />
        </div>

        <p
          className="text-[10px] font-semibold uppercase tracking-[2px] text-[#c9a96e]"
          style={sans}
        >
          {t("eyebrow")}
        </p>

        <h3 className="text-[32px] leading-tight text-white" style={serif}>
          {t("thankYou")}{" "}
          <span className="italic text-[#c9a96e]">{name}</span>.
        </h3>

        <p className="max-w-[420px] text-[14px] leading-[1.5] text-[#999]" style={sans}>
          {t("body", { email })}
        </p>

        <div className="mt-2 inline-flex items-center gap-3 border border-[rgba(255,255,255,0.12)] px-4 py-2">
          <span
            className="text-[10px] font-semibold uppercase tracking-[1.6px] text-[#999]"
            style={sans}
          >
            {t("reference")}
          </span>
          <span className="text-[13px] tracking-[1px] text-[#c9a96e]" style={sans}>
            {reference}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-5 border-t border-[rgba(255,255,255,0.08)] bg-[#111] px-6 py-8 md:px-[49px]">
        <div className="flex items-center gap-2">
          <div className="h-px w-8 bg-[#c9a96e]" />
          <p
            className="text-[10px] font-semibold uppercase tracking-[2px] text-[#c9a96e]"
            style={sans}
          >
            {t("whatNext")}
          </p>
        </div>

        {steps.map((step, i) => {
          const Icon = step.icon
          return (
            <div key={step.title} className="flex gap-4">
              <span
                className="shrink-0 pt-[2px] text-[13px] italic text-[#c9a96e]"
                style={serif}
              >
                — {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col gap-1">
                <p className="text-[14px] font-semibold text-white" style={sans}>
                  {step.title}
                </p>
                <p className="text-[13px] leading-[1.45] text-[#999]" style={sans}>
                  {step.body}
                </p>
                <span
                  className="mt-1 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[1.4px] text-[#c9a96e]"
                  style={sans}
                >
                  <Icon className="size-3" strokeWidth={2} />
                  {step.time}
                </span>
              </div>
            </div>
          )
        })}

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-flex h-12 w-full items-center justify-center gap-2 bg-[#a08248] px-6 text-[13px] font-semibold uppercase tracking-[1.1px] text-white transition-colors hover:bg-[#b89558]"
          style={sans}
        >
          {t("whatsapp")}
          <ArrowRight className="size-4" strokeWidth={2} />
        </a>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center gap-2 border border-[rgba(255,255,255,0.18)] px-4 text-[12px] font-medium uppercase tracking-[1px] text-white transition-colors hover:border-[#c9a96e] hover:text-[#c9a96e]"
            style={sans}
          >
            <CalendarDays className="size-4" strokeWidth={1.8} />
            {t("scheduleCall")}
          </a>
          {/* "Ver serviços" volta atrás, para a página de onde veio o pedido. */}
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex h-11 items-center justify-center gap-2 border border-[rgba(255,255,255,0.18)] px-4 text-[12px] font-medium uppercase tracking-[1px] text-white transition-colors hover:border-[#c9a96e] hover:text-[#c9a96e]"
            style={sans}
          >
            <ArrowLeft className="size-4" strokeWidth={1.8} />
            {t("exploreServices")}
          </button>
        </div>

        <p className="text-[12px] leading-[1.5] text-[#777]" style={sans}>
          {t("footerPre")}{" "}
          <a href={`mailto:${EMAIL_GROUPS}`} className="text-[#c9a96e] underline">
            {t("footerLink")}
          </a>{" "}
          {t("footerPost")}{" "}
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-[#c9a96e]">
            {PHONE}
          </a>
          .
        </p>
      </div>
    </div>
  )
}

function QuoteForm() {
  const t = useTranslations("corporatePage.contact.reachOut.form")
  const submit = useMutation(api.contactQuotes.submit)

  const searchParams = useSearchParams()
  const [fullName, setFullName] = useState("")
  const [company, setCompany] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  // Assunto pré-preenchido quando se chega de "Tenho interesse" numa
  // experiência: /corporate/contact?subject=Nome%20da%20experiência
  const [subject, setSubject] = useState(() => searchParams.get("subject") ?? "")
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [reference, setReference] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    try {
      const res = await submit({
        fullName: fullName.trim(),
        company: company.trim(),
        email: email.trim(),
        phone: phone.trim(),
        subject: subject.trim(),
        message: message.trim(),
        referralSlug: readReferralCookie() ?? undefined,
      })
      setReference(buildReference(res?.id))
      setSubmitted(true)
    } catch {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <QuoteSubmitted
        name={fullName.trim()}
        email={email.trim()}
        reference={reference}
      />
    )
  }

  return (
    <div className="flex w-full max-w-[600px] flex-col gap-4 border border-[rgba(168,131,58,0.15)] bg-white px-6 py-8 shadow-[0px_4px_40px_0px_rgba(0,0,0,0.07)] md:px-[49px] md:py-[41px]">
      <div className="flex items-center gap-2">
        <div className="h-px w-8 bg-[#a08248]" />
        <p
          className="text-[12px] font-semibold uppercase tracking-[2px] text-[#a08248]"
          style={sans}
        >
          {t("eyebrow")}
        </p>
      </div>

      <h3 className="text-[32px] leading-none text-[#0d0d0d]" style={serif}>
        {t("titleLine1")} <span className="italic text-[#a08248]">{t("titleAccent")}</span>.
      </h3>

      <p className="text-[14px] leading-[1.3] text-[#696969]" style={sans}>
        {t("intro")}
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <FieldLabel>{t("name")}</FieldLabel>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder={t("namePh")}
                className={INPUT_CLASS}
                style={sans}
              />
            </div>
            <div className="flex flex-col gap-2">
              <FieldLabel>{t("company")}</FieldLabel>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
                placeholder={t("companyPh")}
                className={INPUT_CLASS}
                style={sans}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <FieldLabel>{t("email")}</FieldLabel>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder={t("emailPh")}
                className={INPUT_CLASS}
                style={sans}
              />
            </div>
            <div className="flex flex-col gap-2">
              <FieldLabel>{t("phone")}</FieldLabel>
              <div className="w-full [&>div]:w-full">
                <PhoneInput
                  wedding
                  value={phone}
                  onChange={setPhone}
                  defaultCountry="pt"
                  placeholder="000 000 000"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <FieldLabel>{t("subject")}</FieldLabel>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              placeholder={t("subjectPh")}
              className={INPUT_CLASS}
              style={sans}
            />
          </div>

          <div className="flex flex-col gap-2">
            <FieldLabel>{t("message")}</FieldLabel>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={4}
              placeholder={t("messagePh")}
              className="min-h-[102px] w-full resize-none border border-[rgba(154,117,53,0.22)] bg-[#faf7f2] px-[13px] py-[14px] text-[14px] text-[#0d0d0d] placeholder:text-[#999] focus:border-[#a08248] focus:outline-none transition-colors"
              style={sans}
            />
          </div>

          <div className="flex justify-center pt-1">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-12 items-center justify-center gap-2 bg-[#a08248] px-[22px] text-[14px] font-medium uppercase tracking-[1.1px] text-white transition-colors hover:bg-[#b89558] disabled:cursor-not-allowed disabled:opacity-60"
              style={sans}
            >
              {submitting ? t("submitting") : t("submit")}
              <ArrowRight className="h-[14px] w-[14px]" strokeWidth={2} />
            </button>
          </div>

          <div className="flex items-center justify-center gap-[5px]">
            <Shield className="h-4 w-4 text-[#2e7d52]" strokeWidth={1.6} />
            <p className="text-[12px] text-[#696969]" style={sans}>
              {t("note")}
            </p>
          </div>
        </form>
    </div>
  )
}

export function ContactReachOut() {
  const t = useTranslations("corporatePage.contact.reachOut")

  return (
    <section
      id="contact-form"
      className="w-full scroll-mt-[80px] bg-[#f7f4ef] px-4 py-10 md:px-[82px] md:py-[40px] 2xl:px-[300px]"
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-start justify-between gap-12 lg:flex-row lg:gap-[60px]">
        <div className="flex w-full max-w-[500px] flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="h-px w-8 bg-[#a08248]" />
              <p
                className="text-[12px] font-semibold uppercase tracking-[2px] text-[#a08248]"
                style={sans}
              >
                {t("eyebrow")}
              </p>
            </div>
            <h2 className="text-[48px] leading-none text-[#0d0d0d]" style={serif}>
              {t("titleLine1")} <span className="italic text-[#a08248]">{t("titleAccent")}</span>.
            </h2>
          </div>

          <p className="text-[14px] leading-[1.3] text-[#696969]" style={sans}>
            {t("intro")}
          </p>

          <div className="flex flex-col gap-6 py-2">
            <div className="flex flex-col gap-4">
              <SectionLabel>{t("groups.label")}</SectionLabel>
              <div className="flex flex-col gap-4">
                <a href={`mailto:${EMAIL_GROUPS}`} className="flex items-center gap-2 text-[14px] text-[#0d0d0d] transition-colors hover:text-[#a08248]" style={sans}>
                  <Mail className="h-5 w-5 text-[#a08248]" strokeWidth={1.6} />
                  {EMAIL_GROUPS}
                </a>
                <a href={`tel:${PHONE.replace(/\s/g, "")}`} className="flex items-center gap-2 text-[14px] text-[#0d0d0d] transition-colors hover:text-[#a08248]" style={sans}>
                  <Phone className="h-5 w-5 text-[#a08248]" strokeWidth={1.6} />
                  {PHONE}
                </a>
              </div>
            </div>

            <Divider />

            <div className="flex flex-col gap-4">
              <SectionLabel>{t("partnerships.label")}</SectionLabel>
              <div className="flex flex-col gap-4">
                <a href={`mailto:${EMAIL_PARTNER}`} className="flex items-center gap-2 text-[14px] text-[#0d0d0d] transition-colors hover:text-[#a08248]" style={sans}>
                  <Mail className="h-5 w-5 text-[#a08248]" strokeWidth={1.6} />
                  {EMAIL_PARTNER}
                </a>
                <span className="flex items-center gap-2 text-[14px] text-[#0d0d0d]" style={sans}>
                  <WhatsAppIcon className="h-5 w-5 text-[#a08248]" />
                  {t("partnerships.whatsapp")}
                </span>
              </div>
            </div>

            <Divider />

            <div className="flex flex-col gap-4">
              <SectionLabel>{t("hq.label")}</SectionLabel>
              <div className="flex flex-col gap-2">
                <p className="text-[14px] font-medium text-[#0d0d0d]" style={sans}>
                  {t("hq.name")}
                </p>
                <p className="text-[14px] leading-[1.3] text-[#696969]" style={sans}>
                  Business Factory da Ericeira
                  <br />
                  2655 Ericeira, Portugal
                </p>
                <p className="text-[12px] font-medium leading-[1.3] tracking-[0.12px] text-[#696969]" style={sans}>
                  RNAVT 8510 · Tormenta &amp; Barreiros, Lda. · NIF 517534762
                </p>
              </div>
            </div>

            <Divider />

            <div className="flex flex-col gap-4">
              <SectionLabel>{t("ops.label")}</SectionLabel>
              <div className="grid grid-cols-2 gap-2 text-[14px]" style={sans}>
                <span className="text-[#696969]">{t("ops.concierge")}</span>
                <span className="text-right font-semibold text-[#a08248]">24/7</span>
                <span className="text-[#696969]">{t("ops.office")}</span>
                <span className="text-right font-semibold text-[#0d0d0d]">{t("ops.officeHours")}</span>
                <span className="text-[#696969]">{t("ops.events")}</span>
                <span className="text-right font-semibold text-[#0d0d0d]">{t("ops.eventsValue")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* useSearchParams precisa de Suspense — sem isto o build estático falha. */}
        <Suspense fallback={null}>
          <QuoteForm />
        </Suspense>
      </div>
    </section>
  )
}
