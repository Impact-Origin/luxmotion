"use client";

import {
  HomeThemeProvider,
  HomeHeader,
} from "@/components/new-landing-page/home-theme";
import { Footer } from "@/components/new-landing-page/footer";
import { EventsHero } from "@/components/events/events-hero";
import { FeaturedEventsSection } from "@/components/events/featured-events-section";
import { AllEventsSection } from "@/components/events/all-events-section";

export default function EventsPage() {
  return (
    // O fundo e a cor do texto vêm do HomeThemeProvider.
    <HomeThemeProvider>
      <>
        <HomeHeader />
        <div className="pt-[46px] md:pt-[46px]">
          <EventsHero />
          <FeaturedEventsSection />
          <AllEventsSection />
        </div>
        <Footer />
      </>
    </HomeThemeProvider>
  );
}
