"use client"

import { useState, useRef, useEffect } from "react"
import { Star, ChevronDown } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@workspace/ui/lib/utils"

interface Review {
  author: string
  avatar?: string
  rating: number
  text: string
  source?: string
  date?: string
  nationality?: string
  createdAt?: number
}

import type { Id } from "@workspace/convex/dataModel"
import { TourReviewForm } from "./tour-review-form"
import { getFlagForNationality } from "@/lib/countries"

interface TourReviewsProps {
  tourId: Id<"tours">
  rating: number
  reviewCount: number
  reviews: Review[]
}

function HeaderStars({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating)
  const hasHalf = rating % 1 >= 0.5

  return (
    <div className="flex">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="relative size-[22px]">
          {i < fullStars ? (
            <Star className="size-[22px] text-[#f5a623] fill-[#f5a623]" />
          ) : i === fullStars && hasHalf ? (
            <div className="relative size-[22px]">
              <Star className="absolute size-[22px] text-[#e0e0e0] fill-[#e0e0e0]" />
              <div className="absolute overflow-hidden w-[11px]">
                <Star className="size-[22px] text-[#f5a623] fill-[#f5a623]" />
              </div>
            </div>
          ) : (
            <Star className="size-[22px] text-[#e0e0e0] fill-[#e0e0e0]" />
          )}
        </div>
      ))}
    </div>
  )
}

function ReviewStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-[2px]">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-[18px] ${i < rating ? "text-[#f5a623] fill-[#f5a623]" : "text-[#e0e0e0] fill-[#e0e0e0]"}`}
        />
      ))}
    </div>
  )
}

function ReviewCard({ review }: { review: Review }) {
  const t = useTranslations("tourDetails")
  const initial = review.source?.charAt(0).toUpperCase() || review.author.charAt(0).toUpperCase()

  return (
    <div className="bg-white border border-[#dedede] rounded-[12px] p-5 flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <ReviewStars rating={review.rating} />
        <p className="text-[14px] text-[#5f686c] leading-[1.6]">
          {review.text}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="size-10 rounded-full bg-[#27c7ff] flex items-center justify-center shrink-0">
          <span className="text-[16px] font-medium text-[#0e4659]">
            {initial}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[14px] font-semibold text-[#0c171c] leading-[1.2]">
            {review.source || review.author}
          </span>
          <span className="text-[12px] text-[#5f686c] leading-[1.2] flex items-center gap-1.5">
            {review.nationality && getFlagForNationality(review.nationality) && (
              <span className="text-[14px]">{getFlagForNationality(review.nationality)}</span>
            )}
            {review.nationality || t("unknownNationality")}
          </span>
          <span className="text-[12px] text-[#5f686c] leading-[1.2]">
            {review.createdAt
              ? new Date(review.createdAt).toLocaleDateString(undefined, { month: "short", year: "numeric" })
              : review.date || ""}
          </span>
        </div>
      </div>
    </div>
  )
}

export function TourReviews({ tourId, rating, reviewCount, reviews }: TourReviewsProps) {
  const t = useTranslations("tourDetails")
  const [showAll, setShowAll] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const collapsibleRef = useRef<HTMLDivElement>(null)

  const initialReviews = reviews.slice(0, 2)
  const hiddenReviews = reviews.slice(2)
  const hasMoreReviews = reviews.length > 2

  const handleToggle = () => {
    setIsAnimating(true)
    setShowAll(!showAll)
  }

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 500)
      return () => clearTimeout(timer)
    }
  }, [isAnimating])

  return (
    <div className="w-full flex flex-col gap-[10px] items-center">
      <h2 className="text-[24px] font-bold text-[#0c171c] leading-[1.3] w-full">
        {t("reviewsTitle")}
      </h2>

      <div className="flex items-center gap-1 w-full">
        <HeaderStars rating={rating} />
        <span className="text-[20px] font-bold text-[#0c171c] leading-[22px] ml-1">
          {rating.toFixed(1)}
        </span>
        <span className="text-[14px] text-[#5f686c] leading-[22px] ml-1">
          ({reviewCount} {t("reviews")})
        </span>
      </div>

      <div className="flex flex-col gap-4 w-full">
        {initialReviews.map((review, index) => (
          <ReviewCard key={index} review={review} />
        ))}

        {hasMoreReviews && (
          <div
            ref={collapsibleRef}
            className={cn(
              "grid transition-all duration-500 ease-in-out",
              showAll ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            )}
          >
            <div className="overflow-hidden">
              <div className="flex flex-col gap-4">
                {hiddenReviews.map((review, index) => (
                  <div
                    key={index + 2}
                    className={cn(
                      "transition-all duration-500 ease-out",
                      showAll
                        ? "translate-y-0 opacity-100"
                        : "-translate-y-4 opacity-0"
                    )}
                    style={{
                      transitionDelay: showAll ? `${index * 75}ms` : `${(hiddenReviews.length - index - 1) * 50}ms`
                    }}
                  >
                    <ReviewCard review={review} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {hasMoreReviews && (
        <button
          onClick={handleToggle}
          className="group flex items-center gap-2 px-6 py-3 bg-white border border-[#dedede] rounded-[8px] text-[14px] font-semibold text-[#0c171c] text-center hover:border-[#27c7ff] hover:text-[#27c7ff] transition-all duration-300"
        >
          <span>{showAll ? t("showLess") : t("showMore")}</span>
          <ChevronDown
            className={cn(
              "size-4 transition-transform duration-300 ease-in-out",
              showAll && "rotate-180"
            )}
          />
        </button>
      )}

      <div className="w-full">
        <TourReviewForm tourId={tourId} />
      </div>
    </div>
  )
}
