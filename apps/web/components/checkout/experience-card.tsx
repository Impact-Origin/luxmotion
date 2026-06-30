"use client"

import { Plus, Clock } from "lucide-react"
import Image from "next/image"

interface ExperienceCardProps {
  title: string
  price: number
  duration: string
  image: string
  distanceKm?: number
  onAdd?: () => void
}

export function ExperienceCard({ title, price, duration, image, onAdd }: ExperienceCardProps) {
  return (
    <div className="bg-[#1E1D1B] border border-[rgba(255,255,255,0.12)] flex flex-col w-full h-[260px] overflow-hidden">
      <div className="relative flex-1 min-h-0 w-full">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          sizes="220px"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-[3.3px] p-3">
        <h3 className="text-[12px] font-bold text-[#F7F4EF] leading-[19.97px] truncate">{title}</h3>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-[14px] font-bold text-[#F7F4EF] leading-[22.53px]">
              €{price.toFixed(0)}
            </span>
            <div className="flex items-center gap-[3px] text-[#9A7535]">
              <Clock className="w-[14px] h-[14px]" strokeWidth={2} />
              <span className="text-[12px] font-normal leading-[15.87px]">{duration}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onAdd}
            aria-label="Add"
            className="w-8 h-8 shrink-0 bg-[#C9A96E] hover:bg-[#b89558] transition-colors flex items-center justify-center"
          >
            <Plus className="w-[18px] h-[18px] text-[#0D0D0D]" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  )
}
