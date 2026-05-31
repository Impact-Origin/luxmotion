"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Clock, Users, Star, ArrowRight, Heart } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { formatPrice } from "@/lib/format"

const SERIF_FONT = "var(--font-title), 'Cormorant Garamond', serif"

export interface BrowseTourCardData {
  slug: string
  image: string
  badge: string | null
  themes: string[]
  rating: number
  reviewCount: number
  title: string
  location: string
  duration: string
  pax: string
  price: number
}

function Stars({ rating }: { rating: number }) {
  const filled = Math.round(rating)
  return (
    <div className="flex items-center gap-[1px]">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={i < filled ? "text-[#C9A96E]" : "text-[rgba(154,117,53,0.3)]"}
          style={{ width: 11, height: 11 }}
          fill="currentColor"
          strokeWidth={0}
        />
      ))}
    </div>
  )
}

export function BrowseTourCard({ tour, list = false }: { tour: BrowseTourCardData; list?: boolean }) {
  const t = useTranslations("ultraLuxuryTours.browse")
  const [saved, setSaved] = useState(false)

  return (
    <Link
      href={`/ultra-luxury-tours/tours/${tour.slug}`}
      className="group relative isolate flex h-full flex-col border border-[rgba(28,27,24,0.08)] bg-[#f9f6f1] transition-colors hover:border-[rgba(154,117,53,0.4)]"
    >
      <div className="relative flex h-[210px] w-full items-start justify-between overflow-hidden bg-[#0d0d0d] p-4">
        <Image
          src={tour.image}
          alt={tour.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 50vw"
        />
        {tour.badge && (
          <span className="relative z-[2] bg-[#1a1a1a] px-[10px] py-[4px] text-[8px] font-semibold uppercase tracking-[0.72px] text-[#C9A96E]">
            {tour.badge}
          </span>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            setSaved((v) => !v)
          }}
          className="relative z-[2] ml-auto flex size-[32px] items-center justify-center border border-[rgba(154,117,53,0.22)] bg-[#f7f4ef] text-[#a08248] transition-colors hover:border-[#a08248]"
          aria-label={t("save")}
        >
          <Heart className="size-[18px]" strokeWidth={1.8} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 px-5 pt-5 pb-6">
        {tour.themes.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-[10px] gap-y-1">
            {tour.themes.map((theme, i) => (
              <span key={theme} className="flex items-center gap-[10px]">
                {i > 0 && <span className="size-[3px] rounded-[1.5px] bg-[#9a7535]" />}
                <span className="text-[10px] font-semibold uppercase tracking-[1.4px] text-[#a08248]">
                  {theme}
                </span>
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-[6px]">
          <Stars rating={tour.rating} />
          <span className="text-[12px] text-[#696969]">{t("reviews", { count: tour.reviewCount })}</span>
        </div>

        <h3
          className={cn(
            "text-[24px] font-semibold leading-[1.3] text-[#0d0d0d]",
            list ? "line-clamp-1" : "line-clamp-2 min-h-[62px]",
          )}
          style={{ fontFamily: SERIF_FONT }}
        >
          {tour.title}
        </h3>

        <div className="flex flex-wrap gap-x-3 gap-y-[6px] pt-[2px] text-[12px] text-[#696969]">
          <span className="flex items-center gap-[5px]">
            <MapPin className="size-[14px]" strokeWidth={1.5} />
            {tour.location}
          </span>
          <span className="flex items-center gap-[5px]">
            <Clock className="size-[14px]" strokeWidth={1.5} />
            {tour.duration}
          </span>
          <span className="flex items-center gap-[5px]">
            <Users className="size-[14px]" strokeWidth={1.5} />
            {tour.pax}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-[rgba(28,27,24,0.08)] pt-[9px]">
          <div className="flex flex-col">
            <span className="text-[12px] font-semibold uppercase tracking-[0.9px] text-[#8c8680]">
              {t("from")}
            </span>
            <span className="leading-none text-[#a08248]" style={{ fontFamily: SERIF_FONT }}>
              <span className="text-[32px] font-semibold">{formatPrice(tour.price)}</span>
              <span className="text-[24px]">{t("perPerson")}</span>
            </span>
          </div>
          <span
            className={cn(
              "flex size-[32px] items-center justify-center border border-[#a08248] text-[#a08248] transition-colors",
              "group-hover:bg-[#a08248] group-hover:text-[#f7f4ef]",
            )}
          >
            <ArrowRight className="size-[18px]" strokeWidth={2} />
          </span>
        </div>
      </div>
    </Link>
  )
}
