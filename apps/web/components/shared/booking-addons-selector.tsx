"use client"

import { Check } from "lucide-react"
import Image from "next/image"
import { cn } from "@workspace/ui/lib/utils"
import { useMoney } from "@/components/currency-provider"

export interface BookingAddon {
  _id: string
  title: string
  description?: string
  imageUrl?: string | null
  price: number
  pricingType: "per_person" | "flat"
  currency: string
}

interface BookingAddonsSelectorProps {
  addons: BookingAddon[]
  selectedAddonIds: string[]
  onToggleAddon: (addonId: string) => void
  totalGuests: number
  currency: string
}

export function BookingAddonsSelector({
  addons,
  selectedAddonIds,
  onToggleAddon,
  totalGuests,
}: BookingAddonsSelectorProps) {
  const { format } = useMoney()

  if (addons.length === 0) return null

  return (
    <div className="flex flex-col gap-[3px]">
      {addons.map((addon) => {
        const isSelected = selectedAddonIds.includes(addon._id)
        const isFree = addon.price === 0

        return (
          <button
            key={addon._id}
            type="button"
            onClick={() => onToggleAddon(addon._id)}
            className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] flex items-center gap-3 px-[15px] py-[13px] transition-colors hover:border-[rgba(201,169,110,0.25)]"
          >
            <div
              className={cn(
                "size-[18px] border border-[rgba(255,255,255,0.15)] flex items-center justify-center shrink-0 transition-colors",
                isSelected && "bg-[rgba(154,117,53,0.22)] border-[rgba(201,169,110,0.5)]"
              )}
            >
              {isSelected && <Check className="size-[10px] text-[#C9A96E]" />}
            </div>

            <div className="flex-1 min-w-0 text-left">
              <p className="text-[12px] font-medium text-white leading-normal">{addon.title}</p>
              {addon.description && (
                <p className="text-[10px] text-[#999] leading-[14px]">{addon.description}</p>
              )}
            </div>

            <span
              className={cn(
                "text-[16px] font-bold shrink-0",
                isFree ? "text-[#81c784] tracking-[0.66px]" : "text-[rgba(201,169,110,0.7)]"
              )}
              style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif" }}
            >
              {isFree ? "Livre" : `+${format(addon.price)}`}
            </span>
          </button>
        )
      })}
    </div>
  )
}
