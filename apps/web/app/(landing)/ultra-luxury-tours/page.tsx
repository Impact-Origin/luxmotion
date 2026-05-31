import { Header } from "@/components/new-landing-page/header"
import { Footer } from "@/components/new-landing-page/footer"
import { UltraLuxuryToursHero } from "@/components/ultra-luxury-tours/hero"
import { UltraLuxuryTourStory } from "@/components/ultra-luxury-tours/tour-story"
import { UltraLuxuryToursSection } from "@/components/ultra-luxury-tours/tours-section"
import { UltraLuxuryApproachSection } from "@/components/ultra-luxury-tours/approach-section"
import { UltraLuxuryDestinationsSection } from "@/components/ultra-luxury-tours/destinations-section"
import { Testimonials } from "@/components/new-landing-page/testimonials"
import { UltraLuxuryScarcitySection } from "@/components/ultra-luxury-tours/scarcity-section"

export default function UltraLuxuryToursPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <Header />
      <div className="pt-[46px] md:pt-[46px]">
        <UltraLuxuryToursHero />
        <UltraLuxuryTourStory />
        <UltraLuxuryToursSection />
        <UltraLuxuryApproachSection />
        <UltraLuxuryDestinationsSection />
        <Testimonials />
        <UltraLuxuryScarcitySection />
      </div>
      <Footer />
    </div>
  )
}
