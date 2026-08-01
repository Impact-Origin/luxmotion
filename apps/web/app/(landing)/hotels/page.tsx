import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { HomeThemeProvider, HomeHeader } from "@/components/new-landing-page/home-theme"
import { Footer } from "@/components/new-landing-page/footer"
import { HotelsHero } from "@/components/hotels/hotels-hero"
import { HotelsSectionNav } from "@/components/hotels/hotels-section-nav"
import { TrustedBy } from "@/components/new-landing-page/trusted-by"
import { ServicesSection } from "@/components/new-landing-page/services-section"
import { HotelsVerticals } from "@/components/hotels/hotels-verticals"
import { HotelsAdvantages } from "@/components/hotels/hotels-advantages"
import { AboutUsSection } from "@/components/new-landing-page/about-us-section"
import { HotelsHow } from "@/components/hotels/hotels-how"
import { HotelsPlatform } from "@/components/hotels/hotels-platform"
import { HotelsCommission } from "@/components/hotels/hotels-commission"
import { HotelsCalculator } from "@/components/hotels/hotels-calculator"
import { HotelsPayment } from "@/components/hotels/hotels-payment"
import { HotelsFleet } from "@/components/hotels/hotels-fleet"
import { Testimonials } from "@/components/new-landing-page/testimonials"
import { HotelsResults } from "@/components/hotels/hotels-results"
import { HotelsCta } from "@/components/hotels/hotels-cta"
import { Reveal } from "@/components/common/reveal"
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
    <HomeThemeProvider>
      <JsonLd data={buildOrganizationSchema()} />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Hotels", url: "/hotels" },
        ])}
      />
      <HomeHeader />
      <main className="pt-[60px] lg:pt-[72px]">
        <HotelsHero />
        <TrustedBy />
        <HotelsSectionNav />
        <div id="servicos" className="scroll-mt-[120px]"><ServicesSection /></div>
        <div id="vantagens" className="scroll-mt-[120px]"><Reveal><HotelsVerticals /></Reveal></div>
        <Reveal><HotelsAdvantages /></Reveal>
        <div id="sobre-nos" className="scroll-mt-[120px]"><AboutUsSection /></div>
        <div id="como-funciona" className="scroll-mt-[120px]"><Reveal><HotelsHow /></Reveal></div>
        <Reveal><HotelsPlatform /></Reveal>
        <Reveal><HotelsCta messageKey="ctaFinal" /></Reveal>
        <div id="comissoes" className="scroll-mt-[120px]"><Reveal><HotelsCommission /></Reveal></div>
        <Reveal><HotelsCalculator /></Reveal>
        <div id="planos" className="scroll-mt-[120px]"><Reveal><HotelsPayment /></Reveal></div>
        <Reveal><HotelsCta messageKey="ctaRevenue" /></Reveal>
        <div id="frota" className="scroll-mt-[120px]"><Reveal><HotelsFleet /></Reveal></div>
        <Testimonials />
        <div id="casos" className="scroll-mt-[120px]"><Reveal><HotelsResults /></Reveal></div>
      </main>
      <Footer />
    </HomeThemeProvider>
  )
}
