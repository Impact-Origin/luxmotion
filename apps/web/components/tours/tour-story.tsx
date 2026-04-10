"use client"

import { useTranslations } from "next-intl"
import Image from "next/image"
import { cn } from "@workspace/ui/lib/utils"

export function TourStory() {
  const t = useTranslations("tourStory")

  return (
    <section className="relative bg-white overflow-hidden px-4 md:px-5 lg:px-6 xl:px-8">
      <div className="max-w-7xl mx-auto relative">
        {/* Bloco da imagem dentro do max-w-7xl para alinhar com a secção de baixo */}
        <div className="hidden xl:block absolute left-[35%] right-0 top-[-30px] h-[1050px]">
          <Image
            src="/more_than_a_trip.png"
            alt={t("imageAlt")}
            fill
            className="object-contain object-right object-[55%_50%]"
            priority
          />
        </div>

        <div className="hidden lg:block xl:hidden absolute left-[42%] right-0 top-[-30px] h-[1050px]">
          <Image
            src="/more_than_a_trip.png"
            alt={t("imageAlt")}
            fill
            className="object-contain object-right object-[55%_50%]"
            priority
          />
        </div>
        <div className="flex flex-col lg:min-h-[560px]">
          <div className="flex flex-col gap-[29px] lg:max-w-[480px] xl:max-w-[536px] pt-4 md:pt-[40px] pb-[40px] lg:py-0 lg:justify-center lg:min-h-[560px]">
            <h2 className="text-[24px] md:text-[36px] lg:text-[48px] font-bold leading-[1.2] text-[#132339]">
              {t("titlePart1")}{" "}
              <span className="text-[#29c9ff]">{t("titlePart2")}</span>
            </h2>

            <p className="text-[14px] leading-[1.5] text-[#7a7a7a]">
              {t("paragraph1")}
            </p>

            <p className="text-[14px] leading-[1.5] text-[#7a7a7a]">
              {t("paragraph2")}
            </p>
          </div>

          <div className="relative w-full lg:hidden mb-[10px] mt-[-80px] overflow-hidden max-h-[400px] md:max-h-[800px]">
            <Image
              src="/more_than_a_trip.png"
              alt={t("imageAlt")}
              width={1000}
              height={700}
              className="w-full h-auto mt-[30px]"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
