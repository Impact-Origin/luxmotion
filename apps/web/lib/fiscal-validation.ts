export function isValidIban(raw: string): boolean {
  const v = raw.replace(/\s/g, "").toUpperCase()
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(v)) return false
  const rearranged = v.slice(4) + v.slice(0, 4)
  const expanded = rearranged.replace(/[A-Z]/g, (c) => (c.charCodeAt(0) - 55).toString())
  let remainder = 0
  for (let i = 0; i < expanded.length; i++) {
    remainder = (remainder * 10 + (expanded.charCodeAt(i) - 48)) % 97
  }
  return remainder === 1
}

export function isValidBic(raw: string): boolean {
  return /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(raw.replace(/\s/g, "").toUpperCase())
}

export function isValidPtNif(raw: string): boolean {
  const v = raw.replace(/\s/g, "")
  if (!/^\d{9}$/.test(v)) return false
  const digits = v.split("").map(Number)
  if (digits[0] === 0) return false
  let sum = 0
  for (let i = 0; i < 8; i++) sum += digits[i]! * (9 - i)
  let check = 11 - (sum % 11)
  if (check >= 10) check = 0
  return check === digits[8]
}
