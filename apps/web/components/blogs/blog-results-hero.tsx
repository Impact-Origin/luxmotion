"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Search } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter, useSearchParams } from "next/navigation"

const sans = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const
const serif = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const

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
    const timer = setTimeout(() => setIsVisible(true), 80)
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

  return (
    <section className="relative w-full overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[#0a0f14]" />
        <Image
          src="/blogs_results_hero.webp"
          alt=""
          fill
          className="object-cover object-[center_35%]"
          priority
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(0deg, rgba(13,13,13,0.96) 0%, rgba(13,13,13,0.55) 50%, rgba(13,13,13,0.2) 100%), linear-gradient(160deg, rgba(8,16,26,0.7) 0%, rgba(13,21,8,0.7) 50%, rgba(10,12,16,0.7) 100%)",
          }}
        />
      </div>

      <div className="relative flex items-center justify-center px-4 md:px-[48px] py-14 md:py-[64px] min-h-[380px] md:min-h-[460px]">
        <div className="flex flex-col items-center md:items-start gap-6 w-full max-w-[1280px]">
          <div
            className={`flex items-center gap-2 transition-all duration-500 ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="w-8 md:w-[82px] h-px bg-[#C9A96E]" />
            <span className="text-[12px] font-semibold uppercase tracking-[2px] text-[#C9A96E]" style={sans}>
              {t("eyebrow")}
            </span>
          </div>

          <h1
            style={serif}
            className={`text-center md:text-left text-[40px] md:text-[72px] font-normal leading-[0.98] text-[#f5f5f5] transition-all duration-500 ease-out delay-100 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {t("headingMain")}{" "}
            <span className="italic text-[#C9A96E]">{t("headingAccent")}</span>
          </h1>

          <div
            className={`flex items-center w-full md:w-auto transition-all duration-500 ease-out delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <div
              className="flex items-center h-[56px] bg-[#1e1d1b] border-y border-l border-[rgba(255,255,255,0.12)] px-[13px] gap-2 flex-1 md:flex-none md:w-[384px]"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            >
              <Search className="size-6 text-[rgba(255,255,255,0.22)] shrink-0" strokeWidth={1.5} />
              <input
                suppressHydrationWarning
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="bg-transparent text-[13px] text-white placeholder-[rgba(255,255,255,0.22)] outline-none w-full"
                style={sans}
              />
            </div>
            <button
              onClick={handleSearch}
              className="h-[56px] bg-[#C9A96E] border border-[#C9A96E] px-[22px] shrink-0 hover:bg-[#b8954f] transition-colors"
            >
              <span className="text-[14px] font-medium uppercase tracking-[1.1px] text-[#0D0D0D] whitespace-nowrap" style={sans}>
                {t("searchButton")}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
