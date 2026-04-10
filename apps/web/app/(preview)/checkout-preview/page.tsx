"use client";

import React, { useEffect, useState } from "react";
import { DynamicThemeProvider, defaultTheme, ThemeConfig } from "@/components/dynamic-theme-provider";
import { CheckoutHeader } from "@/components/customizable-checkout/checkout-header";
import { TrustBanner } from "@/components/customizable-checkout/trust-banner";
import { VehicleCard } from "@/components/customizable-checkout/vehicle-card";
import { TransferInfoPreview } from "@/components/customizable-checkout/transfer-info-preview";
import { PassengerInfoPreview } from "@/components/customizable-checkout/passenger-info-preview";
import { PaymentStepPreview } from "@/components/customizable-checkout/payment-step-preview";
import { ExperiencesStepPreview } from "@/components/customizable-checkout/experiences-step-preview";
import { OrderSummarySidebarPreview, OrderSummaryMobilePreview } from "@/components/customizable-checkout/order-summary-preview";
import { CheckoutFooter } from "@/components/customizable-checkout/checkout-footer";
import type { NearbyTour } from "@/components/checkout/experiences-step";

const MOCK_VEHICLES = [
  {
    id: "1",
    name: "Standard",
    price: 45.00,
    pricePerKm: 0.85,
    hasDistance: true,
    image: "/standard-car.png",
    passengers: 3,
    luggage: 3,
    isElectric: false,
  },
  {
    id: "2",
    name: "Executive",
    price: 65.00,
    pricePerKm: 1.10,
    hasDistance: true,
    image: "/executivo-car.png",
    passengers: 3,
    luggage: 3,
    isElectric: true,
  },
  {
    id: "3",
    name: "Van",
    price: 85.00,
    pricePerKm: 1.35,
    hasDistance: true,
    image: "/van.png",
    passengers: 7,
    luggage: 7,
    isElectric: false,
  },
  {
    id: "4",
    name: "XL",
    price: 95.00,
    pricePerKm: 1.50,
    hasDistance: true,
    image: "/xl-car.png",
    passengers: 5,
    luggage: 5,
    isElectric: false,
  },
];

const MOCK_NEARBY_TOURS: NearbyTour[] = [
  {
    _id: "private-1",
    slug: "flemboy-tour",
    title: "Flemboy tour",
    subtitle: "City lights and festive route",
    description: "Private route with curated highlights.",
    bannerImageUrl: "/mockup_tour_picks/3.jpg",
    basePrice: 16,
    duration: "30 min",
    distanceKm: 6,
    category: "private",
    addons: [],
  },
];

const CUSTOMIZATION_STEPS = [
  { id: 1, name: "Vehicle Selection" },
  { id: 2, name: "Transfer Info Form" },
  { id: 3, name: "Tours Step" },
  { id: 4, name: "Passenger Info" },
  { id: 5, name: "Payment" },
];

export default function CheckoutPreviewPage() {
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [customizationStep, setCustomizationStep] = useState(1);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    // preview mode iframe check
    setIsPreviewMode(window.self !== window.top);

    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "UPDATE_THEME") {
        setTheme(event.data.theme);
        if (event.data.logoUrl !== undefined) {
          setLogoUrl(event.data.logoUrl);
        }
      }
      if (event.data.type === "SET_CHECKOUT_STEP") {
        setCurrentStep(event.data.step);
      }
      if (event.data.type === "SET_CUSTOMIZATION_STEP") {
        setCustomizationStep(event.data.step);
      }
    };

    window.addEventListener("message", handleMessage);
    window.parent.postMessage({ type: "PREVIEW_READY", customizationSteps: CUSTOMIZATION_STEPS }, "*");

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    setCurrentStep(1);
  }, [customizationStep]);

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
    window.parent.postMessage({ type: "CHECKOUT_STEP_CHANGED", step }, "*");
  };

  const handleVehicleSelect = () => {
  };

  const hasToursStep = customizationStep >= 3;
  const previewHeaderStep = customizationStep <= 2 ? 1 : customizationStep - 1;

  return (
    <DynamicThemeProvider theme={theme} isPreviewMode={isPreviewMode} logoUrl={logoUrl}>
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--theme-checkout-page-bg, #F5F5F5)" }}>
        <CheckoutHeader
          currentStep={previewHeaderStep}
          onStepClick={handleStepClick}
          allowStepSkip={false}
          hasNearbyTours={hasToursStep}
        />

        <main className="flex-1 overflow-hidden" style={{ backgroundColor: "var(--theme-checkout-page-bg, #F5F5F5)" }}>
          {currentStep === 1 && customizationStep === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="max-w-[1400px] mx-auto pt-8 px-4">
                <TrustBanner />
              </div>

              <div className="max-w-[1400px] mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {MOCK_VEHICLES.map((vehicle) => (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      onSelect={handleVehicleSelect}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && customizationStep === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="max-w-[1200px] mx-auto pt-8 px-6">
                <TrustBanner />
              </div>

              <div className="max-w-[1200px] mx-auto px-6 py-6 pt-8">
                {/* Mobile Order Summary */}
                <OrderSummaryMobilePreview />

                {/* Desktop Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 mt-6 lg:mt-0">
                  <TransferInfoPreview />
                  <div className="hidden lg:block">
                    <OrderSummarySidebarPreview />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && customizationStep === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="max-w-[1200px] mx-auto px-6 py-8">
                <ExperiencesStepPreview nearbyTours={MOCK_NEARBY_TOURS} />
              </div>
            </div>
          )}

          {currentStep === 1 && customizationStep === 4 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="max-w-[1200px] mx-auto pt-8 px-6">
                <TrustBanner />
              </div>

              <div className="max-w-[1200px] mx-auto px-6 py-6 pt-8">
                <OrderSummaryMobilePreview />

                <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 mt-6 lg:mt-0">
                  <PassengerInfoPreview />
                  <div className="hidden lg:block">
                    <OrderSummarySidebarPreview />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && customizationStep === 5 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="max-w-[1200px] mx-auto pt-8 px-6">
                <TrustBanner />
              </div>

              <div className="max-w-[1200px] mx-auto px-6 py-6 pt-8">
                <OrderSummaryMobilePreview />
                <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 mt-6 lg:mt-0">
                  <PaymentStepPreview />
                  <div className="hidden lg:block">
                    <OrderSummarySidebarPreview />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="max-w-[1200px] mx-auto px-6 py-8">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-[22px] font-bold text-[#222222] mb-6">Passenger Information</h2>
                  <p className="text-gray-500">Step 2 preview - Passenger information form would appear here.</p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="max-w-[1200px] mx-auto px-6 py-8">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-[22px] font-bold text-[#222222] mb-6">Payment</h2>
                  <p className="text-gray-500">Step 3 preview - Payment form would appear here.</p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="max-w-[1200px] mx-auto px-6 py-8">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-[22px] font-bold text-[#222222] mb-6">Confirmation</h2>
                  <p className="text-gray-500">Step 4 preview - Confirmation would appear here.</p>
                </div>
              </div>
            </div>
          )}
        </main>

        <CheckoutFooter />
      </div>
    </DynamicThemeProvider>
  );
}
