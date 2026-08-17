"use client"

import { ChevronRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { ExperienceCard } from "@/components/customizable-checkout/experience-card"
import { Button } from "@workspace/ui/components/button"
import type { NearbyTour } from "@/components/checkout/experiences-step"

interface ExperiencesStepPreviewProps {
  nearbyTours: NearbyTour[]
}

export function ExperiencesStepPreview({ nearbyTours }: ExperiencesStepPreviewProps) {
  const t = useTranslations("experiences")

  const tours = nearbyTours.filter((item) => item.category === "tours")
  const experiences = nearbyTours.filter((item) => item.category === "experiences")
  const privateTours = nearbyTours.filter((item) => item.category === "private")
  const stops = nearbyTours.filter((item) => item.category === "stops")
  const events = nearbyTours.filter((item) => item.category === "events")

  const renderSection = (title: string, items: NearbyTour[]) => {
    if (items.length === 0) return null
    const singleItem = items.length === 1
    return (
      <section>
        <h2
          data-theme-color="checkoutExperiencesSectionSubtitle"
          className={`text-lg lg:text-2xl font-bold mb-6 ${singleItem ? "text-center" : ""}`}
          style={{ color: "var(--theme-checkout-experiences-section-subtitle, #222222)" }}
        >
          {title}
        </h2>
        <div className={singleItem ? "flex justify-center" : "grid grid-cols-1 lg:grid-cols-2 gap-6"}>
          {items.map((item) => (
            <ExperienceCard
              key={item._id}
              title={item.title}
              price={item.basePrice}
              duration={item.duration}
              image={item.bannerImageUrl ?? "/shared/placeholder-experience.webp"}
              distanceKm={item.distanceKm}
            />
          ))}
        </div>
      </section>
    )
  }

  return (
    <div className="checkout-experiences-step max-w-[1036px] mx-auto px-4 py-8 space-y-14">
      <div className="text-center mb-4">
        <h1
          data-theme-color="checkoutExperiencesSectionTitle"
          className="text-3xl font-bold mb-2"
          style={{ color: "var(--theme-checkout-experiences-section-title, #222222)" }}
        >
          {t("title")}
        </h1>
      </div>

      {renderSection(t("extraStops"), stops)}
      {renderSection(t("tours"), tours)}
      {renderSection(t("experiences"), experiences)}
      {renderSection(t("privateTours"), privateTours)}
      {renderSection(t("events"), events)}

      <div className="flex justify-center pt-4">
        <Button
          data-theme-color="checkoutFormLinkText"
          variant="outline"
          className="px-8 h-12 text-[15px] font-semibold border-2 transition-colors"
          style={{
            borderColor: "var(--theme-checkout-form-link-text, #27C7FF)",
            color: "var(--theme-checkout-form-link-text, #27C7FF)",
          }}
        >
          {t("skipStep")}
          <ChevronRight
            data-theme-color="checkoutFormLinkText"
            className="w-5 h-5 ml-1"
            style={{ color: "var(--theme-checkout-form-link-text, #27C7FF)" }}
          />
        </Button>
      </div>
    </div>
  )
}
