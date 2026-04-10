"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/new-landing-page/header"
import { TourResultsHero } from "@/components/tours/tour-results-hero"
import { TourResultsSection } from "@/components/tours/tour-results-section"
import { NewsletterSection } from "@/components/new-landing-page/newsletter-section"
import { Footer } from "@/components/new-landing-page/footer"

function TourResultsContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  return (
    <>
      <TourResultsHero />
      <TourResultsSection searchQuery={query} />
    </>
  )
}

export default function TourResultsPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <div className="pt-[46px] md:pt-[46px]">
        <Suspense fallback={<div className="h-[520px]" />}>
          <TourResultsContent />
        </Suspense>
        <div className="xl:mt-[140px]">
          <NewsletterSection />
        </div>
      </div>
      <Footer />
    </div>
  )
}
