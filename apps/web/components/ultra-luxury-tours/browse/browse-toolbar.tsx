"use client"

import { useTranslations } from "next-intl"
import { X, LayoutGrid, List, SlidersHorizontal } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import type { FilterGroupKey } from "./browse-types"

export interface AppliedChip {
  group: FilterGroupKey
  value: string
  label: string
}

interface BrowseToolbarProps {
  chips: AppliedChip[]
  onRemoveChip: (chip: AppliedChip) => void
  sort: string
  onSort: (value: string) => void
  view: "grid" | "list"
  onView: (view: "grid" | "list") => void
  onOpenFilters: () => void
}

export function BrowseToolbar({ chips, onRemoveChip, sort, onSort, view, onView, onOpenFilters }: BrowseToolbarProps) {
  const t = useTranslations("ultraLuxuryTours.browse")

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {chips.length > 0 && (
            <span className="text-[11px] font-bold uppercase tracking-[1.4px] text-[rgba(28,27,24,0.5)]">
              {t("applied")}
            </span>
          )}
          {chips.map((chip) => (
            <button
              key={`${chip.group}:${chip.value}`}
              type="button"
              onClick={() => onRemoveChip(chip)}
              className="flex items-center gap-2 border border-[rgba(154,117,53,0.4)] bg-[rgba(154,117,53,0.08)] px-3 py-1 text-[12px] font-medium text-[#a08248] transition-colors hover:border-[#a08248] hover:bg-[rgba(154,117,53,0.14)]"
            >
              {chip.label}
              <X className="size-[12px] text-[#a08248]" strokeWidth={2} />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-[7px]">
          <button
            type="button"
            onClick={onOpenFilters}
            className="flex h-[44px] items-center gap-2 border border-[rgba(154,117,53,0.22)] px-[13px] text-[14px] text-[#0d0d0d] transition-colors hover:border-[#a08248] lg:hidden"
          >
            <SlidersHorizontal className="size-[18px] text-[#a08248]" strokeWidth={1.8} />
            {t("filters")}
          </button>

          <Select value={sort} onValueChange={onSort}>
            <SelectTrigger className="h-[44px] gap-3 rounded-none border-[rgba(154,117,53,0.22)] bg-transparent px-[21px] text-[14px] text-[#0d0d0d] [&>svg]:text-[#a08248] [&>svg]:opacity-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-none">
              <SelectItem value="featured">{t("sort.featured")}</SelectItem>
              <SelectItem value="price_low">{t("sort.priceLow")}</SelectItem>
              <SelectItem value="price_high">{t("sort.priceHigh")}</SelectItem>
              <SelectItem value="rating">{t("sort.rating")}</SelectItem>
            </SelectContent>
          </Select>

          <button
            type="button"
            onClick={() => onView("grid")}
            aria-label={t("viewGrid")}
            className={cn(
              "flex size-[44px] items-center justify-center border transition-colors",
              view === "grid" ? "border-[#a08248] bg-[#a08248] text-[#f7f4ef]" : "border-[rgba(154,117,53,0.22)] text-[#a08248]",
            )}
          >
            <LayoutGrid className="size-[18px]" strokeWidth={1.8} />
          </button>
          <button
            type="button"
            onClick={() => onView("list")}
            aria-label={t("viewList")}
            className={cn(
              "flex size-[44px] items-center justify-center border transition-colors",
              view === "list" ? "border-[#a08248] bg-[#a08248] text-[#f7f4ef]" : "border-[rgba(154,117,53,0.22)] text-[#a08248]",
            )}
          >
            <List className="size-[18px]" strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </div>
  )
}
