"use client"

import Image from "next/image"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { Star, Calendar, MapPin, Clock } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

export interface EventCardData {
  slug: string
  title: string
  subtitle?: string
  location: string
  venue?: string
  eventDate: number
  endDate?: number
  bannerImageUrl: string | null
  basePrice: number
  originalPrice?: number
  currency: string
  rating?: number
  reviewCount?: number
  tags?: string[]
  isFeatured?: boolean
}

interface EventCardProps {
  event: EventCardData
  className?: string
}

export function EventCard({ event, className }: EventCardProps) {
  const t = useTranslations("eventsPage")

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
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
    <Link
      href={`/events/${event.slug}`}
      className={cn(
        "group block bg-white rounded-xl overflow-hidden border border-zinc-200 hover:shadow-lg transition-all duration-300",
        className
      )}
    >
      <div className="relative h-48 overflow-hidden">
        {event.bannerImageUrl ? (
          <Image
            src={event.bannerImageUrl}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-zinc-100 flex items-center justify-center">
            <Calendar className="h-12 w-12 text-zinc-300" />
          </div>
        )}

        {event.isFeatured && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center gap-1">
              <Star className="h-3 w-3" />
              {t("featured")}
            </span>
          </div>
        )}

        <div className="absolute bottom-3 left-3 right-3">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-zinc-600 shrink-0" />
            <div className="text-sm truncate">
              <span className="font-semibold">{formatDate(event.eventDate)}</span>
              <span className="text-zinc-500 ml-2">{formatTime(event.eventDate)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{event.location}</span>
          {event.venue && (
            <>
              <span>•</span>
              <span className="truncate">{event.venue}</span>
            </>
          )}
        </div>

        <h3 className="font-semibold text-zinc-900 line-clamp-2 mb-2 group-hover:text-zinc-700 transition-colors">
          {event.title}
        </h3>

        {event.subtitle && (
          <p className="text-sm text-zinc-500 line-clamp-2 mb-3">{event.subtitle}</p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {event.rating !== undefined && event.rating > 0 && (
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{event.rating.toFixed(1)}</span>
                {event.reviewCount !== undefined && event.reviewCount > 0 && (
                  <span className="text-zinc-500">({event.reviewCount})</span>
                )}
              </div>
            )}
          </div>

          <div className="text-right">
            {event.originalPrice && event.originalPrice > event.basePrice && (
              <span className="text-xs text-zinc-400 line-through mr-1">
                {getCurrencySymbol(event.currency)}{event.originalPrice}
              </span>
            )}
            <span className="font-bold text-zinc-900">
              {getCurrencySymbol(event.currency)}{event.basePrice}
            </span>
          </div>
        </div>

        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {event.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
