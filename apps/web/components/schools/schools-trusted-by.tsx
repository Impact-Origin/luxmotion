"use client"

import { useRef } from "react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { cn } from "@workspace/ui/lib/utils"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { useAutoScrollMarquee } from "@/hooks/use-auto-scroll-marquee"

const SANS_FONT = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const

const PARTNERS = [
  { src: "/schools/partners/bentley.png", alt: "Bentley" },
  { src: "/schools/partners/american-airlines.png", alt: "American Airlines" },
  { src: "/schools/partners/michelin.png", alt: "Michelin" },
  { src: "/schools/partners/ebaa.png", alt: "EBAA" },
  { src: "/schools/partners/pestana.png", alt: "Pestana" },
  { src: "/schools/partners/mercedes-benz.png", alt: "Mercedes-Benz" },
] as const

function PartnerLogo({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="group relative h-[90px] w-[172px] shrink-0 cursor-pointer opacity-70 hover:opacity-100 transition-opacity duration-500 ease-out">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="172px"
        className="object-contain pointer-events-none transition-all duration-500 ease-out grayscale group-hover:grayscale-0 group-hover:scale-105 group-hover:drop-shadow-[0_0_18px_rgba(160,130,72,0.45)]"
      />
    </div>
  )
}

export function SchoolsTrustedBy() {
  const t = useTranslations("schools.trustedBy")
  const marqueeRef = useRef<HTMLDivElement>(null)
  const { ref, reveal } = useScrollReveal<HTMLDivElement>()
  useAutoScrollMarquee(marqueeRef)

  return (
    <section className="bg-[#fafafa] border-y border-[rgba(28,27,24,0.08)]">
      <div ref={ref} className="max-w-[1280px] mx-auto px-4 md:px-12 py-6 flex flex-col gap-6 items-center">
        <p
          className={cn("text-[12px] font-semibold uppercase tracking-[2px] text-[#a08248] whitespace-nowrap leading-none text-center", reveal())}
          style={SANS_FONT}
        >
          {t("eyebrow")}
        </p>

        <div className="hidden md:flex items-center justify-between w-full">
          {PARTNERS.map((p, i) => (
            <div
              key={p.alt}
              className={reveal()}
              style={{ transitionDelay: `${120 + i * 80}ms` }}
            >
              <PartnerLogo {...p} />
            </div>
          ))}
        </div>

        <div
          ref={marqueeRef}
          className="md:hidden w-full overflow-x-auto scrollbar-hide -mx-4 px-4"
        >
          <div className="flex items-center gap-6 w-max">
            {[...PARTNERS, ...PARTNERS].map((p, i) => (
              <PartnerLogo key={`${p.alt}-${i}`} {...p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
