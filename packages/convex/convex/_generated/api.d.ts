/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as blogs from "../blogs.js";
import type * as contactQuotes from "../contactQuotes.js";
import type * as contactSubmissions from "../contactSubmissions.js";
import type * as corporateExperiences from "../corporateExperiences.js";
import type * as corporateRequests from "../corporateRequests.js";
import type * as driverApplications from "../driverApplications.js";
import type * as drivers from "../drivers.js";
import type * as emailVerification from "../emailVerification.js";
import type * as events from "../events.js";
import type * as flights from "../flights.js";
import type * as http from "../http.js";
import type * as ifthenpay from "../ifthenpay.js";
import type * as instagram from "../instagram.js";
import type * as lib_utils from "../lib/utils.js";
import type * as marketingStats from "../marketingStats.js";
import type * as newsletterSubscriptions from "../newsletterSubscriptions.js";
import type * as orders from "../orders.js";
import type * as partnerApplications from "../partnerApplications.js";
import type * as partnerLeads from "../partnerLeads.js";
import type * as partnerships from "../partnerships.js";
import type * as pastExperiences from "../pastExperiences.js";
import type * as payments from "../payments.js";
import type * as schoolQuoteSubmissions from "../schoolQuoteSubmissions.js";
import type * as seedReviews from "../seedReviews.js";
import type * as teamMembers from "../teamMembers.js";
import type * as tourAddons from "../tourAddons.js";
import type * as tourBookings from "../tourBookings.js";
import type * as tourInquiries from "../tourInquiries.js";
import type * as tourReviews from "../tourReviews.js";
import type * as tourScarcity from "../tourScarcity.js";
import type * as tourSchedules from "../tourSchedules.js";
import type * as tourStops from "../tourStops.js";
import type * as tours from "../tours.js";
import type * as vehicles from "../vehicles.js";
import type * as webhooks from "../webhooks.js";
import type * as weddingQuoteSubmissions from "../weddingQuoteSubmissions.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  blogs: typeof blogs;
  contactQuotes: typeof contactQuotes;
  contactSubmissions: typeof contactSubmissions;
  corporateExperiences: typeof corporateExperiences;
  corporateRequests: typeof corporateRequests;
  driverApplications: typeof driverApplications;
  drivers: typeof drivers;
  emailVerification: typeof emailVerification;
  events: typeof events;
  flights: typeof flights;
  http: typeof http;
  ifthenpay: typeof ifthenpay;
  instagram: typeof instagram;
  "lib/utils": typeof lib_utils;
  marketingStats: typeof marketingStats;
  newsletterSubscriptions: typeof newsletterSubscriptions;
  orders: typeof orders;
  partnerApplications: typeof partnerApplications;
  partnerLeads: typeof partnerLeads;
  partnerships: typeof partnerships;
  pastExperiences: typeof pastExperiences;
  payments: typeof payments;
  schoolQuoteSubmissions: typeof schoolQuoteSubmissions;
  seedReviews: typeof seedReviews;
  teamMembers: typeof teamMembers;
  tourAddons: typeof tourAddons;
  tourBookings: typeof tourBookings;
  tourInquiries: typeof tourInquiries;
  tourReviews: typeof tourReviews;
  tourScarcity: typeof tourScarcity;
  tourSchedules: typeof tourSchedules;
  tourStops: typeof tourStops;
  tours: typeof tours;
  vehicles: typeof vehicles;
  webhooks: typeof webhooks;
  weddingQuoteSubmissions: typeof weddingQuoteSubmissions;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
