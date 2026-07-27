"use client"

import { useRef } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { useAutoScrollMarquee } from "@/hooks/use-auto-scroll-marquee"

const sans = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const

const LOGOS = [
  { id: "galp", src: "/corporate/trusted/galp.webp", alt: "Galp" },
  { id: "edp", src: "/corporate/trusted/edp.webp", alt: "EDP" },
  { id: "meo", src: "/corporate/trusted/meo.webp", alt: "MEO" },
  { id: "nos", src: "/corporate/trusted/nos.webp", alt: "NOS" },
  { id: "vodafone", src: "/corporate/trusted/vodafone.webp", alt: "Vodafone" },
  { id: "millenniumbcp", src: "/corporate/trusted/millenniumbcp.webp", alt: "Millennium BCP" },
  { id: "sonae", src: "/corporate/trusted/sonae.webp", alt: "Sonae" },
  { id: "continente", src: "/corporate/trusted/continente.webp", alt: "Continente" },
  { id: "jeronimo-martins", src: "/corporate/trusted/jeronimo-martins.webp", alt: "Jerónimo Martins" },
  { id: "tap", src: "/corporate/trusted/tap.webp", alt: "TAP" },
  { id: "netjets", src: "/corporate/trusted/netjets.webp", alt: "NetJets" },
  { id: "delta", src: "/corporate/trusted/delta.webp", alt: "Delta" },
  { id: "mercedes-benz", src: "/corporate/trusted/mercedes-benz.webp", alt: "Mercedes-Benz" },
  { id: "continental", src: "/corporate/trusted/continental.webp", alt: "Continental" },
  { id: "repsol", src: "/corporate/trusted/repsol.webp", alt: "Repsol" },
  { id: "microsoft", src: "/corporate/trusted/microsoft.webp", alt: "Microsoft" },
  { id: "linkedin", src: "/corporate/trusted/linkedin.webp", alt: "LinkedIn" },
  { id: "nike", src: "/corporate/trusted/nike.svg", alt: "Nike" },
  { id: "hugo-boss", src: "/corporate/trusted/hugo-boss.webp", alt: "Hugo Boss" },
  { id: "dominos-pizza", src: "/corporate/trusted/dominos-pizza.webp", alt: "Domino's Pizza" },
  { id: "securitas", src: "/corporate/trusted/securitas.webp", alt: "Securitas" },
  { id: "pinkerton", src: "/corporate/trusted/pinkerton.svg", alt: "Pinkerton" },
  { id: "fpf", src: "/corporate/trusted/fpf.webp", alt: "Federação Portuguesa de Futebol" },
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
          {/* Logos de marca a cinzento, ganhando cor ao passar o rato — o
              mix-blend-difference anterior servia os placeholders, mas inverte
              as cores de logótipos reais sobre este fundo claro. */}
          <div className="flex w-max items-center gap-12">
            {[...LOGOS, ...LOGOS].map((logo, i) => (
              <div
                key={`${logo.id}-${i}`}
                className="group relative h-[90px] w-[172px] shrink-0 opacity-70 transition-opacity duration-500 ease-out hover:opacity-100"
              >
                <Image
                  src={logo.src}
                  /* A segunda volta da faixa é decorativa: sem alt para não
                     repetir os nomes num leitor de ecrã. */
                  alt={i < LOGOS.length ? logo.alt : ""}
                  fill
                  sizes="172px"
                  className="object-contain grayscale transition-all duration-500 ease-out group-hover:grayscale-0 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
