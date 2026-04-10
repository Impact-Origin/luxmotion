"use client"

import { useTranslations } from "next-intl"
import Image from "next/image"
import { HeartHandshake, Heart, Eye, Settings2, Award, Leaf } from "lucide-react"

const values = [
  { icon: HeartHandshake, titleKey: "safety", descKey: "safetyDesc" },
  { icon: Heart, titleKey: "hospitality", descKey: "hospitalityDesc" },
  { icon: Eye, titleKey: "transparency", descKey: "transparencyDesc" },
  { icon: Settings2, titleKey: "personalization", descKey: "personalizationDesc" },
  { icon: Award, titleKey: "quality", descKey: "qualityDesc" },
  { icon: Leaf, titleKey: "sustainability", descKey: "sustainabilityDesc" },
] as const

export function ValuesSection() {
  const t = useTranslations("aboutPage.values")

  return (
    <section className="bg-[#fafafa] px-4 md:px-8 lg:px-[60px] xl:px-[100px] pt-4 pb-[36px]">
      <div className="max-w-7xl mx-auto flex flex-col items-center py-10 overflow-clip">
        <div className="text-center flex flex-col gap-4 items-center mb-4">
          <h2 className="text-[24px] md:text-[32px] font-bold text-[#222]">
            {t("title")}
          </h2>
          <p className="text-[16px] md:text-[20px] text-[#222] leading-[1.3] max-w-[900px]">
            {t("subtitle")}
          </p>
        </div>

        <div className="relative w-full h-[240px] md:h-[423px] rounded-b-2xl overflow-hidden">
          <Image
            src="/about_us_values.png"
            alt={t("imageAlt")}
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 1128px"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 pt-6 w-full">
          {values.map(({ icon: Icon, titleKey, descKey }) => (
            <div
              key={titleKey}
              className="border border-[#27c7ff] rounded-2xl p-4 flex flex-col gap-3 md:gap-4 items-start"
            >
              <div className="bg-[#27c7ff] flex items-center justify-center p-[6px] rounded-[7px] shrink-0">
                <Icon className="size-[22px] md:size-7 text-white" />
              </div>
              <div className="flex flex-col gap-1 text-[#0e4659]">
                <h3 className="text-[14px] md:text-[16px] font-bold leading-[1.1]">
                  {t(titleKey)}
                </h3>
                <p className="text-[13px] md:text-[15px] leading-[1.4]">
                  {t(descKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
