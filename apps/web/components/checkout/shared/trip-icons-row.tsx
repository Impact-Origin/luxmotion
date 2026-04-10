"use client"

import Image from "next/image"
import { Users, Briefcase } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

interface TripIconsData {
  passengers?: number
  luggage?: number
  surfboards?: number
  childSeats?: number
  pets?: number
}

interface TripIconsRowProps {
  data: TripIconsData
  className?: string
  iconSize?: "sm" | "md"
}

export function TripIconsRow({ data, className, iconSize = "md" }: TripIconsRowProps) {
  const iconClass = iconSize === "sm" ? "w-5 h-5" : "w-6 h-6"
  const textClass = iconSize === "sm" ? "text-[13px]" : "text-[14px]"

  return (
    <div className={cn("flex items-center justify-center gap-6 py-4 text-[#27c7ff]", className)}>
      {data.passengers !== undefined && (
        <div className="flex items-center gap-1.5">
          <Users className={iconClass} />
          <span className={cn(textClass, "font-medium")}>{data.passengers}</span>
        </div>
      )}
      {data.luggage !== undefined && (
        <div className="flex items-center gap-1.5">
          <Briefcase className={iconClass} />
          <span className={cn(textClass, "font-medium")}>{data.luggage}</span>
        </div>
      )}
      {data.surfboards !== undefined && (
        <div className="flex items-center gap-1.5">
          <Image src="/svgs/surf.svg" alt="Surf" width={24} height={24} className={iconClass} />
          <span className={cn(textClass, "font-medium")}>{data.surfboards}</span>
        </div>
      )}
      {data.childSeats !== undefined && (
        <div className="flex items-center gap-1.5">
          <Image src="/svgs/baby-car-seat.svg" alt="Child seat" width={24} height={24} className={iconClass} />
          <span className={cn(textClass, "font-medium")}>{data.childSeats}</span>
        </div>
      )}
      {data.pets !== undefined && (
        <div className="flex items-center gap-1.5">
          <Image src="/svgs/paw.svg" alt="Pet" width={24} height={24} className={iconClass} />
          <span className={cn(textClass, "font-medium")}>{data.pets}</span>
        </div>
      )}
    </div>
  )
}

