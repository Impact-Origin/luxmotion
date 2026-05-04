"use client"

import { Calendar, CircleCheckBig, Euro, HeartHandshake, Users } from "lucide-react"
import { useTranslations } from "next-intl"
import { IntroShell } from "@/components/applications/shared"
import { usePartnerApplication } from "./partner-application-context"

export function PartnerIntro() {
  const t = useTranslations("partnerApplication.intro")
  const { startApplication } = usePartnerApplication()

  const benefits = [
    { icon: <Users size={24} strokeWidth={1.6} />, label: t("benefits.drivers") },
    { icon: <Calendar size={24} strokeWidth={1.6} />, label: t("benefits.bookings") },
    { icon: <Euro size={24} strokeWidth={1.6} />, label: t("benefits.billing") },
    { icon: <CircleCheckBig size={24} strokeWidth={1.6} />, label: t("benefits.dashboard") },
  ]

  return (
    <IntroShell
      badgeIcon={<HeartHandshake size={16} strokeWidth={1.6} />}
      badgeLabel={t("badge")}
      headingPrefix={t("headingPrefix")}
      headingAccent={t("headingAccent")}
      subtitle={t("subtitle")}
      benefits={benefits}
      ctaLabel={t("cta")}
      onCta={startApplication}
    />
  )
}
