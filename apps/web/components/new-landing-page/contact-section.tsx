"use client"

import { useState } from "react"
import Image from "next/image"
import { Phone, Mail, ChevronDown, Check, ShieldCheck } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@workspace/ui/lib/utils"
import { useMutation } from "convex/react"
import { api } from "@workspace/convex/api"
import { toast } from "sonner"

const INPUT =
  "w-full h-[44px] bg-[#1E1D1B] border border-[rgba(255,255,255,0.12)] px-[13px] text-[14px] text-white placeholder:text-[#696969] outline-none focus:border-[rgba(201,169,110,0.5)] transition-colors"

const SELECT = cn(INPUT, "appearance-none cursor-pointer pr-[32px]")

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

function SelectChevron() {
  return (
    <ChevronDown className="absolute right-[13px] top-1/2 -translate-y-1/2 size-[14px] text-[rgba(255,255,255,0.5)] pointer-events-none" />
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
    <section className="bg-[#0D0D0D] pt-[100px] pb-[60px] px-4 md:px-[82px] 2xl:px-[300px]">
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
                <div className="relative">
                  <select
                    required
                    value={form.country}
                    onChange={(e) => set("country", e.target.value)}
                    className={SELECT}
                  >
                    <option value="">{t("redesign.form.countryPlaceholder")}</option>
                    <option value="PT">Portugal</option>
                    <option value="US">United States</option>
                    <option value="GB">United Kingdom</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="ES">Spain</option>
                    <option value="NL">Netherlands</option>
                    <option value="BR">Brazil</option>
                    <option value="OTHER">Other</option>
                  </select>
                  <SelectChevron />
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <Label text={t("redesign.form.phone")} required />
                <div className="flex">
                  <div className="flex items-center gap-2 h-[44px] bg-[#1A1A1A] border-l border-t border-b border-[rgba(255,255,255,0.12)] px-[13px] shrink-0">
                    <span className="text-[20px] leading-none opacity-[0.36]">🇵🇹</span>
                    <span className="text-[14px] text-white">+351</span>
                  </div>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder={t("redesign.form.phonePlaceholder")}
                    className={cn(INPUT, "border-l-0")}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label text={t("redesign.form.region")} required />
              <div className="relative">
                <select
                  required
                  value={form.region}
                  onChange={(e) => set("region", e.target.value)}
                  className={SELECT}
                >
                  <option value="">{t("redesign.form.regionPlaceholder")}</option>
                  <option value="lisboa">Lisboa</option>
                  <option value="porto">Porto</option>
                  <option value="algarve">Algarve</option>
                  <option value="alentejo">Alentejo</option>
                  <option value="madeira">Madeira</option>
                  <option value="acores">Açores</option>
                  <option value="sintra">Sintra</option>
                  <option value="ericeira">Ericeira</option>
                </select>
                <SelectChevron />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label text={t("redesign.form.date")} required />
              <input
                type="date"
                required={!form.flexibleDates}
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
                className={cn(INPUT, "[color-scheme:dark]")}
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
                <div className="relative">
                  <select
                    required
                    value={form.travelers}
                    onChange={(e) => set("travelers", e.target.value)}
                    className={SELECT}
                  >
                    <option value="">{t("redesign.form.travelersPlaceholder")}</option>
                    <option value="1-2">1-2</option>
                    <option value="3-5">3-5</option>
                    <option value="6-10">6-10</option>
                    <option value="10+">10+</option>
                    <option value="20+">20+</option>
                  </select>
                  <SelectChevron />
                </div>
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
              <div className="relative">
                <select
                  value={form.ageRange}
                  onChange={(e) => set("ageRange", e.target.value)}
                  className={SELECT}
                >
                  <option value="">{t("redesign.form.ageRangePlaceholder")}</option>
                  <option value="18-30">18-30</option>
                  <option value="30-50">30-50</option>
                  <option value="50-65">50-65</option>
                  <option value="65+">65+</option>
                  <option value="mixed">Mixed</option>
                </select>
                <SelectChevron />
              </div>
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
