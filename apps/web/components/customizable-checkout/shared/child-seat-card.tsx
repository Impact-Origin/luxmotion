"use client"

import Image from "next/image"
import { Counter } from "@/components/ui/counter"
import { cn } from "@workspace/ui/lib/utils"

interface ChildSeatCardProps {
  title: string
  ageRange: string
  image: string
  value: number
  onChange: (value: number) => void
  isSelected?: boolean
  variant?: "mobile" | "desktop"
  className?: string
}

export function ChildSeatCard({
  title,
  ageRange,
  image,
  value,
  onChange,
  isSelected = false,
  variant = "desktop",
  className,
}: ChildSeatCardProps) {
  if (variant === "mobile") {
    return (
      <div
        className={cn(
          "min-w-0 w-full border rounded-xl bg-white p-2.5 flex flex-col shadow-[0px_4px_10px_rgba(0,0,0,0.05)]",
          isSelected ? "border-[#27c7ff]" : "border-[#bfbfbf]",
          className
        )}
      >
        <div className="h-[58px] flex items-center justify-center">
          <Image
            src={image}
            alt={title}
            width={100}
            height={58}
            className="max-h-full w-auto object-contain"
          />
        </div>
        <div className="flex flex-col gap-0.5 min-h-[36px]">
          <h4 className="text-[11px] font-bold leading-tight line-clamp-2 text-center text-[#222222]">{title}</h4>
          <p className="text-[9px] text-[#808080] uppercase tracking-wide line-clamp-1 text-center">{ageRange}</p>
        </div>
        <Counter
          value={value}
          onChange={onChange}
          min={0}
          variant="tiny"
          className="w-full max-w-[90px] mx-auto relative z-10"
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        "border-2 rounded-2xl overflow-hidden bg-white flex flex-col",
        isSelected ? "border-[#27c7ff]" : "border-[#d0d0d0]",
        className
      )}
    >
      <div className="h-36 flex items-center justify-center p-4 pt-4">
        <Image
          src={image}
          alt={title}
          width={240}
          height={140}
          className="max-h-full w-auto object-contain scale-125"
        />
      </div>
      <div className="px-4 pb-4 flex-1 flex flex-col">
        <h4 className="text-sm font-bold text-[#222222] mb-0.5">{title}</h4>
        <p className="text-xs text-[#808080] mb-3 uppercase tracking-wide">{ageRange}</p>
        <Counter
          value={value}
          onChange={onChange}
          min={0}
          variant="tiny"
          className="mt-auto"
        />
      </div>
    </div>
  )
}

