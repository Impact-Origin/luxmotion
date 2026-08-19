import { Header } from "@/components/new-landing-page/header"
import { FleetCarousel } from "@/components/fleet/fleet-carousel"
import { FleetTitleBlock } from "@/components/fleet/fleet-title-block"
import { FleetCategoryFilter } from "@/components/fleet/fleet-category-filter"
import { FleetCategorySection } from "@/components/fleet/fleet-category-section"
import { STANDARD_VEHICLES, XL_VEHICLES, EXECUTIVE_VEHICLES, VAN_VEHICLES, MINIBUS_VEHICLES, COACH_VEHICLES, CLASSIC_VEHICLES } from "@/lib/fleet-vehicles-data"
import { getTranslations as getT } from "next-intl/server"
import { Footer } from "@/components/new-landing-page/footer"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { JsonLd } from "@/components/seo/json-ld"
import { createPageMetadata } from "@/lib/seo"
import { buildBreadcrumbSchema, buildServiceSchema } from "@/lib/structured-data"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("fleetPage")

  return createPageMetadata({
    title: t("heroTitle"),
    description: t("heroSubtitle"),
    path: "/fleet",
    image: "/fleet/hero-fleet.jpeg",
    keywords: ["fleet", "premium vehicles", "van transfer", "executive transport"],
  })
}

export default async function FleetPage() {
  const t = await getT("fleetPage")
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <JsonLd
        data={
          buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Fleet", url: "/fleet" },
          ])
        }
      />
      <JsonLd
        data={
          buildServiceSchema({
            name: "Easy Transfer Fleet",
            description: "Premium sedans, vans, minibuses, and buses for private transfers in Portugal.",
            path: "/fleet",
            image: "/fleet/hero-fleet.jpeg",
          })
        }
      />
      <Header />
      <div className="pt-[46px] md:pt-[46px]">
        <FleetCarousel />
        <FleetTitleBlock />
        <div className="pt-8 md:pt-10">
          <FleetCategoryFilter />
        </div>
        <FleetCategorySection
          categoryKey="standard"
          categoryLabelKey="category.standard"
          headingFirst={t("standard.headingFirst")}
          headingAccent={t("standard.headingAccent")}
          vehicles={STANDARD_VEHICLES}
        />
        <FleetCategorySection
          categoryKey="xl"
          categoryLabelKey="category.xl"
          headingFirst={t("xl.headingFirst")}
          headingAccent={t("xl.headingAccent")}
          vehicles={XL_VEHICLES}
        />
        <FleetCategorySection
          categoryKey="executivo"
          categoryLabelKey="category.executivo"
          headingFirst={t("executive.headingFirst")}
          headingAccent={t("executive.headingAccent")}
          vehicles={EXECUTIVE_VEHICLES}
        />
        <FleetCategorySection
          categoryKey="van"
          categoryLabelKey="category.van"
          headingFirst={t("van.headingFirst")}
          headingAccent={t("van.headingAccent")}
          vehicles={VAN_VEHICLES}
        />
        <FleetCategorySection
          categoryKey="minibus"
          categoryLabelKey="category.minibus"
          headingFirst={t("minibus.headingFirst")}
          headingAccent={t("minibus.headingAccent")}
          vehicles={MINIBUS_VEHICLES}
          desktopColumns={2}
        />
        <FleetCategorySection
          categoryKey="autocarro"
          categoryLabelKey="category.autocarro"
          headingFirst={t("coach.headingFirst")}
          headingAccent={t("coach.headingAccent")}
          vehicles={COACH_VEHICLES}
          desktopColumns={2}
        />
        <FleetCategorySection
          categoryKey="classicos"
          categoryLabelKey="category.classicos"
          headingFirst={t("classics.headingFirst")}
          headingAccent={t("classics.headingAccent")}
          vehicles={CLASSIC_VEHICLES}
        />
        <div className="h-12 md:h-16" />
      </div>
      <Footer />
    </div>
  )
}


