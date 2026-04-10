"use client"

import { Star, Users, Clock } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useTranslations } from "next-intl"

const SWIPE_THRESHOLD = 50

export function TrustBanner() {
  const t = useTranslations("checkout.trustBanner")
  const [activeIndex, setActiveIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)

  const features = [
    {
      icon: Star,
      title: t("travelersRateUs"),
      description: t("averageReviews"),
    },
    {
      icon: Users,
      title: t("bestDrivers"),
      description: t("bestDriversDesc"),
    },
    {
      icon: Clock,
      title: t("alwaysOnTime"),
      description: t("alwaysOnTimeDesc"),
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % features.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [features.length])

  const goTo = (index: number) => {
    const next = Math.max(0, Math.min(index, features.length - 1))
    setActiveIndex(next)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]!.clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const endX = e.changedTouches[0]!.clientX
    const delta = endX - touchStartX.current
    if (delta > SWIPE_THRESHOLD) {
      goTo(activeIndex - 1)
    } else if (delta < -SWIPE_THRESHOLD) {
      goTo(activeIndex + 1)
    }
    touchStartX.current = null
  }

  return (
    <div 
      className="checkout-trust-banner py-3 px-6 rounded-xl"
      style={{ backgroundColor: "var(--theme-checkout-trust-banner-bg, #0E4659)" }}
    >
      <div className="hidden md:flex items-center justify-between gap-6">
        <div className="flex items-center gap-3 flex-1">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "var(--theme-checkout-trust-banner-icon-bg, #FFFFFF)" }}
          >
            <Star 
              className="w-5 h-5" 
              style={{ 
                color: "var(--theme-checkout-trust-banner-icon, #0E4659)",
                fill: "var(--theme-checkout-trust-banner-icon, #0E4659)"
              }}
            />
          </div>
          <div>
            <h3 
              className="font-bold text-base"
              style={{ color: "var(--theme-checkout-trust-banner-title, #FFFFFF)" }}
            >
              {features[0]!.title}
            </h3>
            <p 
              className="text-sm"
              style={{ color: "var(--theme-checkout-trust-banner-description, #FFFFFFB3)" }}
            >
              {features[0]!.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-1">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "var(--theme-checkout-trust-banner-icon-bg, #FFFFFF)" }}
          >
            <Users 
              className="w-5 h-5"
              style={{ color: "var(--theme-checkout-trust-banner-icon, #0E4659)" }}
            />
          </div>
          <div>
            <h3 
              className="font-bold text-base"
              style={{ color: "var(--theme-checkout-trust-banner-title, #FFFFFF)" }}
            >
              {features[1]!.title}
            </h3>
            <p 
              className="text-sm"
              style={{ color: "var(--theme-checkout-trust-banner-description, #FFFFFFB3)" }}
            >
              {features[1]!.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-1">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "var(--theme-checkout-trust-banner-icon-bg, #FFFFFF)" }}
          >
            <Clock 
              className="w-5 h-5"
              style={{ color: "var(--theme-checkout-trust-banner-icon, #0E4659)" }}
            />
          </div>
          <div>
            <h3 
              className="font-bold text-base"
              style={{ color: "var(--theme-checkout-trust-banner-title, #FFFFFF)" }}
            >
              {features[2]!.title}
            </h3>
            <p 
              className="text-sm"
              style={{ color: "var(--theme-checkout-trust-banner-description, #FFFFFFB3)" }}
            >
              {features[2]!.description}
            </p>
          </div>
        </div>
      </div>

      <div className="md:hidden touch-pan-y select-none">
        <div
          className="relative overflow-hidden py-2 min-h-[70px]"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className={`absolute inset-0 flex items-center gap-3 transition-all duration-500 ease-in-out ${
                  index === activeIndex ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
                }`}
                style={index === activeIndex ? undefined : { pointerEvents: "none" }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "var(--theme-checkout-trust-banner-icon-bg, #FFFFFF)" }}
                >
                  <Icon
                    className="w-5 h-5"
                    style={{
                      color: "var(--theme-checkout-trust-banner-icon, #0E4659)",
                      fill: index === 0 ? "var(--theme-checkout-trust-banner-icon, #0E4659)" : undefined
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-bold text-base leading-tight"
                    style={{ color: "var(--theme-checkout-trust-banner-title, #FFFFFF)" }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-sm leading-snug"
                    style={{ color: "var(--theme-checkout-trust-banner-description, #FFFFFFB3)" }}
                  >
                    {feature.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex items-center justify-center gap-2 mt-4">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: index === activeIndex ? "1.5rem" : "0.5rem",
                backgroundColor: index === activeIndex 
                  ? "var(--theme-checkout-trust-banner-dot-active, #27C7FF)" 
                  : "var(--theme-checkout-trust-banner-dot-inactive, #FFFFFF80)"
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
