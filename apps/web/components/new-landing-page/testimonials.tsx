"use client"

import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Map, Calendar } from "lucide-react"
import { TrustSection } from "@/components/new-landing-page/trust-section"
import { useTranslations } from "next-intl"
import { useState, useMemo, useRef, useEffect, useCallback } from "react"
import { useSwipe } from "@/hooks/use-swipe"
import { useQuery } from "convex/react"
import { api } from "@workspace/convex/api"

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
    { src: "/testimonials-carousel-1.png", alt: t("happyCustomers") },
    { src: "/testimonials-carousel-2.png", alt: t("groupTour") },
    { src: "/testimonials-carousel-3.png", alt: t("familyTransfer") },
    { src: "/testimonials-carousel-4.jpg", alt: t("luxuryRide") },
    { src: "/testimonials-carousel-5.jpg", alt: t("airportPickup") },
    { src: "/testimonials-carousel-6.jpg", alt: t("scenicTour") },
  ]

  const mockTestimonials = [
    {
      name: "yasminn rezende",
      date: "23/11/2022",
      initial: "y",
      color: "bg-purple-600",
      rating: 5,
      text: "On time, really attentive and nice music 😎",
    },
    {
      name: "Ricardo van Mildert",
      date: "21/11/2022",
      initial: "R",
      color: "bg-slate-700",
      rating: 5,
      text: "Had some delay with my plane, but it was absolutely no problem to them. Great conversation, great service!",
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

  const nextMobile = () => {
    setCurrentIndex((prev) => (prev + 1) % totalMobileItems)
  }

  const prevMobile = () => {
    setCurrentIndex((prev) => (prev - 1 + totalMobileItems) % totalMobileItems)
  }

  const nextDesktop = () => {
    setCurrentIndex((prev) => (prev + 1) % totalDesktopPages)
  }

  const prevDesktop = () => {
    setCurrentIndex((prev) => (prev - 1 + totalDesktopPages) % totalDesktopPages)
  }

  const mobileSwipe = useSwipe(nextMobile, prevMobile)

  const imagePages = useMemo(() => {
    const pages = []
    for (let i = 0; i < images.length; i += 3) {
      pages.push(images.slice(i, i + 3))
    }
    return pages
  }, [images.length])

  const reviewPages = useMemo(() => {
    const pages = []
    for (let i = 0; i < testimonials.length; i += 3) {
      pages.push(testimonials.slice(i, i + 3))
    }
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
    <section id="reviews" className="py-3">
      <div className="mx-auto max-w-7xl px-4 md:px-5 lg:px-6 xl:px-8">
        <TrustSection />
        <div className="bg-gradient-to-b from-white via-cyan-50/80 to-cyan-100/30 px-3 rounded-2xl touch-pan-y" {...mobileSwipe}>
          {/* Images carousel */}
          <div className="relative mb-6">
            <div className="md:hidden mx-auto max-w-5xl">
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
                <div className="relative w-full h-full">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                        index === mobileImageIndex
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-95"
                      }`}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover aspect-square"
                      />
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
                    pageIndex === desktopImagePage
                      ? "opacity-100 relative"
                      : "opacity-0 absolute inset-0 pointer-events-none"
                  }`}
                >
                  {page.map((image, index) => (
                    <div key={index} className="relative aspect-square w-full overflow-hidden rounded-2xl">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Logos */}
          <div className="mb-8 flex items-center justify-center gap-6">
            <Image src="/google-logo.png" alt="Google" width={100} height={33} className="h-auto w-24" />
            <Image src="/trustpilot-logo.png" alt="Trustpilot" width={120} height={33} className="h-auto w-28" />
          </div>

          {/* Reviews carousel */}
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
                    className={`rounded-2xl bg-white p-6 shadow-lg transition-all duration-500 ease-in-out ${
                      isActive
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 absolute inset-0 translate-x-4"
                    }`}
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
                      isActive
                        ? "opacity-100 relative"
                        : "opacity-0 absolute inset-0 pointer-events-none"
                    }`}
                  >
                    {page.map((testimonial, index) => (
                      <div key={index} className="rounded-2xl bg-white p-6 shadow-lg mb-5">
                        <ReviewCard testimonial={testimonial} />
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Unified navigation — mobile */}
          <div className="md:hidden mt-8 flex items-center justify-center gap-3 pb-4">
            <button
              onClick={prevMobile}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#bceeff] hover:bg-[#a8e6ff] shadow-lg transition-all duration-200"
            >
              <ChevronLeft className="h-5 w-5 text-[#27c7ff]" />
            </button>
            <div className="flex gap-1.5">
              {Array.from({ length: totalMobileItems }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentIndex ? "bg-cyan-400 w-6" : "bg-cyan-200 w-2"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={nextMobile}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#bceeff] hover:bg-[#a8e6ff] shadow-lg transition-all duration-200"
            >
              <ChevronRight className="h-5 w-5 text-[#27c7ff]" />
            </button>
          </div>

          {/* Unified navigation — desktop */}
          {totalDesktopPages > 1 && (
            <div className="hidden md:flex mt-8 items-center justify-center gap-3 pb-4">
              <button
                onClick={prevDesktop}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#bceeff] hover:bg-[#a8e6ff] shadow-lg transition-all duration-200"
              >
                <ChevronLeft className="h-5 w-5 text-[#27c7ff]" />
              </button>
              <div className="flex gap-1.5">
                {Array.from({ length: totalDesktopPages }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === desktopPage ? "bg-cyan-400 w-6" : "bg-cyan-200 w-2"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextDesktop}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#bceeff] hover:bg-[#a8e6ff] shadow-lg transition-all duration-200"
              >
                <ChevronRight className="h-5 w-5 text-[#27c7ff]" />
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
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full ${testimonial.color} text-xl font-bold text-white`}
        >
          {testimonial.initial}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900">{testimonial.name}</h3>
          <p className="text-xs text-slate-500">{testimonial.date}</p>
        </div>
      </div>
      <div className="mb-3 flex gap-0.5">
        {[...Array(testimonial.rating)].map((_, i) => (
          <svg key={i} className="h-5 w-5 fill-cyan-400" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
      </div>
      <p className="text-sm text-slate-600">{testimonial.text}</p>
      {linkHref && linkLabel && (
        <Link
          href={linkHref}
          className="mt-3 flex items-center gap-1.5 text-xs text-cyan-600 hover:text-cyan-700 transition-colors group"
        >
          {isTour ? (
            <Map className="h-3.5 w-3.5 shrink-0" />
          ) : (
            <Calendar className="h-3.5 w-3.5 shrink-0" />
          )}
          <span className="truncate group-hover:underline">{linkLabel}</span>
        </Link>
      )}
    </>
  )
}
