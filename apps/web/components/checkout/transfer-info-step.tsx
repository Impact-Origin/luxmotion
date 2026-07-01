"use client"

import Image from "next/image"
import { Search, Info, Backpack, Luggage, Briefcase, Plus, X, ArrowLeft, ArrowRight, Minus, PlaneLanding, Clock, MapPin, Users, Baby, ChevronRight, Dog, CircleAlert } from "lucide-react"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { DateTimePicker } from "@/components/checkout/date-time-picker"
import { AnimatedCollapse } from "@/components/checkout/shared"
import { useTranslations } from "next-intl"
import { useCheckout } from "@/components/checkout/checkout-context"
import { GooglePlacesInput } from "@/components/ui/google-places-input"
import { initOrder, createReturnOrder, registTrip, selectCar, toBackendLocation, formatLocalDate, formatLocalDateTime, lookupFlight } from "@/lib/orders"
import { useState, useMemo, type ReactNode, type ComponentType } from "react"
import { useConvex } from "convex/react"
import { calculatePriceBreakdown } from "@/lib/format"
import { api } from "@workspace/convex/api"
import { toast } from "sonner"
import { cn } from "@workspace/ui/lib/utils"

interface TransferInfoStepProps {
  onContinue: () => void
}

const SERIF_FONT = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="text-[12px] font-bold text-[#999] uppercase tracking-[1.152px] mt-8 mb-3">
      {children}
    </div>
  )
}

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <label className="block text-[14px] font-medium text-[#F7F4EF] mb-2">{children}</label>
  )
}

function DarkFieldBox({ children }: { children: ReactNode }) {
  return (
    <div className="h-12 bg-[#1A1918] border border-[rgba(255,255,255,0.06)] px-3 flex items-center [&>*]:min-w-0 [&>*]:flex-1 focus-within:border-[#C9A96E] transition-colors">
      {children}
    </div>
  )
}

function DarkCounter({
  value,
  onChange,
  min = 0,
  max = Infinity,
  className,
}: {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  className?: string
}) {
  return (
    <div className={cn("flex items-center", className)}>
      <button
        type="button"
        onClick={() => value > min && onChange(value - 1)}
        disabled={value <= min}
        className="w-8 h-8 flex items-center justify-center border-[1.5px] border-[rgba(255,255,255,0.12)] text-[#F7F4EF] hover:bg-[rgba(255,255,255,0.04)] disabled:text-[rgba(247,244,239,0.35)] disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
      >
        <Minus className="w-3.5 h-3.5" strokeWidth={2} />
      </button>
      <div className="w-10 h-8 flex items-center justify-center border-y-[1.5px] border-[rgba(255,255,255,0.12)]">
        <span className={cn("text-[14px] font-medium tabular-nums", value > 0 ? "text-white" : "text-[#696969]")}>{value}</span>
      </div>
      <button
        type="button"
        onClick={() => value < max && onChange(value + 1)}
        disabled={value >= max}
        className="w-8 h-8 flex items-center justify-center border-[1.5px] border-[rgba(255,255,255,0.12)] text-[#F7F4EF] hover:bg-[rgba(255,255,255,0.04)] disabled:text-[rgba(247,244,239,0.35)] disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
      >
        <Plus className="w-3.5 h-3.5" strokeWidth={2} />
      </button>
    </div>
  )
}

function DarkInput({
  value,
  onChange,
  placeholder,
  leftIcon,
  rightAdornment,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  leftIcon?: ReactNode
  rightAdornment?: ReactNode
}) {
  return (
    <div className="relative">
      {leftIcon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C9A96E]">{leftIcon}</div>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full h-12 bg-[#1A1918] border border-[rgba(255,255,255,0.06)] text-[14px] text-white placeholder:text-[#696969]",
          "focus:outline-none focus:border-[#C9A96E] transition-colors",
          leftIcon ? "pl-10" : "pl-4",
          rightAdornment ? "pr-12" : "pr-4",
        )}
      />
      {rightAdornment && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightAdornment}</div>
      )}
    </div>
  )
}

function IconOptionCard({
  icon: Icon,
  iconImage,
  iconImageClassName,
  title,
  subtitle,
  badge,
  selected,
  children,
}: {
  icon?: ComponentType<{ className?: string; strokeWidth?: number }>
  iconImage?: string
  iconImageClassName?: string
  title: string
  subtitle?: string
  badge?: string
  selected?: boolean
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        "relative border p-4 pt-8 md:pt-4 flex flex-col gap-2 items-center transition-colors",
        selected
          ? "bg-[rgba(154,117,53,0.07)] border-[#C9A96E]"
          : "bg-[#1A1918] border-[rgba(255,255,255,0.06)]",
      )}
    >
      {badge && (
        <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-[9px] font-bold text-[#9A7535] uppercase tracking-[0.72px]">
          <CircleAlert className="w-3 h-3" strokeWidth={1.8} />
          {badge}
        </span>
      )}
      <div className="flex items-center justify-center gap-2">
        {iconImage ? (
          <Image
            src={iconImage}
            alt=""
            width={24}
            height={24}
            className={cn("shrink-0 object-contain", iconImageClassName ?? "w-6 h-6")}
          />
        ) : Icon ? (
          <Icon className="w-6 h-6 text-[#C9A96E] shrink-0" strokeWidth={1.6} />
        ) : null}
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-[12px] font-bold text-[#F7F4EF] leading-[19.2px]">{title}</span>
          {subtitle && (
            <span className="text-[10px] font-medium text-[rgba(247,244,239,0.38)] uppercase tracking-[0.1px] leading-[14.85px] whitespace-nowrap">
              {subtitle}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center justify-center w-full mt-auto">
        {children}
      </div>
    </div>
  )
}

function ImageOptionCard({
  image,
  imageRotation,
  title,
  subtitle,
  badge,
  selected,
  children,
}: {
  image: string
  imageRotation?: string
  title: string
  subtitle?: string
  badge?: string
  selected?: boolean
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        "relative border p-4 flex flex-col gap-2 items-center transition-colors",
        selected
          ? "bg-[rgba(154,117,53,0.07)] border-[#C9A96E]"
          : "bg-[#1E1D1B] border-[rgba(247,244,239,0.08)]",
      )}
    >
      {badge && (
        <span className="absolute top-3 right-3 text-[9px] font-bold text-[#9A7535] uppercase tracking-[0.72px] z-10">
          {badge}
        </span>
      )}
      <div className="h-[88px] flex items-center justify-center overflow-hidden">
        <Image
          src={image}
          alt={title}
          width={140}
          height={88}
          className={cn(
            "max-h-full w-auto object-contain drop-shadow-[3px_4px_7px_rgba(0,0,0,0.25)]",
            imageRotation,
          )}
        />
      </div>
      <div className="flex flex-col items-center gap-0.5 text-center">
        <span className="text-[12px] font-bold text-[#F7F4EF] leading-[19.2px]">{title}</span>
        {subtitle && (
          <span className="text-[10px] font-medium text-[rgba(247,244,239,0.38)] uppercase tracking-[0.1px] leading-[14.85px] whitespace-nowrap">
            {subtitle}
          </span>
        )}
      </div>
      <div className="flex items-center justify-center w-full">
        {children}
      </div>
    </div>
  )
}

function FlightTimeline({
  arrivalTime,
  pickupTime,
}: {
  arrivalTime?: string | null
  pickupTime?: string | null
}) {
  const t = useTranslations("transfer")
  return (
    <div className="flex items-stretch gap-2 bg-[#1A1918] border border-[rgba(255,255,255,0.06)] px-4 py-3">
      <TimelineStop icon={PlaneLanding} time={arrivalTime} label={t("landing")} />
      <TimelineConnector />
      <TimelineStop icon={Clock} time={"00:30"} label={t("wait")} />
      <TimelineConnector />
      <TimelineStop icon={MapPin} time={pickupTime} label={t("landing")} align="end" />
    </div>
  )
}

function TimelineStop({
  icon: Icon,
  time,
  label,
  align = "start",
}: {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>
  time?: string | null
  label: string
  align?: "start" | "center" | "end"
}) {
  const alignClass = align === "end" ? "items-end" : align === "center" ? "items-center" : "items-start"
  return (
    <div className={cn("flex flex-col min-w-[60px]", alignClass)}>
      <div className="w-8 h-8 border border-[rgba(201,169,110,0.4)] flex items-center justify-center mb-1">
        <Icon className="w-4 h-4 text-[#C9A96E]" strokeWidth={1.6} />
      </div>
      <span className="text-[14px] font-bold text-white tabular-nums leading-tight">{time || "--:--"}</span>
      <span className="text-[10px] text-[#999] uppercase tracking-[0.5px] mt-0.5">{label}</span>
    </div>
  )
}

function TimelineConnector() {
  return <div className="flex-1 border-t border-dashed border-[rgba(201,169,110,0.4)] mt-4" />
}

function formatFlightTime(value: string | Date | null | undefined): string | null {
  if (!value) return null
  const d = value instanceof Date ? value : new Date(value)
  if (!Number.isFinite(d.getTime())) return null
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: false })
}

export function TransferInfoStep({ onContinue }: TransferInfoStepProps) {
  const t = useTranslations("transfer")
  const convex = useConvex()
  const tCommon = useTranslations("common")
  const { state, updateTransfer, setOrder, setStep, setUpgradeMode, setShowTransferForm } = useCheckout()
  const { transfer, selectedVehicle, distance, routeDuration, orderId, payment, experiences } = state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [flightSuccess, setFlightSuccess] = useState("")

  const isRoundTrip = transfer.bookReturn
  const isReturnTab = transfer.transferType === "volta"
  const activeFlightNumber = isReturnTab ? transfer.returnFlightNumber : transfer.outboundFlightNumber
  const activeAirlineCompany = isReturnTab ? transfer.returnAirlineCompany : transfer.outboundAirlineCompany
  const activeArrivalDate = isReturnTab ? transfer.returnArrivalDate : transfer.outboundArrivalDate
  const activeFlightDate = isReturnTab ? transfer.returnDate : transfer.departureDate
  const basePrice = selectedVehicle?.price ?? 0
  const baseTotalPrice = basePrice

  const buildFlightTransferUpdate = (updates: {
    flightNumber?: string
    arrivalDate?: string | null
    airlineCompany?: string | null
    amadeusFlightInfo?: typeof transfer.outboundAmadeusFlightInfo
  }) => {
    if (isReturnTab) {
      return {
        returnFlightNumber: updates.flightNumber ?? transfer.returnFlightNumber,
        returnArrivalDate:
          updates.arrivalDate === undefined ? transfer.returnArrivalDate : updates.arrivalDate,
        returnAirlineCompany:
          updates.airlineCompany === undefined ? transfer.returnAirlineCompany : updates.airlineCompany,
        returnAmadeusFlightInfo:
          updates.amadeusFlightInfo === undefined
            ? transfer.returnAmadeusFlightInfo
            : updates.amadeusFlightInfo,
      }
    }

    return {
      outboundFlightNumber: updates.flightNumber ?? transfer.outboundFlightNumber,
      outboundArrivalDate:
        updates.arrivalDate === undefined ? transfer.outboundArrivalDate : updates.arrivalDate,
      outboundAirlineCompany:
        updates.airlineCompany === undefined
          ? transfer.outboundAirlineCompany
          : updates.airlineCompany,
      outboundAmadeusFlightInfo:
        updates.amadeusFlightInfo === undefined
          ? transfer.outboundAmadeusFlightInfo
          : updates.amadeusFlightInfo,
    }
  }

  const setTransferType = (transferType: "ida" | "volta") => {
    setError("")
    setFlightSuccess("")
    updateTransfer({ transferType })
  }

  const premiumInsurancePrice = payment.premiumInsurance ? (isRoundTrip ? 18 : 9) : 0
  const refundTermsPrice = payment.refundTerms ? (isRoundTrip ? 8 : 4) : 0
  const comfortConnectionPrice = payment.comfortConnection ? (isRoundTrip ? 14 : 7) : 0
  const insuranceTotal = premiumInsurancePrice + refundTermsPrice + comfortConnectionPrice
  const cardFeeRate = payment.method === "cartao" ? 0.02 : 0

  const multiplier = isRoundTrip ? 2 : 1
  const totalChildSeats = transfer.childSeatChecked ? (transfer.childSeats.baby + transfer.childSeats.child + transfer.childSeats.booster) : 0
  const totalSurfboards = transfer.surfboardChecked ? (transfer.surfboard.standard + transfer.surfboard.upgraded) : 0
  const totalPets = transfer.petChecked ? (transfer.pet.small + transfer.pet.large) : 0
  const childSeatsCost = totalChildSeats * 5 * multiplier
  const surfboardsCost = totalSurfboards * 5 * multiplier
  const petsCost = totalPets * 10 * multiplier
  const extrasTotal = childSeatsCost + surfboardsCost + petsCost

  const experiencesTotal = experiences.reduce((sum, exp) => sum + exp.totalPrice, 0)

  const priceBreakdown = useMemo(() => calculatePriceBreakdown({
    basePrice: baseTotalPrice,
    cardFeeRate,
    insuranceTotal: insuranceTotal + extrasTotal,
  }), [baseTotalPrice, cardFeeRate, insuranceTotal, extrasTotal])

  const continueButtonTotal = priceBreakdown.total + experiencesTotal

  const updateChildSeats = (next: typeof transfer.childSeats) => {
    const any = next.baby + next.child + next.booster > 0
    updateTransfer({ childSeats: next, childSeatChecked: any })
  }
  const childSeats = [
    {
      id: "baby",
      title: t("babySeat"),
      ageRange: t("babySeatAge"),
      image: "/images/c589411c-9d31-4b5a-82af.jpeg",
      value: transfer.childSeats.baby,
      onChange: (v: number) => updateChildSeats({ ...transfer.childSeats, baby: v }),
    },
    {
      id: "child",
      title: t("childSeatLabel"),
      ageRange: t("childSeatAge"),
      image: "/images/cadeira-crianca.jpeg",
      value: transfer.childSeats.child,
      onChange: (v: number) => updateChildSeats({ ...transfer.childSeats, child: v }),
    },
    {
      id: "booster",
      title: t("boosterSeat"),
      ageRange: t("boosterSeatAge"),
      image: "/images/banco-elevatorio.jpeg",
      value: transfer.childSeats.booster,
      onChange: (v: number) => updateChildSeats({ ...transfer.childSeats, booster: v }),
    },
  ]

  const updateSurfboard = (next: typeof transfer.surfboard) => {
    const any = next.standard + next.upgraded > 0
    updateTransfer({ surfboard: next, surfboardChecked: any })
  }
  const surfboards = [
    {
      id: "standard",
      title: t("standardSurfboard"),
      subtitle: t("standardSurfboardSize"),
      iconImage: "/checkout/icons/surfboard_checkout.png",
      iconImageClassName: "w-5 h-5",
      value: transfer.surfboard.standard,
      onChange: (v: number) => updateSurfboard({ ...transfer.surfboard, standard: v }),
    },
    {
      id: "upgraded",
      title: t("biggerSurfboard"),
      subtitle: t("biggerSurfboardSize"),
      iconImage: "/checkout/icons/surfboard_checkout.png",
      iconImageClassName: "w-8 h-8",
      value: transfer.surfboard.upgraded,
      onChange: (v: number) => updateSurfboard({ ...transfer.surfboard, upgraded: v }),
      badge: t("requiresXl"),
    },
  ]

  const updatePet = (next: typeof transfer.pet) => {
    const any = next.small + next.large > 0
    updateTransfer({ pet: next, petChecked: any })
  }
  const pets = [
    {
      id: "small",
      title: t("smallPet"),
      subtitle: t("smallPetWeight"),
      icon: Dog,
      value: transfer.pet.small,
      onChange: (v: number) => updatePet({ ...transfer.pet, small: v }),
    },
    {
      id: "large",
      title: t("largePet"),
      subtitle: t("largePetWeight"),
      icon: Dog,
      value: transfer.pet.large,
      onChange: (v: number) => updatePet({ ...transfer.pet, large: v }),
      badge: t("requiresXl"),
    },
  ]

  const showLocationFields = transfer.transferType === "ida" || (transfer.transferType === "volta" && transfer.bookReturn)
  const stops = transfer.stops || []

  const handleAddStop = () => {
    if (stops.length < 1) {
      updateTransfer({ stops: [...stops, { text: "", placeId: null, lat: null, lng: null }] })
    }
  }

  const handleRemoveStop = (index: number) => {
    updateTransfer({ stops: stops.filter((_, i) => i !== index) })
  }

  const handleUpdateStop = (
    index: number,
    v: { location: string; placeId: string | null; lat: number | null; lng: number | null }
  ) => {
    const nextStops = [...stops]
    nextStops[index] = { text: v.location, placeId: v.placeId, lat: v.lat, lng: v.lng }
    updateTransfer({ stops: nextStops })
  }

  const handleFlightLookup = async () => {
    setError("")
    setFlightSuccess("")
    if (!activeFlightNumber) {
      setError(t("enterFlightNumber"))
      return
    }
    if (!activeFlightDate) {
      setError(t("selectDateFirst"))
      return
    }

    try {
      const depDate = formatLocalDate(activeFlightDate)
      const resp = await lookupFlight(convex, {
        flightNumber: activeFlightNumber,
        departureDate: depDate,
      })

      if (resp) {
        updateTransfer(
          buildFlightTransferUpdate({
            arrivalDate: resp.arrivalDateTimeLocal,
            airlineCompany: resp.airlineCompany,
            amadeusFlightInfo: resp.amadeusFlightInfo ?? null,
          })
        )
        setFlightSuccess(t("flightVerified", { airline: resp.airlineCompany }))
      } else {
        toast.error(t("flightNotFound") || "Flight not found", {
          description:
            t("flightNotFoundDesc") ||
            `Could not find flight ${activeFlightNumber} on ${depDate}. Please verify the flight number and date.`,
        })
      }
    } catch (e: any) {
      console.error("Flight lookup failed:", e)
      setError(e?.message || t("flightNotFound"))
    }
  }

  const resolvePlaceFromText = async (
    text: string
  ): Promise<{ placeId: string; lat: number | null; lng: number | null } | null> => {
    const trimmed = String(text || "").trim()
    if (!trimmed) return null
    const google = (globalThis as any).google
    const svc = google?.maps?.places?.AutocompleteService
    const PlacesService = google?.maps?.places?.PlacesService
    if (!svc || !PlacesService) return null

    const service = new svc()
    const placeId = await new Promise<string | null>((resolve) => {
      service.getPlacePredictions({ input: trimmed }, (predictions: Array<{ place_id?: string }> | null) => {
        resolve(predictions?.[0]?.place_id ?? null)
      })
    })

    if (!placeId) return null

    const placesService = new PlacesService(document.createElement("div"))
    const details = await new Promise<{ lat: number | null; lng: number | null }>((resolve) => {
      placesService.getDetails({ placeId, fields: ["geometry"] }, (place: any, status: string) => {
        if (status === "OK" && place?.geometry?.location) {
          resolve({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() })
        } else {
          resolve({ lat: null, lng: null })
        }
      })
    })

    return { placeId, lat: details.lat, lng: details.lng }
  }

  const handleBack = () => {
    if (transfer.transferType === "volta") {
      setTransferType("ida")
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }
    setShowTransferForm(false)
  }

  const handleContinue = async () => {
    if (transfer.transferType === "ida") {
      setTransferType("volta")
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    setError("")
    if (!selectedVehicle) {
      setError("Please select a vehicle first.")
      return
    }
    if (!transfer.departureDate) {
      setError("Please choose the departure date and time.")
      return
    }
    const departureDate =
      transfer.departureDate instanceof Date ? transfer.departureDate : new Date(transfer.departureDate as any)
    if (!Number.isFinite(departureDate.getTime())) {
      updateTransfer({ departureDate: undefined })
      setError("Please choose the departure date and time.")
      return
    }
    if (!transfer.fromLocation || !transfer.toLocation) {
      setError(t("fillLocations"))
      return
    }

    if (isRoundTrip && !transfer.returnDate) {
      setError(t("returnDateRequired"))
      return
    }

    const outboundFlightNeedsVerification = Boolean(
      transfer.outboundFlightNumber &&
        (!transfer.outboundArrivalDate || !transfer.outboundAirlineCompany)
    )
    const returnFlightNeedsVerification = Boolean(
      isRoundTrip &&
        transfer.returnFlightNumber &&
        (!transfer.returnArrivalDate || !transfer.returnAirlineCompany)
    )
    if (outboundFlightNeedsVerification || returnFlightNeedsVerification) {
      setError(t("verifyFlight") || "Please verify the flight information.")
      return
    }

    setIsSubmitting(true)
    try {
      let fromPlaceId = transfer.fromPlaceId
      let fromLat = transfer.fromLat
      let fromLng = transfer.fromLng
      let toPlaceId = transfer.toPlaceId
      let toLat = transfer.toLat
      let toLng = transfer.toLng

      if (!fromPlaceId) {
        const resolved = await resolvePlaceFromText(transfer.fromLocation)
        if (resolved) {
          fromPlaceId = resolved.placeId
          fromLat = resolved.lat
          fromLng = resolved.lng
          updateTransfer({ fromPlaceId, fromLat, fromLng })
        }
      }
      if (!toPlaceId) {
        const resolved = await resolvePlaceFromText(transfer.toLocation)
        if (resolved) {
          toPlaceId = resolved.placeId
          toLat = resolved.lat
          toLng = resolved.lng
          updateTransfer({ toPlaceId, toLat, toLng })
        }
      }

      const resolvedStops = await Promise.all(
        stops.map(async (stop) => {
          if (stop.placeId) return stop
          const resolved = await resolvePlaceFromText(stop.text)
          return {
            text: stop.text,
            placeId: resolved?.placeId ?? null,
            lat: resolved?.lat ?? null,
            lng: resolved?.lng ?? null,
          }
        })
      )
      updateTransfer({ stops: resolvedStops })

      if (!fromPlaceId || !toPlaceId) {
        setError("Please select a suggestion for both origin and destination.")
        return
      }

      const departure = toBackendLocation({
        location: transfer.fromLocation,
        placeId: fromPlaceId,
        lat: fromLat,
        lng: fromLng,
      })
      const arrival = toBackendLocation({ location: transfer.toLocation, placeId: toPlaceId, lat: toLat, lng: toLng })
      const backendStops = resolvedStops.map((s) =>
        toBackendLocation({ location: s.text, placeId: s.placeId, lat: s.lat, lng: s.lng })
      )

      let currentOrderId = orderId
      let returnOrderId: string | null = null

      if (!currentOrderId) {
        const initOrderPayload = {
          departure,
          arrival,
          stops: backendStops,
          passengers: transfer.passengers,
          adults: transfer.adults,
          children: transfer.children,
          departureDate: formatLocalDateTime(departureDate, true),
          isRoundTrip: false,
          returnDate: undefined,
        }
        const initResp = await initOrder(convex, initOrderPayload)
        currentOrderId = initResp.order.id
        setOrder(currentOrderId, initResp.order)
      } else {
        const existingOrder = await convex.query(api.orders.getByOrderNumber, { orderNumber: String(currentOrderId) })
        if (existingOrder?.relatedOrderId) {
          const returnOrder = await convex.query(api.orders.getById, { orderId: existingOrder.relatedOrderId })
          returnOrderId = returnOrder?.orderNumber || null
        }
      }

      if (isRoundTrip && !returnOrderId) {
        const returnDate = transfer.returnDate
          ? new Date(transfer.returnDate)
          : departureDate ? new Date(departureDate.getTime() + 24 * 60 * 60 * 1000) : new Date()

        if (Number.isFinite(returnDate.getTime())) {
          const returnOrderResp = await createReturnOrder(convex, currentOrderId, {
            departure: arrival,
            arrival: departure,
            departureDate: formatLocalDateTime(returnDate, true),
            passengers: transfer.passengers,
            adults: transfer.adults,
            children: transfer.children,
          })
          returnOrderId = returnOrderResp.order.id
        }
      }

      const vehicleBasePrice = basePrice
      const selectCarPayload = {
        carId: String(selectedVehicle.id),
        type: selectedVehicle.name,
        price: vehicleBasePrice,
        passengerCapacity: selectedVehicle.passengers,
      }
      await selectCar(convex, currentOrderId, selectCarPayload)

      if (isRoundTrip && returnOrderId) {
        await selectCar(convex, returnOrderId, selectCarPayload)
      }

      const registTripPayload = {
        flightNumber: transfer.outboundFlightNumber || "",
        departureDate: formatLocalDateTime(departureDate, false),
        backpacks: transfer.luggage.backpack,
        handbaggage: transfer.luggage.handLuggage,
        pets: transfer.petChecked ? transfer.pet.small + transfer.pet.large : 0,
        smallPets: transfer.petChecked ? transfer.pet.small : 0,
        largePets: transfer.petChecked ? transfer.pet.large : 0,
        childSeats: transfer.childSeatChecked ? transfer.childSeats.child : 0,
        babySeats: transfer.childSeatChecked ? transfer.childSeats.baby : 0,
        boosterSeats: transfer.childSeatChecked ? transfer.childSeats.booster : 0,
        checkedBaggage: transfer.luggage.checkedBaggage,
        surfboards: transfer.surfboardChecked ? transfer.surfboard.standard + transfer.surfboard.upgraded : 0,
        standardSurfboards: transfer.surfboardChecked ? transfer.surfboard.standard : 0,
        largeSurfboards: transfer.surfboardChecked ? transfer.surfboard.upgraded : 0,
        passengers: transfer.passengers,
        adults: transfer.adults,
        children: transfer.children,
        flightType: "IDA" as const,
        departure,
        arrival,
        arrivalDate: transfer.outboundArrivalDate as any,
        airlineCompany:
          transfer.outboundAirlineCompany ||
          (transfer.outboundFlightNumber ? "Unknown" : null),
        amadeusFlightInfo: transfer.outboundAmadeusFlightInfo,
        distance: distance ?? undefined,
        routeDurationMinutes: routeDuration ?? undefined,
      }
      await registTrip(convex, currentOrderId, registTripPayload)

      if (isRoundTrip && returnOrderId) {
        const returnDate = transfer.returnDate
          ? new Date(transfer.returnDate)
          : departureDate ? new Date(departureDate.getTime() + 24 * 60 * 60 * 1000) : new Date()

        if (Number.isFinite(returnDate.getTime())) {
          const returnTripPayload = {
            flightNumber: transfer.returnFlightNumber || "",
            departureDate: formatLocalDateTime(returnDate, false),
            backpacks: transfer.luggage.backpack,
            handbaggage: transfer.luggage.handLuggage,
            pets: transfer.petChecked ? transfer.pet.small + transfer.pet.large : 0,
            smallPets: transfer.petChecked ? transfer.pet.small : 0,
            largePets: transfer.petChecked ? transfer.pet.large : 0,
            childSeats: transfer.childSeatChecked ? transfer.childSeats.child : 0,
            babySeats: transfer.childSeatChecked ? transfer.childSeats.baby : 0,
            boosterSeats: transfer.childSeatChecked ? transfer.childSeats.booster : 0,
            checkedBaggage: transfer.luggage.checkedBaggage,
            surfboards: transfer.surfboardChecked ? transfer.surfboard.standard + transfer.surfboard.upgraded : 0,
            standardSurfboards: transfer.surfboardChecked ? transfer.surfboard.standard : 0,
            largeSurfboards: transfer.surfboardChecked ? transfer.surfboard.upgraded : 0,
            passengers: transfer.passengers,
            adults: transfer.adults,
            children: transfer.children,
            flightType: "VOLTA" as const,
            departure: arrival,
            arrival: departure,
            arrivalDate: transfer.returnArrivalDate,
            airlineCompany:
              transfer.returnAirlineCompany ||
              (transfer.returnFlightNumber ? "Unknown" : null),
            amadeusFlightInfo: transfer.returnAmadeusFlightInfo,
            distance: distance ?? undefined,
            routeDurationMinutes: routeDuration ?? undefined,
          }
          await registTrip(convex, returnOrderId, returnTripPayload)
        }
      }

      onContinue()
    } catch (e: any) {
      setError(e?.message || "Failed to submit transfer details.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const luggageCapacity = selectedVehicle?.luggage ?? Infinity
  const currentTotalLuggage = transfer.luggage.backpack + transfer.luggage.handLuggage + transfer.luggage.checkedBaggage
  const remainingLuggageCapacity = Math.max(0, luggageCapacity - currentTotalLuggage)

  const passengerCapacity = selectedVehicle?.passengers ?? Infinity
  const isEditingReturn = isReturnTab && transfer.bookReturn
  const displayFromLocation = isReturnTab ? transfer.toLocation : transfer.fromLocation
  const displayFromPlaceId = isReturnTab ? transfer.toPlaceId : transfer.fromPlaceId
  const displayFromLat = isReturnTab ? transfer.toLat : transfer.fromLat
  const displayFromLng = isReturnTab ? transfer.toLng : transfer.fromLng
  const displayToLocation = isReturnTab ? transfer.fromLocation : transfer.toLocation
  const displayToPlaceId = isReturnTab ? transfer.fromPlaceId : transfer.toPlaceId
  const displayToLat = isReturnTab ? transfer.fromLat : transfer.toLat
  const displayToLng = isReturnTab ? transfer.fromLng : transfer.toLng

  const handleUpgrade = () => {
    setUpgradeMode(true)
    setShowTransferForm(false)
    setStep(1)
  }

  const luggageItems = [
    {
      label: t("backpack"),
      icon: Backpack,
      value: transfer.luggage.backpack,
      onChange: (v: number) => updateTransfer({ luggage: { ...transfer.luggage, backpack: v } }),
      max: transfer.luggage.backpack + remainingLuggageCapacity,
    },
    {
      label: t("handLuggage"),
      icon: Luggage,
      value: transfer.luggage.handLuggage,
      onChange: (v: number) => updateTransfer({ luggage: { ...transfer.luggage, handLuggage: v } }),
      max: transfer.luggage.handLuggage + remainingLuggageCapacity,
    },
    {
      label: t("checkedBaggage"),
      icon: Briefcase,
      value: transfer.luggage.checkedBaggage,
      onChange: (v: number) => updateTransfer({ luggage: { ...transfer.luggage, checkedBaggage: v } }),
      max: transfer.luggage.checkedBaggage + remainingLuggageCapacity,
    },
  ]

  const arrivalTimeStr = formatFlightTime(activeArrivalDate)
  const pickupTimeStr = formatFlightTime(activeFlightDate)
  const showFlightTimeline = Boolean(arrivalTimeStr || activeAirlineCompany)

  return (
    <div className="w-full">
      <h2
        className="text-[28px] md:text-[32px] font-normal text-[#F7F4EF] mb-6 leading-none"
        style={SERIF_FONT}
      >
        {t("tripDetails")}
      </h2>

      <div className="grid grid-cols-2 mb-6">
        <button
          type="button"
          onClick={() => setTransferType("ida")}
          className={cn(
            "h-12 text-[13px] font-semibold uppercase tracking-[1px] transition-colors",
            transfer.transferType === "ida"
              ? "bg-[#C9A96E] text-[#0D0D0D]"
              : "bg-[#1A1918] text-[#999] border border-[rgba(255,255,255,0.06)] hover:text-[#F7F4EF]",
          )}
        >
          {t("outbound")}
        </button>
        <button
          type="button"
          onClick={() => setTransferType("volta")}
          className={cn(
            "h-12 text-[13px] font-semibold uppercase tracking-[1px] transition-colors",
            transfer.transferType === "volta"
              ? "bg-[#C9A96E] text-[#0D0D0D]"
              : "bg-[#1A1918] text-[#999] border border-[rgba(255,255,255,0.06)] hover:text-[#F7F4EF]",
          )}
        >
          {t("return")}
        </button>
      </div>

      {transfer.transferType === "volta" && (
        <label
          htmlFor="book-return"
          className="flex items-center gap-2 cursor-pointer mb-4 bg-[#1A1918] border border-[rgba(255,255,255,0.06)] px-3 py-2.5"
        >
          <Checkbox
            id="book-return"
            checked={transfer.bookReturn}
            onCheckedChange={(checked: boolean) => updateTransfer({ bookReturn: checked })}
            className="border-[rgba(201,169,110,0.5)] data-[state=checked]:bg-[#C9A96E] data-[state=checked]:border-[#C9A96E]"
          />
          <span className="text-[13px] text-[#F7F4EF]">{t("bookReturn")}</span>
        </label>
      )}

      <AnimatedCollapse isOpen={showLocationFields}>
        <div className="mb-4">
          <FieldLabel>{t("from")}</FieldLabel>
          <DarkFieldBox>
            <GooglePlacesInput
              value={{
                location: displayFromLocation,
                placeId: displayFromPlaceId,
                lat: displayFromLat,
                lng: displayFromLng,
              }}
              onChange={(v) => {
                if (isReturnTab) {
                  updateTransfer({
                    toLocation: v.location,
                    toPlaceId: v.placeId,
                    toLat: v.lat,
                    toLng: v.lng,
                  })
                  return
                }
                updateTransfer({
                  fromLocation: v.location,
                  fromPlaceId: v.placeId,
                  fromLat: v.lat,
                  fromLng: v.lng,
                })
              }}
              placeholder={t("departureLocation")}
              variant="tours-hero-dark"
              hideLeftIcon
            />
          </DarkFieldBox>
        </div>

        {stops.length === 0 && (
          <button
            type="button"
            onClick={handleAddStop}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#C9A96E] hover:text-[#b89558] transition-colors mb-4"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            {t("addStop")}
          </button>
        )}

        {stops.map((stop, index) => (
          <div key={index} className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <FieldLabel>{t("extraStop")}</FieldLabel>
              <button
                type="button"
                onClick={() => handleRemoveStop(index)}
                className="text-[#696969] hover:text-[#C9A96E] transition-colors -mt-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <DarkFieldBox>
              <GooglePlacesInput
                value={{ location: stop.text, placeId: stop.placeId, lat: stop.lat, lng: stop.lng }}
                onChange={(v) => handleUpdateStop(index, v)}
                placeholder={t("destinationLocation")}
                variant="tours-hero-dark"
                hideLeftIcon
              />
            </DarkFieldBox>
          </div>
        ))}

        <div className="mb-4">
          <FieldLabel>{t("to")}</FieldLabel>
          <DarkFieldBox>
            <GooglePlacesInput
              value={{
                location: displayToLocation,
                placeId: displayToPlaceId,
                lat: displayToLat,
                lng: displayToLng,
              }}
              onChange={(v) => {
                if (isReturnTab) {
                  updateTransfer({
                    fromLocation: v.location,
                    fromPlaceId: v.placeId,
                    fromLat: v.lat,
                    fromLng: v.lng,
                  })
                  return
                }
                updateTransfer({
                  toLocation: v.location,
                  toPlaceId: v.placeId,
                  toLat: v.lat,
                  toLng: v.lng,
                })
              }}
              placeholder={t("destinationLocation")}
              variant="tours-hero-dark"
              hideLeftIcon
            />
          </DarkFieldBox>
        </div>

        {!isReturnTab && (
          <div className="mb-4">
            <FieldLabel>{isRoundTrip ? t("departureDateLabel") : t("dateTime")}</FieldLabel>
            <DarkFieldBox>
              <DateTimePicker
                value={transfer.departureDate}
                onChange={(d) => updateTransfer({ departureDate: d })}
                variant="new-widget"
                hideLeftIcon
              />
            </DarkFieldBox>
          </div>
        )}

        <AnimatedCollapse isOpen={isEditingReturn}>
          <div className="mb-4">
            <FieldLabel>{t("returnDateLabel")}</FieldLabel>
            <DarkFieldBox>
              <DateTimePicker
                value={transfer.returnDate}
                onChange={(d) => updateTransfer({ returnDate: d })}
                placeholder={t("return") || "Regresso"}
                variant="new-widget"
                hideLeftIcon
              />
            </DarkFieldBox>
          </div>
        </AnimatedCollapse>

        <div className="mb-4">
          <FieldLabel>{t("flightNumber")}</FieldLabel>
          <DarkInput
            value={activeFlightNumber}
            onChange={(v) => {
              setFlightSuccess("")
              updateTransfer(
                buildFlightTransferUpdate({
                  flightNumber: v,
                  arrivalDate: null,
                  airlineCompany: null,
                  amadeusFlightInfo: null,
                })
              )
            }}
            placeholder="TP941"
            rightAdornment={
              <button
                type="button"
                onClick={handleFlightLookup}
                className={cn(
                  "transition-colors",
                  activeAirlineCompany ? "text-[#C9A96E]" : "text-[#696969] hover:text-[#C9A96E]"
                )}
                aria-label="Search flight"
              >
                <Search className="w-5 h-5" />
              </button>
            }
          />
          {activeAirlineCompany && (
            <p className="mt-1.5 text-[11px] font-semibold text-[#C9A96E]">
              ✓ {activeAirlineCompany}
            </p>
          )}
        </div>

        {showFlightTimeline && (
          <div className="mb-3">
            <FlightTimeline arrivalTime={arrivalTimeStr} pickupTime={pickupTimeStr} />
          </div>
        )}

        <div className="flex items-start gap-2 mb-2 pl-1">
          <Info className="w-3.5 h-3.5 text-[#696969] flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-[#999] leading-[1.5]">{t("flightInfo")}</p>
        </div>

        <SectionLabel>{t("passengers")}</SectionLabel>
        <div className="grid grid-cols-2 gap-3">
          <IconOptionCard
            icon={Users}
            title={t("adults")}
            subtitle="IDADE 12+"
            selected={transfer.adults > 0}
          >
            <DarkCounter
              value={transfer.adults}
              onChange={(v) => updateTransfer({ adults: v, passengers: v + transfer.children })}
              min={1}
              max={passengerCapacity}
            />
          </IconOptionCard>
          <IconOptionCard
            icon={Baby}
            title={t("children")}
            subtitle="ABAIXO DE 12"
            selected={transfer.children > 0}
          >
            <DarkCounter
              value={transfer.children}
              onChange={(v) => updateTransfer({ children: v, passengers: transfer.adults + v })}
              min={0}
              max={Math.max(0, passengerCapacity - transfer.adults)}
            />
          </IconOptionCard>
        </div>

        {transfer.passengers >= passengerCapacity && (
          <UpgradeBanner message={t("passengerLimit")} label={tCommon("upgrade")} onClick={handleUpgrade} />
        )}

        <SectionLabel>{t("bags")}</SectionLabel>
        <div className="grid grid-cols-3 gap-3">
          {luggageItems.map((item) => (
            <IconOptionCard
              key={item.label}
              icon={item.icon}
              title={item.label}
              selected={item.value > 0}
            >
              <DarkCounter
                value={item.value}
                onChange={item.onChange}
                min={0}
                max={item.max}
              />
            </IconOptionCard>
          ))}
        </div>

        {remainingLuggageCapacity === 0 && (
          <UpgradeBanner message={t("luggageLimit")} label={tCommon("upgrade")} onClick={handleUpgrade} />
        )}

        <SectionLabel>{t("childSeat")}</SectionLabel>
        <div className="grid grid-cols-3 gap-3">
          {childSeats.map((seat) => (
            <ImageOptionCard
              key={seat.id}
              image={seat.image}
              title={seat.title}
              subtitle={seat.ageRange}
              selected={seat.value > 0}
            >
              <DarkCounter value={seat.value} onChange={seat.onChange} min={0} />
            </ImageOptionCard>
          ))}
        </div>

        <SectionLabel>{t("surfboard")}</SectionLabel>
        <div className="grid grid-cols-2 gap-3">
          {surfboards.map((item) => (
            <IconOptionCard
              key={item.id}
              iconImage={item.iconImage}
              iconImageClassName={item.iconImageClassName}
              title={item.title}
              subtitle={item.subtitle}
              badge={item.badge}
              selected={item.value > 0}
            >
              <DarkCounter value={item.value} onChange={item.onChange} min={0} />
            </IconOptionCard>
          ))}
        </div>
        {transfer.surfboard.upgraded > 0 && passengerCapacity <= 5 && (
          <UpgradeBanner message={t("surfboardUpgradeNeeded")} label={tCommon("upgrade")} onClick={handleUpgrade} />
        )}

        <SectionLabel>{t("pet")}</SectionLabel>
        <div className="grid grid-cols-2 gap-3">
          {pets.map((item) => (
            <IconOptionCard
              key={item.id}
              icon={item.icon}
              title={item.title}
              subtitle={item.subtitle}
              badge={item.badge}
              selected={item.value > 0}
            >
              <DarkCounter value={item.value} onChange={item.onChange} min={0} />
            </IconOptionCard>
          ))}
        </div>
        {transfer.pet.large > 0 && passengerCapacity <= 5 && (
          <UpgradeBanner message={t("petUpgradeNeeded")} label={tCommon("upgrade")} onClick={handleUpgrade} />
        )}

        <div className="mt-6">
          <label htmlFor="terms" className="flex items-center gap-3 cursor-pointer bg-[#1A1918] border border-[rgba(255,255,255,0.06)] px-4 py-3">
            <Checkbox
              id="terms"
              checked={transfer.acceptTerms}
              onCheckedChange={(checked: boolean) => updateTransfer({ acceptTerms: checked })}
              className="border-[rgba(201,169,110,0.5)] data-[state=checked]:bg-[#C9A96E] data-[state=checked]:border-[#C9A96E]"
            />
            <span className="text-[13px] text-[#F7F4EF] leading-relaxed">{t("agreeTerms")}</span>
          </label>
        </div>
      </AnimatedCollapse>

      {error && (
        <div className="mt-4 text-[12px] text-[#E53935]" aria-live="polite">
          {error}
        </div>
      )}

      {flightSuccess && (
        <div className="mt-4 text-[12px] text-[#C9A96E]" aria-live="polite">
          {flightSuccess}
        </div>
      )}

      <div className="flex items-center justify-between gap-4 mt-6">
        <button
          type="button"
          onClick={handleBack}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 h-12 px-6 text-[13px] font-semibold uppercase tracking-[1px] text-[#F7F4EF] bg-[#1A1918] border border-[rgba(255,255,255,0.08)] hover:border-[#C9A96E] hover:text-[#C9A96E] transition-colors disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2} />
          {tCommon("back")}
        </button>
        <button
          type="button"
          onClick={handleContinue}
          disabled={isSubmitting || !transfer.acceptTerms}
          className="inline-flex items-center gap-2 h-12 px-8 text-[13px] font-semibold uppercase tracking-[1px] bg-[#C9A96E] hover:bg-[#b89558] text-[#0D0D0D] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {transfer.transferType === "ida"
            ? tCommon("continue")
            : t("continueWithPrice", { price: continueButtonTotal.toFixed(2).replace(".", ",") })}
          <ArrowRight className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}

function UpgradeBanner({
  message,
  label,
  onClick,
}: {
  message: string
  label: string
  onClick: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-3 bg-[rgba(201,169,110,0.07)] border border-[rgba(201,169,110,0.22)] px-4 py-3 mt-3 animate-in fade-in duration-300">
      <p className="text-[12px] text-[#F7F4EF]">{message}</p>
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[1px] text-[#C9A96E] hover:text-[#b89558] transition-colors"
      >
        {label}
        <ChevronRight className="w-3.5 h-3.5" strokeWidth={2} />
      </button>
    </div>
  )
}

