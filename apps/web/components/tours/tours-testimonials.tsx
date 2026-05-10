"use client"

import { useState, useMemo, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react"
import { useTranslations } from "next-intl"
import { useQuery } from "convex/react"
import { api } from "@workspace/convex/api"
import { cn } from "@workspace/ui/lib/utils"
import { useSwipe } from "@/hooks/use-swipe"

const REVIEW_PHOTOS = [
  "/tours-page/review-photo-1.png",
  "/tours-page/review-photo-2.png",
  "/tours-page/review-photo-3.png",
  "/tours-page/review-photo-4.png",
]

const AVATAR_COLORS = [
  "#5f6368", "#9c27b0", "#1976d2", "#546e7a",
  "#e91e63", "#ff5722", "#009688", "#795548",
]

const FALLBACK_REVIEWS = [
  {
    name: "Denise Bulacher",
    date: "2 years ago",
    color: "#5f6368",
    text: "Reliable, friendly, and exactly on time. The driver was waiting at arrivals with a name board. Absolutely seamless.",
  },
  {
    name: "Marco Wohlgemuth",
    date: "2 years ago",
    color: "#9c27b0",
    text: "Everything worked perfectly and we had a great conversation throughout the drive. The vehicle was immaculate. Can only recommend.",
  },
  {
    name: "Jan Z.",
    date: "2 years ago",
    color: "#1976d2",
    text: "We had a great experience — reliable, accessible, and genuinely friendly. The transfer was exactly what we needed. Thank you.",
  },
  {
    name: "Aleks Macura",
    date: "2 years ago",
    color: "#546e7a",
    text: "Right on time and easy to find. Communication before arrival was excellent. After the drop-off he even gave us a personal dinner recommendation.",
  },
]

type Review = { name: string; date: string; color: string; text: string }

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="bg-[#1a1a1a] border-t-2 border-transparent flex flex-col gap-[11px] px-5 py-6 h-full">
      <div className="flex items-center gap-[10px]">
        <div
          className="size-9 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: review.color }}
        >
          <span className="text-[14px] text-white">{review.name.charAt(0)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-white leading-[14px]">{review.name}</p>
          <p className="text-[12px] text-[#8c8680] leading-[15px] mt-[3px]">{review.date}</p>
        </div>
        <Image src="/tours-page/google-icon.svg" alt="Google" width={16} height={16} className="size-4 shrink-0" />
      </div>
      <div className="flex items-center gap-1">
        <span className="text-[12px] text-[#C9A96E] tracking-[1px] leading-[18px]">★★★★★</span>
        <div className="size-[14px] rounded-full bg-[#1a73e8] flex items-center justify-center">
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M1.5 4L3 5.5L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <p className="text-[14px] text-white/55 leading-[1.2]">{review.text}</p>
    </div>
  )
}

function ArrowButton({ direction, onClick, className }: { direction: "left" | "right"; onClick: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "size-9 rounded-full bg-[#0D0D0D] border border-[rgba(201,169,110,0.5)] flex items-center justify-center hover:border-[#C9A96E] transition-colors",
        className
      )}
      aria-label={direction === "left" ? "Previous" : "Next"}
    >
      {direction === "left" ? (
        <ChevronLeft className="size-[14px] text-[#C9A96E]" />
      ) : (
        <ChevronRight className="size-[14px] text-[#C9A96E]" />
      )}
    </button>
  )
}

export function ToursTestimonials() {
  const t = useTranslations("toursTestimonials")
  const [currentPage, setCurrentPage] = useState(0)
  const featuredReviews = useQuery(api.tourReviews.listFeatured)

  const reviews: Review[] = useMemo(() => {
    const dbReviews: Review[] = (featuredReviews ?? []).map((r, i) => ({
      name: r.author,
      date: new Date(r.createdAt).toLocaleDateString("en-GB"),
      color: AVATAR_COLORS[(i + 4) % AVATAR_COLORS.length] ?? "#5f6368",
      text: r.text,
    }))
    return dbReviews.length > 0 ? dbReviews : FALLBACK_REVIEWS
  }, [featuredReviews])

  const desktopPerPage = 4
  const desktopPages = Math.ceil(reviews.length / desktopPerPage)

  const nextPage = useCallback(() => {
    setCurrentPage((p) => (p + 1) % reviews.length)
  }, [reviews.length])

  const prevPage = useCallback(() => {
    setCurrentPage((p) => (p - 1 + reviews.length) % reviews.length)
  }, [reviews.length])

  const swipeHandlers = useSwipe(nextPage, prevPage)

  const dPageIdx = Math.min(currentPage, desktopPages - 1)
  const dReviews = reviews.slice(dPageIdx * desktopPerPage, dPageIdx * desktopPerPage + desktopPerPage)
  const mReview = reviews[currentPage % reviews.length]!
  const mPhotoIdx = currentPage % REVIEW_PHOTOS.length

  return (
    <section className="bg-[#0D0D0D] pt-[60px] pb-6 px-4 md:px-[82px] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[867px] h-[499px] pointer-events-none">
        <div className="absolute inset-[-80%_-46%] opacity-40">
          <div className="w-full h-full rounded-full" style={{ background: "radial-gradient(ellipse, rgba(201,169,110,0.15) 0%, transparent 70%)" }} />
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto flex flex-col items-center gap-10 relative z-10">
        <div className="backdrop-blur-sm bg-[rgba(33,33,33,0.3)] border border-[#C9A96E] flex items-center gap-2 px-4 py-2">
          <ShieldCheck className="size-6 text-[#C9A96E]" strokeWidth={1.5} />
          <span
            className="text-[14px] text-[#C9A96E] tracking-[0.28px]"
            style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
          >
            {t("exclusive")}
          </span>
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="text-center" style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif" }}>
            <span className="font-medium text-[64px] text-[#C9A96E] leading-none">300+</span>
            <span className="text-[56px] text-[#F5F5F5] leading-none"> </span>
            <span className="text-[36px] md:text-[48px] text-[#F5F5F5] leading-none">{t("heading")}</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <img src="/tours-page/stars-large.svg" alt="5 stars" className="w-[170px] h-[26px]" />
            <p
              className="text-[18px] text-[#999] leading-[1.3]"
              style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
            >
              {t("subtitle")}
            </p>
          </div>
        </div>

        <div className="hidden md:flex flex-col w-full">
          <div className="relative">
            <div className="flex gap-[2px]">
              {REVIEW_PHOTOS.map((photo, i) => (
                <div key={i} className="flex-1 relative h-[355px]">
                  <Image src={photo} alt={`Client photo ${i + 1}`} fill className="object-cover" sizes="25vw" />
                </div>
              ))}
            </div>
            <ArrowButton direction="left" onClick={prevPage} className="absolute -left-[18px] top-1/2 -translate-y-1/2 z-10" />
            <ArrowButton direction="right" onClick={nextPage} className="absolute -right-[18px] top-1/2 -translate-y-1/2 z-10" />
          </div>

          <div className="relative">
            <div className="flex gap-[2px]">
              {dReviews.map((review, i) => (
                <div key={`${dPageIdx}-${i}`} className="flex-1">
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
            {desktopPages > 1 && (
              <>
                <ArrowButton direction="left" onClick={() => setCurrentPage((p) => (p - 1 + desktopPages) % desktopPages)} className="absolute -left-[18px] top-1/2 -translate-y-1/2 z-10" />
                <ArrowButton direction="right" onClick={() => setCurrentPage((p) => (p + 1) % desktopPages)} className="absolute -right-[18px] top-1/2 -translate-y-1/2 z-10" />
              </>
            )}
          </div>
        </div>

        <div className="md:hidden flex flex-col gap-4 w-full" {...swipeHandlers}>
          <div className="relative">
            <div className="relative h-[300px] w-full">
              <Image
                src={REVIEW_PHOTOS[mPhotoIdx]!}
                alt="Client photo"
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
            <ArrowButton direction="left" onClick={prevPage} className="absolute left-2 top-1/2 -translate-y-1/2 z-10" />
            <ArrowButton direction="right" onClick={nextPage} className="absolute right-2 top-1/2 -translate-y-1/2 z-10" />
          </div>

          <ReviewCard review={mReview} />

          <div className="flex gap-[6px] items-center justify-center">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={cn(
                  "rounded-full transition-all",
                  i === currentPage % reviews.length ? "size-[10px] bg-[#C9A96E]" : "size-[6px] bg-[rgba(201,169,110,0.3)]"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
