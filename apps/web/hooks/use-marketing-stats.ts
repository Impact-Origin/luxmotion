"use client";

import { useQuery } from "convex/react";
import { api } from "@workspace/convex/api";

export const marketingStatsDefaults = {
  trustpilotReviewCount: 387,
  heroDailyTravelersMin: 90,
  heroDailyTravelersMax: 150,
  detailDailyTravelersMin: 55,
  detailDailyTravelersMax: 125,
  checkoutBookedTodayMin: 16,
  checkoutBookedTodayMax: 42,
};

export function useMarketingStats() {
  const data = useQuery(api.marketingStats.get);
  return data ?? marketingStatsDefaults;
}
