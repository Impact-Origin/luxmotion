// Display-only multi-currency. All amounts in the app are stored/charged in EUR
// (Stripe charges EUR); these helpers only convert the EUR figure for DISPLAY,
// using admin-configured approximate rates ("how many X per 1 EUR").

export type Currency = "EUR" | "BRL" | "USD" | "GBP"

export const CURRENCIES: Currency[] = ["EUR", "BRL", "USD", "GBP"]

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  EUR: "€",
  BRL: "R$",
  USD: "$",
  GBP: "£",
}

// Human labels for the switcher.
export const CURRENCY_NAMES: Record<Currency, string> = {
  EUR: "Euro",
  BRL: "Real",
  USD: "US Dollar",
  GBP: "Pound",
}

export type ExchangeRates = { BRL: number; USD: number; GBP: number }

// Sensible fallbacks; the admin overrides these via siteSettings.exchangeRates.
export const DEFAULT_RATES: ExchangeRates = { BRL: 6.2, USD: 1.08, GBP: 0.85 }

export function isCurrency(value: unknown): value is Currency {
  return (
    typeof value === "string" && (CURRENCIES as string[]).includes(value)
  )
}

export function convertFromEur(
  amountEur: number,
  currency: Currency,
  rates: ExchangeRates,
): number {
  if (currency === "EUR") return amountEur
  const rate = rates[currency]
  return amountEur * (Number.isFinite(rate) && rate > 0 ? rate : 1)
}

// "<symbol> <number>" — mirrors lib/format.ts: whole numbers show no decimals,
// otherwise 2 decimals with a comma separator (pt-style).
export function formatMoney(
  amountEur: number | undefined | null,
  currency: Currency,
  rates: ExchangeRates,
): string {
  const symbol = CURRENCY_SYMBOLS[currency]
  if (amountEur == null) return `${symbol} 0`
  const converted = convertFromEur(amountEur, currency, rates)
  const rounded = Math.round(converted * 100) / 100
  if (rounded % 1 === 0) return `${symbol} ${rounded}`
  return `${symbol} ${rounded.toFixed(2).replace(".", ",")}`
}

export function formatMoneyShort(
  amountEur: number | undefined | null,
  currency: Currency,
  rates: ExchangeRates,
): string {
  const symbol = CURRENCY_SYMBOLS[currency]
  if (amountEur == null) return `${symbol} 0`
  const converted = convertFromEur(amountEur, currency, rates)
  return `${symbol} ${Math.round(converted)}`
}
