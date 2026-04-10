import { Header } from "@/components/new-landing-page/header"
import { ToursHero } from "@/components/tours/tours-hero"
import { TourStory } from "@/components/tours/tour-story"
import { DestinationsSection } from "@/components/tours/destinations-section"
import { TopPicksSection } from "@/components/tours/top-picks-section"
import { ServicesSection } from "@/components/new-landing-page/services-section"
import { GuidesSection } from "@/components/new-landing-page/guides-section"
import { ContactSection } from "@/components/new-landing-page/contact-section"
import { Testimonials } from "@/components/new-landing-page/testimonials"
import { SocialSection } from "@/components/new-landing-page/social-section"
import { Footer } from "@/components/new-landing-page/footer"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { JsonLd } from "@/components/seo/json-ld"
import { createPageMetadata } from "@/lib/seo"
import { buildBreadcrumbSchema, buildServiceSchema } from "@/lib/structured-data"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("toursHero")

  return createPageMetadata({
    title: `${t("titleDiscover")} ${t("titleSoul")} ${t("titlePortugal")}`,
    description: "Discover private and curated tours across Portugal with local expert drivers.",
    path: "/tours",
    image: "/tours_hero.jpg",
    keywords: ["Portugal tours", "Sintra tour", "private tour", "day trips Portugal"],
  })
}

export default function ToursPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <JsonLd
        data={
          buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Tours", url: "/tours" },
          ])
        }
      />
      <JsonLd
        data={
          buildServiceSchema({
            name: "Private Tours in Portugal",
            description: "Tailored tour experiences across Lisbon, Porto, Algarve, Madeira, and more.",
            path: "/tours",
            image: "/tours_hero.jpg",
          })
        }
      />
      <Header />
      <div className="pt-[46px] md:pt-[46px]">
        <ToursHero />
        <TourStory />
        <DestinationsSection />
        <TopPicksSection />
        <Testimonials />
        <ServicesSection />
        <GuidesSection />
        <ContactSection />
        <SocialSection />
      </div>
      <Footer />
    </div>
  )
}
