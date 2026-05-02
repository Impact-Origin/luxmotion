"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"

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
    <div className="relative h-[90px] w-[172px] shrink-0">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="172px"
        className="object-contain pointer-events-none"
      />
    </div>
  )
}

export function SchoolsTrustedBy() {
  const t = useTranslations("schools.trustedBy")

  return (
    <section className="bg-[#fafafa] border-y border-[rgba(28,27,24,0.08)]">
      <div className="max-w-[1280px] mx-auto px-4 md:px-12 py-6 flex flex-col gap-6 items-center">
        <p
          className="text-[12px] font-semibold uppercase tracking-[2px] text-[#a08248] whitespace-nowrap leading-none text-center"
          style={SANS_FONT}
        >
          {t("eyebrow")}
        </p>

        <div className="hidden md:flex items-center justify-between w-full">
          {PARTNERS.map((p) => (
            <PartnerLogo key={p.alt} {...p} />
          ))}
        </div>

        <div className="md:hidden w-full overflow-x-auto scrollbar-hide -mx-4 px-4">
          <div className="flex items-center gap-6 w-max">
            {PARTNERS.map((p) => (
              <PartnerLogo key={p.alt} {...p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
