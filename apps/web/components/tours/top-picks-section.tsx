"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@workspace/ui/lib/utils"
import { TourCard, TourData } from "./shared/tour-card"
import { useFeaturedTours, type TourData as ApiTourData } from "@/hooks/use-tour-data"

function mapTourToCardData(tour: ApiTourData): TourData {
  const originalPrice = tour.originalPrice ?? tour.basePrice
  const discountedPrice = tour.basePrice
  const savings = originalPrice > discountedPrice ? originalPrice - discountedPrice : 0

  return {
    id: tour.slug,
    image: tour.bannerImageUrl || "/mockup_tour_picks/1.jpg",
    rating: tour.rating ?? 4.5,
    reviewCount: tour.reviewCount ?? 0,
    title: tour.title,
    location: tour.destination,
    duration: tour.duration,
    originalPrice,
    discountedPrice,
    savings,
    isBestSeller: tour.isBestSeller,
    category: tour.category,
  }
}

interface ArrowButtonProps {
  direction: "left" | "right"
  onClick: () => void
  disabled?: boolean
}

function ArrowButton({ direction, onClick, disabled }: ArrowButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "size-[32px] rounded-full flex items-center justify-center transition-colors",
        disabled
          ? "bg-[#ebebeb] cursor-not-allowed opacity-50"
          : "bg-[#ebebeb] hover:bg-[#d5d5d5]"
      )}
      aria-label={direction === "left" ? "Previous" : "Next"}
    >
      {direction === "left" ? (
        <ChevronLeft className="size-[15px] text-[#222222]" />
      ) : (
        <ChevronRight className="size-[15px] text-[#222222]" />
      )}
    </button>
  )
}

export function TopPicksSection() {
  const t = useTranslations("topPicks")
  const { tours: apiTours, isLoading } = useFeaturedTours(6)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [visibleCards, setVisibleCards] = useState(6)

  const tourPicks = useMemo(() => {
    return apiTours.map(mapTourToCardData)
  }, [apiTours])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCards(4)
      } else {
        setVisibleCards(6)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const maxSlide = Math.max(0, Math.ceil(tourPicks.length / visibleCards) - 1)
  const showNavigation = tourPicks.length > visibleCards

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.min(prev + 1, maxSlide))
  }, [maxSlide])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0))
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(Math.min(index, maxSlide))
  }

  if (isLoading) {
    return (
      <section className="bg-white px-4 md:px-5 lg:px-6 xl:px-8 pt-[28px] pb-[20px] md:pt-[40px] md:pb-[60px]">
        <div className="max-w-7xl mx-auto flex flex-col gap-[20px] md:gap-[24px]">
          <div className="h-[32px] w-[300px] bg-gray-200 rounded animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-[16px] md:gap-[24px]">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[360px] md:h-[560px] bg-gray-200 rounded-[16px] animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (tourPicks.length === 0) {
    return null
  }

  return (
    <section className="bg-white px-4 md:px-5 lg:px-6 xl:px-8 pt-[28px] pb-[20px] md:pt-[40px] md:pb-[60px]">
      <div className="max-w-7xl mx-auto flex flex-col gap-[20px] md:gap-[24px]">
        <div className="flex items-start md:items-center justify-between">
          <h2 className="text-[24px] md:text-[32px] font-bold leading-[1.3] text-[#070d0f]">
            <span className="font-extrabold italic text-[#222222]">
              {t("titlePart1")}
            </span>
            {", "}
            <br className="md:hidden" />
            <span className="text-[#27c7ff]">{t("titlePart2")}</span>
          </h2>

          {showNavigation && (
            <div className="hidden md:flex gap-[8.842px] items-center shrink-0 ml-4">
              <ArrowButton
                direction="left"
                onClick={prevSlide}
                disabled={currentSlide === 0}
              />
              <ArrowButton
                direction="right"
                onClick={nextSlide}
                disabled={currentSlide >= maxSlide}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-[24px] items-center">
          <div className="hidden md:grid grid-cols-3 gap-[24px] w-full">
            {tourPicks.map((tour) => (
              <Link key={tour.id} href={`/tours/tour/${tour.id}`}>
                <TourCard tour={tour} variant="desktop" />
              </Link>
            ))}
          </div>

          <div className="md:hidden w-full">
            <div className="grid grid-cols-2 gap-[16px]">
              {tourPicks.slice(0, 4).map((tour) => (
                <Link key={tour.id} href={`/tours/tour/${tour.id}`}>
                  <TourCard tour={tour} variant="mobile" />
                </Link>
              ))}
            </div>
          </div>

          {showNavigation && (
            <div className="hidden md:flex gap-[6.183px] items-center">
              {Array.from({ length: maxSlide + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={cn(
                    "rounded-full transition-all",
                    index === currentSlide
                      ? "size-[13.85px] border-[1.237px] border-[#27c7ff] bg-transparent"
                      : "size-[9.893px] bg-[#27c7ff]"
                  )}
                  aria-label={t("goToSlide", { number: index + 1 })}
                />
              ))}
            </div>
          )}

          <Link
            href="/tours/results"
            className="bg-white border border-[#dedede] rounded-[99px] px-[17px] py-[13px] hover:bg-gray-50 transition-colors"
          >
            <span className="text-[14.8px] text-[#222]">{t("showMore")}</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
