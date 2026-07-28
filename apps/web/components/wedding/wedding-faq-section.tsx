"use client"

import { useState } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { Plus } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { cn } from "@workspace/ui/lib/utils"

const SERIF_FONT = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const
const SANS_FONT = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const

const FAQ_KEYS = [
  { qKey: "q1.question", aKey: "q1.answer" },
  { qKey: "q2.question", aKey: "q2.answer" },
  { qKey: "q3.question", aKey: "q3.answer" },
  { qKey: "q4.question", aKey: "q4.answer" },
  { qKey: "q5.question", aKey: "q5.answer" },
  { qKey: "q6.question", aKey: "q6.answer" },
  { qKey: "q7.question", aKey: "q7.answer" },
] as const

function AccordionItem({
  question,
  answer,
  open,
  onToggle,
}: {
  question: string
  answer: string
  open: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-b border-b-[rgba(26,22,18,0.08)] overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 text-left py-4"
      >
        <span
          className="text-[14px] font-semibold leading-[1.4] text-[rgba(26,22,18,0.75)]"
          style={SANS_FONT}
        >
          {question}
        </span>
        <span
          className={`size-8 shrink-0 flex items-center justify-center border-[1.143px] transition-colors duration-200 ${
            open ? "border-[#a08248]" : "border-[rgba(28,27,24,0.08)]"
          }`}
        >
          <Plus
            className={`size-[18px] transition-all duration-300 ${
              open ? "rotate-45 text-[#a08248]" : "rotate-0 text-[#1a1612]"
            }`}
            strokeWidth={1.5}
          />
        </span>
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p
            className="text-[14px] leading-[1.5] text-[#696969] pb-4"
            style={SANS_FONT}
          >
            {answer}
          </p>
        </div>
      </div>
    </div>
  )
}

function Eyebrow({ label }: { label: string }) {
  return (
    <div className="inline-flex gap-2 items-center">
      <span className="h-px w-[82px] bg-[#a08248]" />
      <span
        className="text-[12px] font-semibold uppercase tracking-[2px] text-[#a08248] whitespace-nowrap"
        style={SANS_FONT}
      >
        {label}
      </span>
    </div>
  )
}

function Heading({ start, accent }: { start: string; accent: string }) {
  return (
    <h2
      className="text-[36px] md:text-[44px] leading-tight font-normal text-[#1a1612]"
      style={SERIF_FONT}
    >
      <span>{start} </span>
      <span className="italic text-[#a08248]">{accent}</span>
    </h2>
  )
}

export function WeddingFaqSection() {
  const t = useTranslations("wedding.faq")
  const [openIndex, setOpenIndex] = useState<number>(0)
  const { ref, reveal, revealFromLeft, revealFromRight } = useScrollReveal<HTMLDivElement>()

  return (
    <section className="bg-[#faf7f2] px-4 md:px-12 py-14 md:py-24">
      <div ref={ref} className="max-w-[1280px] mx-auto flex flex-col md:flex-row gap-12 md:gap-20 items-start">
        <div className={cn("w-full md:flex-1 md:min-w-0 md:sticky md:top-24", revealFromLeft())}>
          <div className="relative w-full aspect-[600/750] border border-[rgba(168,131,58,0.15)] overflow-hidden">
            <Image
              src="/wedding/faq-couple.webp"
              alt={t("photoAlt")}
              fill
              sizes="(min-width: 768px) 600px, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="w-full md:flex-1 md:min-w-0 flex flex-col gap-2">
          <div
            className={cn("flex flex-col gap-2", revealFromRight())}
            style={{ transitionDelay: "120ms" }}
          >
            <Eyebrow label={t("eyebrow")} />
            <Heading start={t("headingStart")} accent={t("headingAccent")} />
          </div>

          <div className="flex flex-col pt-4 w-full">
            {FAQ_KEYS.map((item, i) => (
              <div
                key={item.qKey}
                className={reveal()}
                style={{ transitionDelay: `${240 + i * 70}ms` }}
              >
                <AccordionItem
                  question={t(item.qKey)}
                  answer={t(item.aKey)}
                  open={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
