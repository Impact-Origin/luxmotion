"use client"

import { useEffect } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useTourCheckout } from "./tour-checkout-context"

/**
 * When user returns from card payment (success/error/cancel), URL has
 * ?tourCheckoutReturn=1&payment=success|failed&bookingNumber=XXX.
 * Opens the tour checkout modal on step 4 with the result and clears the params.
 */
export function TourCheckoutReturnHandler() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const { openCheckoutFromCardReturn } = useTourCheckout()

  useEffect(() => {
    const returnFlag = searchParams.get("tourCheckoutReturn")
    if (returnFlag !== "1") return

    const payment = searchParams.get("payment") ?? "failed"
    const bookingNumber = searchParams.get("bookingNumber") ?? ""

    openCheckoutFromCardReturn(payment === "success", bookingNumber)

    const next = new URLSearchParams(searchParams)
    next.delete("tourCheckoutReturn")
    next.delete("payment")
    next.delete("bookingNumber")
    const query = next.toString()
    router.replace(query ? `${pathname}?${query}` : pathname)
  }, [searchParams, pathname, router, openCheckoutFromCardReturn])

  return null
}
