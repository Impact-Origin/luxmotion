import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { Header } from "@/components/new-landing-page/header"
import { Footer } from "@/components/new-landing-page/footer"
import { SchoolsHero } from "@/components/schools/schools-hero"
import { SchoolsBenefits } from "@/components/schools/schools-benefits"
import { SchoolsStats } from "@/components/schools/schools-stats"
import { SchoolsProcess } from "@/components/schools/schools-process"
import { SchoolsTrustedBy } from "@/components/schools/schools-trusted-by"
import { SchoolsReviews } from "@/components/schools/schools-reviews"
import { SchoolsPayment } from "@/components/schools/schools-payment"
import { SchoolsQuote } from "@/components/schools/schools-quote"
import { SchoolsNewsletter } from "@/components/schools/schools-newsletter"
import { createPageMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("schools.hero")

  return createPageMetadata({
    title: `${t("title1")} ${t("titleAccent")} ${t("title2")} ${t("title3")}`,
    description: t("subtitle"),
    path: "/schools",
    keywords: ["school transport", "school transfer Portugal", "certified school driver"],
  })
}

export default function SchoolsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header variant="light" />
      <div className="pt-[72px]">
        <SchoolsHero />
        <SchoolsBenefits />
        <SchoolsStats />
        <SchoolsProcess />
        <SchoolsTrustedBy />
        <SchoolsReviews />
        <SchoolsPayment />
        <SchoolsQuote />
        <SchoolsNewsletter />
      </div>
      <Footer />
    </div>
  )
}
