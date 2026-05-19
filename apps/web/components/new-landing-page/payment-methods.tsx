"use client"

import Image from "next/image"
import { ExclusiveBadge } from "@/components/new-landing-page/exclusive-badge"
import { useTranslations } from "next-intl"

export function PaymentMethods() {
  const t = useTranslations("paymentMethods")

  return (
    <section id="payment-methods" className="scroll-mt-24 py-[40px] md:py-[64px] px-4 md:px-8 lg:px-[60px] xl:px-[100px] bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center mb-2 lg:hidden">
          <ExclusiveBadge />
        </div>

        <div className="flex flex-col gap-6 md:gap-8 items-center py-8 rounded-[20px]">
          <h2 className="text-[28px] md:text-[36px] font-bold text-[#222] text-center">
            {t("title")}
          </h2>

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
              <p className="text-[#222] text-[24px] xl:text-[24px] leading-[1.3] font-medium">
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
              <p className="text-[#0E4659] text-[16px] leading-[1.3]">
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
