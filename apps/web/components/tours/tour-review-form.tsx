"use client"

import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@workspace/convex/api"
import { Star, Send } from "lucide-react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import type { Id } from "@workspace/convex/dataModel"
import { CountryCombobox } from "@/components/ui/country-combobox"

interface TourReviewFormProps {
  tourId: Id<"tours">
}

function StarRating({
  rating,
  onRatingChange,
}: {
  rating: number
  onRatingChange: (rating: number) => void
}) {
  const [hovered, setHovered] = useState(0)

  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const starValue = i + 1
        const isFilled = starValue <= (hovered || rating)

        return (
          <button
            key={i}
            type="button"
            onClick={() => onRatingChange(starValue)}
            onMouseEnter={() => setHovered(starValue)}
            onMouseLeave={() => setHovered(0)}
            className="p-0.5 transition-transform hover:scale-110"
          >
            <Star
              className={`size-7 transition-colors ${
                isFilled
                  ? "text-[#f5a623] fill-[#f5a623]"
                  : "text-[#dedede] fill-[#dedede] hover:text-[#f5a623]/50 hover:fill-[#f5a623]/50"
              }`}
            />
          </button>
        )
      })}
    </div>
  )
}

export function TourReviewForm({ tourId }: TourReviewFormProps) {
  const t = useTranslations("tourDetails")
  const submitReview = useMutation(api.tourReviews.submit)

  const [rating, setRating] = useState(0)
  const [author, setAuthor] = useState("")
  const [nationality, setNationality] = useState("")
  const [text, setText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      toast.error(t("ratingRequired"))
      return
    }

    if (!author.trim() || !text.trim()) {
      return
    }

    setIsSubmitting(true)

    try {
      await submitReview({
        tourId,
        author: author.trim(),
        rating,
        text: text.trim(),
        nationality: nationality.trim() || undefined,
      })

      toast.success(t("reviewSubmitted"), {
        description: t("reviewPending"),
      })

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

  return (
    <div className="mt-8 bg-[#f8f9fa] rounded-[16px] p-6">
      <h3 className="text-[18px] font-bold text-[#0c171c] leading-none mb-5">
        {t("writeReview")}
      </h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <StarRating rating={rating} onRatingChange={setRating} />
        </div>

        <input
          suppressHydrationWarning
          type="text"
          placeholder={t("yourName")}
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
          className="w-full h-[48px] px-4 bg-white border border-[#dedede] rounded-[8px] text-[14px] text-[#0c171c] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#27c7ff] transition-colors"
        />

        <CountryCombobox
          value={nationality}
          onChange={setNationality}
          placeholder={t("yourNationality")}
          emptyLabel={`— ${t("yourNationality")}`}
        />

        <textarea
          suppressHydrationWarning
          placeholder={t("yourReview")}
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          rows={4}
          className="w-full px-4 py-3 bg-white border border-[#dedede] rounded-[8px] text-[14px] text-[#0c171c] placeholder:text-[#9ca3af] resize-none focus:outline-none focus:border-[#27c7ff] transition-colors"
        />

        <button
          type="submit"
          disabled={isSubmitting || rating === 0}
          className="w-full sm:w-auto sm:self-end h-[48px] px-6 bg-[#27c7ff] rounded-[8px] flex items-center justify-center gap-2 hover:bg-[#1eb8f0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="size-5 text-[#0e4659]" />
          <span className="text-[14px] font-bold text-[#0e4659] uppercase tracking-[0.14px]">
            {isSubmitting ? t("submitting") : t("submitReview")}
          </span>
        </button>
      </form>
    </div>
  )
}
