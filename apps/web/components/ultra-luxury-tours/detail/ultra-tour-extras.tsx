"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { Plus, Check, ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { formatPrice } from "@/lib/format"
import type { BookingAddon } from "@/components/shared/booking-addons-selector"

const SERIF_FONT = "var(--font-title), 'Cormorant Garamond', serif"

interface UltraTourExtrasProps {
  addons: BookingAddon[]
  selectedAddonIds: string[]
  onToggleAddon: (id: string) => void
}

function ExtraCard({ addon, selected, onToggle }: { addon: BookingAddon; selected: boolean; onToggle: () => void }) {
  const t = useTranslations("tourDetails")
  return (
    <div className="flex h-full flex-col border border-[rgba(154,117,53,0.22)] bg-[#f5f1eb]">
      <div className="relative aspect-[240/171] w-full overflow-hidden bg-[#1a1a1a]">
        {addon.imageUrl && <Image src={addon.imageUrl} alt={addon.title} fill className="object-cover" sizes="240px" />}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <span className="text-[15px] font-bold leading-[1.3] text-[#0d0d0d]">{addon.title}</span>
        <div className="mt-auto flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-[14px] font-bold text-[#0d0d0d]">{formatPrice(addon.price)}</span>
            {addon.pricingType === "per_person" && (
              <span className="text-[12px] text-[#9a7535]">{t("perPerson")}</span>
            )}
          </div>
          <button
            type="button"
            onClick={onToggle}
            aria-pressed={selected}
            className={cn(
              "flex size-[32px] shrink-0 items-center justify-center transition-colors",
              selected ? "bg-[#8a6f3c] text-[#f7f4ef]" : "bg-[#a08248] text-[#f7f4ef] hover:bg-[#8a6f3c]",
            )}
          >
            {selected ? <Check className="size-[18px]" strokeWidth={2.5} /> : <Plus className="size-[18px]" strokeWidth={2.5} />}
          </button>
        </div>
      </div>
    </div>
  )
}

export function UltraTourExtras({ addons, selectedAddonIds, onToggleAddon }: UltraTourExtrasProps) {
  const t = useTranslations("tourDetails")
  const [perPage, setPerPage] = useState(3)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const onResize = () => setPerPage(window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3)
    onResize()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  const maxOffset = Math.max(addons.length - perPage, 0)
  useEffect(() => {
    setOffset((o) => Math.min(o, maxOffset))
  }, [maxOffset])

  const prev = useCallback(() => setOffset((o) => Math.max(o - 1, 0)), [])
  const next = useCallback(() => setOffset((o) => Math.min(o + 1, maxOffset)), [maxOffset])

  if (addons.length === 0) return null

  const gapPx = 13.6
  const showNav = maxOffset > 0

  return (
    <div>
      <div className="flex flex-col gap-[7px]">
        <span className="text-[11px] font-semibold uppercase tracking-[2.25px] text-[#a08248]">{t("extras")}</span>
        <h2 className="text-[24px] leading-none md:text-[28px]" style={{ fontFamily: SERIF_FONT }}>
          {t("extrasHeading")} <span className="italic text-[#a08248]">{t("extrasHeadingAccent")}</span>
        </h2>
      </div>

      <div className="mt-6 overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            gap: `${gapPx}px`,
            transform: `translateX(calc(-${offset} * (${100 / perPage}% + ${(gapPx * (perPage - 1)) / perPage}px)))`,
          }}
        >
          {addons.map((addon) => (
            <div key={addon._id} className="shrink-0" style={{ width: `calc(${100 / perPage}% - ${(gapPx * (perPage - 1)) / perPage}px)` }}>
              <ExtraCard
                addon={addon}
                selected={selectedAddonIds.includes(addon._id)}
                onToggle={() => onToggleAddon(addon._id)}
              />
            </div>
          ))}
        </div>
      </div>

      {showNav && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={prev}
            disabled={offset === 0}
            aria-label={t("prevExtra")}
            className="flex size-[32px] items-center justify-center border border-[rgba(154,117,53,0.22)] text-[#a08248] transition-colors hover:border-[#a08248] disabled:opacity-30"
          >
            <ArrowLeft className="size-[18px]" strokeWidth={2} />
          </button>
          <div className="flex items-center gap-[6px]">
            {Array.from({ length: maxOffset + 1 }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setOffset(i)}
                aria-label={`${i + 1}`}
                className={cn("size-[6px] rounded-full transition-colors", i === offset ? "bg-[#a08248]" : "bg-[rgba(154,117,53,0.3)]")}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={next}
            disabled={offset >= maxOffset}
            aria-label={t("nextExtra")}
            className="flex size-[32px] items-center justify-center border border-[rgba(154,117,53,0.22)] text-[#a08248] transition-colors hover:border-[#a08248] disabled:opacity-30"
          >
            <ArrowRight className="size-[18px]" strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  )
}
