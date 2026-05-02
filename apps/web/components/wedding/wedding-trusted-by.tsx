"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"

const SANS_FONT = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const

const LOGOS = [
  { src: "/trustedby/figma/bentley.png", alt: "Bentley" },
  { src: "/trustedby/figma/american-airlines.png", alt: "American Airlines" },
  { src: "/trustedby/figma/michelin.png", alt: "Michelin" },
  { src: "/trustedby/figma/ebaa.png", alt: "EBAA" },
  { src: "/trustedby/figma/pestana.png", alt: "Pestana Hotel Group" },
  { src: "/trustedby/figma/mercedes-benz.png", alt: "Mercedes-Benz" },
] as const

function LogoCell({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative h-[90px] w-[172px] shrink-0">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="172px"
        className="object-contain"
        style={{
          filter:
            "brightness(0) saturate(100%) invert(72%) sepia(7%) saturate(420%) hue-rotate(11deg) brightness(94%) contrast(86%)",
        }}
      />
    </div>
  )
}

export function WeddingTrustedBy() {
  const t = useTranslations("wedding.trustedBy")

  return (
    <section className="bg-[#f5f2ed] border-y border-y-[rgba(168,131,58,0.1)] px-4 md:px-12 pt-6 pb-[50px]">
      <div className="max-w-[1280px] mx-auto flex flex-col items-center gap-6">
        <span
          className="text-[12px] font-semibold uppercase tracking-[2px] text-[#a08248] whitespace-nowrap"
          style={SANS_FONT}
        >
          {t("eyebrow")}
        </span>

        <div className="hidden md:flex w-full items-center justify-between">
          {LOGOS.map((l) => (
            <LogoCell key={l.src} src={l.src} alt={l.alt} />
          ))}
        </div>

        <div className="md:hidden w-full overflow-x-auto -mx-4 px-4 scrollbar-hide">
          <div className="flex items-center gap-10 w-max">
            {LOGOS.map((l) => (
              <LogoCell key={l.src} src={l.src} alt={l.alt} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
