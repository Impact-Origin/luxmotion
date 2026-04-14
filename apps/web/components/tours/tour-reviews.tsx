"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useTranslations, useLocale } from "next-intl"
import { cn } from "@workspace/ui/lib/utils"
import type { Id } from "@workspace/convex/dataModel"
import { TourReviewForm } from "./tour-review-form"

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

interface TourReviewsProps {
  tourId: Id<"tours">
  rating: number
  reviewCount: number
  reviews: Review[]
}

const AVATAR_PALETTE = [
  "#7b1fa2",
  "#1565c0",
  "#c62828",
  "#2e7d32",
  "#ef6c00",
  "#4527a0",
  "#00838f",
  "#ad1457",
]

function avatarColorFor(name: string) {
  const code = (name.charCodeAt(0) || 65) - 65
  return AVATAR_PALETTE[Math.abs(code) % AVATAR_PALETTE.length]
}

function formatReviewDate(review: Review, locale: string) {
  if (review.createdAt) {
    return new Date(review.createdAt).toLocaleDateString(locale, {
      month: "long",
      year: "numeric",
    })
  }
  return review.date || ""
}

function ReviewCard({ review }: { review: Review }) {
  const t = useTranslations("tourDetails")
  const locale = useLocale()
  const name = review.source || review.author
  const initial = name.charAt(0).toUpperCase()
  const dateLabel = formatReviewDate(review, locale)

  return (
    <div className="bg-[#1a1a1a] border-l-[1.6px] border-transparent hover:border-[#c9a96e] transition-colors p-[24px] flex flex-col gap-[8px] w-full">
      <div className="flex gap-[12px] items-center">
        <div
          className="size-[36px] rounded-[18px] flex items-center justify-center shrink-0"
          style={{ backgroundColor: avatarColorFor(name) }}
        >
          <span
            className="text-[14px] font-semibold text-white leading-none"
            style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
          >
            {initial}
          </span>
        </div>
        <div className="flex flex-col min-w-0">
          <span
            className="text-[12px] font-semibold text-white leading-[1.3] truncate"
            style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
          >
            {name}
          </span>
          <span
            className="text-[10px] text-[#8c8680] leading-[1.3]"
            style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
          >
            {dateLabel}
            {dateLabel ? " · " : ""}
            {t("verifiedBooking")}
          </span>
        </div>
      </div>
      <div
        className="text-[12px] text-[#c9a96e] tracking-[1px] leading-none pt-[0.8px]"
        style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
      >
        {"★★★★★".slice(0, review.rating).padEnd(5, "☆")}
      </div>
      <p
        className="text-[12px] text-[rgba(255,255,255,0.45)] leading-[19.8px]"
        style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
      >
        {review.text}
      </p>
    </div>
  )
}

function CarouselButton({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="size-[44px] border border-[rgba(201,169,110,0.5)] text-[#c9a96e] flex items-center justify-center transition-colors hover:bg-[rgba(201,169,110,0.08)] disabled:opacity-30 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  )
}

export function TourReviews({ tourId, rating, reviewCount, reviews }: TourReviewsProps) {
  const t = useTranslations("tourDetails")
  const [mobileIndex, setMobileIndex] = useState(0)
  const canPrev = mobileIndex > 0
  const canNext = mobileIndex < reviews.length - 1

  return (
    <div className="w-full flex flex-col gap-[20px]">
      <h2
        className="text-[24px] italic font-light text-[#c9a96e] leading-none"
        style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif" }}
      >
        {t("reviewsTitle")}
      </h2>

      <div className="flex flex-col gap-[4px]">
        <div className="flex items-baseline gap-[8px]">
          <span
            className="text-[56px] font-light text-[#c9a96e] leading-[56px]"
            style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif" }}
          >
            {rating.toFixed(1)}
          </span>
          <span
            className="text-[14px] text-[rgba(255,255,255,0.3)]"
            style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
          >
            / 5
          </span>
        </div>
        <div className="flex items-center gap-[8px]">
          <span className="text-[16px] text-[#c9a96e] tracking-[1px] leading-none pt-[2.4px]">
            ★★★★★
          </span>
          <span
            className="text-[12px] text-[#8c8680]"
            style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
          >
            {reviewCount} {t("verifiedReviews")}
          </span>
        </div>
      </div>

      {reviews.length > 0 && (
        <>
          <div className="hidden md:flex flex-col gap-[3px] pt-[12px]">
            {reviews.map((review, index) => (
              <ReviewCard key={index} review={review} />
            ))}
          </div>

          <div className="md:hidden flex flex-col gap-4 pt-[12px]">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-300 ease-out"
                style={{ transform: `translateX(-${mobileIndex * 100}%)` }}
              >
                {reviews.map((review, index) => (
                  <div key={index} className="w-full shrink-0">
                    <ReviewCard review={review} />
                  </div>
                ))}
              </div>
            </div>
            {reviews.length > 1 && (
              <div className="flex items-center justify-center gap-4">
                <CarouselButton
                  onClick={() => canPrev && setMobileIndex((i) => i - 1)}
                  disabled={!canPrev}
                >
                  <ChevronLeft className="size-5" />
                </CarouselButton>
                <div className="flex items-center gap-[6px]">
                  {reviews.map((_, i) => (
                    <span
                      key={i}
                      className={cn(
                        "size-[6px] rounded-full transition-colors",
                        i === mobileIndex ? "bg-[#c9a96e]" : "bg-[rgba(201,169,110,0.25)]"
                      )}
                    />
                  ))}
                </div>
                <CarouselButton
                  onClick={() => canNext && setMobileIndex((i) => i + 1)}
                  disabled={!canNext}
                >
                  <ChevronRight className="size-5" />
                </CarouselButton>
              </div>
            )}
          </div>
        </>
      )}

      <div className="w-full pt-[12px]">
        <TourReviewForm tourId={tourId} />
      </div>
    </div>
  )
}
