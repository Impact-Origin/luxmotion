"use client"

import { useTranslations } from "next-intl"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

const QuoteOpen = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 70 58" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 58V38.667C0 27.556 2.917 18.278 8.75 10.833C14.583 3.611 22.75 0 33.25 0V14.5C28.583 14.5 24.792 16.028 21.875 19.083C18.958 22.139 17.5 26.167 17.5 31.167V34.833H31.5V58H0ZM38.5 58V38.667C38.5 27.556 41.417 18.278 47.25 10.833C53.083 3.611 61.25 0 71.75 0V14.5C67.083 14.5 63.292 16.028 60.375 19.083C57.458 22.139 56 26.167 56 31.167V34.833H70V58H38.5Z" />
  </svg>
)

const QuoteClose = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 70 58" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M70 0V19.333C70 30.444 67.083 39.722 61.25 47.167C55.417 54.389 47.25 58 36.75 58V43.5C41.417 43.5 45.208 41.972 48.125 38.917C51.042 35.861 52.5 31.833 52.5 26.833V23.167H38.5V0H70ZM31.5 0V19.333C31.5 30.444 28.583 39.722 22.75 47.167C16.917 54.389 8.75 58 -1.75 58V43.5C2.917 43.5 6.708 41.972 9.625 38.917C12.542 35.861 14 31.833 14 26.833V23.167H0V0H31.5Z" />
  </svg>
)

export function AboutUsSection() {
  const t = useTranslations("aboutUs")

  return (
    <section className="py-[40px] md:py-[64px] px-4 md:px-8 lg:px-[60px] xl:px-[100px]" id="about">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-6 md:gap-8 items-center w-full">
          <h2 className="text-[28px] md:text-[36px] font-bold text-[#222] text-center">
            {t("title")}
          </h2>

          <div className="hidden min-[88rem]:flex border border-[rgba(14,70,89,0.2)] border-solid gap-[14px] items-start overflow-hidden p-[16px] rounded-[16px] w-full relative min-h-[280px] xl:min-h-[340px]">
            <div className="flex flex-col items-start opacity-20 shrink-0 w-[40px] lg:w-[70px]">
              <QuoteOpen className="w-[40px] h-[33px] lg:w-[70px] lg:h-[58px] text-[#0E4659]" />
            </div>

            <div className="flex flex-col justify-center shrink-0 w-[45%] lg:w-[540px] z-10">
              <p className="text-[13px] lg:text-[24px] min-[88rem]:text-[16px] text-[#404040] leading-[1.5] tracking-[0.14px]">
                <span className="font-normal">{t("content.welcome")} </span>
                <span className="font-bold">{t("content.unitedByLove")}</span>
                <span className="font-normal">{t("content.foundersDescription")}</span>
                <br /><br />
                <span className="font-normal">{t("content.motivation")} </span>
                <span className="font-bold">{t("content.memorableExperiences")}</span>
                <span className="font-normal">{t("content.companyDescription")}</span>
                <br /><br />
                <span className="font-normal">{t("content.serviceDescription")} </span>
                <span className="font-bold">{t("content.discoveries")}</span>
                <span className="font-normal">{t("content.emotionalConnections")}</span>
                <br /><br />
                <span className="font-normal">{t("content.joinUs")} </span>
                <span className="font-bold">{t("content.everyKilometer")}</span>
                <span className="font-bold">.</span>
                <br /><br />
                <span className="text-[16px] lg:text-[20px] tracking-[0.18px] text-[#404040]" style={{ fontFamily: 'var(--font-signature)' }}>{t("content.signature")}</span>
              </p>
            </div>

            <div className="absolute left-[580px] lg:left-[640px] bottom-[32px] opacity-20 z-10">
              <QuoteClose className="w-[40px] h-[33px] lg:w-[70px] lg:h-[58px] text-[#0E4659]" />
            </div>

            <div className="hidden min-[88rem]:block absolute right-0 top-0 bottom-0 w-[40%] lg:w-[45%] overflow-hidden rounded-r-[20px]">
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(180deg, #0E4659 0%, #27C7FF 100%)',
                  clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 10% 100%)'
                }}
              />
            </div>

            <div className="hidden min-[88rem]:block absolute right-[10px] lg:right-[20px] top-[0] bottom-[0] w-[45%] lg:w-[580px]">
              <div className="w-full h-full relative overflow-hidden rounded-r-[20px]">
                <Image
                  alt={t("imageAlt")}
                  src="/aboutus_team.png"
                  fill
                  className="object-cover object-center"
                />
              </div>
            </div>
          </div>

          <div className="min-[88rem]:hidden border border-[rgba(14,70,89,0.2)] border-solid flex flex-col gap-[12px] overflow-hidden p-[12px] rounded-[16px] w-full relative lg:w-[calc(100%+120px)] lg:-mx-[60px] xl:w-[calc(100%+140px)] xl:-mx-[70px]">
            <div className="lg:hidden relative w-full">
              <div className="absolute h-[140px] left-[70px] top-[-15px] w-[220px] bg-gradient-to-br from-[#27c7ff]/30 via-[#0E4659]/20 to-transparent rounded-full blur-2xl" />
              <div className="relative mx-auto w-[260px] h-[260px] sm:w-[160px] sm:h-[160px]">
                <Image
                  alt={t("imageAlt")}
                  src="/aboutus_team.png"
                  fill
                  className="object-cover object-center rounded-lg"
                />
              </div>
            </div>

            <div className="flex gap-[16px] items-start w-full">
              <div className="flex flex-col items-start opacity-20 shrink-0">
                <QuoteOpen className="w-[24px] h-[20px] text-[#0E4659]" />
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <p className="text-[14px] text-[#404040] leading-[1.3] tracking-[0.14px]">
                  <span className="font-normal">{t("content.welcome")} </span>
                  <span className="font-bold">{t("content.unitedByLove")}</span>
                  <span className="font-normal">{t("content.foundersDescription")}</span>
                  <br /><br />
                  <span className="font-normal">{t("content.motivation")} </span>
                  <span className="font-bold">{t("content.memorableExperiences")}</span>
                  <span className="font-normal">{t("content.companyDescription")}</span>
                  <br /><br />
                  <span className="font-normal">{t("content.serviceDescription")} </span>
                  <span className="font-bold">{t("content.discoveries")}</span>
                  <span className="font-normal">{t("content.emotionalConnections")}</span>
                  <br /><br />
                  <span className="font-normal">{t("content.joinUs")} </span>
                  <span className="font-bold">{t("content.everyKilometer")}</span>
                  <span className="font-bold">.</span>
                  <br /><br />
                  <span className="text-[14px] tracking-[0.14px] text-[#404040]" style={{ fontFamily: 'var(--font-signature)' }}>{t("content.signature")}</span>
                </p>
              </div>

              <div className="flex flex-col items-start justify-end opacity-20 shrink-0 self-end">
                <QuoteClose className="w-[24px] h-[20px] text-[#0E4659]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}