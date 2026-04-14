"use client"

import { useState } from "react"
import { DestinationHero } from "./destination-hero"
import { DestinationNav } from "./destination-nav"
import { DestinationContent } from "./shared/destination-content"

interface DestinationPageContentProps {
  destination: string
  slug: string
}

export function DestinationPageContent({ destination, slug }: DestinationPageContentProps) {
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
      />
    </>
  )
}
