"use client"

import { useLayoutEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { ArrowRight, ChevronDown } from "lucide-react"
import { useTranslations } from "next-intl"
import { useQuery } from "convex/react"
import { api } from "@workspace/convex/api"
import { ExperienceDetailDrawer, type ExperienceDetail } from "@/components/corporate/experience-detail-drawer"

const sans = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const
const serif = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const

const CATEGORIES = [
  {
    id: "standard" as const,
    items: ["incentive", "gala", "conventions", "congresses", "meetings", "cultural"],
  },
  {
    id: "experiences" as const,
    items: ["teambuilding", "activities", "sightseeing", "foodwine", "sport", "entertainment"],
  },
  {
    id: "logistics" as const,
    items: ["premium", "airport", "hotels", "guides"],
  },
]

const INDICATOR_HEIGHT = 34

type FilterKey =
  | "all"
  | `${(typeof CATEGORIES)[number]["id"]}.${string}`


function FilterDot({ active }: { active: boolean }) {
  return (
    <span
      className={`mr-2 inline-block h-px w-3 transition-colors ${
        active ? "bg-[#A08248]" : "bg-transparent"
      }`}
    />
  )
}

function FilterSidebar({
  activeFilter,
  setActiveFilter,
}: {
  activeFilter: FilterKey
  setActiveFilter: (k: FilterKey) => void
}) {
  const t = useTranslations("corporatePage.experiences")
  const tPillars = useTranslations("corporatePage.pillars")
  const trackRef = useRef<HTMLDivElement>(null)
  const rowRefs = useRef<Record<string, HTMLElement | null>>({})
  const [indicatorTop, setIndicatorTop] = useState<number | null>(null)

  useLayoutEffect(() => {
    const track = trackRef.current
    const row = rowRefs.current[activeFilter]
    if (!track || !row) {
      setIndicatorTop(null)
      return
    }
    const trackRect = track.getBoundingClientRect()
    const rowRect = row.getBoundingClientRect()
    const rowCenter = rowRect.top - trackRect.top + rowRect.height / 2
    setIndicatorTop(rowCenter - INDICATOR_HEIGHT / 2)
  }, [activeFilter])

  return (
    <aside className="hidden w-[160px] shrink-0 md:sticky md:top-[88px] md:flex md:self-start" style={sans}>
      <div className="flex w-full gap-2">
        <div ref={trackRef} className="relative w-[2px] shrink-0 self-stretch bg-[rgba(154,117,53,0.22)]">
          {indicatorTop !== null && (
            <div
              className="absolute left-0 w-[2px] bg-[#A08248] transition-[top] duration-300 ease-out"
              style={{ top: indicatorTop, height: INDICATOR_HEIGHT }}
            />
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <button
            type="button"
            ref={(el) => {
              rowRefs.current["all"] = el
            }}
            onClick={() => setActiveFilter("all")}
            className={`flex h-[34px] items-center text-left text-[14px] font-semibold leading-tight transition-colors ${
              activeFilter === "all" ? "text-[#A08248]" : "text-[#696969] hover:text-[#A08248]"
            }`}
          >
            {t("filterAll")}
          </button>

          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="flex flex-col gap-2">
              <p className="text-[14px] font-medium leading-tight text-[#696969]">
                {tPillars(`tabs.${cat.id}`)}
              </p>
              <div className="flex flex-col gap-2 pl-2">
                {cat.items.map((itemKey) => {
                  const filterKey = `${cat.id}.${itemKey}` as FilterKey
                  const isActive = activeFilter === filterKey
                  return (
                    <button
                      key={itemKey}
                      type="button"
                      ref={(el) => {
                        rowRefs.current[filterKey] = el
                      }}
                      onClick={() => setActiveFilter(filterKey)}
                      className={`text-left text-[12px] leading-tight transition-colors ${
                        isActive
                          ? "font-semibold text-[#A08248]"
                          : "text-[#696969] hover:text-[#1c1b18]"
                      }`}
                    >
                      {tPillars(`bodies.${cat.id}.items.${itemKey}`)}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}

type Duration = "halfDay" | "fullDay" | "multiDay"

function ExperienceCard({
  image,
  titlePrefix,
  titleAccent,
  description,
  duration,
  onOpen,
}: {
  image: string
  titlePrefix: string
  titleAccent: string
  description: string
  duration: Duration
  onOpen: () => void
}) {
  const t = useTranslations("corporatePage.experiences")
  return (
    <button type="button" onClick={onOpen} className="group flex flex-col gap-3 text-left">
      <div className="relative h-[280px] w-full overflow-hidden md:h-[420px]">
        <Image
          src={image}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 320px"
          quality={90}
        />
        <span
          className="absolute left-3 top-3 inline-flex items-center border border-[rgba(154,117,53,0.22)] bg-[#F7F4EF] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.72px] text-[#A08248]"
          style={sans}
        >
          {t(`durations.${duration}`)}
        </span>
        <span
          aria-hidden
          className="absolute bottom-3 right-3 flex size-8 items-center justify-center bg-[#A08248] text-white transition-colors group-hover:bg-[#b89558]"
        >
          <ArrowRight className="size-4" strokeWidth={2} />
        </span>
      </div>
      <div className="flex flex-col gap-1 pt-2">
        <p className="text-[22px] leading-tight text-[#1c1b18]" style={serif}>
          {titlePrefix}
        </p>
        <p className="text-[22px] italic leading-tight text-[#A08248]" style={serif}>
          {titleAccent}
        </p>
      </div>
      <p className="text-[14px] leading-[1.5] text-[#696969]" style={sans}>
        {description}
      </p>
    </button>
  )
}

const FALLBACK_IMAGES = [
  "/corporate/experiences/experience-1.png",
  "/corporate/experiences/experience-2.png",
  "/corporate/experiences/experience-3.png",
  "/corporate/experiences/experience-4.png",
  "/corporate/experiences/experience-5.png",
  "/corporate/experiences/experience-6.png",
  "/corporate/experiences/experience-7.png",
  "/corporate/experiences/experience-8.png",
  "/corporate/experiences/experience-9.png",
]

export function ExperiencesListing() {
  const t = useTranslations("corporatePage.experiences")
  const tPillars = useTranslations("corporatePage.pillars")
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all")
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [selected, setSelected] = useState<ExperienceDetail | null>(null)

  const published = useQuery(api.corporateExperiences.listPublished)

  const experiences = useMemo<ExperienceDetail[]>(() => {
    if (!published) return []
    return published.map((e: any) => ({
      _id: e._id,
      titlePrefix: e.titlePrefix,
      titleAccent: e.titleAccent,
      shortDescription: e.shortDescription,
      duration: e.duration,
      pillar: e.pillar,
      subcategory: e.subcategory,
      groupSize: e.groupSize,
      durationLabel: e.durationLabel,
      location: e.location,
      description: e.description,
      experienceBody: e.experienceBody,
      experienceItems: e.experienceItems,
      routeHighlights: e.routeHighlights,
      whatsIncluded: e.whatsIncluded,
      coverImageUrl: e.coverImageUrl,
      galleryImageUrls: (e.galleryImageUrls ?? []).filter((u: any): u is string => Boolean(u)),
    }))
  }, [published])

  const filtered = useMemo(() => {
    if (activeFilter === "all") return experiences
    const [catId, itemKey] = activeFilter.split(".")
    return experiences.filter((e) => e.pillar === catId && e.subcategory === itemKey)
  }, [experiences, activeFilter])

  const filterLabel = (() => {
    if (activeFilter === "all") return t("filterAll")
    const [catId, itemKey] = activeFilter.split(".") as [
      (typeof CATEGORIES)[number]["id"],
      string,
    ]
    return tPillars(`bodies.${catId}.items.${itemKey}`)
  })()

  return (
    <section className="flex w-full flex-col items-center bg-[#F7F4EF] px-4 py-12 md:px-[82px] md:py-[60px]">
      <div className="flex w-full max-w-[1280px] flex-col items-center gap-9">
        <div className="flex w-full flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-3">
            <div className="h-px w-8 bg-[#A08248]" />
            <span
              className="text-[12px] font-semibold uppercase tracking-[2px] text-[#A08248]"
              style={sans}
            >
              {t("eyebrow")}
            </span>
            <div className="h-px w-8 bg-[#A08248]" />
          </div>
          <h1 className="text-[36px] leading-tight text-[#1c1b18] md:text-[48px]" style={serif}>
            {t("titleLine1")}
            <br />
            <span className="italic text-[#A08248]">{t("titleLine2")}</span>
          </h1>
        </div>

        <div className="flex w-full flex-col gap-9 md:flex-row md:items-start">
          <FilterSidebar activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

          <div className="flex w-full flex-col gap-6 md:flex-1">
            <div className="relative md:hidden" style={sans}>
              <button
                type="button"
                onClick={() => setMobileFilterOpen((v) => !v)}
                className="flex h-11 w-full items-center justify-between border border-[rgba(28,27,24,0.08)] bg-white px-4 text-[14px] text-[#1c1b18]"
              >
                <span>{filterLabel}</span>
                <ChevronDown
                  className={`size-4 text-[#696969] transition-transform ${mobileFilterOpen ? "rotate-180" : ""}`}
                  strokeWidth={2}
                />
              </button>
              {mobileFilterOpen && (
                <div className="absolute inset-x-0 top-12 z-10 max-h-[60vh] overflow-y-auto border border-[rgba(28,27,24,0.08)] bg-white shadow-lg">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveFilter("all")
                      setMobileFilterOpen(false)
                    }}
                    className={`block w-full px-4 py-3 text-left text-[13px] uppercase tracking-[1.5px] transition-colors ${
                      activeFilter === "all"
                        ? "bg-[rgba(168,131,58,0.08)] font-semibold text-[#A08248]"
                        : "text-[#1c1b18] hover:bg-[rgba(168,131,58,0.04)]"
                    }`}
                  >
                    {t("filterAll")}
                  </button>
                  {CATEGORIES.map((cat) => (
                    <div key={cat.id} className="border-t border-[rgba(28,27,24,0.06)]">
                      <p className="px-4 pt-3 text-[11px] font-semibold uppercase tracking-[1.5px] text-[#696969]">
                        {tPillars(`tabs.${cat.id}`)}
                      </p>
                      {cat.items.map((itemKey) => {
                        const filterKey = `${cat.id}.${itemKey}` as FilterKey
                        const isActive = activeFilter === filterKey
                        return (
                          <button
                            key={itemKey}
                            type="button"
                            onClick={() => {
                              setActiveFilter(filterKey)
                              setMobileFilterOpen(false)
                            }}
                            className={`block w-full px-6 py-2 text-left text-[13px] transition-colors ${
                              isActive
                                ? "font-semibold text-[#A08248]"
                                : "text-[#1c1b18] hover:bg-[rgba(168,131,58,0.04)]"
                            }`}
                          >
                            {tPillars(`bodies.${cat.id}.items.${itemKey}`)}
                          </button>
                        )
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {filtered.length === 0 ? (
              <div className="flex w-full items-center justify-center py-20 text-[14px] text-[#696969]" style={sans}>
                {t("emptyState")}
              </div>
            ) : (
              <div className="grid w-full grid-cols-2 gap-x-3 gap-y-9 md:grid-cols-3 md:gap-x-6">
                {filtered.map((exp, i) => (
                  <ExperienceCard
                    key={exp._id}
                    image={exp.coverImageUrl ?? FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]!}
                    titlePrefix={exp.titlePrefix}
                    titleAccent={exp.titleAccent}
                    description={exp.shortDescription}
                    duration={exp.duration}
                    onOpen={() => setSelected(exp)}
                  />
                ))}
              </div>
            )}

            <div className="flex w-full justify-center pt-2">
              <button
                type="button"
                className="inline-flex h-12 items-center justify-center bg-[#A08248] px-8 text-white transition-colors hover:bg-[#b89558]"
                style={sans}
              >
                <span className="text-[14px] font-medium uppercase tracking-[1.1px]">
                  {t("loadMore")}
                </span>
                <ArrowRight className="ml-2 size-[14px]" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <ExperienceDetailDrawer
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
        experience={selected}
      />
    </section>
  )
}
