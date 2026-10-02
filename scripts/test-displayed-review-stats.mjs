// Run: node --experimental-strip-types --test scripts/test-displayed-review-stats.mjs
import assert from "node:assert/strict";
import { test } from "node:test";
import { displayedReviewStats, withDisplayedReviewStats } from "../packages/convex/convex/lib/displayedReviewStats.ts";

test("counts stay in the inclusive 101–749 range and ratings in 4.6–4.9", () => {
  const counts = new Set();
  const ratings = new Set();
  for (let index = 0; index < 10000; index++) {
    const { reviewCount, rating } = displayedReviewStats(`record-${index}`);
    assert.ok(Number.isInteger(reviewCount) && reviewCount >= 101 && reviewCount <= 749);
    assert.ok([4.6, 4.7, 4.8, 4.9].includes(rating));
    counts.add(reviewCount);
    ratings.add(rating);
  }
  assert.ok(counts.has(101) && counts.has(749));
  assert.equal(counts.size, 649);
  assert.deepEqual([...ratings].sort(), [4.6, 4.7, 4.8, 4.9]);
});

test("one item has the same display values across calls and translated titles", () => {
  const source = { _id: "stable-item", title: "Sintra tour", reviewCount: 5, rating: 4.2 };
  const first = withDisplayedReviewStats(source);
  const translated = withDisplayedReviewStats({ ...source, title: "Visita a Sintra" });
  assert.equal(first.reviewCount, translated.reviewCount);
  assert.equal(first.rating, translated.rating);
  assert.deepEqual(displayedReviewStats(source._id), displayedReviewStats(source._id));
  assert.equal(source.reviewCount, 5);
  assert.equal(source.rating, 4.2);
});

test("manual overrides and actual review changes cannot edit display values", () => {
  const source = { _id: "unchangeable-item", reviewCount: 5, rating: 4.1, manualReviewCount: 20000 };
  const display = withDisplayedReviewStats(source);
  assert.deepEqual({ reviewCount: display.reviewCount, rating: display.rating }, displayedReviewStats(source._id));
  const updated = withDisplayedReviewStats({ ...source, reviewCount: 1000, rating: 5, manualReviewCount: 0 });
  assert.equal(display.reviewCount, updated.reviewCount);
  assert.equal(display.rating, updated.rating);
  assert.equal(display.baseReviewCount, 5);
  assert.equal(display.baseRating, 4.1);
  assert.equal(updated.baseReviewCount, 1000);
  assert.equal(updated.baseRating, 5);
});

test("new items need no review fields or manual setup", () => {
  const item = withDisplayedReviewStats({ _id: "brand-new-item" });
  assert.equal(item.baseReviewCount, 0);
  assert.equal(item.baseRating, 0);
  assert.ok(item.reviewCount >= 101 && item.reviewCount <= 749);
  assert.ok(item.rating >= 4.6 && item.rating <= 4.9);
});
