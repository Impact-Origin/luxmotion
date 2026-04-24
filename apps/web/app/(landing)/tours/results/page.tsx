"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/new-landing-page/header"
import { Footer } from "@/components/new-landing-page/footer"
import { TourResultsHero } from "@/components/tours/tour-results-hero"
import { DestinationNav } from "@/components/tours/destination-nav"
import { SearchResultsContent } from "@/components/tours/search-results-content"

function TourResultsContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  return (
    <>
      <TourResultsHero />
      <DestinationNav currentSlug="" />
      <SearchResultsContent searchQuery={query} />
    </>
  )
}

export default function TourResultsPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <Header />
      <div className="pt-[46px] md:pt-[46px]">
        <Suspense fallback={<div className="h-[520px]" />}>
          <TourResultsContent />
        </Suspense>
      </div>
      <Footer />
    </div>
  )
}
