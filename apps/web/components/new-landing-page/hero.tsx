"use client"

import { Plane, Phone, ShieldCheck, BadgeCheck } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { cn } from "@workspace/ui/lib/utils"
import { BookingWidget } from "./booking-widget"
import { useEnterAnimation } from "@/hooks/use-enter-animation"

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

const REVIEW_COUNT = 387

const SOCIAL_AVATARS = ["/reviews/review-1.png", "/reviews/review-2.png", "/reviews/review-3.png"]

export function SocialProofBar() {
  const t = useTranslations("hero")

  return (
    <div className="flex flex-wrap lg:flex-nowrap items-center gap-6 border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.06)] px-7 py-2 w-fit lg:w-max">
      <div className="flex flex-col gap-2">
        <span className="text-[14px] font-bold text-white whitespace-nowrap">
          {t("excellentRating")}
        </span>
        <div className="flex items-center gap-2">
          <BadgeCheck className="size-4 text-[#00B67A]" />
          <span className="text-[14px] text-[rgba(255,255,255,0.45)] whitespace-nowrap">
            {t("verifiedBy")}
          </span>
          <Image
            src="/trustpilot-logo.svg"
            alt="Trustpilot"
            width={69}
            height={19}
            className="h-[18.6px] w-auto"
            unoptimized
          />
        </div>
      </div>

      <div className="flex items-center gap-[17px] rounded-[58px] bg-[rgba(255,255,255,0.05)] py-2 pl-2 pr-4 backdrop-blur-[6px]">
        <div className="relative h-10 w-[104px] shrink-0">
          {SOCIAL_AVATARS.map((src, i) => (
            <div
              key={src}
              className="absolute top-0 size-10 overflow-hidden rounded-full border border-white"
              style={{ left: `${i * 30.5 + 3}px` }}
            >
              <Image src={src} alt="" fill className="object-cover" sizes="40px" />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-[2px] text-[rgba(255,255,255,0.45)] whitespace-nowrap">
          <span className="text-[14px]">{t("fromReviews", { count: REVIEW_COUNT })}</span>
          <div className="flex items-center gap-[2px]">
            <span className="text-[14px]">4.9</span>
            <span className="text-[12px] tracking-[0.33px]">★★★★★</span>
          </div>
        </div>
      </div>

      <div className="h-[46px] w-px bg-[rgba(255,255,255,0.12)]" />

      <div className="flex flex-col gap-2">
        <span className="text-[14px] text-[rgba(255,255,255,0.45)] whitespace-nowrap">
          {t("poweredBy")}
        </span>
        <div className="flex items-center gap-[2px]">
          <Image src="/svgs/google-icon.svg" alt="Google" width={15} height={15} className="size-[15px]" />
          <span className="text-[16px] text-[#C9A96E] tracking-[0.5px]">★★★★★</span>
        </div>
      </div>
    </div>
  )
}

const WHITELABEL_BG = "linear-gradient(180deg, rgba(13,13,13,0.20) 0%, rgba(13,13,13,0.55) 50%, rgba(13,13,13,0.96) 82%, #0D0D0D 100%, #14100A 0%, #0D0D0D 60%, #0A0A08 100%)"

const WHITELABEL_DESCRIPTION =
  "O {{HOTEL_NAME}} tem o prazer de oferecer-lhe transfers privados e experiências à medida — reserva em menos de 60 segundos, preço fixo garantido."

export function Hero({ whitelabel = false }: { whitelabel?: boolean } = {}) {
  const t = useTranslations("hero")
  const { enter } = useEnterAnimation()

  return (
    <section
      className="relative bg-[#0D0D0D] overflow-hidden"
      style={whitelabel ? { background: WHITELABEL_BG } : undefined}
    >
      <div className="absolute top-0 right-0 w-[52%] xl:w-[49%] 2xl:w-[47%] max-w-[855px] h-[600px] hidden lg:block">
        <Image
          src="/hero-bg.png"
          alt=""
          fill
          className="object-cover object-[22%_center]"
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

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 lg:px-12 lg:pt-[224px] lg:pb-[96px] -mt-10 lg:mt-0 flex flex-col gap-6 lg:gap-12">
        <div className="max-w-[680px] flex flex-col gap-6 lg:gap-9">
          <div className={cn("flex items-center gap-2", enter("delay-0"))}>
            <div className="h-px bg-[#C9A96E] w-[32px] lg:w-[40px]" />
            <span className="text-[12px] font-semibold uppercase tracking-[2px] text-[#C9A96E] whitespace-nowrap">
              {t("label")}
            </span>
          </div>

          <h1 className={enter("delay-100")}>
            <span
              className="text-white text-[48px] lg:text-[96px] min-[1440px]:text-[82px] min-[1920px]:text-[96px] leading-[1.2] lg:leading-none block"
              style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif" }}
            >
              Portugal,
            </span>
            <span
              className="italic text-[#C9A96E] text-[48px] lg:text-[96px] min-[1440px]:text-[82px] min-[1920px]:text-[96px] leading-[1.2] lg:leading-none block"
              style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif" }}
            >
              {t("titleHighlight")}
            </span>
          </h1>

          <p className={cn("text-[18px] font-light leading-[1.3] text-[#999] max-w-[591px]", enter("delay-200"))}>
            {whitelabel ? WHITELABEL_DESCRIPTION : t("description")}
          </p>

          {!whitelabel && (
            <div className={enter("delay-300")}>
              <SocialProofBar />
            </div>
          )}
        </div>

        <div id="booking" className={cn("w-full scroll-mt-24", enter("delay-[400ms]"))}>
          <BookingWidget />
        </div>

        <div className={cn("flex flex-col lg:flex-row border border-[rgba(255,255,255,0.12)] divide-y lg:divide-y-0 lg:divide-x divide-[rgba(255,255,255,0.12)]", enter("delay-[500ms]"))}>
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
