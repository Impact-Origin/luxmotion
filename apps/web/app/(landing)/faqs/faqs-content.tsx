"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@workspace/ui/lib/utils"

const sans = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const
const serifItalic = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const

type CategoryKey = "all" | "booking" | "services" | "payment" | "operations"

interface FaqItem {
  id: number
  category: Exclude<CategoryKey, "all">
  question: string
  answer: React.ReactNode
}

interface FaqsContentProps {
  searchQuery?: string
}

export function FaqsContent({ searchQuery = "" }: FaqsContentProps) {
  const t = useTranslations("faqsPage")
  const tc = useTranslations("faqsPage.categories")
  const [openIndex, setOpenIndex] = useState<number | null>(1)
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("all")

  const categories: { key: CategoryKey; label: string }[] = [
    { key: "all", label: tc("all") },
    { key: "booking", label: tc("booking") },
    { key: "services", label: tc("services") },
    { key: "payment", label: tc("payment") },
    { key: "operations", label: tc("operations") },
  ]

  const faqs: FaqItem[] = [
    { id: 1, category: "payment", question: t("q1"), answer: t("a1") },
    {
      id: 2,
      category: "operations",
      question: t("q2"),
      answer: (
        <>
          {t("a2_intro")}
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li>
              WhatsApp:{" "}
              <a href="tel:+351963650278" className="text-[#9A7535] hover:underline">
                +351 963 650 278
              </a>
            </li>
            <li>
              Email:{" "}
              <a href="mailto:geral@easytransferericeira.com" className="text-[#9A7535] hover:underline">
                geral@easytransferericeira.com
              </a>
            </li>
            <li>
              <Link href="/#contact" className="text-[#9A7535] hover:underline">
                {t("a2_formLink")}
              </Link>
            </li>
          </ul>
        </>
      ),
    },
    { id: 3, category: "booking", question: t("q3"), answer: t("a3") },
    {
      id: 4,
      category: "services",
      question: t("q4"),
      answer: (
        <>
          {t("a4_intro")}
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li>{t("a4_1")}</li>
            <li>{t("a4_2")}</li>
            <li>{t("a4_3")}</li>
            <li>{t("a4_4")}</li>
            <li>{t("a4_5")}</li>
          </ul>
        </>
      ),
    },
    { id: 5, category: "booking", question: t("q5"), answer: t("a5") },
    { id: 6, category: "booking", question: t("q6"), answer: t("a6") },
    { id: 7, category: "services", question: t("q7"), answer: t("a7") },
    {
      id: 8,
      category: "services",
      question: t("q8"),
      answer: (
        <>
          {t("a8_intro")}
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li>{t("a8_1")}</li>
            <li>{t("a8_2")}</li>
            <li>{t("a8_3")}</li>
          </ul>
          {t("a8_outro")}
        </>
      ),
    },
    {
      id: 9,
      category: "services",
      question: t("q9"),
      answer: (
        <>
          {t("a9_intro")}
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li>{t("a9_1")}</li>
            <li>{t("a9_2")}</li>
            <li>{t("a9_3")}</li>
            <li>{t("a9_4")}</li>
          </ul>
        </>
      ),
    },
    { id: 10, category: "services", question: t("q10"), answer: t("a10") },
    { id: 11, category: "booking", question: t("q11"), answer: t("a11") },
    { id: 12, category: "operations", question: t("q12"), answer: t("a12") },
    {
      id: 13,
      category: "operations",
      question: t("q13"),
      answer: (
        <ul className="list-disc list-inside space-y-1">
          <li>{t("a13_1")}</li>
          <li>{t("a13_2")}</li>
          <li>{t("a13_3")}</li>
          <li>{t("a13_4")}</li>
        </ul>
      ),
    },
  ]

  const filteredFaqs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return faqs.filter((faq) => {
      if (activeCategory !== "all" && faq.category !== activeCategory) return false
      if (q && !faq.question.toLowerCase().includes(q)) return false
      return true
    })
  }, [faqs, activeCategory, searchQuery])

  return (
    <section className="bg-[#F7F4EF] pt-6 pb-[82px] px-4">
      <div className="max-w-[860px] mx-auto flex flex-col gap-12">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="FAQ categories">
          {categories.map((c) => {
            const active = activeCategory === c.key
            return (
              <button
                key={c.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setActiveCategory(c.key)
                  setOpenIndex(null)
                }}
                className={cn(
                  "h-[37px] px-[20px] py-[10px] text-[12px] font-semibold uppercase tracking-[1.2px] leading-none transition-colors",
                  active
                    ? "bg-[#A08248] text-white border border-[#A08248]"
                    : "bg-white text-[#8C8680] border border-[rgba(28,27,24,0.08)] hover:border-[rgba(28,27,24,0.2)] hover:text-[#1C1B18]",
                )}
                style={sans}
              >
                {c.label}
              </button>
            )
          })}
        </div>

        <div className="flex flex-col gap-4">
          {filteredFaqs.length === 0 && (
            <p className="text-center py-12 text-[14px] text-[#8C8680]" style={sans}>
              {t("noResults")}
            </p>
          )}
          {filteredFaqs.map((faq) => {
            const isOpen = openIndex === faq.id
            const numLabel = String(faq.id).padStart(2, "0")
            return (
              <div
                key={faq.id}
                className={cn(
                  "bg-white border transition-colors",
                  isOpen
                    ? "border-[#9A7535] shadow-[0_8px_32px_0_rgba(154,117,53,0.06)]"
                    : "border-[rgba(28,27,24,0.08)] hover:border-[rgba(28,27,24,0.2)]",
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                  id={`faq-question-${faq.id}`}
                  className="flex w-full items-center justify-between gap-4 px-7 py-6 text-left"
                >
                  <div className="flex flex-1 items-center gap-4 min-w-0">
                    <span
                      className="shrink-0 min-w-6 pr-[13px] pt-[2px] text-[24px] font-bold italic leading-none text-[#9A7535] opacity-60"
                      style={serifItalic}
                    >
                      {numLabel}
                    </span>
                    <span
                      className={cn(
                        "text-[14px] font-semibold leading-[1.6]",
                        isOpen ? "text-[#9A7535]" : "text-[#1C1B18]",
                      )}
                      style={sans}
                    >
                      {faq.question}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 size-8 flex items-center justify-center transition-colors duration-300",
                      isOpen
                        ? "bg-[#A08248] border border-[#A08248]"
                        : "border-[1.143px] border-[rgba(28,27,24,0.08)]",
                    )}
                  >
                    <Plus
                      className={cn(
                        "size-[18px] transition-transform duration-300",
                        isOpen ? "text-white rotate-45" : "text-[#1C1B18]",
                      )}
                      strokeWidth={2}
                    />
                  </span>
                </button>
                <div
                  id={`faq-answer-${faq.id}`}
                  role="region"
                  aria-labelledby={`faq-question-${faq.id}`}
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <div
                      className="pl-[68px] pr-7 pb-7 pt-1 text-[13.5px] leading-[1.6] text-[#696969]"
                      style={sans}
                    >
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
