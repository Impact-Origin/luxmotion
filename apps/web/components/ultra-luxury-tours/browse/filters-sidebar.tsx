"use client"

import { useState, type ReactNode } from "react"
import { useTranslations } from "next-intl"
import { Check, ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { formatPrice } from "@/lib/format"
import type { BrowseFilters, FilterGroupKey, FilterOption } from "./browse-types"

const SERIF_FONT = "var(--font-title), 'Cormorant Garamond', serif"

interface FiltersSidebarProps {
  filters: BrowseFilters
  regionOptions: FilterOption[]
  tourTypeOptions: FilterOption[]
  themeOptions: FilterOption[]
  durationOptions: FilterOption[]
  groupSizeOptions: FilterOption[]
  priceBounds: [number, number]
  onToggle: (group: FilterGroupKey, value: string) => void
  onPrice: (range: [number, number]) => void
  onClear: () => void
}

function FilterGroup({ index, title, children }: { index: string; title: string; children: ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between pb-3"
      >
        <span className="flex items-baseline gap-2 text-[18px] tracking-[-0.18px]" style={{ fontFamily: SERIF_FONT }}>
          <span className="font-semibold italic text-[#a08248]">{index}</span>
          <span className="font-semibold text-[#1c1b18]">{title}</span>
        </span>
        {open ? (
          <ChevronUp className="size-[18px] text-[#a08248]" strokeWidth={2} />
        ) : (
          <ChevronDown className="size-[18px] text-[#a08248]" strokeWidth={2} />
        )}
      </button>
      {open && children}
    </div>
  )
}

function CheckOption({
  option,
  checked,
  onToggle,
}: {
  option: FilterOption
  checked: boolean
  onToggle: () => void
}) {
  return (
    <label className="flex w-full cursor-pointer items-center gap-[10px] py-2">
      <span
        className={cn(
          "flex size-[16px] shrink-0 items-center justify-center border transition-colors",
          checked ? "border-[#a08248] bg-[#a08248]" : "border-[rgba(28,27,24,0.25)] bg-transparent",
        )}
      >
        {checked && <Check className="size-[12px] text-[#f7f4ef]" strokeWidth={3} />}
      </span>
      <input type="checkbox" checked={checked} onChange={onToggle} className="sr-only" />
      <span className="flex-1 text-[14px] text-[#1c1b18]">{option.label}</span>
      <span className="text-[12px] text-[rgba(28,27,24,0.38)]">{option.count}</span>
    </label>
  )
}

function Pills({
  options,
  selected,
  onToggle,
}: {
  options: FilterOption[]
  selected: string[]
  onToggle: (value: string) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((option) => {
        const active = selected.includes(option.value)
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onToggle(option.value)}
            className={cn(
              "flex items-center justify-center border px-[14px] py-[9px] text-[12px] font-medium uppercase tracking-[0.5px] transition-colors",
              active
                ? "border-[#a08248] bg-[rgba(154,117,53,0.1)] text-[#a08248]"
                : "border-[rgba(28,27,24,0.08)] bg-[#fbfaf7] text-[#1c1b18] hover:border-[rgba(154,117,53,0.4)]",
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export function FiltersSidebar({
  filters,
  regionOptions,
  tourTypeOptions,
  themeOptions,
  durationOptions,
  groupSizeOptions,
  priceBounds,
  onToggle,
  onPrice,
  onClear,
}: FiltersSidebarProps) {
  const t = useTranslations("ultraLuxuryTours.browse")
  const [boundMin, boundMax] = priceBounds
  const [valMin, valMax] = filters.price

  return (
    <div className="flex flex-col gap-6 pt-[6px]">
      <div className="flex items-center justify-between border-b-[0.8px] border-[rgba(28,27,24,0.08)] pb-4">
        <span className="text-[11px] font-bold uppercase tracking-[2.64px] text-[#1c1b18]">{t("refine")}</span>
        <button
          type="button"
          onClick={onClear}
          className="text-[10px] font-bold uppercase tracking-[0.8px] text-[rgba(28,27,24,0.38)] transition-colors hover:text-[#a08248]"
        >
          {t("clearAll")}
        </button>
      </div>

      {regionOptions.length > 0 && (
        <FilterGroup index="01" title={t("groups.region")}>
          <div>
            {regionOptions.map((o) => (
              <CheckOption key={o.value} option={o} checked={filters.regions.includes(o.value)} onToggle={() => onToggle("regions", o.value)} />
            ))}
          </div>
        </FilterGroup>
      )}

      {tourTypeOptions.length > 0 && (
        <FilterGroup index="02" title={t("groups.tourType")}>
          <div>
            {tourTypeOptions.map((o) => (
              <CheckOption key={o.value} option={o} checked={filters.tourTypes.includes(o.value)} onToggle={() => onToggle("tourTypes", o.value)} />
            ))}
          </div>
        </FilterGroup>
      )}

      <FilterGroup index="03" title={t("groups.duration")}>
        <Pills options={durationOptions} selected={filters.durations} onToggle={(v) => onToggle("durations", v)} />
      </FilterGroup>

      {themeOptions.length > 0 && (
        <FilterGroup index="04" title={t("groups.theme")}>
          <div>
            {themeOptions.map((o) => (
              <CheckOption key={o.value} option={o} checked={filters.themes.includes(o.value)} onToggle={() => onToggle("themes", o.value)} />
            ))}
          </div>
        </FilterGroup>
      )}

      <FilterGroup index="05" title={t("groups.price")}>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-[14px] font-semibold text-[#1c1b18]">
            <span>{formatPrice(valMin)}</span>
            <span>{formatPrice(valMax)}</span>
          </div>
          <div className="relative h-[3px] w-full bg-[rgba(28,27,24,0.16)]">
            <div
              className="absolute h-full bg-[#a08248]"
              style={{
                left: `${((valMin - boundMin) / Math.max(1, boundMax - boundMin)) * 100}%`,
                right: `${100 - ((valMax - boundMin) / Math.max(1, boundMax - boundMin)) * 100}%`,
              }}
            />
            <input
              type="range"
              min={boundMin}
              max={boundMax}
              value={valMin}
              onChange={(e) => onPrice([Math.min(Number(e.target.value), valMax), valMax])}
              className="pointer-events-none absolute -top-[8px] h-[18px] w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-[16px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-[#a08248] [&::-webkit-slider-thumb]:bg-[#f7f4ef]"
            />
            <input
              type="range"
              min={boundMin}
              max={boundMax}
              value={valMax}
              onChange={(e) => onPrice([valMin, Math.max(Number(e.target.value), valMin)])}
              className="pointer-events-none absolute -top-[8px] h-[18px] w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-[16px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-[#a08248] [&::-webkit-slider-thumb]:bg-[#f7f4ef]"
            />
          </div>
          <div className="flex items-center justify-between text-[12px] text-[rgba(28,27,24,0.38)]">
            <span>{formatPrice(boundMin)}</span>
            <span>{formatPrice(boundMax)}+</span>
          </div>
        </div>
      </FilterGroup>

      <FilterGroup index="06" title={t("groups.groupSize")}>
        <Pills options={groupSizeOptions} selected={filters.groupSizes} onToggle={(v) => onToggle("groupSizes", v)} />
      </FilterGroup>
    </div>
  )
}
