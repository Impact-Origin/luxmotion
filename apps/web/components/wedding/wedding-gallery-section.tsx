"use client"

import { useCallback, useState } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useSwipe } from "@/hooks/use-swipe"

const SERIF_FONT = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const
const SANS_FONT = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const

const PHOTOS = [
  "/wedding/gallery-1.png",
  "/wedding/gallery-2.png",
  "/wedding/gallery-3.png",
] as const

function GalleryCard({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative bg-white overflow-clip flex-1 min-w-0 self-stretch">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 768px) 33vw, 100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(13,13,13,0.7)] from-0% to-[rgba(13,13,13,0)] to-50% pointer-events-none" />
    </div>
  )
}

function NavArrow({
  direction,
  onClick,
}: {
  direction: "left" | "right"
  onClick: () => void
}) {
  const Icon = direction === "left" ? ArrowLeft : ArrowRight
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Previous" : "Next"}
      className="size-12 border-[1.714px] border-[rgba(154,117,53,0.22)] flex items-center justify-center hover:border-[#a08248] transition-colors shrink-0"
    >
      <Icon className="size-[18px] text-[#a08248]" strokeWidth={1.5} />
    </button>
  )
}

function Dots({ pages, current }: { pages: number; current: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: pages }).map((_, i) => (
        <span
          key={i}
          className={`size-[5.352px] rounded-full ${
            i === current ? "bg-[#a08248]" : "bg-[rgba(168,131,58,0.3)]"
          }`}
        />
      ))}
    </div>
  )
}

function SectionHeading({
  eyebrow,
  headingStart,
  headingAccent,
}: {
  eyebrow: string
  headingStart: string
  headingAccent: string
}) {
  return (
    <div className="flex flex-col gap-2 items-center w-full">
      <div className="flex gap-2 items-center justify-center">
        <span className="h-px w-8 bg-[#a08248]" />
        <span
          className="text-[12px] font-semibold uppercase tracking-[2px] text-[#a08248] whitespace-nowrap"
          style={SANS_FONT}
        >
          {eyebrow}
        </span>
        <span className="h-px w-8 bg-[#a08248]" />
      </div>
      <h2
        className="text-[32px] md:text-[48px] leading-[1.1] font-normal text-[#1a1612] text-center"
        style={SERIF_FONT}
      >
        <span>{headingStart} </span>
        <span className="italic text-[#a08248]">{headingAccent}</span>
      </h2>
    </div>
  )
}

export function WeddingGallerySection() {
  const t = useTranslations("wedding.gallery")
  const [page, setPage] = useState(0)

  const next = useCallback(() => setPage((p) => (p + 1) % PHOTOS.length), [])
  const prev = useCallback(
    () => setPage((p) => (p - 1 + PHOTOS.length) % PHOTOS.length),
    [],
  )
  const swipe = useSwipe(next, prev)

  return (
    <section className="bg-[#f7f4ef] px-4 md:px-20 py-14 md:py-24">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-4 items-center">
        <SectionHeading
          eyebrow={t("eyebrow")}
          headingStart={t("headingStart")}
          headingAccent={t("headingAccent")}
        />

        <div className="hidden md:flex gap-[3px] items-stretch justify-center w-full pt-[42px] h-[608.21px]">
          {PHOTOS.map((src, i) => (
            <GalleryCard key={i} src={src} alt={t("photoAlt", { index: i + 1 })} />
          ))}
        </div>

        <div className="md:hidden w-full pt-2" {...swipe}>
          <div className="relative h-[531.21px] w-full bg-white overflow-clip">
            <Image
              src={PHOTOS[page]!}
              alt={t("photoAlt", { index: page + 1 })}
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(13,13,13,0.7)] from-0% to-[rgba(13,13,13,0)] to-50% pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 pt-2">
          <NavArrow direction="left" onClick={prev} />
          <Dots pages={PHOTOS.length} current={page} />
          <NavArrow direction="right" onClick={next} />
        </div>
      </div>
    </section>
  )
}
