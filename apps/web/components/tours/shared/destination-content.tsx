"use client"

import { useMemo } from "react"
import { CategorySection } from "./category-section"
import { TourCard, TourData } from "./tour-card"
import { useToursByDestination, type TourData as ApiTourData } from "@/hooks/use-tour-data"

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

interface DestinationContentProps {
  destination: string
  searchQuery: string
}

export function DestinationContent({ destination, searchQuery }: DestinationContentProps) {
  const { tours: apiTours, isLoading } = useToursByDestination(destination)

  const allTours = useMemo(() => {
    return apiTours.map(mapTourToCardData)
  }, [apiTours])

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
      <div className="bg-white px-4 md:px-5 lg:px-6 xl:px-8 py-[50px] md:py-[60px]">
        <div className="max-w-7xl mx-auto flex flex-col gap-[50px] md:gap-[60px]">
          <div className="flex flex-col gap-[24px]">
            <div className="h-[32px] w-[300px] bg-gray-200 rounded animate-pulse" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-[16px] md:gap-[24px]">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-[480px] md:h-[560px] bg-gray-200 rounded-[16px] animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!hasAnyResults && !searchQuery) {
    return (
      <div className="bg-white px-4 md:px-5 lg:px-6 xl:px-8 py-[50px] md:py-[60px]">
        <div className="max-w-7xl mx-auto">
          <div className="py-[60px] text-center">
            <p className="text-[18px] text-[#808080]">
              No tours available in <span className="font-medium text-[#222]">{destination}</span> yet
            </p>
            <p className="text-[14px] text-[#a0a0a0] mt-[8px]">
              Check back later for new tours and experiences
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white px-4 md:px-5 lg:px-6 xl:px-8 py-[50px] md:py-[60px]">
      <div className="max-w-7xl mx-auto flex flex-col gap-[50px] md:gap-[60px]">
        {hasAnyResults ? (
          <>
            {topTours.length > 0 && (
              <CategorySection
                title="Top Tours"
                titleHighlight="from"
                destination={destination}
                tours={topTours}
                searchQuery={searchQuery}
              />
            )}

            {experiences.length > 0 && (
              <CategorySection
                title="Experiences"
                titleHighlight="in"
                destination={destination}
                tours={experiences}
                searchQuery={searchQuery}
              />
            )}

            {privateTours.length > 0 && (
              <CategorySection
                title="Private Tours"
                titleHighlight="from"
                destination={destination}
                tours={privateTours}
                searchQuery={searchQuery}
              />
            )}
          </>
        ) : (
          <div className="py-[60px] text-center">
            <p className="text-[18px] text-[#808080]">
              No results found for "<span className="font-medium text-[#222]">{searchQuery}</span>"
            </p>
            <p className="text-[14px] text-[#a0a0a0] mt-[8px]">
              Try searching for a different tour or experience
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
