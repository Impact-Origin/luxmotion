"use client"

import Link from "next/link"
import { ArrowRight, MoveLeft } from "lucide-react"
import { useTranslations } from "next-intl"

const sans = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const
const serif = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const

export function NotFoundContent() {
  const t = useTranslations("notFound")

  return (
    <main className="relative flex-1 flex flex-col items-center justify-center overflow-hidden bg-[#0D0D0D] px-4 pt-[120px] pb-24 text-center">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 size-[760px] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(circle, rgba(201,169,110,0.10) 0%, rgba(13,13,13,0) 70%)",
        }}
        aria-hidden
      />

      <div className="relative flex flex-col items-center gap-7 max-w-[640px]">
        <div className="flex items-center gap-2">
          <div className="w-[60px] h-px bg-[#C9A96E]" />
          <span
            className="text-[11px] md:text-[12px] font-semibold uppercase tracking-[2px] text-[#C9A96E]"
            style={sans}
          >
            {t("eyebrow")}
          </span>
          <div className="w-[60px] h-px bg-[#C9A96E]" />
        </div>

        <p
          className="text-[120px] md:text-[180px] font-light leading-[0.9] text-white"
          style={serif}
        >
          4<span className="italic text-[#C9A96E]">0</span>4
        </p>

        <h1
          className="text-[32px] md:text-[44px] leading-[1.1] text-[#f5f5f5]"
          style={serif}
        >
          {t("titleMain")}{" "}
          <span className="italic text-[#C9A96E]">{t("titleAccent")}</span>
        </h1>

        <p
          className="text-[15px] md:text-[16px] leading-[1.7] text-[#999] max-w-[460px]"
          style={sans}
        >
          {t("description")}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 h-[52px] bg-[#C9A96E] px-7 text-[13px] font-medium uppercase tracking-[1.1px] text-[#0D0D0D] hover:bg-[#b8954f] transition-colors"
            style={sans}
          >
            <MoveLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            {t("backToHomepage")}
          </Link>
          <Link
            href="/blogs"
            className="group inline-flex items-center gap-2 h-[52px] px-7 text-[13px] font-medium uppercase tracking-[1.1px] text-[#C9A96E] border border-[rgba(201,169,110,0.4)] hover:border-[#C9A96E] hover:text-white transition-colors"
            style={sans}
          >
            {t("exploreJournal")}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </main>
  )
}
