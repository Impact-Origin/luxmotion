"use client"

import { useRef } from "react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { cn } from "@workspace/ui/lib/utils"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { useAutoScrollMarquee } from "@/hooks/use-auto-scroll-marquee"

const SANS_FONT = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const

const PARTNERS = [
  { src: "/schools/partners/carlucci-american.webp", alt: "Carlucci American International School of Lisbon" },
  { src: "/schools/partners/st-julians.webp", alt: "St. Julian's School" },
  { src: "/schools/partners/charles-lepierre.webp", alt: "Lycée Français Charles Lepierre" },
  { src: "/schools/partners/kings-college-cascais.webp", alt: "King's College School Cascais" },
  { src: "/schools/partners/international-school.webp", alt: "International Sharing School" },
  { src: "/schools/partners/salesianos-estoril.webp", alt: "Salesianos do Estoril" },
  { src: "/schools/partners/instituto-superior-tecnico.webp", alt: "Instituto Superior Técnico" },
  { src: "/schools/partners/torres-vedras.webp", alt: "Torres Vedras" },
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
  useAutoScrollMarquee(marqueeRef, { activeBelow: 99999, speedPxPerSec: 32 })

  return (
    <section className="bg-[#fafafa] border-y border-[rgba(28,27,24,0.08)]">
      <div ref={ref} className="max-w-[1280px] mx-auto px-4 md:px-12 py-6 flex flex-col gap-6 items-center">
        <p
          className={cn("text-[12px] font-semibold uppercase tracking-[2px] text-[#a08248] whitespace-nowrap leading-none text-center", reveal())}
          style={SANS_FONT}
        >
          {t("eyebrow")}
        </p>

        <div
          ref={marqueeRef}
          className={cn(
            "w-full overflow-x-auto scrollbar-hide -mx-4 px-4 md:-mx-12 md:px-12",
            reveal(),
          )}
        >
          <div className="flex items-center gap-12 md:gap-16 w-max">
            {[...PARTNERS, ...PARTNERS].map((p, i) => (
              <PartnerLogo key={`${p.alt}-${i}`} {...p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
