"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"

const CATEGORIES = ["standard", "xl", "executivo", "van", "minibus", "autocarro", "classicos"] as const
type Category = (typeof CATEGORIES)[number]

type Props = {
  value?: Category
  onChange?: (category: Category) => void
}

export function FleetCategoryFilter({ value, onChange }: Props) {
  const t = useTranslations("fleetPage")
  const [internal, setInternal] = useState<Category>("standard")
  const active = value ?? internal

  const handleClick = (cat: Category) => {
    if (!value) setInternal(cat)
    onChange?.(cat)
    if (typeof window !== "undefined") {
      const el = document.getElementById(`fleet-category-${cat}`)
      if (el) {
        const headerOffset = 46 + 16
        const target = el.getBoundingClientRect().top + window.scrollY - headerOffset
        window.scrollTo({ top: target, behavior: "smooth" })
      }
    }
  }

  return (
    <div className="bg-[#0d0d0d] border-b-[0.8px] border-[rgba(201,169,110,0.1)] w-full">
      <div className="relative md:flex md:justify-center md:px-[60px]">
        <div
          className="flex items-stretch overflow-x-auto md:overflow-visible px-4 md:px-0 scrollbar-hide"
          style={{ scrollbarWidth: "none" }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = cat === active
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleClick(cat)}
                className={`shrink-0 px-[28px] py-[16px] text-[12px] font-semibold uppercase tracking-[1.2px] whitespace-nowrap transition-colors duration-300 ease-out ${
                  isActive
                    ? "bg-[#c9a96e] text-[#0d0d0d]"
                    : "text-[#8c8680] hover:bg-[#c9a96e] hover:text-[#0d0d0d]"
                }`}
                style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
              >
                {t(`category.${cat}`)}
              </button>
            )
          })}
        </div>
        <div className="md:hidden absolute top-0 right-0 h-full w-[75px] bg-gradient-to-r from-[rgba(13,13,13,0)] to-[rgba(201,169,110,0.1)] pointer-events-none" />
      </div>
    </div>
  )
}
