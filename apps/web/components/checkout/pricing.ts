import { calculateTotalChildSeats } from "@/lib/format"

/**
 * Single source of truth for the MAIN checkout add-on prices (mirrors the partnership
 * checkout's ./customizable-checkout/pricing). The prices used to be duplicated across
 * the option cards, the invoice and the payment charge and drifted apart — surfboards/
 * child seats/pets were shown but never charged, Meet & Greet showed €4 but charged €5,
 * and Priority Pickup was charged but missing from the invoice. Everything now reads
 * from here so the displayed invoice and the charged amount can't diverge.
 *
 * Values are the ONE-WAY euro amounts; a round trip pays ×2 (the transfer runs both ways).
 */
export const INSURANCE_PRICE = {
  premiumInsurance: 9, // Airport Guarantee
  refundTerms: 5, // Meet & Greet
  priorityPickup: 6, // Priority Pickup
  comfortConnection: 7, // Comfort Pack
} as const

export type InsuranceKey = keyof typeof INSURANCE_PRICE

/** Per-unit price of each luggage extra (EUR, one-way; ×2 for round trip). */
export const EXTRA_UNIT_PRICE = { childSeat: 5, surfboard: 5, pet: 10 } as const

export function insurancePrice(key: InsuranceKey, isRoundTrip: boolean): number {
  return INSURANCE_PRICE[key] * (isRoundTrip ? 2 : 1)
}

type ExtrasSelection = {
  childSeats: { baby: number; child: number; booster: number }
  surfboardChecked: boolean
  surfboard: { standard: number; upgraded: number }
  petChecked: boolean
  pet: { small: number; large: number }
}

/** Luggage extras breakdown + total, shared by the summary (line items) and the charge. */
export function calcExtras(transfer: ExtrasSelection, isRoundTrip: boolean) {
  const multiplier = isRoundTrip ? 2 : 1
  const childSeats = calculateTotalChildSeats(transfer.childSeats)
  const surfboards = transfer.surfboardChecked
    ? transfer.surfboard.standard + transfer.surfboard.upgraded
    : 0
  const pets = transfer.petChecked ? transfer.pet.small + transfer.pet.large : 0
  const childSeatsCost = childSeats * EXTRA_UNIT_PRICE.childSeat * multiplier
  const surfboardsCost = surfboards * EXTRA_UNIT_PRICE.surfboard * multiplier
  const petsCost = pets * EXTRA_UNIT_PRICE.pet * multiplier
  return {
    childSeats,
    surfboards,
    pets,
    childSeatsCost,
    surfboardsCost,
    petsCost,
    total: childSeatsCost + surfboardsCost + petsCost,
  }
}
