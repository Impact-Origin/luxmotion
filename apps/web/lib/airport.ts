// Airport detection for the +12% airport-pickup surcharge ("ideia do Afonso").
// Reuses the same keyword set as the location autocomplete so the major PT
// airports (LIS/OPO/FAO) and their localized names ("Aeroporto de Lisboa",
// "…Airport", "Flughafen", …) are recognized from the free-text pickup address.
const AIRPORT_KEYWORDS = [
  "airport",
  "aeroporto",
  "aeropuerto",
  "aéroport",
  "aeroport",
  "flughafen",
]

/** True when a free-text location string looks like an airport. */
export function isAirportLocation(text: string | null | undefined): boolean {
  if (!text) return false
  const value = text.toLowerCase()
  return AIRPORT_KEYWORDS.some((keyword) => value.includes(keyword))
}

/** Percentage added to the base transfer fare when the pickup is an airport. */
export const AIRPORT_SURCHARGE_PERCENT = 12
