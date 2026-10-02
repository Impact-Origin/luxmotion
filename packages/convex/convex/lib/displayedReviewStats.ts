/** Stable pseudo-random display values. Using the record ID keeps cards,
 * details, translations and the admin consistent without stored overrides. */
function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index++) {
    result = Math.imul(result ^ value.charCodeAt(index), 16777619);
  }
  return result >>> 0;
}

export function displayedReviewStats(id: string) {
  return {
    reviewCount: 101 + (hash(`review-count:${id}`) % 649),
    rating: (46 + (hash(`review-rating:${id}`) % 4)) / 10,
  };
}

export function withDisplayedReviewStats<
  T extends { _id: string; reviewCount?: number; rating?: number },
>(item: T): T & {
  baseReviewCount: number;
  baseRating: number;
  reviewCount: number;
  rating: number;
} {
  return {
    ...item,
    baseReviewCount: item.reviewCount ?? 0,
    baseRating: item.rating ?? 0,
    ...displayedReviewStats(item._id),
  };
}
