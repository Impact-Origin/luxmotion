"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import { ArrowRight } from "lucide-react"

const SERIF_FONT = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const
const SANS_FONT = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const

const CARDS = [
  { id: "noivos", src: "/wedding-planner/services/noivos.png" },
  { id: "convidados", src: "/wedding-planner/services/convidados.png" },
  { id: "aeroporto", src: "/wedding-planner/services/aeroporto.png" },
  { id: "tours", src: "/wedding-planner/services/tours.png" },
  { id: "autocarro", src: "/wedding-planner/services/autocarro.png" },
] as const

function ServiceCard({
  src,
  title,
  alt,
}: {
  src: string
  title: string
  alt: string
}) {
  return (
    <div className="relative h-[430px] overflow-hidden flex flex-col justify-end">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 768px) 256px, 50vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[47%] to-black to-[84%]" />
      <div className="relative z-10 p-4 flex items-center justify-between gap-3">
        <span
          className="text-[24px] leading-none text-white font-semibold"
          style={SERIF_FONT}
        >
          {title}
        </span>
        <button
          aria-label={title}
          className="size-8 shrink-0 inline-flex items-center justify-center border-[1.143px] border-[rgba(255,255,255,0.3)] hover:border-white transition-colors"
        >
          <ArrowRight className="size-[18.286px] text-white" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  )
}

export function WeddingPlannerServices() {
  const t = useTranslations("weddingPlanner.services")

  const cards = CARDS.map((c, i) => ({
    ...c,
    title: t(`card${i + 1}Title`),
    alt: t(`card${i + 1}Alt`),
  }))

  return (
    <section className="bg-[#f7f4ef] px-4 md:px-[82px] py-16 md:pt-14 md:pb-16">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-6 md:gap-10">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-px bg-[#a08248]" />
            <span
              className="text-[12px] font-semibold uppercase tracking-[2px] text-[#a08248] whitespace-nowrap"
              style={SANS_FONT}
            >
              {t("eyebrow")}
            </span>
            <div className="w-8 h-px bg-[#a08248]" />
          </div>
          <h2
            className="text-[32px] md:text-[48px] leading-[1.1] text-[#1a1612] text-center font-normal"
            style={SERIF_FONT}
          >
            {t("titleStart")}{" "}
            <span className="italic text-[#a08248]">{t("titleAccent")}</span>{" "}
            {t("titleEnd")}
          </h2>
        </div>

        <div className="hidden md:flex gap-[5px] w-full">
          {cards.map((c) => (
            <div key={c.id} className="flex-1 min-w-0">
              <ServiceCard src={c.src} title={c.title} alt={c.alt} />
            </div>
          ))}
        </div>

        <div className="md:hidden flex gap-[5px] overflow-x-auto scrollbar-hide -mx-4 px-4 snap-x snap-mandatory">
          {cards.map((c) => (
            <div
              key={c.id}
              className="shrink-0 w-[calc((100vw-37px)/2)] snap-start"
            >
              <ServiceCard src={c.src} title={c.title} alt={c.alt} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
