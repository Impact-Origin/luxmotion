"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useQuery } from "convex/react"
import { api } from "@workspace/convex/api"
import { useTranslations } from "next-intl"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Users,
  Search,
  GraduationCap,
  BadgeCheck,
  ChevronRight,
  UserCheck,
} from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import Image from "next/image"

const VISIBLE = 3

const verificationSteps = [
  { icon: Users, labelKey: "interview" },
  { icon: Search, labelKey: "backgroundCheck" },
  { icon: GraduationCap, labelKey: "training" },
  { icon: BadgeCheck, labelKey: "approval" },
] as const

export function DriversSection() {
  const t = useTranslations("aboutPage.drivers")
  const drivers = useQuery(api.drivers.listPublished)

  const [offset, setOffset] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const totalItems = drivers?.length ?? 0
  const currentVisible = isMobile ? 1 : VISIBLE
  const maxOffset = Math.max(totalItems - currentVisible, 0)

  const next = useCallback(() => {
    setOffset((prev) => Math.min(prev + 1, maxOffset))
  }, [maxOffset])

  const prev = useCallback(() => {
    setOffset((prev) => Math.max(prev - 1, 0))
  }, [])

  const progressPercent = maxOffset > 0 ? (offset / maxOffset) * 100 : 0

  if (!drivers) return null

  const cardWidthPercent = isMobile ? 100 : 100 / VISIBLE
  const gapPx = 24

  return (
    <section className="px-4 md:px-8 lg:px-[60px] xl:px-[100px] py-[36px]">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">
        <div className="text-center flex flex-col gap-4 items-center">
          <h2 className="text-[24px] md:text-[32px] font-bold text-[#222]">
            {t("title")}
          </h2>
          <p className="text-[16px] md:text-[20px] text-[#222] leading-[1.3] max-w-[900px]">
            {t.rich("subtitle", {
              bold: (chunks) => <span className="font-bold">{chunks}</span>,
            })}
          </p>
        </div>

        {drivers.length > 0 && (
          <div className="w-full flex flex-col items-center gap-4">
            <div className="w-full overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  gap: `${gapPx}px`,
                  transform: `translateX(calc(-${offset} * (${cardWidthPercent}% - ${gapPx * (currentVisible - 1) / currentVisible}px + ${gapPx}px)))`,
                }}
              >
                {drivers.map((driver) => (
                  <div
                    key={driver._id}
                    className="shrink-0"
                    style={{
                      width: `calc(${cardWidthPercent}% - ${gapPx * (currentVisible - 1) / currentVisible}px)`,
                    }}
                  >
                    <div className="bg-white border border-[#e8e8e8] rounded-[16px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] p-6 flex flex-col items-center gap-[10px] h-full">
                      <div className="relative h-[119px] w-[112px]">
                        <div className="size-[112px] rounded-full overflow-hidden shadow-[0px_0px_0px_3px_rgba(41,201,255,0.2)]">
                          {driver.imageUrl ? (
                            <Image
                              src={driver.imageUrl}
                              alt={driver.name}
                              width={112}
                              height={112}
                              className="object-cover size-full"
                            />
                          ) : (
                            <div className="size-full bg-zinc-100 flex items-center justify-center">
                              <UserCheck className="h-10 w-10 text-zinc-300" />
                            </div>
                          )}
                        </div>
                        <div className="absolute left-[76px] top-[88px] bg-[#29c9ff] rounded-full p-1.5 flex items-center justify-center">
                          <Check className="size-3 text-white" strokeWidth={3} />
                        </div>
                      </div>

                      <p className="font-bold text-[16px] text-[#0f1729] text-center leading-[28px]">
                        {driver.name}
                      </p>

                      <p className="font-medium text-[14px] text-[#29c9ff] text-center">
                        {driver.location}
                      </p>

                      <p className="italic text-[14px] text-[#65758b] text-center leading-[1.3]">
                        &ldquo;{driver.quote}&rdquo;
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {totalItems > currentVisible && (
              <div className="flex gap-2 items-center">
                <button
                  onClick={prev}
                  disabled={offset === 0}
                  className={cn(
                    "flex items-center justify-center w-[61px] py-2 rounded-[200px] transition-colors",
                    offset === 0
                      ? "bg-[#eaeaea] opacity-50 cursor-not-allowed"
                      : "bg-[#eaeaea] hover:bg-[#ddd]"
                  )}
                >
                  <ArrowLeft className="size-6 text-[#222]" />
                </button>

                <div className="relative h-[6px] w-[170px] bg-[#e8e8e8] rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-[#27c7ff] rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.max(100 / (maxOffset + 1), 30)}%`,
                      left: `${progressPercent * (1 - Math.max(100 / (maxOffset + 1), 30) / 100)}%`,
                    }}
                  />
                </div>

                <button
                  onClick={next}
                  disabled={offset >= maxOffset}
                  className={cn(
                    "flex items-center justify-center w-[61px] py-2 rounded-[200px] transition-colors",
                    offset >= maxOffset
                      ? "bg-[#27c7ff] opacity-50 cursor-not-allowed"
                      : "bg-[#27c7ff] hover:bg-[#20b8ef]"
                  )}
                >
                  <ArrowRight className="size-6 text-white" />
                </button>
              </div>
            )}
          </div>
        )}

        <div className="w-full bg-[#fafafa] rounded-[24px] py-6 px-4 md:py-8 md:px-6 flex flex-col items-center gap-4">
          <h3 className="text-[18px] md:text-[24px] font-bold text-[#222] text-center">
            {t("verificationTitle")}
          </h3>

          <div className="w-full flex flex-nowrap items-center justify-center gap-1 sm:gap-2 md:gap-4 min-w-0">
            {verificationSteps.map((step, index) => (
              <div key={step.labelKey} className="flex flex-nowrap items-center min-w-0 flex-1 justify-center max-w-[140px] md:max-w-none">
                <div className="flex flex-col items-center gap-1.5 md:gap-2 min-w-0 flex-1">
                  <div className="size-10 md:size-12 rounded-full bg-[rgba(41,201,255,0.1)] flex items-center justify-center shrink-0">
                    <step.icon className="size-5 md:size-6 text-[#29c9ff]" />
                  </div>
                  <p className="text-[11px] sm:text-[12px] md:text-[14px] font-medium text-[#65758b] text-center leading-tight">
                    {t(`verification.${step.labelKey}`)}
                  </p>
                </div>
                {index < verificationSteps.length - 1 && (
                  <ArrowRight className="size-4 md:size-5 text-[#29c9ff] shrink-0 mx-0.5 md:mx-1" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
