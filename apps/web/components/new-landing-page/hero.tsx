"use client"

import { Plane, Phone, ShieldCheck } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { BookingWidget } from "./booking-widget"
import { useMarketingStats } from "@/hooks/use-marketing-stats"

function SocialProofBar() {
  const t = useTranslations("hero")
  const { trustpilotReviewCount } = useMarketingStats()

  const stars = Array.from({ length: 5 }).map((_, i) => (
    <Image key={i} src="/svgs/star-rounded.svg" alt="" width={17} height={17} />
  ))

  return (
    <div className="self-start w-full lg:w-fit bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)] flex flex-col lg:flex-row lg:h-[70px] gap-4 lg:gap-3 items-start lg:items-center px-4 py-3">
      <div className="flex items-start gap-6 w-full lg:w-auto">
        <div className="flex flex-col gap-2 shrink-0">
          <span className="text-[14px] font-bold text-white leading-normal">
            {t("excellentRating")}
          </span>
          <div className="flex items-center gap-2">
            <Image src="/svgs/verified-badge.svg" alt="" width={16} height={16} />
            <span className="text-[14px] text-[rgba(255,255,255,0.45)]">
              {t("verifiedBy")}
            </span>
            <Image
              src="/svgs/trustpilot-logo.svg"
              alt="Trustpilot"
              width={69}
              height={19}
              className="h-[19px] w-auto"
            />
          </div>
        </div>

        <div className="self-stretch border-l border-[rgba(255,255,255,0.12)] lg:hidden" />

        <div className="flex flex-col gap-2 flex-1 lg:hidden">
          <span className="text-[14px] text-[rgba(255,255,255,0.45)]">
            {t("poweredBy")}
          </span>
          <div className="flex items-center">
            <Image src="/svgs/google-icon.svg" alt="Google" width={15} height={15} />
            {stars}
          </div>
        </div>
      </div>

      <div className="backdrop-blur-[6px] bg-[rgba(255,255,255,0.05)] flex items-center gap-[17px] pl-2 pr-4 py-2 rounded-[58px]">
        <div className="relative h-10 w-[104px] shrink-0">
          {["/reviewer-1.png", "/reviewer-2.png", "/reviewer-3.png"].map(
            (src, i) => (
              <div
                key={src}
                className="absolute top-[0.5px] size-10 rounded-full border border-white overflow-hidden"
                style={{ left: `${3 + i * 30.5}px` }}
              >
                <Image src={src} alt="" fill className="object-cover" />
              </div>
            )
          )}
        </div>
        <div className="flex flex-col gap-0.5 text-[rgba(255,255,255,0.45)]">
          <span className="text-[14px] leading-[19.5px]">
            {t("fromReviews", { count: trustpilotReviewCount })}
          </span>
          <div className="flex items-center gap-0.5">
            <span className="text-[14px] leading-[19.5px]">4.9</span>
            <span className="text-[12px] leading-[16.5px] tracking-[0.33px]">
              ★★★★★
            </span>
          </div>
        </div>
      </div>

      <div className="hidden lg:block h-[46px] border-l border-[rgba(255,255,255,0.12)]" />

      <div className="hidden lg:flex flex-col gap-2 shrink-0">
        <span className="text-[14px] text-[rgba(255,255,255,0.45)]">
          {t("poweredBy")}
        </span>
        <div className="flex items-center">
          <Image src="/svgs/google-icon.svg" alt="Google" width={15} height={15} />
          {stars}
        </div>
      </div>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="relative flex-1 flex items-center gap-4 px-12 py-6 lg:p-6 lg:justify-center group cursor-default overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[rgba(201,169,110,0.06)] opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100" />
      <div className="absolute top-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#C9A96E] to-[rgba(201,169,110,0.4)] transition-all duration-300 ease-out group-hover:w-full" />
      <div className="relative shrink-0 flex items-center justify-center p-4 rounded-full bg-[rgba(201,169,110,0.08)] border-2 border-[rgba(201,169,110,0.25)] transition-all duration-300 group-hover:border-[#C9A96E] group-hover:shadow-[0_0_16px_rgba(201,169,110,0.2)] group-hover:bg-[rgba(201,169,110,0.12)]">
        {icon}
      </div>
      <p className="relative text-[16px] leading-[1.3] text-[rgba(255,255,255,0.55)] transition-colors duration-300 group-hover:text-[rgba(255,255,255,0.8)]">
        {title}
        <br />
        {description}
      </p>
    </div>
  )
}

export function Hero() {
  const t = useTranslations("hero")

  return (
    <section className="relative bg-[#0D0D0D]">
      <div className="absolute top-0 right-0 w-[42%] aspect-[4096/3223] hidden lg:block">
        <Image
          src="/hero-bg.png"
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="relative lg:hidden overflow-hidden h-[320px]">
        <Image
          src="/hero-bg.png"
          alt=""
          fill
          className="object-cover object-[center_30%]"
          priority
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(transparent 20%, rgba(13,13,13,0.6) 65%, rgb(13,13,13) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 lg:px-12 lg:pt-[128px] lg:pb-[96px] -mt-10 lg:mt-0 flex flex-col gap-6 lg:gap-12">
        <div className="max-w-[680px] flex flex-col gap-6 lg:gap-9">
          <div className="flex items-center gap-2">
            <div className="h-px bg-[#C9A96E] w-[60px] lg:w-[82px]" />
            <span className="text-[12px] font-semibold uppercase tracking-[2px] text-[#C9A96E] whitespace-nowrap">
              {t("label")}
            </span>
          </div>

          <h1>
            <span
              className="text-white text-[48px] lg:text-[96px] leading-[1.2] lg:leading-none block"
              style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif" }}
            >
              Portugal,
            </span>
            <span
              className="italic text-[#C9A96E] text-[48px] lg:text-[96px] leading-[1.2] lg:leading-none block"
              style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif" }}
            >
              {t("titleHighlight")}
            </span>
          </h1>

          <p className="text-[18px] font-light leading-[1.3] text-[#999] max-w-[591px]">
            {t("description")}
          </p>

          <SocialProofBar />
        </div>

        <div id="booking" className="w-full scroll-mt-24">
          <BookingWidget />
        </div>

        <div className="flex flex-col lg:flex-row border border-[rgba(255,255,255,0.12)] divide-y lg:divide-y-0 lg:divide-x divide-[rgba(255,255,255,0.12)]">
          <FeatureCard
            icon={<Plane className="size-6 text-[#C9A96E]" />}
            title={t("flightMonitoring")}
            description={t("flightMonitoringDesc")}
          />
          <FeatureCard
            icon={<Phone className="size-6 text-[#C9A96E]" />}
            title={t("conciergeSupport")}
            description={t("conciergeSupportDesc")}
          />
          <FeatureCard
            icon={<ShieldCheck className="size-6 text-[#C9A96E]" />}
            title={t("privateTransfers")}
            description={t("privateTransfersDesc")}
          />
        </div>
      </div>
    </section>
  )
}
