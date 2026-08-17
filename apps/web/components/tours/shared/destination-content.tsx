"use client"

import { useMemo } from "react"
import { useTranslations } from "next-intl"
import { CategorySection } from "./category-section"
import { TourCard, TourData } from "./tour-card"
import { useToursByDestination, type TourData as ApiTourData } from "@/hooks/use-tour-data"

function mapTourToCardData(tour: ApiTourData): TourData {
  const originalPrice = tour.originalPrice ?? tour.basePrice
  const discountedPrice = tour.basePrice
  const savings = originalPrice > discountedPrice ? originalPrice - discountedPrice : 0

  return {
    id: tour.slug,
    image: tour.bannerImageUrl || "/mockups/picks/1.webp",
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

interface DestinationContentProps {
  destination: string
  searchQuery: string
}

export function DestinationContent({ destination, searchQuery }: DestinationContentProps) {
  const { tours: apiTours, isLoading } = useToursByDestination(destination)

  const allTours = useMemo(() => {
    return apiTours.map(mapTourToCardData)
  }, [apiTours])

  const t = useTranslations("destinationPage")

  const filteredTours = useMemo(() => {
    if (!searchQuery.trim()) return allTours
    const query = searchQuery.toLowerCase()
    return allTours.filter(
      (tour) =>
        tour.title.toLowerCase().includes(query) ||
        tour.location.toLowerCase().includes(query) ||
        tour.duration.toLowerCase().includes(query)
    )
  }, [allTours, searchQuery])

  const topTours = useMemo(() => filteredTours.filter(t => t.category === "tours"), [filteredTours])
  const experiences = useMemo(() => filteredTours.filter(t => t.category === "experiences"), [filteredTours])
  const privateTours = useMemo(() => filteredTours.filter(t => t.category === "private"), [filteredTours])

  const hasAnyResults = filteredTours.length > 0

  if (isLoading) {
    return (
      <div className="bg-[var(--lm-surface,#1a1a1a)] px-4 md:px-[82px] py-[60px] md:py-[72px]">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-[60px]">
          <div className="flex flex-col gap-6">
            <div className="h-[48px] w-[360px] bg-[rgba(var(--lm-text-rgb,255,255,255),0.06)] animate-pulse" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-[2px]">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-[424px] bg-[rgba(var(--lm-text-rgb,255,255,255),0.04)] border border-[rgba(var(--lm-text-rgb,255,255,255),0.08)] animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!hasAnyResults && !searchQuery) {
    return (
      <div className="bg-[var(--lm-surface,#1a1a1a)] px-4 md:px-[82px] py-[60px] md:py-[72px]">
        <div className="max-w-[1280px] mx-auto py-[60px] text-center">
          <p className="text-[18px] text-[var(--lm-muted,#999)]">
            {t("emptyTitle", { destination })}
          </p>
          <p className="text-[14px] text-[var(--lm-muted,#666)] mt-2">
            {t("emptySubtitle")}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[var(--lm-surface,#1a1a1a)] px-4 md:px-[82px] py-[60px] md:py-[72px]">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-[60px] md:gap-[80px]">
        {hasAnyResults ? (
          <>
            {topTours.length > 0 && (
              <CategorySection
                title={t("topTours")}
                destination={destination}
                tours={topTours}
                searchQuery={searchQuery}
              />
            )}

            {experiences.length > 0 && (
              <CategorySection
                title={t("experiences")}
                destination={destination}
                tours={experiences}
                searchQuery={searchQuery}
              />
            )}

            {privateTours.length > 0 && (
              <CategorySection
                title={t("luxuryTours")}
                destination={destination}
                tours={privateTours}
                searchQuery={searchQuery}
              />
            )}
          </>
        ) : (
          <div className="py-[60px] text-center">
            <p className="text-[18px] text-[var(--lm-muted,#999)]">
              {t("noSearchResults", { query: searchQuery })}
            </p>
            <p className="text-[14px] text-[var(--lm-muted,#666)] mt-2">
              {t("noSearchResultsHint")}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
