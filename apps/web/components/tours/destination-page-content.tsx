"use client"

import { useState } from "react"
import { DestinationHero } from "./destination-hero"
import { DestinationNav } from "./destination-nav"
import { DestinationContent } from "./shared/destination-content"
import type { ToursByDestinationResult } from "@/hooks/use-tour-data"

interface DestinationPageContentProps {
  destination: string
  slug: string
  initialTours?: ToursByDestinationResult | null
}

export function DestinationPageContent({ destination, slug, initialTours }: DestinationPageContentProps) {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <>
      <DestinationHero
        destination={destination}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <DestinationNav currentSlug={slug} />
      <DestinationContent
        destination={destination}
        searchQuery={searchQuery}
        initialTours={initialTours}
      />
    </>
  )
}
