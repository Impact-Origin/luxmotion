"use client"

import { Check, Loader2, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@workspace/ui/components/button"
import { useTranslations } from "next-intl"
import { useCheckout } from "@/components/customizable-checkout/checkout-context"
import { usePartnershipSlug } from "@/components/customizable-checkout/checkout-page"
import { useEffect, useRef, useState } from "react"
import { useAction } from "convex/react"
import { api } from "@workspace/convex/api"
import { useSubscribeToOrderStatus } from "@/lib/orders"
import { CheckoutStepLayout } from "@/components/customizable-checkout/shared/checkout-step-layout"

export function ConfirmationModal() {
  const t = useTranslations("confirmation")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { resetCheckout, state } = useCheckout()
  const partnershipSlug = usePartnershipSlug()
  const { orderId, payment } = state
  const successFromUrl = searchParams?.get("success")
  
  // Subscribe to order status
  const orderStatus = useSubscribeToOrderStatus(orderId ? String(orderId) : null)
  
  // Action para verificar status MBWay (polling fallback)
  const checkMbwayStatus = useAction(api.orders.checkMbwayOrderStatus)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [isWaitingPayment, setIsWaitingPayment] = useState(false)

  // Check if this is MBWay payment that's still pending
  const isMbwayPending = payment.method === "mbway" && orderStatus?.paymentStatus !== "completed" && orderStatus?.paymentStatus !== "failed"

  // Start polling for MBWay if payment is pending (first check immediately, then every 3s)
  useEffect(() => {
    if (!isMbwayPending || !orderId) return
    setIsWaitingPayment(true)

    const check = async () => {
      try {
        const result = await checkMbwayStatus({ orderNumber: String(orderId) })
        if (result.status === "completed") {
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current)
            pollingIntervalRef.current = null
          }
          setIsWaitingPayment(false)
        } else if (result.status === "failed") {
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current)
            pollingIntervalRef.current = null
          }
          setIsWaitingPayment(false)
        }
      } catch (error: any) {
        console.warn("[ConfirmationModal] MBWay status check error:", error)
      }
    }
    check()
    pollingIntervalRef.current = setInterval(check, 3000)
    const timeout = setTimeout(() => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }
    }, 5 * 60 * 1000)
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }
      clearTimeout(timeout)
    }
  }, [isMbwayPending, orderId, checkMbwayStatus])

  // Update waiting state when orderStatus changes
  useEffect(() => {
    if (orderStatus?.paymentStatus === "completed" || orderStatus?.paymentStatus === "failed") {
      setIsWaitingPayment(false)
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }
    }
  }, [orderStatus?.paymentStatus])

  const handleBackToHome = () => {
    resetCheckout()
    // Redirect to partnership page if we're in a partnership checkout, otherwise go to home
    const redirectPath = partnershipSlug ? `/${partnershipSlug}` : "/"
    router.push(redirectPath)
  }

  const paymentFailed = orderStatus?.paymentStatus === "failed" || successFromUrl === "false"

  return (
    <CheckoutStepLayout>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[440px] md:max-w-[1080px] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 mx-auto">
        <div className="bg-[#27c7ff] px-6 py-4 md:px-12 md:py-8">
          <h1 className="text-white text-[20px] md:text-[42px] font-bold leading-tight">{t("title")}</h1>
        </div>

        <div className="px-6 py-6 md:px-12 md:py-10 space-y-6">
          <p className="text-[16px] md:text-[19px] leading-[1.5]">
            <span className="text-black">{t("thankYou")} </span>
            <span className="text-[#27c7ff]">{t("emailWhatsapp")}</span>
          </p>

          <p className="text-[16px] md:text-[19px] text-black leading-[1.5]">
            <span className="font-bold">{t("teamConfirmation")}</span> {t("driverDetails")}
          </p>

          <p className="text-[16px] md:text-[19px] text-black leading-[1.5]">
            {t("tipRequest")} <span className="font-bold">{t("considerTip")}</span> {t("tipMessage")}
          </p>

          <div className="space-y-3 md:space-y-4 pt-2 md:pt-4">
            {paymentFailed ? (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl px-5 py-4 md:px-8 md:py-5 flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <X className="w-5 h-5 text-red-600" strokeWidth={2.5} />
                </div>
                <div>
                  <span className="text-red-700 text-[18px] md:text-[22px] font-bold block">{t("paymentRejected")}</span>
                  <span className="text-red-600 text-sm md:text-base">{t("paymentRejectedSubtext")}</span>
                </div>
              </div>
            ) : isWaitingPayment ? (
              <div className="bg-[#fff3cd] border border-[#ffc107]/60 rounded-xl px-5 py-4 md:px-8 md:py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-6 h-6 md:w-8 md:h-8 text-[#ffc107] animate-spin" />
                  <span className="text-[#856404] text-[18px] md:text-[22px] font-semibold">
                    {t("waitingPayment")}
                  </span>
                </div>
              </div>
            ) : (
              <>
                {payment.method !== "cash" && (
                  <div className="bg-[#d5f6ea] border border-[#48d9a4]/60 rounded-xl px-5 py-4 md:px-8 md:py-5 flex items-center justify-between">
                    <span className="text-[#48d9a4] text-[18px] md:text-[22px] font-semibold">{t("paymentDone")}</span>
                    <Check className="w-7 h-7 md:w-9 md:h-9 text-[#48d9a4]" strokeWidth={2.5} />
                  </div>
                )}

                <div className="bg-[#d5f6ea] border border-[#48d9a4]/60 rounded-xl px-5 py-4 md:px-8 md:py-5 flex items-center justify-between">
                  <span className="text-[#48d9a4] text-[18px] md:text-[22px] font-semibold">{t("bookingDone")}</span>
                  <Check className="w-7 h-7 md:w-9 md:h-9 text-[#48d9a4]" strokeWidth={2.5} />
                </div>
              </>
            )}
          </div>

          <div className="flex justify-center pt-4 md:pt-8 pb-2">
            <Button 
              onClick={handleBackToHome}
              disabled={isWaitingPayment}
              className="w-full md:w-auto bg-[#27c7ff] hover:bg-[#1fb3e8] disabled:opacity-50 disabled:cursor-not-allowed text-white text-[16px] md:text-[17px] font-bold tracking-wide px-6 py-4 md:px-24 md:py-7 rounded-xl h-auto uppercase"
            >
              {t("backToHome")}
            </Button>
          </div>
        </div>
      </div>
    </CheckoutStepLayout>
  )
}
