"use client"

import { useTranslations } from "next-intl"

const milestones = [
  { yearKey: "year1", labelKey: "label1" },
  { yearKey: "year2", labelKey: "label2" },
  { yearKey: "year3", labelKey: "label3" },
  { yearKey: "year4", labelKey: "label4" },
] as const

export function TimelineSection() {
  const t = useTranslations("aboutPage.timeline")

  return (
    <section
      className="px-4 md:px-8 lg:px-[60px] xl:px-[100px] py-[64px] lg:py-[100px] bg-no-repeat bg-center bg-[length:70%_auto] lg:bg-[length:50%_auto]"
      style={{ backgroundImage: "url(/mundi-map.png)" }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
          {milestones.map((milestone, index) => (
            <div key={milestone.yearKey} className="flex items-center gap-6 md:gap-8">
              <div className="flex flex-col items-center gap-1 text-center">
                <span className="text-[24px] md:text-[30px] font-bold leading-[36px] text-[#29c9ff]">
                  {t(milestone.yearKey)}
                </span>
                <span className="text-[13px] md:text-[14px] font-medium leading-[20px] text-[#65758b] whitespace-nowrap">
                  {t(milestone.labelKey)}
                </span>
              </div>
              {index < milestones.length - 1 && (
                <div className="hidden md:block w-[96px] h-[2px] bg-gradient-to-r from-[#29c9ff] to-[rgba(41,201,255,0.3)]" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
