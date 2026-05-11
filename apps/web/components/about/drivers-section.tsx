"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "@workspace/convex/api"
import { cn } from "@workspace/ui/lib/utils"
import Image from "next/image"

type Driver = {
  id: string
  name: string
  location: string
  quote: string
  image: string
}

const FALLBACK_DRIVERS: Driver[] = [
  { id: "joao", name: "João", location: "Lisboa", image: "/about/driver-joao.png", quote: "“Every guest is a friend I haven't met yet. I love sharing the hidden gems of my city.”" },
  { id: "maria", name: "Maria", location: "Porto", image: "/about/driver-maria.png", quote: "“Safety and comfort are my priorities. I treat every passenger like family.”" },
  { id: "pedro", name: "Pedro", location: "Algarve", image: "/about/driver-pedro.png", quote: "“20 years of driving taught me that the journey matters as much as the destination.”" },
]

function DriverCard({ d }: { d: Driver }) {
  return (
    <div className="group relative bg-[#0D0D0D] hover:bg-[#161412] transition-colors duration-500 ease-out border border-[rgba(154,117,53,0.22)] flex flex-col items-center px-9 py-12 h-full w-full">
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-px w-full -translate-x-1/2 origin-center scale-x-0 transition-transform duration-700 ease-out group-hover:scale-x-100"
        style={{
          background:
            "linear-gradient(to right, transparent 0%, rgba(201,169,110,0) 8%, #C9A96E 50%, rgba(201,169,110,0) 92%, transparent 100%)",
        }}
      />
      <div className="size-20 rounded-full overflow-hidden bg-[#1a1a1a] border border-[rgba(201,169,110,0.2)] mb-5">
        <Image src={d.image} alt={d.name} width={80} height={80} className="object-cover size-full" />
      </div>
      <h3
        className="text-white text-[18px] font-medium text-center mb-[6px]"
        style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif" }}
      >
        {d.name}
      </h3>
      <p
        className="text-[#C9A96E] text-[12px] uppercase tracking-[1.5px] text-center mb-4"
        style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
      >
        {d.location}
      </p>
      <p
        className="text-[#999] text-[12px] leading-[1.3] text-center"
        style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
      >
        {d.quote}
      </p>
    </div>
  )
}

function CarouselArrow({
  direction,
  onClick,
  disabled,
}: {
  direction: "left" | "right"
  onClick: () => void
  disabled: boolean
}) {
  const Icon = direction === "left" ? ArrowLeft : ArrowRight
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "size-12 border border-[rgba(154,117,53,0.4)] flex items-center justify-center text-[#C9A96E] transition-colors",
        disabled ? "opacity-30 cursor-not-allowed" : "hover:bg-[rgba(201,169,110,0.08)]",
      )}
      aria-label={direction === "left" ? "Previous" : "Next"}
    >
      <Icon className="size-[18px]" strokeWidth={1.5} />
    </button>
  )
}

export function DriversSection() {
  const t = useTranslations("aboutPage.drivers")
  const [idx, setIdx] = useState(0)
  const [pageSize, setPageSize] = useState(3)
  const dbDrivers = useQuery(api.drivers.listPublished)

  useEffect(() => {
    const update = () => setPageSize(window.innerWidth >= 768 ? 3 : 1)
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  const drivers: Driver[] =
    dbDrivers && dbDrivers.length > 0
      ? dbDrivers.map((d) => ({
          id: d._id,
          name: d.name,
          location: d.location,
          quote: d.quote,
          image: d.imageUrl ?? "/about/driver-joao.png",
        }))
      : FALLBACK_DRIVERS.map((d) => ({
          ...d,
          name: t(`items.${d.id}.name`),
          location: t(`items.${d.id}.location`),
          quote: t(`items.${d.id}.quote`),
        }))

  const maxIdx = Math.max(0, drivers.length - pageSize)
  const safeIdx = Math.min(idx, maxIdx)
  const pageCount = Math.max(1, drivers.length - pageSize + 1)
  const slidePercent = 100 / pageSize

  return (
    <section className="bg-[#0D0D0D] flex flex-col items-center px-4 md:px-[82px] py-16 md:py-20">
      <div className="flex flex-col gap-6 items-center w-full max-w-[1280px]">
        <div className="flex flex-col items-center w-full gap-2">
          <div className="flex gap-2 items-center justify-center w-full">
            <div className="w-8 h-px bg-[#C9A96E]" />
            <span
              className="text-[12px] font-semibold uppercase tracking-[2px] text-[#C9A96E] whitespace-nowrap"
              style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
            >
              {t("eyebrow")}
            </span>
            <div className="w-8 h-px bg-[#C9A96E]" />
          </div>
          <h2
            className="text-white font-normal text-center leading-[1.2]"
            style={{
              fontFamily: "var(--font-title), 'Cormorant Garamond', serif",
              fontSize: "clamp(2rem, 3.4vw, 3rem)",
            }}
          >
            {t("heading")}
          </h2>
        </div>

        <div className="w-full overflow-hidden bg-[rgba(201,169,110,0.07)]">
          <div
            className="flex gap-[2px] transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${safeIdx * slidePercent}%)` }}
          >
            {drivers.map((d) => (
              <div
                key={d.id}
                className="shrink-0"
                style={{ width: `calc(${slidePercent}% - ${(2 * (pageSize - 1)) / pageSize}px)` }}
              >
                <DriverCard d={d} />
              </div>
            ))}
          </div>
        </div>

        {pageCount > 1 && (
          <div className="flex items-center justify-center gap-2">
            <CarouselArrow
              direction="left"
              onClick={() => setIdx((i) => Math.max(i - 1, 0))}
              disabled={safeIdx === 0}
            />
            <div className="flex gap-2 items-center px-4">
              {Array.from({ length: pageCount }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIdx(i)}
                  aria-label={`Go to driver ${i + 1}`}
                  className={cn(
                    "rounded-full transition-all",
                    i === safeIdx ? "size-[6px] bg-[#C9A96E]" : "size-[5px] bg-[rgba(201,169,110,0.4)]",
                  )}
                />
              ))}
            </div>
            <CarouselArrow
              direction="right"
              onClick={() => setIdx((i) => Math.min(i + 1, maxIdx))}
              disabled={safeIdx >= maxIdx}
            />
          </div>
        )}
      </div>
    </section>
  )
}
