"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import { ArrowRight, AirVent, Briefcase, User, Wifi } from "lucide-react"

export type FleetBadge = "available" | "eco" | "electric"

export type FleetVehicle = {
  id: string
  name: string
  image: string
  badges: FleetBadge[]
  paxMin: number
  paxMax: number
  bags: number
  hasAc?: boolean
  hasWifi?: boolean
  variant?: "default" | "large"
}

const BADGE_STYLES: Record<FleetBadge, string> = {
  available: "bg-[rgba(255,255,255,0.06)] border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.5)]",
  eco: "bg-[rgba(76,175,80,0.2)] border-[rgba(76,175,80,0.3)] text-[#81c784]",
  electric: "bg-[rgba(33,150,243,0.15)] border-[rgba(33,150,243,0.3)] text-[#64b5f6]",
}

export function FleetVehicleCardDark({ vehicle }: { vehicle: FleetVehicle }) {
  const t = useTranslations("fleetPage")

  return (
    <div className="bg-[#1a1a1a] group-hover:bg-[#1e1c1a] hover:bg-[#1e1c1a] transition-colors duration-500 ease-out flex flex-col overflow-clip relative group">
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-[1.5px] w-full origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out z-[4]"
        style={{
          background:
            "linear-gradient(to right, transparent 0%, rgba(201,169,110,0) 8%, #C9A96E 50%, rgba(201,169,110,0) 92%, transparent 100%)",
        }}
      />
      <div className="absolute top-3 left-3 right-3 flex gap-[2px] z-[3]">
        {vehicle.badges.map((b) => (
          <span
            key={b}
            className={`inline-flex items-center px-[8.8px] py-[3.8px] border text-[8px] font-semibold tracking-[0.8px] uppercase whitespace-nowrap ${BADGE_STYLES[b]}`}
            style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
          >
            {t(`badges.${b}`)}
          </span>
        ))}
      </div>

      <div className="relative h-[180px] w-full bg-[#0d0d0d] z-[2]">
        <Image
          src={vehicle.image}
          alt={vehicle.name}
          fill
          className="object-contain transition-transform duration-500 group-hover:scale-[1.015]"
          sizes="(min-width: 768px) 25vw, 50vw"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.1) 33.22%, rgba(201,169,110,0.1) 100%)",
          }}
        />
      </div>

      <div className="flex flex-col gap-3 px-5 pt-[18px] pb-6 flex-1 z-[1]">
        <h3
          className="text-[24px] leading-[1.3] text-white font-semibold transition-colors duration-500 ease-out group-hover:text-[#C9A96E]"
          style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif" }}
        >
          {vehicle.name}
        </h3>

        <div
          className="flex flex-wrap gap-x-3 gap-y-2 text-[12px] text-[#999999]"
          style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
        >
          <MetaItem icon={<User className="size-[14px]" strokeWidth={1.5} />}>
            {vehicle.variant === "large"
              ? t("meta.upToPax", { count: vehicle.paxMax })
              : t("meta.pax", { min: vehicle.paxMin, max: vehicle.paxMax })}
          </MetaItem>
          <MetaItem icon={<Briefcase className="size-[14px]" strokeWidth={1.5} />}>
            {vehicle.variant === "large"
              ? t("meta.largeCargo")
              : t("meta.bags", { count: vehicle.bags })}
          </MetaItem>
          {vehicle.hasAc && (
            <MetaItem icon={<AirVent className="size-[14px]" strokeWidth={1.5} />}>
              {t("meta.ac")}
            </MetaItem>
          )}
          {vehicle.hasWifi && (
            <MetaItem icon={<Wifi className="size-[14px]" strokeWidth={1.5} />}>
              {t("meta.wifi")}
            </MetaItem>
          )}
        </div>

        <div className="border-t-[0.8px] border-[rgba(255,255,255,0.12)] pt-[12.8px] flex items-center justify-between mt-auto">
          <span
            className="text-[12px] font-semibold tracking-[0.9px] uppercase text-[#8c8680] leading-[1.15] md:leading-none"
            style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
          >
            {(() => {
              const [first, ...rest] = t("bookVehicle").split(" ")
              return (
                <>
                  {first}{" "}
                  <br className="md:hidden" />
                  {rest.join(" ")}
                </>
              )
            })()}
          </span>
          <button
            type="button"
            aria-label={t("bookVehicle")}
            className="size-8 shrink-0 aspect-square border-[1.143px] border-[rgba(255,255,255,0.3)] flex items-center justify-center transition-colors duration-500 ease-out group-hover:border-[#C9A96E] group-hover:bg-[#C9A96E] hover:border-[#C9A96E] hover:bg-[#C9A96E]"
          >
            <ArrowRight className="size-[18px] text-white group-hover:text-[#0D0D0D] transition-colors duration-500 ease-out" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  )
}

function MetaItem({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-[5px] h-[15px]">
      <span className="shrink-0 text-[#999999]">{icon}</span>
      <span className="leading-none whitespace-nowrap">{children}</span>
    </div>
  )
}
