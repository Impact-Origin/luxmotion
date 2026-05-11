"use client"

import Link from "next/link"
import { Search } from "lucide-react"
import { useTranslations } from "next-intl"
import type { FormEvent } from "react"
import { useState } from "react"

const sans = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const
const serif = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const

interface FaqsHeroProps {
  onSearch?: (query: string) => void
  initialQuery?: string
}

export function FaqsHero({ onSearch, initialQuery = "" }: FaqsHeroProps) {
  const t = useTranslations("faqsPage.hero")
  const [query, setQuery] = useState(initialQuery)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    onSearch?.(query.trim())
  }

  return (
    <section className="bg-[#111110] pt-24 md:pt-28 pb-[80px] md:pb-[100px] px-4 md:px-[82px]">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-[15.2px]">
        <nav
          className="flex items-center gap-2 pb-2 text-[12px]"
          aria-label="Breadcrumb"
          style={sans}
        >
          <Link
            href="/"
            className="group relative text-[#C9A96E] hover:text-[#e8d5a8] transition-colors duration-300 ease-out"
          >
            {t("breadcrumbHome")}
            <span
              aria-hidden
              className="pointer-events-none absolute left-0 right-0 -bottom-0.5 h-px origin-left scale-x-0 group-hover:scale-x-100 bg-[#C9A96E] transition-transform duration-300 ease-out"
            />
          </Link>
          <span className="text-[#999] font-medium">›</span>
          <span className="text-white">{t("breadcrumbCurrent")}</span>
        </nav>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="h-px w-[82px] min-w-8 max-w-[82px] bg-[#C9A96E]" />
            <span
              className="text-[12px] font-semibold uppercase tracking-[2px] leading-none text-[#C9A96E]"
              style={sans}
            >
              {t("eyebrow")}
            </span>
          </div>

          <h1
            className="max-w-[800px] text-[48px] md:text-[56px] font-normal leading-[0.96] text-white"
            style={serif}
          >
            <span className="block">{t("headingLine1")}</span>
            <span className="block">
              {t("headingLine2Pre")}{" "}
              <span className="text-[#C4973E]">{t("headingAccent")}</span>
            </span>
          </h1>
        </div>

        <p
          className="max-w-[560px] pt-[4.8px] pb-[20.8px] text-[18px] font-normal leading-[1.3] text-[#999]"
          style={sans}
        >
          {t("subtitle")}
        </p>

        <form onSubmit={handleSubmit} className="flex items-stretch w-full max-w-[560px]">
          <div className="flex flex-1 min-w-0 items-center gap-2 h-14 bg-[#1E1D1B] border border-r-0 border-[rgba(255,255,255,0.12)] pl-[13px] pr-3 py-[14px]">
            <Search className="size-6 text-[rgba(255,255,255,0.55)] shrink-0" strokeWidth={2} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              aria-label={t("searchPlaceholder")}
              className="flex-1 min-w-0 bg-transparent text-[13px] text-white placeholder:text-[rgba(255,255,255,0.35)] focus:outline-none"
              style={sans}
            />
          </div>
          <button
            type="submit"
            className="h-14 px-[22px] py-[9px] bg-[#C9A96E] border border-[#C9A96E] text-[#0D0D0D] text-[14px] font-medium uppercase tracking-[1.1px] hover:bg-[#b89558] hover:border-[#b89558] transition-colors"
            style={sans}
          >
            {t("searchButton")}
          </button>
        </form>
      </div>
    </section>
  )
}
