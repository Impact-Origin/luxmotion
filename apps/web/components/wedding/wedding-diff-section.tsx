"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { cn } from "@workspace/ui/lib/utils"

const SERIF_FONT = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const
const SANS_FONT = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const

const BULLET_KEYS = [
  { num: "01", titleKey: "bullet1.title", descKey: "bullet1.desc" },
  { num: "02", titleKey: "bullet2.title", descKey: "bullet2.desc" },
  { num: "03", titleKey: "bullet3.title", descKey: "bullet3.desc" },
] as const

function FloatingReview({ text, author }: { text: string; author: string }) {
  const initial = author.trim().charAt(0).toUpperCase()
  return (
    <div className="bg-[rgba(255,255,255,0.98)] border border-[rgba(168,131,58,0.2)] shadow-[0_8px_16px_rgba(0,0,0,0.1)] flex flex-col gap-[5.1px] items-start w-[240px] pt-[16px] pb-[15px] px-[20.8px]">
      <span
        className="text-[16.893px] tracking-[1.4078px] text-[#a8833a] leading-none"
        style={{ fontFamily: "'Segoe UI Symbol', sans-serif" }}
      >
        ★★★★★
      </span>
      <p
        className="text-[12px] italic leading-[17px] text-[rgba(26,22,18,0.55)]"
        style={SANS_FONT}
      >
        {text}
      </p>
      <div className="flex gap-2 items-center pt-[5px]">
        <span className="size-[26px] rounded-[13px] bg-[rgba(201,169,110,0.15)] border border-[rgba(201,169,110,0.2)] flex items-center justify-center shrink-0">
          <span
            className="text-[10px] text-[#a8833a] leading-none"
            style={SANS_FONT}
          >
            {initial}
          </span>
        </span>
        <span
          className="text-[12px] font-semibold text-[rgba(26,22,18,0.6)] whitespace-nowrap"
          style={SANS_FONT}
        >
          {author}
        </span>
      </div>
    </div>
  )
}

function PhotoBlock({
  reviewText,
  reviewAuthor,
  alt,
}: {
  reviewText: string
  reviewAuthor: string
  alt: string
}) {
  return (
    <div className="relative w-full">
      <div className="relative w-full aspect-[600/750] border border-[rgba(168,131,58,0.15)] overflow-hidden">
        <Image
          src="/wedding/diff-couple.png"
          alt={alt}
          fill
          sizes="(min-width: 768px) 600px, 100vw"
          className="object-cover"
        />
      </div>

      <span
        aria-hidden
        className="absolute -top-3 -left-3 size-10 border-l-[1.6px] border-t-[1.6px] border-[#a8833a] pointer-events-none"
      />
      <span
        aria-hidden
        className="absolute -bottom-[12.5px] -right-3 size-10 border-r-[1.6px] border-b-[1.6px] border-[#a8833a] pointer-events-none"
      />

      <div className="absolute -bottom-[24.35px] -right-[31.8px] hidden md:block">
        <FloatingReview text={reviewText} author={reviewAuthor} />
      </div>

      <div className="absolute bottom-3 right-3 md:hidden">
        <FloatingReview text={reviewText} author={reviewAuthor} />
      </div>
    </div>
  )
}

function Eyebrow({ label }: { label: string }) {
  return (
    <div className="inline-flex gap-2 items-center">
      <span className="h-px w-8 md:w-[82px] bg-[#a08248]" />
      <span
        className="text-[12px] font-semibold uppercase tracking-[2px] text-[#a08248] whitespace-nowrap"
        style={SANS_FONT}
      >
        {label}
      </span>
    </div>
  )
}

function Heading({ start, accent }: { start: string; accent: string }) {
  return (
    <h2
      className="text-[36px] md:text-[44px] leading-tight font-normal text-[#1a1612] text-center md:text-left"
      style={SERIF_FONT}
    >
      <span>{start} </span>
      <span className="italic text-[#a08248]">{accent}</span>
    </h2>
  )
}

function BulletRow({
  num,
  title,
  desc,
}: {
  num: string
  title: string
  desc: string
}) {
  return (
    <div className="flex gap-5 items-start pt-[22px] pb-[22.8px] border-b-[0.8px] border-[rgba(26,22,18,0.07)]">
      <span
        className="text-[48px] leading-[32px] font-light text-[rgba(201,169,110,0.7)] w-7 shrink-0"
        style={SERIF_FONT}
      >
        {num}
      </span>
      <div className="flex flex-col gap-[4.1px] min-w-0 flex-1">
        <h3
          className="text-[24px] leading-tight font-medium text-[#1a1612]"
          style={SERIF_FONT}
        >
          {title}
        </h3>
        <p
          className="text-[14px] leading-[1.2] text-[#696969]"
          style={SANS_FONT}
        >
          {desc}
        </p>
      </div>
    </div>
  )
}

export function WeddingDiffSection() {
  const t = useTranslations("wedding.diff")
  const { ref, reveal, revealFromLeft, revealFromRight } = useScrollReveal<HTMLDivElement>()

  return (
    <section className="bg-[#faf7f2] px-4 md:px-20 py-14 md:py-24">
      <div ref={ref} className="max-w-[1280px] mx-auto flex flex-col md:flex-row gap-12 md:gap-20 items-center">
        <div className={cn("w-full md:flex-1 md:min-w-0", revealFromLeft())}>
          <PhotoBlock
            reviewText={t("review.text")}
            reviewAuthor={t("review.author")}
            alt={t("photoAlt")}
          />
        </div>

        <div className="w-full md:flex-1 md:min-w-0 flex flex-col gap-2">
          <div
            className={cn("flex flex-col gap-2 w-full md:items-start items-center", revealFromRight())}
            style={{ transitionDelay: "120ms" }}
          >
            <Eyebrow label={t("eyebrow")} />
            <Heading start={t("headingStart")} accent={t("headingAccent")} />
          </div>

          <div className="flex flex-col pt-4 w-full">
            {BULLET_KEYS.map((b, i) => (
              <div
                key={b.num}
                className={revealFromRight()}
                style={{ transitionDelay: `${240 + i * 130}ms` }}
              >
                <BulletRow
                  num={b.num}
                  title={t(b.titleKey)}
                  desc={t(b.descKey)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
