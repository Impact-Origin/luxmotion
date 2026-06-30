"use client"

import { CheckoutHeader } from "@/components/checkout/checkout-header"
import { VehicleCard } from "@/components/checkout/vehicle-card"
import { TransferInfoStep } from "@/components/checkout/transfer-info-step"
import { OrderSummarySidebar } from "@/components/checkout/order-summary-sidebar"
import { Footer } from "@/components/new-landing-page/footer"
import { PassengerInfoForm } from "@/components/checkout/passenger-info-form"
import { PaymentStep } from "@/components/checkout/payment-step"
import { ConfirmationModal } from "@/components/checkout/confirmation-modal"
import { ExperiencesStep } from "@/components/checkout/experiences-step"
import { CheckoutStepLayout } from "@/components/checkout/shared/checkout-step-layout"
import { CheckoutProvider, useCheckout, DEV_ALLOW_STEP_SKIP, type Vehicle } from "@/components/checkout/checkout-context"
import { useVehicles } from "@/hooks/use-vehicles"
import { useRouteDistance } from "@/hooks/use-route-distance"
import { useNearbyTours } from "@/hooks/use-nearby-tours"
import { useEffect, useMemo } from "react"
import { ArrowRight } from "lucide-react"
import { initOrder, toBackendLocation, formatLocalDateTime } from "@/lib/orders"
import { useConvex } from "convex/react"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"

export function CheckoutPage() {
  return (
    <CheckoutProvider>
      <CheckoutPageContent />
    </CheckoutProvider>
  )
}

function CheckoutPageContent() {
  const convex = useConvex()
  const searchParams = useSearchParams()
  const { state, setStep, setSelectedVehicle, setShowTransferForm, setOrder, updateDistance, setUpgradeMode, submitCheckout, setNearbyTours } = useCheckout()
  const { currentStep, direction, selectedVehicle, showTransferForm, transfer, distance: storedDistance, orderId, upgradeMode, hasNearbyTours, nearbyToursLoaded } = state

  const confirmationStep = hasNearbyTours ? 5 : 4
  const passengerStep = hasNearbyTours ? 3 : 2
  const paymentStep = hasNearbyTours ? 4 : 3
  const experiencesStep = 2

  // Redirect to confirmation when returning from successful payment (error/cancel stay on checkout)
  useEffect(() => {
    const success = searchParams?.get("success")
    if (success === "true" && currentStep !== confirmationStep) {
      submitCheckout()
      setStep(confirmationStep)
    }
  }, [searchParams, currentStep, setStep, submitCheckout, confirmationStep])

  const { distance: calculatedDistance, duration: calculatedDuration, isCalculating: isCalculatingDistance, error: routeError } = useRouteDistance({
    from: { lat: transfer.fromLat, lng: transfer.fromLng },
    to: { lat: transfer.toLat, lng: transfer.toLng },
    stops: transfer.stops.map(s => ({ lat: s.lat, lng: s.lng })),
  })

  const distance = calculatedDistance ?? (routeError ? null : storedDistance)

  useEffect(() => {
    if (
      calculatedDistance !== null &&
      (calculatedDistance !== storedDistance || calculatedDuration !== state.routeDuration)
    ) {
      updateDistance(calculatedDistance, calculatedDuration)
    }
  }, [calculatedDistance, calculatedDuration, storedDistance, state.routeDuration, updateDistance])

  const { tours: nearbyTours, isLoading: nearbyToursLoading } = useNearbyTours({
    lat: transfer.toLat,
    lng: transfer.toLng,
  })

  useEffect(() => {
    if (!nearbyToursLoading && transfer.toLat != null && transfer.toLng != null) {
      setNearbyTours(nearbyTours.length > 0)
    }
  }, [nearbyTours, nearbyToursLoading, transfer.toLat, transfer.toLng, setNearbyTours])

  useEffect(() => {
    if (nearbyToursLoaded && !hasNearbyTours && currentStep === experiencesStep) {
      setStep(passengerStep)
    }
  }, [nearbyToursLoaded, hasNearbyTours, currentStep, experiencesStep, passengerStep, setStep])

  const isNight = useMemo(() => {
    if (!transfer.departureDate) return false
    const date = new Date(transfer.departureDate)
    const hour = date.getHours()
    return hour >= 20 || hour < 8
  }, [transfer.departureDate])

  const isNightReturn = useMemo(() => {
    if (!transfer.bookReturn || !transfer.returnDate) return false
    const date = new Date(transfer.returnDate)
    const hour = date.getHours()
    return hour >= 20 || hour < 8
  }, [transfer.bookReturn, transfer.returnDate])
  const isRoundTrip = transfer.bookReturn

  const { vehicles, isLoading: vehiclesLoading } = useVehicles({
    passengers: transfer.passengers,
    luggage: transfer.luggage,
    distance: distance ?? undefined,
    isNight,
    isNightReturn: transfer.bookReturn ? isNightReturn : undefined,
    bookReturn: transfer.bookReturn,
    upgradeMode: upgradeMode,
    currentVehiclePassengers: selectedVehicle?.passengers ?? 0,
    currentVehicleLuggage: selectedVehicle?.luggage ?? 0,
  })

  useEffect(() => {
    if (selectedVehicle && vehicles.length > 0) {
      const updatedVehicle = vehicles.find(v => v.id === selectedVehicle.id)
      if (updatedVehicle && updatedVehicle.price !== selectedVehicle.price) {
        setSelectedVehicle(updatedVehicle)
      }
    }
  }, [vehicles, selectedVehicle, setSelectedVehicle])

  useEffect(() => {
    async function ensureOrder() {
      if (currentStep === confirmationStep) return
      if (orderId || !transfer.fromLocation || !transfer.toLocation || !transfer.departureDate) return

      try {
        const departure = toBackendLocation({
          location: transfer.fromLocation,
          placeId: transfer.fromPlaceId,
          lat: transfer.fromLat,
          lng: transfer.fromLng,
        })
        const arrival = toBackendLocation({
          location: transfer.toLocation,
          placeId: transfer.toPlaceId,
          lat: transfer.toLat,
          lng: transfer.toLng,
        })
        const stops = (transfer.stops || []).map((s) =>
          toBackendLocation({ location: s.text, placeId: s.placeId, lat: s.lat, lng: s.lng })
        )

        const resp = await initOrder(convex, {
          departure,
          arrival,
          stops,
          passengers: transfer.passengers,
          adults: transfer.adults,
          children: transfer.children,
          departureDate: formatLocalDateTime(transfer.departureDate, true),
          isRoundTrip: false,
          returnDate: undefined,
        })

        setOrder(resp.order.id, resp.order)
      } catch (e: unknown) {
        console.error("Failed to init order:", e)
      }
    }

    ensureOrder()
  }, [orderId, transfer, setOrder, currentStep, confirmationStep])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentStep])

  const handleStepChange = (newStep: number) => {
    // Sequential checkout: a step in the indicator can only go BACK to an
    // already-completed step. Forward progression happens exclusively via the
    // Continue button (which validates the current step), so the client can't
    // skip ahead to Payment/Confirmation. A placed order (confirmation) is locked.
    if (currentStep === confirmationStep) return
    if (newStep < currentStep) setStep(newStep)
  }

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setUpgradeMode(false)
  }

  const handleContinueFromVehicle = () => {
    if (!selectedVehicle) return
    setShowTransferForm(true)
    // Showing the transfer form doesn't change currentStep (so the step-change
    // scroll effect doesn't fire). On desktop, jump back to the top so the form
    // starts in view instead of staying scrolled down at the vehicle list.
    if (window.innerWidth >= 1024) {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleContinue = () => {
    setStep(currentStep + 1)
  }

  const getAnimationClass = () => {
    if (currentStep === confirmationStep) return ""
    return "animate-in fade-in slide-in-from-right-4 duration-500"
  }

  const getAnimationStyle = () => {
    if (currentStep === confirmationStep) return {}
    return { animationName: direction === "right" ? "slideInRight" : "slideInLeft" }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <CheckoutHeader
        currentStep={currentStep}
        onStepClick={handleStepChange}
        allowStepSkip={DEV_ALLOW_STEP_SKIP}
        hasNearbyTours={hasNearbyTours}
      />

      <main className="flex-1 bg-[#0D0D0D] text-white overflow-x-hidden pb-16">
        <div key={currentStep} className={getAnimationClass()} style={getAnimationStyle()}>
          {currentStep === 1 && (
            <VehicleSelectionStep
              vehicles={vehicles}
              isLoading={vehiclesLoading || isCalculatingDistance}
              selectedVehicle={selectedVehicle}
              showTransferForm={showTransferForm}
              onVehicleSelect={handleVehicleSelect}
              onContinueFromVehicle={handleContinueFromVehicle}
              onContinue={handleContinue}
              routeError={routeError}
              isRoundTrip={isRoundTrip}
            />
          )}

          {currentStep === experiencesStep && hasNearbyTours && (
            <ExperiencesStep
              onContinue={handleContinue}
              onBack={() => setStep(currentStep - 1)}
              nearbyTours={nearbyTours}
            />
          )}

          {currentStep === passengerStep && (
            <CheckoutStepLayout>
              <PassengerInfoForm
                onContinue={handleContinue}
                onBack={() => setStep(currentStep - 1)}
              />
            </CheckoutStepLayout>
          )}

          {currentStep === paymentStep && (
            <CheckoutStepLayout>
              <PaymentStep
                onContinue={handleContinue}
                onBack={() => setStep(currentStep - 1)}
              />
            </CheckoutStepLayout>
          )}

          {currentStep === confirmationStep && (
            <ConfirmationModal />
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

interface VehicleSelectionStepProps {
  vehicles: Vehicle[]
  isLoading?: boolean
  selectedVehicle: Vehicle | null
  showTransferForm: boolean
  onVehicleSelect: (vehicle: Vehicle) => void
  onContinueFromVehicle: () => void
  onContinue: () => void
  routeError?: "no_route" | "api_error" | null
  isRoundTrip: boolean
}

function VehicleSelectionStep({
  vehicles,
  isLoading,
  selectedVehicle,
  showTransferForm,
  onVehicleSelect,
  onContinueFromVehicle,
  onContinue,
  routeError,
  isRoundTrip,
}: VehicleSelectionStepProps) {
  const t = useTranslations("checkout")
  const tCommon = useTranslations("common")

  if (showTransferForm && selectedVehicle) {
    return (
      <div className="max-w-[1200px] mx-auto px-6 pb-6">
        <div className="lg:hidden mb-6 -mx-6">
          <OrderSummarySidebar collapsible />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1.9fr_1fr] gap-0 mt-6 lg:mt-0 items-start">
          <div className="pt-8 lg:pr-6">
            <TransferInfoStep onContinue={onContinue} />
          </div>
          <div className="hidden lg:block">
            <OrderSummarySidebar />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 pb-6">
      <div className="lg:hidden mb-6 -mx-6">
        <OrderSummarySidebar collapsible />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1.9fr_1fr] gap-0 items-start">
        <div className="flex flex-col pt-8 lg:pr-6">
          <div className="flex items-center justify-between gap-4 mb-5">
            <h2
              className="text-[28px] lg:text-[36px] font-normal text-[#F7F4EF] leading-none"
              style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif" }}
            >
              {t("chooseYourVehicle")}
            </h2>
            <button
              type="button"
              onClick={onContinueFromVehicle}
              disabled={!selectedVehicle}
              className="hidden sm:inline-flex items-center gap-2 bg-[#C9A96E] hover:bg-[#b89558] text-[#1E1D1B] font-semibold uppercase tracking-[0.08em] text-[13px] px-6 py-3.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              {tCommon("continue")}
              <ArrowRight className="size-4" strokeWidth={2} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {isLoading ? (
              [1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-[285px] bg-[#1A1A1A] border border-[rgba(201,169,110,0.08)] animate-pulse"
                />
              ))
            ) : routeError === "no_route" ? (
              <div className="col-span-full py-20 text-center bg-[#141414] border border-dashed border-[rgba(201,169,110,0.22)]">
                <p className="text-[#F5F5F5] font-medium mb-2">No driving route found between these locations.</p>
                <p className="text-[rgba(255,255,255,0.55)] text-sm">Please check if both locations are accessible by car.</p>
              </div>
            ) : routeError === "api_error" ? (
              <div className="col-span-full py-20 text-center bg-[#141414] border border-dashed border-[rgba(201,169,110,0.22)]">
                <p className="text-[#F5F5F5] font-medium mb-2">Unable to calculate route.</p>
                <p className="text-[rgba(255,255,255,0.55)] text-sm">Please try again or contact support.</p>
              </div>
            ) : vehicles.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-[#141414] border border-dashed border-[rgba(201,169,110,0.22)]">
                <p className="text-[#C9A96E] font-medium">{t("noVehicles")}</p>
              </div>
            ) : (
              vehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  isRoundTrip={isRoundTrip}
                  onSelect={onVehicleSelect}
                  selected={selectedVehicle?.id === vehicle.id}
                />
              ))
            )}
          </div>
          <div className="flex justify-end mt-8">
            <button
              type="button"
              onClick={onContinueFromVehicle}
              disabled={!selectedVehicle}
              className="inline-flex items-center gap-2 bg-[#C9A96E] hover:bg-[#b89558] text-[#1E1D1B] font-semibold uppercase tracking-[0.08em] text-[13px] px-8 py-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {tCommon("continue")}
              <ArrowRight className="size-4" strokeWidth={2} />
            </button>
          </div>
        </div>
        <div className="hidden lg:block">
          <OrderSummarySidebar />
        </div>
      </div>
    </div>
  )
}
