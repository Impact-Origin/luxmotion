import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { Header } from "@/components/new-landing-page/header"
import { Footer } from "@/components/new-landing-page/footer"
import { HotelsHero } from "@/components/hotels/hotels-hero"
import { HotelsOffers, HotelsWhy, HotelsHow, HotelsCta } from "@/components/hotels/hotels-sections"
import { HotelsFounders, HotelsEarnings, HotelsPlans, HotelsFleet, HotelsResults } from "@/components/hotels/hotels-sections-2"
import { HotelsVertente, HotelsDashboards } from "@/components/hotels/hotels-sections-3"
import { Testimonials } from "@/components/new-landing-page/testimonials"
import { JsonLd } from "@/components/seo/json-ld"
import { createPageMetadata } from "@/lib/seo"
import { buildBreadcrumbSchema, buildOrganizationSchema } from "@/lib/structured-data"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("hotels.hero")
  return createPageMetadata({
    title: `${t("titleLine1")} ${t("titleAccent")} ${t("titleSuffix")}`,
    description: t("intro"),
    path: "/hotels",
    keywords: [
      "hotel partnership",
      "luxmotion partner",
      "white label transfers",
      "hotel chauffeur portugal",
      "parceria hotéis",
    ],
  })
}

export default function HotelsPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <JsonLd data={buildOrganizationSchema()} />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Hotels", url: "/hotels" },
        ])}
      />
      <Header variant="light" />
      <main className="pt-[60px] lg:pt-[72px]">
        <HotelsHero />
        <HotelsOffers />
        <HotelsVertente />
        <HotelsWhy />
        <HotelsFounders />
        <HotelsHow />
        <HotelsDashboards />
        <HotelsEarnings />
        <HotelsPlans />
        <HotelsFleet />
        <HotelsResults />
        <Testimonials />
        <HotelsCta />
      </main>
      <Footer />
    </div>
  )
}
