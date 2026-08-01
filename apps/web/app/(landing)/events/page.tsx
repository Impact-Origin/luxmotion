"use client"

import { HomeThemeProvider, HomeHeader } from "@/components/new-landing-page/home-theme"
import { Footer } from "@/components/new-landing-page/footer"
import { EventsHero } from "@/components/events/events-hero"
import { FeaturedEventsSection } from "@/components/events/featured-events-section"
import { AllEventsSection } from "@/components/events/all-events-section"
import { ToursTopBar } from "@/components/tours/tours-top-bar"
import { ToursCartBar } from "@/components/tours/tours-cart-bar"

export default function EventsPage() {
  return (
    // O fundo e a cor do texto vêm do HomeThemeProvider; aqui só fica o espaço
    // para a barra do carrinho e a altura da faixa de topo (lida pelo Header).
    <HomeThemeProvider>
      <div className="pb-[var(--cart-bar-h,0px)] [--tours-bar-h:30px] md:[--tours-bar-h:36px]">
        <ToursTopBar />
        <HomeHeader />
        {/* 46px do header + a altura da faixa de topo (30 em telemóvel, 36 acima). */}
        <div className="pt-[76px] md:pt-[82px]">
          <EventsHero />
          <FeaturedEventsSection />
          <AllEventsSection />
        </div>
        <Footer />
        <ToursCartBar />
      </div>
    </HomeThemeProvider>
  )
}
