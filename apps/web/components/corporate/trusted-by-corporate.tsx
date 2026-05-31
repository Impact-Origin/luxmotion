"use client"

import { useRef } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { useAutoScrollMarquee } from "@/hooks/use-auto-scroll-marquee"

const sans = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const

const LOGOS = [
  { id: "logo-1", src: "/corporate/trusted/logo-1.png" },
  { id: "logo-2", src: "/corporate/trusted/logo-2.png" },
  { id: "logo-3", src: "/corporate/trusted/logo-3.png" },
  { id: "logo-4", src: "/corporate/trusted/logo-4.png" },
  { id: "logo-5", src: "/corporate/trusted/logo-5.png" },
  { id: "logo-6", src: "/corporate/trusted/logo-6.png" },
] as const

export function TrustedByCorporate() {
  const t = useTranslations("corporatePage.trustedBy")
  const marqueeRef = useRef<HTMLDivElement>(null)
  useAutoScrollMarquee(marqueeRef, { activeBelow: 99999, speedPxPerSec: 32 })

  return (
    <section className="flex w-full items-center justify-center border-y border-[rgba(255,255,255,0.12)] bg-[#F7F4EF] px-4 pb-[50px] pt-6 md:px-[82px]">
      <div className="flex w-full max-w-[1280px] flex-col items-center justify-center gap-6">
        <p
          className="text-[12px] font-semibold uppercase tracking-[2px] text-[#696969]"
          style={sans}
        >
          {t("heading")}
        </p>

        <div
          ref={marqueeRef}
          className="-mx-4 w-[calc(100%+2rem)] overflow-x-auto px-4 [-ms-overflow-style:none] [scrollbar-width:none] md:-mx-[82px] md:w-[calc(100%+164px)] md:px-[82px] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex w-max items-center gap-12 opacity-50 mix-blend-difference">
            {[...LOGOS, ...LOGOS].map((logo, i) => (
              <div
                key={`${logo.id}-${i}`}
                className="relative h-[90px] w-[172px] shrink-0"
              >
                <Image
                  src={logo.src}
                  alt=""
                  fill
                  sizes="172px"
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
