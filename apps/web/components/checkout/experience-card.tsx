"use client"

import { Plus, Clock, MapPin } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"

interface ExperienceCardProps {
  title: string
  price: number
  duration: string
  image: string
  distanceKm?: number
  onAdd?: () => void
}

export function ExperienceCard({ title, price, duration, image, distanceKm, onAdd }: ExperienceCardProps) {
  const t = useTranslations("experiences")

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#dedede]">
      <div className="relative h-56">
        <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
        {distanceKm !== undefined && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-medium text-[#0E4659]">
            <MapPin className="w-3.5 h-3.5" />
            {t("distanceAway", { distance: distanceKm })}
          </div>
        )}
      </div>
      <div className="p-4 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-[#222] truncate">{title}</h3>
          <div className="flex items-center gap-1.5 text-[#0E4659] bg-[#e9f9ff] px-2.5 py-1 rounded-2xl w-fit mt-1">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">{duration}</span>
          </div>
        </div>
        <div className="text-xl font-extrabold text-[#222] shrink-0">€{price.toFixed(2)}</div>
        <button
          onClick={onAdd}
          className="size-10 shrink-0 rounded-full bg-[#27c7ff] hover:bg-[#1fb5e8] transition-colors flex items-center justify-center"
        >
          <Plus className="size-5 text-white" strokeWidth={3} />
        </button>
      </div>
    </div>
  )
}
