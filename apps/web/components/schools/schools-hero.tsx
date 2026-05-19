"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { ArrowRight, BadgeCheck, CircleCheckBig, Star } from "lucide-react"

const SERIF_FONT = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const
const SANS_FONT = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const

const HERO_GRADIENT =
  "linear-gradient(63.68deg, rgba(255, 255, 255, 0.34) 35.88%, rgba(201, 169, 110, 0.34) 100.48%)"

const REVIEW_AVATARS = [
  { src: "/schools/avatar-1.png", alt: "Reviewer 1" },
  { src: "/schools/avatar-2.png", alt: "Reviewer 2" },
  { src: "/schools/avatar-3.png", alt: "Reviewer 3" },
] as const

function HeroPill({ label }: { label: string }) {
  return (
    <div className="inline-flex items-center bg-[rgba(201,169,110,0.12)] border border-[rgba(201,169,110,0.25)] px-[9px] py-[7px]">
      <span
        className="text-[12px] font-medium uppercase tracking-[1.8px] text-[#a08248] whitespace-nowrap"
        style={SANS_FONT}
      >
        {label}
      </span>
    </div>
  )
}

function FeaturePill({ label }: { label: string }) {
  return (
    <div className="inline-flex items-center gap-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(154,117,53,0.22)] px-3 py-2 overflow-hidden">
      <CircleCheckBig className="size-4 text-[#a08248] shrink-0" strokeWidth={2} />
      <span
        className="text-[12px] font-medium text-[#a08248] whitespace-nowrap leading-none"
        style={SANS_FONT}
      >
        {label}
      </span>
    </div>
  )
}

function TrustDot({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-[7px]">
      <span className="size-[7px] rounded-full bg-[#27ae60] shrink-0" />
      <span
        className="text-[12px] font-medium text-[#696969] whitespace-nowrap leading-none"
        style={SANS_FONT}
      >
        {label}
      </span>
    </div>
  )
}

function TrustStrip({
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
      className="hidden md:flex h-[70px] items-center gap-3 px-4 py-3 bg-[rgba(255,255,255,0.06)] border border-[rgba(28,27,24,0.08)] w-max shrink-0"
      style={SANS_FONT}
    >
      <div className="flex flex-col gap-2 shrink-0">
        <span
          className="text-[14px] font-bold text-[#999] whitespace-nowrap leading-none"
          style={{ fontFamily: "Montserrat, var(--font-sans), sans-serif" }}
        >
          {excellent}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          <BadgeCheck className="size-4 text-[#00B67A] shrink-0" strokeWidth={2.2} />
          <span className="text-[12px] text-[#999] whitespace-nowrap shrink-0">{verifiedBy}</span>
          <Image
            src="/schools/trustpilot.svg"
            alt="Trustpilot"
            width={68}
            height={19}
            className="h-[18px] w-[68px] shrink-0"
          />
        </div>
      </div>

      <div className="flex items-center gap-[17px] pl-2 pr-4 py-2 rounded-full bg-[rgba(9,9,9,0.05)] backdrop-blur-[6.15px] shrink-0">
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
        <div className="flex flex-col gap-[2px] justify-center shrink-0">
          <span className="text-[14px] leading-[19.5px] text-[#696969] whitespace-nowrap">
            {fromReviews}
          </span>
          <div className="flex items-center gap-[2px] shrink-0">
            <span className="text-[14px] leading-[19.5px] text-[#696969]">4.9</span>
            <span className="text-[12px] leading-[16.5px] tracking-[0.33px] text-[#00B67A] whitespace-nowrap">
              ★★★★★
            </span>
          </div>
        </div>
      </div>

      <div className="h-full w-px bg-[rgba(28,27,24,0.08)] shrink-0" />

      <div className="flex flex-col gap-2 h-full justify-center shrink-0">
        <span className="text-[14px] leading-[19.5px] text-[#696969] whitespace-nowrap">
          {poweredBy}
        </span>
        <div className="flex items-center shrink-0">
          <Image
            src="/wedding/google-g.svg"
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
    </div>
  )
}

function PrimaryCta({ label, full }: { label: string; full?: boolean }) {
  return (
    <a
      href="#schools-quote"
      className={
        "h-12 inline-flex items-center justify-center bg-[#a08248] hover:bg-[#8a6f3c] hover:-translate-y-0.5 transition-[background-color,transform] duration-200 px-6 cursor-pointer " +
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
      href="#schools-process"
      className={
        "h-12 inline-flex items-center justify-center border border-[#999] hover:border-[#9A7535] hover:text-[#9A7535] transition-colors duration-200 px-6 cursor-pointer " +
        (full ? "w-full" : "")
      }
    >
      <span
        className="px-2 text-[14px] font-medium uppercase tracking-[1.1px] text-[#999]"
        style={SANS_FONT}
      >
        {label}
      </span>
      <ArrowRight className="size-[14px] text-[#999]" strokeWidth={2} />
    </a>
  )
}

export function SchoolsHero() {
  const t = useTranslations("schools.hero")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 80)
    return () => clearTimeout(timer)
  }, [])

  const fadeUp = (delay: string) =>
    `transition-all duration-500 ease-out ${delay} ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`

  const features = [
    t("featureBelts"),
    t("featureCamera"),
    t("featureGps"),
    t("featureInsurance"),
  ]
  const trustItems = [t("trustNoFees"), t("trustChaperone"), t("trustRealtime")]

  return (
    <section className="bg-white relative overflow-hidden">
      <div className="md:hidden flex flex-col">
        <div
          className="relative w-full h-[372px] overflow-hidden"
          style={{ backgroundImage: HERO_GRADIENT }}
        >
          <div
            className="absolute top-1/2 left-[24.72px] size-[418.199px] -translate-y-1/2"
          >
            <Image
              src="/schools/hero.png"
              alt={t("photoAlt")}
              fill
              priority
              sizes="418px"
              className="object-contain pointer-events-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 items-start px-4 py-6">
          <div className={fadeUp("")}>
            <HeroPill label={t("pill")} />
          </div>

          <h1 className={`text-[48px] leading-none text-[#0d0d0d] font-normal ${fadeUp("delay-100")}`} style={SERIF_FONT}>
            {t("title1")}{" "}
            <span className="italic text-[#a08248]">{t("titleAccent")}</span>{" "}
            {t("title2")} {t("title3")}
          </h1>

          <p className={`text-[18px] leading-[1.3] text-[#696969] ${fadeUp("delay-200")}`} style={SANS_FONT}>
            {t("subtitle")}
          </p>

          <div className={`grid grid-cols-2 gap-2 w-full ${fadeUp("delay-[300ms]")}`}>
            {features.map((label) => (
              <FeaturePill key={label} label={label} />
            ))}
          </div>

          <div className={`flex flex-col gap-3 w-full pt-1 ${fadeUp("delay-[400ms]")}`}>
            <SecondaryCta label={t("ctaSecondary")} full />
            <PrimaryCta label={t("ctaPrimary")} full />
          </div>

          <div className={`flex flex-wrap gap-x-4 gap-y-2 pt-1 ${fadeUp("delay-[500ms]")}`}>
            {trustItems.map((item) => (
              <TrustDot key={item} label={item} />
            ))}
          </div>
        </div>
      </div>

      <div className="hidden md:block relative">
        <div
          className="absolute top-0 right-0 h-full w-[42%] max-w-[820px] pointer-events-none"
          style={{ backgroundImage: HERO_GRADIENT }}
          aria-hidden
        />
        <div
          className="absolute top-0 right-0 h-full w-[42%] max-w-[820px] pointer-events-none"
          aria-hidden
        >
          <Image
            src="/schools/hero.png"
            alt={t("photoAlt")}
            fill
            priority
            sizes="(max-width: 1920px) 42vw, 820px"
            className="object-cover object-right pointer-events-none"
          />
        </div>

        <div className="relative max-w-[1280px] mx-auto px-4 md:px-[52px] py-16">
          <div className="flex flex-col gap-4 items-start justify-center w-[58%] pr-8">
            <div className={fadeUp("")}>
              <HeroPill label={t("pill")} />
            </div>

            <h1 className={`flex flex-col ${fadeUp("delay-100")}`} style={SERIF_FONT}>
              <span className="text-[56px] min-[1440px]:text-[82px] min-[1920px]:text-[56px] leading-none text-[#0d0d0d] font-normal whitespace-nowrap">
                {t("title1")}
              </span>
              <span className="text-[56px] min-[1440px]:text-[82px] min-[1920px]:text-[56px] leading-none text-[#0d0d0d] font-normal whitespace-nowrap">
                <span className="italic text-[#a08248]">{t("titleAccent")}</span> {t("title2")}
              </span>
              <span className="text-[56px] min-[1440px]:text-[82px] min-[1920px]:text-[56px] leading-none text-[#0d0d0d] font-normal whitespace-nowrap">
                {t("title3")}
              </span>
            </h1>

            <p
              className={`text-[18px] leading-[1.3] text-[#696969] max-w-[560px] ${fadeUp("delay-200")}`}
              style={SANS_FONT}
            >
              {t("subtitle")}
            </p>

            <div className={`flex flex-wrap gap-2 ${fadeUp("delay-[300ms]")}`}>
              {features.map((label) => (
                <FeaturePill key={label} label={label} />
              ))}
            </div>

            <div className={`flex flex-col gap-4 w-full ${fadeUp("delay-[500ms]")}`}>
              <div className="flex items-center gap-3">
                <PrimaryCta label={t("ctaPrimary")} />
                <SecondaryCta label={t("ctaSecondary")} />
              </div>
              <div className="flex flex-wrap gap-x-[18px] gap-y-2">
                {trustItems.map((item) => (
                  <TrustDot key={item} label={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
