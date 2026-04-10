"use client"

import Image from "next/image"
import Link from "next/link"
import { Sparkles, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Search } from "lucide-react"
import { useState, useCallback, useEffect, useMemo } from "react"
import { useTranslations } from "next-intl"
import { cn } from "@workspace/ui/lib/utils"
import { ExclusiveBadge } from "@/components/new-landing-page/exclusive-badge"
import { useSwipe } from "@/hooks/use-swipe"

const tourData = [
  { id: "lisboa", image: "/regions_lisboa.png" },
  { id: "porto", image: "/regions_porto.png" },
  { id: "algarve", image: "/regions_algarve.png" },
  { id: "alentejo", image: "/regions_alentejo.png" },
  { id: "acores", image: "/regions_acores.png" },
  { id: "madeira", image: "/regions_madeira.png" },
]

const STEP = 2
const VISIBLE = 3


export function ToursSection() {
  const t = useTranslations("tours")

  const tours = tourData.map((tour) => ({
    ...tour,
    name: t(`destinations.${tour.id}`),
  }))

  const totalItems = tours.length + 1
  const maxOffset = totalItems - VISIBLE
  const [offset, setOffset] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const mobileVisible = 1
  const mobileMaxOffset = totalItems - mobileVisible
  const currentMaxOffset = isMobile ? mobileMaxOffset : maxOffset

  const next = useCallback(() => {
    setOffset((prev) => Math.min(prev + STEP, currentMaxOffset))
  }, [currentMaxOffset])

  const prev = useCallback(() => {
    setOffset((prev) => Math.max(prev - STEP, 0))
  }, [])

  const totalDots = useMemo(() => {
    const steps = Math.ceil(currentMaxOffset / STEP)
    return steps + 1
  }, [currentMaxOffset])

  const currentDot = Math.min(Math.floor(offset / STEP), totalDots - 1)

  const goToDot = (index: number) => {
    setOffset(Math.min(index * STEP, currentMaxOffset))
  }

  const mobileNext = useCallback(() => setOffset((prev) => Math.min(prev + (isMobile ? 1 : STEP), currentMaxOffset)), [isMobile, currentMaxOffset])
  const mobilePrev = useCallback(() => setOffset((prev) => Math.max(prev - (isMobile ? 1 : STEP), 0)), [isMobile])
  const toursSwipe = useSwipe(mobileNext, mobilePrev)

  const features = [
    t("features.authentic"),
    t("features.professional"),
    t("features.flexibility"),
  ]

  const cardWidthPercent = isMobile ? 100 : 100 / VISIBLE
  const gapPx = isMobile ? 24 : 32

  return (
    <section className="flex flex-col items-center justify-center py-[40px] md:py-[64px] px-4 md:px-8 lg:px-[60px] xl:px-[100px] gap-6 md:gap-8">
      <div className="max-w-7xl mx-auto w-full flex flex-col items-center gap-5">
        <ExclusiveBadge />

        <h2 className="text-[28px] md:text-[36px] font-bold text-center text-[#222222] leading-normal pb-6">
          {t("title")}
        </h2>

        <div className="flex flex-col gap-6 md:gap-8 items-start w-full">
          <div className="flex flex-col gap-3 items-center w-full">
            <div className="text-center text-[#222222] text-md md:text-md xl:text-2xl max-w-[800px] leading-[1.3]">
              <span className="font-bold">
                {t("description.heading")}
              </span>
              <p className="font-bold mt-2 mb-0">
                {t("description.subheading")}
              </p>
              <span className="font-normal block mt-4">
                {t("description.body")}
              </span>
            </div>

            <div className="flex flex-col md:flex-row gap-3 md:gap-8 items-stretch md:items-center justify-start md:justify-center w-full mt-6 md:mt-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex gap-2 md:gap-4 items-center justify-start px-4 py-1.5 md:px-10 md:py-2 bg-[#d5f6ea] rounded-lg overflow-hidden w-full md:flex-1"
                >
                  <Sparkles className="size-4 md:size-6 text-[#008354] shrink-0" />
                  <p className="text-[#008354] text-sm md:text-lg font-normal leading-[1.2] min-h-0 md:min-h-[2.2em] line-clamp-2 text-left">
                    {feature}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6 md:gap-8 items-center w-full">
            <div className="w-full overflow-hidden touch-pan-y" {...toursSwipe}>
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  gap: `${gapPx}px`,
                  transform: `translateX(calc(-${offset} * (${cardWidthPercent}% - ${gapPx * ((isMobile ? mobileVisible : VISIBLE) - 1) / (isMobile ? mobileVisible : VISIBLE)}px + ${gapPx}px)))`,
                }}
              >
                {tours.map((tour) => (
                  <Link
                    key={tour.id}
                    href={`/tours/${tour.id}`}
                    className="shrink-0 h-[450px] md:h-[380px] xl:h-[480px] rounded-lg overflow-hidden relative cursor-pointer group"
                    style={{ width: `calc(${cardWidthPercent}% - ${gapPx * (isMobile ? 0 : (VISIBLE - 1)) / (isMobile ? 1 : VISIBLE)}px)` }}
                  >
                    <Image
                      src={tour.image}
                      alt={tour.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-[165px] bg-gradient-to-t from-black/70 to-transparent z-10" />
                    <div className="absolute bottom-6 left-4 flex gap-4 items-center z-10">
                      <span className="text-[32px] font-bold text-white leading-[1.2]">
                        {tour.name}
                      </span>
                      <div className="size-7 bg-white rounded-full flex items-center justify-center transition-colors group-hover:bg-[#27c7ff]">
                        <ArrowRight className="size-[18px] text-[#222222] transition-colors group-hover:text-white" />
                      </div>
                    </div>
                  </Link>
                ))}

                <Link
                  href="/tours?focus=search"
                  className="shrink-0 h-[450px] md:h-[380px] xl:h-[480px] rounded-lg overflow-hidden relative cursor-pointer group bg-gradient-to-br from-[#27c7ff] to-[#0e9fd8] flex flex-col items-center justify-center gap-6 px-8"
                  style={{ width: `calc(${cardWidthPercent}% - ${gapPx * (isMobile ? 0 : (VISIBLE - 1)) / (isMobile ? 1 : VISIBLE)}px)` }}
                >
                  <div className="size-[72px] rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <Search className="size-8 text-white" />
                  </div>
                  <span className="text-[28px] md:text-[32px] font-bold text-white leading-[1.2] text-center">
                    {t("exploreMore")}
                  </span>
                  <span className="text-[16px] md:text-[18px] text-white/80 text-center leading-[1.3]">
                    {t("exploreMoreSub")}
                  </span>
                  <div className="size-10 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ArrowUpRight className="size-5 text-[#27c7ff]" />
                  </div>
                </Link>
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
                aria-label={t("previousSlide")}
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
                disabled={offset >= currentMaxOffset}
                className={cn(
                  "size-[32px] rounded-full flex items-center justify-center transition-colors",
                  offset >= currentMaxOffset
                    ? "bg-[#ebebeb] cursor-not-allowed opacity-50"
                    : "bg-[#ebebeb] hover:bg-[#d5d5d5]"
                )}
                aria-label={t("nextSlide")}
              >
                <ChevronRight className="size-[15px] text-[#222222]" />
              </button>
            </div>

            <Link
              href="/tours"
              className="group flex items-center justify-between pl-8 pr-6 py-4 bg-[#27c7ff] rounded-2xl shadow-[0px_4px_8px_rgba(0,0,0,0.1),0px_18px_20px_rgba(0,0,0,0.05)] hover:bg-[#20b8ef] transition-colors"
            >
              <span className="text-[16px] font-bold text-white uppercase tracking-[0.16px]">
                {t("seeMore")}
              </span>
              <ArrowUpRight className="size-8 text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
