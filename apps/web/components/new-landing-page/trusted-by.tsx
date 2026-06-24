"use client"

import { useRef } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { useAutoScrollMarquee } from "@/hooks/use-auto-scroll-marquee"

const logos = [
  { name: "American Airlines", src: "/trustedby/american-airlines-easy-transfer.png" },
  { name: "Bentley", src: "/trustedby/bentley-logo-easy-transfer.png" },
  { name: "BMW", src: "/trustedby/BMW-logo-easy-transfer.png" },
  { name: "Emirates", src: "/trustedby/Emirates-Logo-easy-transfer.png" },
  { name: "Four Seasons", src: "/trustedby/Four-Seasons-Logo-easy-transfer.png" },
  { name: "Hilton", src: "/trustedby/Hilton-Logo-easy-transfer.png" },
  { name: "Mercedes-Benz", src: "/trustedby/mercedes-benz-logo-easy-transfer.png" },
  { name: "NetJets", src: "/trustedby/NetJets-logo-easy-transfer.png" },
  { name: "Pestana", src: "/trustedby/pestana-logo-easy-transfer.png" },
  { name: "TAP", src: "/trustedby/tap-logo-easy-transfer.png" },
  { name: "Vila Galé", src: "/trustedby/vila-gale-easy-transfer.png" },
]

export function TrustedBy() {
  const t = useTranslations("trustedBy")
  const marqueeRef = useRef<HTMLDivElement>(null)
  useAutoScrollMarquee(marqueeRef, { activeBelow: 99999, speedPxPerSec: 32 })

  return (
    <section id="companies" className="scroll-mt-24 bg-[var(--lm-bg,#0D0D0D)] border-y border-[rgba(var(--lm-text-rgb,255,255,255),0.12)]">
      <div className="pt-6 pb-[50px] flex flex-col items-center gap-6">
        <p
          className="text-[12px] font-semibold uppercase tracking-[2px] text-[var(--lm-accent,#C9A96E)] text-center px-4"
          style={{ fontFamily: "var(--font-sans), Inter, system-ui, sans-serif" }}
        >
          {t("eyebrow")}
        </p>

        <div
          ref={marqueeRef}
          className="w-full overflow-x-auto px-4 md:px-10 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [mask-image:linear-gradient(to_right,transparent,#000_3%,#000_97%,transparent)]"
        >
          <div className="flex items-center gap-12 w-max">
            {[...logos, ...logos].map((logo, i) => (
              <div
                key={`${logo.name}-${i}`}
                className="group relative h-[60px] md:h-[90px] w-[140px] md:w-[172px] shrink-0 opacity-50 hover:opacity-100 transition-opacity duration-500 ease-out"
              >
                <Image
                  src={logo.src}
                  alt={logo.name}
                  fill
                  sizes="172px"
                  className="object-contain transition-all duration-500 ease-out dark:grayscale dark:brightness-0 dark:invert dark:group-hover:grayscale-0 dark:group-hover:invert-0 dark:group-hover:brightness-100 group-hover:scale-105 group-hover:drop-shadow-[0_0_18px_rgba(var(--lm-accent-rgb,201,169,110),0.45)]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
