"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@workspace/ui/lib/utils"
import { type GooglePlaceValue } from "@/components/ui/google-places-input"
import { ToursSearchBar } from "@/components/tours/shared/tours-search-bar"

export function TourResultsHero() {
  const t = useTranslations("toursHero")
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isVisible, setIsVisible] = useState(false)
  const [placeValue, setPlaceValue] = useState<GooglePlaceValue>({
    location: searchParams.get("q") || "",
    placeId: null,
    lat: searchParams.get("lat") ? parseFloat(searchParams.get("lat")!) : null,
    lng: searchParams.get("lng") ? parseFloat(searchParams.get("lng")!) : null,
  })

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleSearch = (override?: GooglePlaceValue) => {
    const v = override ?? placeValue
    if (v.location.trim()) {
      const params = new URLSearchParams()
      params.set("q", v.location.trim())
      if (v.lat !== null && v.lng !== null) {
        params.set("lat", v.lat.toString())
        params.set("lng", v.lng.toString())
      }
      router.push(`/tours/results?${params.toString()}`)
    }
  }

  return (
    <section className="relative w-full h-[459px] md:h-[520px] lg:h-[520px] xl:h-[520px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/tours_hero.jpg')" }}
      />

      <div className="absolute inset-0 bg-black/20" />

      <div className="absolute top-0 left-0 right-0 h-[180px] md:h-[200px] lg:h-[240px] bg-gradient-to-b from-white via-white/80 via-50% to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 h-[80px] md:h-[100px] lg:h-[120px] bg-gradient-to-t from-white via-white/50 to-transparent" />

      <div className="relative z-10 h-full flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-[24px] w-full max-w-[395px] md:max-w-[640px]">
          <h1
            className={cn(
              "text-center text-white mix-blend-screen transition-all duration-700 ease-out font-bold",
              "text-[28px] md:text-[64px] leading-[1.2] md:leading-[1.1]",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            {t("searchResults")}
          </h1>

          <ToursSearchBar
            value={placeValue}
            onChange={setPlaceValue}
            onSearch={handleSearch}
            placeholder={t("searchPlaceholder")}
            className={cn(
              "transition-all duration-700 ease-out delay-150",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          />
        </div>
      </div>
    </section>
  )
}
