"use client"

import { Header } from "@/components/new-landing-page/header"
import { Footer } from "@/components/new-landing-page/footer"
import { EventsHero } from "@/components/events/events-hero"
import { FeaturedEventsSection } from "@/components/events/featured-events-section"
import { AllEventsSection } from "@/components/events/all-events-section"

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
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
