"use client";

import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@workspace/convex/api";
import type { NearbyTour } from "@/components/checkout/experiences-step";

interface UseNearbyToursProps {
  lat: number | null;
  lng: number | null;
  radiusKm?: number;
}

function formatEventDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

export function useNearbyTours({ lat, lng, radiusKm }: UseNearbyToursProps) {
  const tours = useQuery(
    api.tours.listNearCoordinates,
    lat != null && lng != null ? { lat, lng, radiusKm } : "skip"
  );

  const events = useQuery(
    api.events.listNearCoordinates,
    lat != null && lng != null ? { lat, lng, radiusKm } : "skip"
  );

  const allItems = useMemo(() => {
    const transformedEvents: NearbyTour[] = (events ?? []).map((event) => ({
      _id: event._id,
      slug: event.slug,
      title: event.title,
      subtitle: event.subtitle,
      description: event.description,
      bannerImageUrl: event.bannerImageUrl,
      basePrice: event.basePrice,
      duration: formatEventDate(event.eventDate),
      distanceKm: event.distanceKm,
      category: "events" as const,
      addons: event.addons,
    }));

    return [...(tours ?? []), ...transformedEvents];
  }, [tours, events]);

  const isLoading = (tours === undefined || events === undefined) && lat != null && lng != null;

  return {
    tours: allItems,
    isLoading,
  };
}
