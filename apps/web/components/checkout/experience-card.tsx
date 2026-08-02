"use client"

import { Plus, Clock } from "lucide-react"
import Image from "next/image"

/** Selo canto superior esquerdo. `none` não desenha nada. */
export type ExperienceCardTag = "none" | "recommended" | "mostPopular"

interface ExperienceCardProps {
  title: string
  price: number
  duration: string
  image: string
  distanceKm?: number
  tag?: ExperienceCardTag
  tagLabel?: string
  /** Prefixo do preço, para "a partir de" ou "15 min". */
  priceNote?: string
  onAdd?: () => void
}

export function ExperienceCard({
  title,
  price,
  duration,
  image,
  tag = "none",
  tagLabel,
  priceNote,
  onAdd,
}: ExperienceCardProps) {
  return (
    <div className="bg-[var(--ck-surface,#1e1d1b)] border border-[rgba(var(--ck-text-rgb,255,255,255),0.12)] flex flex-col w-full h-[260px] overflow-hidden">
      <div className="relative flex-1 min-h-0 w-full">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          sizes="220px"
          className="object-cover"
        />
        {tag !== "none" && tagLabel && (
          <span
            className={
              tag === "mostPopular"
                ? "absolute left-2 top-2 bg-[var(--ck-accent,#c9a96e)] text-[#0d0d0d] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.6px]"
                : "absolute left-2 top-2 bg-[rgba(13,13,13,0.82)] text-[var(--ck-accent,#c9a96e)] border border-[var(--ck-accent,#c9a96e)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.6px]"
            }
          >
            {tagLabel}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-[3.3px] p-3">
        <h3 className="text-[12px] font-bold text-[var(--ck-text,#f7f4ef)] leading-[19.97px] truncate">{title}</h3>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-[14px] font-bold text-[var(--ck-text,#f7f4ef)] leading-[22.53px]">
              €{price.toFixed(0)}
              {priceNote && (
                <span className="ml-1 text-[11px] font-normal text-[var(--ck-text-muted,#999)]">
                  {priceNote}
                </span>
              )}
            </span>
            <div className="flex items-center gap-[3px] text-[var(--ck-accent-strong,#9a7535)]">
              <Clock className="w-[14px] h-[14px]" strokeWidth={2} />
              <span className="text-[12px] font-normal leading-[15.87px]">{duration}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onAdd}
            aria-label="Add"
            className="w-8 h-8 shrink-0 bg-[var(--ck-accent,#c9a96e)] hover:bg-[var(--ck-accent-hover,#b89558)] transition-colors flex items-center justify-center"
          >
            <Plus className="w-[18px] h-[18px] text-[var(--ck-bg,#0d0d0d)]" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  )
}
