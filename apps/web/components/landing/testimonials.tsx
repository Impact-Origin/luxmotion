"use client"

import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Map, Calendar } from "lucide-react"
import { TrustSection } from "@/components/landing/trust-section"
import { useTranslations } from "next-intl"
import { useState, useMemo, useRef, useEffect, useCallback } from "react"
import { useSwipe } from "@/hooks/use-swipe"
import { useQuery } from "convex/react"
import { api } from "@workspace/convex/api"
import {
  GOOGLE_REVIEWS_URL,
  TRUSTPILOT_REVIEWS_URL,
  REVIEW_LINK_PROPS,
} from "@/lib/review-links"

type Testimonial = {
  name: string
  date: string
  initial: string
  color: string
  rating: number
  text: string
  tourTitle?: string | null
  tourSlug?: string | null
  eventTitle?: string | null
  eventSlug?: string | null
}

const AVATAR_COLORS = [
  "bg-purple-600",
  "bg-slate-700",
  "bg-pink-600",
  "bg-emerald-600",
  "bg-blue-600",
  "bg-orange-600",
  "bg-teal-600",
  "bg-rose-600",
]

export function Testimonials() {
  const t = useTranslations("testimonials")
  const [currentIndex, setCurrentIndex] = useState(0)

  const featuredReviews = useQuery(api.tourReviews.listFeatured)

  const images = [
    { src: "/home/testimonials-carousel-1.webp", alt: t("happyCustomers") },
    { src: "/home/testimonials-carousel-2.webp", alt: t("groupTour") },
    { src: "/home/testimonials-carousel-3.webp", alt: t("familyTransfer") },
    { src: "/home/testimonials-carousel-4.jpg", alt: t("luxuryRide") },
    { src: "/home/testimonials-carousel-5.webp", alt: t("airportPickup") },
    { src: "/home/testimonials-carousel-6.webp", alt: t("scenicTour") },
  ]

  const mockTestimonials = [
    {
      name: "yasminn rezende",
      date: "23/11/2022",
      initial: "y",
      color: "bg-purple-600",
      rating: 5,
      text: "On time, really attentive and nice music",
    },
    {
      name: "Ricardo van Mildert",
      date: "21/11/2022",
      initial: "R",
      color: "bg-slate-700",
      rating: 5,
      text: "Had some delay with my plane, but it was no problem. Great conversation, great service!",
    },
    {
      name: "Rebecca .P",
      date: "13/11/2022",
      initial: "R",
      color: "bg-pink-600",
      rating: 5,
      text: "Great!",
    },
  ]

  const testimonials: Testimonial[] = useMemo(() => {
    const dbReviews: Testimonial[] = (featuredReviews ?? []).map((review, i) => ({
      name: review.author,
      date: new Date(review.createdAt).toLocaleDateString("en-GB"),
      initial: review.author.charAt(0).toUpperCase(),
      color: AVATAR_COLORS[(i + 3) % AVATAR_COLORS.length] ?? "bg-purple-600",
      rating: review.rating,
      text: review.text,
      tourTitle: review.tourTitle,
      tourSlug: review.tourSlug,
      eventTitle: review.eventTitle,
      eventSlug: review.eventSlug,
    }))
    return [...mockTestimonials, ...dbReviews]
  }, [featuredReviews])

  const totalImagePages = Math.ceil(images.length / 3)
  const totalReviewPages = Math.ceil(testimonials.length / 3)
  const totalDesktopPages = Math.max(totalImagePages, totalReviewPages)
  const totalMobileItems = Math.max(images.length, testimonials.length)

  const desktopPage = currentIndex
  const mobileImageIndex = currentIndex % images.length
  const mobileReviewIndex = currentIndex % testimonials.length
  const desktopImagePage = currentIndex % totalImagePages
  const desktopReviewPage = currentIndex % totalReviewPages

  const nextMobile = () => setCurrentIndex((prev) => (prev + 1) % totalMobileItems)
  const prevMobile = () => setCurrentIndex((prev) => (prev - 1 + totalMobileItems) % totalMobileItems)
  const nextDesktop = () => setCurrentIndex((prev) => (prev + 1) % totalDesktopPages)
  const prevDesktop = () => setCurrentIndex((prev) => (prev - 1 + totalDesktopPages) % totalDesktopPages)

  const mobileSwipe = useSwipe(nextMobile, prevMobile)

  const imagePages = useMemo(() => {
    const pages = []
    for (let i = 0; i < images.length; i += 3) pages.push(images.slice(i, i + 3))
    return pages
  }, [images.length])

  const reviewPages = useMemo(() => {
    const pages = []
    for (let i = 0; i < testimonials.length; i += 3) pages.push(testimonials.slice(i, i + 3))
    return pages
  }, [testimonials])

  const mobileReviewRef = useRef<HTMLDivElement>(null)
  const desktopReviewRef = useRef<HTMLDivElement>(null)
  const [mobileHeight, setMobileHeight] = useState<number | undefined>(undefined)
  const [desktopHeight, setDesktopHeight] = useState<number | undefined>(undefined)

  const measureHeights = useCallback(() => {
    if (mobileReviewRef.current) {
      const active = mobileReviewRef.current.querySelector<HTMLElement>("[data-active='true']")
      if (active) setMobileHeight(active.scrollHeight)
    }
    if (desktopReviewRef.current) {
      const active = desktopReviewRef.current.querySelector<HTMLElement>("[data-active='true']")
      if (active) setDesktopHeight(active.scrollHeight)
    }
  }, [])

  useEffect(() => {
    measureHeights()
  }, [currentIndex, testimonials, measureHeights])

  return (
    <section id="reviews" data-theme-color="background" className="py-3" style={{ backgroundColor: "var(--theme-background, #ffffff)" }}>
      <div className="mx-auto max-w-7xl px-4 md:px-5 lg:px-6 xl:px-8">
        <TrustSection />
        <div
          data-theme-color="testimonialGradientStart"
          className="px-3 rounded-2xl touch-pan-y"
          style={{
            backgroundImage: "linear-gradient(to bottom, var(--theme-testimonial-gradient-start, #ffffff), var(--theme-testimonial-gradient-end, #dff7ff))",
          }}
          {...mobileSwipe}
        >
          <div className="relative mb-6">
            <div className="md:hidden mx-auto max-w-5xl">
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
                <div className="relative w-full h-full">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                        index === mobileImageIndex ? "opacity-100 scale-100" : "opacity-0 scale-95"
                      }`}
                    >
                      <Image src={image.src} alt={image.alt} fill className="object-cover aspect-square" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="hidden md:block mx-auto max-w-5xl relative">
              {imagePages.map((page, pageIndex) => (
                <div
                  key={pageIndex}
                  className={`grid grid-cols-3 gap-6 transition-all duration-500 ease-in-out ${
                    pageIndex === desktopImagePage ? "opacity-100 relative" : "opacity-0 absolute inset-0 pointer-events-none"
                  }`}
                >
                  {page.map((image, index) => (
                    <div key={index} className="relative aspect-square w-full overflow-hidden rounded-2xl">
                      <Image src={image.src} alt={image.alt} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8 flex items-center justify-center gap-6">
            <a href={GOOGLE_REVIEWS_URL} {...REVIEW_LINK_PROPS} aria-label="Google"
               className="transition-opacity hover:opacity-70">
              <Image src="/shared/logos/google-logo.png" alt="Google" width={100} height={33} className="h-auto w-24" />
            </a>
            <a href={TRUSTPILOT_REVIEWS_URL} {...REVIEW_LINK_PROPS} aria-label="Trustpilot"
               className="transition-opacity hover:opacity-70">
              <Image src="/shared/logos/trustpilot-logo.png" alt="Trustpilot" width={120} height={33} className="h-auto w-28" />
            </a>
          </div>

          <div className="mx-auto max-w-5xl">
            <div
              ref={mobileReviewRef}
              className="md:hidden relative overflow-hidden transition-[height] duration-500 ease-in-out"
              style={{ height: mobileHeight ? `${mobileHeight}px` : "auto" }}
            >
              {testimonials.map((testimonial, index) => {
                const isActive = index === mobileReviewIndex
                return (
                  <div
                    key={index}
                    data-active={isActive}
                    data-theme-color="cardBg"
                    className={`rounded-2xl p-6 shadow-lg transition-all duration-500 ease-in-out ${
                      isActive ? "opacity-100 translate-x-0" : "opacity-0 absolute inset-0 translate-x-4"
                    }`}
                    style={{ backgroundColor: "var(--theme-card-bg, #ffffff)" }}
                  >
                    <ReviewCard testimonial={testimonial} />
                  </div>
                )
              })}
            </div>

            <div
              ref={desktopReviewRef}
              className="hidden md:block relative overflow-hidden transition-[height] duration-500 ease-in-out"
              style={{ height: desktopHeight ? `${desktopHeight}px` : "auto" }}
            >
              {reviewPages.map((page, pageIndex) => {
                const isActive = pageIndex === desktopReviewPage
                return (
                  <div
                    key={pageIndex}
                    data-active={isActive}
                    className={`grid grid-cols-3 gap-6 transition-all duration-500 ease-in-out ${
                      isActive ? "opacity-100 relative" : "opacity-0 absolute inset-0 pointer-events-none"
                    }`}
                  >
                    {page.map((testimonial, index) => (
                      <div key={index} data-theme-color="cardBg" className="rounded-2xl p-6 shadow-lg mb-5" style={{ backgroundColor: "var(--theme-card-bg, #ffffff)" }}>
                        <ReviewCard testimonial={testimonial} />
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="md:hidden mt-8 flex items-center justify-center gap-3 pb-4">
            <button
              onClick={prevMobile}
              data-theme-color="buttonBg"
              className="flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-all duration-200"
              style={{ backgroundColor: "var(--theme-button-bg, #bceeff)" }}
            >
              <ChevronLeft className="h-5 w-5" style={{ color: "var(--theme-button-text, #ffffff)" }} />
            </button>
            <div className="flex gap-1.5">
              {Array.from({ length: totalMobileItems }).map((_, i) => (
                <div
                  key={i}
                  data-theme-color="primary"
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentIndex ? "w-6" : "w-2"
                  }`}
                  style={{ backgroundColor: i === currentIndex ? "var(--theme-primary, #27c7ff)" : "color-mix(in srgb, var(--theme-primary, #27c7ff) 45%, white)" }}
                />
              ))}
            </div>
            <button
              onClick={nextMobile}
              data-theme-color="buttonBg"
              className="flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-all duration-200"
              style={{ backgroundColor: "var(--theme-button-bg, #bceeff)" }}
            >
              <ChevronRight className="h-5 w-5" style={{ color: "var(--theme-button-text, #ffffff)" }} />
            </button>
          </div>

          {totalDesktopPages > 1 && (
            <div className="hidden md:flex mt-8 items-center justify-center gap-3 pb-4">
              <button
                onClick={prevDesktop}
                data-theme-color="buttonBg"
                className="flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-all duration-200"
                style={{ backgroundColor: "var(--theme-button-bg, #bceeff)" }}
              >
                <ChevronLeft className="h-5 w-5" style={{ color: "var(--theme-button-text, #ffffff)" }} />
              </button>
              <div className="flex gap-1.5">
                {Array.from({ length: totalDesktopPages }).map((_, i) => (
                  <div
                    key={i}
                    data-theme-color="primary"
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === desktopPage ? "w-6" : "w-2"
                    }`}
                    style={{ backgroundColor: i === desktopPage ? "var(--theme-primary, #27c7ff)" : "color-mix(in srgb, var(--theme-primary, #27c7ff) 45%, white)" }}
                  />
                ))}
              </div>
              <button
                onClick={nextDesktop}
                data-theme-color="buttonBg"
                className="flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-all duration-200"
                style={{ backgroundColor: "var(--theme-button-bg, #bceeff)" }}
              >
                <ChevronRight className="h-5 w-5" style={{ color: "var(--theme-button-text, #ffffff)" }} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function ReviewCard({ testimonial }: { testimonial: Testimonial }) {
  const linkHref = testimonial.tourSlug
    ? `/tours/tour/${testimonial.tourSlug}`
    : testimonial.eventSlug
      ? `/events/${testimonial.eventSlug}`
      : null

  const linkLabel = testimonial.tourTitle || testimonial.eventTitle
  const isTour = !!testimonial.tourSlug

  return (
    <>
      <div className="mb-4 flex items-center gap-3">
        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${testimonial.color} text-xl font-bold text-white`}>
          {testimonial.initial}
        </div>
        <div className="flex-1">
          <h3 data-theme-color="headingText" className="font-semibold" style={{ color: "var(--theme-heading-text, #0f172a)" }}>{testimonial.name}</h3>
          <p data-theme-color="mutedText" className="text-xs" style={{ color: "var(--theme-muted-text, #64748b)" }}>{testimonial.date}</p>
        </div>
      </div>
      <div className="mb-3 flex gap-0.5" data-theme-color="primary">
        {[...Array(testimonial.rating)].map((_, i) => (
          <svg key={i} className="h-5 w-5" viewBox="0 0 20 20" style={{ fill: "var(--theme-primary, #27c7ff)" }}>
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
      </div>
      <p data-theme-color="bodyText" className="text-sm" style={{ color: "var(--theme-body-text, #475569)" }}>{testimonial.text}</p>
      {linkHref && linkLabel && (
        <Link href={linkHref} data-theme-color="linkText" className="mt-3 flex items-center gap-1.5 text-xs transition-colors group" style={{ color: "var(--theme-link-text, #0891b2)" }}>
          {isTour ? <Map className="h-3.5 w-3.5 shrink-0" /> : <Calendar className="h-3.5 w-3.5 shrink-0" />}
          <span className="truncate group-hover:underline">{linkLabel}</span>
        </Link>
      )}
    </>
  )
}
