"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { MessageSquare, Plus } from "lucide-react"
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
            open
              ? "border-[rgba(154,117,53,0.22)] bg-[rgba(154,117,53,0.07)]"
              : "border-[rgba(28,27,24,0.08)]"
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
          <div className="bg-[rgba(0,0,0,0.02)] px-4 py-4 mb-2">
            <p
              className="text-[14px] leading-[1.5] text-[#696969]"
              style={SANS_FONT}
            >
              {answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Eyebrow({ label, centered }: { label: string; centered?: boolean }) {
  return (
    <div className={cn("inline-flex gap-2 items-center", centered && "justify-center")}>
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

function Heading({
  start,
  accent,
  centered,
}: {
  start: string
  accent: string
  centered?: boolean
}) {
  return (
    <h2
      className={cn(
        "text-[36px] md:text-[44px] leading-tight font-normal text-[#1a1612]",
        centered && "text-center",
      )}
      style={SERIF_FONT}
    >
      <span>{start} </span>
      <span className="italic text-[#a08248]">{accent}</span>
    </h2>
  )
}

export function WeddingWhitelabelFaq() {
  const t = useTranslations("wedding.faq")
  const tOffer = useTranslations("weddingWhitelabel.offer")
  const [openIndex, setOpenIndex] = useState<number>(0)
  const { ref, reveal, revealFromLeft, revealFromRight } = useScrollReveal<HTMLDivElement>()

  return (
    <section className="bg-[#faf7f2] px-4 md:px-20 py-14 md:py-24">
      <div
        ref={ref}
        className="max-w-[1280px] mx-auto flex flex-col md:flex-row gap-12 md:gap-20 items-stretch"
      >
        <div
          className={cn(
            "w-full md:flex-1 md:min-w-0 md:sticky md:top-24 flex flex-col gap-6 items-start justify-center md:self-start md:min-h-[480px]",
            revealFromLeft(),
          )}
        >
          <div className="flex flex-col gap-2 items-start">
            <Eyebrow label={t("eyebrow")} />
            <Heading start={t("headingStart")} accent={t("headingAccent")} />
          </div>
          <a
            href="#wedding-quote"
            className="group h-12 px-6 inline-flex items-center justify-center gap-2 bg-[#a08248] hover:bg-[#8a6f3c] hover:-translate-y-0.5 transition-[background-color,transform] duration-200"
          >
            <span
              className="px-2 text-[14px] font-medium uppercase tracking-[1.1px] text-white"
              style={SANS_FONT}
            >
              {tOffer("cta")}
            </span>
            <MessageSquare className="size-4 text-white" strokeWidth={2} />
          </a>
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
