"use client"

import Image from "next/image"
import { User, Briefcase, Wifi } from "lucide-react"
import { useTranslations } from "next-intl"
import type { FleetVehicle } from "@/lib/fleet-data"

interface FleetVehicleCardProps {
  vehicle: FleetVehicle
}

export function FleetVehicleCard({ vehicle }: FleetVehicleCardProps) {
  const t = useTranslations("fleetPage")

  return (
    <div className="relative flex flex-col items-center justify-end w-full min-w-0 max-w-full md:max-w-[360px] min-h-[300px] md:min-h-[340px] bg-white rounded-[1rem] p-6 pb-8 border border-[#27c7ff]/20 shadow-[0px_18px_20px_rgba(0,0,0,0.05)] transition-transform duration-300 ease-out hover:scale-[1.03]">
      {vehicle.isElectric && (
        <div className="absolute right-8 top-[35%] -translate-y-1/2 z-0 w-28 h-28 md:w-24 md:h-24 opacity-80">
          <Image
            src="/fleet/energia-eletrica-1.webp"
            alt=""
            width={112}
            height={112}
            className="w-full h-full object-contain"
          />
        </div>
      )}

      <div className="absolute top-5 left-5 z-10">
        <div className="px-2.5 py-1 h-7 rounded-md bg-[#27c7ff] flex items-center justify-center">
          <span className="text-xs font-medium uppercase tracking-wide text-white">
            {t(`category.${vehicle.category}`)}
          </span>
        </div>
      </div>

      <div className="relative z-10 w-full flex items-center justify-center flex-1 min-h-[220px] md:min-h-[200px]">
        <Image
          src={vehicle.img}
          alt={vehicle.title}
          width={320}
          height={200}
          className="w-auto h-auto max-h-[265px] md:max-h-[240px] object-contain"
        />
      </div>

      <h3 className="text-base font-bold tracking-wide text-center text-[#222222] mt-[-20px] leading-tight">
        {vehicle.title}
      </h3>

      <div className="mt-6 md:mt-8 flex items-center gap-2 md:gap-3 flex-wrap justify-center">
        {vehicle.passengers > 0 && (
          <div className="flex items-center gap-0.5 md:gap-1">
            <User className="w-4 h-4 md:w-6 md:h-6 text-[#27c7ff]" strokeWidth={2.5} />
            <span className="flex h-4 w-4 md:h-5 md:w-5 items-center justify-center rounded-full bg-[#f3f4f6] border border-[#e5e7eb] text-[9px] md:text-[10px] font-semibold text-[#374151] shadow-sm">
              {vehicle.passengers}
            </span>
          </div>
        )}
        {vehicle.briefcase > 0 && (
          <div className="flex items-center gap-0.5 md:gap-1">
            <Briefcase className="w-4 h-4 md:w-6 md:h-6 text-[#27c7ff]" strokeWidth={2.5} />
            <span className="flex h-4 w-4 md:h-5 md:w-5 items-center justify-center rounded-full bg-[#f3f4f6] border border-[#e5e7eb] text-[9px] md:text-[10px] font-semibold text-[#374151] shadow-sm">
              {vehicle.briefcase}
            </span>
          </div>
        )}
        {vehicle.wifi && (
          <div className="flex items-center justify-center">
            <Wifi className="w-4 h-4 md:w-6 md:h-6 text-[#27c7ff]" strokeWidth={2.5} />
          </div>
        )}
      </div>
    </div>
  )
}
