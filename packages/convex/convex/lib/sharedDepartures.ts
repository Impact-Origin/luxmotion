import { v } from "convex/values";

export const sharedDepartureValidator = v.object({
  id: v.string(),
  direction: v.union(v.literal("outbound"), v.literal("return")),
  departureAt: v.number(),
  origin: v.string(),
  destination: v.string(),
  price: v.optional(v.number()),
});

export const sharedTripValidator = v.object({
  id: v.string(),
  direction: v.union(v.literal("outbound"), v.literal("return")),
  departureAt: v.number(),
  origin: v.string(),
  destination: v.string(),
  price: v.number(),
});

export interface SharedDeparture {
  id: string;
  direction: "outbound" | "return";
  departureAt: number;
  origin: string;
  destination: string;
  price?: number;
}

export type SharedTrip = SharedDeparture & { price: number };

export function lisbonDateTime(timestamp: number) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Lisbon", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(timestamp);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find(p => p.type === type)!.value;
  return { date: `${part("year")}-${part("month")}-${part("day")}`, time: `${part("hour")}:${part("minute")}` };
}

export function normalizeSharedDepartures(departures: SharedDeparture[], start: number, end?: number) {
  const ids = new Set<string>();
  return departures.map(departure => {
    const row = { ...departure, origin: departure.origin.trim(), destination: departure.destination.trim() };
    if (!row.id.trim() || ids.has(row.id)) throw new Error("Each shared departure must have a unique ID.");
    ids.add(row.id);
    if (!row.origin || !row.destination || row.origin.toLowerCase() === row.destination.toLowerCase()) {
      throw new Error("Each shared departure needs a different origin and destination.");
    }
    if (!Number.isFinite(row.departureAt) || row.departureAt < start ||
      (end !== undefined ? row.departureAt > end : lisbonDateTime(row.departureAt).date !== lisbonDateTime(start).date)) {
      throw new Error("Shared departures must be within the event dates.");
    }
    if (row.price !== undefined && (!Number.isFinite(row.price) || row.price <= 0)) {
      throw new Error("The price per person must be greater than zero.");
    }
    return row;
  }).sort((a, b) => a.departureAt - b.departureAt);
}

export function isReturnFor(first: SharedDeparture, next: SharedDeparture) {
  const normalized = (value: string) => value.trim().toLocaleLowerCase();
  return next.id !== first.id && next.direction !== first.direction && next.departureAt > first.departureAt &&
    normalized(next.origin) === normalized(first.destination) && normalized(next.destination) === normalized(first.origin);
}

export function resolveSharedTrips(
  event: { sharedDepartures?: SharedDeparture[]; sharedPrice?: number },
  departureId?: string, returnId?: string, now = Date.now(),
): SharedTrip[] {
  const first = event.sharedDepartures?.find(row => row.id === departureId);
  if (!first) throw new Error("Choose an available shared departure.");
  const second = returnId ? event.sharedDepartures?.find(row => row.id === returnId) : undefined;
  if (returnId && (!second || !isReturnFor(first, second))) throw new Error("Choose a return after the departure, on the reverse route.");
  return [first, ...(second ? [second] : [])].map(row => {
    if (row.departureAt <= now) throw new Error("This departure is no longer available. Choose another time.");
    const price = row.price ?? event.sharedPrice;
    if (price === undefined || !Number.isFinite(price) || price <= 0) throw new Error("This departure has no shared price.");
    return { ...row, price };
  });
}
