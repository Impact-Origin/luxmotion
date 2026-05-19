"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import { ArrowRight, BadgeCheck, Star } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { useEnterAnimation } from "@/hooks/use-enter-animation"

const SERIF_FONT = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const
const SANS_FONT = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const

const REVIEW_AVATARS = [
  { src: "/wedding-planner/avatar-1.png", alt: "Reviewer 1" },
  { src: "/wedding-planner/avatar-2.png", alt: "Reviewer 2" },
  { src: "/wedding-planner/avatar-3.png", alt: "Reviewer 3" },
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

function ReviewBadge({ fromReviews }: { fromReviews: string }) {
  return (
    <div className="flex items-center gap-[17px] pl-2 pr-4 py-2 rounded-full bg-[rgba(255,255,255,0.05)] backdrop-blur-[6.15px] shrink-0">
      <AvatarStack />
      <div className="flex flex-col gap-[2px] justify-center shrink-0 text-[rgba(255,255,255,0.45)]">
        <span className="text-[14px] leading-[19.5px] whitespace-nowrap">{fromReviews}</span>
        <div className="flex items-center gap-[2px] shrink-0">
          <span className="text-[14px] leading-[19.5px]">4.9</span>
          <span className="text-[12px] leading-[16.5px] tracking-[0.33px] whitespace-nowrap">
            ★★★★★
          </span>
        </div>
      </div>
    </div>
  )
}

function ExcellentBlock({ excellent, verifiedBy }: { excellent: string; verifiedBy: string }) {
  return (
    <div className="flex flex-col gap-2 shrink-0">
      <span
        className="text-[14px] font-bold text-white whitespace-nowrap leading-none"
        style={{ fontFamily: "Montserrat, var(--font-sans), sans-serif" }}
      >
        {excellent}
      </span>
      <div className="flex items-center gap-2 shrink-0">
        <BadgeCheck className="size-4 text-[#00B67A] shrink-0" strokeWidth={2.2} />
        <span className="text-[14px] text-[rgba(255,255,255,0.45)] whitespace-nowrap shrink-0">
          {verifiedBy}
        </span>
        <Image
          src="/wedding-planner/trustpilot.svg"
          alt="Trustpilot"
          width={68}
          height={19}
          className="h-[18px] w-[68px] shrink-0"
        />
      </div>
    </div>
  )
}

function PoweredBlock({ poweredBy }: { poweredBy: string }) {
  return (
    <div className="flex flex-col gap-2 h-full justify-center shrink-0">
      <span className="text-[14px] leading-[19.5px] text-[rgba(255,255,255,0.45)] whitespace-nowrap">
        {poweredBy}
      </span>
      <div className="flex items-center shrink-0">
        <Image
          src="/wedding-planner/google-g.svg"
          alt="Google"
          width={15}
          height={15}
          className="size-[14.5px] object-contain shrink-0 mr-[1px]"
        />
        {[0, 1, 2, 3, 4].map((i) => (
          <Star
            key={i}
            className="size-[17.5px] text-[#FBBC05] shrink-0"
            fill="#FBBC05"
            strokeWidth={0}
          />
        ))}
      </div>
    </div>
  )
}

function TrustStripDesktop({
  excellent,
  verifiedBy,
  fromReviews,
  poweredBy,
}: {
  excellent: string
  verifiedBy: string
  fromReviews: string
  poweredBy: string
}) {
  return (
    <div
      className="hidden md:flex h-[70px] items-center gap-3 px-4 py-3 bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)] w-max shrink-0"
      style={SANS_FONT}
    >
      <ExcellentBlock excellent={excellent} verifiedBy={verifiedBy} />
      <ReviewBadge fromReviews={fromReviews} />
      <div className="h-full w-px bg-[rgba(255,255,255,0.12)] shrink-0" />
      <PoweredBlock poweredBy={poweredBy} />
    </div>
  )
}

function TrustStripMobile({
  excellent,
  verifiedBy,
  fromReviews,
  poweredBy,
}: {
  excellent: string
  verifiedBy: string
  fromReviews: string
  poweredBy: string
}) {
  return (
    <div
      className="flex md:hidden flex-col gap-4 w-full bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)] px-4 py-3"
      style={SANS_FONT}
    >
      <div className="flex items-start gap-6 w-full">
        <ExcellentBlock excellent={excellent} verifiedBy={verifiedBy} />
        <div className="self-stretch w-px bg-[rgba(255,255,255,0.12)] shrink-0" />
        <PoweredBlock poweredBy={poweredBy} />
      </div>
      <ReviewBadge fromReviews={fromReviews} />
    </div>
  )
}

function PrimaryCta({ label, full }: { label: string; full?: boolean }) {
  return (
    <a
      href="/partners/apply?type=wedding"
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

  return (
    <section className="bg-[#111110] relative overflow-hidden">
      <div className="md:hidden flex flex-col">
        <div className="relative w-full h-[359px] overflow-hidden">
          <Image
            src="/wedding-planner/hero-bride.png"
            alt={t("photoAlt")}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[35%_center]"
          />
        </div>

        <div className="flex flex-col gap-6 items-start px-4 py-6">
          <div className={cn("flex flex-col gap-2 items-start w-full", enter("delay-0"))}>
            <HeroPill label={t("pill")} />
            <h1
              className="text-[48px] leading-none font-normal text-[#f7f4ef] pt-1"
              style={SERIF_FONT}
            >
              {t("titleLine1")} {t("titleBefore")}{" "}
              <span className="italic text-[#c9a96e]">{t("titleAccent")}</span>{" "}
              {t("titleAfter")}
            </h1>
          </div>

          <p className={cn("text-[18px] leading-[1.3] text-[#999] max-w-[520px]", enter("delay-200"))} style={SANS_FONT}>
            {t("subtitle")}
          </p>

          <div className={cn("flex flex-col gap-2 w-full", enter("delay-[400ms]"))}>
            <SecondaryCta label={t("ctaSecondary")} full />
            <PrimaryCta label={t("ctaPrimary")} full />
          </div>
        </div>
      </div>

      <div className="hidden md:flex items-stretch">
        <div className="flex-1 min-w-0 pl-[16vw] pr-8 max-w-[1100px] flex flex-col gap-6 items-start justify-center py-12">
          <div className={cn("flex flex-col gap-2 items-start", enter("delay-0"))}>
            <HeroPill label={t("pill")} />
            <h1
              className="flex flex-col text-[#f7f4ef] font-normal pt-1 max-w-[600px]"
              style={SERIF_FONT}
            >
              <span className="text-[56px] leading-[53.76px]">{t("titleLine1")}</span>
              <span className="text-[56px] leading-[53.76px]">
                {t("titleBefore")} <span className="text-[#c9a96e]">{t("titleAccent")}</span>{" "}
                {t("titleAfter")}
              </span>
            </h1>
          </div>

          <p className={cn("text-[18px] leading-[1.3] text-[#999] max-w-[520px]", enter("delay-200"))} style={SANS_FONT}>
            {t("subtitle")}
          </p>

          <div className={cn("flex items-center gap-3", enter("delay-[400ms]"))}>
            <PrimaryCta label={t("ctaPrimary")} />
            <SecondaryCta label={t("ctaSecondary")} />
          </div>
        </div>

        <div className="relative w-[55%] min-w-[600px] max-w-[1000px] aspect-[1080/720] shrink-0 ml-auto">
          <Image
            src="/wedding-planner/hero-bride.png"
            alt={t("photoAlt")}
            fill
            priority
            sizes="(min-width: 1600px) 1000px, 55vw"
            className="object-cover object-[40%_center]"
          />
        </div>
      </div>
    </section>
  )
}
