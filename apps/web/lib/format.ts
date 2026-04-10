function ensureDate(date: Date | string | number | undefined | null): Date | undefined {
  if (!date) return undefined
  if (date instanceof Date) return date
  const d = new Date(date)
  return Number.isFinite(d.getTime()) ? d : undefined
}

export function formatPrice(amount: number | undefined | null): string {
  if (amount == null) return "€ 0"
  // Round to 2 decimal places to handle floating point precision
  const rounded = Math.round(amount * 100) / 100
  // If it's a whole number, don't show decimals (e.g., "€ 112" instead of "€ 112,00")
  if (rounded % 1 === 0) {
    return `€ ${rounded}`
  }
  return `€ ${rounded.toFixed(2).replace(".", ",")}`
}

export function formatPriceShort(amount: number | undefined | null): string {
  if (amount == null) return "€ 0"
  return `€ ${Math.round(amount)}`
}


export function formatTime(date: Date | string | number | undefined | null): string {
  const d = ensureDate(date)
  if (!d) return ""
  const hh = String(d.getHours()).padStart(2, "0")
  const min = String(d.getMinutes()).padStart(2, "0")
  return `${hh}:${min}`
}

export function truncateAddress(address: string, maxLength = 30): string {
  if (!address) return ""
  if (address.length <= maxLength) return address
  return address.slice(0, maxLength) + "..."
}

export function extractCity(address: string): string {
  if (!address) return ""
  const parts = address.split(",").map((p) => p.trim())
  if (parts.length >= 2) {
    return `${parts[parts.length - 2]}, ${parts[parts.length - 1]}`
  }
  return parts[parts.length - 1] || address
}

export function splitAddress(address: string): { main: string; sub: string } {
  if (!address) return { main: "", sub: "" }
  const parts = address.split(",").map((p) => p.trim())
  if (parts.length > 1) {
    return {
      main: parts[0] || "",
      sub: parts.slice(1).join(", "),
    }
  }
  return { main: address, sub: "" }
}

export function calculateTotalLuggage(luggage: { backpack: number; handLuggage: number; checkedBaggage: number }): number {
  return luggage.backpack + luggage.handLuggage + luggage.checkedBaggage
}

export function calculateTotalChildSeats(childSeats: { baby: number; child: number; booster: number }): number {
  return childSeats.baby + childSeats.child + childSeats.booster
}

export interface PriceBreakdown {
  transferPrice: number
  tax: number
  taxRate: number
  refundTax: number
  subtotal: number
  cardFee: number
  cardFeeRate: number
  insuranceTotal: number
  total: number
}

export interface PriceBreakdownOptions {
  basePrice: number
  taxRate?: number
  refundTax?: number
  cardFeeRate?: number
  insuranceTotal?: number
}

/**
 * Calculate price breakdown with all fees included in the rounding.
 * The final total is always rounded up to a clean whole number.
 * All component prices are calculated backwards from the rounded total
 * so that: transferPrice + tax + cardFee + insurance = total (rounded)
 */
export function calculatePriceBreakdown(
  basePriceOrOptions: number | PriceBreakdownOptions,
  taxRate: number = 0.06,
  refundTax: number = 0
): PriceBreakdown {
  // Support both old signature and new options object
  let basePrice: number
  let cardFeeRate: number
  let insuranceTotal: number

  if (typeof basePriceOrOptions === 'object') {
    basePrice = basePriceOrOptions.basePrice
    taxRate = basePriceOrOptions.taxRate ?? 0.06
    refundTax = basePriceOrOptions.refundTax ?? 0
    cardFeeRate = basePriceOrOptions.cardFeeRate ?? 0
    insuranceTotal = basePriceOrOptions.insuranceTotal ?? 0
  } else {
    basePrice = basePriceOrOptions
    cardFeeRate = 0
    insuranceTotal = 0
  }

  // Calculate raw total including ALL fees (base + insurance + card fee on both)
  // Formula: total = (basePrice + insurance) * (1 + cardFeeRate)
  const subtotalBeforeFees = basePrice + insuranceTotal
  const rawTotal = subtotalBeforeFees * (1 + cardFeeRate)

  // Round up to get clean final total
  const total = Math.ceil(rawTotal)

  // Work backwards to calculate card fee
  // total = subtotalBeforeCardFee * (1 + cardFeeRate)
  // subtotalBeforeCardFee = total / (1 + cardFeeRate)
  const subtotalBeforeCardFee = cardFeeRate > 0
    ? Math.round((total / (1 + cardFeeRate)) * 100) / 100
    : total

  const cardFee = Math.round((total - subtotalBeforeCardFee) * 100) / 100

  // The base vehicle price portion (excluding insurance) of the subtotal
  const vehicleSubtotal = subtotalBeforeCardFee - insuranceTotal

  // Calculate transfer price and tax from vehicle subtotal
  // vehicleSubtotal already includes the 6% tax
  const transferPrice = Math.round((vehicleSubtotal / (1 + taxRate)) * 100) / 100
  const tax = Math.round((vehicleSubtotal - transferPrice) * 100) / 100

  return {
    transferPrice,
    tax,
    taxRate,
    refundTax,
    subtotal: subtotalBeforeCardFee,
    cardFee,
    cardFeeRate,
    insuranceTotal,
    total: total + refundTax,
  }
}
