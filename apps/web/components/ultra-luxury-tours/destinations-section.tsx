"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@workspace/ui/lib/utils"
import { useSwipe } from "@/hooks/use-swipe"

const SERIF_FONT = "var(--font-title), 'Cormorant Garamond', serif"

const DESTINATIONS = [
  { id: "lisbon", image: "/ultra-luxury-tours/dest-lisbon-sintra.webp", href: "/tours/lisboa", count: 8 },
  { id: "porto", image: "/ultra-luxury-tours/dest-porto-douro.webp", href: "/tours/porto", count: 8 },
  { id: "alentejo", image: "/ultra-luxury-tours/dest-alentejo.webp", href: "/tours/alentejo", count: 8 },
]

const DESKTOP_VISIBLE = 4
const MOBILE_VISIBLE = 1

function DestinationCard({
  name,
  accent,
  countLabel,
  subtitle,
  image,
  href,
}: {
  name: string
  accent: string
  countLabel: string
  subtitle: string
  image: string
  href: string
}) {
  return (
    <Link href={href} className="group relative block h-full shrink-0 overflow-hidden">
      <Image
        src={image}
        alt={`${name} ${accent}`.trim()}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 25vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[42%] to-black to-[82%]" />
      <div className="absolute inset-x-0 bottom-0 flex items-end gap-2 p-4">
        <div className="flex flex-1 flex-col gap-2">
          <span className="text-[12px] font-semibold uppercase leading-none tracking-[2px] text-[#C9A96E]">
            {countLabel}
          </span>
          <p className="text-[24px] leading-normal text-white" style={{ fontFamily: SERIF_FONT }}>
            <span className="font-medium">{name}</span>
            <br />
            <span className="font-medium italic text-[#C9A96E]">{accent}</span>
          </p>
          <span className="text-[12px] leading-[1.2] tracking-[0.12px] text-[#999]">{subtitle}</span>
        </div>
        <div className="flex size-[32px] shrink-0 items-center justify-center border border-[rgba(255,255,255,0.3)] transition-colors duration-300 group-hover:border-[#C9A96E] group-hover:bg-[#C9A96E]">
          <ArrowRight className="size-[18px] text-[#C9A96E] transition-colors duration-300 group-hover:text-[#0d0d0d]" />
        </div>
      </div>
    </Link>
  )
}

export function UltraLuxuryDestinationsSection() {
  const t = useTranslations("ultraLuxuryTours.destinations")
  const [offset, setOffset] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Nunca reservar mais colunas do que há destinos: com 4 fixas e apenas 3
  // destinos, os cartões encostavam à esquerda e sobrava um quarto vazio à
  // direita. Assim ocupam a largura toda, centrados no contentor.
  const visible = isMobile
    ? MOBILE_VISIBLE
    : Math.min(DESKTOP_VISIBLE, DESTINATIONS.length)
  const maxOffset = Math.max(DESTINATIONS.length - visible, 0)

  useEffect(() => {
    setOffset((prev) => Math.min(prev, maxOffset))
  }, [maxOffset])

  const next = useCallback(() => setOffset((prev) => Math.min(prev + 1, maxOffset)), [maxOffset])
  const prev = useCallback(() => setOffset((prev) => Math.max(prev - 1, 0)), [])

  const swipeHandlers = useSwipe(next, prev)
  const totalDots = useMemo(() => maxOffset + 1, [maxOffset])

  return (
    <section className="bg-[#0D0D0D] px-4 py-10 md:px-[82px]">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-9">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-8 max-w-[82px] min-w-[32px] bg-[#C9A96E]" />
            <span className="text-[12px] font-semibold uppercase leading-none tracking-[2px] text-[#C9A96E]">
              {t("eyebrow")}
            </span>
            <div className="h-px w-8 max-w-[82px] min-w-[32px] bg-[#C9A96E]" />
          </div>
          <h2 className="text-[32px] leading-none text-white md:text-[48px]" style={{ fontFamily: SERIF_FONT }}>
            {t("heading")} <span className="italic text-[#C9A96E]">{t("headingAccent")}</span>
          </h2>
        </div>

        <div className="relative">
          <div
            className="cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing"
            {...swipeHandlers}
          >
            <div
              className="flex gap-[2px] transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(calc(-${offset} * (${100 / visible}% + ${(2 * (visible - 1)) / visible}px)))`,
              }}
            >
              {DESTINATIONS.map((dest) => (
                <div
                  key={dest.id}
                  className="h-[460px] shrink-0 md:h-[400px]"
                  style={{ width: `calc(${100 / visible}% - ${(2 * (visible - 1)) / visible}px)` }}
                >
                  <DestinationCard
                    name={t(`cards.${dest.id}.name`)}
                    accent={t(`cards.${dest.id}.accent`)}
                    countLabel={t("itineraries", { count: dest.count })}
                    subtitle={t(`cards.${dest.id}.subtitle`)}
                    image={dest.image}
                    href={dest.href}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {maxOffset > 0 && (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={prev}
              disabled={offset === 0}
              className="flex size-[44px] items-center justify-center border border-[rgba(201,169,110,0.5)] bg-[#0D0D0D] transition-opacity disabled:opacity-30 md:size-[36px]"
              aria-label={t("prev")}
            >
              <ChevronLeft className="size-[16px] text-[#C9A96E]" />
            </button>

            <div className="flex items-center gap-[6px]">
              {Array.from({ length: totalDots }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setOffset(i)}
                  className={cn(
                    "rounded-full transition-all",
                    i === offset ? "size-[10px] bg-[#C9A96E]" : "size-[6px] bg-[rgba(201,169,110,0.3)]",
                  )}
                  aria-label={t("goToSlide", { number: i + 1 })}
                />
              ))}
            </div>

            <button
              onClick={next}
              disabled={offset >= maxOffset}
              className="flex size-[44px] items-center justify-center border border-[rgba(201,169,110,0.5)] bg-[#0D0D0D] transition-opacity disabled:opacity-30 md:size-[36px]"
              aria-label={t("next")}
            >
              <ChevronRight className="size-[16px] text-[#C9A96E]" />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
