export interface FilterOption {
  value: string
  label: string
  count: number
}

export type FilterGroupKey = "regions" | "tourTypes" | "durations" | "themes" | "groupSizes"

export interface BrowseFilters {
  regions: string[]
  tourTypes: string[]
  durations: string[]
  themes: string[]
  groupSizes: string[]
  price: [number, number]
}

export const DURATION_BUCKETS = [
  { value: "1-3", min: 1, max: 3 },
  { value: "4-7", min: 4, max: 7 },
  { value: "8-10", min: 8, max: 10 },
  { value: "10+", min: 11, max: Infinity },
] as const

export const GROUP_BUCKETS = [
  { value: "1-2", min: 1, max: 2 },
  { value: "3-4", min: 3, max: 4 },
  { value: "5-6", min: 5, max: 6 },
  { value: "7-8", min: 7, max: 8 },
  { value: "9+", min: 9, max: Infinity },
] as const

export const DUR_LABEL_KEY: Record<string, string> = {
  "1-3": "d1to3",
  "4-7": "d4to7",
  "8-10": "d8to10",
  "10+": "d10plus",
}

export const TOUR_TYPE_LABEL_KEY: Record<string, string> = {
  "half-day": "halfDay",
  "full-day": "fullDay",
  "multi-day": "multiDay",
  "river-cruise": "riverCruise",
  "private-yacht": "privateYacht",
  helicopter: "helicopter",
}

export const emptyFilters = (price: [number, number]): BrowseFilters => ({
  regions: [],
  tourTypes: [],
  durations: [],
  themes: [],
  groupSizes: [],
  price,
})
