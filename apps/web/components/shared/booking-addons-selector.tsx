"use client"

import { useState } from "react"
import Image from "next/image"
import { Gem, ChevronDown } from "lucide-react"
import { useTranslations } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"

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
  currency,
}: BookingAddonsSelectorProps) {
  const t = useTranslations("tourDetails")
  const [isExpanded, setIsExpanded] = useState(false)

  const formatPrice = (value: number) => {
    return value.toLocaleString("de-DE")
  }

  if (addons.length === 0) return null

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-[#f8f9fa] rounded-xl px-4 py-3 flex items-center gap-3 hover:bg-[#f0f1f2] transition-colors"
      >
        <Gem className="size-5 text-[#27c7ff] shrink-0" />
        <span className="text-[15px] font-semibold text-[#0c171c] flex-1 text-left">
          {t("addOns")}
        </span>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          <ChevronDown className="size-5 text-[#5f686c]" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-2 space-y-2">
              {addons.map((addon) => {
                const isSelected = selectedAddonIds.includes(addon._id)
                const subtotal =
                  addon.pricingType === "per_person"
                    ? addon.price * totalGuests
                    : addon.price

                return (
                  <motion.button
                    key={addon._id}
                    type="button"
                    onClick={() => onToggleAddon(addon._id)}
                    layout
                    className={`w-full rounded-xl px-4 py-3 flex items-center gap-3 transition-colors duration-200 border ${
                      isSelected
                        ? "border-[#27c7ff] bg-[#f0faff]"
                        : "border-[#e8eaed] bg-white hover:border-[#27c7ff]"
                    }`}
                  >
                    {addon.imageUrl ? (
                      <div className="relative size-10 rounded-lg overflow-hidden shrink-0 bg-[#e8eaed]">
                        <Image
                          src={addon.imageUrl}
                          alt={addon.title}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                    ) : (
                      <div className="size-10 rounded-lg bg-[#e8eaed] shrink-0" />
                    )}

                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-[14px] font-medium text-[#0c171c] leading-tight truncate">
                        {addon.title}
                      </p>
                      <p className="text-[12px] text-[#5f686c]">
                        {addon.pricingType === "per_person"
                          ? `${currency}${formatPrice(addon.price)} × ${totalGuests} = ${currency}${formatPrice(subtotal)}`
                          : `${currency}${formatPrice(addon.price)}`}
                      </p>
                    </div>

                    <div className="relative size-5 shrink-0">
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 flex items-center justify-center"
                        animate={{
                          borderColor: isSelected ? "#27c7ff" : "#dedede",
                          backgroundColor: isSelected ? "#27c7ff" : "transparent",
                          scale: isSelected ? [1, 1.15, 1] : 1,
                        }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                      >
                        <motion.svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          initial={false}
                          animate={{
                            scale: isSelected ? 1 : 0,
                            opacity: isSelected ? 1 : 0,
                          }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                        >
                          <path
                            d="M2.5 6L5 8.5L9.5 4"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </motion.svg>
                      </motion.div>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
