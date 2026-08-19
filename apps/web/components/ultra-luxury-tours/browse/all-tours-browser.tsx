"use client"

import { useMemo, useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { X } from "lucide-react"
import {
  useUltraLuxuryTours,
  type UltraLuxuryToursResult,
} from "@/hooks/use-tour-data"
import { cn } from "@workspace/ui/lib/utils"
import { textMatchesSearch } from "@/lib/search"
import { BrowseTourCard, type BrowseTourCardData } from "./browse-tour-card"
import { FiltersSidebar } from "./filters-sidebar"
import { BrowseToolbar, type AppliedChip } from "./browse-toolbar"
import { BrowsePagination } from "./browse-pagination"
import {
  DURATION_BUCKETS,
  GROUP_BUCKETS,
  DUR_LABEL_KEY,
  TOUR_TYPE_LABEL_KEY,
  emptyFilters,
  type BrowseFilters,
  type FilterGroupKey,
  type FilterOption,
} from "./browse-types"

const SERIF_FONT = "var(--font-title), 'Cormorant Garamond', serif"
const PER_PAGE = 12
const NEW_WINDOW_MS = 30 * 24 * 60 * 60 * 1000
const FALLBACK_IMAGE = "/mockups/picks/1.webp"
const TOUR_TYPE_KEYS = ["half-day", "full-day", "multi-day", "river-cruise", "private-yacht", "helicopter"] as const

function inBucket(value: number | undefined, buckets: readonly { value: string; min: number; max: number }[], selected: string[]) {
  if (selected.length === 0) return true
  if (value == null) return false
  return selected.some((s) => {
    const b = buckets.find((x) => x.value === s)
    return b ? value >= b.min && value <= b.max : false
  })
}

export function AllToursBrowser({
  initialTours,
}: {
  /** Resolvidos no servidor: é o que põe o catálogo no HTML. */
  initialTours?: UltraLuxuryToursResult | null
} = {}) {
  const t = useTranslations("ultraLuxuryTours.browse")
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("q") || ""
  /* `?region=Porto` — é assim que os cartões de "onde viajamos" chegam aqui
     com a região já escolhida, em vez de mandarem para a lista inteira. */
  const regiaoDoUrl = searchParams.get("region")
  const { tours, isLoading } = useUltraLuxuryTours(initialTours)

  const [boundMin, boundMax] = useMemo<[number, number]>(() => {
    if (tours.length === 0) return [0, 1000]
    const prices = tours.map((t) => t.basePrice)
    return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))]
  }, [tours])
  const priceBounds = useMemo<[number, number]>(() => [boundMin, boundMax], [boundMin, boundMax])

  const [filters, setFilters] = useState<BrowseFilters>(emptyFilters([boundMin, boundMax]))
  const [sort, setSort] = useState("featured")
  const [view, setView] = useState<"grid" | "list">("grid")
  const [page, setPage] = useState(1)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    setFilters((prev) =>
      prev.price[0] === boundMin && prev.price[1] === boundMax
        ? prev
        : { ...prev, price: [boundMin, boundMax] },
    )
  }, [boundMin, boundMax])

  /* Só quando a região do URL muda, e só se ela existir mesmo nos tours: assim
     um link antigo ou um valor à mão não deixa a lista vazia sem explicação. */
  useEffect(() => {
    if (!regiaoDoUrl) return
    const existe = tours.some((tr) => tr.destination === regiaoDoUrl)
    if (!existe) return
    setFilters((prev) =>
      prev.regions.includes(regiaoDoUrl) ? prev : { ...prev, regions: [regiaoDoUrl] },
    )
  }, [regiaoDoUrl, tours])

  useEffect(() => {
    setPage(1)
  }, [filters, sort, searchQuery])

  const tourTypeLabel = (key: string) => t(`tourTypes.${TOUR_TYPE_LABEL_KEY[key] ?? key}`)
  const durationLabel = (value: string) => t(`durations.${DUR_LABEL_KEY[value] ?? value}`)

  const regionOptions = useMemo<FilterOption[]>(() => {
    const values = [...new Set(tours.map((tr) => tr.destination))].sort()
    return values.map((v) => ({ value: v, label: v, count: tours.filter((tr) => tr.destination === v).length }))
  }, [tours])

  const tourTypeOptions = useMemo<FilterOption[]>(() => {
    return TOUR_TYPE_KEYS.map((k) => ({ value: k, label: tourTypeLabel(k), count: tours.filter((tr) => tr.tourTypeTag === k).length })).filter((o) => o.count > 0)
  }, [tours, t])

  const themeOptions = useMemo<FilterOption[]>(() => {
    const counts = new Map<string, number>()
    for (const tr of tours) for (const tag of tr.tags ?? []) counts.set(tag, (counts.get(tag) ?? 0) + 1)
    return [...counts.entries()].sort().map(([value, count]) => ({ value, label: value, count }))
  }, [tours])

  const durationOptions = useMemo<FilterOption[]>(() => {
    return DURATION_BUCKETS.map((b) => ({
      value: b.value,
      label: durationLabel(b.value),
      count: tours.filter((tr) => tr.durationDays != null && tr.durationDays >= b.min && tr.durationDays <= b.max).length,
    }))
  }, [tours, t])

  const groupSizeOptions = useMemo<FilterOption[]>(() => {
    return GROUP_BUCKETS.map((b) => ({
      value: b.value,
      label: b.value,
      count: tours.filter((tr) => tr.maxPassengers != null && tr.maxPassengers >= b.min && tr.maxPassengers <= b.max).length,
    }))
  }, [tours])

  const filteredTours = useMemo(() => {
    let result = tours.filter((tr) => {
      if (
        searchQuery &&
        !textMatchesSearch(searchQuery, [
          tr.title,
          tr.subtitle,
          tr.destination,
          tr.duration,
          tr.tourType,
          tr.tourTypeTag,
          ...(tr.tags ?? []),
        ])
      ) {
        return false
      }
      if (filters.regions.length && !filters.regions.includes(tr.destination)) return false
      if (filters.tourTypes.length && !(tr.tourTypeTag && filters.tourTypes.includes(tr.tourTypeTag))) return false
      if (!inBucket(tr.durationDays, DURATION_BUCKETS, filters.durations)) return false
      if (filters.themes.length && !(tr.tags ?? []).some((tag) => filters.themes.includes(tag))) return false
      if (!inBucket(tr.maxPassengers, GROUP_BUCKETS, filters.groupSizes)) return false
      if (tr.basePrice < filters.price[0] || tr.basePrice > filters.price[1]) return false
      return true
    })
    if (sort === "price_low") result = [...result].sort((a, b) => a.basePrice - b.basePrice)
    else if (sort === "price_high") result = [...result].sort((a, b) => b.basePrice - a.basePrice)
    else if (sort === "rating") result = [...result].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    return result
  }, [tours, filters, sort, searchQuery])

  const cards = useMemo<BrowseTourCardData[]>(() => {
    return filteredTours.map((tour) => {
      const themes: string[] = []
      if (tour.tags?.[0]) themes.push(tour.tags[0])
      if (tour.tourTypeTag) themes.push(tourTypeLabel(tour.tourTypeTag))
      const badge = tour.isBestSeller
        ? t("badge.bestseller")
        : tour.isFeatured
          ? t("badge.signature")
          : Date.now() - tour.createdAt < NEW_WINDOW_MS
            ? t("badge.new")
            : null
      const pax =
        tour.maxPassengers != null
          ? `${tour.minPassengers ?? 1}–${tour.maxPassengers} ${t("paxSuffix")}`
          : tour.groupSize
      return {
        slug: tour.slug,
        image: tour.bannerImageUrl || FALLBACK_IMAGE,
        badge,
        themes,
        rating: tour.rating ?? 5,
        reviewCount: tour.reviewCount ?? 0,
        title: tour.title,
        location: tour.destination,
        duration: tour.duration,
        pax,
        price: tour.basePrice,
      }
    })
  }, [filteredTours, t])

  const pageCount = Math.ceil(cards.length / PER_PAGE)
  const pageCards = cards.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const chips = useMemo<AppliedChip[]>(() => {
    const out: AppliedChip[] = []
    const labelFor = (group: FilterGroupKey, value: string) => {
      if (group === "tourTypes") return tourTypeLabel(value)
      if (group === "durations") return durationLabel(value)
      return value
    }
    ;(["regions", "tourTypes", "durations", "themes", "groupSizes"] as FilterGroupKey[]).forEach((group) => {
      for (const value of filters[group]) out.push({ group, value, label: labelFor(group, value) })
    })
    return out
  }, [filters, t])

  const toggle = (group: FilterGroupKey, value: string) => {
    setFilters((prev) => {
      const set = new Set(prev[group])
      set.has(value) ? set.delete(value) : set.add(value)
      return { ...prev, [group]: [...set] }
    })
  }

  const clearAll = () => setFilters(emptyFilters(priceBounds))

  const sidebar = (
    <FiltersSidebar
      filters={filters}
      regionOptions={regionOptions}
      tourTypeOptions={tourTypeOptions}
      themeOptions={themeOptions}
      durationOptions={durationOptions}
      groupSizeOptions={groupSizeOptions}
      priceBounds={priceBounds}
      onToggle={toggle}
      onPrice={(range) => setFilters((prev) => ({ ...prev, price: range }))}
      onClear={clearAll}
    />
  )

  return (
    <section className="bg-white px-4 pb-20 pt-16 md:px-[82px] md:pt-24">
      <div className="mx-auto max-w-[1280px]">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 pb-10 md:flex-row">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[12px] text-[#696969]">
              <span>{t("breadcrumbRoot")}</span>
              <span>›</span>
              <span className="text-[#0d0d0d]">{t("breadcrumbCurrent")}</span>
            </div>
            <h1 className="text-[40px] leading-none text-[#0d0d0d] md:text-[64px]" style={{ fontFamily: SERIF_FONT }}>
              {t("title")} <span className="font-medium italic text-[#a08248]">{t("titleAccent")}</span>
            </h1>
          </div>
          <div className="flex flex-col items-start gap-[6px] md:items-end">
            <p className="text-[32px]" style={{ fontFamily: SERIF_FONT }}>
              <span className="font-semibold italic text-[#9a7535]">{tours.length}</span>
              <span className="font-medium text-[#1c1b18]"> {t("journeys")}</span>
            </p>
            <span className="text-[10px] font-medium uppercase tracking-[1.4px] text-[#696969]">{t("tagline")}</span>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-10">
          <aside className="hidden lg:block">{sidebar}</aside>

          <div className="flex flex-col gap-6">
            <BrowseToolbar
              chips={chips}
              onRemoveChip={(chip) => toggle(chip.group, chip.value)}
              sort={sort}
              onSort={setSort}
              view={view}
              onView={setView}
              onOpenFilters={() => setDrawerOpen(true)}
            />

            {searchQuery && (
              <div className="flex flex-wrap items-center gap-2 border border-[rgba(154,117,53,0.18)] bg-[#f7f4ef] px-3 py-2">
                <span className="text-[11px] font-medium uppercase tracking-[1.2px] text-[#696969]">
                  {t("title")}
                </span>
                <span className="max-w-[280px] truncate text-[14px] text-[#1c1b18]">
                  &ldquo;{searchQuery}&rdquo;
                </span>
                <Link
                  href="/ultra-luxury-tours/tours"
                  className="ml-auto text-[11px] font-semibold uppercase tracking-[1.2px] text-[#a08248] hover:text-[#8a6f3c]"
                >
                  {t("clearAll")}
                </Link>
              </div>
            )}

            {isLoading ? (
              <div className="grid grid-cols-2 gap-[2px]">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-[440px] animate-pulse bg-[#f5f1eb]" />
                ))}
              </div>
            ) : pageCards.length === 0 ? (
              <div className="flex flex-col items-center gap-5 py-16 text-center">
                <p className="text-[18px] text-[#696969]">{t("noResults")}</p>
                <Link
                  href="/ultra-luxury-tours/tours"
                  className="inline-flex h-11 items-center justify-center border border-[#a08248] bg-[#a08248] px-5 text-[11px] font-semibold uppercase tracking-[1.2px] text-white transition-colors hover:bg-[#8a6f3c]"
                >
                  {t("breadcrumbCurrent")}
                </Link>
              </div>
            ) : (
              <div className={cn("grid gap-[2px]", view === "grid" ? "grid-cols-2" : "grid-cols-1")}>
                {pageCards.map((card) => (
                  <BrowseTourCard key={card.slug} tour={card} list={view === "list"} />
                ))}
              </div>
            )}

            <BrowsePagination page={page} pageCount={pageCount} onPage={setPage} />
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[88%] max-w-[360px] overflow-y-auto bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-[2.64px] text-[#1c1b18]">{t("refine")}</span>
              <button type="button" onClick={() => setDrawerOpen(false)} aria-label={t("close")}>
                <X className="size-5 text-[#1c1b18]" />
              </button>
            </div>
            {sidebar}
          </div>
        </div>
      )}
    </section>
  )
}
