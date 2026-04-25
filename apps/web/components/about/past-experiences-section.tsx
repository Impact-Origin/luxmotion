"use client"

import { useState, useMemo } from "react"
import { useTranslations } from "next-intl"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import Image from "next/image"

type Category = "all" | "weddings" | "corporate" | "events" | "tours"

type Photo = {
  src: string
  alt: string
  cat: Exclude<Category, "all">
}

const CATEGORIES: { id: Category; labelKey: string }[] = [
  { id: "all", labelKey: "filters.all" },
  { id: "weddings", labelKey: "filters.weddings" },
  { id: "corporate", labelKey: "filters.corporate" },
  { id: "events", labelKey: "filters.events" },
  { id: "tours", labelKey: "filters.tours" },
]

const PHOTOS: Photo[] = [
  { src: "/about/exp-cabo-da-roca.png", alt: "Cabo da Roca cliffs", cat: "tours" },
  { src: "/about/exp-websummit.png", alt: "Web Summit Lisbon", cat: "events" },
  { src: "/about/exp-driver-merc.png", alt: "Driver greeting at hotel", cat: "corporate" },
  { src: "/about/exp-wedding.png", alt: "Wedding ceremony procession", cat: "weddings" },
]

function PhotoTile({ photo, className }: { photo: Photo; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image src={photo.src} alt={photo.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 950px" />
    </div>
  )
}

function CarouselArrow({
  direction,
  onClick,
  disabled,
}: {
  direction: "left" | "right"
  onClick: () => void
  disabled: boolean
}) {
  const Icon = direction === "left" ? ArrowLeft : ArrowRight
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "size-12 border border-[rgba(154,117,53,0.4)] flex items-center justify-center text-[#C9A96E] transition-colors",
        disabled ? "opacity-30 cursor-not-allowed" : "hover:bg-[rgba(201,169,110,0.08)]",
      )}
      aria-label={direction === "left" ? "Previous" : "Next"}
    >
      <Icon className="size-[18px]" strokeWidth={1.5} />
    </button>
  )
}

export function PastExperiencesSection() {
  const t = useTranslations("aboutPage.pastExperiences")
  const [active, setActive] = useState<Category>("all")
  const [mobileIdx, setMobileIdx] = useState(0)

  const filtered = useMemo(
    () => (active === "all" ? PHOTOS : PHOTOS.filter((p) => p.cat === active)),
    [active],
  )

  const showAsymmetric = active === "all" && filtered.length === 4

  const handleCategory = (cat: Category) => {
    setActive(cat)
    setMobileIdx(0)
  }

  const mobileMax = Math.max(filtered.length - 1, 0)

  return (
    <section className="bg-[#0D0D0D] flex flex-col items-center px-4 md:px-[82px] py-20 md:py-24">
      <div className="flex flex-col gap-10 items-center w-full max-w-[1280px]">
        <div className="flex flex-col gap-[14px] items-center w-full">
          <div className="flex gap-2 items-center">
            <div className="w-8 h-px bg-[#C9A96E]" />
            <span
              className="text-[12px] font-semibold uppercase tracking-[2px] text-[#C9A96E] whitespace-nowrap"
              style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
            >
              {t("eyebrow")}
            </span>
            <div className="w-8 h-px bg-[#C9A96E]" />
          </div>
          <h2
            className="text-white font-normal text-center leading-[1.2]"
            style={{
              fontFamily: "var(--font-title), 'Cormorant Garamond', serif",
              fontSize: "clamp(2rem, 3.4vw, 3rem)",
            }}
          >
            <span className="block">{t("headingLine1")}</span>
            <span className="block italic text-[#C9A96E]">{t("headingLine2")}</span>
          </h2>
          <p
            className="text-[14px] md:text-[18px] text-center text-[#999] max-w-[540px] leading-[1.3]"
            style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
          >
            {t("subtitle")}
          </p>
        </div>

        <div className="flex gap-2 items-center overflow-x-auto no-scrollbar w-full md:w-auto md:justify-center">
          {CATEGORIES.map((c) => {
            const isActive = active === c.id
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => handleCategory(c.id)}
                className={cn(
                  "h-8 px-4 text-[12px] font-semibold uppercase tracking-[0.7px] whitespace-nowrap shrink-0 transition-colors",
                  isActive
                    ? "bg-[#C9A96E] text-[#0D0D0D] border border-[rgba(201,169,110,0.18)]"
                    : "text-[#999] hover:text-white",
                )}
                style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
              >
                {t(c.labelKey)}
              </button>
            )
          })}
        </div>

        <div className="hidden md:block w-full">
          {showAsymmetric ? (
            <div className="flex flex-col gap-[2px] w-full">
              <div className="flex gap-[2px] w-full h-[394px]">
                <PhotoTile photo={filtered[0]!} className="w-[950px] h-full shrink-0" />
                <PhotoTile photo={filtered[1]!} className="flex-1 h-full" />
              </div>
              <div className="flex gap-[2px] w-full h-[394px]">
                <PhotoTile photo={filtered[2]!} className="w-[509px] h-full shrink-0" />
                <PhotoTile photo={filtered[3]!} className="flex-1 h-full" />
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-[#999] py-16">{t("empty")}</p>
          ) : (
            <div className="grid grid-cols-2 gap-[2px] w-full">
              {filtered.map((p) => (
                <PhotoTile key={p.src} photo={p} className="h-[394px]" />
              ))}
            </div>
          )}
        </div>

        <div className="md:hidden w-full flex flex-col gap-4">
          {filtered.length === 0 ? (
            <p className="text-center text-[#999] py-16">{t("empty")}</p>
          ) : (
            <>
              <div className="overflow-hidden w-full">
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${mobileIdx * 100}%)` }}
                >
                  {filtered.map((p) => (
                    <div key={p.src} className="shrink-0 w-full">
                      <PhotoTile photo={p} className="w-full h-[340px]" />
                    </div>
                  ))}
                </div>
              </div>
              {filtered.length > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <CarouselArrow
                    direction="left"
                    onClick={() => setMobileIdx((i) => Math.max(i - 1, 0))}
                    disabled={mobileIdx === 0}
                  />
                  <div className="flex gap-2 items-center px-4">
                    {filtered.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setMobileIdx(i)}
                        aria-label={`Go to slide ${i + 1}`}
                        className={cn(
                          "rounded-full transition-all",
                          i === mobileIdx ? "size-[6px] bg-[#C9A96E]" : "size-[5px] bg-[rgba(201,169,110,0.4)]",
                        )}
                      />
                    ))}
                  </div>
                  <CarouselArrow
                    direction="right"
                    onClick={() => setMobileIdx((i) => Math.min(i + 1, mobileMax))}
                    disabled={mobileIdx >= mobileMax}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
