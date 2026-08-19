import { HomeThemeProvider, HomeHeader } from "@/components/new-landing-page/home-theme"
import { Hero } from "@/components/new-landing-page/hero"
import { ServicesSection } from "@/components/new-landing-page/services-section"
import { WhyScheduleSection } from "@/components/new-landing-page/why-schedule-section"
import { AboutUsSection } from "@/components/new-landing-page/about-us-section"
import { OurDriversSection } from "@/components/new-landing-page/our-drivers-section"
import { Testimonials } from "@/components/new-landing-page/testimonials"
import { CinematicBanner } from "@/components/new-landing-page/cinematic-banner"
import { TrustedBy } from "@/components/new-landing-page/trusted-by"
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
import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { JsonLd } from "@/components/seo/json-ld"
import { createPageMetadata } from "@/lib/seo"
import { buildOrganizationSchema, buildServiceSchema, buildWebsiteSchema } from "@/lib/structured-data"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("hero")
  const siteTitle = "LuxMotion | Private Transfers & Luxury Tours Portugal"

  return {
    ...(await createPageMetadata({
      title: siteTitle,
      description: t("subtitle"),
      path: "/",
      keywords: ["private transfer", "airport transfer", "Portugal tours", "chauffeur"],
    })),
    // Absolute so the homepage tab shows exactly this, without the "%s | …" template suffix
    title: { absolute: siteTitle },
  }
}

export default async function SitePrincipal({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <HomeThemeProvider>
      <JsonLd data={buildOrganizationSchema()} />
      <JsonLd data={buildWebsiteSchema()} />
      <JsonLd
        data={
          buildServiceSchema({
            name: "Private Transfers and Tours in Portugal",
            description: "Airport transfers, city transfers, and premium tours across Portugal.",
            path: "/",
            image: "/og-luxmotion.jpg",
            areaServed: "Portugal",
          })
        }
      />
      <HomeHeader />
      <Hero />
      <ServicesSection />
      <WhyScheduleSection />
      <Testimonials />
      <CinematicBanner />
      <TrustedBy />
      <AboutUsSection />
      <div className="bg-[var(--lm-bg,#0D0D0D)] hidden lg:flex justify-center px-4 md:px-[82px]">
        <div className="max-w-[1280px] w-full h-[3px] bg-gradient-to-r from-transparent via-[var(--lm-accent,#C9A96E)] to-transparent" />
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
    </HomeThemeProvider>
  )
}
