"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import { useUpcomingEvents, usePublishedEvents } from "@/hooks/use-event-data"

const sans = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const
const serif = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const

function formatEventDate(timestamp: number): string {
  const d = new Date(timestamp)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return `${d.getDate()} ${months[d.getMonth()]}`
}

export function EventsHero() {
  const t = useTranslations("eventsPage.hero")
  const { events: dbEvents } = useUpcomingEvents(5)
  const { events: allEvents } = usePublishedEvents()

  // Números e ticker vêm do que está mesmo publicado. Antes caíam para valores
  // fixos (12 eventos, 5 cidades, festivais inventados) quando a base de dados
  // devolvia vazio — a página parecia cheia e os eventos reais não apareciam.
  const eventCount = allEvents.length
  const citiesCount = new Set(allEvents.map((e) => e.location)).size

  const tickerEvents = dbEvents.map((e) => ({
    title: e.title,
    date: formatEventDate(e.eventDate),
    isFeatured: e.isFeatured,
  }))

  return (
    <section className="relative w-full h-[480px] md:h-[533px] overflow-hidden">
      <Image
        src="/events/hero-meo-arena.webp"
        alt=""
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] from-[25.862%] via-[rgba(13,13,13,0.5)] via-[59.224%] to-[rgba(13,13,13,0)]" />

      <div className="absolute inset-0 flex flex-col justify-end gap-[13px] px-4 pb-10 md:px-[48px] md:pb-[88px] max-w-[1920px] mx-auto">
        <div className="flex items-center gap-[10px]">
          <div className="w-[18px] h-px bg-[#C9A96E]" />
          <span className="text-[12px] font-semibold uppercase tracking-[2px] text-[#C9A96E]" style={sans}>
            {t("eyebrow")}
          </span>
        </div>

        <div style={serif}>
          <p className="text-[48px] md:text-[96px] min-[1440px]:text-[82px] min-[1920px]:text-[96px] font-light leading-none text-white">
            {t("headingLine1")}
          </p>
          <p className="text-[48px] md:text-[96px] min-[1440px]:text-[82px] min-[1920px]:text-[96px] font-light italic leading-none text-[#C9A96E]">
            {t("headingLine2")}
          </p>
        </div>

        <p className="text-[18px] font-light leading-[1.3] text-[#999] max-w-[663px]" style={sans}>
          {t("subtitle")}
        </p>

        <div className="hidden md:flex flex-wrap items-center gap-x-4 pt-2">
          <span className="text-[32px] leading-none text-[#C9A96E]" style={serif}>{eventCount}</span>
          <span className="text-[14px] text-[#999]" style={sans}>{t("upcomingEvents")}</span>
          <div className="w-px h-5 bg-[rgba(255,255,255,0.1)]" />
          <span className="text-[32px] leading-none text-[#C9A96E]" style={serif}>{citiesCount}</span>
          <span className="text-[14px] text-[#999]" style={sans}>{t("citiesCovered")}</span>
          <div className="w-px h-5 bg-[rgba(255,255,255,0.1)]" />
          <span className="text-[32px] leading-none text-[#C9A96E]" style={serif}>24h</span>
          <span className="text-[14px] text-[#999]" style={sans}>{t("bookingAvailable")}</span>
        </div>

        <div className="grid grid-cols-3 w-full md:hidden pt-2">
          {[
            { num: String(eventCount), label: t("upcomingEvents") },
            { num: String(citiesCount), label: t("citiesCovered") },
            { num: "24h", label: t("bookingAvailable") },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <span className="text-[32px] leading-none text-[#C9A96E]" style={serif}>{s.num}</span>
              <span className="text-[14px] text-[#999]" style={sans}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sem eventos publicados não há ticker — senão ficava uma caixa vazia. */}
      {tickerEvents.length > 0 && (
      <div
        className="hidden lg:flex flex-col gap-[6px] absolute right-[48px] bottom-[86px] backdrop-blur-[5px] bg-[rgba(13,13,13,0.75)] border-l-[0.8px] border-[rgba(201,169,110,0.12)] px-[19px] py-[14px]"
        style={sans}
      >
        {tickerEvents.map((event, i) => (
          <div
            key={i}
            className={`text-[12px] tracking-[0.72px] whitespace-nowrap ${event.isFeatured ? "text-[#C9A96E]" : "text-[#999]"}`}
          >
            {event.isFeatured ? "● " : ""}
            {event.title} · {event.date}
          </div>
        ))}
      </div>
      )}
    </section>
  )
}
