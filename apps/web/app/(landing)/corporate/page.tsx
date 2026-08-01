"use client"

import { HomeThemeProvider, HomeHeader } from "@/components/new-landing-page/home-theme"
import { Footer } from "@/components/new-landing-page/footer"
import { CorporateHero } from "@/components/corporate/corporate-hero"
import { TrustedByCorporate } from "@/components/corporate/trusted-by-corporate"
import { StandardWithoutCompromise } from "@/components/corporate/standard-without-compromise"
import { ThreePillars } from "@/components/corporate/three-pillars"
import { Testimonials } from "@/components/new-landing-page/testimonials"
import { AboutUsSection } from "@/components/new-landing-page/about-us-section"
import { Fleet } from "@/components/new-landing-page/fleet"
import { ExploreWithConfidence } from "@/components/corporate/explore-with-confidence"
import { CorporateFAQ } from "@/components/corporate/corporate-faq"
import { RequestProposal } from "@/components/corporate/request-proposal"

export default function CorporatePage() {
  return (
    <HomeThemeProvider>
      <HomeHeader />
      <div className="pt-[60px] lg:pt-[72px]">
        <CorporateHero />
        <TrustedByCorporate />
        <StandardWithoutCompromise />
        <ThreePillars />
        <Testimonials />
        <AboutUsSection />
        <Fleet />
        <ExploreWithConfidence />
        <CorporateFAQ />
        <RequestProposal />
      </div>
      <Footer />
    </HomeThemeProvider>
  )
}
