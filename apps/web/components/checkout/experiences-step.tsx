"use client"

import * as React from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { ExperienceCard } from "./experience-card"
import { AddExperienceModal } from "./add-experience-modal"
import { CheckoutStepLayout } from "./shared/checkout-step-layout"
import type { Experience } from "./shared/types"
import { useTranslations } from "next-intl"
import { useCheckout } from "@/components/checkout/checkout-context"

export interface NearbyTour {
  _id: string
  slug: string
  title: string
  subtitle?: string
  description: unknown
  bannerImageUrl: string | null
  basePrice: number
  duration: string
  distanceKm: number
  category: "tours" | "experiences" | "private" | "events"
  addons?: {
    _id: string
    title: string
    description?: string
    imageUrl?: string | null
    price: number
    pricingType: "per_person" | "flat"
    currency: string
  }[]
}

interface ExperiencesStepProps {
  onContinue: () => void
  onBack?: () => void
  nearbyTours: NearbyTour[]
}

const SERIF_FONT = {
  fontFamily: "var(--font-title), 'Cormorant Garamond', serif",
} as const

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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-b-[0.8px] border-[rgba(247,244,239,0.08)] pb-[0.8px] h-6 flex items-center">
      <span className="text-[12px] font-bold text-[#999] uppercase tracking-[1.152px] leading-none">
        {children}
      </span>
    </div>
  )
}

function CardRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-[13.6px] overflow-x-auto pb-1 scrollbar-hide">
      {children}
    </div>
  )
}

export function ExperiencesStep({ onContinue, onBack, nearbyTours }: ExperiencesStepProps) {
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

  const renderSection = (label: string, items: NearbyTour[]) => {
    if (items.length === 0) return null
    return (
      <section className="flex flex-col gap-4">
        <SectionLabel>{label}</SectionLabel>
        <CardRow>{items.map(renderCard)}</CardRow>
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

  return (
    <CheckoutStepLayout>
      <div className="flex flex-col gap-4 pb-10">
        <h1
          className="text-[24px] font-semibold leading-none text-[#F7F4EF]"
          style={SERIF_FONT}
        >
          {t("title")}
        </h1>

        {renderSection(t("extraStops"), privateTours)}
        {renderSection(t("tours"), tours)}
        {renderSection(t("experiences"), experiences)}
        {renderSection(t("events"), events)}

        <div className="flex items-center justify-between pt-6">
          <button
            type="button"
            onClick={onBack}
            className="h-12 px-8 border border-[#999] text-[#999] text-[14px] font-medium uppercase tracking-[1.1px] inline-flex items-center gap-2 hover:border-[#F7F4EF] hover:text-[#F7F4EF] transition-colors"
          >
            <ArrowLeft className="w-[18px] h-[18px]" strokeWidth={2} />
            <span className="px-2">{tCommon("back")}</span>
          </button>
          <button
            type="button"
            onClick={onContinue}
            className="h-12 px-8 bg-[#C9A96E] border border-[#C9A96E] text-[#0D0D0D] text-[14px] font-medium uppercase tracking-[1.1px] inline-flex items-center gap-2 hover:bg-[#b89558] hover:border-[#b89558] transition-colors"
          >
            <span className="px-2">{tCommon("continue")}</span>
            <ArrowRight className="w-[18px] h-[18px]" strokeWidth={2} />
          </button>
        </div>

        {modal}
      </div>
    </CheckoutStepLayout>
  )
}
