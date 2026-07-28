"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import { cn } from "@workspace/ui/lib/utils"

const CARDS = [
  {
    image: "/interior.webp",
    titleKey: "reason1Title",
    descKey: "reason1Cta",
  },
  {
    image: "/hero-transfers.webp",
    titleKey: "reason2Title",
    descKey: "reason2Cta",
  },
  {
    image: "/executivo-car.png",
    titleKey: "reason3Title",
    descKey: "reason3Cta",
  },
  {
    image: "/hero_fleet.jpeg",
    titleKey: "reason4Title",
    descKey: "reason4Cta",
  },
] as const

export function FleetWhyChoose() {
  const t = useTranslations("fleetPage")
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-[48px] md:py-[80px] px-4 md:px-8 lg:px-[60px] xl:px-[100px] bg-[#0a3542]"
    >
      <div className="max-w-7xl mx-auto">
        <div
          className={cn(
            "mb-10 md:mb-14 transition-all duration-700 ease-out",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
        >
          <span className="inline-block text-[#27c7ff] text-[13px] font-semibold uppercase tracking-[0.18em] mb-3">
            {t("whyChoose")}
          </span>
          <h2 className="text-[28px] md:text-[40px] font-bold text-white leading-[1.12] max-w-[460px]">
            {t("whyChooseSubtitle")}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
          {CARDS.map((card, index) => (
            <div
              key={card.titleKey}
              className={cn(
                "group relative overflow-hidden rounded-2xl min-h-[220px] md:min-h-[260px] transition-all duration-700 ease-out",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: `${(index + 1) * 80}ms` }}
            >
              <div className="absolute inset-0">
                <Image
                  src={card.image}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a3542] via-[#0a3542]/60 to-[#0a3542]/20" />
              </div>

              <div className="relative z-10 flex flex-col justify-end h-full p-6 md:p-8">
                <h3 className="text-[20px] md:text-[24px] font-bold text-white leading-tight mb-2">
                  {t(card.titleKey)}
                </h3>
                <p className="text-[14px] md:text-[15px] text-white/85 leading-[1.6] max-w-[400px]">
                  {t(card.descKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
