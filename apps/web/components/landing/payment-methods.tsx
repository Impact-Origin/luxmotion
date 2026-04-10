"use client"

import Image from "next/image"
import { ShieldCheck } from "lucide-react"
import { ExclusiveBadge } from "@/components/landing/exclusive-badge"
import { useTranslations } from "next-intl"

export function PaymentMethods() {
  const t = useTranslations("paymentMethods")

  return (
    <section
      id="payment-methods"
      data-theme-color="background"
      className="payment-section py-[40px] md:py-[64px] px-4 md:px-8 lg:px-[60px] xl:px-[100px]"
      style={{ backgroundColor: "var(--theme-background, #ffffff)" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center mb-2 lg:hidden">
          <ExclusiveBadge />
        </div>

        <div className="flex flex-col gap-6 md:gap-8 items-center py-8 rounded-[20px]">
          <h2 data-theme-color="paymentSectionTitle" className="text-[28px] md:text-[36px] font-bold text-center" style={{ color: "var(--theme-payment-section-title, #222222)" }}>
            {t("title")}
          </h2>

          <div
            data-theme-color="paymentSecurityBadgeBg"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2"
            style={{ backgroundColor: "var(--theme-payment-security-badge-bg, #E9F9FF)" }}
          >
            <ShieldCheck data-theme-color="paymentIconColor" className="size-5" style={{ color: "var(--theme-payment-icon-color, #0E4659)", stroke: "var(--theme-payment-icon-color, #0E4659)" }} />
            <span data-theme-color="paymentSecurityBadgeText" className="text-sm font-medium" style={{ color: "var(--theme-payment-security-badge-text, #0E4659)" }}>
              Secure Payments
            </span>
          </div>

          <div className="hidden lg:flex items-start justify-center w-full gap-10 xl:gap-16">
            <div className="relative w-[500px] h-[440px] xl:w-[600px] xl:h-[530px] shrink-0">
              <Image
                src="/payment_thumbnail.png"
                alt="Secure payment methods"
                fill
                className="object-contain"
              />
            </div>

            <div className="flex flex-col gap-6 xl:gap-8 items-start max-w-[580px] xl:max-w-[650px] pt-12">
              <p data-theme-color="secondary" className="text-[24px] xl:text-[24px] leading-[1.3] font-medium" style={{ color: "var(--theme-secondary, #222222)" }}>
                {t("description")}
              </p>

              <div className="grid grid-cols-3 gap-[6px] xl:gap-[24px] w-full max-w-[320px]">
                <Image src="/images/visa.png" alt="Visa" width={100} height={60} className="object-contain w-full h-auto" />
                <Image src="/mastercard-logo.png" alt="Mastercard" width={100} height={60} className="object-contain w-full h-auto" />
                <Image src="/multibanco-logo.png" alt="Multibanco" width={100} height={60} className="object-contain w-full h-auto" />
                <Image src="/mbway-logo.png" alt="MB WAY" width={100} height={60} className="object-contain w-full h-auto" />
                <Image src="/paypal-logo.png" alt="PayPal" width={100} height={60} className="object-contain w-full h-auto" />
              </div>
            </div>
          </div>

          <div className="flex lg:hidden flex-col gap-6 md:gap-8 items-center w-full">
            <div className="relative w-[360px] h-[320px]">
              <Image
                src="/payment_thumbnail.png"
                alt="Secure payment methods"
                fill
                className="object-contain"
              />
            </div>

            <div className="flex flex-col gap-6 md:gap-8 w-full">
              <p data-theme-color="secondary" className="text-[16px] leading-[1.3]" style={{ color: "var(--theme-secondary, #0E4659)" }}>
                {t("description")}
              </p>

              <div className="grid grid-cols-3 gap-[6px] w-full max-w-[240px]">
                <Image src="/images/visa.png" alt="Visa" width={70} height={42} className="object-contain w-full h-auto" />
                <Image src="/mastercard-logo.png" alt="Mastercard" width={70} height={42} className="object-contain w-full h-auto" />
                <Image src="/multibanco-logo.png" alt="Multibanco" width={70} height={42} className="object-contain w-full h-auto" />
                <Image src="/mbway-logo.png" alt="MB WAY" width={70} height={42} className="object-contain w-full h-auto" />
                <Image src="/paypal-logo.png" alt="PayPal" width={70} height={42} className="object-contain w-full h-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
