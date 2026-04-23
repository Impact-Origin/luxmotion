"use client"

import { type ReactNode } from "react"
import { OrderSummaryMobile } from "@/components/checkout/order-summary-mobile"
import { OrderSummarySidebar } from "@/components/checkout/order-summary-sidebar"

interface CheckoutStepLayoutProps {
  children: ReactNode
}

export function CheckoutStepLayout({ children }: CheckoutStepLayoutProps) {
  return (
    <>
      <div className="max-w-[1200px] mx-auto px-6 pb-6">
        <OrderSummaryMobile />
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-0 items-start mt-6 lg:mt-0">
          <div className="pt-8 lg:pr-6">{children}</div>
          <div className="hidden lg:block">
            <OrderSummarySidebar />
          </div>
        </div>
      </div>
    </>
  )
}

