"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { Mail, ArrowRight } from "lucide-react"
import { useMutation } from "convex/react"
import { api } from "@workspace/convex/api"
import { toast } from "sonner"

export function NewsletterSection() {
  const t = useTranslations("newsletter")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const subscribe = useMutation(api.newsletterSubscriptions.subscribe)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await subscribe({ email })
      toast.success(t("subscribeSuccess"))
      setEmail("")
    } catch {
      toast.error(t("subscribeError"))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      data-theme-color="newsletterBg"
      className="py-[40px] md:py-[64px] px-4 md:px-8 lg:px-[60px] xl:px-[100px] overflow-visible"
      style={{ backgroundColor: "var(--theme-newsletter-bg, #ffffff)" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="hidden lg:block relative">
          <div
            data-theme-color="newsletterCardBg"
            className="relative rounded-[16px] h-[200px] xl:h-[240px] [clip-path:inset(-500px_0_0_0_round_16px)]"
            style={{ backgroundColor: "var(--theme-newsletter-card-bg, #0E4659)" }}
          >
            <div
              className="hidden xl:block absolute right-0 top-0 bottom-0 w-[60%]"
              style={{
                background:
                  "linear-gradient(to right, var(--theme-newsletter-card-bg, #0E4659), color-mix(in srgb, var(--theme-newsletter-title-accent, #27C7FF) 50%, var(--theme-newsletter-card-bg, #0E4659)), color-mix(in srgb, var(--theme-newsletter-card-bg, #0E4659) 0%, transparent))",
              }}
            />

            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-center gap-6 md:gap-8 p-6 xl:p-8 z-10 max-w-[55%]" suppressHydrationWarning>
              <h2 className="text-[24px] md:text-[36px] font-bold leading-[1.1]">
                <span data-theme-color="newsletterTitle" className="font-bold" style={{ color: "var(--theme-newsletter-title, #ffffff)" }}>{t("titleLine1")}</span>
                <br />
                <span data-theme-color="newsletterTitleAccent" className="font-bold italic" style={{ color: "var(--theme-newsletter-title-accent, #27C7FF)" }}>{t("titleLine2")}</span>
              </h2>

              <form onSubmit={handleSubmit} className="flex gap-4 w-full max-w-[620px]" suppressHydrationWarning>
                <div data-theme-color="newsletterInputBorder" className="relative flex-1 min-w-[400px] rounded-[12px] p-px" style={{ backgroundColor: "var(--theme-newsletter-input-border, #D1D5DB)" }}>
                  <div data-theme-color="newsletterInputBg" className="relative h-[62px] rounded-[11px]" style={{ backgroundColor: "var(--theme-newsletter-input-bg, #ffffff)" }}>
                    <Mail data-theme-color="newsletterInputIcon" className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6" style={{ color: "var(--theme-newsletter-input-icon, #808080)" }} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("placeholder")}
                      data-theme-color="newsletterInputText"
                      className="w-full h-full pl-14 pr-5 rounded-[11px] bg-transparent text-[16px] focus:outline-none focus:ring-2 transition-all"
                      style={{ color: "var(--theme-newsletter-input-text, #222222)" }}
                      autoComplete="off"
                      name="newsletter-email"
                      id="newsletter-email-desktop"
                      suppressHydrationWarning
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  data-theme-color="newsletterButtonBg"
                  className="h-[64px] px-8 rounded-[12px] font-bold text-[16px] uppercase tracking-wide flex items-center gap-2 transition-all shrink-0 disabled:opacity-70"
                  style={{ backgroundColor: "var(--theme-newsletter-button-bg, #27C7FF)", color: "var(--theme-newsletter-button-text, #ffffff)" }}
                >
                  <span data-theme-color="newsletterButtonText">{t("button")}</span>
                  <ArrowRight data-theme-color="newsletterButtonText" className="w-5 h-5" style={{ color: "var(--theme-newsletter-button-text, #ffffff)" }} />
                </button>
              </form>
            </div>

            <div className="absolute right-[-20px] xl:right-[-6px] bottom-[-60px] xl:bottom-[-70px] w-[500px] xl:w-[600px] h-[400px] xl:h-[480px] hidden xl:block">
              <Image src="/newsletter_image.png" alt="Newsletter" fill className="object-contain object-top-right" />
            </div>
          </div>
        </div>

        <div className="lg:hidden relative overflow-visible -mt-[40px]">
          <div className="relative w-full h-[425px] mb-[-250px] z-20">
            <Image src="/newsletter_image.png" alt="Newsletter" fill className="object-cover rounded-t-[16px]" />
          </div>

          <div
            data-theme-color="newsletterCardBg"
            className="relative rounded-[16px] overflow-hidden pt-[180px]"
            style={{ backgroundColor: "var(--theme-newsletter-card-bg, #0E4659)" }}
          >
            <div
              className="absolute top-[180px] right-0 w-[100px] h-[100px]"
              style={{ background: "radial-gradient(circle at top right, color-mix(in srgb, var(--theme-newsletter-title-accent, #27C7FF) 30%, transparent) 0%, color-mix(in srgb, var(--theme-newsletter-title-accent, #27C7FF) 15%, transparent) 40%, transparent 70%)" }}
            />
            <div className="relative flex flex-col gap-6 md:gap-8 p-5 z-30" suppressHydrationWarning>
              <h2 className="text-[28px] font-bold leading-tight">
                <span data-theme-color="newsletterTitle" className="font-bold" style={{ color: "var(--theme-newsletter-title, #ffffff)" }}>{t("titleLine1")}</span>
                <br />
                <span data-theme-color="newsletterTitleAccent" className="font-bold italic" style={{ color: "var(--theme-newsletter-title-accent, #27C7FF)" }}>{t("titleLine2")}</span>
              </h2>

              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full" suppressHydrationWarning>
                <div data-theme-color="newsletterInputBorder" className="relative flex-1 rounded-[8px] p-px" style={{ backgroundColor: "var(--theme-newsletter-input-border, #D1D5DB)" }}>
                  <div data-theme-color="newsletterInputBg" className="relative h-[46px] rounded-[7px]" style={{ backgroundColor: "var(--theme-newsletter-input-bg, #ffffff)" }}>
                    <Mail data-theme-color="newsletterInputIcon" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "var(--theme-newsletter-input-icon, #808080)" }} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("placeholder")}
                      data-theme-color="newsletterInputText"
                      className="w-full h-full pl-12 pr-4 rounded-[7px] bg-transparent text-[14px] focus:outline-none focus:ring-2 transition-all"
                      style={{ color: "var(--theme-newsletter-input-text, #222222)" }}
                      autoComplete="off"
                      name="newsletter-email-mobile"
                      id="newsletter-email-mobile"
                      suppressHydrationWarning
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  data-theme-color="newsletterButtonBg"
                  className="h-[48px] px-5 rounded-[8px] font-bold text-[14px] uppercase tracking-wide flex items-center justify-center gap-2 transition-all shrink-0 disabled:opacity-70"
                  style={{ backgroundColor: "var(--theme-newsletter-button-bg, #27C7FF)", color: "var(--theme-newsletter-button-text, #ffffff)" }}
                >
                  <span data-theme-color="newsletterButtonText">{t("button")}</span>
                  <ArrowRight data-theme-color="newsletterButtonText" className="w-4 h-4" style={{ color: "var(--theme-newsletter-button-text, #ffffff)" }} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
