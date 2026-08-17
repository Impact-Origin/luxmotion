"use client"

import { notFound } from "next/navigation"
import { useLocale } from "next-intl"
import { useEventBySlug } from "@/hooks/use-event-data"
import { EventDetailsContent, type EventDetailsData } from "./event-details-content"
import { Loader2 } from "lucide-react"

interface EventDetailsWrapperProps {
  slug: string
}

export function EventDetailsWrapper({ slug }: EventDetailsWrapperProps) {
  const locale = useLocale()
  const { event, isLoading, title, description, included, excluded } = useEventBySlug(slug, locale)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--lm-muted,#a1a1aa)]" />
      </div>
    )
  }

  if (!event) {
    notFound()
  }

  const eventData: EventDetailsData = {
    _id: event._id,
    slug: event.slug,
    title: title || event.title,
    subtitle: event.subtitle,
    description: description || event.description || "",
    location: event.location,
    venue: event.venue,
    eventDate: event.eventDate,
    endDate: event.endDate,
    bannerImage: event.bannerImageUrl || "/mockup-tours-details/Frame 1171275668.webp",
    additionalBannerImages: event.additionalBannerUrls?.filter(Boolean) as string[] || [],
    images: event.galleryImageUrls?.filter(Boolean) as string[] || [],
    basePrice: event.basePrice,
    sharedPrice: event.sharedPrice,
    originalPrice: event.originalPrice,
    currency: event.currency,
    maxCapacity: event.maxCapacity,
    minPassengers: event.minPassengers,
    maxPassengers: event.maxPassengers,
    rating: event.rating,
    reviewCount: event.reviewCount,
    tags: event.tags || [],
    included: included || event.included || [],
    excluded: excluded || event.excluded || [],
    meetingPoint: event.meetingPoint,
    reviews: event.reviews?.map((r) => ({
      author: r.author,
      avatar: r.avatar,
      rating: r.rating,
      text: r.text,
      source: r.source,
      nationality: r.nationality,
      createdAt: r.createdAt,
    })) || [],
    addons: event.addons,
  }

  return <EventDetailsContent event={eventData} />
}
