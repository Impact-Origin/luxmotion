"use client"

import { useTranslations } from "next-intl"
import { FleetVehicleCardDark, type FleetVehicle } from "./fleet-vehicle-card-dark"

type Props = {
  categoryKey: string
  categoryLabelKey: string
  headingFirst: string
  headingAccent: string
  vehicles: FleetVehicle[]
  desktopColumns?: 2 | 3 | 4
}

export function FleetCategorySection({
  categoryKey,
  categoryLabelKey,
  headingFirst,
  headingAccent,
  vehicles,
  desktopColumns = 4,
}: Props) {
  const t = useTranslations("fleetPage")

  return (
    <section
      id={`fleet-category-${categoryKey}`}
      className="bg-[#0d0d0d] w-full px-4 md:px-[82px] pt-12 md:pt-16 scroll-mt-[80px]"
    >
      <div className="max-w-[1280px] mx-auto flex flex-col gap-8">
        <div className="border-b-[0.8px] border-[rgba(201,169,110,0.1)] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            <span
              className="self-start md:self-auto bg-[rgba(201,169,110,0.08)] border border-[rgba(201,169,110,0.2)] px-[14.8px] py-[5.8px] text-[10px] font-semibold tracking-[1.5px] uppercase text-[#c9a96e] whitespace-nowrap"
              style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
            >
              {t(categoryLabelKey)}
            </span>
            <h2
              className="text-[28px] md:text-[32px] text-white leading-[1.3] font-medium"
              style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif" }}
            >
              {headingFirst}{" "}
              <span className="italic text-[#c9a96e]">{headingAccent}</span>
            </h2>
          </div>
          <span
            className="text-[10px] tracking-[0.66px] text-[#696969] self-start md:self-auto pb-2 md:pb-0"
            style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
          >
            {t("vehicleCount", { count: vehicles.length })}
          </span>
        </div>

        <div
          className={`grid grid-cols-2 gap-[2px] ${
            desktopColumns === 2
              ? "md:grid-cols-2"
              : desktopColumns === 3
                ? "md:grid-cols-3"
                : "md:grid-cols-4"
          }`}
        >
          {vehicles.map((v) => (
            <FleetVehicleCardDark key={v.id} vehicle={v} />
          ))}
        </div>
      </div>
    </section>
  )
}
