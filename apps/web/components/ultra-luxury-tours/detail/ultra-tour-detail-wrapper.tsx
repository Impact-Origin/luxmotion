"use client"

import { notFound } from "next/navigation"
import { useLocale } from "next-intl"
import { Loader2 } from "lucide-react"
import { useTourBySlug } from "@/hooks/use-tour-data"
import { type TourData } from "@/app/(landing)/tours/tour/[slug]/page"
import { UltraTourDetailContent } from "./ultra-tour-detail-content"

export function UltraTourDetailWrapper({ slug }: { slug: string }) {
  const locale = useLocale()
  const { tour, isLoading, title, description, included, excluded } = useTourBySlug(slug, locale)

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#a08248]" />
      </div>
    )
  }

  if (!tour) notFound()

  const tourData: TourData = {
    _id: tour._id,
    slug: tour.slug,
    title: title || tour.title,
    subtitle: tour.subtitle || "",
    description: description || tour.description || "",
    tourType: tour.tourType,
    category: tour.category,
    duration: tour.duration,
    groupSize: tour.groupSize || "",
    languages: tour.languages,
    price: tour.basePrice,
    currency: tour.currency,
    rating: tour.rating || 0,
    reviewCount: tour.reviewCount || 0,
    tags: tour.tags || [],
    bannerImage: tour.bannerImageUrl || "/mockup-tours-details/Frame 1171275668.png",
    additionalBanners:
      (tour as { additionalBanners?: { url: string; type: "image" | "video" }[] }).additionalBanners ??
      ((tour.additionalBannerUrls?.filter(Boolean) as string[]) ?? []).map((url) => ({
        url,
        type: "image" as const,
      })),
    images: (tour.galleryImageUrls?.filter(Boolean) as string[]) || [],
    included: included || tour.included || [],
    excluded: excluded || tour.excluded || [],
    itinerary:
      tour.stops?.map((stop) => ({
        time: stop.time,
        title: stop.title,
        description: stop.description || "",
        image: stop.showImage ? stop.imageUrl || undefined : undefined,
        lat: stop.lat,
        lng: stop.lng,
      })) || [],
    pickup: tour.pickup || { title: "", address: "" },
    dropoff: tour.dropoff || { title: "", address: "" },
    mapCenter: tour.mapCenter || { lat: 38.7223, lng: -9.1393 },
    reviews:
      tour.reviews?.map((r) => ({
        author: r.author,
        avatar: r.avatar,
        rating: r.rating,
        text: r.text,
        source: r.source,
        nationality: r.nationality,
        createdAt: r.createdAt,
      })) || [],
    cancellationPolicy: tour.cancellationPolicy || "",
    minPassengers: tour.minPassengers,
    maxPassengers: tour.maxPassengers,
    addons: tour.addons,
  }

  return (
    <UltraTourDetailContent
      tour={tourData}
      destination={tour.destination}
      itineraryDays={tour.itineraryDays}
    />
  )
}
