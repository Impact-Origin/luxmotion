"use client"

import { useTranslations } from "next-intl"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

interface BrowsePaginationProps {
  page: number
  pageCount: number
  onPage: (page: number) => void
}

export function BrowsePagination({ page, pageCount, onPage }: BrowsePaginationProps) {
  const t = useTranslations("ultraLuxuryTours.browse")
  if (pageCount <= 1) return null

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1)

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onPage(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label={t("prev")}
        className="flex size-[44px] items-center justify-center border border-[rgba(154,117,53,0.22)] text-[#a08248] transition-colors hover:border-[#a08248] disabled:opacity-30"
      >
        <ArrowLeft className="size-[16px]" strokeWidth={2} />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPage(p)}
          className={cn(
            "flex size-[44px] items-center justify-center border text-[14px] font-medium transition-colors",
            p === page
              ? "border-[#a08248] bg-[#a08248] text-[#f7f4ef]"
              : "border-[rgba(154,117,53,0.22)] text-[#1c1b18] hover:border-[#a08248]",
          )}
        >
          {p}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPage(Math.min(pageCount, page + 1))}
        disabled={page === pageCount}
        aria-label={t("next")}
        className="flex size-[44px] items-center justify-center border border-[rgba(154,117,53,0.22)] text-[#a08248] transition-colors hover:border-[#a08248] disabled:opacity-30"
      >
        <ArrowRight className="size-[16px]" strokeWidth={2} />
      </button>
    </div>
  )
}
