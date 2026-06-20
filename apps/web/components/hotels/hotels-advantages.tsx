"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Gem, ArrowLeft, ArrowRight } from "lucide-react"

const sans = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const
const serif = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const

type QA = { q: string; a: string }
const PER_PAGE = 6

export function HotelsAdvantages() {
  const t = useTranslations("hotels.advantages")
  const items = t.raw("items") as QA[]
  const label = t("label")
  const [page, setPage] = useState(0)
  const pages = Math.max(1, Math.ceil(items.length / PER_PAGE))
  const visible = items.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE)
  const go = (d: number) => setPage((p) => (p + d + pages) % pages)

  return (
    <section className="bg-[#0D0D0D] px-4 py-16 lg:py-24">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-12 flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <div className="h-px w-8 bg-[#C9A96E]" />
            <span className="font-sans text-[12px] font-semibold uppercase tracking-[2px] text-[#C9A96E]">{t("eyebrow")}</span>
            <div className="h-px w-8 bg-[#C9A96E]" />
          </div>
          <h2 className="text-[36px] leading-[1.12] text-[#f5f5f5] md:text-[46px]" style={serif}>
            {t("titlePrefix")} <span className="italic text-[#C9A96E]">{t("titleAccent")}</span> {t("titleSuffix")}
          </h2>
        </div>

        <div className="border border-[rgba(201,169,110,0.08)]">
          <div className="grid grid-cols-1 gap-px bg-[rgba(255,255,255,0.08)] md:grid-cols-2">
            {visible.map((qa, i) => (
              <div
                key={`${page}-${i}`}
                className="group relative flex cursor-default flex-col gap-4 bg-[#1a1a1a] px-6 py-8 transition-all duration-300 ease-out hover:bg-[#222222] hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(0,0,0,0.7)] hover:ring-1 hover:ring-inset hover:ring-[rgba(201,169,110,0.22)] md:min-h-[396px] md:px-8 md:py-9 lg:min-h-[344px] xl:min-h-[320px]"
              >
                <span className="flex h-11 w-11 items-center justify-center border border-[rgba(201,169,110,0.4)] text-[#C9A96E]">
                  <Gem className="size-5 transition-transform duration-300 ease-out group-hover:scale-110" strokeWidth={1.5} />
                </span>
                <h3 className="text-[19px] font-medium leading-[1.25] text-white md:text-[20px]" style={serif}>{qa.q}</h3>
                <p className="border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] px-4 py-3 text-[13px] leading-[1.5] text-[#9a9a9a]" style={sans}>
                  {qa.a}
                </p>
                <span className="mt-auto pt-1 text-[11px] font-semibold uppercase tracking-[1.5px] text-[#C9A96E]" style={sans}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {pages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => go(-1)}
              className="flex h-11 w-11 items-center justify-center border border-[rgba(201,169,110,0.35)] text-[#C9A96E] transition-colors hover:bg-[rgba(201,169,110,0.08)]"
              aria-label="Previous"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 px-2">
              {Array.from({ length: pages }).map((_, i) => (
                <span key={i} className={`h-1.5 w-1.5 rounded-full transition-colors ${i === page ? "bg-[#C9A96E]" : "bg-[rgba(201,169,110,0.3)]"}`} />
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(1)}
              className="flex h-11 w-11 items-center justify-center border border-[rgba(201,169,110,0.35)] text-[#C9A96E] transition-colors hover:bg-[rgba(201,169,110,0.08)]"
              aria-label="Next"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
