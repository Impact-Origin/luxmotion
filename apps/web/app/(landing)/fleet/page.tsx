import { Header } from "@/components/new-landing-page/header"
import { FleetCarousel } from "@/components/fleet/fleet-carousel"
import { FleetVehiclesByCategory } from "@/components/fleet/fleet-vehicles-by-category"
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
    image: "/hero_fleet.jpeg",
    keywords: ["fleet", "premium vehicles", "van transfer", "executive transport"],
  })
}

export default function FleetPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
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
            image: "/hero_fleet.jpeg",
          })
        }
      />
      <Header />
      <div className="pt-[46px] md:pt-[46px] flex flex-col gap-12 md:gap-16">
        <FleetCarousel />
        <FleetVehiclesByCategory />
      </div>
      <Footer />
    </div>
  )
}


