"use client"

import { useState } from "react"
import { DestinationHero } from "./destination-hero"
import { DestinationContent } from "./shared/destination-content"

interface DestinationPageContentProps {
  destination: string
}

export function DestinationPageContent({ destination }: DestinationPageContentProps) {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <>
      <DestinationHero
        destination={destination}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <DestinationContent
        destination={destination}
        searchQuery={searchQuery}
      />
    </>
  )
}
