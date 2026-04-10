"use client"

import Image from "next/image"
import Link from "next/link"
import { Sparkles, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Search } from "lucide-react"
import { useState, useCallback, useEffect, useMemo } from "react"
import { useTranslations } from "next-intl"
import { cn } from "@workspace/ui/lib/utils"
import { ExclusiveBadge } from "@/components/landing/exclusive-badge"
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

  const next = useCallback(() => setOffset((prev) => Math.min(prev + STEP, currentMaxOffset)), [currentMaxOffset])
  const prev = useCallback(() => setOffset((prev) => Math.max(prev - STEP, 0)), [])

  const totalDots = useMemo(() => Math.ceil(currentMaxOffset / STEP) + 1, [currentMaxOffset])
  const currentDot = Math.min(Math.floor(offset / STEP), totalDots - 1)
  const goToDot = (index: number) => setOffset(Math.min(index * STEP, currentMaxOffset))

  const mobileNext = useCallback(() => setOffset((prev) => Math.min(prev + (isMobile ? 1 : STEP), currentMaxOffset)), [isMobile, currentMaxOffset])
  const mobilePrev = useCallback(() => setOffset((prev) => Math.max(prev - (isMobile ? 1 : STEP), 0)), [isMobile])
  const toursSwipe = useSwipe(mobileNext, mobilePrev)

  const features = [t("features.authentic"), t("features.professional"), t("features.flexibility")]

  const cardWidthPercent = isMobile ? 100 : 100 / VISIBLE
  const gapPx = isMobile ? 24 : 32

  return (
    <section
      data-theme-color="toursBg"
      className="flex flex-col items-center justify-center py-[40px] md:py-[64px] px-4 md:px-8 lg:px-[60px] xl:px-[100px] gap-6 md:gap-8"
      style={{ backgroundColor: "var(--theme-tours-bg, #ffffff)" }}
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col items-center gap-5">
        <ExclusiveBadge />

        <h2 data-theme-color="toursTitle" className="text-[28px] md:text-[36px] font-bold text-center leading-normal pb-6" style={{ color: "var(--theme-tours-title, #222222)" }}>
          {t("title")}
        </h2>

        <div className="flex flex-col gap-6 md:gap-8 items-start w-full">
          <div className="flex flex-col gap-3 items-center w-full">
            <div data-theme-color="toursDescription" className="text-center text-md md:text-md xl:text-2xl max-w-[800px] leading-[1.3]" style={{ color: "var(--theme-tours-description, #222222)" }}>
              <span className="font-bold">{t("description.heading")}</span>
              <p className="font-bold mt-2 mb-0">{t("description.subheading")}</p>
              <span className="font-normal block mt-4">{t("description.body")}</span>
            </div>

            <div className="flex flex-col md:flex-row gap-3 md:gap-8 items-stretch md:items-center justify-start md:justify-center w-full mt-6 md:mt-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  data-theme-color="toursFeatureBadgeBg"
                  className="flex gap-2 md:gap-4 items-center justify-start px-4 py-1.5 md:px-10 md:py-2 rounded-lg overflow-hidden w-full md:flex-1"
                  style={{ backgroundColor: "var(--theme-tours-feature-badge-bg, #d5f6ea)" }}
                >
                  <Sparkles data-theme-color="toursFeatureIcon" className="size-4 md:size-6 shrink-0" style={{ color: "var(--theme-tours-feature-icon, #008354)" }} />
                  <p data-theme-color="toursFeatureBadgeText" className="text-sm md:text-lg font-normal leading-[1.2] min-h-0 md:min-h-[2.2em] line-clamp-2 text-left" style={{ color: "var(--theme-tours-feature-badge-text, #008354)" }}>
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
                    data-theme-color="toursCardOverlay"
                    className="shrink-0 h-[450px] md:h-[380px] xl:h-[480px] rounded-lg overflow-hidden relative cursor-pointer group"
                    style={{ width: `calc(${cardWidthPercent}% - ${gapPx * (isMobile ? 0 : VISIBLE - 1) / (isMobile ? 1 : VISIBLE)}px)` }}
                  >
                    <Image src={tour.image} alt={tour.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
                    <div className="absolute bottom-0 left-0 right-0 h-[165px] z-10" style={{ background: "linear-gradient(to top, var(--theme-tours-card-overlay, rgba(0,0,0,0.7)), transparent)" }} />
                    <div className="absolute bottom-6 left-4 flex gap-4 items-center z-10">
                      <span data-theme-color="toursCardTitle" className="text-[32px] font-bold leading-[1.2]" style={{ color: "var(--theme-tours-card-title, #ffffff)" }}>
                        {tour.name}
                      </span>
                      <div
                        data-theme-color="toursCardArrowBg"
                        className="size-7 rounded-full flex items-center justify-center transition-colors"
                        style={{ backgroundColor: "var(--theme-tours-card-arrow-bg, #ffffff)" }}
                      >
                        <ArrowRight data-theme-color="toursCardArrowIcon" className="size-[18px]" style={{ color: "var(--theme-tours-card-arrow-icon, #222222)" }} />
                      </div>
                    </div>
                  </Link>
                ))}

                <Link
                  href="/tours?focus=search"
                  data-theme-color="toursExploreCardBgEnd"
                  className="shrink-0 h-[450px] md:h-[380px] xl:h-[480px] rounded-lg overflow-hidden relative cursor-pointer group flex flex-col items-center justify-center gap-6 px-8"
                  style={{
                    width: `calc(${cardWidthPercent}% - ${gapPx * (isMobile ? 0 : VISIBLE - 1) / (isMobile ? 1 : VISIBLE)}px)`,
                    backgroundImage: "linear-gradient(135deg, var(--theme-tours-explore-card-bg-start, #27c7ff), var(--theme-tours-explore-card-bg-end, #0e9fd8))",
                  }}
                >
                  <div data-theme-color="toursExploreCardBgStart" className="size-[72px] rounded-full bg-white/20 flex items-center justify-center transition-colors">
                    <Search data-theme-color="toursExploreCardText" className="size-8" style={{ color: "var(--theme-tours-explore-card-text, #ffffff)" }} />
                  </div>
                  <span data-theme-color="toursExploreCardText" className="text-[28px] md:text-[32px] font-bold leading-[1.2] text-center" style={{ color: "var(--theme-tours-explore-card-text, #ffffff)" }}>
                    {t("exploreMore")}
                  </span>
                  <span data-theme-color="toursExploreCardText" className="text-[16px] md:text-[18px] text-center leading-[1.3] opacity-80" style={{ color: "var(--theme-tours-explore-card-text, #ffffff)" }}>
                    {t("exploreMoreSub")}
                  </span>
                  <div data-theme-color="toursCardArrowBg" className="size-10 rounded-full flex items-center justify-center transition-transform" style={{ backgroundColor: "var(--theme-tours-card-arrow-bg, #ffffff)" }}>
                    <ArrowUpRight data-theme-color="toursCardArrowIcon" className="size-5" style={{ color: "var(--theme-tours-card-arrow-icon, #27c7ff)" }} />
                  </div>
                </Link>
              </div>
            </div>

            <div className="flex gap-[16px] items-center justify-center">
              <button
                onClick={prev}
                disabled={offset === 0}
                data-theme-color="toursNavButtonBg"
                className={cn("size-[32px] rounded-full flex items-center justify-center transition-colors", offset === 0 ? "cursor-not-allowed opacity-50" : "")}
                style={{ backgroundColor: "var(--theme-tours-nav-button-bg, #ebebeb)" }}
                aria-label={t("previousSlide")}
              >
                <ChevronLeft data-theme-color="toursNavButtonIcon" className="size-[15px]" style={{ color: "var(--theme-tours-nav-button-icon, #222222)" }} />
              </button>

              <div className="flex gap-[6.183px] items-center">
                {Array.from({ length: totalDots }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToDot(index)}
                    data-theme-color={index === currentDot ? "toursDotsActive" : "toursDotsInactive"}
                    className={cn("rounded-full transition-all", index === currentDot ? "size-[13.85px] border-[1.237px] bg-transparent" : "size-[9.893px]")}
                    style={
                      index === currentDot
                        ? { borderColor: "var(--theme-tours-dots-active, #27c7ff)" }
                        : { backgroundColor: "var(--theme-tours-dots-inactive, #27c7ff)" }
                    }
                    aria-label={t("goToSlide", { number: index + 1 })}
                  />
                ))}
              </div>

              <button
                onClick={next}
                disabled={offset >= currentMaxOffset}
                data-theme-color="toursNavButtonBg"
                className={cn("size-[32px] rounded-full flex items-center justify-center transition-colors", offset >= currentMaxOffset ? "cursor-not-allowed opacity-50" : "")}
                style={{ backgroundColor: "var(--theme-tours-nav-button-bg, #ebebeb)" }}
                aria-label={t("nextSlide")}
              >
                <ChevronRight data-theme-color="toursNavButtonIcon" className="size-[15px]" style={{ color: "var(--theme-tours-nav-button-icon, #222222)" }} />
              </button>
            </div>

            <Link
              href="/tours"
              data-theme-color="toursCtaBg"
              className="group flex items-center justify-between pl-8 pr-6 py-4 rounded-2xl shadow-[0px_4px_8px_rgba(0,0,0,0.1),0px_18px_20px_rgba(0,0,0,0.05)] transition-colors"
              style={{ backgroundColor: "var(--theme-tours-cta-bg, #27c7ff)" }}
            >
              <span data-theme-color="toursCtaText" className="text-[16px] font-bold uppercase tracking-[0.16px]" style={{ color: "var(--theme-tours-cta-text, #ffffff)" }}>
                {t("seeMore")}
              </span>
              <ArrowUpRight data-theme-color="toursCtaText" className="size-8 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ color: "var(--theme-tours-cta-text, #ffffff)" }} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
