"use client"

import Image from "next/image"

interface SelectableMediaCardProps {
  imageSrc: string
  imageAlt?: string
  title: string
  description: string
  selected: boolean
  onSelect: () => void
}

export function SelectableMediaCard({
  imageSrc,
  imageAlt = "",
  title,
  description,
  selected,
  onSelect,
}: SelectableMediaCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={
        selected
          ? "w-full min-h-[72px] flex items-center gap-2 pl-[15px] pr-4 py-[11px] bg-white border border-[#a08248] text-left transition-colors"
          : "w-full min-h-[72px] flex items-center gap-2 pl-[15px] pr-4 py-[11px] bg-white border border-[rgba(28,27,24,0.08)] hover:border-[rgba(28,27,24,0.18)] text-left transition-colors"
      }
      aria-pressed={selected}
    >
      <span className="relative h-[48px] w-[56px] shrink-0 bg-[rgba(0,0,0,0.05)] overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="56px"
          className="object-contain"
        />
      </span>
      <span className="flex flex-col gap-1 min-w-0">
        <span className="text-[14px] font-semibold leading-none text-[#0d0d0d]">
          {title}
        </span>
        <span className="text-[12px] font-normal text-[#696969] truncate">
          {description}
        </span>
      </span>
    </button>
  )
}
