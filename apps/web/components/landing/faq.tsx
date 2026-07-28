"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"

export function FAQ() {
  const t = useTranslations("faq")
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqData = [
    { question: t("questions.paymentMethods.question"), answer: t("questions.paymentMethods.answer") },
    { question: t("questions.booking.question"), answer: t("questions.booking.answer") },
    { question: t("questions.roundTrip.question"), answer: t("questions.roundTrip.answer") },
    { question: t("questions.discount.question"), answer: t("questions.discount.answer") },
    { question: t("questions.otherDestinations.question"), answer: t("questions.otherDestinations.answer") },
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section
      id="faq"
      data-theme-color="background"
      className="py-[40px] md:py-[64px] px-4 md:px-8 lg:px-[60px] xl:px-[100px]"
      style={{ backgroundColor: "var(--theme-background, #ffffff)" }}
    >
      <div className="max-w-7xl mx-auto">
        <h2 data-theme-color="faqTitle" className="font-neometric text-[28px] md:text-[36px] font-bold leading-normal mb-8 md:mb-12 w-full" style={{ color: "var(--theme-faq-title, #222222)" }}>
          <span className="block md:inline">{t("titleLine1")}</span>
          <span className="hidden md:inline"> </span>
          <span className="block md:inline">{t("titleLine2")}</span>
        </h2>

        <div className="flex flex-col gap-6 md:gap-8 lg:flex-row lg:items-start">
          <div className="flex w-full flex-col gap-2 lg:w-1/2">
            <div className="relative h-[340px] w-full lg:h-[380px] lg:w-[420px] xl:h-[450px] xl:w-[500px]">
              <Image
                src="/faq_banner.webp"
                alt="FAQ"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <div className="flex w-full flex-col justify-start gap-2 lg:w-1/2 lg:pt-8 xl:pt-6">
            {faqData.map((faq, index) => (
              <div
                key={index}
                data-theme-color="faqCardBg"
                className="overflow-hidden rounded-[5px] border"
                style={{
                  borderColor: "var(--theme-faq-card-border, rgba(191,191,191,0.5))",
                  backgroundColor: "var(--theme-faq-card-bg, #ffffff)",
                }}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="flex h-10 lg:h-12 w-full items-center justify-between pl-3 lg:pl-4 pr-2 lg:pr-3 text-left transition-colors hover:bg-black/5"
                >
                  <span data-theme-color="faqQuestionText" className="text-sm lg:text-base font-semibold leading-[1.3] tracking-[0.16px]" style={{ color: "var(--theme-faq-question-text, #222222)" }}>
                    {faq.question}
                  </span>
                  <div className="flex shrink-0 items-center">
                    <Plus
                      data-theme-color="faqIconColor"
                      className={`h-4 w-4 lg:h-5 lg:w-5 transition-transform duration-300 ${
                        openIndex === index ? "rotate-45" : ""
                      }`}
                      style={{ color: "var(--theme-faq-icon-color, #5F686C)" }}
                    />
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <p data-theme-color="faqAnswerText" className="px-3 lg:px-4 pb-3 pt-0 text-xs lg:text-sm leading-relaxed font-medium" style={{ color: "var(--theme-faq-answer-text, rgba(34,34,34,0.8))" }}>
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
