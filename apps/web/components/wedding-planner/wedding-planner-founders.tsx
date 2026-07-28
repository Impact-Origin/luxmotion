"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { cn } from "@workspace/ui/lib/utils"

const SERIF_FONT = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const
const SANS_FONT = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const

const FOUNDERS = [
  { initial: "D", name: "David" },
  { initial: "A", name: "Afonso" },
  { initial: "J", name: "Jorge" },
] as const

function FoundersLogo() {
  return (
    <div className="relative w-[123px] h-[42px] md:w-[178px] md:h-[61px]">
      <div className="absolute top-0 left-0 size-[42px] md:size-[60.73px]">
        <Image
          src="/wedding-planner/founders/logo-frame.svg"
          alt=""
          fill
          aria-hidden
        />
      </div>
      <div className="absolute left-[5.2px] top-[12.3px] w-[31.5px] h-[17.3px] overflow-hidden md:left-[7.6px] md:top-[17.9px] md:w-[45.5px] md:h-[25px]">
        <Image
          src="/wedding-planner/founders/logo-monogram.svg"
          alt=""
          fill
          aria-hidden
        />
      </div>
      <div className="absolute left-[47.54px] top-1/2 -translate-y-1/2 w-[75.79px] h-[21.91px] md:left-[68.8px] md:w-[109.68px] md:h-[31.71px]">
        <Image
          src="/wedding-planner/founders/logo-wordmark.svg"
          alt="LuxMotion by EasyTransfer"
          fill
        />
      </div>
    </div>
  )
}

function AvatarRow({ role }: { role: string }) {
  return (
    <div className="relative h-10 w-[104px] shrink-0">
      {FOUNDERS.map((f, i) => (
        <div
          key={f.initial}
          className="group/av absolute top-0 size-10 hover:z-20"
          style={{ left: `${3 + i * 30.5}px` }}
        >
          <span className="flex size-10 cursor-default items-center justify-center rounded-full border border-[rgba(154,117,53,0.22)] bg-[rgba(170,153,110,0.2)] transition-all duration-300 ease-out group-hover/av:scale-110 group-hover/av:border-[#a08248] group-hover/av:bg-[rgba(170,153,110,0.4)]">
            <span
              className="text-[14px] font-semibold leading-[20px] text-[#ab9c6b]"
              style={SANS_FONT}
            >
              {f.initial}
            </span>
          </span>
          <div className="pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 z-30 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-[4px] border border-[rgba(154,117,53,0.22)] bg-white px-3.5 py-2 text-center opacity-0 shadow-[0_10px_24px_-8px_rgba(0,0,0,0.2)] transition-all duration-200 ease-out group-hover/av:translate-y-0 group-hover/av:opacity-100">
            <span className="block text-[13px] font-semibold leading-none text-[#0d0d0d]" style={SANS_FONT}>
              {f.name}
            </span>
            <span className="mt-1 block text-[9px] font-medium uppercase leading-none tracking-[0.8px] text-[#a08248]" style={SANS_FONT}>
              {role}
            </span>
            <span className="absolute left-1/2 top-full size-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-[rgba(154,117,53,0.22)] bg-white" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function WeddingPlannerFounders() {
  const t = useTranslations("weddingPlanner.founders")
  const { ref, revealFromLeft, revealFromRight } = useScrollReveal<HTMLElement>()

  const photoBlock = (
    <div className={cn("relative w-full max-w-[578px] mx-auto md:mx-0 aspect-[578/562]", revealFromLeft())}>
      <div className="group absolute top-[14%] left-0 right-0 bottom-0 overflow-hidden">
        <Image
          src="/wedding-planner/founders/team.webp"
          alt={t("photoAlt")}
          fill
          sizes="(min-width: 768px) 578px, 400px"
          className="object-cover object-bottom transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>
      <div className="absolute top-[9.35%] left-1/2 -translate-x-1/2 z-10">
        <FoundersLogo />
      </div>
    </div>
  )

  const contentBlock = (
    <div className={cn("flex flex-col gap-6 items-start w-full md:max-w-[646px]", revealFromRight("delay-150"))}>
      <div className="flex flex-col gap-2 items-start w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-px bg-[#a08248]" />
          <span
            className="text-[12px] font-semibold uppercase tracking-[2px] text-[#a08248] whitespace-nowrap"
            style={SANS_FONT}
          >
            {t("eyebrow")}
          </span>
        </div>
        <h2
          className="text-[32px] md:text-[48px] leading-none text-[#0d0d0d] font-normal"
          style={SERIF_FONT}
        >
          {t("titleStart")}{" "}
          <span className="italic text-[#a08248]">{t("titleAccent")}</span>
        </h2>
      </div>

      <blockquote
        className="border-l-4 border-[#c9a96e] px-4 py-1 w-full text-[14px] leading-[1.3] text-[#696969] flex flex-col gap-[1.3em]"
        style={SANS_FONT}
      >
        <p>{t("quote1")}</p>
        <p>{t("quote2")}</p>
        <p>{t("quote3")}</p>
        <p>{t("quote4")}</p>
      </blockquote>

      <div className="flex items-center gap-4">
        <AvatarRow role={t("role")} />
        <div className="flex flex-col gap-2">
          <span
            className="text-[16px] font-semibold tracking-[0.32px] text-[#696969] leading-none whitespace-nowrap"
            style={SANS_FONT}
          >
            {t("author")}
          </span>
          <span
            className="text-[12px] font-light tracking-[0.6px] text-[#696969] leading-none"
            style={SANS_FONT}
          >
            {t("role")}
          </span>
        </div>
      </div>
    </div>
  )

  return (
    <section ref={ref} className="bg-[#f7f4ef] px-4 md:px-[82px] pt-6 pb-10 md:pb-0">
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-8">
        {photoBlock}
        {contentBlock}
      </div>
    </section>
  )
}
