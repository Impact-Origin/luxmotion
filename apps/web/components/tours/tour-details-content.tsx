"use client"

import { useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { type TourData } from "@/app/(landing)/tours/tour/[slug]/page"
import type { Id } from "@workspace/convex/dataModel"
import { TourDetailsHero } from "./tour-details-hero"
import { TourDetailsHeader } from "./tour-details-header"
import { TourBookingCard } from "./tour-booking-card"
import { DailyTravelersBadge } from "@/components/ui/daily-travelers-badge"
import { TourInfoBoxes } from "./tour-info-boxes"
import { TourAboutSection } from "./tour-about-section"
import { TourIncludedExcluded } from "./tour-included-excluded"
import { TourItinerary } from "./tour-itinerary"
import { TourMeetingPoints } from "./tour-meeting-points"
import { TourReviews } from "./tour-reviews"
import { TopPicksSection } from "./top-picks-section"
import { useTourCheckout } from "./tour-checkout-context"
import { AddonCarouselSection } from "@/components/shared/addon-carousel-section"

interface TourDetailsContentProps {
  tour: TourData
}

export function TourDetailsContent({ tour }: TourDetailsContentProps) {
  const { openCheckout } = useTourCheckout()
  const searchParams = useSearchParams()
  const hasOpenedCheckout = useRef(false)

  useEffect(() => {
    if (searchParams.get("openCheckout") === "true" && tour._id && !hasOpenedCheckout.current) {
      hasOpenedCheckout.current = true
      const dateStr = searchParams.get("date")
      const date = dateStr ? new Date(dateStr) : null
      const time = searchParams.get("time")
      const adults = parseInt(searchParams.get("adults") || "1", 10)
      const children = parseInt(searchParams.get("children") || "0", 10)
      const infants = parseInt(searchParams.get("infants") || "0", 10)
      const guests = adults + children + infants || 1
      const total = tour.price * guests

      const productType = tour.category === "experiences" ? "experience" : "tour"

      setTimeout(() => {
        openCheckout(
          productType,
          {
            _id: tour._id!,
            title: tour.title,
            slug: tour.slug,
            price: tour.price,
            currency: tour.currency ?? "€",
            image: tour.bannerImage,
            pickup: tour.pickup,
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
  }, [searchParams, tour, openCheckout])

  const handleBook = (data: {
    date: Date | null; time: string | null; adults: number; children: number; infants: number; total: number;
    selectedAddons?: Array<{ addonId: string; title: string; price: number; pricingType: "per_person" | "flat"; quantity: number; subtotal: number }>;
    addonsTotal?: number;
  }) => {
    if (!tour._id) return
    const productType = tour.category === "experiences" ? "experience" : "tour"
    openCheckout(
      productType,
      {
        _id: tour._id,
        title: tour.title,
        slug: tour.slug,
        price: tour.price,
        currency: tour.currency ?? "€",
        image: tour.bannerImage,
        pickup: tour.pickup,
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

  return (
    <div className="w-full">
      <TourDetailsHero
        image={tour.bannerImage}
        additionalBanners={tour.additionalBanners}
        alt={tour.title}
      />

      <div className="px-4 md:px-5 lg:px-6 xl:px-8">
        <div className="max-w-7xl mx-auto">
          <TourDetailsHeader title={tour.title} rating={tour.rating} tags={tour.tags} />

          <div className="flex flex-col lg:flex-row lg:gap-8">
            <div className="flex-1 min-w-0 pt-6">
              <TourInfoBoxes
                duration={tour.duration}
                tourType={tour.tourType}
                groupSize={tour.groupSize}
                languages={tour.languages}
              />

              <div className="border-t border-[#dedede] mt-10 pt-10">
                <TourAboutSection description={tour.description} />
              </div>

              <div className="mt-10">
                <TourIncludedExcluded
                  included={tour.included}
                  excluded={tour.excluded}
                />
              </div>

              {tour.addons && tour.addons.length > 0 && (
                <AddonCarouselSection addons={tour.addons} />
              )}

              <div id="tour-map" className="border-t border-[#dedede] mt-10 pt-10 scroll-mt-24">
                <TourItinerary
                  items={tour.itinerary}
                  mapCenter={tour.mapCenter}
                  pickup={tour.pickup}
                  dropoff={tour.dropoff}
                />
              </div>

              <div className="border-t border-[#dedede] mt-10 pt-10">
                <TourMeetingPoints
                  pickup={tour.pickup}
                  dropoff={tour.dropoff}
                  hasMapSection={true}
                />
              </div>

              <div className="border-t border-[#dedede] mt-10 pt-10 pb-10">
                {tour._id && (
                  <TourReviews
                    tourId={tour._id as Id<"tours">}
                    rating={tour.rating}
                    reviewCount={tour.reviewCount}
                    reviews={tour.reviews}
                  />
                )}
              </div>
            </div>

            <div className="hidden lg:block w-[29%] min-w-[320px] max-w-[380px] shrink-0 pt-6">
              <div className="sticky top-[70px] flex flex-col gap-6">
                <TourBookingCard
                  price={tour.price}
                  rating={tour.rating}
                  reviewCount={tour.reviewCount}
                  tourId={tour._id || undefined}
                  minPassengers={tour.minPassengers}
                  maxPassengers={tour.maxPassengers}
                  addons={tour.addons}
                  onBook={handleBook}
                />
                <div className="flex justify-center w-full">
                  <DailyTravelersBadge seedSuffix="tours" min={55} max={125} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden px-4 pb-8 flex flex-col gap-6">
        <TourBookingCard
          price={tour.price}
          rating={tour.rating}
          reviewCount={tour.reviewCount}
          tourId={tour._id || undefined}
          minPassengers={tour.minPassengers}
          maxPassengers={tour.maxPassengers}
          addons={tour.addons}
          onBook={handleBook}
        />
        <div className="flex justify-center w-full">
          <DailyTravelersBadge seedSuffix="tours" min={55} max={125} />
        </div>
      </div>

      <TopPicksSection />
    </div>
  )
}
