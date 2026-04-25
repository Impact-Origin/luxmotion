"use client"

import { Fragment } from "react"
import { useTranslations } from "next-intl"
import Image from "next/image"

type Milestone = {
  year: string
  title: string
  desc: string
}

function TimelineNode({ m }: { m: Milestone }) {
  return (
    <div className="flex flex-col items-center gap-4 px-2 shrink-0">
      <div
        className="text-[#C9A96E] text-[28px] font-light leading-[28px] whitespace-nowrap"
        style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif" }}
      >
        {m.year}
      </div>
      <div className="size-10 rounded-full bg-[#0D0D0D] border border-[rgba(201,169,110,0.3)] flex items-center justify-center">
        <span className="text-[#C9A96E] text-[11px] tracking-[0.55px]">◆</span>
      </div>
      <div
        className="text-white text-[14px] font-medium tracking-[0.44px] text-center whitespace-nowrap"
        style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
      >
        {m.title}
      </div>
      <p
        className="text-[#999] text-[14px] leading-[1.3] text-center max-w-[160px]"
        style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
      >
        {m.desc}
      </p>
    </div>
  )
}

function Connector({ flexBased = true }: { flexBased?: boolean }) {
  return (
    <div
      className={`${flexBased ? "flex-1" : "w-[120px] shrink-0"} h-px self-start mt-[14px]`}
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(201,169,110,0.4), rgba(201,169,110,0.1))",
      }}
    />
  )
}

export function TimelineSection() {
  const t = useTranslations("aboutPage.timeline")

  const milestones: Milestone[] = [
    { year: t("year1"), title: t("label1"), desc: t("desc1") },
    { year: t("year2"), title: t("label2"), desc: t("desc2") },
    { year: t("year3"), title: t("label3"), desc: t("desc3") },
    { year: t("year4"), title: t("label4"), desc: t("desc4") },
  ]

  return (
    <section className="relative bg-[#0D0D0D] py-16 overflow-hidden">
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[754px] h-[345px] opacity-10"
        aria-hidden
      >
        <Image src="/about/world-map.svg" alt="" fill className="object-contain" />
      </div>

      <div className="hidden md:block relative max-w-[1280px] mx-auto px-[82px]">
        <div className="flex items-start w-full">
          {milestones.map((m, i) => (
            <Fragment key={m.year}>
              <TimelineNode m={m} />
              {i < milestones.length - 1 && <Connector flexBased />}
            </Fragment>
          ))}
        </div>
      </div>

      <div className="md:hidden relative">
        <div className="overflow-x-auto no-scrollbar">
          <div className="flex items-start min-w-max px-4">
            {milestones.map((m, i) => (
              <Fragment key={m.year}>
                <div className="w-[240px] shrink-0 flex justify-center">
                  <TimelineNode m={m} />
                </div>
                {i < milestones.length - 1 && <Connector flexBased={false} />}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
