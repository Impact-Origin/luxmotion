import { setRequestLocale } from "next-intl/server"
import { fetchQuery } from "convex/nextjs"
import { api } from "@workspace/convex/api"
import { Header } from "@/components/new-landing-page/header"
import { Footer } from "@/components/new-landing-page/footer"
import { UltraLuxuryToursHero } from "@/components/ultra-luxury-tours/hero"
import { UltraLuxuryTourStory } from "@/components/ultra-luxury-tours/tour-story"
import { UltraLuxuryToursSection } from "@/components/ultra-luxury-tours/tours-section"
import { UltraLuxuryApproachSection } from "@/components/ultra-luxury-tours/approach-section"
import { UltraLuxuryDestinationsSection } from "@/components/ultra-luxury-tours/destinations-section"
import { Testimonials } from "@/components/new-landing-page/testimonials"
import { UltraLuxuryScarcitySection } from "@/components/ultra-luxury-tours/scarcity-section"
import { ContactSection } from "@/components/new-landing-page/contact-section"
import { CUSTOM_INQUIRY_ID } from "@/components/ultra-luxury-tours/region-tab-strip"

export default async function UltraLuxuryToursPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  // O catálogo vinha todo do cliente: o HTML desta página não tinha um único
  // tour. O catch mantém o build a funcionar sem Convex.
  const initialTours = await fetchQuery(api.tours.listUltraLuxury, {}).catch(() => null)

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <Header />
      <div className="pt-[46px] md:pt-[46px]">
        <UltraLuxuryToursHero />
        <UltraLuxuryTourStory />
        <UltraLuxuryToursSection initialTours={initialTours} />
        <UltraLuxuryApproachSection />
        <UltraLuxuryDestinationsSection />
        <Testimonials />
        <UltraLuxuryScarcitySection />
        {/* O botão "Tours à Medida" da barra de filtros salta para aqui. O id
            existia no código mas não havia nada na página com ele, portanto o
            botão não fazia nada. */}
        <div id={CUSTOM_INQUIRY_ID} className="scroll-mt-[80px]">
          <ContactSection />
        </div>
      </div>
      <Footer />
    </div>
  )
}
