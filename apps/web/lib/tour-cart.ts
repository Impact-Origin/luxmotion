"use client"

import { useCallback, useEffect, useState } from "react"
import type {
  ProductType,
  TourCheckoutBookingData,
  TourCheckoutTour,
} from "@/components/tours/tour-checkout-context"

const STORAGE_KEY = "luxmotion:tour-cart:v1"

/** Quanto tempo a reserva fica "garantida" antes de o carrinho se apagar. */
export const HOLD_MINUTES = 25

/**
 * O carrinho guarda exactamente os argumentos do `openCheckout`, para que
 * "Ver carrinho" reabra o checkout no mesmo estado em que foi deixado.
 */
export type TourCart = {
  productType: ProductType
  product: TourCheckoutTour
  bookingData: TourCheckoutBookingData
  expiresAt: number
}

const CHANGED = "luxmotion:tour-cart-changed"

function emit() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CHANGED))
  }
}

export function readTourCart(): TourCart | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as TourCart
    if (!parsed?.product || !parsed?.bookingData) return null
    if (!Number.isFinite(parsed.expiresAt) || parsed.expiresAt <= Date.now()) {
      window.localStorage.removeItem(STORAGE_KEY)
      return null
    }
    // `date` viaja como string no JSON; o checkout espera um Date.
    const date = parsed.bookingData.date
    return {
      ...parsed,
      bookingData: {
        ...parsed.bookingData,
        date: date ? new Date(date) : null,
      },
    }
  } catch {
    return null
  }
}

export function saveTourCart(
  productType: ProductType,
  product: TourCheckoutTour,
  bookingData: TourCheckoutBookingData,
) {
  if (typeof window === "undefined") return
  try {
    const cart: TourCart = {
      productType,
      product,
      bookingData,
      expiresAt: Date.now() + HOLD_MINUTES * 60_000,
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
    emit()
  } catch {
    // Modo privado / quota cheia: sem carrinho persistido, o resto funciona na
    // mesma.
  }
}

export function clearTourCart() {
  if (typeof window === "undefined") return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
    emit()
  } catch {
    /* ignorado — ver saveTourCart */
  }
}

/**
 * Carrinho activo + segundos que faltam. Devolve `null` até o primeiro efeito
 * correr, para o servidor e o cliente pintarem o mesmo na primeira passagem.
 */
export function useTourCart(): { cart: TourCart | null; secondsLeft: number } {
  const [cart, setCart] = useState<TourCart | null>(null)
  const [secondsLeft, setSecondsLeft] = useState(0)

  const sync = useCallback(() => {
    const next = readTourCart()
    setCart(next)
    setSecondsLeft(
      next ? Math.max(0, Math.ceil((next.expiresAt - Date.now()) / 1000)) : 0,
    )
  }, [])

  useEffect(() => {
    sync()
    window.addEventListener(CHANGED, sync)
    // `storage` só dispara noutros separadores — é o que fecha o carrinho
    // quando a reserva é concluída numa janela diferente.
    window.addEventListener("storage", sync)
    const id = window.setInterval(sync, 1000)
    return () => {
      window.removeEventListener(CHANGED, sync)
      window.removeEventListener("storage", sync)
      window.clearInterval(id)
    }
  }, [sync])

  return { cart, secondsLeft }
}

export function formatCountdown(totalSeconds: number): string {
  const s = Math.max(0, totalSeconds)
  const mm = Math.floor(s / 60)
  const ss = s % 60
  return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`
}
