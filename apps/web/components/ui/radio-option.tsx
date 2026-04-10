"use client"

import { cn } from "@workspace/ui/lib/utils"

interface RadioOptionProps {
  label: string
  selected: boolean
  onSelect: () => void
  className?: string
}

export function RadioOption({ label, selected, onSelect, className }: RadioOptionProps) {
  return (
    <label
      onClick={onSelect}
      className={cn("flex items-center gap-3 cursor-pointer", className)}
    >
      <div
        className={cn(
          "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
          selected ? "border-[#27c7ff]" : "border-[#d0d0d0]"
        )}
      >
        {selected && <div className="w-3 h-3 rounded-full bg-[#27c7ff]" />}
      </div>
      <span className="text-[15px] text-[#222222]">{label}</span>
    </label>
  )
}

