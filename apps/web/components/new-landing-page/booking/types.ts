import { LucideIcon } from "lucide-react"

export type TripType = "oneWay" | "roundTrip" | "events" | "tours"

export interface LocationSuggestion {
  type: "airport" | "hotel" | "station" | "address"
  name: string
  description?: string
  icon: LucideIcon
  placeId?: string | null
  lat?: number | null
  lng?: number | null
}

export interface PassengerState {
  adults: number
  children: number
}

export interface TourPassengerState {
  adults: number
  children: number
  infants: number
}

export interface LuggageState {
  backpack: number
  handLuggage: number
  checkedBaggage: number
}

export interface EventTour {
  id: number
  name: string
  price: number
  image: string
}

/** Product item for widget (tour, experience or event from API) - used to open the same checkout modal */
export type WidgetProductType = "tour" | "experience" | "event"

export interface WidgetProductItem {
  _id: string
  productType: WidgetProductType
  title: string
  slug: string
  price: number
  image?: string
  subtitle?: string
  eventDate?: number
  pickup?: { title: string; address: string; description?: string; lat?: number; lng?: number; placeId?: string }
  meetingPoint?: { title: string; address: string; description?: string; lat?: number; lng?: number; placeId?: string }
  minPassengers?: number
  maxPassengers?: number
}
