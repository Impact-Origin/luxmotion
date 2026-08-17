"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { cn } from "@workspace/ui/lib/utils"

const SERIF_FONT = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const

const METHODS = [
  { src: "/schools/payments/visa.svg", alt: "VISA", w: 36.727, h: 11.875 },
  { src: "/shared/payments/mastercard.svg", alt: "Mastercard", w: 40, h: 24 },
  { src: "/schools/payments/mbway.svg", alt: "MB Way", w: 41.956, h: 20.383 },
  { src: "/schools/payments/multibanco.svg", alt: "Multibanco", w: 56.789, h: 20.408 },
  { src: "/schools/payments/paypal.svg", alt: "PayPal", w: 67.492, h: 16.351 },
] as const

function PaymentPill({ src, alt, w, h }: { src: string; alt: string; w: number; h: number }) {
  return (
    <div
      className="bg-white border border-[rgba(193,166,114,0.21)] rounded-[3px] h-8 px-[15px] py-px flex items-center justify-center"
      style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.05))" }}
    >
      <Image
        src={src}
        alt={alt}
        width={Math.round(w)}
        height={Math.round(h)}
        className="object-contain"
        style={{ width: `${w}px`, height: `${h}px` }}
      />
    </div>
  )
}

export function SchoolsPayment() {
  const t = useTranslations("schools.payment")
  const { ref, reveal } = useScrollReveal<HTMLDivElement>()

  return (
    <section className="bg-[#fafafa] px-4 md:px-[80px] py-[56px]">
      <div ref={ref} className="max-w-[1280px] mx-auto flex flex-col gap-7 items-center">
        <h2
          className={cn("text-[32px] md:text-[44px] leading-[1.1] text-[#1a1612] text-center font-normal whitespace-nowrap", reveal())}
          style={SERIF_FONT}
        >
          {t("title")}{" "}
          <span className="italic text-[#a8833a]">{t("titleAccent")}</span>
        </h2>

        <div className="hidden md:flex items-center gap-[10px]">
          {METHODS.map((m, i) => (
            <div
              key={m.alt}
              className={reveal()}
              style={{ transitionDelay: `${160 + i * 80}ms` }}
            >
              <PaymentPill {...m} />
            </div>
          ))}
        </div>

        <div className="md:hidden grid grid-cols-2 gap-[2px] w-[186.281px]">
          {METHODS.map((m, i) => (
            <div
              key={m.alt}
              className={reveal()}
              style={{ transitionDelay: `${160 + i * 80}ms` }}
            >
              <PaymentPill {...m} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
