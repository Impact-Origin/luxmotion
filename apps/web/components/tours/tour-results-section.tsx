"use client"

import { useState, useMemo, useEffect } from "react"
import { Link } from "@/i18n/navigation"
import { MapPin, ArrowDownUp, ChevronDown, Plus, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "@workspace/convex/api"
import { cn } from "@workspace/ui/lib/utils"
import { TourCard, TourData } from "./shared/tour-card"
import { usePublishedTours, useDestinations, type TourData as ApiTourData } from "@/hooks/use-tour-data"

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

const fallbackTours: TourData[] = []

interface FilterDropdownProps {
  icon: React.ReactNode
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
  onClear?: () => void
}

function FilterDropdown({ icon, label, value, options, onChange, onClear }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-[8px] px-[8px] py-[12px] rounded-[6px] transition-all duration-200",
          value ? "bg-[#27c7ff]/10" : "hover:bg-gray-50"
        )}
      >
        <div className="flex items-center gap-[8px]">
          {icon}
          <span className={cn(
            "text-[14px] md:text-[16px] transition-colors duration-200",
            value ? "text-[#222]" : "text-[#a2a2a2]"
          )}>
            {value || label}
          </span>
        </div>
        {value && onClear ? (
          <span
            role="button"
            onClick={(e) => {
              e.stopPropagation()
              onClear()
            }}
            className="size-[20px] rounded-full bg-[#808080] hover:bg-[#666] flex items-center justify-center transition-colors duration-200 cursor-pointer"
          >
            <X className="size-[12px] text-white" />
          </span>
        ) : (
          <ChevronDown className={cn(
            "size-[24px] text-[#bfbfbf] transition-transform duration-200",
            isOpen && "rotate-180"
          )} />
        )}
      </button>

      <div className={cn(
        "absolute top-full left-0 mt-[4px] bg-white border border-[#e8e8e8] rounded-[8px] shadow-lg z-20 min-w-[180px] overflow-hidden",
        "transition-all duration-200 origin-top",
        isOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0 pointer-events-none"
      )}>
        <button
          onClick={() => {
            onChange("")
            setIsOpen(false)
          }}
          className="w-full text-left px-[16px] py-[12px] text-[14px] text-[#a2a2a2] hover:bg-gray-50 transition-colors duration-150"
        >
          {label}
        </button>
        {options.map((option) => (
          <button
            key={option}
            onClick={() => {
              onChange(option)
              setIsOpen(false)
            }}
            className={cn(
              "w-full text-left px-[16px] py-[12px] text-[14px] transition-colors duration-150",
              value === option ? "bg-[#27c7ff]/10 text-[#27c7ff]" : "text-[#222] hover:bg-gray-50"
            )}
          >
            {option}
          </button>
        ))}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

interface TourResultsSectionProps {
  searchQuery?: string
}

export function TourResultsSection({ searchQuery: initialQuery }: TourResultsSectionProps) {
  const t = useTranslations("tourResults")
  const router = useRouter()
  const searchParams = useSearchParams()

  const destinationParam = searchParams.get("destination") || ""
  const [locationFilter, setLocationFilter] = useState(destinationParam)
  const [categoryFilter, setCategoryFilter] = useState("")
  const [sortBy, setSortBy] = useState("")
  const [visibleCount, setVisibleCount] = useState(6)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [animateCards, setAnimateCards] = useState(false)

  const searchQuery = searchParams.get("q") || initialQuery || ""
  const searchLat = searchParams.get("lat") ? parseFloat(searchParams.get("lat")!) : null
  const searchLng = searchParams.get("lng") ? parseFloat(searchParams.get("lng")!) : null
  const hasGeoSearch = searchLat !== null && searchLng !== null

  const { tours: apiTours, isLoading: isLoadingTours } = usePublishedTours()
  const { destinations: apiDestinations } = useDestinations()

  const nearbyToursRaw = useQuery(
    api.tours.listNearCoordinates,
    hasGeoSearch ? { lat: searchLat!, lng: searchLng! } : "skip"
  )
  const isLoadingNearby = hasGeoSearch && nearbyToursRaw === undefined

  const allTours = useMemo(() => {
    if (apiTours.length > 0) {
      return apiTours.map(mapTourToCardData)
    }
    return fallbackTours
  }, [apiTours])

  const nearbyTours = useMemo(() => {
    if (!nearbyToursRaw) return []
    return nearbyToursRaw.map((tour: any) => mapTourToCardData(tour))
  }, [nearbyToursRaw])

  useEffect(() => {
    if (destinationParam && destinationParam !== locationFilter) {
      setLocationFilter(destinationParam)
    }
  }, [destinationParam])

  useEffect(() => {
    setAnimateCards(false)
    const timer = setTimeout(() => setAnimateCards(true), 50)
    return () => clearTimeout(timer)
  }, [searchQuery, searchLat, searchLng, locationFilter, categoryFilter, sortBy])

  const locations = useMemo(() => {
    if (apiDestinations.length > 0) {
      return apiDestinations.sort()
    }
    const uniqueLocations = [...new Set(allTours.map(tour => tour.location))]
    return uniqueLocations.sort()
  }, [apiDestinations, allTours])

  const categories = useMemo(() => {
    return ["tours", "experiences", "private"]
  }, [])

  const categoryLabels: Record<string, string> = {
    tours: t("categoryTours"),
    experiences: t("categoryExperiences"),
    private: t("categoryPrivate"),
  }

  const filteredTours = useMemo(() => {
    let results: TourData[] = [...allTours]

    if (hasGeoSearch && nearbyTours.length > 0) {
      results = [...nearbyTours]
    } else if (hasGeoSearch && nearbyTours.length === 0 && !isLoadingNearby && searchQuery) {
      const query = searchQuery.toLowerCase()
      results = results.filter(
        tour =>
          tour.title.toLowerCase().includes(query) ||
          tour.location.toLowerCase().includes(query) ||
          tour.duration.toLowerCase().includes(query)
      )
    } else if (searchQuery) {
      const query = searchQuery.toLowerCase()

      results = results.filter(
        tour =>
          tour.title.toLowerCase().includes(query) ||
          tour.location.toLowerCase().includes(query) ||
          tour.duration.toLowerCase().includes(query)
      )

      results.sort((a, b) => {
        const aLocationMatch = a.location.toLowerCase().includes(query)
        const bLocationMatch = b.location.toLowerCase().includes(query)

        if (aLocationMatch && !bLocationMatch) return -1
        if (!aLocationMatch && bLocationMatch) return 1

        const aExactLocationMatch = a.location.toLowerCase() === query
        const bExactLocationMatch = b.location.toLowerCase() === query

        if (aExactLocationMatch && !bExactLocationMatch) return -1
        if (!aExactLocationMatch && bExactLocationMatch) return 1

        return 0
      })
    }

    if (locationFilter) {
      results = results.filter(tour =>
        tour.location.toLowerCase() === locationFilter.toLowerCase()
      )
    }

    if (categoryFilter) {
      results = results.filter(tour => tour.category === categoryFilter)
    }

    if (sortBy === "price_low") {
      results.sort((a, b) => a.discountedPrice - b.discountedPrice)
    } else if (sortBy === "price_high") {
      results.sort((a, b) => b.discountedPrice - a.discountedPrice)
    } else if (sortBy === "rating") {
      results.sort((a, b) => b.rating - a.rating)
    }

    return results
  }, [allTours, nearbyTours, hasGeoSearch, isLoadingNearby, searchQuery, locationFilter, categoryFilter, sortBy])

  const visibleTours = filteredTours.slice(0, visibleCount)
  const hasMore = visibleCount < filteredTours.length

  const handleLoadMore = () => {
    setIsLoadingMore(true)
    setTimeout(() => {
      setVisibleCount(prev => prev + 6)
      setIsLoadingMore(false)
    }, 300)
  }

  const handleClearSearch = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("q")
    params.delete("lat")
    params.delete("lng")
    router.push(`/tours/results${params.toString() ? `?${params.toString()}` : ""}`)
  }

  const handleClearDestination = () => {
    setLocationFilter("")
    const params = new URLSearchParams(searchParams.toString())
    params.delete("destination")
    router.push(`/tours/results${params.toString() ? `?${params.toString()}` : ""}`)
  }

  if (isLoadingTours || isLoadingNearby) {
    return (
      <section className="bg-white px-4 md:px-5 lg:px-6 xl:px-8 pt-[24px] pb-[62px]">
        <div className="max-w-7xl mx-auto flex flex-col gap-[32px]">
          <div className="h-[32px] w-[200px] bg-gray-200 rounded animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-[16px] md:gap-[24px]">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[480px] md:h-[560px] bg-gray-200 rounded-[16px] animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-white px-4 md:px-5 lg:px-6 xl:px-8 pt-[24px] pb-[62px]">
      <div className="max-w-7xl mx-auto flex flex-col gap-[32px]">
        <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-[16px]">
          <div className="flex items-baseline gap-[8px] shrink-0">
            <h2 className="text-[24px] md:text-[32px] font-bold text-[#222]">
              {t("title")}
            </h2>
            <p className={cn(
              "text-[16px] text-[#808080] transition-all duration-300",
              animateCards ? "opacity-100" : "opacity-0"
            )}>
              {t("itemsFound", { count: filteredTours.length })}
            </p>
          </div>

          <div className="flex items-center gap-[8px] flex-wrap">
            {searchQuery && (
              <div className={cn(
                "flex items-center gap-[8px] px-[12px] py-[12px] bg-[#27c7ff]/10 rounded-[6px] transition-all duration-200 max-w-[280px] shrink-0",
                animateCards ? "opacity-100 scale-100" : "opacity-0 scale-95"
              )}>
                <span className="text-[14px] md:text-[16px] text-[#222] truncate">"{searchQuery}"</span>
                <button
                  onClick={handleClearSearch}
                  className="size-[20px] rounded-full bg-[#808080] hover:bg-[#666] flex items-center justify-center transition-colors duration-200 shrink-0"
                >
                  <X className="size-[12px] text-white" />
                </button>
              </div>
            )}
            <FilterDropdown
              icon={<MapPin className={cn(
                "size-[24px] transition-colors duration-200",
                locationFilter ? "text-[#27c7ff]" : "text-[#a2a2a2]"
              )} />}
              label={t("filterByLocation")}
              value={locationFilter}
              options={locations}
              onChange={setLocationFilter}
              onClear={locationFilter ? () => setLocationFilter("") : undefined}
            />
            <FilterDropdown
              icon={<ArrowDownUp className={cn(
                "size-[24px] transition-colors duration-200",
                categoryFilter ? "text-[#27c7ff]" : "text-[#a2a2a2]"
              )} />}
              label={t("filterByCategory")}
              value={categoryFilter && categoryLabels[categoryFilter] ? categoryLabels[categoryFilter] : ""}
              options={categories.map(c => categoryLabels[c]).filter((v): v is string => v !== undefined)}
              onChange={(val) => {
                const key = Object.entries(categoryLabels).find(([, v]) => v === val)?.[0] || ""
                setCategoryFilter(key)
              }}
              onClear={categoryFilter ? () => setCategoryFilter("") : undefined}
            />
            <FilterDropdown
              icon={<ArrowDownUp className="size-[24px] text-[#27c7ff]" />}
              label={t("sortBy")}
              value={sortBy === "price_low" ? t("priceLow") : sortBy === "price_high" ? t("priceHigh") : sortBy === "rating" ? t("rating") : ""}
              options={[t("priceLow"), t("priceHigh"), t("rating")]}
              onChange={(val) => {
                if (val === t("priceLow")) setSortBy("price_low")
                else if (val === t("priceHigh")) setSortBy("price_high")
                else if (val === t("rating")) setSortBy("rating")
                else setSortBy("")
              }}
              onClear={sortBy ? () => setSortBy("") : undefined}
            />
          </div>
        </div>

        <div className="flex flex-col gap-[24px]">
          {visibleTours.length === 0 ? (
            <div className={cn(
              "flex flex-col items-center justify-center py-[60px] text-center transition-all duration-300",
              animateCards ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}>
              <p className="text-[18px] text-[#808080]">{t("noResults")}</p>
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="mt-[16px] text-[16px] text-[#27c7ff] hover:underline"
                >
                  {t("clearSearch")}
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="hidden md:grid grid-cols-3 gap-[24px]">
                {visibleTours.map((tour, index) => (
                  <div
                    key={tour.id}
                    className={cn(
                      "transition-all duration-300 ease-out",
                      animateCards
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    )}
                    style={{
                      transitionDelay: animateCards ? `${index * 50}ms` : "0ms"
                    }}
                  >
                    <Link href={`/tours/tour/${tour.id}`}>
                      <TourCard tour={tour} />
                    </Link>
                  </div>
                ))}
              </div>

              <div className="md:hidden grid grid-cols-2 gap-[16px]">
                {visibleTours.map((tour, index) => (
                  <div
                    key={tour.id}
                    className={cn(
                      "transition-all duration-300 ease-out",
                      animateCards
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    )}
                    style={{
                      transitionDelay: animateCards ? `${index * 50}ms` : "0ms"
                    }}
                  >
                    <Link href={`/tours/tour/${tour.id}`}>
                      <TourCard tour={tour} />
                    </Link>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {hasMore && (
          <div className={cn(
            "flex justify-center transition-all duration-300",
            animateCards ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
          style={{ transitionDelay: animateCards ? `${visibleTours.length * 50}ms` : "0ms" }}
          >
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className={cn(
                "bg-[#27c7ff] text-white h-[56px] px-[32px] pr-[24px] rounded-[16px] flex items-center justify-between gap-[16px] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.1),0px_18px_20px_0px_rgba(0,0,0,0.05)] transition-all duration-200",
                isLoadingMore ? "opacity-70 cursor-wait" : "hover:brightness-95 hover:scale-[1.02] active:scale-[0.98]"
              )}
            >
              <span className="text-[16px] font-bold uppercase tracking-[0.16px]">
                {t("loadMore")}
              </span>
              <Plus className={cn(
                "size-[32px] transition-transform duration-300",
                isLoadingMore && "animate-spin"
              )} />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
