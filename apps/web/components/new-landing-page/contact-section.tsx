"use client"

import { useState } from "react"
import Image from "next/image"
import { Phone, Mail, Check, ShieldCheck } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@workspace/ui/lib/utils"
import { useMutation } from "convex/react"
import { api } from "@workspace/convex/api"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { PhoneInput } from "@/components/ui/phone-input"
import { CountryCombobox } from "@/components/ui/country-combobox"
import { DateTimePicker } from "@/components/checkout/date-time-picker"

const INPUT =
  "w-full h-[44px] bg-[#1E1D1B] border border-[rgba(255,255,255,0.12)] px-[13px] text-[14px] text-white placeholder:text-[#696969] outline-none focus:border-[rgba(201,169,110,0.5)] transition-colors"

const SELECT_TRIGGER =
  "w-full h-[44px] bg-[#1E1D1B] border border-[rgba(255,255,255,0.12)] px-[13px] text-[14px] text-white data-[placeholder]:text-[#696969] rounded-none focus:ring-0 focus:border-[rgba(201,169,110,0.5)] focus-visible:ring-0 transition-colors"

const SELECT_CONTENT =
  "bg-[#1E1D1B] border border-[rgba(255,255,255,0.12)] text-white rounded-none"

const SELECT_ITEM =
  "text-[14px] text-white data-[highlighted]:bg-[rgba(201,169,110,0.12)] data-[highlighted]:text-white focus:bg-[rgba(201,169,110,0.12)] rounded-none cursor-pointer"

function Label({ text, required }: { text: string; required?: boolean }) {
  return (
    <label
      className="text-[12px] font-semibold text-[#F7F4EF] leading-none"
      style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
    >
      {text}
      {required && <span className="text-[#E32828]">*</span>}
    </label>
  )
}

export function ContactSection() {
  const t = useTranslations("contact")
  const [form, setForm] = useState({
    name: "",
    email: "",
    country: "",
    phone: "",
    region: "",
    date: "",
    flexibleDates: false,
    travelers: "",
    budget: 150,
    interests: "",
    ageRange: "",
    newsletter: true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const submitContact = useMutation(api.contactSubmissions.submit)

  const set = (key: string, val: string | boolean | number) =>
    setForm((prev) => ({ ...prev, [key]: val }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const parts = [
      form.country && `Country: ${form.country}`,
      form.region && `Region: ${form.region}`,
      form.date && `Date: ${form.date}`,
      form.flexibleDates && "Flexible dates: Yes",
      form.travelers && `Travelers: ${form.travelers}`,
      form.budget > 150 && `Budget/person: €${form.budget}`,
      form.interests && `Interests: ${form.interests}`,
      form.ageRange && `Age range: ${form.ageRange}`,
      form.newsletter && "Newsletter: Yes",
    ]
      .filter(Boolean)
      .join("\n")

    try {
      await submitContact({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        message: parts || "(no details)",
      })
      toast.success(t("submitSuccess"))
      setForm({
        name: "", email: "", country: "", phone: "", region: "",
        date: "", flexibleDates: false, travelers: "", budget: 150,
        interests: "", ageRange: "", newsletter: true,
      })
    } catch {
      toast.error(t("submitError"))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="bg-[#0D0D0D] pt-[100px] pb-[60px] px-4 md:px-[82px]">
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-stretch gap-0 md:gap-12">
        <div className="relative w-full md:flex-1 h-[300px] md:h-auto md:min-h-[800px] overflow-hidden">
          <Image
            src="/tours-page/contact-bg.png"
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[42%] to-[rgba(0,0,0,0.74)] to-[82%]" />
          <div className="absolute bottom-6 left-6 right-6">
            <h2
              className="text-[48px] md:text-[96px] leading-[0.93] text-white opacity-[0.68]"
              style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif" }}
            >
              <span className="italic">{t("redesign.heroLine1")} </span>
              <span className="italic text-[#C9A96E]">{t("redesign.heroLine2")}</span>
            </h2>
          </div>
        </div>

        <div className="w-full md:w-[667px] shrink-0 py-10">
          <div className="flex flex-col gap-2 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-[82px] h-px bg-[#C9A96E]" />
              <span
                className="text-[12px] font-semibold uppercase tracking-[2px] text-[#C9A96E]"
                style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
              >
                {t("redesign.label")}
              </span>
            </div>
            <h3
              className="text-[32px] md:text-[48px] leading-[1.3] text-white italic"
              style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif" }}
            >
              {t("redesign.heading")}
            </h3>
            <p
              className="text-[18px] text-[#999] leading-[1.3]"
              style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
            >
              {t("redesign.subtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex flex-col gap-2">
                <Label text={t("redesign.form.name")} required />
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder={t("redesign.form.namePlaceholder")}
                  className={INPUT}
                />
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <Label text={t("redesign.form.email")} required />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder={t("redesign.form.emailPlaceholder")}
                  className={INPUT}
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex flex-col gap-2">
                <Label text={t("redesign.form.country")} required />
                <CountryCombobox
                  value={form.country}
                  onChange={(v) => set("country", v)}
                  placeholder={t("redesign.form.countryPlaceholder")}
                  emptyLabel={t("redesign.form.countryPlaceholder")}
                />
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <Label text={t("redesign.form.phone")} required />
                <PhoneInput
                  dark
                  value={form.phone}
                  onChange={(v) => set("phone", v)}
                  placeholder={t("redesign.form.phonePlaceholder")}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label text={t("redesign.form.region")} required />
              <Select value={form.region} onValueChange={(v) => set("region", v)}>
                <SelectTrigger className={SELECT_TRIGGER}>
                  <SelectValue placeholder={t("redesign.form.regionPlaceholder")} />
                </SelectTrigger>
                <SelectContent className={SELECT_CONTENT}>
                  <SelectItem value="lisboa" className={SELECT_ITEM}>Lisboa</SelectItem>
                  <SelectItem value="porto" className={SELECT_ITEM}>Porto</SelectItem>
                  <SelectItem value="algarve" className={SELECT_ITEM}>Algarve</SelectItem>
                  <SelectItem value="alentejo" className={SELECT_ITEM}>Alentejo</SelectItem>
                  <SelectItem value="madeira" className={SELECT_ITEM}>Madeira</SelectItem>
                  <SelectItem value="acores" className={SELECT_ITEM}>Açores</SelectItem>
                  <SelectItem value="sintra" className={SELECT_ITEM}>Sintra</SelectItem>
                  <SelectItem value="ericeira" className={SELECT_ITEM}>Ericeira</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label text={t("redesign.form.date")} required />
              <DateTimePicker
                variant="new-widget"
                value={form.date || null}
                onChange={(d) => set("date", d ? d.toISOString() : "")}
                placeholder={t("redesign.form.datePlaceholder")}
                label={t("redesign.form.datePlaceholder")}
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <div
                className={cn(
                  "size-[18px] rounded-[2px] border border-[rgba(255,255,255,0.12)] flex items-center justify-center transition-colors",
                  form.flexibleDates && "bg-[rgba(154,117,53,0.22)]"
                )}
              >
                {form.flexibleDates && <Check className="size-[12px] text-[#C9A96E]" />}
              </div>
              <span className="text-[14px] text-white">{t("redesign.form.flexibleDates")}</span>
              <input
                type="checkbox"
                checked={form.flexibleDates}
                onChange={(e) => set("flexibleDates", e.target.checked)}
                className="sr-only"
              />
            </label>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex flex-col gap-2">
                <Label text={t("redesign.form.travelers")} required />
                <Select value={form.travelers} onValueChange={(v) => set("travelers", v)}>
                  <SelectTrigger className={SELECT_TRIGGER}>
                    <SelectValue placeholder={t("redesign.form.travelersPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent className={SELECT_CONTENT}>
                    <SelectItem value="1-2" className={SELECT_ITEM}>1-2</SelectItem>
                    <SelectItem value="3-5" className={SELECT_ITEM}>3-5</SelectItem>
                    <SelectItem value="6-10" className={SELECT_ITEM}>6-10</SelectItem>
                    <SelectItem value="10+" className={SELECT_ITEM}>10+</SelectItem>
                    <SelectItem value="20+" className={SELECT_ITEM}>20+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <Label text={t("redesign.form.budget")} />
                <div className="pt-2">
                  <input
                    type="range"
                    min={150}
                    max={50000}
                    step={50}
                    value={form.budget}
                    onChange={(e) => set("budget", Number(e.target.value))}
                    className="w-full h-[4px] bg-[#222] rounded-none appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-[14px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#C9A96E] [&::-moz-range-thumb]:size-[14px] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#C9A96E] [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-[12px] text-white">€150</span>
                    <span className="text-[12px] text-[#696969]">€2500</span>
                    <span className="text-[12px] text-[#696969]">+€50000</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label text={t("redesign.form.interests")} required />
              <textarea
                required
                value={form.interests}
                onChange={(e) => set("interests", e.target.value)}
                placeholder={t("redesign.form.interestsPlaceholder")}
                className={cn(INPUT, "h-[170px] resize-none py-[14px]")}
              />
              <span className="text-[12px] font-light text-[#696969]">
                {t("redesign.form.interestsHelp")}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <Label text={t("redesign.form.ageRange")} />
              <Select value={form.ageRange} onValueChange={(v) => set("ageRange", v)}>
                <SelectTrigger className={SELECT_TRIGGER}>
                  <SelectValue placeholder={t("redesign.form.ageRangePlaceholder")} />
                </SelectTrigger>
                <SelectContent className={SELECT_CONTENT}>
                  <SelectItem value="18-30" className={SELECT_ITEM}>18-30</SelectItem>
                  <SelectItem value="30-50" className={SELECT_ITEM}>30-50</SelectItem>
                  <SelectItem value="50-65" className={SELECT_ITEM}>50-65</SelectItem>
                  <SelectItem value="65+" className={SELECT_ITEM}>65+</SelectItem>
                  <SelectItem value="mixed" className={SELECT_ITEM}>Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer bg-[rgba(154,117,53,0.22)] border border-[rgba(255,255,255,0.12)] px-[13px] py-[14px]">
              <div
                className={cn(
                  "size-[18px] rounded-[2px] border border-[rgba(255,255,255,0.12)] flex items-center justify-center shrink-0 transition-colors",
                  form.newsletter && "bg-[rgba(154,117,53,0.22)]"
                )}
              >
                {form.newsletter && <Check className="size-[12px] text-[#C9A96E]" />}
              </div>
              <span className="text-[14px] text-white leading-normal">
                {t("redesign.form.newsletter")}
              </span>
              <input
                type="checkbox"
                checked={form.newsletter}
                onChange={(e) => set("newsletter", e.target.checked)}
                className="sr-only"
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-[48px] bg-[#C9A96E] border border-[#C9A96E] text-[14px] font-medium uppercase tracking-[1.1px] text-[#0D0D0D] hover:bg-[#b8954f] disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? "..." : t("redesign.form.submit")}
            </button>

            <div className="bg-[#1E1D1B] border border-[rgba(255,255,255,0.12)] p-6 flex gap-4 items-center">
              <div className="relative size-[80px] md:size-[114px] shrink-0 rounded-full overflow-hidden">
                <Image
                  src="/tours-page/support-avatar.png"
                  alt="Carolina Pinheiro"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <span className="text-[14px] font-bold text-[#999] leading-[1.3]">
                    {t("redesign.support.name")}
                  </span>
                  <span className="text-[12px] font-medium text-[#999] leading-[1.3]">
                    {t("redesign.support.role")}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Phone className="size-4 text-[#C9A96E] shrink-0" />
                    <span className="text-[12px] text-[#999] leading-[14px]">
                      {t("redesign.support.phone")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="size-4 text-[#C9A96E] shrink-0" />
                    <span className="text-[12px] text-[#999] leading-[1.2]">
                      {t("redesign.support.email")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </form>

          <div className="flex items-center gap-2 justify-center mt-4">
            <ShieldCheck className="size-6 text-[#C9A96E] shrink-0" />
            <span className="text-[14px] text-[#C9A96E] leading-[20px]">
              {t("redesign.responseTime")}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
