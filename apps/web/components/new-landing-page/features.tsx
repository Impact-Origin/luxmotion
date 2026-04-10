"use client"

import { TicketX, HeartHandshake, CalendarClock, User, Settings2, MapPinned } from "lucide-react"
import { useTranslations } from "next-intl"
import { Themed } from "@/components/themed"

export function Features() {
  const t = useTranslations("features")

    const features = [
        {
            icon: HeartHandshake,
      title: t("reliableService.title"),
      description: t("reliableService.description"),
        },
        {
            icon: User,
      title: t("professionalDrivers.title"),
      description: t("professionalDrivers.description"),
        },
        {
            icon: CalendarClock,
      title: t("available247.title"),
      description: t("available247.description"),
        },
        {
            icon: Settings2,
      title: t("personalized.title"),
      description: t("personalized.description"),
        },
        {
            icon: TicketX,
      title: t("freeCancellation.title"),
      description: t("freeCancellation.description"),
        },
        {
            icon: MapPinned,
      title: t("meetingPoint.title"),
      description: t("meetingPoint.description"),
        },
    ]

    return (
        <section className="py-[40px] md:py-[64px] px-4 md:px-8 lg:px-[60px] xl:px-[100px] relative" style={{ backgroundColor: "var(--theme-background)" }}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--theme-primary)_0%,_transparent_70%)] opacity-5 pointer-events-none"></div>
            <div className="min-[2100px]:max-w-[120rem] max-w-[95rem] mx-auto relative z-10">
                <Themed as="h2" colorType="headingText" className="text-[28px] md:text-[36px] font-bold text-center mb-8 md:mb-12" style={{ color: "var(--theme-heading-text)" }}>
                    {t("title")}
                </Themed>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {features.map((feature, index) => (
                        <Themed
                            key={index}
                            colorType="featureCardBg"
                            applyTo="backgroundColor"
                            className="rounded-xl p-6 flex gap-4 hover:shadow-lg transition-all duration-300 border border-black/5 shadow-sm"
                            style={{ backgroundColor: "var(--theme-feature-card-bg)" }}
                        >
                            <div className="flex-shrink-0">
                                <Themed colorType="iconColor" applyTo="color">
                                    <feature.icon className="w-12 h-12" strokeWidth={1.5} style={{ color: "var(--theme-icon-color)" }} />
                                </Themed>
                            </div>
                            <div>
                                <Themed as="h3" colorType="headingText" className="text-xl font-bold mb-2" style={{ color: "var(--theme-heading-text)" }}>
                                    {feature.title}
                                </Themed>
                                <Themed as="p" colorType="bodyText" className="leading-relaxed" style={{ color: "var(--theme-body-text)" }}>
                                    {feature.description}
                                </Themed>
                            </div>
                        </Themed>
                    ))}
                </div>
            </div>
        </section>
    )
}
