"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { useTranslations } from "next-intl"

type CategoryId = "standard" | "xl" | "executivo" | "van" | "minibus" | "bus"
type FeaturedId = "fiatTipo" | "mercedesSClass1" | "mercedesSClass2"

const CATEGORIES: readonly { id: CategoryId; image: string; active?: boolean }[] = [
  { id: "standard", image: "/fleet/cat-standard.png", active: true },
  { id: "xl", image: "/fleet/cat-xl.png" },
  { id: "executivo", image: "/fleet/cat-executivo.png" },
  { id: "van", image: "/fleet/cat-van.png" },
  { id: "minibus", image: "/fleet/cat-minibus.png" },
  { id: "bus", image: "/fleet/cat-bus.png" },
] as const

const FEATURED: readonly { id: FeaturedId; image: string }[] = [
  { id: "fiatTipo", image: "/fleet/featured-fiat-tipo.png" },
  { id: "mercedesSClass1", image: "/fleet/cat-standard.png" },
  { id: "mercedesSClass2", image: "/fleet/featured-mercedes-2.png" },
] as const

export function Fleet({ showControls = true }: { showControls?: boolean } = {}) {
  const t = useTranslations("fleet")
  const [activeCategory, setActiveCategory] = useState<CategoryId>("standard")

  return (
    <section
      id="fleet"
      className={`bg-[#0D0D0D] pt-10 px-4 md:px-[82px] 2xl:px-[300px] ${showControls ? "pb-16" : "pb-2"}`}
    >
      <div className="max-w-[1280px] mx-auto flex flex-col items-center gap-6">
        <div
          className="flex flex-col items-start gap-2 w-full"
          style={{ fontFamily: "var(--font-sans), Inter, sans-serif" }}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-px bg-[#C9A96E]" />
            <span className="text-[12px] font-semibold tracking-[2px] uppercase text-[#C9A96E] leading-none">
              {t("sectionLabel")}
            </span>
          </div>
          <h2
            className="text-[32px] md:text-[48px] font-normal text-[#F5F5F5] leading-none"
            style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif" }}
          >
            {t("titleHeading")}
          </h2>
          <p className="text-[15px] md:text-[18px] leading-[1.42] text-[#999]">
            {t("subtitle")}
          </p>
        </div>

        <div className="flex flex-col gap-[2px] w-full">
          <div className="grid grid-cols-2 md:flex md:flex-row gap-[2px] w-full">
            {CATEGORIES.map((cat) => (
              <CategoryCard
                key={cat.id}
                image={cat.image}
                label={t(`categories.${cat.id}.label`)}
                passengers={t(`categories.${cat.id}.passengers`)}
                active={activeCategory === cat.id}
                onClick={() => setActiveCategory(cat.id)}
              />
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-[2px] md:h-[340px] w-full">
            {FEATURED.map((car) => (
              <FeaturedCard
                key={car.id}
                image={car.image}
                label={t(`featured.${car.id}.label`)}
                name={t(`featured.${car.id}.name`)}
                specs={t(`featured.${car.id}.specs`)}
              />
            ))}
          </div>
        </div>

        {showControls && (
          <>
            <div className="flex items-center justify-center gap-2 mt-2">
              <button
                type="button"
                aria-label={t("previousSlide")}
                className="size-12 border-[1.714px] border-[rgba(154,117,53,0.22)] flex items-center justify-center text-[#C9A96E] hover:border-[#C9A96E] hover:bg-[rgba(201,169,110,0.08)] transition"
              >
                <ArrowRight className="size-[18px] rotate-180" strokeWidth={1.7} />
              </button>
              <div className="flex items-center gap-[6px] px-2">
                <span className="size-[6px] rounded-full bg-[#C9A96E]" />
                <span className="size-[5px] rounded-full bg-[rgba(201,169,110,0.35)]" />
                <span className="size-[5px] rounded-full bg-[rgba(201,169,110,0.35)]" />
                <span className="size-[5px] rounded-full bg-[rgba(201,169,110,0.35)]" />
              </div>
              <button
                type="button"
                aria-label={t("nextSlide")}
                className="size-12 border-[1.714px] border-[rgba(154,117,53,0.22)] flex items-center justify-center text-[#C9A96E] hover:border-[#C9A96E] hover:bg-[rgba(201,169,110,0.08)] transition"
              >
                <ArrowRight className="size-[18px]" strokeWidth={1.7} />
              </button>
            </div>

            <Link
              href="/fleet"
              className="group inline-flex items-center justify-center gap-2 border border-[#C9A96E] h-12 px-6 mt-2 text-[#C9A96E] hover:bg-[rgba(201,169,110,0.08)] transition-colors"
              style={{ fontFamily: "var(--font-sans), Inter, sans-serif" }}
            >
              <span className="text-[14px] font-medium tracking-[1.1px] uppercase">
                {t("exploreFleet")}
              </span>
              <ArrowUpRight
                className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={2}
              />
            </Link>
          </>
        )}
      </div>
    </section>
  )
}

function CategoryCard({
  image,
  label,
  passengers,
  active,
  onClick,
}: {
  image: string
  label: string
  passengers: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex-1 min-w-0 border border-[rgba(255,255,255,0.12)] flex flex-col items-center cursor-pointer transition-colors duration-200 hover:bg-[#222222] overflow-hidden ${
        active ? "bg-[#0D0D0D]" : "bg-[#1A1A1A]"
      }`}
    >
      <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-[#C9A96E] transition-opacity duration-200 ${active ? "opacity-100" : "opacity-0"}`} />
      <div className="relative h-[118px] w-[114px] mt-4">
        <Image
          src={image}
          alt={label}
          fill
          className="object-contain"
          sizes="114px"
        />
      </div>
      <div className="flex flex-col items-center justify-center gap-2 px-6 py-4 w-full">
        <span
          className={`text-[12px] font-semibold tracking-[2px] uppercase leading-none transition-colors duration-200 ${
            active ? "text-[#C9A96E]" : "text-[#999]"
          }`}
          style={{ fontFamily: "var(--font-sans), Inter, sans-serif" }}
        >
          {label}
        </span>
        <span
          className="text-[12px] text-white/55 leading-[1.2] text-center"
          style={{ fontFamily: "var(--font-sans), Inter, sans-serif" }}
        >
          {passengers}
        </span>
      </div>
    </button>
  )
}

function FeaturedCard({
  image,
  label,
  name,
  specs,
}: {
  image: string
  label: string
  name: string
  specs: string
}) {
  return (
    <div className="flex-1 min-w-0 border border-[rgba(255,255,255,0.12)] flex flex-col overflow-hidden">
      <div className="relative h-[200px] md:h-auto md:flex-1">
        <div className="absolute inset-0 bg-gradient-to-b from-[33.22%] from-[rgba(0,0,0,0.1)] to-[rgba(201,169,110,0.1)] z-[1] pointer-events-none" />
        <Image
          src={image}
          alt={name}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="relative h-[120px] flex flex-col justify-center gap-2 px-6 py-5 bg-gradient-to-t from-black to-[rgba(13,13,13,0.9)]">
        <span
          className="text-[12px] font-semibold tracking-[2px] uppercase text-[#C9A96E] leading-none"
          style={{ fontFamily: "var(--font-sans), Inter, sans-serif" }}
        >
          {label}
        </span>
        <span
          className="text-[24px] md:text-[20px] font-semibold md:font-normal text-white leading-none"
          style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif" }}
        >
          {name}
        </span>
        <span
          className="text-[12px] text-white/55 leading-[1.2]"
          style={{ fontFamily: "var(--font-sans), Inter, sans-serif" }}
        >
          {specs}
        </span>
      </div>
    </div>
  )
}
