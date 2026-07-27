"use client"

import { useTranslations } from "next-intl"
import { Testimonials } from "@/components/new-landing-page/testimonials"

/**
 * As reviews do /tours e do /about-us são as mesmas da home — este componente
 * era uma cópia que entretanto divergiu (sem reviews do Google, carrossel a
 * saltar uma página de cada vez e a faixa de fotos antiga). Agora reutiliza o
 * componente da home e só troca o cabeçalho.
 */
/** Faixa de fotos própria do /tours — tours e experiências, não a galeria da home. */
const TOURS_REVIEW_PHOTOS = [
  "/reviews/tours/tour-sintra-royal-palaces-detalhe-01-chegada-pena-v-class.webp",
  "/reviews/tours/tour-sintra-royal-palaces-detalhe-02-regaleira-poco.webp",
  "/reviews/tours/tour-sintra-royal-palaces-detalhe-03-castelo-mouros.webp",
  "/reviews/tours/tour-cabo-da-roca-grupo-v-class.webp",
  "/reviews/tours/portfolio-tours-02-douro-vclass.webp",
  "/reviews/tours/portfolio-tours-03-algarve-cliff-eqs.webp",
  "/reviews/tours/portfolio-tours-04-belem-tower-vclass.webp",
  "/reviews/tours/experiencia-01-polaroid-praca-comercio.webp",
  "/reviews/tours/experiencia-02-fado-alfama.webp",
  "/reviews/tours/experiencia-03-eletrico-28-alfama.webp",
  "/reviews/tours/experiencia-04-pasteis-belem-prova.webp",
  "/reviews/tours/experiencia-05-veleiro-por-sol-tejo.webp",
  "/reviews/tours/experiencia-06-tuk-tuk-alfama.webp",
  "/reviews/tours/experiencia-07-time-out-market.webp",
  "/reviews/tours/experiencia-08-miradouro-por-sol.webp",
  "/reviews/tours/experiencia-09-lx-factory-arte-urbana.webp",
] as const

export function ToursTestimonials() {
  const t = useTranslations("toursTestimonials")
  return (
    <Testimonials
      sectionLabel={t("heading")}
      heading={t("subtitle")}
      photos={TOURS_REVIEW_PHOTOS}
    />
  )
}
