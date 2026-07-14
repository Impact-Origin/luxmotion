"use client"

import { useState } from "react"
import { Check, ChevronDown, Search } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import { cn } from "@workspace/ui/lib/utils"
import { SANS_FONT } from "./fonts"

interface LightComboboxOption {
  value: string
  label: string
}

interface LightComboboxProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
  /** Text shown in the search field. */
  searchPlaceholder?: string
  options: LightComboboxOption[]
  className?: string
  id?: string
}

/**
 * Light-themed searchable select (combobox). Same look as LightSelect but with
 * a type-to-filter field — e.g. typing "r" narrows to Renault / Rolls-Royce.
 */
export function LightCombobox({
  value,
  onChange,
  placeholder,
  searchPlaceholder = "Procurar…",
  options,
  className,
  id,
}: LightComboboxProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")

  const selected = options.find((o) => o.value === value)
  const q = query.trim().toLowerCase()
  const filtered = q
    ? options.filter((o) => o.label.toLowerCase().includes(q))
    : options

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setQuery("")
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          className={cn(
            "w-full h-[44px] rounded-none bg-white border border-[rgba(28,27,24,0.08)] hover:border-[rgba(28,27,24,0.18)] data-[state=open]:border-[#a08248] px-[13px] text-[14px] flex items-center justify-between gap-2 outline-none transition-colors",
            className,
          )}
          style={SANS_FONT}
        >
          <span
            className={cn(
              "flex-1 truncate text-left",
              selected ? "text-[#1c1b18]" : "text-[rgba(140,134,128,0.85)]",
            )}
          >
            {selected?.label ?? placeholder}
          </span>
          <ChevronDown className="size-5 shrink-0 text-[#1c1b18]" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={4}
        className="bg-white border border-[rgba(28,27,24,0.08)] rounded-none shadow-[0_8px_16px_rgba(0,0,0,0.06)] p-0 w-[var(--radix-popover-trigger-width)] min-w-[var(--radix-popover-trigger-width)]"
      >
        <div className="flex items-center gap-2 border-b border-[rgba(28,27,24,0.08)] px-[13px]">
          <Search className="size-4 shrink-0 text-[rgba(140,134,128,0.85)]" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-[44px] flex-1 bg-transparent text-[14px] text-[#1c1b18] outline-none placeholder:text-[rgba(140,134,128,0.85)]"
            style={SANS_FONT}
          />
        </div>
        <div className="max-h-[260px] overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#d4d4d8_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#d4d4d8] [&::-webkit-scrollbar-thumb:hover]:bg-[#a1a1aa]">
          {filtered.length === 0 ? (
            <div
              className="flex h-[44px] items-center px-[13px] text-[14px] text-[rgba(140,134,128,0.85)]"
              style={SANS_FONT}
            >
              —
            </div>
          ) : (
            filtered.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value)
                  setOpen(false)
                  setQuery("")
                }}
                className={cn(
                  "flex h-[44px] w-full cursor-pointer items-center justify-between gap-2 px-[13px] text-left text-[14px] hover:bg-[rgba(154,117,53,0.08)]",
                  opt.value === value
                    ? "font-medium text-[#a08248]"
                    : "text-[#1c1b18]",
                )}
                style={SANS_FONT}
              >
                <span className="truncate">{opt.label}</span>
                {opt.value === value && (
                  <Check className="size-4 shrink-0 text-[#a08248]" />
                )}
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
