"use client"

import { useQuery } from "convex/react"
import { api } from "@workspace/convex/api"
import {
  MOCK_TOURS,
  MOCK_FEATURED_TOURS,
  MOCK_BESTSELLER_TOURS,
  MOCK_DESTINATIONS,
  type MockTour,
} from "@/lib/mock-tours"

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_TOURS === "true"

export interface TourData {
  _id: string
  slug: string
  title: string
  subtitle?: string
  description: any
  tourType: string
  originalLanguage: string
  category: "tours" | "experiences" | "private"
  destination: string
  isFeatured: boolean
  isBestSeller: boolean
  isActive: boolean
  isUltraLuxury?: boolean
  tourTypeTag?:
    | "half-day"
    | "full-day"
    | "multi-day"
    | "river-cruise"
    | "private-yacht"
    | "helicopter"
  durationDays?: number
  status: "draft" | "published" | "archived"
  duration: string
  durationMinutes?: number
  groupSize: string
  maxGroupSize?: number
  languages: string[]
  basePrice: number
  originalPrice?: number
  currency: string
  bannerImageUrl: string | null
  additionalBannerUrls?: (string | null)[]
  galleryImageUrls?: (string | null)[]

  included?: string[]
  excluded?: string[]
  tags?: string[]
  pickup?: {
    title: string
    address: string
    description?: string
    lat?: number
    lng?: number
  }
  dropoff?: {
    title: string
    address: string
    description?: string
    lat?: number
    lng?: number
  }
  mapCenter?: {
    lat: number
    lng: number
  }
  rating?: number
  reviewCount?: number
  minPassengers?: number
  maxPassengers?: number
  cancellationPolicy?: string
  seoTitle?: string
  seoDescription?: string
  publishedAt?: number
  createdAt: number
  updatedAt: number
  availableLanguages: string[]
}

export interface ItineraryDay {
  title: string
  titleAccent?: string
  hoursActive?: string
  nights?: number
  hotel?: string
  stops: Array<{
    time?: string
    label?: string
    title: string
    description?: string
    imageUrl?: string | null
    lat?: number
    lng?: number
  }>
}

export interface TourWithDetails extends TourData {
  itineraryDays?: ItineraryDay[]
  translations: Array<{
    _id: string
    tourId: string
    locale: string
    title: string
    subtitle?: string
    description: any
  
    included?: string[]
    excluded?: string[]
    seoTitle?: string
    seoDescription?: string
    cancellationPolicy?: string
    updatedAt: number
  }>
  stops: Array<{
    _id: string
    tourId: string
    order: number
    time: string
    title: string
    description?: string
    imageUrl?: string | null
    showImage: boolean
    address?: string
    lat?: number
    lng?: number
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

export function useFeaturedTours(limit?: number) {
  const data = useQuery(
    api.tours.listFeatured,
    USE_MOCK ? "skip" : { limit }
  )

  if (USE_MOCK) {
    const tours = limit ? MOCK_FEATURED_TOURS.slice(0, limit) : MOCK_FEATURED_TOURS
    return {
      tours: tours as unknown as TourData[],
      isLoading: false,
    }
  }

  return {
    tours: (data as TourData[] | undefined) ?? [],
    isLoading: data === undefined,
  }
}

export function useBestsellerTours(limit?: number) {
  const data = useQuery(
    api.tours.listBestsellers,
    USE_MOCK ? "skip" : { limit }
  )

  if (USE_MOCK) {
    const tours = limit ? MOCK_BESTSELLER_TOURS.slice(0, limit) : MOCK_BESTSELLER_TOURS
    return {
      tours: tours as unknown as TourData[],
      isLoading: false,
    }
  }

  return {
    tours: (data as TourData[] | undefined) ?? [],
    isLoading: data === undefined,
  }
}

export function usePublishedTours() {
  const data = useQuery(api.tours.listPublished, USE_MOCK ? "skip" : {})

  if (USE_MOCK) {
    const published = MOCK_TOURS.filter(t => t.status === "published")
    return {
      tours: published as unknown as TourData[],
      isLoading: false,
    }
  }

  return {
    tours: (data as TourData[] | undefined) ?? [],
    isLoading: data === undefined,
  }
}

export function useUltraLuxuryTours() {
  const data = useQuery(api.tours.listUltraLuxury, USE_MOCK ? "skip" : {})

  if (USE_MOCK) {
    const ultra = MOCK_TOURS.filter(
      (t) => t.status === "published" && (t as { isUltraLuxury?: boolean }).isUltraLuxury === true,
    )
    return {
      tours: ultra as unknown as TourData[],
      isLoading: false,
    }
  }

  return {
    tours: (data as TourData[] | undefined) ?? [],
    isLoading: data === undefined,
  }
}

export function useAllTours() {
  const data = useQuery(api.tours.list, USE_MOCK ? "skip" : {})

  if (USE_MOCK) {
    return {
      tours: MOCK_TOURS as unknown as TourData[],
      isLoading: false,
    }
  }

  return {
    tours: (data as TourData[] | undefined) ?? [],
    isLoading: data === undefined,
  }
}

export function useToursByDestination(destination: string) {
  const data = useQuery(
    api.tours.listByDestination,
    USE_MOCK ? "skip" : { destination }
  )

  if (USE_MOCK) {
    const filtered = MOCK_TOURS.filter(
      t => t.destination.toLowerCase() === destination.toLowerCase() && t.status === "published"
    )
    return {
      tours: filtered as unknown as TourData[],
      isLoading: false,
    }
  }

  return {
    tours: (data as TourData[] | undefined) ?? [],
    isLoading: data === undefined,
  }
}

export function useToursByCategory(category: "tours" | "experiences" | "private") {
  const data = useQuery(
    api.tours.listByCategory,
    USE_MOCK ? "skip" : { category }
  )

  if (USE_MOCK) {
    const filtered = MOCK_TOURS.filter(
      t => t.category === category && t.status === "published"
    )
    return {
      tours: filtered as unknown as TourData[],
      isLoading: false,
    }
  }

  return {
    tours: (data as TourData[] | undefined) ?? [],
    isLoading: data === undefined,
  }
}

export function useToursByDestinationAndCategory(
  destination: string,
  category: "tours" | "experiences" | "private"
) {
  const data = useQuery(
    api.tours.listByDestinationAndCategory,
    USE_MOCK ? "skip" : { destination, category }
  )

  if (USE_MOCK) {
    const filtered = MOCK_TOURS.filter(
      t =>
        t.destination.toLowerCase() === destination.toLowerCase() &&
        t.category === category &&
        t.status === "published"
    )
    return {
      tours: filtered as unknown as TourData[],
      isLoading: false,
    }
  }

  return {
    tours: (data as TourData[] | undefined) ?? [],
    isLoading: data === undefined,
  }
}

export function useTourBySlug(slug: string, locale?: string) {
  const tourData = useQuery(
    api.tours.getBySlug,
    USE_MOCK ? "skip" : { slug }
  )

  if (USE_MOCK) {
    const mockTour = MOCK_TOURS.find(t => t.slug === slug)
    if (!mockTour) {
      return {
        tour: null,
        isLoading: false,
        title: null,
        subtitle: null,
        description: null,
        included: null,
        excluded: null,
      }
    }
    return {
      tour: { ...mockTour, translations: [] } as unknown as TourWithDetails,
      isLoading: false,
      title: mockTour.title,
      subtitle: mockTour.subtitle,
      description: mockTour.description,
      included: mockTour.included,
      excluded: mockTour.excluded,
    }
  }

  const tour = tourData as TourWithDetails | null | undefined

  if (tour === undefined) {
    return {
      tour: undefined,
      isLoading: true,
      title: undefined,
      subtitle: undefined,
      description: undefined,
      included: undefined,
      excluded: undefined,
    }
  }

  if (!tour) {
    return {
      tour: null,
      isLoading: false,
      title: null,
      subtitle: null,
      description: null,

      included: null,
      excluded: null,
    }
  }

  const translation =
    locale && locale !== tour.originalLanguage
      ? tour.translations?.find(t => t.locale === locale)
      : null

  return {
    tour,
    isLoading: false,
    title: translation?.title ?? tour.title,
    subtitle: translation?.subtitle ?? tour.subtitle,
    description: translation?.description ?? tour.description,
    included: translation?.included ?? tour.included,
    excluded: translation?.excluded ?? tour.excluded,
    seoTitle: translation?.seoTitle ?? tour.seoTitle,
    seoDescription: translation?.seoDescription ?? tour.seoDescription,
  }
}

export function useTourById(id: string | null) {
  const data = useQuery(
    api.tours.getById,
    USE_MOCK || !id ? "skip" : { id: id as any }
  )

  if (USE_MOCK && id) {
    const mockTour = MOCK_TOURS.find(t => t._id === id)
    return {
      tour: mockTour
        ? ({ ...mockTour, translations: [], stops: mockTour.stops || [] } as unknown as TourWithDetails)
        : null,
      isLoading: false,
    }
  }

  return {
    tour: data as TourWithDetails | null | undefined,
    isLoading: data === undefined && id !== null,
  }
}

export function useDestinations() {
  const data = useQuery(api.tours.getDestinations, USE_MOCK ? "skip" : {})

  if (USE_MOCK) {
    return {
      destinations: MOCK_DESTINATIONS,
      isLoading: false,
    }
  }

  return {
    destinations: (data as string[] | undefined) ?? [],
    isLoading: data === undefined,
  }
}

export function useFilteredTours(filters: {
  search?: string
  destination?: string
  category?: string
  status?: string
  sortBy?: "newest" | "oldest" | "price_low" | "price_high" | "rating"
}) {
  const { tours, isLoading } = useAllTours()

  if (isLoading) {
    return { tours: [], isLoading: true }
  }

  let filtered = [...tours]

  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(
      t =>
        t.title.toLowerCase().includes(searchLower) ||
        t.subtitle?.toLowerCase().includes(searchLower) ||
        t.destination.toLowerCase().includes(searchLower)
    )
  }

  if (filters.destination && filters.destination !== "all") {
    filtered = filtered.filter(
      t => t.destination.toLowerCase() === filters.destination!.toLowerCase()
    )
  }

  if (filters.category && filters.category !== "all") {
    filtered = filtered.filter(t => t.category === filters.category)
  }

  if (filters.status && filters.status !== "all") {
    filtered = filtered.filter(t => t.status === filters.status)
  }

  switch (filters.sortBy) {
    case "oldest":
      filtered.sort((a, b) => a.createdAt - b.createdAt)
      break
    case "price_low":
      filtered.sort((a, b) => a.basePrice - b.basePrice)
      break
    case "price_high":
      filtered.sort((a, b) => b.basePrice - a.basePrice)
      break
    case "rating":
      filtered.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      break
    default:
      filtered.sort((a, b) => b.createdAt - a.createdAt)
  }

  return { tours: filtered, isLoading: false }
}

export function useTourStops(tourId: string | null, locale?: string) {
  const data = useQuery(
    api.tourStops.listByTour,
    USE_MOCK || !tourId ? "skip" : { tourId: tourId as any }
  )

  if (USE_MOCK && tourId) {
    const mockTour = MOCK_TOURS.find(t => t._id === tourId)
    return {
      stops: (mockTour?.stops || []) as unknown as TourWithDetails["stops"],
      isLoading: false,
    }
  }

  return {
    stops: (data as TourWithDetails["stops"] | undefined) ?? [],
    isLoading: data === undefined && tourId !== null,
  }
}

export function useTourAvailability(
  tourId: string | null,
  startDate: number,
  endDate: number
) {
  const data = useQuery(
    api.tourSchedules.getAvailability,
    USE_MOCK || !tourId
      ? "skip"
      : { tourId: tourId as any, startDate, endDate }
  )

  if (USE_MOCK) {
    return {
      availability: [],
      isLoading: false,
    }
  }

  return {
    availability: data?.availability ?? [],
    bookingDeadlineHours: data?.bookingDeadlineHours,
    isLoading: data === undefined && tourId !== null,
  }
}
