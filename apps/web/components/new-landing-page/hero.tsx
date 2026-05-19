"use client"

import { Plane, Phone, ShieldCheck } from "lucide-react"
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
      <div className="absolute top-0 right-0 w-[55%] xl:w-[52%] 2xl:w-[50%] max-w-[900px] aspect-[4096/3223] hidden lg:block">
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

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 lg:px-12 lg:pt-[224px] lg:pb-[96px] -mt-10 lg:mt-0 flex flex-col gap-6 lg:gap-12">
        <div className="max-w-[680px] flex flex-col gap-6 lg:gap-9">
          <div className={cn("flex items-center gap-2", enter("delay-0"))}>
            <div className="h-px bg-[#C9A96E] w-[60px] lg:w-[82px]" />
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
