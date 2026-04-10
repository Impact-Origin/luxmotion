"use client"

import { User, Briefcase, Wifi, Lock, Leaf, Info } from "lucide-react"
import Image from "next/image"
import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { calculatePriceBreakdown } from "@/lib/format"
import { VehicleInfoTooltip } from "@/components/checkout/vehicle-info-tooltip"

interface Vehicle {
  id: string
  name: string
  price: number
  pricePerKm?: number
  hasDistance?: boolean
  image: string
  passengers: number
  luggage: number
  isElectric: boolean
}

interface VehicleCardProps {
  vehicle: Vehicle
  onSelect?: (vehicle: Vehicle) => void
  /** When true (round trip), show half of the computed trip price (outbound only). */
  isRoundTrip?: boolean
}

export function VehicleCard({ vehicle, onSelect, isRoundTrip = false }: VehicleCardProps) {
  const t = useTranslations("vehicle")
  const tCommon = useTranslations("common")
  const [showInfo, setShowInfo] = useState(false)

  // For round trips, vehicle.price is the total for both legs.
  // In the checkout UI we always display the one-way price (outbound only),
  // so divide by 2 for round trips.
  const effectivePrice = useMemo(
    () => (isRoundTrip ? vehicle.price / 2 : vehicle.price),
    [isRoundTrip, vehicle.price]
  )

  const priceBreakdown = useMemo(() => calculatePriceBreakdown(effectivePrice), [effectivePrice])
  const hasDistance = vehicle.hasDistance ?? vehicle.price > 0
  const displayPrice = priceBreakdown.total.toFixed(2).replace(".", ",")
  const pricePerKm = vehicle.pricePerKm?.toFixed(2).replace(".", ",") ?? "0,00"

  return (
    <div className="bg-white rounded-2xl md:rounded-xl pt-4 pb-2 px-4 md:p-5 shadow-xs border border-[#DEDEDE] md:border-2 md:border-[#0E4659]/10 md:min-h-[285px] relative overflow-hidden">
      {vehicle.isElectric && (
        <div className="absolute left-0 top-3.5 z-10">
          <div className="inline-flex items-center gap-1.5 bg-[#ABEDD5] text-[#008354] justify-between pl-2 pr-2 md:pl-3 md:pr-5 py-1 rounded-r-full text-xs md:text-sm font-medium">
            {t("electric")}
            <Leaf className="size-3.5 md:size-4" />
          </div>
        </div>
      )}

      <div className="hidden md:flex h-full items-stretch justify-between gap-2">
        <div className="flex-1 flex flex-col justify-between">
          <div className={`relative mb-2 h-[120px] bg-transparent rounded-lg flex items-start justify-start ${vehicle.isElectric ? "mt-5 md:mt-8" : "md:mt-5"}`}>
            <Image
              src={vehicle.image || "/placeholder.svg"}
              alt={vehicle.name}
              width={240}
              height={120}
              className="w-auto h-full object-contain"
            />
          </div>

          <div className="mt-auto">
            <div className="flex items-center mb-2 gap-2">
              <h3 className="text-xl font-bold text-[#222222]">{vehicle.name}</h3>
            </div>

            <div className="flex items-center gap-2 text-[#0E4659]">
              <div className="flex items-center gap-1.5 bg-[#E9F9FF] px-3 py-1.5 rounded-2xl">
                <User className="w-4 h-4" />
                <span className="text-sm font-semibold">{vehicle.passengers}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#E9F9FF] px-3 py-1.5 rounded-2xl">
                <Briefcase className="w-4 h-4" />
                <span className="text-sm font-semibold">{vehicle.luggage}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#E9F9FF] px-3 py-1.5 rounded-2xl">
                <Wifi className="w-4 h-4" />
                <span className="text-sm font-semibold">{tCommon("yes")}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="text-right">
            {hasDistance ? (
              <>
                <div className="flex items-baseline justify-end gap-1 text-2xl font-bold text-[#000000] leading-none">
                  <span className="leading-none">€</span>
                  <span className="leading-none">{displayPrice}</span>
                </div>
                <div className="text-sm text-[#A0A0A0] mt-0.5 mb-1.5">{t("vatIncluded")}</div>
              </>
            ) : (
              <>
                <div className="flex items-baseline justify-end gap-1 text-2xl font-bold text-[#000000] leading-none">
                  <span className="leading-none">€</span>
                  <span className="leading-none">{pricePerKm}</span>
                  <span className="text-base text-[#A0A0A0] font-normal">/km</span>
                </div>
                <div className="text-sm text-[#A0A0A0] mt-0.5 mb-1.5">{t("selectRouteForPrice")}</div>
              </>
            )}
            <div className="inline-flex items-center gap-2 bg-[#E9F9FF] text-[#0E4659] text-xs px-3 py-2 rounded-full">
              <Lock className="w-3.5 h-3.5" />
              <span>{t("fixedPriceGuaranteed")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={`md:hidden flex flex-col ${vehicle.isElectric ? "mt-2" : ""}`}>
        <div className="flex items-center justify-between pt-4">
          <div className="relative w-[150px] h-[95px] bg-transparent rounded-lg flex items-center justify-center shrink-0">
            <Image
              src={vehicle.image || "/placeholder.svg"}
              alt={vehicle.name}
              width={240}
              height={120}
              className="w-auto h-full object-contain"
            />
          </div>

          <div className="flex flex-col items-end gap-2 min-w-0">
            <div className="text-right">
              {hasDistance ? (
                <>
                  <div className="text-[18px] xs:text-[20px] sm:text-xl font-bold text-[#222222] leading-none whitespace-nowrap">€ {displayPrice}</div>
                  <div className="text-xs text-[#A0A0A0] mt-1">{t("vatIncluded")}</div>
                </>
              ) : (
                <>
                  <div className="text-[16px] xs:text-[18px] sm:text-lg font-bold text-[#222222] leading-none whitespace-nowrap">
                    € {pricePerKm}<span className="text-xs text-[#A0A0A0] font-normal">/km</span>
                  </div>
                  <div className="text-xs text-[#A0A0A0] mt-1">{t("selectRouteForPrice")}</div>
                </>
              )}
            </div>
            <div className="inline-flex items-center gap-1.5 bg-[#E9F9FF] text-[#0E4659] text-[11px] pl-2 pr-4 py-1.5 rounded-lg">
              <Lock className="w-3.5 h-3.5" />
              <span className="uppercase whitespace-nowrap">{t("fixedPriceGuaranteed")}</span>
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between mt-2">
          <div>
            <div className="flex items-center mb-2 gap-2">
              <h3 className="text-base font-bold text-[#222222] tracking-wide">{vehicle.name}</h3>
            </div>

            <div className="flex items-center gap-1 text-[#0E4659]">
              <div className="flex items-center gap-1 bg-[#E9F9FF] pl-2 pr-2 py-1 rounded-2xl">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">{vehicle.passengers}</span>
              </div>
              <div className="flex items-center gap-1 bg-[#E9F9FF] pl-2 pr-2 py-1 rounded-2xl">
                <Briefcase className="w-4 h-4" />
                <span className="text-sm font-medium">{vehicle.luggage}</span>
              </div>
              <div className="flex items-center gap-1 bg-[#E9F9FF] pl-2 pr-2 py-1 rounded-2xl">
                <Wifi className="w-4 h-4" />
                <span className="text-sm font-medium">{tCommon("yes")}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setShowInfo(true) }}
              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#27C7FF] text-white hover:bg-[#1BA7D9] focus:outline-none focus:ring-2 focus:ring-[#27C7FF] focus:ring-offset-1"
              aria-label={t("included")}
            >
              <Info className="w-4 h-4" strokeWidth={2.5} />
            </button>
            <button
              onClick={() => onSelect?.(vehicle)}
              className="bg-[#27C7FF] hover:bg-[#1BA7D9] text-white font-bold py-2.5 px-3 rounded-lg text-xs transition-colors uppercase tracking-wide"
            >
              {tCommon("select").toUpperCase()}
            </button>
          </div>
        </div>
      </div>

      <div className="hidden md:flex flex-col items-end gap-1.5 absolute bottom-[22px] right-5">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setShowInfo(true) }}
          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#27C7FF] text-white hover:bg-[#1BA7D9] focus:outline-none focus:ring-2 focus:ring-[#27C7FF] focus:ring-offset-1"
          aria-label={t("included")}
        >
          <Info className="w-4 h-4" strokeWidth={2.5} />
        </button>
        <button
          onClick={() => onSelect?.(vehicle)}
          className="bg-[#27C7FF] hover:bg-[#1BA7D9] text-white font-bold py-3 px-2.5 rounded-lg text-sm transition-colors uppercase tracking-wide shadow-sm"
        >
          {tCommon("select").toUpperCase()}
        </button>
      </div>

      {showInfo && (
        <VehicleInfoTooltip vehicleName={vehicle.name} onClose={() => setShowInfo(false)} />
      )}
    </div>
  )
}
