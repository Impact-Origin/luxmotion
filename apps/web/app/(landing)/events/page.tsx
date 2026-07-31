"use client"

import { Header } from "@/components/new-landing-page/header"
import { Footer } from "@/components/new-landing-page/footer"
import { EventsHero } from "@/components/events/events-hero"
import { FeaturedEventsSection } from "@/components/events/featured-events-section"
import { AllEventsSection } from "@/components/events/all-events-section"
import { ToursTopBar } from "@/components/tours/tours-top-bar"
import { ToursCartBar } from "@/components/tours/tours-cart-bar"

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white pb-[var(--cart-bar-h,0px)] [--tours-bar-h:30px] md:[--tours-bar-h:36px]">
      <ToursTopBar />
      <Header />
      {/* 46px do header + a altura da faixa de topo (30 em telemóvel, 36 acima). */}
      <div className="pt-[76px] md:pt-[82px]">
        <EventsHero />
        <FeaturedEventsSection />
        <AllEventsSection />
      </div>
      <Footer />
      <ToursCartBar />
    </div>
  )
}
