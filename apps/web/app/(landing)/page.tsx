import { Header } from "@/components/new-landing-page/header"
import { Hero } from "@/components/new-landing-page/hero"
import { ServicesSection } from "@/components/new-landing-page/services-section"
import { WhyScheduleSection } from "@/components/new-landing-page/why-schedule-section"
import { AboutUsSection } from "@/components/new-landing-page/about-us-section"
import { OurDriversSection } from "@/components/new-landing-page/our-drivers-section"
import { Testimonials } from "@/components/new-landing-page/testimonials"
import { CinematicBanner } from "@/components/new-landing-page/cinematic-banner"
import { Fleet } from "@/components/new-landing-page/fleet"
import { B2BSection } from "@/components/new-landing-page/b2b-section"
import { TravelAgenciesSection } from "@/components/new-landing-page/travel-agencies-section"
import { WeddingPlannersSection } from "@/components/new-landing-page/wedding-planners-section"
import { ProfessionalDriversSection } from "@/components/new-landing-page/professional-drivers-section"
import { CTABanner } from "@/components/new-landing-page/cta-banner"
import { ToursSection } from "@/components/new-landing-page/tours-section"
import { FAQ } from "@/components/new-landing-page/faq"
import { SocialSection } from "@/components/new-landing-page/social-section"
import { Footer } from "@/components/new-landing-page/footer"
import { WhatsAppFloat } from "@/components/new-landing-page/whatsapp-float"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { JsonLd } from "@/components/seo/json-ld"
import { createPageMetadata } from "@/lib/seo"
import { buildOrganizationSchema, buildServiceSchema, buildWebsiteSchema } from "@/lib/structured-data"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("hero")

  return createPageMetadata({
    title: `${t("title1")} ${t("title2")}`,
    description: t("subtitle"),
    path: "/",
    keywords: ["private transfer", "airport transfer", "Portugal tours", "chauffeur"],
  })
}

export default function SitePrincipal() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <JsonLd data={buildOrganizationSchema()} />
      <JsonLd data={buildWebsiteSchema()} />
      <JsonLd
        data={
          buildServiceSchema({
            name: "Private Transfers and Tours in Portugal",
            description: "Airport transfers, city transfers, and premium tours across Portugal.",
            path: "/",
            image: "/hero-composition.png",
            areaServed: "Portugal",
          })
        }
      />
      <Header />
      <WhatsAppFloat />
      <Hero />
      <ServicesSection />
      <WhyScheduleSection />
      <Testimonials />
      <CinematicBanner />
      <AboutUsSection />
      <div className="bg-[#0D0D0D] flex justify-center px-4 md:px-[82px] 2xl:px-[300px]">
        <div className="max-w-[1280px] w-full h-[3px] bg-gradient-to-r from-transparent via-[rgba(201,169,110,0.4)] to-transparent" />
      </div>
      <OurDriversSection />
      <CTABanner />
      <ToursSection />
      <Fleet />
      <B2BSection />
      <TravelAgenciesSection />
      <WeddingPlannersSection />
      <ProfessionalDriversSection />
      <FAQ />
      <SocialSection />
      <Footer />
    </div>
  )
}
