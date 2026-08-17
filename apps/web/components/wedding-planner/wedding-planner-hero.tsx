"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import { ArrowRight } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { useEnterAnimation } from "@/hooks/use-enter-animation"
import {
  WeddingTrustStrip,
  WeddingTrustStripMobile,
} from "@/components/shared/wedding-trust-strip"

const SERIF_FONT = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const
const SANS_FONT = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const

const REVIEW_AVATARS = [
  { src: "/schools/avatar-1.png", alt: "Reviewer 1" },
  { src: "/schools/avatar-2.png", alt: "Reviewer 2" },
  { src: "/schools/avatar-3.png", alt: "Reviewer 3" },
] as const

function HeroPill({ label }: { label: string }) {
  return (
    <div className="inline-flex items-center bg-[rgba(201,169,110,0.12)] border border-[rgba(201,169,110,0.25)] px-[9px] py-[7px]">
      <span
        className="text-[12px] font-medium uppercase tracking-[1.8px] text-[#a08248] whitespace-pre"
        style={SANS_FONT}
      >
        {label}
      </span>
    </div>
  )
}

function AvatarStack() {
  return (
    <div className="relative h-10 w-[104px] shrink-0">
      {REVIEW_AVATARS.map((a, i) => (
        <span
          key={a.src}
          className="absolute top-0 size-10 rounded-full border border-white overflow-hidden"
          style={{ left: `${3 + i * 30.5}px` }}
        >
          <Image src={a.src} alt={a.alt} fill className="object-cover" sizes="40px" />
        </span>
      ))}
    </div>
  )
}

function PrimaryCta({ label, full }: { label: string; full?: boolean }) {
  return (
    <a
      href="https://www.easytransferportugal.com/hotels/candidatura"
      target="_blank"
      rel="noopener noreferrer"
      className={
        "h-12 inline-flex items-center justify-center bg-[#a08248] hover:bg-[#8a6f3c] transition-colors px-6 cursor-pointer " +
        (full ? "w-full" : "")
      }
    >
      <span
        className="px-2 text-[14px] font-medium uppercase tracking-[1.1px] text-white"
        style={SANS_FONT}
      >
        {label}
      </span>
      <ArrowRight className="size-[14px] text-white" strokeWidth={2} />
    </a>
  )
}

function SecondaryCta({ label, full }: { label: string; full?: boolean }) {
  return (
    <a
      href="#wedding-revenue-calculator"
      className={
        "h-12 inline-flex items-center justify-center border border-[#999] text-[#999] hover:border-white hover:text-white transition-colors px-6 cursor-pointer " +
        (full ? "w-full" : "")
      }
    >
      <span
        className="px-2 text-[14px] font-medium uppercase tracking-[1.1px]"
        style={SANS_FONT}
      >
        {label}
      </span>
      <ArrowRight className="size-[14px]" strokeWidth={2} />
    </a>
  )
}

export function WeddingPlannerHero() {
  const t = useTranslations("weddingPlanner.hero")
  const { enter } = useEnterAnimation()

  const trustProps = {
    excellent: t("excellentRating"),
    verifiedBy: t("verifiedBy"),
    fromReviews: t("fromReviews"),
    poweredBy: t("poweredBy"),
  }

  return (
    <section className="bg-[#111110] relative overflow-hidden">
      {/* Mobile */}
      <div className="md:hidden px-4 pt-6 pb-10 flex flex-col gap-6">
        <div className="relative h-[358px] w-full overflow-hidden">
          <Image
            src="/planners/hero-bride.webp"
            alt={t("photoAlt")}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[35%_center]"
          />
        </div>

        <div className="flex flex-col gap-5 items-start">
          <div className={cn("flex flex-col gap-5 items-start w-full", enter("delay-0"))}>
            <HeroPill label={t("pill")} />
            <h1 className="text-[40px] leading-[1.1] font-normal text-[#f7f4ef]" style={SERIF_FONT}>
              {t("titleLine1")} {t("titleBefore")}{" "}
              <span className="italic text-[#c9a96e]">{t("titleAccent")}</span>{" "}
              {t("titleAfter")}
            </h1>
          </div>

          <p className={cn("text-[18px] leading-[1.3] text-[#999] max-w-[420px]", enter("delay-200"))} style={SANS_FONT}>
            {t("subtitle")}
          </p>

          <div className={cn("w-full", enter("delay-[300ms]"))}>
            <WeddingTrustStripMobile labels={trustProps} tone="dark" />
          </div>

          <div className={cn("flex flex-col gap-2 w-full", enter("delay-[400ms]"))}>
            <SecondaryCta label={t("ctaSecondary")} full />
            <PrimaryCta label={t("ctaPrimary")} full />
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block relative h-[800px]">
        <div className="absolute top-0 right-0 h-[800px] w-[1058px] overflow-hidden pointer-events-none">
          <Image
            src="/planners/hero-bride.webp"
            alt={t("photoAlt")}
            fill
            priority
            sizes="1058px"
            className="object-cover"
            style={{ objectPosition: "30% center" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, #111110 0%, rgba(17,17,16,0.7) 24%, rgba(17,17,16,0) 54%)",
            }}
          />
        </div>

        <div className="relative w-full max-w-[1440px] mx-auto h-[800px] flex items-center pl-12">
          <div className="flex-1 min-w-0 max-w-[640px] h-full flex flex-col gap-5 items-start justify-center py-20">
            <div className={cn("flex flex-col gap-5 items-start w-full", enter("delay-0"))}>
              <HeroPill label={t("pill")} />
              <h1 className="flex flex-col font-normal text-[#f7f4ef]" style={SERIF_FONT}>
                <span className="text-[54px] min-[1440px]:text-[64px] leading-[1.05]">{t("titleLine1")}</span>
                <span className="text-[54px] min-[1440px]:text-[64px] leading-[1.05]">
                  {t("titleBefore")} <span className="italic text-[#c9a96e]">{t("titleAccent")}</span>
                </span>
                <span className="text-[54px] min-[1440px]:text-[64px] leading-[1.05]">{t("titleAfter")}</span>
              </h1>
            </div>

            <p className={cn("text-[18px] leading-[1.3] text-[#999] max-w-[534px]", enter("delay-200"))} style={SANS_FONT}>
              {t("subtitle")}
            </p>

            <div className={enter("delay-[300ms]")}>
              <WeddingTrustStrip labels={trustProps} tone="dark" />
            </div>

            <div className={cn("flex items-center gap-3", enter("delay-[400ms]"))}>
              <PrimaryCta label={t("ctaPrimary")} />
              <SecondaryCta label={t("ctaSecondary")} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
