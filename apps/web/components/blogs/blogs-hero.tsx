"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Search } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"

const sans = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const
const serif = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const

export function BlogsHero() {
  const t = useTranslations("blogsHero")
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 80)
    return () => clearTimeout(timer)
  }, [])

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const params = new URLSearchParams()
      params.set("q", searchQuery.trim())
      router.push(`/blogs/results?${params.toString()}`)
    }
  }

  return (
    <section className="relative w-full overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[#0a0f14]" />
        <Image
          src="/blogs/hero-bg.png"
          alt=""
          fill
          className="object-cover object-[center_30%]"
          priority
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(0deg, rgba(13,13,13,0.92) 0%, rgba(13,13,13,0.4) 50%, rgba(13,13,13,0.1) 100%), linear-gradient(160deg, rgba(8,16,26,0.7) 0%, rgba(13,21,8,0.7) 50%, rgba(10,12,16,0.7) 100%)",
          }}
        />
      </div>

      <div className="relative flex items-center justify-center px-4 md:px-[48px] py-16 md:py-[72px] min-h-[480px] md:min-h-[620px]">
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

          <div
            style={serif}
            className={`text-center md:text-left transition-all duration-500 ease-out delay-100 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <p className="text-[48px] md:text-[96px] min-[1440px]:text-[82px] min-[1920px]:text-[96px] font-normal leading-[0.95] text-[#f5f5f5] whitespace-pre-line">
              {t("headingMain")}
            </p>
            <p className="text-[48px] md:text-[96px] min-[1440px]:text-[82px] min-[1920px]:text-[96px] font-normal italic leading-[0.95] text-[#C9A96E]">
              {t("headingAccent")}
            </p>
          </div>

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
