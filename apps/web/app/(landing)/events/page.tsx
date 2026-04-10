"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Header } from "@/components/new-landing-page/header"
import { Footer } from "@/components/new-landing-page/footer"
import { EventCard } from "@/components/events/event-card"
import { useFeaturedEvents, useEventLocations, useFilteredEvents } from "@/hooks/use-event-data"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Search, Calendar, Loader2, Star } from "lucide-react"
import Image from "next/image"

function EventsHero() {
  const t = useTranslations("eventsPage")
  return (
    <div className="relative w-full h-[400px] md:h-[500px]">
      <Image
        src="/tours_hero.jpg"
        alt={t("heroTitle")}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            {t("heroTitle")}
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
            {t("heroSubtitle")}
          </p>
        </div>
      </div>
    </div>
  )
}

function FeaturedEventsSection() {
  const t = useTranslations("eventsPage")
  const { events, isLoading } = useFeaturedEvents(3)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    )
  }

  if (events.length === 0) return null

  return (
    <section className="py-16 px-4 md:px-5 lg:px-6 xl:px-8 bg-zinc-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <Star className="h-5 w-5 text-yellow-500" />
          <span className="text-sm font-medium text-yellow-600 uppercase tracking-wide">
            {t("featured")}
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-8">
          {t("featuredTitle")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard
              key={event._id}
              event={{
                slug: event.slug,
                title: event.title,
                subtitle: event.subtitle,
                location: event.location,
                venue: event.venue,
                eventDate: event.eventDate,
                endDate: event.endDate,
                bannerImageUrl: event.bannerImageUrl,
                basePrice: event.basePrice,
                originalPrice: event.originalPrice,
                currency: event.currency,
                rating: event.rating,
                reviewCount: event.reviewCount,
                tags: event.tags,
                isFeatured: event.isFeatured,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function AllEventsSection() {
  const t = useTranslations("eventsPage")
  const [search, setSearch] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")
  const [sortBy, setSortBy] = useState<"date_asc" | "date_desc" | "price_low" | "price_high">("date_asc")

  const { locations } = useEventLocations()
  const { events, isLoading } = useFilteredEvents({
    search,
    location: locationFilter,
    status: "published",
    sortBy,
  })

  return (
    <section className="py-16 px-4 md:px-5 lg:px-6 xl:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-8">
          {t("allEventsTitle")}
        </h2>

        <div className="flex flex-wrap gap-4 mb-8">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder={t("searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-auto min-w-[140px]">
              <SelectValue placeholder={t("locationPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allLocations")}</SelectItem>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
            <SelectTrigger className="w-auto min-w-[140px]">
              <SelectValue placeholder={t("sortBy")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date_asc">{t("dateSoonest")}</SelectItem>
              <SelectItem value="date_desc">{t("dateLatest")}</SelectItem>
              <SelectItem value="price_low">{t("priceLow")}</SelectItem>
              <SelectItem value="price_high">{t("priceHigh")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16 bg-zinc-50 rounded-xl border-2 border-dashed border-zinc-200">
            <Calendar className="h-12 w-12 mx-auto text-zinc-300 mb-4" />
            <h3 className="text-lg font-medium text-zinc-900 mb-2">{t("noEventsFound")}</h3>
            <p className="text-zinc-500">
              {search || locationFilter !== "all"
                ? t("tryFilters")
                : t("checkBackSoon")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={{
                  slug: event.slug,
                  title: event.title,
                  subtitle: event.subtitle,
                  location: event.location,
                  venue: event.venue,
                  eventDate: event.eventDate,
                  endDate: event.endDate,
                  bannerImageUrl: event.bannerImageUrl,
                  basePrice: event.basePrice,
                  originalPrice: event.originalPrice,
                  currency: event.currency,
                  rating: event.rating,
                  reviewCount: event.reviewCount,
                  tags: event.tags,
                  isFeatured: event.isFeatured,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <div className="pt-[46px] md:pt-[46px]">
        <EventsHero />
        <FeaturedEventsSection />
        <AllEventsSection />
      </div>
      <Footer />
    </div>
  )
}
