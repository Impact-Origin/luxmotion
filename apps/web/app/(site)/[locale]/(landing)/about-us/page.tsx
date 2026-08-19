import { Header } from "@/components/new-landing-page/header"
import { Footer } from "@/components/new-landing-page/footer"
import { HeroSection } from "@/components/about/hero-section"
import { WhoIsSection } from "@/components/about/who-is-section"
import { TimelineSection } from "@/components/about/timeline-section"
import { ValuesSection } from "@/components/about/values-section"
import { PastExperiencesSection } from "@/components/about/past-experiences-section"
import { DriversSection } from "@/components/about/drivers-section"
import { VettingSection } from "@/components/about/vetting-section"
import { TeamSection } from "@/components/about/team-section"
import { ToursTestimonials } from "@/components/tours/tours-testimonials"
import { JoinUsSection } from "@/components/about/join-us-section"
import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { JsonLd } from "@/components/seo/json-ld"
import { createPageMetadata } from "@/lib/seo"
import { buildBreadcrumbSchema, buildOrganizationSchema, buildServiceSchema } from "@/lib/structured-data"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("aboutPage")

  return createPageMetadata({
    title: t("hero.line1"),
    description: t("description"),
    path: "/about-us",
    image: "/about/thumbnail-hero-about-us-v1.webp",
    keywords: ["about easy transfer", "private transport portugal", "chauffeur team"],
  })
}

export default async function AboutUsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <JsonLd data={buildOrganizationSchema()} />
      <JsonLd
        data={
          buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "About Us", url: "/about-us" },
          ])
        }
      />
      <JsonLd
        data={
          buildServiceSchema({
            name: "About Easy Transfer",
            description: "Meet the drivers, team, and values behind Easy Transfer.",
            path: "/about-us",
            image: "/about/thumbnail-hero-about-us-v1.webp",
          })
        }
      />
      <Header />
      <main className="pt-[56px]">
        <HeroSection />
        <WhoIsSection />
        <TimelineSection />
        <ValuesSection />
        <PastExperiencesSection />
        <DriversSection />
        <VettingSection />
        <TeamSection />
        <ToursTestimonials />
        <JoinUsSection />
      </main>
      <Footer />
    </div>
  )
}
