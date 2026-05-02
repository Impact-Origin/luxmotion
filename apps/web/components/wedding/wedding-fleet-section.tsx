"use client"

import Image from "next/image"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { ArrowRight } from "lucide-react"

const SERIF_FONT = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const
const SANS_FONT = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const

const VEHICLES = [
  { src: "/wedding/fleet-executive.png", nameKey: "v1.name", capacityKey: "v1.capacity" },
  { src: "/wedding/fleet-supercar.png", nameKey: "v2.name", capacityKey: "v2.capacity" },
  { src: "/wedding/fleet-classic.png", nameKey: "v3.name", capacityKey: "v3.capacity" },
  { src: "/wedding/fleet-van.png", nameKey: "v4.name", capacityKey: "v4.capacity" },
  { src: "/wedding/fleet-coach.png", nameKey: "v5.name", capacityKey: "v5.capacity" },
] as const

function VehicleCard({
  src,
  name,
  capacity,
}: {
  src: string
  name: string
  capacity: string
}) {
  return (
    <div className="bg-white border border-[rgba(28,27,24,0.08)] shadow-[0_2px_6px_rgba(0,0,0,0.04)] flex flex-col items-center self-stretch w-full pt-6">
      <div className="relative h-[118.354px] w-[180px] max-w-full">
        <Image
          src={src}
          alt={name}
          fill
          sizes="180px"
          className="object-contain"
        />
      </div>
      <div className="flex flex-col gap-2 items-center justify-center px-6 py-4 w-full">
        <h3
          className="text-[24px] leading-tight font-medium text-[#1a1612] text-center"
          style={SERIF_FONT}
        >
          {name}
        </h3>
        <p
          className="text-[12px] leading-[1.2] text-[#8c8680] text-center"
          style={SANS_FONT}
        >
          {capacity}
        </p>
      </div>
    </div>
  )
}

function Eyebrow({ label }: { label: string }) {
  return (
    <div className="flex gap-3 items-center justify-center">
      <span className="h-px w-7 bg-[#a8833a]" />
      <span
        className="text-[9px] font-semibold uppercase tracking-[2.52px] text-[#a8833a] whitespace-nowrap"
        style={SANS_FONT}
      >
        {label}
      </span>
      <span className="h-px w-7 bg-[#a8833a]" />
    </div>
  )
}

function Heading({ start, accent }: { start: string; accent: string }) {
  return (
    <h2
      className="text-[36px] md:text-[44px] leading-tight font-light text-[#1a1612] text-center"
      style={SERIF_FONT}
    >
      <span>{start} </span>
      <span className="italic font-light text-[#a8833a]">{accent}</span>
    </h2>
  )
}

function FleetCta({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex h-12 items-center px-6 bg-[#a08248] hover:bg-[#8a6f3c] transition-colors"
    >
      <span
        className="px-2 text-[14px] font-medium uppercase tracking-[1.1px] text-white"
        style={SANS_FONT}
      >
        {label}
      </span>
      <ArrowRight className="size-3 text-white" strokeWidth={2.5} />
    </Link>
  )
}

export function WeddingFleetSection() {
  const t = useTranslations("wedding.fleet")

  return (
    <section className="bg-[#f7f4ef] border-t border-t-[rgba(168,131,58,0.1)] px-4 md:px-20 py-14 md:py-24">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-6">
        <div className="flex flex-col gap-2 items-center w-full">
          <Eyebrow label={t("eyebrow")} />
          <Heading start={t("headingStart")} accent={t("headingAccent")} />
        </div>

        <div className="hidden md:flex gap-[2px] items-stretch w-full">
          {VEHICLES.map((v, i) => (
            <div key={i} className="flex-1 min-w-0 flex">
              <VehicleCard
                src={v.src}
                name={t(v.nameKey)}
                capacity={t(v.capacityKey)}
              />
            </div>
          ))}
        </div>

        <div className="md:hidden grid grid-cols-2 gap-[2px]">
          {VEHICLES.map((v, i) => (
            <div key={i} className="flex">
              <VehicleCard
                src={v.src}
                name={t(v.nameKey)}
                capacity={t(v.capacityKey)}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-center pt-[22px] w-full">
          <FleetCta label={t("ctaLabel")} href={t("ctaHref")} />
        </div>
      </div>
    </section>
  )
}
