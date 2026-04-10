import { Header } from "@/components/new-landing-page/header"
import { Hero } from "@/components/new-landing-page/hero"
import { WhyScheduleSection } from "@/components/new-landing-page/why-schedule-section"
import { AboutUsSection } from "@/components/new-landing-page/about-us-section"
import { Testimonials } from "@/components/new-landing-page/testimonials"
import { Fleet } from "@/components/new-landing-page/fleet"
import { LisbonBanner } from "@/components/new-landing-page/lisbon-banner"
import { ToursSection } from "@/components/new-landing-page/tours-section"
import { PaymentMethods } from "@/components/new-landing-page/payment-methods"
import { NewsletterSection } from "@/components/new-landing-page/newsletter-section"
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
    <div className="min-h-screen bg-white text-slate-900">
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
      <Testimonials />
      <WhyScheduleSection />
      <AboutUsSection />
      <Fleet />
      <LisbonBanner />
      <ToursSection />  
      <PaymentMethods />
      <NewsletterSection />
      <FAQ />
      <SocialSection />
      <Footer />
    </div>
  )
}
