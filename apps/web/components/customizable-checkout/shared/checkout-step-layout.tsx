"use client"

import { type ReactNode } from "react"
import { TrustBanner } from "@/components/customizable-checkout/trust-banner"
import { OrderSummaryMobile } from "@/components/customizable-checkout/order-summary-mobile"
import { OrderSummarySidebar } from "@/components/customizable-checkout/order-summary-sidebar"

interface CheckoutStepLayoutProps {
  children: ReactNode
}

export function CheckoutStepLayout({ children }: CheckoutStepLayoutProps) {
  return (
    <>
      <div className="max-w-[1200px] mx-auto px-6 pt-8">
        <TrustBanner />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-6 pt-8">
        <OrderSummaryMobile />
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 items-start mt-6 lg:mt-0">
          {children}
          <div className="hidden lg:block">
            <OrderSummarySidebar />
          </div>
        </div>
      </div>
    </>
  )
}

