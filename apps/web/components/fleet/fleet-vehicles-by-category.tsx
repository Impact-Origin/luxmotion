"use client"

import { useTranslations } from "next-intl"
import { FLEET_BY_CATEGORY } from "@/lib/fleet-data"
import { FleetVehicleCard } from "./fleet-vehicle-card"

export function FleetVehiclesByCategory() {
  const t = useTranslations("fleetPage")

  return (
    <section className="flex flex-col items-center gap-5 md:gap-6 pb-[100px] px-4 md:px-8">
      <h1 className="text-center font-bold text-[#222222] text-[2.25rem] md:text-[3rem] leading-[100%] mb-0">
        {t("exploreFleet")}
      </h1>

      <div className="flex flex-col items-center gap-12 md:gap-16 w-full max-w-[1168px]">
        {FLEET_BY_CATEGORY.map((vehicles) => {
          const category = vehicles[0]?.category
          const categoryLabel = t(`category.${category}`)

          return (
            <div
              key={category}
              className="flex flex-col items-center justify-center gap-8 w-full"
            >
              <div className="w-full flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-4 mb-2 mt-4">
                <span className="text-xl md:text-2xl font-bold leading-none text-[#27c7ff] shrink-0">
                  {categoryLabel}
                </span>
                <div className="w-full sm:flex-1 h-0.5 bg-[#DFF7FF] min-w-0" />
              </div>

              <div className="grid grid-cols-2 md:flex md:flex-wrap justify-start gap-4 w-full">
                {vehicles.map((vehicle) => (
                  <FleetVehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
