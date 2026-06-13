const PT_PLATE_PATTERN =
  /^([A-Z]{2}\d{4}|\d{4}[A-Z]{2}|\d{2}[A-Z]{2}\d{2}|[A-Z]{2}\d{2}[A-Z]{2})$/

function stripPlate(raw: string): string {
  return raw.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6)
}

export function formatPtPlate(raw: string): string {
  const chars = stripPlate(raw)
  return chars.replace(/(.{2})(?=.)/g, "$1-")
}

export function isValidPtPlate(raw: string): boolean {
  return PT_PLATE_PATTERN.test(stripPlate(raw))
}
