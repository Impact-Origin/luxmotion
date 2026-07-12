"use client"

import { useTranslations } from "next-intl"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Clock, Users, Star, ArrowRight } from "lucide-react"
import { useMoney } from "@/components/currency-provider"

const SERIF_FONT = "var(--font-title), 'Cormorant Garamond', serif"

export type TourBadge = "bestseller" | "signature" | "new"

export interface UltraTourCardData {
  slug: string
  image: string
  rating: number
  reviewCount: number
  title: string
  location: string
  duration: string
  pax: string
  price: number
  badge: TourBadge | null
}

function Stars({ rating }: { rating: number }) {
  const filled = Math.round(rating)
  return (
    <div className="flex items-center gap-[1px]">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={i < filled ? "text-[#C9A96E]" : "text-[rgba(201,169,110,0.25)]"}
          style={{ width: 11, height: 11 }}
          fill="currentColor"
          strokeWidth={0}
        />
      ))}
    </div>
  )
}

function MetaItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-[5px] text-[12px] text-[#999]">
      {icon}
      {label}
    </span>
  )
}

export function UltraTourCard({ tour }: { tour: UltraTourCardData }) {
  const t = useTranslations("ultraLuxuryTours.tours")
  const { format } = useMoney()

  return (
    <Link
      href={`/ultra-luxury-tours/tours/${tour.slug}`}
      className="group relative isolate flex h-full flex-col border border-[rgba(255,255,255,0.12)] bg-[#1a1a1a] transition-colors hover:border-[rgba(201,169,110,0.4)]"
    >
      {tour.badge && (
        <span className="absolute left-[11px] top-[11px] z-[3] bg-[rgba(201,169,110,0.92)] px-[10px] py-[4px] text-[8px] font-semibold uppercase tracking-[0.72px] text-[#0d0d0d]">
          {t(`badge_${tour.badge}`)}
        </span>
      )}

      <div className="relative h-[210px] w-full overflow-hidden bg-[#0d0d0d]">
        <Image
          src={tour.image}
          alt={tour.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 px-5 pt-5 pb-6">
        <div className="flex items-center gap-[6px]">
          <Stars rating={tour.rating} />
          <span className="text-[12px] tracking-[0.3px] text-[rgba(255,255,255,0.3)]">
            {t("reviews", { count: tour.reviewCount })}
          </span>
        </div>

        <h3
          className="line-clamp-2 min-h-[62px] text-[24px] font-semibold leading-[1.3] text-white"
          style={{ fontFamily: SERIF_FONT }}
        >
          {tour.title}
        </h3>

        <div className="flex flex-wrap gap-x-3 gap-y-[6px] pt-[2px]">
          <MetaItem icon={<MapPin className="size-[14px]" strokeWidth={1.5} />} label={tour.location} />
          <MetaItem icon={<Clock className="size-[14px]" strokeWidth={1.5} />} label={tour.duration} />
          <MetaItem icon={<Users className="size-[14px]" strokeWidth={1.5} />} label={tour.pax} />
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-[rgba(255,255,255,0.12)] pt-[13px]">
          <div className="flex flex-col">
            <span className="text-[12px] font-semibold uppercase tracking-[0.9px] text-[#8c8680]">
              {t("from")}
            </span>
            <span
              className="text-[32px] font-semibold leading-none text-[#C9A96E]"
              style={{ fontFamily: SERIF_FONT }}
            >
              {format(tour.price)}
            </span>
          </div>
          <span className="flex size-[32px] items-center justify-center border border-[#C9A96E] text-[#C9A96E] transition-colors group-hover:bg-[#C9A96E] group-hover:text-[#0d0d0d]">
            <ArrowRight className="size-[18px]" strokeWidth={2} />
          </span>
        </div>
      </div>
    </Link>
  )
}
