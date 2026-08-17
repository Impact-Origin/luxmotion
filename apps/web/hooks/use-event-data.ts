"use client"

import { useQuery } from "convex/react"
import { api } from "@workspace/convex/api"
import {
  MOCK_EVENTS,
  MOCK_FEATURED_EVENTS,
  MOCK_UPCOMING_EVENTS,
  MOCK_EVENT_LOCATIONS,
  type MockEvent,
} from "@/lib/mock-events"
import { textMatchesSearch } from "@/lib/search"

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_EVENTS === "true"

export interface EventData {
  _id: string
  slug: string
  title: string
  subtitle?: string
  description: any
  originalLanguage: string
  location: string
  venue?: string
  eventDate: number
  endDate?: number
  isFeatured: boolean
  isActive: boolean
  status: "draft" | "published" | "cancelled" | "completed"
  maxCapacity?: number
  /** A viatura inteira. `basePrice` é o nome antigo e desaparece no deploy 2. */
  privatePrice?: number
  basePrice?: number
  /** Preço por pessoa em lugar partilhado; sem ele o evento só se vende em privado. */
  sharedPrice?: number
  currency: string
  bannerImageUrl: string | null
  additionalBannerUrls?: (string | null)[]
  galleryImageUrls?: (string | null)[]
  included?: string[]
  excluded?: string[]
  tags?: string[]
  meetingPoint?: {
    title: string
    address: string
    description?: string
    lat?: number
    lng?: number
  }
  rating?: number
  reviewCount?: number
  minPassengers?: number
  maxPassengers?: number
  seoTitle?: string
  seoDescription?: string
  publishedAt?: number
  createdAt: number
  updatedAt: number
  availableLanguages: string[]
}

/** O preço da viatura, venha ele do campo novo ou do antigo. */
export function precoPrivado(e: { privatePrice?: number; basePrice?: number }) {
  return e.privatePrice ?? e.basePrice ?? 0
}

/**
 * O que se anuncia numa listagem: o lugar partilhado, que é o mais barato e o
 * que traz gente. Sem ele, a viatura — dizendo que é por viatura, senão o
 * número engana.
 */
export function precoDeMontra(e: {
  privatePrice?: number
  basePrice?: number
  sharedPrice?: number
}): { valor: number; unidade: "person" | "vehicle" } {
  if (typeof e.sharedPrice === "number" && e.sharedPrice > 0) {
    return { valor: e.sharedPrice, unidade: "person" }
  }
  return { valor: precoPrivado(e), unidade: "vehicle" }
}

export interface EventWithDetails extends EventData {
  translations: Array<{
    _id: string
    eventId: string
    locale: string
    title: string
    subtitle?: string
    description: any
    included?: string[]
    excluded?: string[]
    seoTitle?: string
    seoDescription?: string
    updatedAt: number
  }>
  reviews: Array<{
    _id: string
    author: string
    avatar?: string
    rating: number
    text: string
    source?: string
    nationality?: string
    createdAt: number
  }>
  addons?: Array<{
    _id: string
    title: string
    description?: string
    imageUrl?: string | null
    price: number
    pricingType: "per_person" | "flat"
    currency: string
  }>
}

export function useFeaturedEvents(limit?: number) {
  const data = useQuery(
    api.events.listFeatured,
    USE_MOCK ? "skip" : { limit }
  )

  if (USE_MOCK) {
    const events = limit ? MOCK_FEATURED_EVENTS.slice(0, limit) : MOCK_FEATURED_EVENTS
    return {
      events: events as unknown as EventData[],
      isLoading: false,
    }
  }

  return {
    events: (data as EventData[] | undefined) ?? [],
    isLoading: data === undefined,
  }
}

export function useUpcomingEvents(limit?: number) {
  const data = useQuery(
    api.events.listUpcoming,
    USE_MOCK ? "skip" : { limit }
  )

  if (USE_MOCK) {
    const events = limit ? MOCK_UPCOMING_EVENTS.slice(0, limit) : MOCK_UPCOMING_EVENTS
    return {
      events: events as unknown as EventData[],
      isLoading: false,
    }
  }

  return {
    events: (data as EventData[] | undefined) ?? [],
    isLoading: data === undefined,
  }
}

export function usePublishedEvents() {
  const data = useQuery(api.events.listPublished, USE_MOCK ? "skip" : {})

  if (USE_MOCK) {
    const published = MOCK_EVENTS.filter(e => e.status === "published")
    return {
      events: published as unknown as EventData[],
      isLoading: false,
    }
  }

  return {
    events: (data as EventData[] | undefined) ?? [],
    isLoading: data === undefined,
  }
}

export function useAllEvents() {
  const data = useQuery(api.events.list, USE_MOCK ? "skip" : {})

  if (USE_MOCK) {
    return {
      events: MOCK_EVENTS as unknown as EventData[],
      isLoading: false,
    }
  }

  return {
    events: (data as EventData[] | undefined) ?? [],
    isLoading: data === undefined,
  }
}

export function useEventsByLocation(location: string) {
  const data = useQuery(
    api.events.listByLocation,
    USE_MOCK ? "skip" : { location }
  )

  if (USE_MOCK) {
    const filtered = MOCK_EVENTS.filter(
      e => e.location.toLowerCase() === location.toLowerCase() && e.status === "published"
    )
    return {
      events: filtered as unknown as EventData[],
      isLoading: false,
    }
  }

  return {
    events: (data as EventData[] | undefined) ?? [],
    isLoading: data === undefined,
  }
}

export function useEventBySlug(slug: string, locale?: string) {
  const eventData = useQuery(
    api.events.getBySlug,
    USE_MOCK ? "skip" : { slug }
  )

  if (USE_MOCK) {
    const mockEvent = MOCK_EVENTS.find(e => e.slug === slug)
    if (!mockEvent) {
      return {
        event: null,
        isLoading: false,
        title: null,
        subtitle: null,
        description: null,
        included: null,
        excluded: null,
      }
    }
    return {
      event: { ...mockEvent, translations: [], reviews: [] } as unknown as EventWithDetails,
      isLoading: false,
      title: mockEvent.title,
      subtitle: mockEvent.subtitle,
      description: mockEvent.description,
      included: mockEvent.included,
      excluded: mockEvent.excluded,
    }
  }

  const event = eventData as EventWithDetails | null | undefined

  if (event === undefined) {
    return {
      event: undefined,
      isLoading: true,
      title: undefined,
      subtitle: undefined,
      description: undefined,
      included: undefined,
      excluded: undefined,
    }
  }

  if (!event) {
    return {
      event: null,
      isLoading: false,
      title: null,
      subtitle: null,
      description: null,
      included: null,
      excluded: null,
    }
  }

  const translation =
    locale && locale !== event.originalLanguage
      ? event.translations?.find(t => t.locale === locale)
      : null

  return {
    event,
    isLoading: false,
    title: translation?.title ?? event.title,
    subtitle: translation?.subtitle ?? event.subtitle,
    description: translation?.description ?? event.description,
    included: translation?.included ?? event.included,
    excluded: translation?.excluded ?? event.excluded,
    seoTitle: translation?.seoTitle ?? event.seoTitle,
    seoDescription: translation?.seoDescription ?? event.seoDescription,
  }
}

export function useEventById(id: string | null) {
  const data = useQuery(
    api.events.getById,
    USE_MOCK || !id ? "skip" : { id: id as any }
  )

  if (USE_MOCK && id) {
    const mockEvent = MOCK_EVENTS.find(e => e._id === id)
    return {
      event: mockEvent
        ? ({ ...mockEvent, translations: [], reviews: [] } as unknown as EventWithDetails)
        : null,
      isLoading: false,
    }
  }

  return {
    event: data as EventWithDetails | null | undefined,
    isLoading: data === undefined && id !== null,
  }
}

export function useEventLocations() {
  const data = useQuery(api.events.getLocations, USE_MOCK ? "skip" : {})

  if (USE_MOCK) {
    return {
      locations: MOCK_EVENT_LOCATIONS,
      isLoading: false,
    }
  }

  return {
    locations: (data as string[] | undefined) ?? [],
    isLoading: data === undefined,
  }
}

export function useFilteredEvents(filters: {
  search?: string
  location?: string
  status?: string
  dateRange?: { start: number; end: number }
  sortBy?: "newest" | "oldest" | "date_asc" | "date_desc" | "price_low" | "price_high"
}) {
  const { events, isLoading } = useAllEvents()

  if (isLoading) {
    return { events: [], isLoading: true }
  }

  let filtered = [...events]

  if (filters.search) {
    filtered = filtered.filter(
      e =>
        textMatchesSearch(filters.search!, [
          e.title,
          e.subtitle,
          e.location,
          e.venue,
          ...(e.tags ?? []),
        ])
    )
  }

  if (filters.location && filters.location !== "all") {
    filtered = filtered.filter(
      e => e.location.toLowerCase() === filters.location!.toLowerCase()
    )
  }

  if (filters.status && filters.status !== "all") {
    filtered = filtered.filter(e => e.status === filters.status)
  }

  if (filters.dateRange) {
    filtered = filtered.filter(
      e =>
        e.eventDate >= filters.dateRange!.start &&
        e.eventDate <= filters.dateRange!.end
    )
  }

  switch (filters.sortBy) {
    case "oldest":
      filtered.sort((a, b) => a.createdAt - b.createdAt)
      break
    case "date_asc":
      filtered.sort((a, b) => a.eventDate - b.eventDate)
      break
    case "date_desc":
      filtered.sort((a, b) => b.eventDate - a.eventDate)
      break
    case "price_low":
      filtered.sort((a, b) => precoPrivado(a) - precoPrivado(b))
      break
    case "price_high":
      filtered.sort((a, b) => precoPrivado(b) - precoPrivado(a))
      break
    default:
      filtered.sort((a, b) => b.createdAt - a.createdAt)
  }

  return { events: filtered, isLoading: false }
}
