"use client"

import * as React from "react"
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
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
  /** Preço é por passageiro — a etiqueta sob o preço é traduzida no cartão. */
  perPerson?: boolean
  /**
   * Durações de uma paragem, com o preço de cada. É o que substitui os
   * contadores de passageiros: numa paragem escolhe-se quanto tempo o motorista
   * espera, não quantas pessoas vão — elas já vão todas no carro.
   */
  durations?: { minutes: number; price: number }[]
  /** Localidade, para a linha por cima do título no cartão. */
  locationLabel?: string
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
    duration: tour.duration,
    locationLabel: tour.locationLabel,
    extras: (tour.addons ?? []).map((addon) => ({
      id: addon._id,
      label: addon.title,
      price: addon.price,
      pricingType: addon.pricingType,
    })),
  }
}

/**
 * Secção em carrossel, como no protótipo.
 *
 * A grelha anterior crescia para baixo: com dezoito paragens o passo ficava uma
 * lista interminável e o resto do checkout desaparecia do ecrã. Aqui os cartões
 * correm na horizontal e as setas movem uma "página" de cada vez.
 */
function CarouselSection({
  index,
  title,
  children,
}: {
  index: number
  title: string
  children: React.ReactNode
}) {
  const trackRef = React.useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = React.useState(true)
  const [atEnd, setAtEnd] = React.useState(false)

  const sync = React.useCallback(() => {
    const el = trackRef.current
    if (!el) return
    setAtStart(el.scrollLeft <= 1)
    // 1px de folga: o scrollLeft é fraccionário e nunca bate certo com o fim.
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1)
  }, [])

  React.useEffect(() => {
    sync()
    const el = trackRef.current
    if (!el) return
    el.addEventListener("scroll", sync, { passive: true })
    return () => el.removeEventListener("scroll", sync)
  }, [sync])

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: dir * Math.max(280, el.clientWidth * 0.8), behavior: "smooth" })
  }

  return (
    <section className="flex min-w-0 flex-col gap-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <span className="text-[11px] font-semibold tracking-[2px] text-[var(--ck-accent,#c9a96e)]">
            {String(index).padStart(2, "0")}
          </span>
          <h2
            className="text-[22px] leading-none text-[var(--ck-text,#f7f4ef)]"
            style={SERIF_FONT}
          >
            {title}
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {([-1, 1] as const).map((dir) => {
            const disabled = dir === -1 ? atStart : atEnd
            const Icon = dir === -1 ? ChevronLeft : ChevronRight
            return (
              <button
                key={dir}
                type="button"
                onClick={() => scrollBy(dir)}
                disabled={disabled}
                aria-label={dir === -1 ? "Anterior" : "Seguinte"}
                className="flex size-9 items-center justify-center rounded-full border border-[rgba(var(--ck-text-rgb,255,255,255),0.18)] text-[var(--ck-text,#f7f4ef)] transition-colors enabled:hover:border-[var(--ck-accent,#c9a96e)] enabled:hover:text-[var(--ck-accent,#c9a96e)] disabled:opacity-30"
              >
                <Icon className="size-4" strokeWidth={1.75} />
              </button>
            )
          })}
        </div>
      </div>

      {/* `snap` para os cartões pararem alinhados, e a scrollbar escondida por
          serem as setas a comandar. */}
      <div
        ref={trackRef}
        className="-mx-1 flex w-full min-w-0 snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
    </section>
  )
}

export function ExperiencesStep({ onContinue, onBack, nearbyTours }: ExperiencesStepProps) {
  const t = useTranslations("experiences")
  const tCommon = useTranslations("common")
  const { addExperience } = useCheckout()
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [selectedExperience, setSelectedExperience] = React.useState<Experience | null>(null)
  // Duração escolhida no cartão, para o modal já abrir com ela seleccionada.
  const [initialMinutes, setInitialMinutes] = React.useState<number | undefined>()

  const tours = nearbyTours.filter((item) => item.category === "tours")
  const privateTours = nearbyTours.filter((item) => item.category === "private")
  const events = nearbyTours.filter((item) => item.category === "events")
  const stops = nearbyTours.filter((item) => item.category === "upsellStop")
  const experiences = nearbyTours.filter((item) => item.category === "upsellExperience")

  const handleOpenModal = (experience: Experience, minutes?: number) => {
    setSelectedExperience(experience)
    setInitialMinutes(minutes)
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

  const renderSection = (label: string, items: NearbyTour[], index: number) => {
    if (items.length === 0) return null
    return (
      <CarouselSection key={label} index={index} title={label}>
        {items.map((item) => (
          <div
            key={item._id}
            className="w-[264px] shrink-0 snap-start sm:w-[300px]"
          >
            <ExperienceCard
              title={item.title}
              price={item.basePrice}
              duration={item.duration}
              image={item.bannerImageUrl ?? "/images/placeholder-experience.webp"}
              distanceKm={item.distanceKm}
              tag={item.tag}
              tagLabel={item.tag && item.tag !== "none" ? t(`tags.${item.tag}`) : undefined}
              priceNote={item.perPerson ? t("perPerson") : undefined}
              locationLabel={item.locationLabel}
              description={
                typeof item.description === "string" ? item.description : item.subtitle
              }
              durations={item.durations}
              onAdd={(minutes) => handleOpenModal(toExperience(item), minutes)}
            />
          </div>
        ))}
      </CarouselSection>
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

        {/* Numeradas pela ordem em que aparecem, saltando as vazias — como no
            protótipo, onde as paragens são a 01. */}
        {[
          [t("extraStops"), stops],
          [t("experiences"), experiences],
          [t("privateTours"), privateTours],
          [t("tours"), tours],
          [t("events"), events],
        ]
          .filter(([, items]) => (items as NearbyTour[]).length > 0)
          .map(([label, items], i) =>
            renderSection(label as string, items as NearbyTour[], i + 1),
          )}

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
            durations={selectedItem?.durations}
            initialMinutes={initialMinutes}
            onAdd={handleAddExperience}
          />
        )}
      </div>
    </CheckoutStepLayout>
  )
}
