"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { useSiteSettings } from "@/hooks/use-site-settings"
import {
  type Currency,
  type ExchangeRates,
  CURRENCIES,
  DEFAULT_RATES,
  convertFromEur,
  formatMoney,
  formatMoneyShort,
  isCurrency,
} from "@/lib/currency"

const COOKIE = "NEXT_CURRENCY"

function readCookieCurrency(): Currency {
  if (typeof document === "undefined") return "EUR"
  const match = document.cookie.match(/(?:^|;\s*)NEXT_CURRENCY=([^;]+)/)
  const value = match?.[1]
  return isCurrency(value) ? value : "EUR"
}

export type MoneyContextValue = {
  currency: Currency
  setCurrency: (currency: Currency) => void
  rates: ExchangeRates
  /** Format an EUR-denominated amount in the selected display currency. */
  format: (amountEur: number | undefined | null) => string
  /** Same as format but rounded to a whole number. */
  formatShort: (amountEur: number | undefined | null) => string
  /** Raw converted number (no symbol). */
  convert: (amountEur: number) => number
  isEur: boolean
}

const MoneyContext = createContext<MoneyContextValue | null>(null)

function eurPassthrough(): MoneyContextValue {
  return {
    currency: "EUR",
    setCurrency: () => {},
    rates: DEFAULT_RATES,
    format: (a) => formatMoney(a, "EUR", DEFAULT_RATES),
    formatShort: (a) => formatMoneyShort(a, "EUR", DEFAULT_RATES),
    convert: (a) => a,
    isEur: true,
  }
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  // Start as EUR on both server and first client render to avoid a hydration
  // mismatch; adopt the cookie value right after mount.
  const [currency, setCurrencyState] = useState<Currency>("EUR")
  const { exchangeRates: rates } = useSiteSettings()

  useEffect(() => {
    setCurrencyState(readCookieCurrency())
  }, [])

  const value = useMemo<MoneyContextValue>(() => {
    const setCurrency = (next: Currency) => {
      if (!CURRENCIES.includes(next)) return
      document.cookie = `${COOKIE}=${next};path=/;max-age=31536000`
      setCurrencyState(next)
    }
    return {
      currency,
      setCurrency,
      rates,
      format: (a) => formatMoney(a, currency, rates),
      formatShort: (a) => formatMoneyShort(a, currency, rates),
      convert: (a) => convertFromEur(a, currency, rates),
      isEur: currency === "EUR",
    }
  }, [currency, rates])

  return <MoneyContext.Provider value={value}>{children}</MoneyContext.Provider>
}

export function useMoney(): MoneyContextValue {
  const ctx = useContext(MoneyContext)
  return ctx ?? eurPassthrough()
}
