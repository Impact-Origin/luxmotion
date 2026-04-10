"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowRight, Share2, MapPin, ArrowUpDown, ChevronDown, Plus } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@workspace/ui/lib/utils"
import { LanguageBadge } from "./language-badge"
import { LatestGuidesSkeleton } from "./blog-skeletons"

interface GuidePost {
  _id?: string
  id?: string
  slug: string
  heroImageUrl?: string | null
  image?: string
  category?: string
  location?: string
  title: string
  publishedAt?: number
  date?: string
  excerpt?: string
  description?: string
  originalLanguage?: string
  availableLanguages?: string[]
}

function formatDate(timestamp?: number): string {
  if (!timestamp) return ""
  return new Date(timestamp).toLocaleDateString("pt-PT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}


interface FilterDropdownProps {
  icon: React.ReactNode
  label: string
  options: string[]
  value: string
  onChange: (value: string) => void
}

function FilterDropdown({ icon, label, options, value, onChange }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-[8px] text-[14px] text-[#7a7a7a] hover:text-[#222] transition-colors"
      >
        {icon}
        <span>{label}</span>
        <ChevronDown className={cn("size-[16px] text-[#27c7ff] transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-[8px] bg-white rounded-[12px] shadow-lg border border-[#e5e5e5] py-[8px] min-w-[180px] z-20">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option)
                  setIsOpen(false)
                }}
                className={cn(
                  "w-full text-left px-[16px] py-[10px] text-[14px] hover:bg-[#f5f5f5] transition-colors",
                  value === option ? "text-[#27c7ff] font-medium" : "text-[#222]"
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

interface GuideCardProps {
  guide: GuidePost
}

function GuideCard({ guide }: GuideCardProps) {
  const t = useTranslations("latestGuides")
  const router = useRouter()

  const imageUrl = guide.heroImageUrl || guide.image || "/mockup-blogs/latest/1.png"
  const location = guide.category || guide.location || "Portugal"
  const date = guide.publishedAt ? formatDate(guide.publishedAt) : guide.date || ""
  const description = guide.excerpt || guide.description || ""
  const guideUrl = `/blogs/${guide.slug}`

  const handleCardClick = () => {
    router.push(guideUrl)
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (navigator.share) {
      try {
        await navigator.share({
          title: guide.title,
          text: description,
          url: guideUrl,
        })
      } catch {
      }
    } else {
      navigator.clipboard.writeText(`${window.location.origin}${guideUrl}`)
    }
  }

  return (
    <div
      onClick={handleCardClick}
      className="flex flex-col h-full border border-[#e5e5e5] rounded-[16px] overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="relative w-full h-[200px] md:h-[220px] shrink-0">
        <Image
          src={imageUrl}
          alt={guide.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute top-[16px] left-[16px] flex gap-2">
          <div className="bg-[#27c7ff] rounded-[80px] px-[16px] py-[4px] h-[32px] flex items-center">
            <span className="text-[14px] font-medium text-white leading-none">{location}</span>
          </div>
          {guide.originalLanguage && (
            <div className="bg-white/90 rounded-[80px] px-[12px] py-[4px] h-[32px] flex items-center">
              <LanguageBadge
                originalLanguage={guide.originalLanguage}
                availableLanguages={guide.availableLanguages}
                size="sm"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col flex-1 gap-[8px] p-[16px] md:p-[20px]">
        <div className="flex items-start justify-between gap-[12px]">
          <h3 className="text-[18px] md:text-[20px] font-bold text-[#222] leading-[1.3]">
            {guide.title}
          </h3>
          <button
            onClick={handleShare}
            className="shrink-0 hover:opacity-70 transition-opacity mt-[4px]"
            aria-label={t("share")}
          >
            <Share2 className="size-[18px] text-[#c4c4c4]" />
          </button>
        </div>

        <p className="text-[14px] font-medium text-[#27c7ff]">
          {date}
        </p>

        <p className="text-[15px] text-[#0E4659] leading-[1.6]">
          {description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-[12px]">
          <span className="text-[15px] font-semibold text-[#27c7ff] hover:underline">
            {t("readMore")}
          </span>
          <span className="size-[40px] bg-[#27c7ff] rounded-full flex items-center justify-center">
            <ArrowRight className="size-[20px] text-white" />
          </span>
        </div>
      </div>
    </div>
  )
}

interface LatestGuidesSectionProps {
  guides?: GuidePost[]
  isLoading?: boolean
}

export function LatestGuidesSection({ guides, isLoading }: LatestGuidesSectionProps) {
  const t = useTranslations("latestGuides")
  const [visibleCount, setVisibleCount] = useState(6)
  const [locationFilter, setLocationFilter] = useState("All")
  const [sortBy, setSortBy] = useState("Newest")

  const displayGuides = guides || []

  const locationOptions = useMemo(() => {
    const locations = new Set(displayGuides.map((g) => g.category || g.location || "Portugal"))
    return ["All", ...Array.from(locations)]
  }, [displayGuides])

  const sortOptions = ["Newest", "Oldest", "Popular"]

  const handleLocationChange = (value: string) => {
    setLocationFilter(value)
    setVisibleCount(6)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
  }

  const loadMore = () => {
    setVisibleCount((prev) => prev + 6)
  }

  const filteredAndSortedGuides = useMemo(() => {
    let results = [...displayGuides]

    if (locationFilter !== "All") {
      results = results.filter((guide) => {
        const location = guide.category || guide.location || "Portugal"
        return location.toLowerCase() === locationFilter.toLowerCase()
      })
    }

    results.sort((a, b) => {
      const getTimestamp = (guide: GuidePost) => {
        if (guide.publishedAt) return guide.publishedAt
        if (!guide.date) return 0

        const parts = guide.date.split(" ")
        const day = parseInt(parts[0] || "1")
        const monthMap: Record<string, number> = {
          janeiro: 0, fevereiro: 1, março: 2, abril: 3, maio: 4, junho: 5,
          julho: 6, agosto: 7, setembro: 8, outubro: 9, novembro: 10, dezembro: 11,
          january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
          july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
        }
        const monthStr = parts[1]?.replace(",", "").toLowerCase() || ""
        const month = monthMap[monthStr] ?? 0
        const year = parseInt(parts[2] || "2025")
        return new Date(year, month, day).getTime()
      }

      const dateA = getTimestamp(a)
      const dateB = getTimestamp(b)

      if (sortBy === "Newest") {
        return dateB - dateA
      } else if (sortBy === "Oldest") {
        return dateA - dateB
      }
      return 0
    })

    return results
  }, [displayGuides, locationFilter, sortBy])

  const visibleGuides = filteredAndSortedGuides.slice(0, visibleCount)
  const hasMore = visibleCount < filteredAndSortedGuides.length

  if (isLoading) {
    return <LatestGuidesSkeleton />
  }

  return (
    <section className="bg-white px-4 md:px-5 lg:px-6 xl:px-8 py-[40px] md:py-[60px]">
      <div className="max-w-7xl mx-auto flex flex-col gap-[32px]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-[16px]">
          <h2 className="text-[28px] md:text-[32px] font-bold text-[#222]">
            {t("title")}
          </h2>

          <div className="flex items-center gap-[24px]">
            <FilterDropdown
              icon={<MapPin className="size-[18px] text-[#27c7ff]" />}
              label={locationFilter === "All" ? t("searchByLocation") : locationFilter}
              options={locationOptions}
              value={locationFilter}
              onChange={handleLocationChange}
            />
            <FilterDropdown
              icon={<ArrowUpDown className="size-[18px] text-[#27c7ff]" />}
              label={sortBy === "Newest" ? t("sortByDate") : sortBy}
              options={sortOptions}
              value={sortBy}
              onChange={handleSortChange}
            />
          </div>
        </div>

        {visibleGuides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px] md:gap-[32px]">
            {visibleGuides.map((guide) => (
              <GuideCard key={guide._id || guide.id} guide={guide} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-[60px] gap-[16px]">
            <p className="text-[18px] text-[#7a7a7a]">{t("noResults")}</p>
            <button
              onClick={() => handleLocationChange("All")}
              className="text-[14px] font-medium text-[#27c7ff] hover:underline"
            >
              {t("clearFilter")}
            </button>
          </div>
        )}

        {hasMore && (
          <div className="flex justify-center">
            <button
              onClick={loadMore}
              className="bg-[#27c7ff] hover:brightness-95 text-white h-[48px] px-[32px] flex items-center gap-[8px] rounded-[24px] transition-all"
            >
              <span className="text-[14px] font-semibold uppercase tracking-[0.5px]">
                {t("loadMore")}
              </span>
              <Plus className="size-[18px]" />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
