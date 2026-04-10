"use client"

import { useTranslations } from "next-intl"
import { Star, ArrowLeftRight, Shield, Clock } from "lucide-react"

const stats = [
  { icon: Star, valueKey: "clientRatingValue", labelKey: "clientRating" },
  { icon: ArrowLeftRight, valueKey: "successfulTransfersValue", labelKey: "successfulTransfers" },
  { icon: Shield, valueKey: "safetyRecordValue", labelKey: "safetyRecord" },
  { icon: Clock, valueKey: "localSupportValue", labelKey: "localSupport" },
] as const

export function WhoIsSection() {
  const t = useTranslations("aboutPage")

  return (
    <section className="w-full px-4 md:px-8 lg:px-[60px] xl:px-[100px] pt-[20px] pb-[36px]">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-6">
        <div className="flex flex-col gap-6 lg:max-w-[544px] w-full shrink-0">
          <h2 className="text-[32px] md:text-[40px] xl:text-[48px] font-bold tracking-[-1.2px] leading-[1] text-[#222]">
            {t("whoIs")}{" "}
            <span className="text-[#27c7ff]">Easy Transfer</span>
          </h2>
          <div className="flex flex-col gap-5">
            <p className="text-[16px] md:text-[18px] leading-[1.3] text-[#222]">
              {t.rich("description", {
                bold: (chunks) => <strong className="font-bold">{chunks}</strong>,
              })}
            </p>
            <p className="text-[16px] md:text-[18px] leading-[1.3] text-[#222]">
              {t.rich("descriptionPart2", {
                bold: (chunks) => <strong className="font-bold">{chunks}</strong>,
              })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 flex-1 w-full">
          {stats.map(({ icon: Icon, valueKey, labelKey }) => (
            <div
              key={labelKey}
              className="bg-white border border-[rgba(225,231,239,0.5)] rounded-2xl p-6 flex flex-col items-center gap-4 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
            >
              <div className="size-12 rounded-lg bg-[rgba(41,201,255,0.1)] flex items-center justify-center">
                <Icon className="size-6 text-[#29c9ff]" />
              </div>
              <p className="text-[28px] md:text-[36px] font-bold leading-[40px] text-[#0f1729] text-center">
                {t(valueKey)}
              </p>
              <p className="text-[14px] font-medium leading-[20px] text-[#65758b] text-center">
                {t(labelKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
