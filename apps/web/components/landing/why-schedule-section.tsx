"use client"

import { useTranslations } from "next-intl"
import Image from "next/image"
import {
  Car,
  Users,
  Leaf,
  MapPin,
  Award,
  Infinity as InfinityIcon,
  CreditCard,
  CheckCircle,
  Handshake,
  HeartHandshake,
  User,
  CalendarClock,
  Settings2,
  TicketX,
  MapPinned,
  UserStar,
} from "lucide-react"

export function WhyScheduleSection() {
  const t = useTranslations("whySchedule")

  const stats = [
    { icon: Car, number: t("stats.transfers.number"), label: t("stats.transfers.label") },
    { icon: Users, number: t("stats.customers.number"), label: t("stats.customers.label") },
    { icon: Leaf, number: t("stats.co2.number"), label: t("stats.co2.label") },
    { icon: MapPin, number: t("stats.distance.number"), label: t("stats.distance.label") },
  ]

  const features = [
    { icon: HeartHandshake, title: t("features.reliable.title"), description: t("features.reliable.description") },
    { icon: User, title: t("features.professional.title"), description: t("features.professional.description") },
    { icon: CalendarClock, title: t("features.available.title"), description: t("features.available.description") },
    { icon: Settings2, title: t("features.custom.title"), description: t("features.custom.description") },
    { icon: TicketX, title: t("features.cancellation.title"), description: t("features.cancellation.description") },
    { icon: MapPinned, title: t("features.meetingPoint.title"), description: t("features.meetingPoint.description") },
  ]

  const resources = [
    { icon: Award, label: t("resources.reputation") },
    { icon: CreditCard, label: t("resources.noFees") },
    { icon: InfinityIcon, label: t("resources.tollsIncluded") },
    { icon: CheckCircle, label: t("resources.freeCancellation") },
    { icon: UserStar, label: t("resources.professionalDrivers") },
    { icon: Handshake, label: t("resources.meetAndGreet") },
  ]

  return (
    <section
      id="services"
      data-theme-color="whyScheduleBg"
      className="py-[40px] md:py-[64px] px-4 md:px-8 lg:px-[60px] xl:px-[100px]"
      style={{ backgroundColor: "var(--theme-why-schedule-bg, #ffffff)" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 data-theme-color="whyScheduleTitle" className="text-[28px] md:text-[36px] font-bold mb-8 md:mb-12" style={{ color: "var(--theme-why-schedule-title, #222222)" }}>
            {t("title")}
          </h2>

          <div className="relative w-full max-w-[95%] md:max-w-[75%] mx-auto">
            <Image src="/why_schedule_thumbnail_container.webp" alt={t("heroImageAlt")} width={800} height={300} className="w-full h-auto" priority />
          </div>
        </div>

        <div
          data-theme-color="whyScheduleStatsWrapperBg"
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4 p-2 sm:p-2 xl:p-3 rounded-[12px] mb-8 md:mb-12"
          style={{ backgroundColor: "var(--theme-why-schedule-stats-wrapper-bg, #0a3542)" }}
        >
          {stats.map((item) => (
            <div
              key={item.label}
              data-theme-color="whyScheduleStatsCardBg"
              className="flex gap-2 lg:gap-2.5 items-center py-2 px-2 sm:py-2 sm:px-2.5 lg:px-3 rounded-[12px] min-w-0"
              style={{ backgroundColor: "var(--theme-why-schedule-stats-card-bg, #0d4a5c)" }}
            >
              <div className="flex items-center shrink-0">
                <item.icon data-theme-color="whyScheduleStatsAccent" className="w-6 h-6 lg:w-7 lg:h-7" style={{ color: "var(--theme-why-schedule-stats-accent, #27C7FF)" }} />
              </div>
              <div className="flex flex-col gap-[4px] items-start min-w-0 flex-1">
                <div className="flex gap-[6px] lg:gap-[8px] items-baseline">
                  <span data-theme-color="whyScheduleStatsAccent" className="text-[13px] md:text-[13px] lg:text-[15px] xl:text-[17px] font-bold leading-none" style={{ color: "var(--theme-why-schedule-stats-accent, #27C7FF)" }}>+</span>
                  <p data-theme-color="whyScheduleStatsText" className="text-[13px] md:text-[13px] lg:text-[15px] xl:text-[17px] font-bold leading-none" style={{ color: "var(--theme-why-schedule-stats-text, #ffffff)" }}>
                    {item.number}
                  </p>
                </div>
                <p data-theme-color="whyScheduleStatsText" className="text-[11px] md:text-[11px] lg:text-[13px] xl:text-[15px] leading-tight" style={{ color: "var(--theme-why-schedule-stats-text, #ffffff)" }}>
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
          {features.map((feature) => (
            <div
              key={feature.title}
              data-theme-color="whyScheduleFeatureCardBg"
              className="flex flex-col gap-[12px] md:gap-[20px] items-start p-[12px] md:p-[20px] rounded-[12px] md:rounded-[16px] transition-all cursor-pointer hover:scale-[1.05]"
              style={{ background: "linear-gradient(216.738deg, color-mix(in srgb, var(--theme-why-schedule-feature-card-bg, #bceeff) 38%, white) 30.279%, color-mix(in srgb, var(--theme-why-schedule-feature-card-bg, #bceeff) 22%, transparent) 106.2%)" }}
            >
              <div
                data-theme-color="whyScheduleFeatureIconBg"
                className="flex items-center justify-center p-[5px] md:p-[6px] rounded-[6px] md:rounded-[7px] shrink-0"
                style={{ backgroundColor: "var(--theme-why-schedule-feature-icon-bg, #27c7ff)" }}
              >
                <feature.icon data-theme-color="whyScheduleFeatureIcon" className="w-[18px] h-[18px] md:w-[24px] md:h-[24px]" style={{ color: "var(--theme-why-schedule-feature-icon, #ffffff)" }} />
              </div>
              <div data-theme-color="whyScheduleFeatureText" className="flex flex-col gap-[4px] md:gap-[6px] items-start w-full" style={{ color: "var(--theme-why-schedule-feature-text, #0e4659)" }}>
                <h3 className="text-[12px] md:text-[16px] font-bold leading-[1.1] mb-[4px] md:mb-[6px]">{feature.title}</h3>
                <p className="text-[11px] md:text-[15px] font-medium leading-[1.4]">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-[40px] md:mb-[60px] md:mt-[120px]">
          <h3 data-theme-color="whyScheduleResourcesTitle" className="text-[24px] md:text-[32px] font-bold text-center mb-6 md:mb-10" style={{ color: "var(--theme-why-schedule-resources-title, #222222)" }}>
            {t("resources.title")}
          </h3>

          <div className="hidden md:grid md:grid-cols-3 gap-x-8 gap-y-5 w-full">
            {resources.map((resource) => (
              <div key={resource.label} className="flex gap-4 items-center group">
                <div
                  data-theme-color="whyScheduleResourcesIconBorder"
                  className="border-[1.5px] border-solid flex items-center justify-center p-2 rounded-[10px] shrink-0 w-[48px] h-[48px] transition-all"
                  style={{ borderColor: "var(--theme-why-schedule-resources-icon-border, #27c7ff)" }}
                >
                  <resource.icon data-theme-color="whyScheduleResourcesIcon" className="w-[24px] h-[24px]" style={{ color: "var(--theme-why-schedule-resources-icon, #27c7ff)" }} />
                </div>
                <p data-theme-color="whyScheduleResourcesText" className="text-[18px] font-semibold leading-[1.2]" style={{ color: "var(--theme-why-schedule-resources-text, #0e4659)" }}>
                  {resource.label}
                </p>
              </div>
            ))}
          </div>

          <div className="md:hidden grid grid-cols-2 gap-2.5 w-full">
            {resources.map((resource) => (
              <div key={resource.label} className="flex gap-2.5 items-center group">
                <div
                  data-theme-color="whyScheduleResourcesIconBorder"
                  className="border-[1.5px] border-solid flex items-center justify-center rounded-[8px] shrink-0 w-[40px] h-[40px] transition-all"
                  style={{ borderColor: "var(--theme-why-schedule-resources-icon-border, #27c7ff)" }}
                >
                  <resource.icon data-theme-color="whyScheduleResourcesIcon" className="w-[20px] h-[20px]" style={{ color: "var(--theme-why-schedule-resources-icon, #27c7ff)" }} />
                </div>
                <p data-theme-color="whyScheduleResourcesText" className="text-[13px] font-semibold leading-[1.2] flex-1" style={{ color: "var(--theme-why-schedule-resources-text, #0e4659)" }}>
                  {resource.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
