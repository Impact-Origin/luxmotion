"use client"

import { useState, useMemo, useEffect } from "react"
import { MapPin, ArrowDownUp, ChevronDown, Plus, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@workspace/ui/lib/utils"
import { BlogResultCard, BlogResult } from "./blog-result-card"
import { usePublishedBlogs } from "@/hooks/use-blog-data"

interface FilterDropdownProps {
  icon: React.ReactNode
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
  onClear?: () => void
}

function FilterDropdown({ icon, label, value, options, onChange, onClear }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-[8px] px-[8px] py-[12px] rounded-[6px] transition-all duration-200",
          value ? "bg-[#27c7ff]/10" : "hover:bg-gray-50"
        )}
      >
        <div className="flex items-center gap-[8px]">
          {icon}
          <span className={cn(
            "text-[14px] md:text-[16px] transition-colors duration-200",
            value ? "text-[#222]" : "text-[#a2a2a2]"
          )}>
            {value || label}
          </span>
        </div>
        {value && onClear ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onClear()
            }}
            className="size-[20px] rounded-full bg-[#808080] hover:bg-[#666] flex items-center justify-center transition-colors duration-200"
          >
            <X className="size-[12px] text-white" />
          </button>
        ) : (
          <ChevronDown className={cn(
            "size-[24px] text-[#27c7ff] transition-transform duration-200",
            isOpen && "rotate-180"
          )} />
        )}
      </button>

      <div className={cn(
        "absolute top-full left-0 mt-[4px] bg-white border border-[#e8e8e8] rounded-[8px] shadow-lg z-20 min-w-[180px] overflow-hidden",
        "transition-all duration-200 origin-top",
        isOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0 pointer-events-none"
      )}>
        <button
          onClick={() => {
            onChange("")
            setIsOpen(false)
          }}
          className="w-full text-left px-[16px] py-[12px] text-[14px] text-[#a2a2a2] hover:bg-gray-50 transition-colors duration-150"
        >
          {label}
        </button>
        {options.map((option) => (
          <button
            key={option}
            onClick={() => {
              onChange(option)
              setIsOpen(false)
            }}
            className={cn(
              "w-full text-left px-[16px] py-[12px] text-[14px] transition-colors duration-150",
              value === option ? "bg-[#27c7ff]/10 text-[#27c7ff]" : "text-[#222] hover:bg-gray-50"
            )}
          >
            {option}
          </button>
        ))}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

interface BlogResultsSectionProps {
  searchQuery?: string
}

export function BlogResultsSection({ searchQuery: initialQuery }: BlogResultsSectionProps) {
  const t = useTranslations("blogResults")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { blogs: rawBlogs, isLoading: blogsLoading } = usePublishedBlogs()
  const [locationFilter, setLocationFilter] = useState("")
  const [sortBy, setSortBy] = useState("")
  const [visibleCount, setVisibleCount] = useState(6)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [animateCards, setAnimateCards] = useState(false)

  const searchQuery = searchParams.get("q") || initialQuery || ""

  const blogs: BlogResult[] = useMemo(() => {
    return rawBlogs.map((blog) => ({
      id: blog._id,
      slug: blog.slug,
      image: blog.heroImageUrl || "/mockup-blogs/lisbon-city-center.jpg",
      location: blog.category || "Portugal",
      title: blog.title,
      date: blog.publishedAt
        ? new Date(blog.publishedAt).toLocaleDateString("pt-PT", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "",
      description: blog.excerpt || "",
    }))
  }, [rawBlogs])

  useEffect(() => {
    setAnimateCards(false)
    const timer = setTimeout(() => setAnimateCards(true), 50)
    return () => clearTimeout(timer)
  }, [searchQuery, locationFilter, sortBy])

  const locations = useMemo(() => {
    const uniqueLocations = [...new Set(blogs.map(blog => blog.location))]
    return uniqueLocations.sort()
  }, [blogs])

  const filteredBlogs = useMemo(() => {
    let results = [...blogs]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()

      results = results.filter(
        blog =>
          blog.title.toLowerCase().includes(query) ||
          blog.description.toLowerCase().includes(query) ||
          blog.location.toLowerCase().includes(query)
      )

      results.sort((a, b) => {
        const aLocationMatch = a.location.toLowerCase().includes(query)
        const bLocationMatch = b.location.toLowerCase().includes(query)

        if (aLocationMatch && !bLocationMatch) return -1
        if (!aLocationMatch && bLocationMatch) return 1

        const aExactLocationMatch = a.location.toLowerCase() === query
        const bExactLocationMatch = b.location.toLowerCase() === query

        if (aExactLocationMatch && !bExactLocationMatch) return -1
        if (!aExactLocationMatch && bExactLocationMatch) return 1

        return 0
      })
    }

    if (locationFilter) {
      results = results.filter(blog => blog.location === locationFilter)
    }

    if (sortBy === "newest") {
      results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    } else if (sortBy === "oldest") {
      results.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    }

    return results
  }, [blogs, searchQuery, locationFilter, sortBy])

  const visibleBlogs = filteredBlogs.slice(0, visibleCount)
  const hasMore = visibleCount < filteredBlogs.length

  const handleLoadMore = () => {
    setIsLoadingMore(true)
    setTimeout(() => {
      setVisibleCount(prev => prev + 6)
      setIsLoadingMore(false)
    }, 300)
  }

  if (blogsLoading) {
    return (
      <section className="bg-white px-4 md:px-5 lg:px-6 xl:px-8 pt-[24px] pb-[62px]">
        <div className="max-w-7xl mx-auto flex flex-col gap-[32px]">
          <div className="animate-pulse flex flex-col gap-[16px]">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[200px] bg-gray-200 rounded-[16px]" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  const handleClearSearch = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("q")
    router.push(`/blogs/results${params.toString() ? `?${params.toString()}` : ""}`)
  }

  const handleClearLocation = () => {
    setLocationFilter("")
  }

  const handleClearSort = () => {
    setSortBy("")
  }

  return (
    <section className="bg-white px-4 md:px-5 lg:px-6 xl:px-8 pt-[24px] pb-[62px]">
      <div className="max-w-7xl mx-auto flex flex-col gap-[32px]">
        <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-[16px]">
          <div className="flex items-baseline gap-[8px] shrink-0">
            <h2 className="text-[24px] md:text-[32px] font-bold text-[#222]">
              {t("title")}
            </h2>
            <p className={cn(
              "text-[16px] text-[#808080] transition-all duration-300",
              animateCards ? "opacity-100" : "opacity-0"
            )}>
              {t("itemsFound", { count: filteredBlogs.length })}
            </p>
          </div>

          <div className="flex items-center gap-[8px] flex-wrap">
            {searchQuery && (
              <div className={cn(
                "flex items-center gap-[8px] px-[12px] py-[12px] bg-[#27c7ff]/10 rounded-[6px] transition-all duration-200",
                animateCards ? "opacity-100 scale-100" : "opacity-0 scale-95"
              )}>
                <span className="text-[14px] md:text-[16px] text-[#222]">"{searchQuery}"</span>
                <button
                  onClick={handleClearSearch}
                  className="size-[20px] rounded-full bg-[#808080] hover:bg-[#666] flex items-center justify-center transition-colors duration-200"
                >
                  <X className="size-[12px] text-white" />
                </button>
              </div>
            )}
            <FilterDropdown
              icon={<MapPin className="size-[24px] text-[#27c7ff]" />}
              label={t("searchByLocation")}
              value={locationFilter}
              options={locations}
              onChange={setLocationFilter}
              onClear={locationFilter ? handleClearLocation : undefined}
            />
            <FilterDropdown
              icon={<ArrowDownUp className="size-[24px] text-[#27c7ff]" />}
              label={t("sortByDate")}
              value={sortBy === "newest" ? t("newest") : sortBy === "oldest" ? t("oldest") : ""}
              options={[t("newest"), t("oldest")]}
              onChange={(val) => {
                if (val === t("newest")) setSortBy("newest")
                else if (val === t("oldest")) setSortBy("oldest")
                else setSortBy("")
              }}
              onClear={sortBy ? handleClearSort : undefined}
            />
          </div>
        </div>

        <div className="flex flex-col gap-[16px] md:gap-[24px]">
          {visibleBlogs.length === 0 ? (
            <div className={cn(
              "flex flex-col items-center justify-center py-[60px] text-center transition-all duration-300",
              animateCards ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}>
              <p className="text-[18px] text-[#808080]">{t("noResults") || "No results found"}</p>
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="mt-[16px] text-[16px] text-[#27c7ff] hover:underline"
                >
                  {t("clearSearch") || "Clear search"}
                </button>
              )}
            </div>
          ) : (
            visibleBlogs.map((blog, index) => (
              <div
                key={blog.id}
                className={cn(
                  "transition-all duration-300 ease-out",
                  animateCards
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                )}
                style={{
                  transitionDelay: animateCards ? `${index * 50}ms` : "0ms"
                }}
              >
                <BlogResultCard blog={blog} />
              </div>
            ))
          )}
        </div>

        {hasMore && (
          <div className={cn(
            "flex justify-center transition-all duration-300",
            animateCards ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
          style={{ transitionDelay: animateCards ? `${visibleBlogs.length * 50}ms` : "0ms" }}
          >
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className={cn(
                "bg-[#27c7ff] text-white h-[56px] px-[32px] pr-[24px] rounded-[16px] flex items-center justify-between gap-[16px] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.1),0px_18px_20px_0px_rgba(0,0,0,0.05)] transition-all duration-200",
                isLoadingMore ? "opacity-70 cursor-wait" : "hover:brightness-95 hover:scale-[1.02] active:scale-[0.98]"
              )}
            >
              <span className="text-[16px] font-bold uppercase tracking-[0.16px]">
                {t("loadMore")}
              </span>
              <Plus className={cn(
                "size-[32px] transition-transform duration-300",
                isLoadingMore && "animate-spin"
              )} />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
