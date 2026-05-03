import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { Header } from "@/components/new-landing-page/header"
import { Footer } from "@/components/new-landing-page/footer"
import { WeddingPlannerHero } from "@/components/wedding-planner/wedding-planner-hero"
import { WeddingPlannerTrustedBy } from "@/components/wedding-planner/wedding-planner-trusted-by"
import { WeddingPlannerServices } from "@/components/wedding-planner/wedding-planner-services"
import { WeddingPlannerAdvantages } from "@/components/wedding-planner/wedding-planner-advantages"
import { WeddingPlannerFounders } from "@/components/wedding-planner/wedding-planner-founders"
import { WeddingPlannerTestimonial } from "@/components/wedding-planner/wedding-planner-testimonial"
import { WeddingPlannerCaseStudy } from "@/components/wedding-planner/wedding-planner-case-study"
import { WeddingPlannerReviews } from "@/components/wedding-planner/wedding-planner-reviews"
import { WeddingPlannerWhiteLabel } from "@/components/wedding-planner/wedding-planner-white-label"
import { WeddingPlannerCommission } from "@/components/wedding-planner/wedding-planner-commission"
import { WeddingPlannerPaymentPlans } from "@/components/wedding-planner/wedding-planner-payment-plans"
import { createPageMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("weddingPlanner.hero")

  return createPageMetadata({
    title: `${t("titleLine1")} ${t("titleBefore")} ${t("titleAccent")} ${t("titleAfter")}`.trim(),
    description: t("subtitle"),
    path: "/wedding-planner",
    keywords: [
      "wedding planner partner",
      "wedding transport partnership",
      "Portugal wedding partner program",
      "wedding mobility commissions",
    ],
  })
}

export default function WeddingPlannerPage() {
  return (
    <div className="min-h-screen bg-[#111110]">
      <Header />
      <div className="pt-[72px]">
        <WeddingPlannerHero />
        <WeddingPlannerTrustedBy />
        <WeddingPlannerServices />
        <WeddingPlannerAdvantages />
        <WeddingPlannerFounders />
        <WeddingPlannerTestimonial />
        <WeddingPlannerWhiteLabel />
        <WeddingPlannerCommission />
        <WeddingPlannerPaymentPlans />
        <WeddingPlannerReviews />
        <WeddingPlannerCaseStudy />
      </div>
      <Footer />
    </div>
  )
}
