"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import { Check } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { cn } from "@workspace/ui/lib/utils"

const SERIF_FONT = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const
const SANS_FONT = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const

const FEATURES = [1, 2, 3, 4] as const

function FeatureRow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2">
      <Check
        className="size-[14px] text-[#4ade80] shrink-0"
        strokeWidth={2.5}
      />
      <span
        className="text-[14px] leading-[1.2] text-[#696969]"
        style={SANS_FONT}
      >
        {label}
      </span>
    </div>
  )
}

export function WeddingPlannerWhiteLabel() {
  const t = useTranslations("weddingPlanner.whiteLabel")
  const { ref, revealFromLeft, revealFromRight } = useScrollReveal<HTMLElement>()

  return (
    <section ref={ref} className="bg-[#f7f4ef] px-4 md:px-[82px] pt-12 md:pt-[71px] pb-12 md:pb-[72px]">
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row md:items-center gap-8 md:gap-10">
        <div className={cn("flex-1 min-w-0 flex flex-col gap-2 items-start", revealFromLeft())}>
          <div className="flex items-center gap-2">
            <div className="w-[82px] h-px bg-[#a08248]" />
            <span
              className="text-[12px] font-semibold uppercase tracking-[2px] text-[#a08248] whitespace-nowrap"
              style={SANS_FONT}
            >
              {t("eyebrow")}
            </span>
          </div>

          <h2
            className="text-[32px] md:text-[48px] leading-none text-[#1c1b18] font-normal"
            style={SERIF_FONT}
          >
            {t("titleStart")}{" "}
            <span className="italic text-[#a08248]">{t("titleAccent")}</span>
          </h2>

          <p
            className="pt-[3px] text-[14px] leading-[1.2] text-[#696969]"
            style={SANS_FONT}
          >
            {t("body1")}
          </p>
          <p
            className="pt-[3px] text-[14px] leading-[1.2] text-[#696969]"
            style={SANS_FONT}
          >
            {t("body2")}
          </p>

          <div className="flex flex-col gap-[7.5px] pt-2 w-full">
            {FEATURES.map((n) => (
              <FeatureRow key={n} label={t(`feat${n}`)} />
            ))}
          </div>
        </div>

        <div className={cn("flex-1 min-w-0 self-stretch min-h-[260px] md:min-h-[340px] relative border border-[rgba(28,27,24,0.08)]", revealFromRight("delay-150"))}>
          <Image
            src="/wedding-planner/white-label/toast.png"
            alt={t("photoAlt")}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  )
}
