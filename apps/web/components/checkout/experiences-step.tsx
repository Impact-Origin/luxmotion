"use client"

import * as React from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { ExperienceCard } from "./experience-card"
import { AddExperienceModal, type SelectedAddonLine } from "./add-experience-modal"
import { CheckoutStepLayout } from "./shared/checkout-step-layout"
import type { Experience } from "./shared/types"
import { useTranslations } from "next-intl"
import { useCheckout } from "@/components/checkout/checkout-context"

/**
 * Categorias mostradas no passo 2.
 *
 * `upsellStop` e `upsellExperience` vêm das tabelas de upsells, geridas em
 * /admin/upsells. `stops` e `experiences` são as categorias antigas de `tours`
 * — já não são desenhadas aqui, mas o tipo mantém-nas porque as reservas
 * antigas ainda as usam.
 */
export type NearbyCategory =
  | "tours"
  | "experiences"
  | "private"
  | "stops"
  | "events"
  | "upsellStop"
  | "upsellExperience"

export interface NearbyTour {
  _id: string
  slug: string
  title: string
  subtitle?: string
  description: unknown
  bannerImageUrl: string | null
  basePrice: number
  duration: string
  /** Ausente nos upsells universais, que não dependem de onde o cliente vai. */
  distanceKm?: number
  category: NearbyCategory
  /** Selo no canto do card ("Recomendado", "Mais popular"). */
  tag?: "none" | "recommended" | "mostPopular"
  /** Preço fixo em vez de por passageiro. */
  flatPrice?: boolean
  /** Nos upsells: o modal pede data? Mostra a caixa de pedido especial? */
  hasDateField?: boolean
  hasSpecialRequest?: boolean
  /** Nota ao lado do preço no cartão ("· €10 / 15 min", "/ pessoa"). */
  priceNote?: string
  /** Local do upsell, para a order saber onde é a paragem. */
  location?: {
    title: string
    address: string
    lat?: number
    lng?: number
    placeId?: string
  } | null
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
    image: tour.bannerImageUrl ?? "/images/placeholder-experience.webp",
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
    <div className="border-b-[0.8px] border-[rgba(var(--ck-text-rgb,247,244,239),0.08)] pb-2">
      <span className="text-[12px] font-bold text-[var(--ck-text-muted,#999)] uppercase tracking-[1.152px] leading-none">
        {children}
      </span>
    </div>
  )
}

export function ExperiencesStep({ onContinue, onBack, nearbyTours }: ExperiencesStepProps) {
  const t = useTranslations("experiences")
  const tCommon = useTranslations("common")
  const { addExperience } = useCheckout()
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [selectedExperience, setSelectedExperience] = React.useState<Experience | null>(null)

  const tours = nearbyTours.filter((item) => item.category === "tours")
  const privateTours = nearbyTours.filter((item) => item.category === "private")
  const events = nearbyTours.filter((item) => item.category === "events")
  const stops = nearbyTours.filter((item) => item.category === "upsellStop")
  const experiences = nearbyTours.filter((item) => item.category === "upsellExperience")

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
    selectedAddons: SelectedAddonLine[]
    specialRequest: string
    totalPrice: number
  }) => {
    if (!selectedExperience) return
    const tour = nearbyTours.find((item) => item._id === selectedExperience.id)
    addExperience({
      experienceId: selectedExperience.id,
      slug: tour?.slug ?? "",
      category: tour?.category ?? "tours",
      title: selectedExperience.title,
      passengers: data.passengers,
      date: data.date,
      time: data.time,
      extras: data.selectedExtras,
      // Os extras seguem agora valorizados até à order: antes o valor entrava no
      // total e a operação nunca ficava a saber o que tinha sido vendido.
      selectedAddons: data.selectedAddons,
      location: tour?.location ?? null,
      specialRequest: data.specialRequest,
      totalPrice: data.totalPrice,
    })
    handleCloseModal()
    onContinue()
  }

  const renderSection = (label: string, items: NearbyTour[]) => {
    if (items.length === 0) return null
    return (
      <section className="flex flex-col gap-4">
        <SectionLabel>{label}</SectionLabel>
        {/* Uniform wrapping grid — every card is the same size, no horizontal scroll. */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {items.map((item) => (
            <ExperienceCard
              key={item._id}
              title={item.title}
              price={item.basePrice}
              duration={item.duration}
              image={item.bannerImageUrl ?? "/images/placeholder-experience.webp"}
              distanceKm={item.distanceKm}
              tag={item.tag}
              tagLabel={item.tag && item.tag !== "none" ? t(`tags.${item.tag}`) : undefined}
              priceNote={item.priceNote}
              onAdd={() => handleOpenModal(toExperience(item))}
            />
          ))}
        </div>
      </section>
    )
  }

  const selectedItem = selectedExperience
    ? nearbyTours.find((item) => item._id === selectedExperience.id)
    : null
  /* Só os tours têm calendário de disponibilidade. Passar aqui o id de um
     evento ou de um upsell fazia a query de disponibilidade rebentar — não é
     um `Id<"tours">`. */
  const selectedTourId =
    selectedItem && ["tours", "private", "stops", "experiences"].includes(selectedItem.category)
      ? selectedItem._id
      : null

  return (
    <CheckoutStepLayout>
      <div className="flex flex-col gap-8 pb-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-[24px] font-semibold leading-none text-[var(--ck-text,#f7f4ef)]" style={SERIF_FONT}>
            {t("title")}
          </h1>
          <button
            type="button"
            onClick={onContinue}
            className="inline-flex items-center gap-2 h-12 px-8 text-[13px] font-semibold uppercase tracking-[1px] bg-[var(--ck-accent,#c9a96e)] hover:bg-[var(--ck-accent-hover,#b89558)] text-[#0D0D0D] transition-colors"
          >
            {tCommon("continue")}
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        {/* Paragens primeiro: são extras curtos no próprio trajeto. */}
        {renderSection(t("extraStops"), stops)}
        {renderSection(t("privateTours"), privateTours)}
        {renderSection(t("tours"), tours)}
        {renderSection(t("experiences"), experiences)}
        {renderSection(t("events"), events)}

        <div className="flex items-center justify-between gap-4 mt-2">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 h-12 px-6 text-[13px] font-semibold uppercase tracking-[1px] text-[var(--ck-text,#f7f4ef)] bg-[var(--ck-surface,#1a1918)] border border-[rgba(var(--ck-text-rgb,255,255,255),0.08)] hover:border-[var(--ck-accent,#c9a96e)] hover:text-[var(--ck-accent,#c9a96e)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2} />
            {tCommon("back")}
          </button>
          <button
            type="button"
            onClick={onContinue}
            className="inline-flex items-center gap-2 h-12 px-8 text-[13px] font-semibold uppercase tracking-[1px] bg-[var(--ck-accent,#c9a96e)] hover:bg-[var(--ck-accent-hover,#b89558)] text-[#0D0D0D] transition-colors"
          >
            {tCommon("continue")}
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        {selectedExperience && (
          <AddExperienceModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            experience={selectedExperience}
            tourId={selectedTourId}
            flatPrice={selectedItem?.flatPrice ?? false}
            requireDateTime={selectedItem?.hasDateField ?? true}
            showSpecialRequest={selectedItem?.hasSpecialRequest ?? false}
            onAdd={handleAddExperience}
          />
        )}
      </div>
    </CheckoutStepLayout>
  )
}
