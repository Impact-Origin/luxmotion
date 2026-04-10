"use client"

import { MapPin } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { splitAddress } from "@/lib/format"

interface ItineraryLocationProps {
  address: string
  city?: string
  showConnector?: boolean
  connectorHeight?: string
  className?: string
}

export function ItineraryLocation({
  address,
  showConnector = false,
  connectorHeight = "40px",
  className,
}: ItineraryLocationProps) {
  const { main, sub } = splitAddress(address)

  return (
    <div className={cn("flex items-start gap-3", className)}>
      <div className="flex flex-col items-center flex-shrink-0 pt-0.5">
        <MapPin className="w-4 h-4 text-[#0E4659]" />
        {showConnector && (
          <div
            className="w-[2px] bg-[#e0e0e0] mt-1"
            style={{ height: connectorHeight }}
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-medium text-[#222222] leading-tight">
          {main}
        </p>
        {sub && (
          <p className="text-[13px] text-[#808080] mt-1 leading-tight">{sub}</p>
        )}
      </div>
    </div>
  )
}

interface ItineraryRouteProps {
  from: { address: string }
  to: { address: string }
  stops?: { text: string }[]
  className?: string
}

export function ItineraryRoute({ from, to, stops = [], className }: ItineraryRouteProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <ItineraryPoint address={from.address} showConnector={true} />
      {stops.map((stop, i) => (
        <ItineraryPoint key={i} address={stop.text} showConnector={true} />
      ))}
      <ItineraryPoint address={to.address} showConnector={false} />
    </div>
  )
}

function ItineraryPoint({ address, showConnector }: { address: string; showConnector: boolean }) {
  const { main, sub } = splitAddress(address)
  return (
    <div className="flex items-stretch gap-3">
      <div className="flex flex-col items-center flex-shrink-0 pt-0.5">
        <MapPin className="w-4 h-4 text-[#0E4659] shrink-0" />
        {showConnector && (
          <div className="w-[2px] bg-[#e0e0e0] flex-1 my-1" />
        )}
      </div>
      <div className={cn("flex-1 min-w-0", showConnector ? "pb-2" : "")}>
        <p className="text-[14px] font-medium text-[#222222] leading-tight">
          {main}
        </p>
        {sub && (
          <p className="text-[13px] text-[#808080] mt-1 leading-tight">{sub}</p>
        )}
      </div>
    </div>
  )
}
