"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"

const SERIF_FONT = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const

const METHODS = [
  { src: "/wedding/pay-visa.svg", alt: "Visa", w: 30, h: 14 },
  { src: "/wedding/pay-mastercard.svg", alt: "Mastercard", w: 40, h: 24 },
  { src: "/wedding/pay-mbway.svg", alt: "MB Way", w: 42, h: 20 },
  { src: "/wedding/pay-multibanco.svg", alt: "Multibanco", w: 57, h: 20 },
  { src: "/wedding/pay-paypal.svg", alt: "PayPal", w: 67, h: 16 },
] as const

function PaymentPill({
  src,
  alt,
  w,
  h,
}: {
  src: string
  alt: string
  w: number
  h: number
}) {
  return (
    <div className="bg-white border border-[rgba(193,166,114,0.21)] shadow-[0_2px_4px_rgba(0,0,0,0.05)] rounded-[3px] h-8 px-[15px] flex items-center justify-center shrink-0">
      <Image
        src={src}
        alt={alt}
        width={w}
        height={h}
        className="object-contain"
        unoptimized
      />
    </div>
  )
}

export function WeddingPaymentSection() {
  const t = useTranslations("wedding.payment")

  return (
    <section className="bg-[#faf7f2] px-4 md:px-20 py-14 md:py-14">
      <div className="max-w-[1280px] mx-auto flex flex-col items-center gap-7">
        <h2
          className="text-[36px] md:text-[44px] leading-tight font-normal text-[#1a1612] text-center"
          style={SERIF_FONT}
        >
          <span>{t("headingStart")} </span>
          <span className="italic text-[#a8833a]">{t("headingAccent")}</span>
        </h2>

        <div className="hidden md:flex gap-[10px] items-center justify-center">
          {METHODS.map((m) => (
            <PaymentPill key={m.alt} src={m.src} alt={m.alt} w={m.w} h={m.h} />
          ))}
        </div>

        <div className="md:hidden grid grid-cols-2 gap-[10px] place-items-center">
          {METHODS.map((m) => (
            <PaymentPill key={m.alt} src={m.src} alt={m.alt} w={m.w} h={m.h} />
          ))}
        </div>
      </div>
    </section>
  )
}
