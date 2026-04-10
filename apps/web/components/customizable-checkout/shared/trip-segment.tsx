"use client"

import { Pencil } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { TripIconsRow } from "./trip-icons-row"
import { ItineraryRoute } from "./itinerary-location"
import { useDateFormatter } from "@/hooks/use-date-formatter"
import { formatPrice } from "@/lib/format"
import { useCheckout } from "../checkout-context"

interface TripSegmentProps {
  title: string
  from: { address: string }
  to: { address: string }
  stops?: { text: string; city?: string }[]
  date: Date | string | number | undefined | null
  price: number
  tripIcons?: {
    passengers?: number
    luggage?: number
    surfboards?: number
    childSeats?: number
    pets?: number
  }
  editLabel: string
  showTripIcons?: boolean
  className?: string
}

export function TripSegment({
  title,
  from,
  to,
  stops,
  date,
  price,
  tripIcons,
  editLabel,
  showTripIcons = true,
  className,
}: TripSegmentProps) {
  const { formatDateTime } = useDateFormatter()
  const { setStep, setShowTransferForm } = useCheckout()

  const handleEdit = () => {
    setShowTransferForm(true)
    setStep(1)
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="bg-[#f8f8f8] rounded-lg px-4 py-2 flex items-center justify-between">
        <h4 className="text-[16px] font-semibold text-[#222222]">{title}</h4>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-[14px] text-[#808080]">
          {date ? formatDateTime(date) : "—"}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleEdit}
            className="flex items-center gap-1 text-[13px] text-[#222222] hover:text-[#27c7ff] transition-colors"
          >
            <span>{editLabel}</span>
            <Pencil className="w-3 h-3" />
          </button>
          <p className="text-[15px] font-bold text-[#222222]">{formatPrice(price)}</p>
        </div>
      </div>

      <ItineraryRoute from={from} to={to} stops={stops} />

      {showTripIcons && tripIcons && <TripIconsRow data={tripIcons} />}
    </div>
  )
}

