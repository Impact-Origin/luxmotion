"use client"

import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@workspace/convex/api"
import { useTranslations, useLocale } from "next-intl"
import { Star } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@workspace/ui/lib/utils"
import type { Id } from "@workspace/convex/dataModel"
import { type Review } from "@/app/(landing)/tours/tour/[slug]/page"

const SERIF_FONT = "var(--font-title), 'Cormorant Garamond', serif"
const AVATAR_COLORS = ["#7b1fa2", "#1976d2", "#c62828", "#546e7a", "#e91e63", "#ff5722", "#00897b", "#6d4c41"]

interface UltraTourReviewsProps {
  tourId: Id<"tours">
  rating: number
  reviewCount: number
  reviews: Review[]
}

function StaticStars({ rating, size = 12 }: { rating: number; size?: number }) {
  const filled = Math.round(rating)
  return (
    <span className="inline-flex items-center gap-[1px]">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={i < filled ? "text-[#c9a96e]" : "text-[rgba(154,117,53,0.3)]"}
          style={{ width: size, height: size }}
          fill="currentColor"
          strokeWidth={0}
        />
      ))}
    </span>
  )
}

function ReviewForm({ tourId }: { tourId: Id<"tours"> }) {
  const t = useTranslations("tourDetails")
  const submitReview = useMutation(api.tourReviews.submit)
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [author, setAuthor] = useState("")
  const [nationality, setNationality] = useState("")
  const [text, setText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const inputCls =
    "w-full border border-[rgba(28,27,24,0.08)] bg-white/40 px-[15px] py-[14px] text-[13px] text-[#1c1b18] placeholder:text-[#696969] focus:border-[#a08248] focus:outline-none transition-colors"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      toast.error(t("ratingRequired"))
      return
    }
    if (!author.trim() || !text.trim()) return
    setIsSubmitting(true)
    try {
      await submitReview({ tourId, author: author.trim(), rating, text: text.trim(), nationality: nationality.trim() || undefined })
      toast.success(t("reviewSubmitted"), { description: t("reviewPending") })
      setRating(0)
      setAuthor("")
      setNationality("")
      setText("")
    } catch {
      toast.error(t("errorSubmitting"))
    } finally {
      setIsSubmitting(false)
    }
  }

  const titleWords = t("writeReview").split(" ")
  const titleAccent = titleWords.pop() || ""
  const titleLead = titleWords.join(" ")

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[19px] border border-[#a08248] bg-[#f5f1eb] p-6 md:p-[33px]">
      <div className="h-[2px] w-10 bg-[#c9a96e]" />
      <h3 className="text-[22px] font-medium leading-none text-[#0d0d0d]" style={{ fontFamily: SERIF_FONT }}>
        {titleLead} <span className="italic text-[#a08248]">{titleAccent}</span>
      </h3>

      <div className="flex gap-[6px]">
        {Array.from({ length: 5 }).map((_, i) => {
          const value = i + 1
          const filled = value <= (hovered || rating)
          return (
            <button
              key={i}
              type="button"
              onClick={() => setRating(value)}
              onMouseEnter={() => setHovered(value)}
              onMouseLeave={() => setHovered(0)}
              className="transition-transform hover:scale-110"
              aria-label={`${value}`}
            >
              <Star
                className={filled ? "text-[#c9a96e]" : "text-[rgba(154,117,53,0.25)] hover:text-[rgba(160,130,72,0.5)]"}
                style={{ width: 20, height: 20 }}
                fill="currentColor"
                strokeWidth={0}
              />
            </button>
          )
        })}
      </div>

      <input type="text" placeholder={t("yourName")} value={author} onChange={(e) => setAuthor(e.target.value)} required className={inputCls} suppressHydrationWarning />
      <input type="text" placeholder={t("yourNationality")} value={nationality} onChange={(e) => setNationality(e.target.value)} className={inputCls} suppressHydrationWarning />
      <textarea placeholder={t("yourReview")} value={text} onChange={(e) => setText(e.target.value)} required rows={4} className={cn(inputCls, "min-h-[100px] resize-none")} suppressHydrationWarning />

      <button
        type="submit"
        disabled={isSubmitting || rating === 0}
        className="flex items-center justify-center bg-[#a08248] p-[14px] transition-colors hover:bg-[#8a6f3c] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="text-[11px] font-bold uppercase tracking-[1.32px] text-white">
          {isSubmitting ? t("submitting") : t("submitReview")}
        </span>
      </button>
    </form>
  )
}

export function UltraTourReviews({ tourId, rating, reviewCount, reviews }: UltraTourReviewsProps) {
  const t = useTranslations("tourDetails")
  const locale = useLocale()

  const formatDate = (createdAt?: number) => {
    if (!createdAt) return t("verifiedBooking")
    const d = new Date(createdAt).toLocaleDateString(locale, { month: "long", year: "numeric" })
    return `${d.charAt(0).toUpperCase()}${d.slice(1)} · ${t("verifiedBooking")}`
  }

  return (
    <div>
      <h2 className="text-[24px] leading-none md:text-[28px]" style={{ fontFamily: SERIF_FONT }}>
        <span className="italic text-[#a08248]">{t("reviewsTitle")}</span>
      </h2>

      <div className="mt-6 flex flex-col gap-3">
        <div className="flex items-end gap-2" style={{ fontFamily: SERIF_FONT }}>
          <span className="text-[56px] leading-none text-[#a08248]">{rating.toFixed(1)}</span>
          <span className="pb-2 text-[16px] text-[#696969]">/ 5</span>
        </div>
        <div className="flex items-center gap-3">
          <StaticStars rating={rating} size={16} />
          <span className="text-[13px] text-[#696969]">{reviewCount} {t("verifiedReviews")}</span>
        </div>
      </div>

      {reviews.length > 0 && (
        <div className="mt-8 flex flex-col gap-3 border-l-[1.6px] border-[rgba(154,117,53,0.22)]">
          {reviews.map((review, i) => (
            <div key={i} className="flex flex-col gap-2 bg-[#f7f4ef] p-6">
              <div className="flex items-center gap-3">
                <span
                  className="flex size-9 shrink-0 items-center justify-center rounded-full text-[14px] font-semibold text-white"
                  style={{ backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                >
                  {review.author.charAt(0).toUpperCase()}
                </span>
                <div className="flex flex-col">
                  <span className="text-[12px] font-semibold text-[#0d0d0d]">{review.author}</span>
                  <span className="text-[10px] text-[#696969]">{formatDate(review.createdAt)}</span>
                </div>
              </div>
              <StaticStars rating={review.rating} />
              <p className="text-[12px] leading-[19.8px] text-[#696969]">{review.text}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
        <ReviewForm tourId={tourId} />
      </div>
    </div>
  )
}
