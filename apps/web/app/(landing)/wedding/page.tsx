import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { Header } from "@/components/new-landing-page/header"
import { Footer } from "@/components/new-landing-page/footer"
import { WeddingHero } from "@/components/wedding/wedding-hero"
import { WeddingOfferSection } from "@/components/wedding/wedding-offer-section"
import { WeddingStatsSection } from "@/components/wedding/wedding-stats-section"
import { WeddingTestimonials } from "@/components/wedding/wedding-testimonials"
import { WeddingBenefitsSection } from "@/components/wedding/wedding-benefits-section"
import { createPageMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("wedding.hero")

  return createPageMetadata({
    title: `${t("title1")} ${t("title2")} ${t("titleAccent")}`,
    description: t("subtitle"),
    path: "/wedding",
    keywords: ["wedding transport", "wedding chauffeur", "Portugal wedding", "luxury wedding cars"],
  })
}

export default function WeddingPage() {
  return (
    <div className="min-h-screen bg-[#EFE8DC]">
      <Header />
      <div className="pt-[72px]">
        <WeddingHero />
        <WeddingOfferSection />
        <WeddingStatsSection />
        <WeddingTestimonials />
        <WeddingBenefitsSection />
      </div>
      <Footer />
    </div>
  )
}
