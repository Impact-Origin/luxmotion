"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useMutation } from "convex/react"
import { api } from "@workspace/convex/api"
import { User, Mail, Building2, Star, BarChart3, MapPin, Search, ChevronDown, ArrowRight, Info } from "lucide-react"
import { PhoneInput } from "@/components/ui/phone-input"
import { PartnerLeadSuccessModal } from "./partner-lead-success-modal"

const sans = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const
const serif = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const

const FIELD =
  "h-[52px] w-full border border-[rgba(201,169,110,0.2)] bg-[rgba(255,255,255,0.03)] pl-11 pr-4 text-[14px] text-white placeholder:text-[rgba(255,255,255,0.3)] transition-colors focus:border-[#C9A96E] focus:outline-none"

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] font-semibold uppercase tracking-[1.4px] text-[#C9A96E]" style={sans}>
      {children}
      <span className="text-[#e07a6a]">*</span>
    </span>
  )
}

function IconInput({
  icon,
  ...props
}: { icon: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[rgba(201,169,110,0.7)]">
        {icon}
      </span>
      <input {...props} className={FIELD} style={sans} />
    </div>
  )
}

function IconSelect({
  icon,
  children,
  ...props
}: { icon: React.ReactNode } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 z-10 text-[rgba(201,169,110,0.7)]">
        {icon}
      </span>
      <select
        {...props}
        className={`${FIELD} cursor-pointer appearance-none pr-10 [&>option]:bg-[#161310] [&>option]:text-white`}
        style={sans}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgba(255,255,255,0.4)]" />
    </div>
  )
}

export function PartnerLeadForm() {
  const t = useTranslations("hotels.form")
  const submit = useMutation(api.partnerLeads.submit)

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [partnerType, setPartnerType] = useState("")
  const [estimatedMonthlyVolume, setVolume] = useState("")
  const [city, setCity] = useState("")
  const [howDidYouHear, setSource] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const partnerTypeOptions = t.raw("partnerTypeOptions") as string[]
  const volumeOptions = t.raw("volumeOptions") as string[]
  const sourceOptions = t.raw("sourceOptions") as string[]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    try {
      await submit({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        companyName: companyName.trim(),
        partnerType,
        estimatedMonthlyVolume,
        city: city.trim(),
        howDidYouHear,
      })
      setDone(true)
    } catch {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative w-full border border-[rgba(201,169,110,0.2)] bg-[#13110d]/80 backdrop-blur-sm">
      <div className="h-[3px] w-full bg-gradient-to-r from-[#C9A96E] via-[#C9A96E]/60 to-transparent" />
      <div className="flex flex-col gap-5 px-6 py-7 sm:px-9 sm:py-9">
        <div className="flex flex-col gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-[2px] text-[#C9A96E]" style={sans}>
            {t("eyebrow")}
          </p>
          <h3 className="text-[30px] leading-none text-white" style={serif}>
            {t("titlePrefix")} <span className="italic text-[#C9A96E]">{t("titleAccent")}</span>.
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate={false}>
          <label className="flex flex-col gap-2">
            <FieldLabel>{t("fullName")}</FieldLabel>
            <IconInput
              icon={<User className="h-[18px] w-[18px]" strokeWidth={1.6} />}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder={t("fullNamePh")}
            />
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2">
              <FieldLabel>{t("email")}</FieldLabel>
              <IconInput
                icon={<Mail className="h-[18px] w-[18px]" strokeWidth={1.6} />}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder={t("emailPh")}
              />
            </label>
            <label className="flex flex-col gap-2">
              <FieldLabel>{t("phone")}</FieldLabel>
              <div className="[&_input]:!h-[52px] [&>div]:w-full">
                <PhoneInput dark value={phone} onChange={setPhone} defaultCountry="pt" placeholder="000 000 000" />
              </div>
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2">
              <FieldLabel>{t("company")}</FieldLabel>
              <IconInput
                icon={<Building2 className="h-[18px] w-[18px]" strokeWidth={1.6} />}
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                placeholder={t("companyPh")}
              />
            </label>
            <label className="flex flex-col gap-2">
              <FieldLabel>{t("partnerType")}</FieldLabel>
              <IconSelect
                icon={<Star className="h-[18px] w-[18px]" strokeWidth={1.6} />}
                value={partnerType}
                onChange={(e) => setPartnerType(e.target.value)}
                required
              >
                <option value="" disabled>
                  {t("selectPh")}
                </option>
                {partnerTypeOptions.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </IconSelect>
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2">
              <FieldLabel>{t("volume")}</FieldLabel>
              <IconSelect
                icon={<BarChart3 className="h-[18px] w-[18px]" strokeWidth={1.6} />}
                value={estimatedMonthlyVolume}
                onChange={(e) => setVolume(e.target.value)}
                required
              >
                <option value="" disabled>
                  {t("selectPh")}
                </option>
                {volumeOptions.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </IconSelect>
            </label>
            <label className="flex flex-col gap-2">
              <FieldLabel>{t("city")}</FieldLabel>
              <IconInput
                icon={<MapPin className="h-[18px] w-[18px]" strokeWidth={1.6} />}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                placeholder={t("cityPh")}
              />
            </label>
          </div>

          <label className="flex flex-col gap-2">
            <FieldLabel>{t("source")}</FieldLabel>
            <IconSelect
              icon={<Search className="h-[18px] w-[18px]" strokeWidth={1.6} />}
              value={howDidYouHear}
              onChange={(e) => setSource(e.target.value)}
              required
            >
              <option value="" disabled>
                {t("selectPh")}
              </option>
              {sourceOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </IconSelect>
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="mt-1 flex h-[54px] w-full items-center justify-center gap-2 bg-[#C9A96E] text-[14px] font-semibold uppercase tracking-[1.2px] text-[#1a1510] transition-colors hover:bg-[#d4b87f] disabled:cursor-not-allowed disabled:opacity-60"
            style={sans}
          >
            {submitting ? t("submitting") : t("submit")}
            {!submitting && <ArrowRight className="h-4 w-4" />}
          </button>

          <p className="flex items-center justify-center gap-2 text-center text-[12px] text-[rgba(255,255,255,0.4)]" style={sans}>
            <Info className="h-4 w-4 shrink-0 text-[#C9A96E]" strokeWidth={1.6} />
            {t("note")}
          </p>
        </form>
      </div>

      <PartnerLeadSuccessModal open={done} onClose={() => setDone(false)} />
    </div>
  )
}
