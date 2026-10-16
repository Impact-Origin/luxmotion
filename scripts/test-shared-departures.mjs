// node --experimental-strip-types --test scripts/test-shared-departures.mjs
import assert from "node:assert/strict";
import { test } from "node:test";
import { createRequire } from "node:module";
import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { normalizeSharedDepartures, resolveSharedTrips, lisbonDateTime, isReturnFor } from "../packages/convex/convex/lib/sharedDepartures.ts";

const root = fileURLToPath(new URL("../", import.meta.url));
const convexRequire = createRequire(resolve(root, "packages/convex/package.json"));
const ts = convexRequire("typescript");
const server = convexRequire("convex/server");
const cache = new Map();
function loadModule(path) {
  if (cache.has(path)) return cache.get(path);
  const module = { exports: {} };
  cache.set(path, module.exports);
  const code = ts.transpileModule(readFileSync(path, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const localRequire = specifier => {
    if (specifier.endsWith("_generated/server")) return { query: server.queryGeneric, mutation: server.mutationGeneric, action: server.actionGeneric, internalMutation: server.internalMutationGeneric, internalAction: server.internalActionGeneric };
    if (specifier.endsWith("_generated/api")) return { api: server.anyApi, internal: server.anyApi };
    if (!specifier.startsWith(".")) return convexRequire(specifier);
    const base = resolve(dirname(path), specifier);
    return loadModule(existsSync(base) ? base : `${base}.ts`);
  };
  new Function("require", "module", "exports", code)(localRequire, module, module.exports);
  return module.exports;
}
const bookings = loadModule(resolve(root, "packages/convex/convex/tourBookings.ts"));
const events = loadModule(resolve(root, "packages/convex/convex/events.ts"));
const at = (day, hour) => Date.UTC(2099, 9, day, hour);
const out = { id: "out-1", direction: "outbound", departureAt: at(16, 8), origin: "Lisboa", destination: "Peniche" };
const back = { id: "back-1", direction: "return", departureAt: at(16, 18), origin: "Peniche", destination: "Lisboa", price: 25 };
const nextDay = { ...out, id: "out-2", departureAt: at(17, 12), price: 40 };
const event = { _id: "event1", title: "Surf transfer", originalLanguage: "pt", description: "", location: "Lisbon", slug: "surf-transfer", eventDate: at(16, 0), endDate: at(25, 23), status: "published", isActive: true, isFeatured: false, privatePrice: 102, sharedPrice: 35, maxPassengers: 8, currency: "EUR", sharedDepartures: [out, back, nextDay], createdAt: 1, updatedAt: 1 };

function context(source = event) {
  const tables = { events: [structuredClone(source)], tourBookings: [], orders: [] };
  const db = {
    async get(id) { return Object.values(tables).flat().find(row => row._id === id) ?? null; },
    async insert(table, data) { const rows = tables[table] ??= []; const id = `${table}-${rows.length + 1}`; rows.push(structuredClone({ ...data, _id: id, _creationTime: 1 })); return id; },
    async patch(id, data) { const row = await db.get(id); assert.ok(row); Object.assign(row, structuredClone(data)); },
    query(table) {
      const filters = [];
      const rows = () => (tables[table] ?? []).filter(row => filters.every(([field, value]) => row[field] === value));
      return {
        withIndex(_name, callback) { const q = { eq(field, value) { filters.push([field, value]); return q; } }; callback(q); return this; },
        async collect() { return rows(); }, async first() { return rows()[0] ?? null; },
        async unique() { assert.ok(rows().length <= 1, "primary booking index must stay unique"); return rows()[0] ?? null; },
      };
    },
  };
  return { db, tables };
}
const args = (overrides = {}) => ({ productType: "event", eventId: "event1", tourTitle: "Surf transfer", tourSlug: "surf-transfer", passengers: 2, selectedDate: "wrong client date", selectedTime: "wrong client hour", basePrice: 120, sharingMode: "shared", sharedDepartureId: out.id, sharedReturnDepartureId: back.id, ...overrides });

test("events support multiple dates, hours and both directions, sorted by departure", () => {
  const result = normalizeSharedDepartures([nextDay, back, out], event.eventDate, event.endDate);
  assert.deepEqual(result.map(row => row.id), [out.id, back.id, nextDay.id]);
  assert.equal(result[1].direction, "return");
});

test("invalid and duplicate departures cannot be stored", () => {
  for (const row of [{ ...out, departureAt: NaN }, { ...out, departureAt: at(26, 10) }, { ...out, origin: "" }, { ...out, destination: out.origin }, { ...out, price: 0 }]) {
    assert.throws(() => normalizeSharedDepartures([row], event.eventDate, event.endDate));
  }
  assert.throws(() => normalizeSharedDepartures([out, out], event.eventDate, event.endDate), /unique/);
});

test("dates and hours are recorded in Portugal time, including midnight and DST", () => {
  assert.deepEqual(lisbonDateTime(Date.parse("2026-10-15T23:00:00Z")), { date: "2026-10-16", time: "00:00" });
  assert.deepEqual(lisbonDateTime(Date.parse("2026-10-25T08:00:00Z")), { date: "2026-10-25", time: "08:00" });
});

test("each leg uses its own price or the default shared price", () => {
  assert.deepEqual(resolveSharedTrips(event, out.id, back.id, 0).map(row => row.price), [35, 25]);
  assert.equal(resolveSharedTrips(event, back.id, undefined, 0)[0].origin, "Peniche");
  assert.equal(resolveSharedTrips(event, nextDay.id, undefined, 0)[0].price, 40);
});

test("only a later departure on the reverse route can be added as a return", () => {
  assert.equal(isReturnFor(out, back), true);
  assert.equal(isReturnFor(nextDay, back), false);
  assert.throws(() => resolveSharedTrips(event, out.id, nextDay.id, 0), /return after/);
  assert.throws(() => resolveSharedTrips(event, out.id, "missing", 0), /return after/);
  assert.throws(() => resolveSharedTrips(event, "missing", undefined, 0), /Choose an available/);
  assert.throws(() => resolveSharedTrips(event, out.id, undefined, out.departureAt), /no longer/);
});

test("booking init snapshots the chosen trips and derives date/time from the stored departure", async () => {
  const ctx = context();
  const result = await bookings.init._handler(ctx, args());
  const saved = await ctx.db.get(result.bookingId);
  assert.deepEqual(saved.sharedTrips.map(row => row.id), [out.id, back.id]);
  assert.deepEqual({ date: saved.selectedDate, time: saved.selectedTime }, lisbonDateTime(out.departureAt));
  assert.equal(saved.totalAmount, 120);
  ctx.tables.events[0].sharedDepartures[0].origin = "Changed later";
  assert.equal(saved.sharedTrips[0].origin, "Lisboa");
});

test("stale prices and unknown departures are rejected before a booking is written", async () => {
  for (const overrides of [{ basePrice: 1 }, { sharedDepartureId: "missing" }, { passengers: 0 }, { passengers: 9 }]) {
    const ctx = context();
    await assert.rejects(bookings.init._handler(ctx, args(overrides)));
    assert.equal(ctx.tables.tourBookings.length, 0);
  }
});

test("legacy shared events and private bookings retain their current behavior", async () => {
  const legacy = context({ ...event, sharedDepartures: undefined });
  const result = await bookings.init._handler(legacy, args({ basePrice: 70, sharedReturnDepartureId: undefined }));
  const saved = await legacy.db.get(result.bookingId);
  assert.equal(saved.sharedTrips, undefined);
  assert.equal(saved.selectedDate, "wrong client date");
  const privateCtx = context();
  const privateResult = await bookings.init._handler(privateCtx, args({ sharingMode: "private", basePrice: 102 }));
  assert.equal((await privateCtx.db.get(privateResult.bookingId)).sharedTrips, undefined);
});

test("paid round trips create two linked orders, with the right routes and times and no duplicate charge", async () => {
  const ctx = context();
  const { bookingId } = await bookings.init._handler(ctx, args());
  await ctx.db.patch(bookingId, { paymentStatus: "completed", paymentMethod: "ccard", status: "paid", totalAmount: 133, addonsTotal: 8, tipAmount: 5 });
  const first = await bookings.ensureOrderForPaidTourBooking._handler(ctx, { bookingId });
  assert.equal(ctx.tables.orders.length, 2);
  const [outbound, returning] = ctx.tables.orders;
  assert.equal(outbound.departure.location, "Lisboa");
  assert.equal(returning.departure.location, "Peniche");
  assert.equal(returning.arrival.location, "Lisboa");
  assert.equal(outbound.departureDate, new Date(out.departureAt).toISOString());
  assert.equal(returning.departureDate, new Date(back.departureAt).toISOString());
  assert.equal(outbound.totalAmount + returning.totalAmount, 133);
  assert.equal(returning.totalAmount, 50);
  assert.equal(outbound.addonsTotal, 8);
  assert.equal(returning.addonsTotal, undefined);
  assert.equal(outbound.relatedOrderId, returning._id);
  assert.equal(returning.relatedOrderId, outbound._id);
  assert.equal(returning.tourBookingId, undefined);
  const repeated = await bookings.ensureOrderForPaidTourBooking._handler(ctx, { bookingId });
  assert.equal(repeated.orderId, first.orderId);
  assert.equal(ctx.tables.orders.length, 2);
});

test("cash bookings also create both linked legs and remain idempotent", async () => {
  const ctx = context();
  const { bookingId } = await bookings.init._handler(ctx, args());
  await bookings.startPayment._handler(ctx, { bookingId, method: "cash", totalAmount: 120 });
  await bookings.startPayment._handler(ctx, { bookingId, method: "cash", totalAmount: 120 });
  assert.equal(ctx.tables.orders.length, 2);
});

test("a return-only booking creates one order in the Peniche to Lisbon direction", async () => {
  const ctx = context();
  const { bookingId } = await bookings.init._handler(ctx, args({ sharedDepartureId: back.id, sharedReturnDepartureId: undefined, basePrice: 50 }));
  await bookings.startPayment._handler(ctx, { bookingId, method: "cash", totalAmount: 50 });
  assert.equal(ctx.tables.orders.length, 1);
  assert.equal(ctx.tables.orders[0].departure.location, "Peniche");
  assert.equal(ctx.tables.orders[0].isRoundTrip, false);
});

test("editing dates cannot strand configured departures outside the event period", async () => {
  const ctx = context();
  await assert.rejects(events.update._handler(ctx, { id: "event1", endDate: at(16, 10) }), /within the event dates/);
  assert.equal(ctx.tables.events[0].endDate, event.endDate);
  await events.update._handler(ctx, { id: "event1", sharedDepartures: [] });
  assert.deepEqual(ctx.tables.events[0].sharedDepartures, []);
});

test("the admin create and update mutations persist full schedules and individual prices", async () => {
  const ctx = context();
  const { _id, slug, createdAt, updatedAt, ...data } = event;
  const id = await events.create._handler(ctx, data);
  assert.equal((await ctx.db.get(id)).sharedDepartures.length, 3);
  await events.update._handler(ctx, { id, sharedDepartures: [out, { ...back, price: 30 }] });
  assert.deepEqual((await ctx.db.get(id)).sharedDepartures.map(row => row.price), [undefined, 30]);
});
