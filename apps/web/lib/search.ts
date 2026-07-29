const IGNORED_LOCATION_TERMS = new Set([
  "portugal",
  "portugues",
  "portuguese",
  "pt",
])

export function normalizeForSearch(value: string | null | undefined) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
}

export function getSearchTerms(query: string) {
  return normalizeForSearch(query)
    .split(/\s+/)
    .filter((term) => term.length > 1 && !IGNORED_LOCATION_TERMS.has(term))
}

export function textMatchesSearch(query: string, values: Array<string | null | undefined>) {
  const terms = getSearchTerms(query)
  if (terms.length === 0) return true

  const haystack = normalizeForSearch(values.filter(Boolean).join(" "))
  return terms.some((term) => haystack.includes(term))
}
