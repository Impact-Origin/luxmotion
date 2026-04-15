"use client"

import { useTranslations } from "next-intl"
import Image from "next/image"

const FOUNDERS = ["D", "A", "J"] as const

export function AboutUsSection() {
  const t = useTranslations("aboutUs")

  return (
    <section id="about" className="bg-[#0D0D0D] pt-6 pb-4 lg:pb-6">
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-6 xl:gap-8">
          <div className="relative w-full max-w-[578px] lg:w-[45%] lg:max-w-none lg:shrink-0 xl:w-[578px] xl:max-w-[578px] h-[460px] sm:h-[520px] lg:h-[520px] xl:h-[562px]">
            <div className="absolute left-1/2 -translate-x-1/2 top-[40px] lg:top-[52px] z-10 flex items-center gap-[10px]">
              <div className="relative size-[60.73px] border-[2.556px] border-[#C9A96E] flex items-center justify-center shrink-0">
                <Image
                  src="/svgs/lm-monogram.svg"
                  alt=""
                  width={30}
                  height={17}
                  className="w-[30px] h-auto"
                />
              </div>
              <div className="flex flex-col gap-[4px]">
                <Image
                  src="/svgs/luxmotion-text.svg"
                  alt="LuxMotion"
                  width={110}
                  height={13}
                  className="w-[110px] h-auto"
                />
                <span
                  className="text-[9.57px] tracking-[1.34px] text-[#999] font-normal leading-none"
                  style={{ fontFamily: "var(--font-sans), Inter, sans-serif" }}
                >
                  BY EASYTRANSFER
                </span>
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 top-[60px] lg:top-[62px]">
              <Image
                src="/about/founders.png"
                alt={t("imageAlt")}
                fill
                sizes="(max-width: 1024px) 100vw, 578px"
                className="object-contain object-bottom"
                priority={false}
              />
            </div>
          </div>

          <div
            className="w-full max-w-[646px] lg:flex-1 lg:max-w-none lg:min-w-0 xl:max-w-[646px] flex flex-col gap-6"
            style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif" }}
          >
            <div className="flex flex-col gap-2">
              <div
                className="flex items-center gap-2"
                style={{ fontFamily: "var(--font-sans), Inter, sans-serif" }}
              >
                <div className="w-8 h-px bg-[#C9A96E]" />
                <span className="text-[12px] font-semibold tracking-[2px] uppercase text-[#C9A96E] leading-none">
                  {t("sectionLabel")}
                </span>
              </div>
              <h2 className="text-[40px] lg:text-[48px] leading-none text-[#F5F5F5] font-normal">
                {t("title")}
              </h2>
            </div>

            <blockquote
              className="border-l-4 border-[#C9A96E] pl-4 pr-2 py-0.5 flex flex-col gap-3"
              style={{ fontFamily: "var(--font-sans), Inter, sans-serif" }}
            >
              <p className="text-[14px] leading-[1.3] text-[#999]">
                &ldquo;{t("quote1")}
              </p>
              <p className="text-[14px] leading-[1.3] text-[#999]">
                {t("quote2")}
              </p>
              <p className="text-[14px] leading-[1.3] text-[#999]">
                {t("quote3")}
              </p>
              <p className="text-[14px] leading-[1.3] text-[#999]">
                {t("quote4")}&rdquo;
              </p>
            </blockquote>

            <div
              className="flex items-center gap-4"
              style={{ fontFamily: "var(--font-sans), Inter, sans-serif" }}
            >
              <div className="relative h-10 w-[104px] shrink-0">
                {FOUNDERS.map((letter, i) => (
                  <div
                    key={letter}
                    className="absolute top-0 size-10 rounded-full bg-[rgba(170,153,110,0.2)] border border-[#212121] flex items-center justify-center"
                    style={{ left: `${i * 32}px` }}
                  >
                    <span className="text-[14px] font-semibold text-[#AB9C6B] leading-none">
                      {letter}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2 text-[#F5F5F5]">
                <span className="text-[16px] font-semibold tracking-[0.32px] leading-none">
                  {t("foundersName")}
                </span>
                <span className="text-[12px] font-light tracking-[0.6px] leading-none">
                  {t("foundersRole")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
