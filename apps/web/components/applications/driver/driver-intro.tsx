"use client"

import { Calendar, Car, Check, CircleCheckBig, Clock, Euro } from "lucide-react"
import { useTranslations } from "next-intl"
import { IntroShell } from "@/components/applications/shared"
import { useDriverApplication } from "./driver-application-context"

function BookingPreview({ nowLabel, routeLabel, paidLabel }: { nowLabel: string; routeLabel: string; paidLabel: string }) {
  return (
    <div className="relative bg-white border border-[rgba(28,27,24,0.08)] flex flex-col items-center gap-2 px-6 py-3">
      <span className="text-[10px] font-semibold uppercase tracking-[1.1px] text-[rgba(140,134,128,0.85)] leading-[1.2]">
        {nowLabel}
      </span>
      <span className="text-[14px] font-semibold text-[#0d0d0d] leading-[1.2] whitespace-nowrap">
        {routeLabel}
      </span>
      <span className="absolute -top-2 right-[-9px] bg-[#a08248] flex items-center justify-center rounded-full p-[7px]">
        <Check size={10} strokeWidth={3} className="text-white" />
      </span>
      <span className="absolute -bottom-3 -left-10 bg-[#2e7d52] text-white text-[10px] font-semibold uppercase tracking-[1.5px] px-[13.8px] py-[8px] leading-none">
        {paidLabel}
      </span>
    </div>
  )
}

export function DriverIntro() {
  const t = useTranslations("driverApplication.intro")
  const { startApplication } = useDriverApplication()

  const benefits = [
    { icon: <Euro size={24} strokeWidth={1.25} />, label: t("benefits.earn") },
    { icon: <Calendar size={24} strokeWidth={1.25} />, label: t("benefits.bookings") },
    { icon: <Clock size={24} strokeWidth={1.25} />, label: t("benefits.schedule") },
    { icon: <CircleCheckBig size={24} strokeWidth={1.25} />, label: t("benefits.payout") },
  ]

  return (
    <IntroShell
      badgeIcon={<Car size={16} strokeWidth={1.6} />}
      badgeLabel={t("badge")}
      headingPrefix={t("headingPrefix")}
      headingAccent={t("headingAccent")}
      headingSuffix={t("headingSuffix")}
      subtitle={t("subtitle")}
      benefits={benefits}
      ctaLabel={t("cta")}
      onCta={startApplication}
      benefitIconClassName="text-[#a08248]"
      extra={
        <BookingPreview
          nowLabel={t("preview.now")}
          routeLabel={t("preview.route")}
          paidLabel={t("preview.paid")}
        />
      }
    />
  )
}
