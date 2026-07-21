"use client"

import { useTranslations } from "next-intl"
import { Testimonials } from "@/components/new-landing-page/testimonials"

/**
 * As reviews do /tours e do /about-us são as mesmas da home — este componente
 * era uma cópia que entretanto divergiu (sem reviews do Google, carrossel a
 * saltar uma página de cada vez e a faixa de fotos antiga). Agora reutiliza o
 * componente da home e só troca o cabeçalho.
 */
export function ToursTestimonials() {
  const t = useTranslations("toursTestimonials")
  return <Testimonials sectionLabel={t("heading")} heading={t("subtitle")} />
}
