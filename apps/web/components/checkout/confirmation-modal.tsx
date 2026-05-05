"use client"

import { Check, Loader2, X, Plane, Car, Phone, Clock, CircleCheck } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { useCheckout } from "@/components/checkout/checkout-context"
import { useEffect, useRef, useState } from "react"
import { useAction } from "convex/react"
import { api } from "@workspace/convex/api"
import { useSubscribeToOrderStatus } from "@/lib/orders"
import { cn } from "@workspace/ui/lib/utils"

const SERIF_FONT = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const

function FeatureCell({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode
  title: string
  desc: string
}) {
  return (
    <div className="relative flex items-center gap-4 px-6 py-4 flex-1 min-w-0 group cursor-default overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[rgba(201,169,110,0.06)] opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100" />
      <div className="absolute top-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#C9A96E] to-[rgba(201,169,110,0.4)] transition-all duration-300 ease-out group-hover:w-full" />
      <div className="relative w-12 h-12 rounded-full bg-[rgba(154,117,53,0.07)] border border-[rgba(154,117,53,0.22)] flex items-center justify-center shrink-0 transition-all duration-300 group-hover:border-[#C9A96E] group-hover:shadow-[0_0_16px_rgba(201,169,110,0.2)] group-hover:bg-[rgba(201,169,110,0.12)]">
        <div className="w-5 h-5 text-[#C9A96E] flex items-center justify-center">{icon}</div>
      </div>
      <div className="relative flex flex-col gap-[8px] min-w-0">
        <p className="text-[14px] font-semibold text-[#F7F4EF] leading-none transition-colors duration-300 group-hover:text-white">{title}</p>
        <p className="text-[12px] text-[#999] leading-[16px] transition-colors duration-300 group-hover:text-[rgba(255,255,255,0.8)]">{desc}</p>
      </div>
    </div>
  )
}

function StatusRow({
  label,
  icon,
  highlight,
}: {
  label: string
  icon: React.ReactNode
  highlight?: boolean
}) {
  return (
    <div
      className={cn(
        "h-[52px] flex items-center justify-between px-4 bg-[#1E1D1B] border transition-colors",
        highlight ? "border-[#C9A96E]" : "border-[rgba(255,255,255,0.12)]",
      )}
    >
      <span
        className={cn(
          "text-[14px] font-semibold",
          highlight ? "text-white" : "text-[#999]",
        )}
      >
        {label}
      </span>
      <div className={cn("w-6 h-6 flex items-center justify-center", highlight ? "text-[#C9A96E]" : "text-[#696969]")}>
        {icon}
      </div>
    </div>
  )
}

export function ConfirmationModal() {
  const t = useTranslations("confirmation")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { resetCheckout, state } = useCheckout()
  const { orderId, payment } = state
  const successFromUrl = searchParams?.get("success")

  const orderStatus = useSubscribeToOrderStatus(orderId ? String(orderId) : null)

  const checkMbwayStatus = useAction(api.orders.checkMbwayOrderStatus)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [isWaitingPayment, setIsWaitingPayment] = useState(false)
  const [localPaymentFailed, setLocalPaymentFailed] = useState(false)

  const isMbwayPending =
    payment.method === "mbway" &&
    orderStatus?.paymentStatus !== "completed" &&
    orderStatus?.paymentStatus !== "failed"

  useEffect(() => {
    if (!isMbwayPending || !orderId) return
    setLocalPaymentFailed(false)
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
          setLocalPaymentFailed(true)
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

  useEffect(() => {
    if (orderStatus?.paymentStatus === "completed" || orderStatus?.paymentStatus === "failed") {
      if (orderStatus.paymentStatus === "failed") {
        setLocalPaymentFailed(true)
      }
      setIsWaitingPayment(false)
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }
    }
  }, [orderStatus?.paymentStatus])

  const handleBackToHome = () => {
    resetCheckout()
    router.push("/")
  }

  const paymentFailed =
    localPaymentFailed ||
    orderStatus?.paymentStatus === "failed" ||
    successFromUrl === "false"

  const paymentDone =
    !isWaitingPayment && !paymentFailed && (payment.method === "cash" ? true : true)

  return (
    <div className="w-full">
      <div className="max-w-[1180px] mx-auto px-6 pt-10 pb-16">
        <div className="flex flex-col items-center">
          <div className="w-[56px] h-[56px] rounded-full border border-[#C9A96E] flex items-center justify-center">
            <CircleCheck className="w-6 h-6 text-[#C9A96E]" strokeWidth={1.5} />
          </div>

          <div className="mt-8 flex items-center gap-2">
            <div className="w-8 h-px bg-[#C9A96E]" />
            <span className="text-[12px] font-semibold uppercase tracking-[2px] text-[#C9A96E]">
              {t("eyebrow")}
            </span>
            <div className="w-8 h-px bg-[#C9A96E]" />
          </div>

          <h1
            className="mt-6 text-center text-[72px] md:text-[96px] leading-[1] text-[#F7F4EF]"
            style={SERIF_FONT}
          >
            <span className="font-normal">{t("headingLine1")}</span>
            <br />
            <span className="italic text-[#C9A96E] font-normal">{t("headingLine2")}</span>
            <span className="font-normal">.</span>
          </h1>
        </div>

        <div className="mt-16 max-w-[800px] mx-auto bg-[#1A1918] border border-[rgba(255,255,255,0.12)]">
          <div className="h-14 px-6 border-b border-[rgba(255,255,255,0.12)] flex items-center">
            <h2 className="text-[18px] text-[#F7F4EF] leading-none" style={SERIF_FONT}>
              {t("cardTitle")}
            </h2>
          </div>

          <div className="px-5 py-8 md:px-12 md:py-12 flex flex-col gap-6">
            <p className="text-[14px] leading-[1.6] text-[#F7F4EF]">
              <span className="font-bold">{t("thankYou")} </span>
              <span className="text-[#C9A96E]">{t("emailWhatsapp")}</span>
            </p>

            <p className="text-[14px] leading-[1.6] text-[#F7F4EF]">
              <span className="font-bold">{t("teamConfirmation")}</span> {t("driverDetails")}
            </p>

            <p className="text-[14px] leading-[1.6] text-[#F7F4EF]">
              {t("tipRequest")} <span className="font-bold">{t("considerTip")}</span>{" "}
              {t("tipMessage")}
            </p>

            <div className="flex flex-col gap-2 pt-2">
              {paymentFailed ? (
                <div className="h-[52px] flex items-center justify-between px-4 bg-[rgba(227,40,40,0.08)] border border-[rgba(227,40,40,0.35)]">
                  <span className="text-[14px] font-semibold text-[#E32828]">
                    {t("paymentRejected")}
                  </span>
                  <X className="w-5 h-5 text-[#E32828]" strokeWidth={2.5} />
                </div>
              ) : (
                <>
                  <StatusRow
                    label={t("bookingDone")}
                    icon={<Check className="w-5 h-5" strokeWidth={2.5} />}
                    highlight
                  />
                  <StatusRow
                    label={t("paymentDone")}
                    icon={
                      isWaitingPayment ? (
                        <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2} />
                      ) : paymentDone && payment.method !== "cash" ? (
                        <Check className="w-5 h-5" strokeWidth={2.5} />
                      ) : (
                        <Clock className="w-5 h-5" strokeWidth={2} />
                      )
                    }
                    highlight={paymentDone && payment.method !== "cash" && !isWaitingPayment}
                  />
                </>
              )}
            </div>

            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={handleBackToHome}
                disabled={isWaitingPayment}
                className="h-12 w-[240px] bg-[#C9A96E] border border-[#C9A96E] text-[#0D0D0D] text-[14px] font-medium uppercase tracking-[1.1px] inline-flex items-center justify-center hover:bg-[#b89558] hover:border-[#b89558] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("backToStart")}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 max-w-[800px] mx-auto border border-[rgba(255,255,255,0.12)] grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[rgba(255,255,255,0.12)]">
          <FeatureCell
            icon={<Plane className="w-5 h-5" strokeWidth={2} />}
            title={t("flightMonitored.title")}
            desc={t("flightMonitored.desc")}
          />
          <FeatureCell
            icon={<Car className="w-5 h-5" strokeWidth={2} />}
            title={t("driverConfirmed.title")}
            desc={t("driverConfirmed.desc")}
          />
          <FeatureCell
            icon={<Phone className="w-5 h-5" strokeWidth={2} />}
            title={t("support247.title")}
            desc={t("support247.desc")}
          />
        </div>
      </div>
    </div>
  )
}
