"use client"

import { useRef } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { useAutoScrollMarquee } from "@/hooks/use-auto-scroll-marquee"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { cn } from "@workspace/ui/lib/utils"

const SANS_FONT = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const

const LOGOS = [
  { src: "/wedding/partners/penha-longa.webp", alt: "Penha Longa" },
  { src: "/wedding/partners/quinta-da-pacheca.webp", alt: "Quinta da Pacheca" },
  { src: "/wedding/partners/quinta-santana.webp", alt: "Quinta de Sant'Ana" },
  { src: "/wedding/partners/quinta-dazenha.webp", alt: "Quinta d'Azenha" },
  { src: "/wedding/partners/quinta-amadeus.webp", alt: "Quinta Amadeu's" },
  { src: "/wedding/partners/casa-do-souto.webp", alt: "Casa do Souto" },
  { src: "/wedding/partners/monte-bello.webp", alt: "Monte Bello" },
  { src: "/wedding/partners/casamentos-pt.svg", alt: "Casamentos.pt" },
  { src: "/wedding/partners/zankyou.webp", alt: "Zankyou" },
  { src: "/wedding/partners/kiss-and-tell.webp", alt: "Kiss & Tell" },
  { src: "/wedding/partners/mercedes-benz-2010.svg", alt: "Mercedes-Benz" },
] as const

function LogoCell({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="group relative h-[90px] w-[172px] shrink-0 cursor-pointer">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="172px"
        className="object-contain transition-all duration-500 ease-out [filter:brightness(0)_saturate(100%)_invert(72%)_sepia(7%)_saturate(420%)_hue-rotate(11deg)_brightness(94%)_contrast(86%)] group-hover:[filter:none] group-hover:scale-105 group-hover:drop-shadow-[0_0_18px_rgba(160,130,72,0.45)]"
      />
    </div>
  )
}

export function WeddingPlannerTrustedBy() {
  const t = useTranslations("weddingPlanner.trustedBy")
  const marqueeRef = useRef<HTMLDivElement>(null)
  // activeBelow alto: a faixa roda em qualquer largura. No desktop era uma fila
  // estática, que com onze logótipos deixaria de caber.
  useAutoScrollMarquee(marqueeRef, { activeBelow: 99999, speedPxPerSec: 32 })
  const { ref, reveal } = useScrollReveal<HTMLElement>()

  return (
    <section ref={ref} className="bg-white border-y border-[rgba(0,0,0,0.08)] px-4 md:px-12 pt-6 pb-[50px]">
      <div className={cn("max-w-[1280px] mx-auto flex flex-col items-center gap-6", reveal())}>
        <span
          className="text-[12px] font-semibold uppercase tracking-[2px] text-[#a08248] whitespace-nowrap"
          style={SANS_FONT}
        >
          {t("eyebrow")}
        </span>

        <div
          ref={marqueeRef}
          className="w-full overflow-x-auto -mx-4 px-4 md:-mx-12 md:px-12 scrollbar-hide"
        >
          {/* Lista duplicada para a faixa dar a volta sem corte visível. */}
          <div className="flex items-center gap-10 w-max">
            {[...LOGOS, ...LOGOS].map((l, i) => (
              <LogoCell
                key={`${l.src}-${i}`}
                src={l.src}
                /* A segunda volta é decorativa: sem alt para não repetir os
                   nomes num leitor de ecrã. */
                alt={i < LOGOS.length ? l.alt : ""}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
