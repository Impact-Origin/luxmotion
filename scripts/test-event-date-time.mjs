// node --experimental-strip-types --test scripts/test-event-date-time.mjs
import assert from "node:assert/strict";
import { test } from "node:test";
import { clampDateTime, combineLocalDateTime, eventBookingEnd, eventSelectionTimestamp, localDateTimeFields, validEventSelection } from "../apps/web/lib/event-date-time.ts";

test("opening and saving the event editor preserves Lisbon midnight, including DST boundaries", () => {
  const originalTZ = process.env.TZ;
  process.env.TZ = "Europe/Lisbon";
  try {
    for (const iso of ["2026-10-15T23:00:00Z", "2026-10-25T23:55:00Z", "2026-03-28T00:00:00Z", "2026-03-29T23:00:00Z", "2026-01-12T00:00:00Z"]) {
      const timestamp = Date.parse(iso);
      const fields = localDateTimeFields(timestamp);
      assert.equal(combineLocalDateTime(fields.date, fields.time), timestamp);
    }
    assert.deepEqual(localDateTimeFields(1792105200000), { date: "2026-10-16", time: "00:00" });
  } finally {
    if (originalTZ === undefined) delete process.env.TZ;
    else process.env.TZ = originalTZ;
  }
});

test("editor round trips use one timezone for both fields", () => {
  const originalTZ = process.env.TZ;
  try {
    for (const zone of ["UTC", "Europe/Lisbon", "America/New_York", "Asia/Tokyo"]) {
      process.env.TZ = zone;
      const timestamp = Date.parse("2026-10-15T23:00:00Z");
      const fields = localDateTimeFields(timestamp);
      assert.equal(combineLocalDateTime(fields.date, fields.time), timestamp, zone);
    }
  } finally {
    if (originalTZ === undefined) delete process.env.TZ;
    else process.env.TZ = originalTZ;
  }
});

test("private pickup requires a chosen date and valid hour", () => {
  const start = new Date(2026, 9, 16, 0).getTime();
  const end = new Date(2026, 9, 25, 23, 55).getTime();
  for (const selection of [{ date: null, time: null }, { date: new Date(start), time: null }, { date: new Date(start), time: "24:00" }, { date: new Date(NaN), time: "10:00" }]) {
    assert.equal(validEventSelection(selection, start, end), false);
  }
  assert.equal(validEventSelection({ date: new Date(2026, 9, 20), time: "10:30" }, start, end), true);
});

test("private pickup stays inside the event period, including the boundary times", () => {
  const start = new Date(2026, 9, 16, 8).getTime();
  const end = new Date(2026, 9, 25, 20).getTime();
  for (const [date, time, expected] of [[15,"12:00",false], [16,"07:55",false], [16,"08:00",true], [25,"20:00",true], [25,"20:05",false], [26,"10:00",false]]) {
    assert.equal(validEventSelection({ date: new Date(2026, 9, date), time }, start, end), expected);
  }
});

test("a single-day event remains bookable that day, without opening subsequent dates", () => {
  const start = new Date(2026, 9, 16, 8).getTime();
  assert.equal(eventBookingEnd(start), new Date(2026, 9, 16, 23, 59, 59, 999).getTime());
  assert.equal(validEventSelection({ date: new Date(2026, 9, 16), time: "23:55" }, start), true);
  assert.equal(validEventSelection({ date: new Date(2026, 9, 17), time: "08:00" }, start), false);
});

test("the selected pickup hour overrides any previous midnight carried by the date", () => {
  assert.equal(eventSelectionTimestamp({ date: new Date(2026, 9, 20), time: "14:35" }), new Date(2026, 9, 20, 14, 35).getTime());
});

test("calendar and clock selections clamp only at their date/time boundaries", () => {
  const min = new Date(2026, 9, 16, 8, 30);
  const max = new Date(2026, 9, 25, 20, 15);
  assert.equal(clampDateTime(new Date(2026, 9, 16, 0), min, max).getTime(), min.getTime());
  assert.equal(clampDateTime(new Date(2026, 9, 25, 22), min, max).getTime(), max.getTime());
  const middle = new Date(2026, 9, 20, 14, 35);
  assert.equal(clampDateTime(middle, min, max).getTime(), middle.getTime());
});
