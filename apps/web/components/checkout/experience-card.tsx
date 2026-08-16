"use client"

import * as React from "react"
import { Plus, Clock } from "lucide-react"
import Image from "next/image"
import { cn } from "@workspace/ui/lib/utils"

/** Selo canto superior esquerdo. `none` não desenha nada. */
export type ExperienceCardTag =
  | "none"
  | "recommended"
  | "mostPopular"
  | "ultraLuxury"
  | "event"

const SERIF = {
  fontFamily: "var(--font-title), 'Cormorant Garamond', serif",
} as const

interface ExperienceCardProps {
  title: string
  price: number
  duration: string
  image: string
  distanceKm?: number
  tag?: ExperienceCardTag
  tagLabel?: string
  /** Etiqueta por cima do preço, para "desde". */
  priceLabel?: string
  /** Etiqueta por baixo do preço, para "por pessoa". */
  priceNote?: string
  /** Localidade, na linha por cima do título. */
  locationLabel?: string
  description?: string
  /**
   * Durações de uma paragem. Havendo mais do que uma, o cartão deixa escolher
   * ali mesmo e passa a escolha ao modal — é a diferença entre uma paragem
   * (quanto tempo o motorista espera) e um tour (quantas pessoas vão).
   */
  durations?: { minutes: number; price: number }[]
  onAdd?: (minutes?: number) => void
}

export function ExperienceCard({
  title,
  price,
  duration,
  image,
  tag = "none",
  tagLabel,
  priceLabel,
  priceNote,
  locationLabel,
  description,
  durations,
  onAdd,
}: ExperienceCardProps) {
  const hasChoice = Boolean(durations && durations.length > 0)
  // A mais longa por omissão, que é a que o protótipo mostra escolhida.
  const [minutes, setMinutes] = React.useState<number | undefined>(
    durations?.[durations.length - 1]?.minutes,
  )
  const chosen = durations?.find((d) => d.minutes === minutes)
  const shownPrice = chosen?.price ?? price

  return (
    <article className="flex h-full w-full flex-col overflow-hidden border border-[rgba(var(--ck-text-rgb,255,255,255),0.12)] bg-[var(--ck-surface,#1e1d1b)]">
      {/* 16/9 e não 16/10: a imagem é o maior bloco do cartão e a proporção
          antiga custava perto de 20px de altura sem mostrar mais nada. */}
      <div className="relative aspect-[16/9] w-full shrink-0">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          sizes="(max-width: 640px) 80vw, 320px"
          className="object-cover"
        />
        {tag !== "none" && tagLabel && (
          <span
            /* Os dois selos em dourado: o "recomendado" era escuro sobre a
               fotografia e mal se lia. O "mais popular" distingue-se pela
               estrela e pelo preenchimento cheio, não pela cor. */
            className={cn(
              "absolute left-3 top-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.8px]",
              (tag === "mostPopular" || tag === "ultraLuxury") &&
                "bg-[var(--ck-accent,#c9a96e)] text-[#0d0d0d]",
              /* Os eventos distinguem-se por cor, não por hierarquia: não são
                 "melhores" do que um tour, são outra coisa. */
              tag === "event" && "bg-[#7c3aed] text-white",
              tag === "recommended" &&
                "border border-[var(--ck-accent,#c9a96e)] bg-[rgba(13,13,13,0.72)] text-[var(--ck-accent,#c9a96e)]",
            )}
          >
            {tag === "mostPopular" ? `★ ${tagLabel}` : tagLabel}
          </span>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 p-4">
        {locationLabel && (
          <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[1.4px] text-[var(--ck-accent,#c9a96e)]">
            <span aria-hidden>◆</span>
            {locationLabel}
          </span>
        )}

        {/* Caixas de altura fixa, não só `line-clamp`. O clamp impede de crescer
            mas deixa encolher, e com títulos de duas e de quatro linhas cada
            cartão começava a descrição a uma altura diferente. Com `min-h` mais
            clamp, a caixa é sempre a mesma: 2 linhas de 25px no título, 3 de
            19px na descrição. */}
        <h3
          className="line-clamp-2 min-h-[50px] text-[20px] leading-[25px] text-[var(--ck-text,#f7f4ef)]"
          style={SERIF}
        >
          {title}
        </h3>

        {description && (
          <p className="line-clamp-3 min-h-[57px] text-[13px] leading-[19px] text-[var(--ck-text-muted,#999)]">
            {description}
          </p>
        )}

        <div className="mt-auto flex flex-col gap-3 pt-2">
          {hasChoice ? (
            <div className="grid grid-cols-2 border border-[rgba(var(--ck-text-rgb,255,255,255),0.12)]">
              {durations!.map((d, i) => {
                const active = d.minutes === minutes
                return (
                  <button
                    key={d.minutes}
                    type="button"
                    onClick={() => setMinutes(d.minutes)}
                    aria-pressed={active}
                    className={cn(
                      "flex flex-col items-center gap-0.5 py-2 transition-colors",
                      i > 0 && "border-l border-[rgba(var(--ck-text-rgb,255,255,255),0.12)]",
                      active
                        ? "bg-[rgba(var(--ck-accent-rgb,201,169,110),0.14)]"
                        : "hover:bg-[rgba(var(--ck-text-rgb,255,255,255),0.04)]",
                    )}
                  >
                    <span className="text-[10px] font-semibold uppercase tracking-[1px] text-[var(--ck-text-muted,#999)]">
                      {d.minutes} min
                    </span>
                    <span
                      className="text-[18px] leading-none text-[var(--ck-text,#f7f4ef)]"
                      style={SERIF}
                    >
                      {d.price}€
                    </span>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[var(--ck-accent-strong,#9a7535)]">
              <Clock className="size-3.5" strokeWidth={2} />
              <span className="text-[12px]">{duration}</span>
            </div>
          )}

          <div className="flex items-end justify-between gap-3">
            {!hasChoice && (
              <div className="flex min-w-0 flex-col gap-1">
                {priceLabel && (
                  <span className="text-[10px] font-semibold uppercase leading-none tracking-[1.2px] text-[var(--ck-text-muted,#999)]">
                    {priceLabel}
                  </span>
                )}
                <span
                  className="text-[22px] leading-none text-[var(--ck-text,#f7f4ef)]"
                  style={SERIF}
                >
                  {shownPrice.toFixed(0)}€
                </span>
                {priceNote && (
                  <span className="text-[10px] font-semibold uppercase leading-none tracking-[1.2px] text-[var(--ck-text-muted,#999)]">
                    {priceNote}
                  </span>
                )}
              </div>
            )}
            <button
              type="button"
              onClick={() => onAdd?.(minutes)}
              aria-label="Adicionar"
              className="ml-auto flex size-10 shrink-0 items-center justify-center bg-[var(--ck-accent,#c9a96e)] transition-colors hover:bg-[var(--ck-accent-hover,#b89558)]"
            >
              <Plus className="size-5 text-[var(--ck-bg,#0d0d0d)]" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
