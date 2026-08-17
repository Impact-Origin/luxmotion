"use client"

import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useUltraLuxuryTours, type TourData } from "@/hooks/use-tour-data"
import { UltraTourCard, type UltraTourCardData, type TourBadge } from "./tour-card"
import { DarkSelect } from "./dark-select"
import { RegionTabStrip, type RegionTab } from "./region-tab-strip"

const SERIF_FONT = "var(--font-title), 'Cormorant Garamond', serif"
const PAGE_SIZE = 6
const NEW_WINDOW_MS = 30 * 24 * 60 * 60 * 1000
const FALLBACK_IMAGE = "/mockups/picks/1.webp"

const TAB_KEYWORDS: Record<RegionTab, string[]> = {
  regions: [],
  tours: [],
  foodWine: ["food", "wine", "culinar", "gastronom", "dining", "cuisine", "gourmet"],
  riverCruises: ["river", "cruise", "yacht", "boat", "sail"],
  wellness: ["wellness", "spa", "retreat", "wellbeing", "yoga", "thermal", "relax"],
}

function matchesTab(tour: TourData, tab: RegionTab): boolean {
  const keywords = TAB_KEYWORDS[tab]
  if (keywords.length === 0) return true
  const haystack = [...(tour.tags ?? []), tour.tourTypeTag ?? ""].join(" ").toLowerCase()
  return keywords.some((k) => haystack.includes(k))
}

function resolveBadge(tour: TourData): TourBadge | null {
  if (tour.isBestSeller) return "bestseller"
  if (tour.isFeatured) return "signature"
  if (Date.now() - tour.createdAt < NEW_WINDOW_MS) return "new"
  return null
}

export function UltraLuxuryToursSection() {
  const t = useTranslations("ultraLuxuryTours.tours")
  const { tours: apiTours, isLoading } = useUltraLuxuryTours()

  const [activeTab, setActiveTab] = useState<RegionTab>("tours")
  const [location, setLocation] = useState("")
  const [sortBy, setSortBy] = useState("")

  const cards = useMemo<UltraTourCardData[]>(() => {
    return apiTours
      .filter((tour) => matchesTab(tour, activeTab))
      .map((tour) => {
      const pax =
        tour.maxPassengers != null
          ? `${tour.minPassengers ?? 1}–${tour.maxPassengers} ${t("paxSuffix")}`
          : tour.groupSize
      return {
        slug: tour.slug,
        image: tour.bannerImageUrl || FALLBACK_IMAGE,
        rating: tour.rating ?? 5,
        reviewCount: tour.reviewCount ?? 0,
        title: tour.title,
        location: tour.destination,
        duration: tour.duration,
        pax,
        price: tour.basePrice,
        badge: resolveBadge(tour),
      }
    })
  }, [apiTours, activeTab, t])

  const filtered = useMemo(() => {
    let result = [...cards]
    if (location) {
      result = result.filter((c) => c.location.toLowerCase() === location.toLowerCase())
    }
    if (sortBy === "price_low") result.sort((a, b) => a.price - b.price)
    else if (sortBy === "price_high") result.sort((a, b) => b.price - a.price)
    else if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating)
    return result
  }, [cards, location, sortBy])

  const visible = filtered.slice(0, PAGE_SIZE)

  const locationOptions = useMemo(() => {
    const unique = [...new Set(apiTours.map((tour) => tour.destination))].sort()
    return [
      { value: "", label: t("sortByLocation") },
      ...unique.map((d) => ({ value: d, label: d })),
    ]
  }, [apiTours, t])

  const sortOptions = [
    { value: "", label: t("sortLatest") },
    { value: "price_low", label: t("sortPriceLow") },
    { value: "price_high", label: t("sortPriceHigh") },
    { value: "rating", label: t("sortRating") },
  ]

  return (
    <>
      <RegionTabStrip active={activeTab} onChange={setActiveTab} />
      <section className="bg-[#0D0D0D] px-4 pt-10 pb-[60px] md:px-[82px] md:pb-16">
        <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-col items-center gap-2 pb-8 text-center">
          <h2 className="text-[48px] leading-[1.3] text-[#C9A96E]" style={{ fontFamily: SERIF_FONT }}>
            {t("heading")}
          </h2>
          <div className="flex max-w-[828px] flex-col gap-4 text-[18px] leading-[1.3] text-[#999]">
            <p>{t("description1")}</p>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between gap-4">
          <DarkSelect
            value={location}
            options={locationOptions}
            onChange={setLocation}
            placeholder={t("sortByLocation")}
          />
          <DarkSelect
            value={sortBy}
            options={sortOptions}
            onChange={setSortBy}
            placeholder={t("sortLatest")}
            align="right"
          />
        </div>

        {isLoading ? (
          <div className="mt-4 grid grid-cols-2 gap-[2px] md:grid-cols-3">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <div key={i} className="h-[440px] animate-pulse bg-[#1a1a1a]" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <p className="mt-16 text-center text-[18px] text-[#999]">{t("noResults")}</p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-[2px] md:grid-cols-3">
            {visible.map((tour) => (
              <UltraTourCard key={tour.slug} tour={tour} />
            ))}
          </div>
        )}

        {!isLoading && filtered.length > 0 && (
          <div className="mt-10 flex justify-center">
            <Link
              href="/ultra-luxury-tours/tours"
              className="flex h-[48px] items-center gap-2 bg-[#C9A96E] px-6 text-[14px] font-medium uppercase tracking-[1.1px] text-[#0d0d0d] transition-colors hover:bg-[#b89558]"
            >
              <span className="px-2">{t("seeMore")}</span>
              <ArrowRight className="size-4" strokeWidth={2} />
            </Link>
          </div>
        )}
        </div>
      </section>
    </>
  )
}
