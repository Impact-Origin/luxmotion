"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"

const logos = [
  { name: "Bentley", src: "/trustedby/figma/bentley.png" },
  { name: "American Airlines", src: "/trustedby/figma/american-airlines.png" },
  { name: "Michelin", src: "/trustedby/figma/michelin.png" },
  { name: "EBAA", src: "/trustedby/figma/ebaa.png" },
  { name: "Pestana", src: "/trustedby/figma/pestana.png" },
  { name: "Mercedes-Benz", src: "/trustedby/figma/mercedes-benz.png" },
]

export function TrustedBy() {
  const t = useTranslations("trustedBy")

  return (
    <section className="bg-[#0D0D0D] border-y border-[rgba(255,255,255,0.12)]">
      <div className="max-w-[1280px] mx-auto px-4 md:px-[82px] pt-6 pb-[50px] flex flex-col items-center gap-6">
        <p
          className="text-[12px] font-semibold uppercase tracking-[2px] text-[#C9A96E] text-center"
          style={{ fontFamily: "var(--font-sans), Inter, system-ui, sans-serif" }}
        >
          {t("eyebrow")}
        </p>

        <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-8 items-center opacity-50">
          {logos.map((logo) => (
            <div
              key={logo.name}
              className="relative h-[60px] md:h-[90px] w-full max-w-[172px] mx-auto"
            >
              <Image
                src={logo.src}
                alt={logo.name}
                fill
                sizes="172px"
                className="object-contain"
                style={{ filter: "grayscale(1) brightness(0) invert(1)" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
