"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { Calendar, MapPin, Search, Loader2 } from "lucide-react"
import { useFilteredEvents, type EventData } from "@/hooks/use-event-data"

const sans = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const
const serif = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const

const CATEGORIES = ["all", "music", "sports", "culture", "corporate"] as const

function formatDate(timestamp: number, endDate?: number): string {
  const d = new Date(timestamp)
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  if (endDate) {
    const e = new Date(endDate)
    return `${d.getDate()}–${e.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
  }
  const hours = d.getHours()
  const mins = d.getMinutes()
  const time = hours > 0 || mins > 0 ? ` · ${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}` : ""
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}${time}`
}

function EventGridCard({ event, featuredLabel }: { event: EventData; featuredLabel: string }) {
  return (
    <Link
      href={`/events/${event.slug}`}
      className="bg-[#161616] flex flex-col md:h-[355px] overflow-clip group"
    >
      <div className="relative h-[150px] md:h-[195px] shrink-0 overflow-clip">
        {event.bannerImageUrl && (
          <Image
            src={event.bannerImageUrl}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        )}
        {event.isFeatured && (
          <div className="absolute top-[9px] left-[9px] bg-[#C9A96E] px-2 py-[3px]">
            <span className="text-[11px] md:text-[12px] font-medium text-[#0D0D0D] uppercase tracking-[0.98px]" style={sans}>
              {featuredLabel}
            </span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[rgba(10,10,10,0.88)] to-[rgba(10,10,10,0)] pt-[18px] pb-[9px] px-3 flex items-center gap-[6px]">
          <Calendar className="size-4 text-[rgba(255,255,255,0.82)] shrink-0" strokeWidth={1.5} />
          <span className="text-[11px] md:text-[12px] font-medium text-[rgba(255,255,255,0.82)] whitespace-nowrap" style={sans}>
            {formatDate(event.eventDate, event.endDate)}
          </span>
        </div>
      </div>
      <div className="flex flex-col flex-1 p-3 md:p-4">
        <div className="flex items-center gap-1 pb-[7px]">
          <MapPin className="size-4 text-[rgba(255,255,255,0.32)] shrink-0" strokeWidth={1.5} />
          <span className="text-[11px] md:text-[12px] text-[rgba(255,255,255,0.32)] truncate" style={sans}>{event.location}</span>
          {event.venue && (
            <>
              <span className="text-[10px] text-[rgba(255,255,255,0.18)] px-[2px]">·</span>
              <span className="text-[11px] md:text-[12px] text-[rgba(255,255,255,0.32)] truncate" style={sans}>{event.venue}</span>
            </>
          )}
        </div>
        <h3 className="text-[15px] md:text-[18px] font-bold text-white leading-[20px] md:leading-[24px] pb-[5px]" style={serif}>
          {event.title}
        </h3>
        <p className="text-[11px] md:text-[12px] text-[#999] leading-[1.3] line-clamp-2 flex-1" style={sans}>
          {event.subtitle}
        </p>
        <div className="border-t-[0.8px] border-[rgba(255,255,255,0.07)] flex items-center justify-between pt-3 mt-auto">
          <span className="flex items-center gap-2">
            {event.originalPrice && (
              <span className="text-[10px] text-[rgba(255,255,255,0.18)] line-through" style={sans}>
                €{event.originalPrice}
              </span>
            )}
            <span className="text-[18px] md:text-[20px] text-[#C9A96E]" style={serif}>
              €{event.basePrice}
            </span>
          </span>
          {event.tags?.[0] && (
            <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] px-[8.8px] py-[3.8px] hidden md:flex">
              <span className="text-[12px] text-[rgba(255,255,255,0.32)] tracking-[0.45px]" style={sans}>
                {event.tags[0]}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export function AllEventsSection() {
  const t = useTranslations("eventsPage")
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState<string>("all")

  const { events, isLoading } = useFilteredEvents({
    search,
    status: "published",
    sortBy: "date_asc",
  })

  const filteredEvents = useMemo(() => {
    if (activeCategory === "all") return events
    return events.filter(e =>
      e.tags?.some(tag => tag.toLowerCase() === activeCategory.toLowerCase())
    )
  }, [events, activeCategory])

  return (
    <section className="bg-[#0D0D0D] pt-8 md:pt-[72px] pb-10 md:pb-[96px] px-4 md:px-[82px]">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-7 md:gap-8">
        <div className="flex flex-col gap-5 md:gap-7">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
            <div className="flex flex-col gap-[10px]">
              <div className="flex items-center gap-[10px]">
                <div className="w-5 h-px bg-[#C9A96E]" />
                <span className="text-[12px] font-semibold uppercase tracking-[2px] text-[#C9A96E]" style={sans}>
                  {t("allEventsLabel")}
                </span>
              </div>
              <h2 className="text-[32px] md:text-[48px] font-light text-white leading-none" style={serif}>
                {t("allEventsHeading")}{" "}
                <span className="italic text-[#C9A96E]">{t("allEventsHeadingAccent")}</span>
              </h2>
            </div>
            <span className="text-[12px] text-[rgba(255,255,255,0.32)]" style={sans}>
              {filteredEvents.length} {t("eventCountSuffix")}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
            <div className="flex items-center shrink-0">
              <div className="flex items-center h-[44px] bg-[#1e1d1b] border-y-[0.78px] border-l-[0.78px] border-[rgba(255,255,255,0.12)] px-[10px] gap-[6px] flex-1 md:w-[300px]">
                <Search className="size-[19px] text-[rgba(255,255,255,0.22)] shrink-0" strokeWidth={1.5} />
                <input
                  type="text"
                  placeholder={t("searchPlaceholder")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent text-[12px] text-white placeholder-[rgba(255,255,255,0.22)] outline-none w-full"
                  style={sans}
                />
              </div>
              <button className="h-[44px] bg-[#C9A96E] border-[0.78px] border-[#C9A96E] px-[17px] shrink-0 hover:bg-[#b8954f] transition-colors">
                <span className="text-[11px] font-medium uppercase tracking-[1.1px] text-[#0D0D0D] whitespace-nowrap" style={sans}>
                  {t("searchButton")}
                </span>
              </button>
            </div>
            <div className="flex gap-2 items-center overflow-x-auto no-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`h-8 px-[14.8px] text-[12px] uppercase tracking-[0.7px] whitespace-nowrap transition-colors shrink-0 ${
                    activeCategory === cat
                      ? "bg-[rgba(201,169,110,0.08)] border border-[rgba(201,169,110,0.18)] text-[#C9A96E]"
                      : "border border-[rgba(255,255,255,0.07)] text-[rgba(255,255,255,0.32)] hover:text-[rgba(255,255,255,0.5)]"
                  }`}
                  style={sans}
                >
                  {t(`category${cat.charAt(0).toUpperCase() + cat.slice(1)}`)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="size-8 animate-spin text-[#999]" />
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 border border-dashed border-[rgba(255,255,255,0.12)]">
            <Calendar className="size-12 text-[#666] mb-4" />
            <h3 className="text-[18px] font-bold text-white mb-2" style={serif}>{t("noEventsFound")}</h3>
            <p className="text-[14px] text-[#999]" style={sans}>
              {search || activeCategory !== "all" ? t("tryFilters") : t("checkBackSoon")}
            </p>
            {(search || activeCategory !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("")
                  setActiveCategory("all")
                }}
                className="mt-5 h-11 border border-[#C9A96E] bg-[#C9A96E] px-5 text-[11px] font-medium uppercase tracking-[1.1px] text-[#0D0D0D] transition-colors hover:bg-[#b8954f]"
                style={sans}
              >
                {t("allEventsLabel")}
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-[10px]">
            {filteredEvents.map((event) => (
              <EventGridCard key={event._id} event={event} featuredLabel={t("featured")} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
