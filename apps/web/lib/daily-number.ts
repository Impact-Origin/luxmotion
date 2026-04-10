/**
 * Generate a deterministic random number between 0 and 1 based on a seed string.
 */
function seededRandom(seed: string): number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash) / 2147483647
}

/**
 * Get a number that changes daily, deterministic per day.
 * Use seedSuffix to get different numbers for different contexts (e.g. "tours" vs hero).
 * @param seedSuffix Optional suffix to differentiate contexts (e.g. "tours" gives different number than hero)
 * @param min Minimum value (inclusive)
 * @param max Maximum value (inclusive)
 */
export function getDailyNumber(
  seedSuffix = "",
  min = 90,
  max = 150
): number {
  const today = new Date().toISOString().split("T")[0] ?? ""
  const seed = today + seedSuffix
  const random = seededRandom(seed)
  return Math.floor(min + random * (max - min + 1))
}
