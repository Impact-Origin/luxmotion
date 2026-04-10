"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { cn } from "@workspace/ui/lib/utils"
import { type GooglePlaceValue } from "@/components/ui/google-places-input"
import { ToursSearchBar } from "@/components/tours/shared/tours-search-bar"

interface DestinationHeroProps {
  destination: string
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function DestinationHero({ destination, searchQuery, onSearchChange }: DestinationHeroProps) {
  const t = useTranslations("toursHero")
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [placeValue, setPlaceValue] = useState<GooglePlaceValue>({
    location: searchQuery,
    placeId: null,
    lat: null,
    lng: null,
  })

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handlePlaceChange = (value: GooglePlaceValue) => {
    setPlaceValue(value)
    onSearchChange(value.location)
  }

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
    <section className="relative w-full h-[459px] md:h-[520px] lg:h-[600px] xl:h-[690px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/tours_destination_hero.jpg')" }}
      />

      <div className="absolute inset-0 bg-black/20" />

      <div className="absolute top-0 left-0 right-0 h-[180px] md:h-[200px] lg:h-[240px] bg-gradient-to-b from-white via-white/80 via-50% to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 h-[140px] md:h-[160px] lg:h-[200px] bg-gradient-to-t from-white via-white/70 to-transparent" />

      <div className="relative z-10 h-full flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-[16px] w-full max-w-[395px] md:max-w-[777px]">
          <h1
            className={cn(
              "text-center text-white mix-blend-screen transition-all duration-700 ease-out",
              "text-[40px] md:text-[72px] leading-[1.3] md:leading-[72px] font-extrabold",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            {destination}
          </h1>

          <ToursSearchBar
            value={placeValue}
            onChange={handlePlaceChange}
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
