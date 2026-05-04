"use client"

import { cn } from "@workspace/ui/lib/utils"

interface LightToggleOption<T extends string> {
  value: T
  label: string
}

interface LightToggleGroupProps<T extends string> {
  value: T | null
  onChange: (value: T) => void
  options: LightToggleOption<T>[]
  ariaLabel?: string
}

export function LightToggleGroup<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
}: LightToggleGroupProps<T>) {
  return (
    <div className="flex w-full gap-2" role="radiogroup" aria-label={ariaLabel}>
      {options.map((opt) => {
        const selected = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex-1 h-[44px] px-[13px] flex items-center justify-center text-[14px] font-medium transition-colors",
              selected
                ? "bg-[rgba(154,117,53,0.07)] border-[0.8px] border-[#a08248] text-[#a08248]"
                : "bg-white border border-[rgba(28,27,24,0.08)] text-[#0d0d0d] hover:border-[rgba(28,27,24,0.2)]",
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
