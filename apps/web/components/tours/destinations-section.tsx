"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Search } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@workspace/ui/lib/utils"
import { useSwipe } from "@/hooks/use-swipe"

const destinationData = [
  { id: "lisboa", image: "/regions_lisboa.png" },
  { id: "porto", image: "/regions_porto.png" },
  { id: "algarve", image: "/regions_algarve.png" },
  { id: "alentejo", image: "/regions_alentejo.png" },
  { id: "acores", image: "/regions_acores.png" },
  { id: "madeira", image: "/regions_madeira.png" },
]

const STEP = 2
const DESKTOP_VISIBLE = 3
const MOBILE_VISIBLE = 2

function scrollToSearch() {
  window.scrollTo({ top: 0, behavior: "smooth" })
  setTimeout(() => {
    const input = document.querySelector<HTMLInputElement>(".tours-hero input[type='text'], header input[type='text'], input[placeholder*='earch']")
    if (input) input.focus()
  }, 600)
}

interface DestinationCardProps {
  name: string
  image: string
  href: string
  isMobile?: boolean
}

function DestinationCard({ name, image, href, isMobile }: DestinationCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "relative overflow-hidden rounded-[16px] cursor-pointer group block shrink-0",
        isMobile ? "h-[300px]" : "h-[540px]"
      )}
    >
      <Image
        src={image}
        alt={name}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes={isMobile ? "50vw" : "33vw"}
      />
      <div className="absolute bottom-0 left-0 right-0 h-[165px] bg-gradient-to-t from-black/70 to-transparent" />
      <div className="absolute bottom-[24px] left-[16px] flex gap-[16px] items-center">
        <span
          className={cn(
            "font-bold text-white leading-[1.2]",
            isMobile ? "text-[24px]" : "text-[32px]"
          )}
        >
          {name}
        </span>
        <div className="size-[28px] bg-white rounded-full flex items-center justify-center group-hover:bg-[#27c7ff] transition-colors">
          <ArrowRight className="size-[18px] text-[#222222] group-hover:text-white transition-colors" />
        </div>
      </div>
    </Link>
  )
}

export function DestinationsSection() {
  const t = useTranslations("destinations")
  const tTours = useTranslations("tours")
  const [offset, setOffset] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  const destinations = destinationData.map((d) => ({
    ...d,
    name: tTours(`destinations.${d.id}.name`),
  }))

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const visible = isMobile ? MOBILE_VISIBLE : DESKTOP_VISIBLE
  const totalItems = destinations.length + 1
  const maxOffset = totalItems - visible

  const next = useCallback(() => {
    setOffset((prev) => Math.min(prev + STEP, maxOffset))
  }, [maxOffset])

  const prev = useCallback(() => {
    setOffset((prev) => Math.max(prev - STEP, 0))
  }, [])

  const destSwipe = useSwipe(next, prev)

  const totalDots = useMemo(() => {
    return Math.ceil(maxOffset / STEP) + 1
  }, [maxOffset])

  const currentDot = Math.min(Math.floor(offset / STEP), totalDots - 1)

  const goToDot = (index: number) => {
    setOffset(Math.min(index * STEP, maxOffset))
  }

  const gapPx = isMobile ? 16 : 24
  const cardWidthPercent = 100 / visible

  return (
    <section className="bg-white px-4 md:px-5 lg:px-6 xl:px-8 pt-[40px] pb-[24px] md:pb-[60px]">
      <div className="max-w-7xl mx-auto flex flex-col gap-[24px]">
        <div className="flex items-start md:items-center justify-between">
          <h2 className="text-[24px] md:text-[32px] font-bold leading-[1.3] text-[#070d0f]">
            {t("titlePart1")}{" "}
            <span className="font-extrabold italic text-[#222222]">
              {t("titleDestination")}
            </span>{" "}
            {t("titlePart2")}{" "}
            <span className="text-[#27c7ff]">{t("titleHighlight")}</span>
            {t("titleEnd")}
          </h2>
        </div>

        <div className="flex flex-col gap-[24px] items-center">
          <div className="w-full overflow-hidden touch-pan-y" {...destSwipe}>
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                gap: `${gapPx}px`,
                transform: `translateX(calc(-${offset} * (${cardWidthPercent}% - ${gapPx * (visible - 1) / visible}px + ${gapPx}px)))`,
              }}
            >
              {destinations.map((destination) => (
                <div
                  key={destination.id}
                  className="shrink-0"
                  style={{ width: `calc(${cardWidthPercent}% - ${gapPx * (visible - 1) / visible}px)` }}
                >
                  <DestinationCard
                    name={destination.name}
                    image={destination.image}
                    href={`/tours/${destination.id}`}
                    isMobile={isMobile}
                  />
                </div>
              ))}

              <button
                onClick={scrollToSearch}
                className={cn(
                  "shrink-0 rounded-[16px] overflow-hidden cursor-pointer group bg-gradient-to-br from-[#27c7ff] to-[#0e9fd8] flex flex-col items-center justify-center px-4 md:px-6",
                  isMobile ? "h-[300px] gap-3" : "h-[540px] gap-5"
                )}
                style={{ width: `calc(${cardWidthPercent}% - ${gapPx * (visible - 1) / visible}px)` }}
              >
                <div className={cn(
                  "rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors",
                  isMobile ? "size-[52px]" : "size-[64px]"
                )}>
                  <Search className={cn("text-white", isMobile ? "size-5" : "size-7")} />
                </div>
                <span className={cn(
                  "font-bold text-white leading-[1.2] text-center",
                  isMobile ? "text-[17px]" : "text-[28px]"
                )}>
                  {tTours("exploreAll")}
                </span>
                <div className={cn(
                  "bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform",
                  isMobile ? "size-8" : "size-9"
                )}>
                  <ArrowUpRight className={cn("text-[#27c7ff]", isMobile ? "size-4" : "size-5")} />
                </div>
              </button>
            </div>
          </div>

          <div className="flex gap-[16px] items-center justify-center">
            <button
              onClick={prev}
              disabled={offset === 0}
              className={cn(
                "size-[32px] rounded-full flex items-center justify-center transition-colors",
                offset === 0
                  ? "bg-[#ebebeb] cursor-not-allowed opacity-50"
                  : "bg-[#ebebeb] hover:bg-[#d5d5d5]"
              )}
              aria-label="Previous"
            >
              <ChevronLeft className="size-[15px] text-[#222222]" />
            </button>

            <div className="flex gap-[6.183px] items-center">
              {Array.from({ length: totalDots }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToDot(index)}
                  className={cn(
                    "rounded-full transition-all",
                    index === currentDot
                      ? "size-[13.85px] border-[1.237px] border-[#27c7ff] bg-transparent"
                      : "size-[9.893px] bg-[#27c7ff]"
                  )}
                  aria-label={t("goToSlide", { number: index + 1 })}
                />
              ))}
            </div>

            <button
              onClick={next}
              disabled={offset >= maxOffset}
              className={cn(
                "size-[32px] rounded-full flex items-center justify-center transition-colors",
                offset >= maxOffset
                  ? "bg-[#ebebeb] cursor-not-allowed opacity-50"
                  : "bg-[#ebebeb] hover:bg-[#d5d5d5]"
              )}
              aria-label="Next"
            >
              <ChevronRight className="size-[15px] text-[#222222]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
