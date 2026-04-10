"use client"

import { useEffect, useState } from "react"
import { Search, ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@workspace/ui/lib/utils"

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

function SearchInput({ value, onChange, placeholder, className }: SearchInputProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-[8px] h-[56px] w-full",
        "flex items-center px-[16px] gap-[12px]",
        className
      )}
    >
      <Search className="w-[24px] h-[24px] text-[#a2a2a2] shrink-0" />
      <input
        suppressHydrationWarning
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 text-[16px] text-[#222] placeholder:text-[#a2a2a2] font-normal outline-none bg-transparent"
      />
    </div>
  )
}

interface SearchButtonProps {
  onClick: () => void
  label: string
  className?: string
}

function SearchButton({ onClick, label, className }: SearchButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "bg-[#27c7ff] hover:brightness-95 text-white h-[56px] px-[32px]",
        "flex items-center justify-center gap-[8px] rounded-[8px] transition-all",
        "whitespace-nowrap cursor-pointer",
        className
      )}
    >
      <span className="text-[16px] font-semibold uppercase tracking-[0.5px]">
        {label}
      </span>
      <ArrowRight className="w-[20px] h-[20px]" />
    </button>
  )
}

interface BlogResultsHeroProps {
  onSearch?: (query: string) => void
}

export function BlogResultsHero({ onSearch }: BlogResultsHeroProps) {
  const t = useTranslations("blogsHero")
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isVisible, setIsVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const params = new URLSearchParams()
      params.set("q", searchQuery.trim())
      router.push(`/blogs/results?${params.toString()}`)
      onSearch?.(searchQuery.trim())
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <section className="relative w-full h-[459px] md:h-[520px] lg:h-[520px] xl:h-[520px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/blogs_results_hero.jpg')" }}
      />

      <div className="absolute inset-0 bg-black/20" />

      <div className="absolute top-0 left-0 right-0 h-[180px] md:h-[200px] lg:h-[240px] bg-gradient-to-b from-white via-white/80 via-50% to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 h-[80px] md:h-[100px] lg:h-[120px] bg-gradient-to-t from-white via-white/50 to-transparent" />

      <div className="relative z-10 h-full flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-[24px] w-full max-w-[395px] md:max-w-[640px]">
          <h1
            className={cn(
              "text-center text-white mix-blend-screen transition-all duration-700 ease-out font-bold md:whitespace-nowrap",
              "text-[28px] md:text-[64px] leading-[1.2] md:leading-[1.1]",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            {t("title")}
          </h1>

          <div
            className={cn(
              "flex flex-col md:flex-row items-center gap-[12px] w-full",
              "transition-all duration-700 ease-out delay-150",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
            onKeyDown={handleKeyDown}
          >
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={t("searchPlaceholder")}
              className="flex-1"
            />
            <SearchButton
              onClick={handleSearch}
              label={t("searchButton")}
              className="w-full md:w-auto"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
