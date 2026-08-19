"use client"

import { type TourData } from "@/lib/tour-view-model"
import type { ItineraryDay } from "@/hooks/use-tour-data"
import type { Id } from "@workspace/convex/dataModel"
import { UltraTourGallery } from "./ultra-tour-gallery"
import { UltraTourHeader } from "./ultra-tour-header"
import { UltraTourAbout } from "./ultra-tour-about"
import { UltraTourIncludedExcluded } from "./ultra-tour-included-excluded"
import { UltraTourItinerary } from "./ultra-tour-itinerary"
import { UltraTourMeetingPoints } from "./ultra-tour-meeting-points"
import { UltraTourExtras } from "./ultra-tour-extras"
import { UltraTourReviews } from "./ultra-tour-reviews"
import { UltraTourInquiryWidget } from "./ultra-tour-inquiry-widget"
import { useState, useCallback } from "react"

export function UltraTourDetailContent({
  tour,
  destination,
  itineraryDays,
}: {
  tour: TourData
  destination: string
  itineraryDays?: ItineraryDay[]
}) {
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([])
  const toggleAddon = useCallback((id: string) => {
    setSelectedAddonIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }, [])

  const sidebarWidget = (
    <UltraTourInquiryWidget
      price={tour.price}
      currency={tour.currency || "€"}
      rating={tour.rating}
      reviewCount={tour.reviewCount}
      tourTitle={tour.title}
      tourId={tour._id || undefined}
      tourSlug={tour.slug}
    />
  )

  return (
    <div className="w-full bg-white">
      <UltraTourGallery image={tour.bannerImage} additionalBanners={tour.additionalBanners} alt={tour.title} />

      <div className="px-4 md:px-5 lg:px-6 xl:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row lg:gap-8">
            <div className="min-w-0 flex-1">
              <UltraTourHeader
                title={tour.title}
                rating={tour.rating}
                reviewCount={tour.reviewCount}
                destination={destination}
                duration={tour.duration}
                tourType={tour.tourType}
                groupSize={tour.groupSize}
                languages={tour.languages}
              />

              <div className="mt-8">
                <UltraTourAbout description={tour.description} />
              </div>

              <div className="mt-10">
                <UltraTourIncludedExcluded included={tour.included} excluded={tour.excluded} />
              </div>

              {(tour.itinerary.length > 0 || (itineraryDays && itineraryDays.length > 0)) && (
                <div id="tour-map" className="mt-10 scroll-mt-24 border-t border-[rgba(28,27,24,0.08)] pt-10">
                  <UltraTourItinerary
                    items={tour.itinerary}
                    days={itineraryDays}
                    mapCenter={tour.mapCenter}
                    pickup={tour.pickup}
                    dropoff={tour.dropoff}
                    dayTitle={destination}
                    duration={tour.duration}
                  />
                </div>
              )}

              {(tour.pickup?.address || tour.dropoff?.address) && (
                <div className="mt-10 border-t border-[rgba(28,27,24,0.08)] pt-10">
                  <UltraTourMeetingPoints pickup={tour.pickup} dropoff={tour.dropoff} />
                </div>
              )}

              {tour.addons && tour.addons.length > 0 && (
                <div className="mt-10 border-t border-[rgba(154,117,53,0.22)] pt-10">
                  <UltraTourExtras
                    addons={tour.addons}
                    selectedAddonIds={selectedAddonIds}
                    onToggleAddon={toggleAddon}
                  />
                </div>
              )}

              <div className="mt-10 border-t border-[rgba(28,27,24,0.08)] pb-10 pt-10">
                {tour._id && (
                  <UltraTourReviews
                    tourId={tour._id as Id<"tours">}
                    rating={tour.rating}
                    reviewCount={tour.reviewCount}
                    reviews={tour.reviews}
                  />
                )}
              </div>
            </div>

            <div className="hidden w-[29%] min-w-[320px] max-w-[380px] shrink-0 pt-[20px] md:pt-[28px] lg:block">
              {sidebarWidget}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pb-8 lg:hidden">{sidebarWidget}</div>
    </div>
  )
}
