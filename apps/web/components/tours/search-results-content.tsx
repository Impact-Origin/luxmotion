"use client"

import { useMemo } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { useQuery } from "convex/react"
import { api } from "@workspace/convex/api"
import { TourCard, TourData } from "@/components/tours/shared/tour-card"
import { usePublishedTours, type TourData as ApiTourData } from "@/hooks/use-tour-data"
import { textMatchesSearch } from "@/lib/search"

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
  const searchParams = useSearchParams()
  const { tours: apiTours, isLoading } = usePublishedTours()
  const searchLat = searchParams.get("lat") ? parseFloat(searchParams.get("lat")!) : null
  const searchLng = searchParams.get("lng") ? parseFloat(searchParams.get("lng")!) : null
  const hasGeoSearch = searchLat !== null && searchLng !== null

  const nearbyToursRaw = useQuery(
    api.tours.listNearCoordinates,
    hasGeoSearch ? { lat: searchLat!, lng: searchLng!, radiusKm: 80 } : "skip"
  )
  const isLoadingNearby = hasGeoSearch && nearbyToursRaw === undefined

  const filteredTours = useMemo(() => {
    const all = apiTours.map(mapTourToCardData)
    if (!searchQuery.trim()) return all

    if (nearbyToursRaw && nearbyToursRaw.length > 0) {
      return nearbyToursRaw.map((tour: any) => mapTourToCardData(tour))
    }

    return all.filter((tour) =>
      textMatchesSearch(searchQuery, [
        tour.title,
        tour.location,
        tour.duration,
        tour.category,
      ])
    )
  }, [apiTours, nearbyToursRaw, searchQuery])

  if (isLoading || isLoadingNearby) {
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
    <div className="overflow-hidden bg-[#1a1a1a] px-4 md:px-[82px] py-[60px] md:py-[72px]">
      <div className="max-w-[1280px] mx-auto flex min-w-0 flex-col gap-[24px]">
        <h2
          className="min-w-0 max-w-full break-words text-[32px] md:text-[48px] leading-[1.1] text-[#f5f5f5]"
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
          <div className="flex flex-col items-center py-[60px] text-center">
            <p className="text-[18px] text-[#999]">{t("noResultsFound")}</p>
            <p className="text-[14px] text-[#666] mt-2">{t("tryDifferent")}</p>
            <Link
              href="/tours/results"
              className="mt-6 inline-flex h-12 items-center justify-center border border-[#C9A96E] bg-[#C9A96E] px-6 text-[12px] font-semibold uppercase tracking-[1.2px] text-[#0D0D0D] transition-colors hover:bg-[#b8954f]"
            >
              {t("allTours")}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
