"use client"

import { useState } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { ArrowRight, Check } from "lucide-react"
import { useMutation } from "convex/react"
import { api } from "@workspace/convex/api"
import { toast } from "sonner"

const SERIF_FONT = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const
const SANS_FONT = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const

const INPUT_DARK =
  "w-full h-[44px] bg-[rgba(255,255,255,0.12)] border border-[rgba(255,255,255,0.12)] px-[13px] text-[14px] text-white placeholder:text-[#999] focus:outline-none focus:border-[rgba(255,255,255,0.4)] transition-colors leading-none"

function CheckRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 w-full">
      <Check
        className="size-[14px] text-[#f5c842] shrink-0 mt-[3px]"
        strokeWidth={2.5}
      />
      <span
        className="text-[12px] leading-[1.2] text-[rgba(255,255,255,0.7)]"
        style={SANS_FONT}
      >
        {children}
      </span>
    </div>
  )
}

export function SchoolsNewsletter() {
  const t = useTranslations("schools.newsletter")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const subscribe = useMutation(api.newsletterSubscriptions.subscribe)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setIsSubmitting(true)
    try {
      await subscribe({
        email: email.trim(),
        name: name.trim() || undefined,
        source: "schools",
      })
      toast.success(t("subscribeSuccess"))
      setName("")
      setEmail("")
    } catch {
      toast.error(t("subscribeError"))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="bg-[#0d0d0d]">
      <div className="md:hidden flex flex-col">
        <div className="relative w-full h-[300px]">
          <Image
            src="/schools/newsletter.png"
            alt={t("photoAlt")}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col items-end gap-[27px] px-4 py-8 w-full">
          <div className="flex flex-col gap-2 w-full">
            <h2
              className="text-[32px] italic text-white leading-tight pt-[7px]"
              style={SERIF_FONT}
            >
              {t("title")}
            </h2>
            <p
              className="text-[14px] leading-[1.2] text-[rgba(255,255,255,0.7)]"
              style={SANS_FONT}
            >
              {t("subtitle")}
            </p>
          </div>

          <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("namePlaceholder")}
              autoComplete="name"
              disabled={isSubmitting}
              className={INPUT_DARK}
              style={SANS_FONT}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("emailPlaceholder")}
              autoComplete="email"
              required
              disabled={isSubmitting}
              className={INPUT_DARK}
              style={SANS_FONT}
            />

            <div className="flex flex-col gap-2 py-1 w-full">
              <CheckRow>{t("benefit1")}</CheckRow>
              <CheckRow>{t("benefit2")}</CheckRow>
              <CheckRow>{t("benefit3")}</CheckRow>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full bg-white hover:bg-[#f5f5f5] disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-[#0d0d0d] text-[14px] font-medium uppercase tracking-[1.1px] inline-flex items-center justify-center gap-2 px-[22px]"
              style={SANS_FONT}
            >
              <span>{isSubmitting ? t("submitting") : t("submit")}</span>
              {isSubmitting ? null : <ArrowRight className="size-4" strokeWidth={2} />}
            </button>
          </form>
        </div>
      </div>

      <div className="hidden md:grid grid-cols-2 items-stretch min-h-[500px]">
        <div className="relative w-full min-h-[500px]">
          <Image
            src="/schools/newsletter.png"
            alt={t("photoAlt")}
            fill
            sizes="50vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-center gap-6 px-12 lg:px-16 py-16 w-full">
          <div className="flex flex-col gap-3 w-full">
            <h2
              className="text-[40px] italic text-white leading-tight"
              style={SERIF_FONT}
            >
              {t("title")}
            </h2>
            <p
              className="text-[14px] leading-[1.3] text-[rgba(255,255,255,0.7)] max-w-[520px]"
              style={SANS_FONT}
            >
              {t("subtitle")}
            </p>
          </div>

          <form
            className="flex flex-col gap-2 w-full max-w-[520px]"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("namePlaceholder")}
              autoComplete="name"
              disabled={isSubmitting}
              className={INPUT_DARK}
              style={SANS_FONT}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("emailPlaceholder")}
              autoComplete="email"
              required
              disabled={isSubmitting}
              className={INPUT_DARK}
              style={SANS_FONT}
            />

            <div className="flex flex-col gap-2 py-1 w-full">
              <CheckRow>{t("benefit1")}</CheckRow>
              <CheckRow>{t("benefit2")}</CheckRow>
              <CheckRow>{t("benefit3")}</CheckRow>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full bg-white hover:bg-[#f5f5f5] disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-[#0d0d0d] text-[14px] font-medium uppercase tracking-[1.1px] inline-flex items-center justify-center gap-2 px-[22px] mt-2"
              style={SANS_FONT}
            >
              <span>{isSubmitting ? t("submitting") : t("submit")}</span>
              {isSubmitting ? null : <ArrowRight className="size-4" strokeWidth={2} />}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
