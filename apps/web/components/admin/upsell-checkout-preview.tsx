"use client"

import { ExperienceCard, type ExperienceCardTag } from "@/components/checkout/experience-card"

/**
 * Pré-visualização de um upsell tal como aparece a meio do checkout.
 *
 * Usa o MESMO componente que o checkout desenha, e não uma cópia: se o card
 * mudar lá, muda aqui. Sem `.checkout-theme` por cima, os tokens `--ck-*` caem
 * nos valores escuros por omissão — que é exactamente o checkout por defeito.
 */
export function UpsellCheckoutPreview({
  title,
  price,
  duration,
  image,
  tag,
  tagLabel,
  priceNote,
}: {
  title: string
  price: number
  duration: string
  image: string | null
  tag: ExperienceCardTag
  tagLabel?: string
  priceNote?: string
}) {
  return (
    <div className="bg-[#0d0d0d] border border-border rounded-xl p-5">
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[1.15px] text-[#999]">
        No checkout
      </p>
      <div className="max-w-[220px]">
        <ExperienceCard
          title={title || "Sem título"}
          price={price}
          duration={duration}
          image={image ?? "/shared/placeholder-experience.webp"}
          tag={tag}
          tagLabel={tagLabel}
          priceNote={priceNote}
        />
      </div>
    </div>
  )
}
