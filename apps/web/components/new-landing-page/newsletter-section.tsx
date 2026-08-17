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
    <section className="py-[40px] md:py-[64px] px-4 md:px-8 lg:px-[60px] xl:px-[100px] bg-white overflow-visible">
        <div className="max-w-7xl mx-auto">
        <div className="hidden lg:block relative">
          <div className="relative bg-[#0E4659] rounded-[16px] h-[200px] xl:h-[240px] [clip-path:inset(-500px_0_0_0_round_16px)]">
            <div className="hidden xl:block absolute right-0 top-0 bottom-0 w-[60%] bg-gradient-to-r from-[#0E4659] via-[#1A5B6E] via-[#27C7FF]/50 to-[#0e465900]" />

            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-center gap-6 md:gap-8 p-6 xl:p-8 z-10 max-w-[55%]" suppressHydrationWarning>
              <h2 className="text-[24px] md:text-[36px] font-bold leading-[1.1]">
                <span className="font-bold text-[var(--lm-text,#fff)]">{t("titleLine1")}</span>
                <br />
                <span className="font-bold text-[#27C7FF] italic">{t("titleLine2")}</span>
              </h2>

              <form onSubmit={handleSubmit} className="flex gap-4 w-full max-w-[620px]" suppressHydrationWarning>
                <div className="relative flex-1 min-w-[400px]">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-[var(--lm-muted,#808080)]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("placeholder")}
                    className="w-full h-[64px] pl-14 pr-5 bg-white rounded-[12px] text-[#222] placeholder:text-[var(--lm-muted,#808080)] text-[16px] focus:outline-none focus:ring-2 focus:ring-[#27C7FF] transition-all"
                    autoComplete="off"
                    name="newsletter-email"
                    id="newsletter-email-desktop"
                    suppressHydrationWarning
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="h-[64px] px-8 bg-[#27C7FF] rounded-[12px] text-[var(--lm-text,#fff)] font-bold text-[16px] uppercase tracking-wide flex items-center gap-2 hover:brightness-110 transition-all shrink-0"
                >
                  {t("button")}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </div>

            <div className="absolute right-[-20px] xl:right-[-6px] bottom-[-60px] xl:bottom-[-70px] w-[500px] xl:w-[600px] h-[400px] xl:h-[480px] hidden xl:block">
              <Image
                src="/home/newsletter-image.webp"
                alt="Newsletter"
                fill
                className="object-contain object-top-right"
              />
            </div>
          </div>
        </div>

        <div className="lg:hidden relative overflow-visible -mt-[40px]">
          <div className="relative w-full h-[425px] mb-[-250px] z-20">
            <Image
              src="/home/newsletter-image.webp"
              alt="Newsletter"
              fill
              className="object-cover rounded-t-[16px]"
            />
          </div>
          
          <div className="relative rounded-[16px] overflow-hidden pt-[180px] bg-[#0E4659]">
            <div className="absolute top-[180px] right-0 w-[100px] h-[100px] bg-gradient-radial from-[#27C7FF]/30 via-[#27C7FF]/15 to-transparent" style={{ background: 'radial-gradient(circle at top right, rgba(39, 199, 255, 0.3) 0%, rgba(39, 199, 255, 0.15) 40%, transparent 70%)' }}></div>
            <div className="relative flex flex-col gap-6 md:gap-8 p-5 z-30" suppressHydrationWarning>
              <h2 className="text-[28px] font-bold leading-tight">
                <span className="font-bold text-[var(--lm-text,#fff)]">{t("titleLine1")}</span>
                <br />
                <span className="font-bold text-[#27C7FF] italic">{t("titleLine2")}</span>
              </h2>

              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full" suppressHydrationWarning>
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--lm-muted,#808080)]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("placeholder")}
                    className="w-full h-[48px] pl-12 pr-4 bg-white rounded-[8px] text-[#222] placeholder:text-[var(--lm-muted,#808080)] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#27C7FF] transition-all"
                    autoComplete="off"
                    name="newsletter-email-mobile"
                    id="newsletter-email-mobile"
                    suppressHydrationWarning
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="h-[48px] px-5 bg-[#27C7FF] rounded-[8px] text-[var(--lm-text,#fff)] font-bold text-[14px] uppercase tracking-wide flex items-center justify-center gap-2 hover:brightness-110 transition-all shrink-0"
                >
                  {t("button")}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
