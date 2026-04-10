"use client"

import { useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { Star, Calendar, MapPin, Clock, Users, ArrowRight } from "lucide-react"
import { RatingStars } from "@/components/shared/rating-stars"
import { TipTapRenderer } from "@/components/shared/tiptap-renderer"
import { TourBookingCard } from "@/components/tours/tour-booking-card"
import { DailyTravelersBadge } from "@/components/ui/daily-travelers-badge"
import { useTourCheckout } from "@/components/tours/tour-checkout-context"
import { TourDetailsHero, type MediaItem } from "@/components/tours/tour-details-hero"
import { EventLocationMap } from "./event-location-map"
import { AddonCarouselSection } from "@/components/shared/addon-carousel-section"

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

export interface EventDetailsData {
  _id?: string
  slug: string
  title: string
  subtitle?: string
  description: string | Record<string, any>
  location: string
  venue?: string
  eventDate: number
  endDate?: number
  bannerImage: string
  additionalBannerImages?: string[]
  images?: string[]
  basePrice: number
  originalPrice?: number
  currency: string
  maxCapacity?: number
  minPassengers?: number
  maxPassengers?: number
  rating?: number
  reviewCount?: number
  tags?: string[]
  included?: string[]
  excluded?: string[]
  meetingPoint?: {
    title: string
    address: string
    description?: string
    lat?: number
    lng?: number
  }
  addons?: {
    _id: string
    title: string
    description?: string
    imageUrl?: string | null
    price: number
    pricingType: "per_person" | "flat"
    currency: string
  }[]
  reviews?: {
    author: string
    avatar?: string
    rating: number
    text: string
    source?: string
    nationality?: string
    createdAt?: number
  }[]
}

interface EventDetailsContentProps {
  event: EventDetailsData
}

export function EventDetailsContent({ event }: EventDetailsContentProps) {
  const t = useTranslations("eventDetails")
  const { openCheckout } = useTourCheckout()
  const searchParams = useSearchParams()
  const hasOpenedCheckout = useRef(false)

  useEffect(() => {
    if (searchParams.get("openCheckout") === "true" && event._id && !hasOpenedCheckout.current) {
      hasOpenedCheckout.current = true
      const dateStr = searchParams.get("date")
      const date = dateStr ? new Date(dateStr) : new Date(event.eventDate)
      const time = searchParams.get("time") || new Date(event.eventDate).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
      const adults = parseInt(searchParams.get("adults") || "1", 10)
      const children = parseInt(searchParams.get("children") || "0", 10)
      const infants = parseInt(searchParams.get("infants") || "0", 10)
      const guests = adults + children + infants || 1
      const total = event.basePrice * guests

      setTimeout(() => {
        openCheckout(
          "event",
          {
            _id: event._id!,
            title: event.title,
            slug: event.slug,
            price: event.basePrice,
            currency: event.currency ?? "€",
            image: event.bannerImage,
            meetingPoint: event.meetingPoint,
          },
          {
            date,
            time,
            adults,
            children,
            infants,
            total,
          }
        )
      }, 100)
    }
  }, [searchParams, event, openCheckout])

  const handleBook = (data: {
    date: Date | null; time: string | null; adults: number; children: number; infants: number; total: number;
    selectedAddons?: Array<{ addonId: string; title: string; price: number; pricingType: "per_person" | "flat"; quantity: number; subtotal: number }>;
    addonsTotal?: number;
  }) => {
    if (!event._id) return
    openCheckout(
      "event",
      {
        _id: event._id,
        title: event.title,
        slug: event.slug,
        price: event.basePrice,
        currency: event.currency ?? "€",
        image: event.bannerImage,
        meetingPoint: event.meetingPoint,
      },
      {
        date: data.date,
        time: data.time,
        adults: data.adults,
        children: data.children,
        infants: data.infants,
        total: data.total,
        selectedAddons: data.selectedAddons,
        addonsTotal: data.addonsTotal,
      }
    )
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case "EUR":
        return "€"
      case "USD":
        return "$"
      case "GBP":
        return "£"
      default:
        return currency
    }
  }

  return (
    <div className="w-full">
      <TourDetailsHero
        image={event.bannerImage}
        additionalBanners={
          (event.additionalBannerImages ?? []).map(
            (url): MediaItem => ({ url, type: "image" })
          )
        }
        alt={event.title}
      />

      <div className="px-4 md:px-5 lg:px-6 xl:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="pt-[50px] pb-[17px]">
            <h1 className="text-[32px] lg:text-[40px] font-bold text-[#070d0f] leading-[1.3] mb-4 lg:mb-[31px] break-words">
              {event.title}
            </h1>

            <div className="hidden lg:flex items-center gap-6">
              {event.rating !== undefined && event.rating > 0 && (
                <RatingStars rating={event.rating} />
              )}
              <div className="flex flex-wrap gap-4">
                {event.tags?.map((tag) => (
                  <div
                    key={tag}
                    className="bg-[#e9f9ff] rounded-[5px] px-6 py-[10px] flex items-center justify-center h-[36px] whitespace-nowrap"
                  >
                    <span className="text-[#0e4659] text-[12px] lg:text-[14px] font-medium leading-[15px]">
                      {tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:hidden flex flex-col gap-4">
              {event.rating !== undefined && event.rating > 0 && (
                <RatingStars rating={event.rating} />
              )}
              <div className="overflow-x-auto scrollbar-hide touch-pan-y" style={{ WebkitOverflowScrolling: "touch" }}>
                <div className="flex gap-3 w-max">
                  {event.tags?.map((tag) => (
                    <div
                      key={tag}
                      className="bg-[#e9f9ff] rounded-[5px] px-6 py-[10px] flex items-center justify-center h-[36px] whitespace-nowrap"
                    >
                      <span className="text-[#0e4659] text-[12px] lg:text-[14px] font-medium leading-[15px]">
                        {tag}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:gap-8">
            <div className="flex-1 min-w-0 pt-6">
              <div className="flex flex-wrap gap-6 items-start mb-8">
                <div className="flex gap-[15px] items-center shrink-0">
                  <div className="size-[42px] rounded-[10px] border border-[#adadad] bg-white flex items-center justify-center shrink-0">
                    <Calendar className="size-5 text-[#222]" strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[13px] font-medium text-[#222] leading-[16px]">{t("date")}</span>
                    <span className="text-[13px] text-[#808080] leading-[1.2]">{formatDate(event.eventDate)}</span>
                  </div>
                </div>
                <div className="flex gap-[15px] items-center shrink-0">
                  <div className="size-[42px] rounded-[10px] border border-[#adadad] bg-white flex items-center justify-center shrink-0">
                    <Clock className="size-5 text-[#222]" strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[13px] font-medium text-[#222] leading-[16px]">{t("time")}</span>
                    <span className="text-[13px] text-[#808080] leading-[1.2]">
                      {formatTime(event.eventDate)}
                      {event.endDate && ` - ${formatTime(event.endDate)}`}
                    </span>
                  </div>
                </div>
                <div className="flex gap-[15px] items-center shrink-0">
                  <div className="size-[42px] rounded-[10px] border border-[#adadad] bg-white flex items-center justify-center shrink-0">
                    <MapPin className="size-5 text-[#222]" strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[13px] font-medium text-[#222] leading-[16px]">{t("location")}</span>
                    <span className="text-[13px] text-[#808080] leading-[1.2]">{event.location}</span>
                  </div>
                </div>
                {event.maxCapacity && (
                  <div className="flex gap-[15px] items-center shrink-0">
                    <div className="size-[42px] rounded-[10px] border border-[#adadad] bg-white flex items-center justify-center shrink-0">
                      <Users className="size-5 text-[#222]" strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[13px] font-medium text-[#222] leading-[16px]">{t("capacity")}</span>
                      <span className="text-[13px] text-[#808080] leading-[1.2]">{t("maxCapacity", { count: event.maxCapacity })}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-[#dedede] mt-10 pt-10">
                <h2 className="text-[24px] font-bold text-[#27c7ff] leading-[1.3] mb-4">{t("aboutThisEvent")}</h2>
                <TipTapRenderer
                  content={event.description}
                  className="text-[14px] lg:text-[16px] text-[#5f686c] leading-[1.6]"
                />
              </div>

              {(event.included?.length || event.excluded?.length) && (
                <div className="mt-8">
                  <div className="flex flex-col lg:flex-row gap-6 w-full">
                    {event.included && event.included.length > 0 && (
                      <div className="flex-1 bg-[rgba(210,255,226,0.2)] border border-[#bbf7d0] rounded-[8px] p-6">
                        <h3 className="text-[18px] font-bold text-[#0c171c] leading-none mb-4">{t("included")}</h3>
                        <div className="flex flex-col gap-4 py-[5px]">
                          {event.included.map((item, idx) => (
                            <div key={idx} className="flex gap-[10px] items-center">
                              <Image
                                src="/svgs/included_check.svg"
                                alt=""
                                width={23}
                                height={23}
                                className="shrink-0"
                              />
                              <span className="text-[14px] text-[#7a7a7a] leading-[1.2]">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {event.excluded && event.excluded.length > 0 && (
                      <div className="flex-1 bg-[#ffeadf] border border-[#ffb188] rounded-[8px] px-6 py-[19px]">
                        <h3 className="text-[18px] font-bold text-[#0c171c] leading-none mb-4">{t("excluded")}</h3>
                        <div className="flex flex-col gap-4 py-[5px]">
                          {event.excluded.map((item, idx) => (
                            <div key={idx} className="flex gap-[10px] items-center">
                              <Image
                                src="/svgs/excluded_cross.svg"
                                alt=""
                                width={23}
                                height={23}
                                className="shrink-0"
                              />
                              <span className="text-[14px] text-[#7a7a7a] leading-[1.2]">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {event.addons && event.addons.length > 0 && (
                <AddonCarouselSection addons={event.addons} />
              )}

              {event.meetingPoint?.lat && event.meetingPoint?.lng && (
                <div id="event-location" className="mt-8 border-t border-[#dedede] pt-8 scroll-mt-24">
                  <h2 className="text-[24px] font-bold text-[#0c171c] leading-[1.3] mb-6">{t("location")}</h2>
                  <EventLocationMap
                    title={event.meetingPoint.title}
                    address={event.meetingPoint.address}
                    lat={event.meetingPoint.lat}
                    lng={event.meetingPoint.lng}
                    className="h-[500px]"
                  />
                </div>
              )}

              {event.meetingPoint && (
                <div className="mt-8 border-t border-[#dedede] pt-8 mb-8">
                  <h2 className="text-[24px] font-bold text-[#0c171c] leading-[1.3] mb-6">{t("meetingPoint")}</h2>
                  <button
                    onClick={() => {
                      if (event.meetingPoint?.lat && event.meetingPoint?.lng) {
                        const locationSection = document.getElementById("event-location")
                        if (locationSection) {
                          locationSection.scrollIntoView({ behavior: "smooth" })
                          setTimeout(() => {
                            window.dispatchEvent(new CustomEvent("event-map-focus"))
                          }, 500)
                        }
                      } else {
                        const query = encodeURIComponent(event.meetingPoint?.address || event.meetingPoint?.title || "")
                        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank")
                      }
                    }}
                    className="group w-full text-left bg-[#27c7ff] rounded-[20px] px-5 py-6 flex flex-col gap-4 hover:bg-[#20b8ef] transition-colors cursor-pointer"
                  >
                    <h3 className="text-[18px] lg:text-[18.6px] font-bold text-[#0e4659] leading-[1.2] tracking-[-0.5px]">
                      {event.meetingPoint.title}
                    </h3>
                    <p className="text-[14px] text-[#0e4659] leading-[22.4px] tracking-[-0.2px]">
                      {event.meetingPoint.address}
                    </p>
                    {event.meetingPoint.description && (
                      <div className="flex items-center gap-2">
                        <span className="text-[15px] lg:text-[15.1px] font-medium text-[#0e4659] leading-[19.2px]">
                          {event.meetingPoint.description}
                        </span>
                        <div className="size-[28px] rounded-full bg-white flex items-center justify-center transition-transform group-hover:translate-x-1">
                          <ArrowRight className="size-[18px] text-[#0e4659]" />
                        </div>
                      </div>
                    )}
                  </button>
                </div>
              )}

              {event.reviews && event.reviews.length > 0 && (
                <div className="mt-8 border-t border-[#dedede] pt-8 pb-10">
                  <h2 className="text-[24px] font-bold text-[#0c171c] leading-[1.3] mb-4">{t("reviews")}</h2>
                  {event.rating !== undefined && event.rating > 0 && (
                    <div className="flex items-center gap-1 mb-6">
                      <HeaderStars rating={event.rating} />
                      <span className="text-[20px] font-bold text-[#0c171c] leading-[22px] ml-1">
                        {event.rating.toFixed(1)}
                      </span>
                      <span className="text-[14px] text-[#5f686c] leading-[22px] ml-1">
                        ({event.reviewCount} {t("reviewsCount")})
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col gap-4">
                    {event.reviews.map((review, idx) => (
                      <div key={idx} className="bg-white border border-[#dedede] rounded-[12px] p-5 flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                          <ReviewStars rating={review.rating} />
                          <p className="text-[14px] text-[#5f686c] leading-[1.6]">{review.text}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          {review.avatar ? (
                            <Image
                              src={review.avatar}
                              alt={review.author}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="size-10 rounded-full bg-[#27c7ff] flex items-center justify-center shrink-0">
                              <span className="text-[16px] font-medium text-[#0e4659]">
                                {review.source?.charAt(0).toUpperCase() || review.author.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="text-[14px] font-semibold text-[#0c171c] leading-[1.2]">
                              {review.source || review.author}
                            </span>
                            <span className="text-[12px] text-[#5f686c] leading-[1.2]">
                              {review.nationality || t("unknownNationality")}
                            </span>
                            {review.createdAt && (
                              <span className="text-[12px] text-[#5f686c] leading-[1.2]">
                                {new Date(review.createdAt).toLocaleDateString(undefined, { month: "short", year: "numeric" })}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="hidden lg:block w-[29%] min-w-[320px] max-w-[380px] shrink-0 pt-6">
              <div className="sticky top-[70px] flex flex-col gap-6">
                <TourBookingCard
                  price={event.basePrice}
                  rating={event.rating ?? 0}
                  reviewCount={event.reviewCount ?? 0}
                  tourId={event._id}
                  skipAvailability
                  fixedDateTime={event.eventDate}
                  hideReviews
                  minPassengers={event.minPassengers}
                  maxPassengers={event.maxPassengers}
                  addons={event.addons}
                  onBook={handleBook}
                />
                <DailyTravelersBadge seedSuffix="tours" min={55} max={125} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden px-4 pb-8 flex flex-col gap-6">
        <TourBookingCard
          price={event.basePrice}
          rating={event.rating ?? 0}
          reviewCount={event.reviewCount ?? 0}
          tourId={event._id}
          skipAvailability
          fixedDateTime={event.eventDate}
          hideReviews
          minPassengers={event.minPassengers}
          maxPassengers={event.maxPassengers}
          addons={event.addons}
          onBook={handleBook}
        />
        <DailyTravelersBadge seedSuffix="tours" min={55} max={125} />
      </div>
    </div>
  )
}
