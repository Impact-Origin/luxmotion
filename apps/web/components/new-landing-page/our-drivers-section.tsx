"use client"

import { useCallback, useState } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import {
  ChevronLeft,
  ChevronRight,
  ListChecks,
  Search,
  CircleAlert,
  Check,
} from "lucide-react"
import { useSwipe } from "@/hooks/use-swipe"

type Driver = {
  id: string
  name: string
  image: string
  description: string
  vehicle: string
  languages: string
  rating: string
  rides: number
}

const DRIVERS: readonly Driver[] = [
  {
    id: "miguel",
    name: "Miguel",
    image: "/drivers/miguel.png",
    description:
      "100% Lisbonense and passionate about showing guests the Portugal that hotel brochures miss. He knows the finest restaurant tables, the quietest coastal roads, and the exact moment the light hits the Tagus.",
    vehicle: "Mercedes S-Class",
    languages: "English, Portuguese, Spanish",
    rating: "4.98",
    rides: 1615,
  },
  {
    id: "rui",
    name: "Rui",
    image: "/drivers/miguel.png",
    description:
      "Porto-born wine enthusiast who has been guiding visitors through the Douro valley for over a decade. Rui's easygoing style makes long transfers feel like conversations with an old friend.",
    vehicle: "Mercedes V-Class",
    languages: "English, Portuguese, French",
    rating: "4.96",
    rides: 1247,
  },
  {
    id: "tiago",
    name: "Tiago",
    image: "/drivers/miguel.png",
    description:
      "Born and raised in the Algarve, Tiago knows every hidden cove and sunset viewpoint along the southern coast. Punctual, discreet, and fluent in the art of making every ride memorable.",
    vehicle: "Mercedes E-Class",
    languages: "English, Portuguese, German",
    rating: "4.99",
    rides: 2103,
  },
] as const

const VETTING_STEPS = [
  { key: "step1", icon: ListChecks, gold: false },
  { key: "step2", icon: Search, gold: false },
  { key: "step3", icon: CircleAlert, gold: false },
  { key: "step4", icon: Check, gold: true },
] as const

export function OurDriversSection() {
  const t = useTranslations("drivers")
  const [current, setCurrent] = useState(0)
  const total = DRIVERS.length

  const goPrev = useCallback(() => {
    setCurrent((c) => (c > 0 ? c - 1 : c))
  }, [])

  const goNext = useCallback(() => {
    setCurrent((c) => (c < total - 1 ? c + 1 : c))
  }, [total])

  const swipeHandlers = useSwipe(goNext, goPrev)

  return (
    <section id="drivers" className="bg-[#0D0D0D] pt-10 pb-16">
      <div className="max-w-[1280px] mx-auto px-4 flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex items-center gap-2"
            style={{ fontFamily: "var(--font-sans), Inter, sans-serif" }}
          >
            <div className="w-[42.5px] h-px bg-[#C9A96E]" />
            <span className="text-[12px] font-semibold tracking-[2px] uppercase text-[#C9A96E] leading-none">
              {t("sectionLabel")}
            </span>
            <div className="w-[42.5px] h-px bg-[#C9A96E]" />
          </div>
          <h2
            className="flex flex-col items-center text-center text-[36px] sm:text-[40px] lg:text-[48px] leading-none tracking-[0.52px] font-light"
            style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif" }}
          >
            <span className="text-white">{t("titlePart1")}</span>
            <span className="text-[#C9A96E] italic">{t("titlePart2")}</span>
          </h2>
        </div>

        <div
          className="relative w-full max-w-[1080px] mt-4"
          {...swipeHandlers}
        >
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {DRIVERS.map((driver) => (
                <DriverSlide
                  key={driver.id}
                  driver={driver}
                  vehicleLabel={t("vehicle")}
                  languagesLabel={t("languages")}
                  ridesLabel={t("rides")}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={goPrev}
            aria-label={t("prevDriver")}
            className={`absolute left-0 lg:left-0 top-1/2 -translate-y-1/2 size-9 rounded-full bg-[#0D0D0D] border border-[rgba(201,169,110,0.5)] flex items-center justify-center text-[#C9A96E] transition hover:bg-[rgba(201,169,110,0.1)] ${
              current === 0 ? "opacity-0 pointer-events-none" : ""
            }`}
          >
            <ChevronLeft className="size-[14px]" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label={t("nextDriver")}
            className={`absolute right-0 lg:right-0 top-1/2 -translate-y-1/2 size-9 rounded-full bg-[#0D0D0D] border border-[rgba(201,169,110,0.5)] flex items-center justify-center text-[#C9A96E] transition hover:bg-[rgba(201,169,110,0.1)] ${
              current === total - 1 ? "opacity-0 pointer-events-none" : ""
            }`}
          >
            <ChevronRight className="size-[14px]" strokeWidth={2} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {DRIVERS.map((driver, i) => (
            <button
              key={driver.id}
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`${t("goToDriver")} ${i + 1}`}
              className={`h-[6px] rounded-[3px] transition-all duration-300 ${
                i === current
                  ? "w-5 bg-[#C9A96E]"
                  : "w-[6px] bg-[rgba(201,169,110,0.5)]"
              }`}
            />
          ))}
        </div>

        <div className="w-full max-w-[960px] mt-4">
          <div className="bg-[rgba(201,169,110,0.08)] border border-[rgba(201,169,110,0.2)] px-6 sm:px-10 lg:px-[48.8px] py-8 lg:py-[40.8px] flex flex-col lg:flex-row gap-8 lg:gap-12 items-center justify-center">
            <div className="w-full lg:w-[272px] lg:shrink-0 text-center lg:text-left">
              <p className="text-[14px] font-semibold text-white leading-[21px]">
                {t("vettingHeading")}
              </p>
              <p className="italic text-[12px] text-[#C9A96E] leading-[25.2px] mt-1">
                {t("vettingSubtext")}
              </p>
            </div>
            <div className="w-full lg:w-[574px] lg:shrink-0 relative flex justify-between items-start gap-2 sm:gap-4">
              <div className="hidden sm:block absolute top-[22px] lg:top-[28px] left-[12.5%] right-[12.5%] h-0 border-t-2 border-dashed border-[#C9A96E]" />
              {VETTING_STEPS.map((step) => {
                const Icon = step.icon
                return (
                  <div
                    key={step.key}
                    className="flex-1 flex flex-col items-center gap-3 relative z-10"
                  >
                    <div
                      className={`size-11 sm:size-12 lg:size-14 rounded-full border-2 border-[rgba(201,169,110,0.25)] flex items-center justify-center shrink-0 ${
                        step.gold ? "bg-[#C9A96E]" : "bg-white"
                      }`}
                    >
                      <Icon
                        className={`size-5 lg:size-6 ${
                          step.gold ? "text-white" : "text-[#C9A96E]"
                        }`}
                        strokeWidth={2}
                      />
                    </div>
                    <p className="text-[11px] lg:text-[12px] text-[#999] text-center leading-[1.2] max-w-[90px]">
                      {t(step.key)}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function DriverSlide({
  driver,
  vehicleLabel,
  languagesLabel,
  ridesLabel,
}: {
  driver: Driver
  vehicleLabel: string
  languagesLabel: string
  ridesLabel: string
}) {
  return (
    <div className="w-full shrink-0 px-12 sm:px-16">
      <div className="mx-auto max-w-[960px] flex flex-col lg:flex-row items-center lg:items-center gap-8 lg:gap-0">
        <div className="relative w-[280px] sm:w-[320px] lg:w-[380px] h-[300px] lg:h-[340px] flex items-center justify-center shrink-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+15px)] size-[260px] rounded-full bg-[rgba(201,169,110,0.07)] border border-[rgba(201,169,110,0.2)]" />
          <div
            className="relative w-[200px] sm:w-[220px] h-[280px] sm:h-[300px] border border-[#C9A96E] overflow-hidden z-10"
            style={{
              borderTopLeftRadius: "100px",
              borderTopRightRadius: "100px",
              backgroundImage:
                "linear-gradient(rgba(15, 15, 15, 1) 0%, rgba(25, 25, 25, 1) 87.98%, rgba(201, 169, 110, 0.1) 94.71%)",
            }}
          >
            <Image
              src={driver.image}
              alt={driver.name}
              fill
              sizes="(max-width: 640px) 200px, 220px"
              className="object-cover object-top"
            />
          </div>
        </div>

        <div className="flex-1 lg:w-[580px] flex flex-col gap-[10px] items-center lg:items-start text-center lg:text-left">
          <h3
            className="text-[28px] lg:text-[32px] leading-[1.1] lg:leading-[36px] text-white"
            style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif" }}
          >
            {driver.name}
          </h3>
          <p className="text-[14px] leading-[1.3] text-[#999] max-w-[513px]">
            {driver.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 pt-4 items-center sm:items-start justify-center lg:justify-start w-full">
            <div className="flex items-center gap-2">
              <div className="relative w-16 h-12 shrink-0">
                <Image
                  src="/drivers/mercedes-s-class.png"
                  alt={driver.vehicle}
                  fill
                  sizes="64px"
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col gap-3 items-start">
                <span className="text-[12px] font-semibold tracking-[2px] uppercase text-white leading-none">
                  {vehicleLabel}
                </span>
                <span className="text-[14px] text-[#999] leading-none whitespace-nowrap">
                  {driver.vehicle}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 items-center sm:items-start">
              <span className="text-[12px] font-semibold tracking-[2px] uppercase text-white leading-none">
                {languagesLabel}
              </span>
              <span className="text-[14px] text-[#999] leading-none">
                {driver.languages}
              </span>
            </div>
          </div>

          <div className="mt-3">
            <div className="inline-flex items-center gap-[7px] px-4 py-2 bg-[rgba(201,169,110,0.08)] border border-[rgba(201,169,110,0.2)]">
              <span className="text-[12px] font-semibold text-[#C9A96E] leading-none">
                {driver.rating}
              </span>
              <span className="text-[12px] text-[#C9A96E] tracking-[2px] leading-none">
                ★★★★★
              </span>
              <span className="text-[12px] text-[#8c8680] tracking-[0.44px] leading-none">
                · {driver.rides.toLocaleString()} {ridesLabel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
