"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useQuery } from "convex/react"
import { api } from "@workspace/convex/api"
import { useTranslations } from "next-intl"
import { ChevronLeft, ChevronRight, Briefcase } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import Image from "next/image"

const DESKTOP_PER_PAGE = 6
const MOBILE_VISIBLE = 1

export function PastExperiencesSection() {
  const t = useTranslations("aboutPage.pastExperiences")
  const experiences = useQuery(api.pastExperiences.listPublished)

  const [activeCategory, setActiveCategory] = useState("all")
  const [desktopPage, setDesktopPage] = useState(0)
  const [mobileOffset, setMobileOffset] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const categories = useMemo(() => {
    if (!experiences) return []
    const cats = [...new Set(experiences.map((e) => e.category))]
    return cats
  }, [experiences])

  const filtered = useMemo(() => {
    if (!experiences) return []
    if (activeCategory === "all") return experiences
    return experiences.filter((e) => e.category === activeCategory)
  }, [experiences, activeCategory])

  useEffect(() => {
    setDesktopPage(0)
    setMobileOffset(0)
  }, [activeCategory])

  const totalDesktopPages = Math.ceil(filtered.length / DESKTOP_PER_PAGE)
  const desktopSlice = filtered.slice(
    desktopPage * DESKTOP_PER_PAGE,
    (desktopPage + 1) * DESKTOP_PER_PAGE
  )

  const mobileMaxOffset = Math.max(filtered.length - MOBILE_VISIBLE, 0)

  const nextDesktop = useCallback(() => {
    setDesktopPage((p) => Math.min(p + 1, totalDesktopPages - 1))
  }, [totalDesktopPages])

  const prevDesktop = useCallback(() => {
    setDesktopPage((p) => Math.max(p - 1, 0))
  }, [])

  const nextMobile = useCallback(() => {
    setMobileOffset((p) => Math.min(p + 1, mobileMaxOffset))
  }, [mobileMaxOffset])

  const prevMobile = useCallback(() => {
    setMobileOffset((p) => Math.max(p - 1, 0))
  }, [])

  const totalMobileDots = filtered.length
  const currentMobileDot = mobileOffset

  if (!experiences) return null

  const showDesktopArrows = !isMobile && totalDesktopPages > 1
  const showMobileArrows = isMobile && filtered.length > 1

  return (
    <section className="px-4 md:px-8 lg:px-[60px] xl:px-[100px] py-[36px]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-[28px] md:text-[36px] font-bold text-[#222] leading-normal mb-3">
            {t("title")}
          </h2>
          <p className="text-[16px] md:text-[18px] text-[#666] max-w-[600px] mx-auto leading-[1.4]">
            {t("subtitle")}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-8">
          <button
            onClick={() => setActiveCategory("all")}
            className={cn(
              "px-5 py-2 rounded-full text-sm font-medium transition-colors",
              activeCategory === "all"
                ? "bg-[#27c7ff] text-white"
                : "border border-[#e8e8e8] text-[#808080] hover:border-[#ccc]"
            )}
          >
            {t("filterAll")}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-medium transition-colors",
                activeCategory === cat
                  ? "bg-[#27c7ff] text-white"
                  : "border border-[#e8e8e8] text-[#808080] hover:border-[#ccc]"
              )}
            >
              {t(`categories.${cat}`)}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Briefcase className="h-12 w-12 mx-auto text-zinc-300 mb-4" />
            <p className="text-[#808080] text-lg">{t("empty")}</p>
          </div>
        ) : (
          <>
            {!isMobile ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full">
                {desktopSlice.map((exp) => (
                  <ExperienceCard key={exp._id} experience={exp} t={t} />
                ))}
              </div>
            ) : (
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{
                    gap: "24px",
                    transform: `translateX(calc(-${mobileOffset} * (100% + 24px)))`,
                  }}
                >
                  {filtered.map((exp) => (
                    <div key={exp._id} className="shrink-0 w-full">
                      <ExperienceCard experience={exp} t={t} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {((isMobile && filtered.length > 1) || (!isMobile && totalDesktopPages > 1)) && (
              <div className="flex gap-4 items-center justify-center mt-8">
                <button
                  onClick={isMobile ? prevMobile : prevDesktop}
                  disabled={isMobile ? mobileOffset === 0 : desktopPage === 0}
                  className={cn(
                    "size-[32px] rounded-full flex items-center justify-center transition-colors",
                    (isMobile ? mobileOffset === 0 : desktopPage === 0)
                      ? "bg-[#ebebeb] cursor-not-allowed opacity-50"
                      : "bg-[#ebebeb] hover:bg-[#d5d5d5]"
                  )}
                >
                  <ChevronLeft className="size-[15px] text-[#222]" />
                </button>

                {isMobile && (
                  <div className="flex gap-[6px] items-center">
                    {Array.from({ length: totalMobileDots }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setMobileOffset(i)}
                        className={cn(
                          "rounded-full transition-all",
                          i === currentMobileDot
                            ? "size-[14px] border-[1.2px] border-[#27c7ff] bg-transparent"
                            : "size-[10px] bg-[#27c7ff]"
                        )}
                      />
                    ))}
                  </div>
                )}

                {!isMobile && totalDesktopPages > 1 && (
                  <div className="flex gap-[6px] items-center">
                    {Array.from({ length: totalDesktopPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setDesktopPage(i)}
                        className={cn(
                          "rounded-full transition-all",
                          i === desktopPage
                            ? "size-[14px] border-[1.2px] border-[#27c7ff] bg-transparent"
                            : "size-[10px] bg-[#27c7ff]"
                        )}
                      />
                    ))}
                  </div>
                )}

                <button
                  onClick={isMobile ? nextMobile : nextDesktop}
                  disabled={
                    isMobile
                      ? mobileOffset >= mobileMaxOffset
                      : desktopPage >= totalDesktopPages - 1
                  }
                  className={cn(
                    "size-[32px] rounded-full flex items-center justify-center transition-colors",
                    (isMobile
                      ? mobileOffset >= mobileMaxOffset
                      : desktopPage >= totalDesktopPages - 1)
                      ? "bg-[#ebebeb] cursor-not-allowed opacity-50"
                      : "bg-[#ebebeb] hover:bg-[#d5d5d5]"
                  )}
                >
                  <ChevronRight className="size-[15px] text-[#222]" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

function ExperienceCard({ experience, t }: { experience: any; t: any }) {
  return (
    <div className="rounded-[16px] border border-[#e8e8e8] overflow-hidden bg-white">
      <div className="relative h-[250px] md:h-[300px]">
        {experience.imageUrl ? (
          <Image
            src={experience.imageUrl}
            alt={experience.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-zinc-100 flex items-center justify-center">
            <Briefcase className="h-12 w-12 text-zinc-300" />
          </div>
        )}

        {experience.location && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#27c7ff] text-white text-sm font-medium">
              {experience.location}
            </span>
          </div>
        )}
      </div>

      <div className="p-5 md:p-6">
        <h3 className="text-[18px] font-bold text-[#222] mb-2 line-clamp-1">
          {experience.title}
        </h3>
        <p className="text-[15px] text-[#0e4659] leading-[1.5] line-clamp-3 mb-3">
          {experience.description}
        </p>

        {experience.tags && experience.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {experience.tags.map((tag: string) => (
              <span
                key={tag}
                className="px-4 py-1.5 rounded-full bg-[#bceeff] text-[#0e4659] text-[15px] font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
