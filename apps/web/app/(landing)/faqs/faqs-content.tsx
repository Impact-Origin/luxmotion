"use client"

import { useState } from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { cn } from "@workspace/ui/lib/utils"

export function FaqsContent() {
  const t = useTranslations("faqsPage")
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs: { question: string; answer: React.ReactNode }[] = [
    { question: t("q1"), answer: t("a1") },
    {
      question: t("q2"),
      answer: (
        <>
          {t("a2_intro")}
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li>
              WhatsApp/telefone:{" "}
              <a href="tel:+351963650278" className="text-[#27c7ff] hover:underline">
                +351 963 650 278
              </a>
            </li>
            <li>
              Email:{" "}
              <a href="mailto:geral@easytransferericeira.com" className="text-[#27c7ff] hover:underline">
                geral@easytransferericeira.com
              </a>
            </li>
            <li>
              <Link href="/#contact" className="text-[#27c7ff] hover:underline">
                {t("a2_formLink")}
              </Link>
            </li>
          </ul>
        </>
      ),
    },
    { question: t("q3"), answer: t("a3") },
    {
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
    { question: t("q5"), answer: t("a5") },
    { question: t("q6"), answer: t("a6") },
    { question: t("q7"), answer: t("a7") },
    {
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
    { question: t("q10"), answer: t("a10") },
    { question: t("q11"), answer: t("a11") },
    { question: t("q12"), answer: t("a12") },
    {
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

  return (
    <section className="px-4 md:px-6 lg:px-8 py-12 md:py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-[#222222] mb-8 md:mb-10">
          {t("title")}
        </h1>
        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <div
                key={i}
                className={cn(
                  "border border-[#e5e7eb] rounded-xl overflow-hidden bg-white hover:border-[#27c7ff]/40 transition-colors",
                  isOpen && "border-[#27c7ff]/40"
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-4 md:px-5 py-4 text-left font-semibold text-[#222222] text-[15px] md:text-base cursor-pointer"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${i}`}
                  id={`faq-question-${i}`}
                >
                  <span className="pr-2">{faq.question}</span>
                  <span
                    className={cn(
                      "shrink-0 w-6 h-6 rounded-full bg-[#27c7ff]/10 flex items-center justify-center text-[#27c7ff] transition-transform duration-200 ease-out",
                      isOpen && "rotate-180"
                    )}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                      <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>
                <div
                  id={`faq-answer-${i}`}
                  role="region"
                  aria-labelledby={`faq-question-${i}`}
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <div className="px-4 md:px-5 pb-4 pt-0 text-[#65758b] text-[14px] md:text-[15px] leading-relaxed">
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
