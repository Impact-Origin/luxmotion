"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@workspace/ui/components/dialog"
import { Button } from "@workspace/ui/components/button"
import { User, Mail, FileText, MapPin, Lock, CheckCircle2, CreditCard, Banknote, ChevronLeft, X, MessageSquare } from "lucide-react"
import { useIsMobile } from "@/hooks/use-is-mobile"
import { useTranslations } from "next-intl"
import { useTourCheckout } from "./tour-checkout-context"
import { InputWithIcon } from "@/components/ui/input-with-icon"
import { PhoneInput } from "@/components/ui/phone-input"
import { useConvex, useQuery } from "convex/react"
import { api } from "@workspace/convex/api"
import type { Id } from "@workspace/convex/dataModel"
import type { TourCheckoutTour } from "./tour-checkout-context"

const STEP_KEYS = ["tourCheckout.summary", "tourCheckout.contact", "tourCheckout.pickup", "tourCheckout.payment"] as const
function getStepLabel(index: number, productType: "tour" | "experience" | "event") {
  if (index === 2) return productType === "event" ? "tourCheckout.meetingPoint" : STEP_KEYS[2]
  return STEP_KEYS[index]
}

const RESERVATION_MINUTES = 30

function OrderSummarySidebar({
  tour,
  bookingData,
  basePrice,
  totalAmount,
  currentStep,
  isStep4,
  onContinue,
  isSubmitting,
  reservationTimeLabel,
  addonsTotal,
  selectedAddons,
  t,
}: {
  tour: TourCheckoutTour | null
  bookingData: { date: Date | null; time: string | null; adults: number; children: number } | null
  basePrice: number
  totalAmount: number
  currentStep: number
  isStep4: boolean
  onContinue: () => void
  isSubmitting: boolean
  reservationTimeLabel?: string | null
  addonsTotal?: number
  selectedAddons?: Array<{ addonId: string; title: string; price: number; pricingType: "per_person" | "flat"; quantity: number; subtotal: number }>
  t: (key: string) => string
}) {
  if (!tour) return null
  const currency = tour.currency ?? "€"
  const dateTime =
    bookingData?.date && bookingData.time
      ? `${bookingData.date.toLocaleDateString()} - ${bookingData.time}`
      : bookingData?.date
        ? bookingData.date.toLocaleDateString()
        : "—"
  const guests = bookingData ? bookingData.adults + bookingData.children : 0

  return (
    <div className="flex flex-col bg-[#fafbfc] border-t lg:border-t-0 lg:border-l border-[#e8eaed] w-full lg:w-[380px] shrink-0 min-h-0">
      <div className="p-3 sm:p-5 lg:p-6 flex flex-col">
        <div className="flex gap-2 sm:gap-3 p-2.5 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-[#e8eaed] shadow-sm">
          {tour.image ? (
            <div className="relative w-11 h-11 sm:w-16 sm:h-16 rounded-md sm:rounded-lg overflow-hidden shrink-0 bg-[#e8eaed]">
              <Image src={tour.image} alt="" fill className="object-cover" sizes="64px" />
            </div>
          ) : (
            <div className="w-11 h-11 sm:w-16 sm:h-16 rounded-md sm:rounded-lg bg-[#e8eaed] shrink-0" />
          )}
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-[#222222] text-xs sm:text-sm leading-tight line-clamp-2">
              {tour.title}
            </p>
            <p className="text-[10px] sm:text-xs text-[#5f686c] mt-0.5 sm:mt-1">{dateTime}</p>
            {guests > 0 && (
              <p className="text-[10px] sm:text-xs text-[#808080] mt-0.5">
                {t("tourCheckout.passengers")}: {guests} × {currency}{tour.price.toFixed(2)}
              </p>
            )}
          </div>
          <div className="text-right shrink-0 self-start sm:self-center">
            <span className="font-bold text-[#222222] text-sm sm:text-base">{currency}{basePrice.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-[#e8eaed] space-y-0.5 sm:space-y-1">
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-[#5f686c]">{t("tourCheckout.subtotal")}</span>
            <span className="font-medium text-[#222222]">{currency}{basePrice.toFixed(2)}</span>
          </div>
          {selectedAddons && selectedAddons.length > 0 && (
            <>
              <div className="flex justify-between text-xs sm:text-sm pt-1">
                <span className="text-[#5f686c] font-medium">{t("tourCheckout.addOns")}</span>
                <span />
              </div>
              {selectedAddons.map((addon) => (
                <div key={addon.addonId} className="flex justify-between text-xs sm:text-sm pl-2">
                  <span className="text-[#5f686c]">
                    {addon.title}{addon.pricingType === "per_person" ? ` (×${addon.quantity})` : ""}
                  </span>
                  <span className="font-medium text-[#222222]">{currency}{addon.subtotal.toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-[#5f686c]">{t("tourCheckout.addOnsTotal")}</span>
                <span className="font-medium text-[#222222]">{currency}{(addonsTotal ?? 0).toFixed(2)}</span>
              </div>
            </>
          )}
          {isStep4 && totalAmount !== basePrice + (addonsTotal ?? 0) && (
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-[#5f686c]">{t("tourCheckout.tip")}</span>
              <span className="font-medium text-[#222222]">{currency}{(totalAmount - basePrice - (addonsTotal ?? 0)).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between items-baseline pt-1.5 sm:pt-2">
            <span className="font-bold text-[#222222] text-sm sm:text-base">{t("common.total")}</span>
            <span className="text-lg sm:text-xl font-bold text-[#0c171c]">{currency}{totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <Button
          onClick={onContinue}
          disabled={isSubmitting}
          className="mt-4 sm:mt-6 w-full bg-[#27c7ff] hover:bg-[#23b3e6] text-white h-11 sm:h-12 min-h-[44px] sm:min-h-[48px] font-bold rounded-xl touch-manipulation text-sm sm:text-base"
        >
          {isSubmitting ? t("common.loading") : isStep4 ? t("payment.payButton") : t("common.continue")}
        </Button>
        {reservationTimeLabel && (
          <p className="mt-2 sm:mt-3 text-[11px] sm:text-xs text-amber-700 text-center">
            {reservationTimeLabel}
          </p>
        )}
      </div>
    </div>
  )
}

export function TourCheckoutModal() {
  const t = useTranslations()
  const convex = useConvex()
  const { state, setStep, closeCheckout, setBookingId, updateContact, setTip, updateTotalAmount, updatePayment, isOpen } = useTourCheckout()
  const { currentStep, productType, tour, bookingData, bookingId, bookingNumber, contact, selectedPickup, tipPercent, tipAmount, totalAmount, payment, cardReturnResult } = state

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [waitingMbway, setWaitingMbway] = useState(false)
  const [paymentRejected, setPaymentRejected] = useState(false)
  const [reservationSecondsLeft, setReservationSecondsLeft] = useState<number | null>(null)
  const reservedAtRef = useRef<number | null>(null)

  const paymentStatus = useQuery(
    api.tourBookings.subscribeToStatus,
    (waitingMbway || paymentComplete) && bookingNumber ? { bookingNumber } : "skip"
  )

  // Ao abrir para uma nova tour (step 1, sem bookingId), limpar estado de pagamento da reserva anterior
  useEffect(() => {
    if (isOpen && currentStep === 1 && !bookingId) {
      setPaymentComplete(false)
      setPaymentRejected(false)
      setWaitingMbway(false)
    }
  }, [isOpen, currentStep, bookingId])

  const basePrice = useMemo(() => {
    if (!tour || !bookingData) return 0
    const guests = bookingData.adults + bookingData.children + bookingData.infants || 1
    return tour.price * guests
  }, [tour, bookingData])

  useEffect(() => {
    if (!bookingId) {
      reservedAtRef.current = null
      setReservationSecondsLeft(null)
      return
    }
    if (reservedAtRef.current === null) reservedAtRef.current = Date.now()
    const interval = setInterval(() => {
      const elapsedSec = (Date.now() - (reservedAtRef.current ?? 0)) / 1000
      const totalSec = RESERVATION_MINUTES * 60
      const left = Math.max(0, Math.ceil(totalSec - elapsedSec))
      setReservationSecondsLeft(left)
    }, 1000)
    return () => clearInterval(interval)
  }, [bookingId])

  useEffect(() => {
    if (!paymentStatus) return
    if (paymentStatus.paymentStatus === "completed") {
      if (waitingMbway) setWaitingMbway(false)
      setPaymentComplete(true)
      setPaymentRejected(false)
    } else if (paymentStatus.paymentStatus === "failed") {
      setWaitingMbway(false)
      setPaymentComplete(false)
      setPaymentRejected(true)
    }
  }, [paymentStatus?.paymentStatus, waitingMbway])

  useEffect(() => {
    if (!waitingMbway || !bookingId) return
    const check = async () => {
      try {
        const result = await convex.action(api.tourBookings.checkPaymentStatus, {
          bookingId: bookingId as Id<"tourBookings">,
        })
        if (result?.paymentStatus === "failed") {
          setWaitingMbway(false)
          setPaymentComplete(false)
          setPaymentRejected(true)
        }
      } catch {
        // ignore
      }
    }
    check()
    const interval = setInterval(check, 3000)
    return () => clearInterval(interval)
  }, [waitingMbway, bookingId, convex])

  const tipOptions = [
    { percent: 0, label: "0%" },
    { percent: 10, label: "10%" },
    { percent: 20, label: "20%" },
    { percent: -1, label: "tourCheckout.custom" },
  ]

  const handleStep1Continue = async () => {
    if (!tour || !bookingData) return
    setSubmitError("")
    setIsSubmitting(true)
    try {
      const dateStr = bookingData.date ? bookingData.date.toISOString().slice(0, 10) : ""
      const timeStr = bookingData.time || ""
      const guests = bookingData.adults + bookingData.children + bookingData.infants || 1
      const isEvent = productType === "event"
      // Com mock tours o _id é "tour-1" etc. — Convex rejeita; não enviar tourId/eventId para a reserva ser criada
      const useMockTours = typeof process.env.NEXT_PUBLIC_USE_MOCK_TOURS === "string" && process.env.NEXT_PUBLIC_USE_MOCK_TOURS === "true"
      const looksLikeMockId = (id: string) => typeof id === "string" && (id.startsWith("tour-") || id.startsWith("event-") || id.length < 15)
      const canUseTourId = !useMockTours && tour._id && !looksLikeMockId(tour._id)
      const selectedAddons = bookingData.selectedAddons?.map((a) => ({
        addonId: a.addonId as Id<"tourAddons">,
        title: a.title,
        price: a.price,
        pricingType: a.pricingType as "per_person" | "flat",
        quantity: a.quantity,
        subtotal: a.subtotal,
      }))
      const result = await convex.mutation(api.tourBookings.init, {
        productType,
        tourId: !isEvent && canUseTourId ? (tour._id as Id<"tours">) : undefined,
        eventId: isEvent && canUseTourId ? (tour._id as Id<"events">) : undefined,
        tourTitle: tour.title,
        tourSlug: tour.slug,
        passengers: guests,
        selectedDate: dateStr,
        selectedTime: timeStr,
        basePrice: Math.max(0, Number(tour.price) || 0) * guests,
        selectedAddons: selectedAddons?.length ? selectedAddons : undefined,
        addonsTotal: bookingData.addonsTotal ?? undefined,
      })
      const bookingNumber = (result as { bookingNumber?: string })?.bookingNumber
      const bookingId = (result as { bookingId?: string })?.bookingId ?? (result as { booking?: { _id: string } })?.booking?._id
      if (bookingNumber && bookingId) {
        setBookingId(bookingId, bookingNumber)
        setStep(2)
      }
    } catch (e: any) {
      setSubmitError(e?.message || "Failed to create booking")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStep2Continue = async () => {
    if (!bookingId || !contact.name || !contact.email || !contact.phone) {
      setSubmitError(t("passengerForm.fillRequired"))
      return
    }
    setSubmitError("")
    setIsSubmitting(true)
    try {
      await convex.mutation(api.tourBookings.updateContact, {
        bookingId: bookingId as Id<"tourBookings">,
        customerName: contact.name.trim(),
        customerEmail: contact.email.trim(),
        customerPhone: contact.phone.trim(),
        customerNif: contact.nif?.trim() || undefined,
      })
      setStep(3)
    } catch (e: any) {
      setSubmitError(e?.message || t("passengerForm.saveError"))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStep3Continue = async () => {
    if (!bookingId) return
    setSubmitError("")
    setIsSubmitting(true)
    try {
      await convex.mutation(api.tourBookings.updatePickup, {
        bookingId: bookingId as Id<"tourBookings">,
        pickup: selectedPickup ?? undefined,
      })
      // Apply default tip (10%) when entering payment step
      if (tipPercent > 0 && tipAmount === 0) {
        const addons = bookingData?.addonsTotal ?? 0
        const defaultTipAmount = Math.round((basePrice * tipPercent) / 100)
        setTip(tipPercent, defaultTipAmount)
        updateTotalAmount(basePrice + addons + defaultTipAmount)
      }
      setStep(4)
    } catch (e: any) {
      setSubmitError(e?.message || "Failed to save pickup")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePay = async () => {
    if (!bookingId) {
      setSubmitError(t("payment.orderNotInitialized"))
      return
    }
    if (!contact.name?.trim() || !contact.email?.trim() || !contact.phone?.trim()) {
      setSubmitError(t("passengerForm.fillRequired"))
      return
    }
    if (payment.method === "mbway" && !payment.mbwayPhone?.trim()) {
      setSubmitError(t("payment.mbwayPhoneRequired"))
      return
    }
    setSubmitError("")
    setIsSubmitting(true)
    try {
      // Persist contact from the form so the tour booking (and order) always have it
      await convex.mutation(api.tourBookings.updateContact, {
        bookingId: bookingId as Id<"tourBookings">,
        customerName: contact.name.trim(),
        customerEmail: contact.email.trim(),
        customerPhone: contact.phone.trim(),
        customerNif: contact.nif?.trim() || undefined,
      })
      await convex.mutation(api.tourBookings.updateTipAndTotal, {
        bookingId: bookingId as Id<"tourBookings">,
        tipPercent,
        tipAmount,
        totalAmount,
      })

      const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
      const returnPath = typeof window !== "undefined" ? window.location.pathname || "/" : "/"
      const returnQuery = `tourCheckoutReturn=1&bookingNumber=${encodeURIComponent(bookingNumber ?? "")}`
      const successUrl = `${baseUrl}${returnPath}?${returnQuery}&payment=success`
      const errorUrl = `${baseUrl}${returnPath}?${returnQuery}&payment=failed`
      const cancelUrl = `${baseUrl}${returnPath}?${returnQuery}&payment=failed`
      const method = payment.method === "cartao" ? "ccard" : payment.method
      const result = await convex.action(api.tourBookings.startPaymentAction, {
        bookingId: bookingId as Id<"tourBookings">,
        method,
        amount: totalAmount,
        phoneNumber: payment.method === "mbway" ? payment.mbwayPhone?.trim() : undefined,
        email: contact.email?.trim() || undefined,
        successUrl,
        errorUrl,
        cancelUrl,
        language: "pt",
      }) as any

      if (payment.method === "cash") {
        setPaymentComplete(true)
      } else if (payment.method === "mbway") {
        setWaitingMbway(true)
      } else if (payment.method === "cartao" && result?.paymentUrl) {
        window.location.href = result.paymentUrl
        return
      }
    } catch (e: any) {
      setSubmitError(e?.message || t("payment.paymentError"))
    } finally {
      setIsSubmitting(false)
    }
  }

  const setTipPercent = (percent: number, customValue?: number) => {
    const addons = bookingData?.addonsTotal ?? 0
    if (percent >= 0) {
      const amount = Math.round((basePrice * percent) / 100)
      setTip(percent, amount)
      updateTotalAmount(basePrice + addons + amount)
    } else {
      const amount = customValue ?? 0
      setTip(percent, amount)
      updateTotalAmount(basePrice + addons + amount)
    }
  }

  const getContinueHandler = () => {
    if (currentStep === 1) return handleStep1Continue
    if (currentStep === 2) return handleStep2Continue
    if (currentStep === 3) return handleStep3Continue
    return handlePay
  }

  const isMobile = useIsMobile()
  const isConfirmed = paymentComplete || cardReturnResult?.success === true

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeCheckout()}>
      <DialogContent
        className="max-sm:inset-0 max-sm:translate-none max-sm:w-full max-sm:h-full max-sm:max-w-none max-sm:rounded-none max-sm:border-0 max-sm:shadow-none max-sm:min-h-full max-w-5xl w-[95vw] h-[90vh] min-h-[480px] overflow-hidden flex flex-col p-0 rounded-2xl border border-[#e8eaed] shadow-2xl sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2"
        showCloseButton={false}
      >
        <motion.div
          key="tour-checkout-inner"
          initial={isMobile ? { y: "100%" } : false}
          animate={isMobile ? { y: 0 } : false}
          transition={isMobile ? { type: "tween", duration: 0.35, ease: [0.32, 0.72, 0, 1] } : undefined}
          className="h-full w-full flex flex-col overflow-hidden min-h-0"
        >
        {/* Header: após confirmação não mostrar stepper (impedir voltar às etapas) */}
        <div className="shrink-0 px-4 sm:px-5 lg:px-6 pt-3 sm:pt-4 pb-2 sm:pb-3 border-b border-[#e8eaed]">
          <div className="flex items-center gap-2 min-h-[36px]">
            <DialogTitle className="text-sm sm:text-base font-semibold text-[#222222] block flex-1 min-w-0">
              {isConfirmed ? t("tourCheckout.bookingConfirmed") : t("tourCheckout.finalizePurchase")}
            </DialogTitle>
            <DialogClose
              className="shrink-0 rounded-full h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#27c7ff] focus:ring-offset-2 touch-manipulation"
              aria-label="Close"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
            </DialogClose>
          </div>
          {!isConfirmed && (
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto -mx-1 min-h-[36px] pb-0.5 mt-2.5">
              {STEP_KEYS.map((_, i) => {
                const key = getStepLabel(i, productType)
                const stepNum = i + 1
                const isActive = currentStep === stepNum
                const isPast = currentStep > stepNum
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => currentStep > stepNum && setStep(stepNum)}
                    className={`flex items-center gap-1 py-1.5 px-2 rounded-lg text-[11px] sm:text-xs font-medium transition-colors shrink-0 touch-manipulation ${
                      isActive ? "bg-[#27c7ff] text-white" : isPast ? "bg-[#e0f4fc] text-[#0e4659]" : "bg-[#f0f0f0] text-[#808080]"
                    }`}
                  >
                    <span>{stepNum}</span>
                    <span className="hidden xs:inline whitespace-nowrap">{t(key as string)}</span>
                    {i < STEP_KEYS.length - 1 && <span className="text-[#808080] hidden sm:inline">›</span>}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {(paymentComplete || (cardReturnResult?.success === true)) ? (
          <div className="flex-1 min-h-0 overflow-y-auto flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6">
            <div className="max-w-md w-full text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#e0f4fc] mb-6">
                <CheckCircle2 className="w-12 h-12 text-[#27c7ff]" />
              </div>
              <DialogTitle className="text-2xl font-bold text-[#222222] mb-3">
                {t("tourCheckout.prepareForExperience")}
              </DialogTitle>
              <p className="text-[#5f686c] mb-6">
                {t("tourCheckout.emailConfirmation")}
              </p>
              {(bookingNumber || cardReturnResult?.bookingNumber) && (
                <p className="text-sm text-[#808080] mb-6">
                  {t("tourCheckout.bookingNumber")}: <strong>{bookingNumber || cardReturnResult?.bookingNumber}</strong>
                </p>
              )}
              <Button
                onClick={closeCheckout}
                className="bg-[#27c7ff] hover:bg-[#23b3e6] text-white h-12 px-8 rounded-xl font-bold"
              >
                {t("tourCheckout.letsGo")}
              </Button>
            </div>
          </div>
        ) : (paymentRejected || cardReturnResult?.success === false) ? (
          <div className="flex-1 min-h-0 overflow-y-auto flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6">
            <div className="max-w-md w-full text-center p-6 rounded-2xl border-2 border-red-200 bg-red-50">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                <X className="w-8 h-8 text-red-600" aria-hidden />
              </div>
              <p className="text-red-700 font-bold text-lg mb-6">
                {cardReturnResult ? t("tourCheckout.paymentRejectedCard") : t("tourCheckout.paymentRejectedMbway")}
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Button
                  onClick={() => { if (cardReturnResult) closeCheckout(); else { setPaymentRejected(false); setStep(4); } }}
                  variant="outline"
                  className="rounded-xl border-red-300 text-red-700 hover:bg-red-50"
                >
                  {t("tourCheckout.tryAgain")}
                </Button>
                <Button
                  onClick={closeCheckout}
                  className="bg-[#222222] hover:bg-[#333] text-white rounded-xl"
                >
                  {t("common.cancel")}
                </Button>
              </div>
            </div>
          </div>
        ) : waitingMbway ? (
          <div className="flex-1 min-h-0 overflow-y-auto flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6">
            <div className="max-w-md w-full text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#27c7ff] border-t-transparent mx-auto mb-4" />
              <DialogTitle className="text-lg font-semibold text-[#222222] mb-2">
                {t("tourCheckout.waitingMbway")}
              </DialogTitle>
              <p className="text-sm text-[#5f686c]">
                {t("payment.awaitingConfirmation")}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">
            {/* Main content */}
            <div className="flex-1 min-w-0 min-h-0 overflow-y-auto px-4 sm:px-5 lg:px-8 py-4 sm:py-6">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(currentStep - 1)}
                  className="flex items-center gap-1 text-[#27c7ff] text-sm font-medium mb-6 hover:underline"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {t("tourCheckout.previous")}
                </button>
              )}

              {currentStep === 1 && tour && bookingData && (
                <div className="space-y-6">
                  <div className="flex gap-4 p-4 bg-white rounded-xl border border-[#e8eaed]">
                    {tour.image ? (
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-[#e8eaed]">
                        <Image src={tour.image} alt="" fill className="object-cover" sizes="96px" />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-lg bg-[#e8eaed] shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-[#222222] text-lg">{tour.title}</h3>
                      <p className="text-sm text-[#5f686c] mt-2">
                        {t("tourCheckout.passengers")}: {bookingData.adults + bookingData.children} ({bookingData.adults} {t("tourDetails.adult").toLowerCase()}, {bookingData.children} {t("tourDetails.children").toLowerCase()})
                      </p>
                      {bookingData.date && (
                        <p className="text-sm text-[#5f686c]">
                          {t("tourCheckout.date")}: {bookingData.date.toLocaleDateString()}
                          {bookingData.time && ` · ${bookingData.time}`}
                        </p>
                      )}
                    </div>
                  </div>
                  {submitError && (
                    <p className="text-sm text-[#d60510]" role="alert">{submitError}</p>
                  )}
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-5">
                  <p className="text-[#5f686c]">{t("tourCheckout.fillContactInfo")}</p>
                  <div className="grid gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#222222] mb-1">
                        {t("passengerForm.name")}<span className="text-[#ff0000]">*</span>
                      </label>
                      <InputWithIcon
                        icon={<User className="w-5 h-5" />}
                        value={contact.name}
                        onChange={(v) => updateContact({ name: v })}
                        placeholder={t("passengerForm.namePlaceholder")}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#222222] mb-1">
                        {t("passengerForm.email")}<span className="text-[#ff0000]">*</span>
                      </label>
                      <InputWithIcon
                        icon={<Mail className="w-5 h-5" />}
                        value={contact.email}
                        onChange={(v) => updateContact({ email: v })}
                        placeholder={t("passengerForm.emailPlaceholder")}
                        type="email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#222222] mb-1">
                        {t("passengerForm.whatsapp")}<span className="text-[#ff0000]">*</span>
                      </label>
                      <PhoneInput
                        value={contact.phone}
                        onChange={(v) => updateContact({ phone: v })}
                        defaultCountry="pt"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#222222] mb-1">{t("passengerForm.nifVat")}</label>
                      <InputWithIcon
                        icon={<FileText className="w-5 h-5" />}
                        value={contact.nif}
                        onChange={(v) => updateContact({ nif: v })}
                        placeholder={t("passengerForm.nifPlaceholder")}
                      />
                    </div>
                  </div>
                  {submitError && (
                    <p className="text-sm text-[#d60510]" role="alert">{submitError}</p>
                  )}
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-5">
                  {selectedPickup ? (
                    <>
                      <div className="flex gap-4 p-5 bg-[#f8fafb] rounded-xl border border-[#e8eaed]">
                        <MapPin className="w-6 h-6 text-[#27c7ff] shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-[#222222]">{selectedPickup.title}</p>
                          <p className="text-sm text-[#5f686c] mt-1">{selectedPickup.address}</p>
                          {selectedPickup.description && (
                            <p className="text-sm text-[#808080] mt-2">{selectedPickup.description}</p>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-[#808080]">{t("tourCheckout.pickupDescription")}</p>
                    </>
                  ) : (
                    <p className="text-sm text-[#808080]">{t("tourCheckout.noPickup")}</p>
                  )}

                  {/* Observations */}
                  <div>
                    <label className="block text-sm font-semibold text-[#222222] mb-2">
                      {t("tourCheckout.observations")}
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3.5 w-5 h-5 text-[#bfbfbf]" />
                      <textarea
                        value={contact.observations}
                        onChange={(v) => updateContact({ observations: v.target.value })}
                        placeholder={t("tourCheckout.observationsPlaceholder")}
                        className="w-full min-h-[100px] pl-10 pr-4 py-3 border border-[#e8eaed] rounded-xl text-sm text-[#222222] placeholder:text-[#a2a2a2] resize-none focus:outline-none focus:ring-2 focus:ring-[#27c7ff]"
                      />
                    </div>
                  </div>

                  {submitError && (
                    <p className="text-sm text-[#d60510]" role="alert">{submitError}</p>
                  )}
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-[#222222] mb-3">{t("tourCheckout.addTip")}</h4>
                    <div className="flex flex-wrap gap-2">
                      {tipOptions.map((opt) => (
                        <button
                          key={opt.percent}
                          type="button"
                          onClick={() => setTipPercent(opt.percent, opt.percent >= 0 ? Math.round((basePrice * opt.percent) / 100) : 0)}
                          className={`px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-colors ${
                            tipPercent === opt.percent
                              ? "border-[#27c7ff] bg-[#e0f4fc] text-[#0e4659]"
                              : "border-[#e8eaed] bg-white text-[#222222] hover:border-[#27c7ff]"
                          }`}
                        >
                          {opt.percent === -1 ? t("tourCheckout.custom") : opt.label}
                        </button>
                      ))}
                    </div>
                    {tipPercent === -1 && (
                      <div className="mt-3">
                        <label className="block text-xs text-[#808080] mb-1">{t("tourCheckout.customTipPercent")}</label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          step={1}
                          className="w-full border border-[#e8eaed] rounded-xl px-4 py-2.5 text-sm"
                          placeholder="e.g. 5"
                          onChange={(e) => {
                            const p = parseFloat(e.target.value) || 0
                            setTipPercent(-1, Math.round((basePrice * p) / 100))
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-[#222222] mb-3">{t("payment.title")}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => updatePayment({ method: "cash" })}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                          payment.method === "cash" ? "border-[#27c7ff] bg-[#e0f4fc]" : "border-[#e8eaed] hover:border-[#27c7ff]"
                        }`}
                      >
                        <Banknote className="w-7 h-7 text-[#222222]" />
                        <span className="text-sm font-medium text-[#222222]">{t("payment.cash")}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => updatePayment({ method: "mbway" })}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                          payment.method === "mbway" ? "border-[#27c7ff] bg-[#e0f4fc]" : "border-[#e8eaed] hover:border-[#27c7ff]"
                        }`}
                      >
                        <Image src="/mbway_checkout.png" alt="MBWay" width={36} height={36} className="w-7 h-7 object-contain" />
                        <span className="text-sm font-medium text-[#222222]">{t("payment.mbway")}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => updatePayment({ method: "cartao" })}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                          payment.method === "cartao" ? "border-[#27c7ff] bg-[#e0f4fc]" : "border-[#e8eaed] hover:border-[#27c7ff]"
                        }`}
                      >
                        <CreditCard className="w-7 h-7 text-[#222222]" />
                        <span className="text-sm font-medium text-[#222222]">{t("payment.card")}</span>
                      </button>
                    </div>
                  </div>

                  {payment.method === "mbway" && (
                    <div>
                      <label className="block text-sm font-semibold text-[#222222] mb-1">{t("payment.mbwayPhoneNumber")}</label>
                      <PhoneInput
                        value={payment.mbwayPhone}
                        onChange={(v) => updatePayment({ mbwayPhone: v })}
                        defaultCountry="pt"
                        placeholder={t("payment.mbwayPhonePlaceholder")}
                      />
                    </div>
                  )}

                  {submitError && (
                    <p className="text-sm text-[#d60510]" role="alert">{submitError}</p>
                  )}
                </div>
              )}
            </div>

            {/* Order summary sidebar */}
            <OrderSummarySidebar
              tour={tour}
              bookingData={bookingData}
              basePrice={basePrice}
              totalAmount={totalAmount}
              currentStep={currentStep}
              isStep4={currentStep === 4}
              onContinue={currentStep === 4 ? handlePay : getContinueHandler()}
              isSubmitting={isSubmitting}
              addonsTotal={bookingData?.addonsTotal}
              selectedAddons={bookingData?.selectedAddons}
              reservationTimeLabel={
                bookingId && reservationSecondsLeft !== null && reservationSecondsLeft > 0
                  ? t("tourCheckout.reservedForMinutes", {
                      time: `${Math.floor(reservationSecondsLeft / 60)}:${String(reservationSecondsLeft % 60).padStart(2, "0")}`,
                    })
                  : null
              }
              t={t}
            />
          </div>
        )}
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
