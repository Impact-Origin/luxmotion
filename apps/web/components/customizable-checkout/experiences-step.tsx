"use client"

import * as React from "react"
import { ChevronRight } from "lucide-react"
import { ExperienceCard } from "./experience-card"
import { AddExperienceModal } from "./add-experience-modal"
import type { Experience } from "./shared/types"
import { useTranslations } from "next-intl"
import { Button } from "@workspace/ui/components/button"
import { useCheckout } from "@/components/customizable-checkout/checkout-context"
import type { NearbyTour } from "@/components/checkout/experiences-step"

interface ExperiencesStepProps {
  onContinue: () => void
  nearbyTours: NearbyTour[]
  variant?: "classic" | "modern"
}

function toExperience(tour: NearbyTour): Experience {
  return {
    id: tour._id,
    title: tour.title,
    description: typeof tour.description === "string" ? tour.description : tour.subtitle ?? "",
    image: tour.bannerImageUrl ?? "/images/placeholder-experience.png",
    basePrice: tour.basePrice,
    extras: (tour.addons ?? []).map((addon) => ({
      id: addon._id,
      label: addon.title,
      price: addon.price,
      pricingType: addon.pricingType,
    })),
  }
}

export function ExperiencesStep({ onContinue, nearbyTours, variant = "modern" }: ExperiencesStepProps) {
  const t = useTranslations("experiences")
  const tCommon = useTranslations("common")
  const { addExperience } = useCheckout()
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [selectedExperience, setSelectedExperience] = React.useState<Experience | null>(null)

  const tours = nearbyTours.filter((t) => t.category === "tours")
  const experiences = nearbyTours.filter((t) => t.category === "experiences")
  const privateTours = nearbyTours.filter((t) => t.category === "private")
  const events = nearbyTours.filter((t) => t.category === "events")

  const handleOpenModal = (experience: Experience) => {
    setSelectedExperience(experience)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedExperience(null)
  }

  const handleAddExperience = (data: {
    passengers: number
    date: Date | undefined
    time: string | null
    selectedExtras: string[]
    specialRequest: string
    totalPrice: number
  }) => {
    if (selectedExperience) {
      const tour = nearbyTours.find((t) => t._id === selectedExperience.id)
      addExperience({
        experienceId: selectedExperience.id,
        slug: tour?.slug ?? "",
        category: tour?.category ?? "tours",
        title: selectedExperience.title,
        passengers: data.passengers,
        date: data.date,
        time: data.time,
        extras: data.selectedExtras,
        specialRequest: data.specialRequest,
        totalPrice: data.totalPrice,
      })
      handleCloseModal()
      onContinue()
    }
  }

  const renderCard = (item: NearbyTour) => (
    <ExperienceCard
      key={item._id}
      title={item.title}
      price={item.basePrice}
      duration={item.duration}
      image={item.bannerImageUrl ?? "/images/placeholder-experience.png"}
      distanceKm={item.distanceKm}
      onAdd={() => handleOpenModal(toExperience(item))}
    />
  )

  const renderSection = (title: string, items: NearbyTour[]) => {
    if (items.length === 0) return null
    const isSingleItem = items.length === 1
    return (
      <section>
        <h2
          data-theme-color="checkoutExperiencesSectionSubtitle"
          className={`text-lg lg:text-2xl font-bold mb-6 ${isSingleItem ? "text-center" : ""}`}
          style={{ color: "var(--theme-checkout-experiences-section-subtitle, #222222)" }}
        >
          {title}
        </h2>
        <div className={isSingleItem ? "flex justify-center" : "grid grid-cols-1 lg:grid-cols-2 gap-6"}>
          {items.map((item) => renderCard(item))}
        </div>
      </section>
    )
  }

  const selectedItem = selectedExperience
    ? nearbyTours.find((t) => t._id === selectedExperience.id)
    : null
  const selectedTourId = selectedItem?.category === "events" ? null : selectedItem?._id ?? null

  const modal = selectedExperience && (
    <AddExperienceModal
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      experience={selectedExperience}
      tourId={selectedTourId}
      onAdd={handleAddExperience}
    />
  )

  if (variant === "modern") {
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

        {renderSection(t("tours"), tours)}
        {renderSection(t("experiences"), experiences)}
        {renderSection(t("privateTours"), privateTours)}
        {renderSection(t("events"), events)}

        <div className="flex justify-center pt-4">
          <Button
            data-theme-color="checkoutFormLinkText"
            onClick={onContinue}
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

        {modal}
      </div>
    )
  }

  return (
    <div className="checkout-experiences-step max-w-[1036px] mx-auto px-4 py-8 space-y-14">
      {renderSection(t("extraStop"), privateTours)}
      {renderSection(t("tours"), tours)}
      {renderSection(t("experiences"), experiences)}
      {renderSection(t("events"), events)}

      <div className="flex justify-center pt-4">
        <Button
          data-theme-color="checkoutFormLinkText"
          onClick={onContinue}
          variant="outline"
          className="px-8 h-12 text-[15px] font-semibold border-2 transition-colors"
          style={{
            borderColor: "var(--theme-checkout-form-link-text, #27C7FF)",
            color: "var(--theme-checkout-form-link-text, #27C7FF)",
          }}
        >
          {tCommon("skip")}
          <ChevronRight
            data-theme-color="checkoutFormLinkText"
            className="w-5 h-5 ml-1"
            style={{ color: "var(--theme-checkout-form-link-text, #27C7FF)" }}
          />
        </Button>
      </div>

      {modal}
    </div>
  )
}
