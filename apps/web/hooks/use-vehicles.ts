"use client";

import { useQuery } from "convex/react";
import { api } from "@workspace/convex/api";
import { useMemo } from "react";

/** Percentagem de imposto de noite sobre o preço base (tarifa dia) das pernas em horário noturno (22h–08h). */
const NIGHT_TAX_PERCENT = 20;
/** Valor mínimo do imposto de noite por perna (quando 20% for inferior a este valor). */
const NIGHT_TAX_MIN_EUR = 9;

interface LuggageRequirement {
  checkedBaggage: number;
  handLuggage: number;
  backpack: number;
}

interface UseVehiclesProps {
  passengers?: number;
  luggage?: LuggageRequirement;
  distance?: number;
  isNight?: boolean;
  /** For round trip: whether the return leg is at night (22h–08h). Ida uses isNight. */
  isNightReturn?: boolean;
  /** When true, price is computed for both outbound and return legs (each with its own night/day rate). */
  bookReturn?: boolean;
  partnershipSlug?: string;
  upgradeMode?: boolean;
  currentVehiclePassengers?: number;
  currentVehicleLuggage?: number;
}

export function useVehicles({
  passengers = 1,
  luggage,
  distance,
  isNight,
  isNightReturn,
  bookReturn = false,
  partnershipSlug,
  upgradeMode = false,
  currentVehiclePassengers = 0,
  currentVehicleLuggage = 0,
}: UseVehiclesProps) {
  const convexVehicles = useQuery(api.vehicles.listActive, { partnershipSlug });

  const formattedVehicles = useMemo(() => {
    if (!convexVehicles) return [];

    const requiredBags =
      (luggage?.checkedBaggage || 0) +
      (luggage?.handLuggage || 0) +
      (luggage?.backpack || 0);

    return convexVehicles
      .filter((v) => {
        // Base filter: vehicle must meet minimum passenger and luggage requirements
        const meetsMinimumRequirements = v.passengers >= passengers && v.luggage >= requiredBags;

        if (!meetsMinimumRequirements) return false;

        // In upgrade mode: only show vehicles with MORE capacity than current vehicle
        if (upgradeMode) {
          // Show vehicles with more passengers OR more luggage capacity
          const hasMorePassengers = v.passengers > currentVehiclePassengers;
          const hasMoreLuggage = v.luggage > currentVehicleLuggage;
          return hasMorePassengers || hasMoreLuggage;
        }

        return true;
      })
      .map((v) => {
        const dayRate = v.pricePerKm;
        const hasDistance = distance !== undefined && distance !== null && distance > 0;

        let finalPrice: number;
        let dayFinalPrice: number;
        let pricePerKmValue: number;
        let nightTaxOutbound = 0;
        let nightTaxReturn = 0;

        if (bookReturn && hasDistance) {
          const dayPriceOutbound = Math.max(v.minimumPrice, dayRate * distance);
          const dayPriceReturn = Math.max(v.minimumPrice, dayRate * distance);
          dayFinalPrice = dayPriceOutbound + dayPriceReturn;
          nightTaxOutbound = isNight
            ? Math.max(dayPriceOutbound * (NIGHT_TAX_PERCENT / 100), NIGHT_TAX_MIN_EUR)
            : 0;
          nightTaxReturn = isNightReturn
            ? Math.max(dayPriceReturn * (NIGHT_TAX_PERCENT / 100), NIGHT_TAX_MIN_EUR)
            : 0;
          finalPrice = dayFinalPrice + nightTaxOutbound + nightTaxReturn;
          pricePerKmValue = dayRate;
        } else {
          const dayCalculatedPrice = hasDistance ? dayRate * distance : 0;
          dayFinalPrice = hasDistance ? Math.max(v.minimumPrice, dayCalculatedPrice) : 0;
          nightTaxOutbound = isNight
            ? Math.max(dayFinalPrice * (NIGHT_TAX_PERCENT / 100), NIGHT_TAX_MIN_EUR)
            : 0;
          finalPrice = dayFinalPrice + nightTaxOutbound;
          pricePerKmValue = dayRate;
        }

        return {
          id: v._id,
          name: v.name,
          price: finalPrice,
          dayPrice: dayFinalPrice,
          nightTaxAmount: nightTaxOutbound + nightTaxReturn,
          nightTaxOutbound,
          nightTaxReturn,
          pricePerKm: pricePerKmValue,
          hasDistance,
          image: v.imageUrl || "/images/image-54.png",
          passengers: v.passengers,
          luggage: v.luggage,
          isElectric: v.isElectric,
          hasWifi: v.hasWifi,
          order: v.order,
        };
      });
  }, [convexVehicles, passengers, luggage, distance, isNight, isNightReturn, bookReturn, upgradeMode, currentVehiclePassengers, currentVehicleLuggage]);

  return {
    vehicles: formattedVehicles,
    isLoading: convexVehicles === undefined,
  };
}

