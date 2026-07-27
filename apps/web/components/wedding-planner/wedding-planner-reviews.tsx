"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowLeft, ArrowRight, BadgeCheck } from "lucide-react"
import { useTranslations } from "next-intl"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { cn } from "@workspace/ui/lib/utils"
import {
  GOOGLE_REVIEWS_URL,
  TRUSTPILOT_REVIEWS_URL,
  REVIEW_LINK_PROPS,
} from "@/lib/review-links"

const SANS = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const
const SERIF = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const

type Review = {
  initial: string
  avatarBg: string
  name: string
  source: string
  body: string
}

function ReviewCard({ r }: { r: Review }) {
  return (
    <article className="group bg-white border-l-[0.8px] border-r-[0.8px] border-b-[0.8px] border-t-[1.6px] border-[rgba(0,0,0,0.06)] flex flex-col gap-2 px-[24.8px] pt-[25.6px] pb-[24.8px] shadow-[0px_2px_6px_rgba(0,0,0,0.04)] h-full transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(0,0,0,0.6)] hover:ring-1 hover:ring-inset hover:ring-[rgba(201,169,110,0.25)] hover:bg-[rgba(201,169,110,0.05)]">
      <div className="flex gap-[10px] items-center w-full">
        <div
          className="size-[34px] rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ease-out group-hover:scale-110"
          style={{ backgroundColor: r.avatarBg }}
        >
          <span className="text-[13px] font-semibold text-white" style={SANS}>
            {r.initial}
          </span>
        </div>
        <div className="flex flex-col items-start min-w-0">
          <span className="text-[12px] font-semibold text-[#1a1612] leading-tight" style={SANS}>
            {r.name}
          </span>
          <span className="text-[9px] tracking-[0.54px] text-[#7a746e] leading-tight" style={SANS}>
            {r.source}
          </span>
        </div>
      </div>
      <div className="pt-[4.8px] text-[#a8833a] text-[12px] tracking-[1px] leading-none select-none">
        ★★★★★
      </div>
      <p className="text-[12px] text-[rgba(26,22,18,0.5)] leading-[1.2]" style={SANS}>
        {r.body}
      </p>
    </article>
  )
}

const AVATARS: string[] = ["#9c27b0", "#1565c0", "#2e7d32", "#b71c1c"]
const KEYS = ["r1", "r2", "r3", "r4"] as const

export function WeddingPlannerReviews() {
  const t = useTranslations("weddingPlanner.reviews")
  const [page, setPage] = useState(0)

  const reviews: Review[] = KEYS.map((k, i) => ({
    initial: t(`${k}.initial`),
    avatarBg: AVATARS[i] ?? "#1565c0",
    name: t(`${k}.name`),
    source: t(`${k}.source`),
    body: t(`${k}.body`),
  }))
  const { ref, reveal } = useScrollReveal<HTMLElement>()

  return (
    <section ref={ref} className="bg-white px-4 md:px-[80px] py-16 md:py-24">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-8 items-center">
        <div className={cn("border border-[#a08248] backdrop-blur-[2px] flex gap-2 items-center justify-center px-4 py-2", reveal())}>
          <BadgeCheck className="w-6 h-6 text-[#a08248]" strokeWidth={1.75} />
          <span
            className="text-[14px] tracking-[0.28px] text-[#a08248]"
            style={SANS}
          >
            {t("pill")}
          </span>
        </div>

        <div
          className={cn("flex flex-col gap-6 items-center w-full", reveal())}
          style={{ transitionDelay: "120ms" }}
        >
          <h2
            className="text-center text-[#0d0d0d] leading-none"
            style={SERIF}
          >
            <span className="font-medium text-[#a08248] text-[40px] md:text-[64px]">
              {t("headingNumber")}
            </span>
            <span className="hidden md:inline text-[48px]">{" "}</span>
            <span className="block md:inline text-[28px] md:text-[48px] mt-2 md:mt-0">
              {t("headingText")}
            </span>
          </h2>

          <div className="flex flex-col gap-2 items-center">
            <div className="text-[#a8833a] text-[24px] tracking-[2px] leading-none select-none">
              ★★★★★
            </div>
            <div className="flex gap-[18.834px] items-center justify-center">
              <a href={GOOGLE_REVIEWS_URL} {...REVIEW_LINK_PROPS} aria-label="Google"
                 className="transition-opacity hover:opacity-70">
                <Image
                src="/google-logo.png"
                alt="Google"
                width={94}
                height={32}
                className="h-[32px] w-auto"
              />
              </a>
              <a href={TRUSTPILOT_REVIEWS_URL} {...REVIEW_LINK_PROPS} aria-label="Trustpilot"
                 className="transition-opacity hover:opacity-70">
                <Image
                src="/trustpilot-logo.png"
                alt="Trustpilot"
                width={104}
                height={28}
                className="h-[28px] w-auto"
              />
              </a>
            </div>
            <p className="text-[16px] md:text-[18px] font-light text-[#696969] leading-[1.3]" style={SANS}>
              {t("subtitle")}
            </p>
          </div>
        </div>

        <div className="hidden md:flex gap-[3px] w-full">
          {reviews.map((r, i) => (
            <div
              key={i}
              className={cn("flex-1 min-w-0", reveal())}
              style={{ transitionDelay: `${280 + i * 110}ms` }}
            >
              <ReviewCard r={r} />
            </div>
          ))}
        </div>

        <div className="md:hidden w-full flex flex-col gap-4 items-center">
          <div className="w-full max-w-[400px] overflow-hidden">
            <div
              className="flex transition-transform duration-300"
              style={{ transform: `translateX(-${page * 100}%)` }}
            >
              {reviews.map((r, i) => (
                <div key={i} className="w-full shrink-0 px-1">
                  <ReviewCard r={r} />
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2 items-center justify-center">
            <button
              type="button"
              aria-label={t("prevAria")}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="w-12 h-12 border-[1.7px] border-[rgba(154,117,53,0.22)] flex items-center justify-center text-[#a08248] hover:border-[#c9a96e] hover:text-[#c9a96e] disabled:opacity-40 transition-colors"
            >
              <ArrowLeft className="w-[18px] h-[18px]" strokeWidth={2} />
            </button>
            {reviews.map((_, i) => (
              <span
                key={i}
                className={`w-[5px] h-[5px] rounded-full ${
                  i === page ? "bg-[#a08248]" : "bg-[#a08248]/30"
                }`}
              />
            ))}
            <button
              type="button"
              aria-label={t("nextAria")}
              onClick={() => setPage((p) => Math.min(reviews.length - 1, p + 1))}
              disabled={page === reviews.length - 1}
              className="w-12 h-12 border-[1.7px] border-[rgba(154,117,53,0.22)] flex items-center justify-center text-[#a08248] hover:border-[#c9a96e] hover:text-[#c9a96e] disabled:opacity-40 transition-colors"
            >
              <ArrowRight className="w-[18px] h-[18px]" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
