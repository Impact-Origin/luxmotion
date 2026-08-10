"use client"

import { type ReactNode } from "react"
import { OrderSummarySidebar } from "@/components/checkout/order-summary-sidebar"

interface CheckoutStepLayoutProps {
  children: ReactNode
}

export function CheckoutStepLayout({ children }: CheckoutStepLayoutProps) {
  return (
    <>
      <div className="max-w-[1200px] mx-auto px-6 pb-6">
        <div className="lg:hidden mb-6 -mx-6">
          <OrderSummarySidebar collapsible />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1.9fr_1fr] gap-0 items-start mt-6 lg:mt-0">
          {/* `min-w-0`: um item de grelha tem `min-width: auto` e cresce até caber o
              conteúdo. Sem isto, um carrossel com scroll horizontal lá dentro
              esticava a coluna para 16000px em vez de rolar. */}
          <div className="min-w-0 pt-8 lg:pr-6">{children}</div>
          <div className="hidden lg:block">
            <OrderSummarySidebar />
          </div>
        </div>
      </div>
    </>
  )
}

