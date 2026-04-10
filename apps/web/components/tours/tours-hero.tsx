"use client"

import { useEffect, useState } from "react"
import { ShieldCheck, BadgeEuro, MapPinned, UserRoundCheck, LucideIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@workspace/ui/lib/utils"
import { type GooglePlaceValue } from "@/components/ui/google-places-input"
import { ToursSearchBar } from "@/components/tours/shared/tours-search-bar"

const FEATURE_BADGES = [
  { icon: ShieldCheck, key: "safe", order: { desktop: 0, mobile: 0 } },
  { icon: BadgeEuro, key: "bestPrice", order: { desktop: 1, mobile: 2 } },
  { icon: MapPinned, key: "authenticExperiences", order: { desktop: 2, mobile: 1 } },
  { icon: UserRoundCheck, key: "expertGuides", order: { desktop: 3, mobile: 3 } },
] as const

interface FeatureBadgeProps {
  icon: LucideIcon
  label: string
  variant?: "default" | "mobile"
  className?: string
}

function FeatureBadge({ icon: Icon, label, variant = "default", className }: FeatureBadgeProps) {
  const isMobile = variant === "mobile"
  return (
    <div
      className={cn(
        "flex items-center bg-white rounded-full shadow-[0px_4px_4px_0px_rgba(97,236,154,0.2)]",
        isMobile
          ? "gap-1.5 pl-1.5 pr-2.5 py-1.5"
          : "gap-[8px] pl-[8px] pr-[16px] py-[9px]",
        className
      )}
    >
      <Icon
        className={cn("shrink-0 text-[#27C7FF]", isMobile ? "w-3.5 h-3.5" : "w-[20px] h-[20px]")}
      />
      <span
        className={cn(
          "text-[#0e4659] font-normal leading-none whitespace-nowrap",
          isMobile ? "text-[11px]" : "text-[16px]"
        )}
      >
        {label}
      </span>
    </div>
  )
}

export function ToursHero() {
  const t = useTranslations("toursHero")
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isVisible, setIsVisible] = useState(false)
  const [placeValue, setPlaceValue] = useState<GooglePlaceValue>({
    location: "",
    placeId: null,
    lat: null,
    lng: null,
  })

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (searchParams.get("focus") === "search") {
      setTimeout(() => {
        const input = document.getElementById("tours-search-input") as HTMLInputElement | null
        if (input) input.focus()
      }, 500)
    }
  }, [searchParams])

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

  const desktopBadges = [...FEATURE_BADGES].sort((a, b) => a.order.desktop - b.order.desktop)
  const mobileBadges = [...FEATURE_BADGES].sort((a, b) => a.order.mobile - b.order.mobile)

  return (
    <section className="relative w-full h-[459px] md:h-[520px] lg:h-[600px] xl:h-[690px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/tours_hero.jpg')" }}
      />

      <div className="absolute inset-0 bg-black/20" />

      {/* Top fade: opaco no topo para esconder a linha do header, depois suaviza */}
      <div className="absolute top-0 left-0 right-0 h-[180px] md:h-[200px] lg:h-[240px] bg-gradient-to-b from-white from-0% via-white via-[20%] to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 h-[140px] md:h-[160px] lg:h-[200px] bg-gradient-to-t from-white via-white/70 to-transparent" />

      <div className="relative z-10 h-full flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-[16px] w-full max-w-[395px] md:max-w-[777px]">
          <h1
            className={cn(
              "text-center text-white mix-blend-screen transition-all duration-700 ease-out",
              "text-[40px] md:text-[72px] leading-[1.3] md:leading-[72px]",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            <span className="font-extrabold">{t("titleDiscover")}</span>
            <span className="font-normal"> {t("titleSoul")}</span>
            <br />
            <span className="font-normal">{t("titlePortugal")}</span>
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

          <div
            className={cn(
              "hidden md:flex flex-row items-center justify-center gap-[16px] w-full",
              "transition-all duration-700 ease-out delay-300",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            {desktopBadges.map((badge) => (
              <FeatureBadge key={badge.key} icon={badge.icon} label={t(`badges.${badge.key}`)} />
            ))}
          </div>

          <div
            className={cn(
              "md:hidden flex justify-center w-full",
              "transition-all duration-700 ease-out delay-300",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            <div className="grid grid-cols-2 gap-2 place-items-center">
            {mobileBadges.map((badge) => (
                <FeatureBadge
                  key={badge.key}
                  icon={badge.icon}
                  label={t(`badges.${badge.key}`)}
                  variant="mobile"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
