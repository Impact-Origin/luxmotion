"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { cn } from "@workspace/ui/lib/utils"
import { SANS_FONT } from "./fonts"

interface LightSelectOption {
  value: string
  label: string
}

interface LightSelectProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
  options: LightSelectOption[]
  className?: string
  name?: string
  id?: string
}

export function LightSelect({
  value,
  onChange,
  placeholder,
  options,
  className,
  name,
  id,
}: LightSelectProps) {
  return (
    <Select value={value || undefined} onValueChange={onChange} name={name} {...({ modal: false } as Record<string, unknown>)}>
      <SelectTrigger
        id={id}
        className={cn(
          "w-full h-[44px] rounded-none bg-white border border-[rgba(28,27,24,0.08)]",
          "hover:border-[rgba(28,27,24,0.18)] data-[state=open]:border-[#a08248]",
          "focus-visible:ring-0 focus-visible:border-[#a08248] shadow-none",
          "px-[13px] text-[14px] text-[#1c1b18] data-[placeholder]:text-[rgba(140,134,128,0.85)]",
          "[&_svg]:text-[#1c1b18] [&_svg:not([class*='size-'])]:size-5",
          "[&>span:first-child]:flex-1 [&>span:first-child]:text-left",
          className,
        )}
        style={SANS_FONT}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent
        className="bg-white border border-[rgba(28,27,24,0.08)] rounded-none shadow-[0_8px_16px_rgba(0,0,0,0.06)] p-0 w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)] max-h-[min(300px,var(--radix-select-content-available-height))] overflow-y-auto"
        position="popper"
        sideOffset={4}
      >
        {options.map((opt) => (
          <SelectItem
            key={opt.value}
            value={opt.value}
            className={cn(
              "h-[44px] px-[13px] text-[14px] text-[#1c1b18] rounded-none cursor-pointer",
              "focus:bg-[rgba(154,117,53,0.08)] focus:text-[#1c1b18]",
              "data-[state=checked]:text-[#a08248] data-[state=checked]:font-medium",
            )}
            style={SANS_FONT}
          >
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
