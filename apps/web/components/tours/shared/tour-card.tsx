"use client"

import Image from "next/image"
import { ArrowRight, Star, Award } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@workspace/ui/lib/utils"

export interface TourData {
  id: string
  image: string
  rating: number
  reviewCount: number
  title: string
  location: string
  duration: string
  originalPrice: number
  discountedPrice: number
  savings: number
  isBestSeller: boolean
  category: "tours" | "experiences" | "private"
}

function StarRating({ rating, small }: { rating: number; small?: boolean }) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  return (
    <div className="flex gap-[2px] items-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            small ? "size-[14px]" : "size-[17px]",
            i < fullStars
              ? "fill-[#fbb03b] text-[#fbb03b]"
              : i === fullStars && hasHalfStar
                ? "fill-[#fbb03b]/50 text-[#fbb03b]"
                : "fill-gray-200 text-gray-200"
          )}
        />
      ))}
    </div>
  )
}

interface TourCardProps {
  tour: TourData
  variant?: "desktop" | "mobile"
  className?: string
}

export function TourCard({ tour, variant = "desktop", className }: TourCardProps) {
  const t = useTranslations("topPicks")
  const isMobile = variant === "mobile"

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[16px] cursor-pointer group",
        isMobile ? "h-[360px]" : "h-[560px]",
        className
      )}
    >
      <Image
        src={tour.image}
        alt={tour.title}
        fill
        className="object-cover"
        sizes={isMobile ? "50vw" : "33vw"}
      />

      <div className={cn(
        "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent",
        isMobile ? "h-[140px]" : "h-[165px]"
      )} />

      <div
        className={cn(
          "absolute top-[14px] left-[16px] right-[16px] flex justify-between items-start",
          isMobile && "flex-col gap-[8px]"
        )}
      >
        {tour.isBestSeller && (
          <div className={cn(
            "flex items-center gap-0 bg-[#fbb03b] rounded-[80px] px-[8px]",
            isMobile ? "h-[24px]" : "h-[32px]"
          )}>
            <Award className={cn("text-[#774c08]", isMobile ? "size-[18px]" : "size-[24px]")} />
            <span className={cn(
              "font-medium text-[#774c08] px-[8px]",
              isMobile ? "text-[12px]" : "text-[14px]"
            )}>
              {t("bestSeller")}
            </span>
          </div>
        )}
        {tour.savings > 0 && (
          <div className={cn(
            "flex items-center bg-[#7f1efa] rounded-[80px] px-[8px]",
            isMobile ? "h-[24px]" : "h-[32px]"
          )}>
            <span className={cn(
              "font-medium text-white",
              isMobile ? "text-[12px]" : "text-[14px]"
            )}>
              {t("save", { amount: tour.savings.toFixed(2).replace(".", ",") })}
            </span>
          </div>
        )}
      </div>

      <div className={cn(
        "absolute",
        isMobile ? "left-[8px] right-[8px] bottom-[8px]" : "left-[16px] right-[16px] bottom-[16px]"
      )}>
        <div className={cn(
          "bg-white rounded-[10px]",
          isMobile ? "px-[12px] py-[10px]" : "px-[16px] py-[12px]"
        )}>
          <div className={cn("flex flex-col", isMobile ? "gap-[4px]" : "gap-[6px]")}>
            <div className="flex flex-col gap-[2px]">
              <StarRating rating={tour.rating} small={isMobile} />
              <div className="flex items-baseline gap-[6px]">
                <span className={cn("font-bold text-[#111]", isMobile ? "text-[12px]" : "text-[14px]")}>
                  {tour.rating}
                </span>
                <span className={cn("text-[#808080]", isMobile ? "text-[11px]" : "text-[12px]")}>
                  {tour.reviewCount} {t("reviews")}
                </span>
              </div>
            </div>

            <h3 className={cn(
              "font-bold text-[#222] leading-[1.2] line-clamp-2",
              isMobile ? "text-[14px]" : "text-[16px]"
            )}>
              {tour.title}
            </h3>

            <div className="flex flex-wrap gap-[8px] items-center">
              <span className="text-[10px] uppercase text-[#0e4659] tracking-[-0.2px]">
                {tour.location}
              </span>
              <span className="size-[4px] rounded-full bg-[#0e4659]" />
              <span className="text-[10px] uppercase text-[#0e4659] tracking-[-0.2px]">
                {tour.duration}
              </span>
            </div>

            <div className="flex items-end justify-between">
              <div className="flex flex-col gap-[4px]">
                <span className="text-[12px] text-[#808080] line-through leading-none">
                  {t("was", { price: tour.originalPrice.toFixed(2).replace(".", ",") })}
                </span>
                <span className={cn(
                  "font-bold text-[#1f9fcc] tracking-[-0.2px] whitespace-nowrap",
                  isMobile ? "text-[14px]" : "text-[16px]"
                )}>
                  {t("from", { price: tour.discountedPrice.toFixed(2).replace(".", ",") })}
                </span>
              </div>
              <div className="size-[24px] bg-[#27c7ff] rounded-full flex items-center justify-center opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:bg-[#1f9fcc] transition-all duration-200">
                <ArrowRight className="size-[14px] text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
