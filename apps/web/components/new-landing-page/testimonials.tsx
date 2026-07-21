"use client"

import { Component, useState, useMemo, useCallback, useEffect } from "react"
import Image from "next/image"
import { ChevronRight, BadgeCheck, Star } from "lucide-react"
import { useTranslations } from "next-intl"
import { useQuery } from "convex/react"
import { api } from "@workspace/convex/api"
import { useSwipe } from "@/hooks/use-swipe"

const REVIEW_PHOTOS = [
  "/reviews/review-1.webp",
  "/reviews/review-2.webp",
  "/reviews/review-3.webp",
  "/reviews/review-4.webp",
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
    rating: 5,
    text: "Reliable, friendly, and exactly on time. The driver was waiting at arrivals with a name board. Absolutely seamless.",
  },
  {
    name: "Marco Wohlgemuth",
    date: "2 years ago",
    color: "#9c27b0",
    rating: 5,
    text: "Everything worked perfectly and we had a great conversation throughout the drive. The vehicle was immaculate. Can only recommend.",
  },
  {
    name: "Jan Z.",
    date: "2 years ago",
    color: "#1976d2",
    rating: 5,
    text: "We had a great experience — reliable, accessible, and genuinely friendly. The transfer was exactly what we needed. Thank you.",
  },
  {
    name: "Aleks Macura",
    date: "2 years ago",
    color: "#546e7a",
    rating: 5,
    text: "Right on time and easy to find. Communication before arrival was excellent. After the drop-off he even gave us a personal dinner recommendation.",
  },
]

type Review = {
  name: string
  date: string
  color: string
  rating: number
  text: string
  /** Foto real do autor (Google). Sem ela, cai na inicial sobre cor sólida. */
  photo?: string
}

function ReviewCard({ review }: { review: Review }) {
  const initial = review.name.charAt(0).toUpperCase()
  // Uma foto que falhe a carregar não deve deixar o avatar vazio.
  const [photoFailed, setPhotoFailed] = useState(false)
  const showPhoto = !!review.photo && !photoFailed

  return (
    <div className="relative bg-[var(--lm-surface,#1a1a1a)] flex flex-col gap-[11px] px-5 py-6 h-full group overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--lm-accent,#C9A96E)] to-[rgba(var(--lm-accent-rgb,201,169,110),0.3)] opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
      <div className="flex items-center gap-[10px]">
        <div
          className="size-9 rounded-full flex items-center justify-center shrink-0 overflow-hidden relative"
          style={{ backgroundColor: showPhoto ? undefined : review.color }}
        >
          {showPhoto ? (
            <Image
              src={review.photo!}
              alt={review.name}
              fill
              sizes="36px"
              className="object-cover"
              onError={() => setPhotoFailed(true)}
            />
          ) : (
            <span className="text-[14px] text-[var(--lm-text,#fff)]">{initial}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-[var(--lm-text,#fff)] leading-none">{review.name}</p>
          <p className="text-[12px] text-[var(--lm-muted,#8c8680)] leading-none mt-1">{review.date}</p>
        </div>
        <Image
          src="/svgs/google-icon.svg"
          alt="Google"
          width={16}
          height={16}
          className="size-4 shrink-0"
        />
      </div>
      <div className="flex items-center gap-1">
        <span className="text-[12px] text-[var(--lm-accent,#C9A96E)] tracking-[1px]">{"★".repeat(Math.max(1, Math.min(5, Math.round(review.rating))))}</span>
        <div className="size-[14px] rounded-full bg-[#1a73e8] flex items-center justify-center">
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M1.5 4L3 5.5L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <p className="text-[14px] text-[var(--lm-text,#fff)]/55 leading-[1.2]">{review.text}</p>
    </div>
  )
}

type GoogleReviewsData = {
  rating: number
  total: number
  fetchedAt: number
  reviews: {
    author: string
    rating: number
    text: string
    relativeTime: string
    time: number
    profilePhotoUrl?: string
    language?: string
  }[]
}

// The Google reviews come from an optional, cached Convex query. Isolate it in
// an error boundary so a backend hiccup — or the function simply not being
// deployed yet — can never crash the homepage; we fall back to the curated
// reviews instead.
function GoogleReviewsQuery({
  onData,
}: {
  onData: (data: GoogleReviewsData | null) => void
}) {
  const data = useQuery(api.googleReviews.getGoogleReviews)
  useEffect(() => {
    if (data !== undefined) onData(data ?? null)
  }, [data, onData])
  return null
}

class GoogleReviewsBoundary extends Component<
  { onData: (data: GoogleReviewsData | null) => void },
  { failed: boolean }
> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch() {
    // Swallowed on purpose — the curated reviews are shown instead.
  }
  render() {
    if (this.state.failed) return null
    return <GoogleReviewsQuery onData={this.props.onData} />
  }
}

export function Testimonials() {
  const t = useTranslations("testimonials")
  const [currentPage, setCurrentPage] = useState(0)
  const [googleReviews, setGoogleReviews] = useState<GoogleReviewsData | null>(null)
  const featuredReviews = useQuery(api.tourReviews.listFeatured)

  const reviews: Review[] = useMemo(() => {
    // 1) Real Google reviews (cached server-side) take priority.
    const fromGoogle: Review[] = (googleReviews?.reviews ?? []).map((review, i) => ({
      name: review.author,
      date: review.relativeTime || "Recently",
      color: AVATAR_COLORS[i % AVATAR_COLORS.length] ?? "#5f6368",
      rating: review.rating,
      text: review.text,
      photo: review.profilePhotoUrl,
    }))
    if (fromGoogle.length > 0) return fromGoogle

    // 2) Otherwise fall back to the curated reviews managed in the admin.
    const dbReviews: Review[] = (featuredReviews ?? []).map((review, i) => ({
      name: review.author,
      date: new Date(review.createdAt).toLocaleDateString("en-GB"),
      color: AVATAR_COLORS[(i + 4) % AVATAR_COLORS.length] ?? "#5f6368",
      rating: 5 as const,
      text: review.text,
    }))
    return dbReviews.length > 0 ? dbReviews : FALLBACK_REVIEWS
  }, [googleReviews, featuredReviews])

  // Real aggregate from Google (falls back to the original hardcoded values).
  const ratingDisplay = googleReviews?.rating
    ? Number.isInteger(googleReviews.rating)
      ? String(googleReviews.rating)
      : googleReviews.rating.toFixed(1)
    : "5"
  const totalDisplay = googleReviews?.total ?? 322

  const desktopItemsPerPage = 4
  const desktopPages = Math.ceil(reviews.length / desktopItemsPerPage)

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => (prev + 1) % reviews.length)
  }, [reviews.length])

  const prevPage = useCallback(() => {
    setCurrentPage((prev) => (prev - 1 + reviews.length) % reviews.length)
  }, [reviews.length])

  const swipeHandlers = useSwipe(nextPage, prevPage)

  const desktopPageIdx = desktopPages > 0 ? ((currentPage % desktopPages) + desktopPages) % desktopPages : 0
  const desktopReviews = reviews.slice(desktopPageIdx * desktopItemsPerPage, desktopPageIdx * desktopItemsPerPage + desktopItemsPerPage)
  const desktopPhotos = Array.from(
    { length: desktopItemsPerPage },
    (_, i) => REVIEW_PHOTOS[(desktopPageIdx * desktopItemsPerPage + i) % REVIEW_PHOTOS.length]!
  )
  const mobileReview = reviews[currentPage % reviews.length]
  const mobilePhotoIdx = currentPage % REVIEW_PHOTOS.length

  return (
    <section id="reviews" className="bg-[var(--lm-bg,#0D0D0D)] pt-[60px] pb-6 relative">
      <GoogleReviewsBoundary onData={setGoogleReviews} />
      <div className="max-w-[1280px] mx-auto px-4 flex flex-col items-center">
        <div className="group relative overflow-hidden cursor-default backdrop-blur-sm bg-[rgba(var(--lm-accent-rgb,201,169,110),0.08)] border border-[var(--lm-accent,#C9A96E)] flex items-center gap-2 px-4 py-2">
          <div className="pointer-events-none absolute inset-0 w-0 bg-[var(--lm-accent,#C9A96E)] transition-all duration-500 ease-out group-hover:w-full" />
          <BadgeCheck className="relative size-6 text-[var(--lm-accent,#C9A96E)] transition-colors duration-300 group-hover:text-[#0D0D0D]" strokeWidth={1.5} />
          <span className="relative text-[14px] text-[var(--lm-accent,#C9A96E)] tracking-[0.28px] transition-colors duration-300 group-hover:text-[#0D0D0D]">
            {t("exclusive")}
          </span>
        </div>

        <div className="flex flex-col items-center gap-6 w-full mt-10" style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif" }}>
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-px bg-[var(--lm-accent,#C9A96E)]" />
              <span className="text-[12px] font-semibold uppercase tracking-[2px] text-[var(--lm-accent,#C9A96E)]" style={{ fontFamily: "var(--font-sans), Inter, sans-serif" }}>
                {t("sectionLabel")}
              </span>
              <div className="w-8 h-px bg-[var(--lm-accent,#C9A96E)]" />
            </div>
            <h2 className="font-light text-[36px] md:text-[48px] text-[var(--lm-text,#f5f5f5)] text-center leading-none">
              {t("heading")}
            </h2>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <div className="relative">
              <span className="font-semibold text-[64px] md:text-[96px] text-[var(--lm-accent,#ab9c6b)] leading-[0.95] tracking-[0.48px]">{ratingDisplay}</span>
              <Star className="size-6 md:size-[43px] text-[var(--lm-accent,#ab9c6b)] fill-[var(--lm-accent,#ab9c6b)] absolute right-[-28px] md:right-[-44px] top-[12px] md:top-[14px]" />
            </div>
            <div className="w-[2px] h-[40px] md:h-[60px] bg-[var(--lm-text,#fff)] rotate-[12deg] ml-6 md:ml-10" />
            <span className="font-semibold text-[64px] md:text-[96px] text-[var(--lm-accent,#ab9c6b)] leading-[0.95] tracking-[0.48px]">{totalDisplay}</span>
            <span className="font-medium text-[18px] md:text-[24px] text-[var(--lm-accent,#C9A96E)] tracking-[0.24px]">
              {t("reviews")}
            </span>
          </div>

          <div className="text-[28px] md:text-[32px] text-[var(--lm-accent,#C9A96E)] tracking-[2px]">★★★★★</div>

          <div className="flex items-center justify-center gap-6">
            <Image src="/google-logo.png" alt="Google" width={150} height={51} className="h-[36px] md:h-[51px] w-auto" />
            <Image src="/trustpilot-logo-green.svg" alt="Trustpilot" width={188} height={51} className="h-[36px] md:h-[51px] w-auto" unoptimized />
          </div>

          <button
            type="button"
            onClick={nextPage}
            className="group/see mt-2 inline-flex h-[52px] items-center gap-2 bg-[var(--lm-accent,#C9A96E)] px-8 text-[13px] font-semibold uppercase tracking-[1.2px] text-[#1a1510] transition-colors hover:bg-[#d4b87f]"
            style={{ fontFamily: "var(--font-sans), Inter, sans-serif" }}
          >
            {t("seeMore")}
            <ChevronRight className="size-4 transition-transform group-hover/see:translate-x-1" />
          </button>
        </div>

        <div className="hidden md:flex flex-col gap-6 w-full mt-10">
          <div className="relative">
            <div className="flex gap-[2px]">
              {desktopPhotos.map((photo, i) => (
                <div key={`${desktopPageIdx}-${i}`} className="flex-1 relative h-[355px]">
                  <Image
                    src={photo}
                    alt={`Client photo ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="25vw"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-[2px]">
            {desktopReviews.map((review, i) => (
              <div key={`${desktopPageIdx}-${i}`} className="flex-1">
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        </div>

        <div className="md:hidden flex flex-col gap-6 w-full mt-10" {...swipeHandlers}>
          <div className="flex gap-[2px]">
            {[mobilePhotoIdx, (mobilePhotoIdx + 1) % REVIEW_PHOTOS.length].map((idx) => (
              <div key={idx} className="flex-1 relative h-[220px]">
                <Image
                  src={REVIEW_PHOTOS[idx]!}
                  alt={`Client photo ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              </div>
            ))}
          </div>

          <ReviewCard review={mobileReview!} />
        </div>
      </div>
    </section>
  )
}
