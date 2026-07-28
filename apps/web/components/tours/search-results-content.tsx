"use client"

import { useMemo } from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { TourCard, TourData } from "@/components/tours/shared/tour-card"
import { usePublishedTours, type TourData as ApiTourData } from "@/hooks/use-tour-data"

function mapTourToCardData(tour: ApiTourData): TourData {
  const originalPrice = tour.originalPrice ?? tour.basePrice
  const discountedPrice = tour.basePrice
  const savings = originalPrice > discountedPrice ? originalPrice - discountedPrice : 0

  return {
    id: tour.slug,
    image: tour.bannerImageUrl || "/mockup_tour_picks/1.webp",
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

interface SearchResultsContentProps {
  searchQuery: string
}

export function SearchResultsContent({ searchQuery }: SearchResultsContentProps) {
  const t = useTranslations("toursHero")
  const { tours: apiTours, isLoading } = usePublishedTours()

  const filteredTours = useMemo(() => {
    const all = apiTours.map(mapTourToCardData)
    const q = searchQuery.trim().toLowerCase()
    if (!q) return all
    return all.filter(
      (tour) =>
        tour.title.toLowerCase().includes(q) ||
        tour.location.toLowerCase().includes(q) ||
        tour.duration.toLowerCase().includes(q)
    )
  }, [apiTours, searchQuery])

  if (isLoading) {
    return (
      <div className="bg-[#1a1a1a] px-4 md:px-[82px] py-[60px] md:py-[72px]">
        <div className="max-w-[1280px] mx-auto flex flex-col gap-6">
          <div className="h-[48px] w-[360px] bg-[rgba(255,255,255,0.06)] animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-[2px]">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[424px] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#1a1a1a] px-4 md:px-[82px] py-[60px] md:py-[72px]">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-[24px]">
        <h2
          className="text-[32px] md:text-[48px] leading-[1.1] text-[#f5f5f5]"
          style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif" }}
        >
          {searchQuery ? (
            <>
              <span>{t("resultsFor")} </span>
              <span className="italic text-[#c9a96e]">&ldquo;{searchQuery}&rdquo;</span>
            </>
          ) : (
            <span>{t("allTours")}</span>
          )}
        </h2>

        {filteredTours.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-[2px]">
            {filteredTours.map((tour) => (
              <Link key={tour.id} href={`/tours/tour/${tour.id}`} className="flex">
                <TourCard tour={tour} className="w-full" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-[60px] text-center">
            <p className="text-[18px] text-[#999]">{t("noResultsFound")}</p>
            <p className="text-[14px] text-[#666] mt-2">{t("tryDifferent")}</p>
          </div>
        )}
      </div>
    </div>
  )
}
