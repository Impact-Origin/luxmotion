/** Keep the date and time in the same local timezone when editing a timestamp. */
export function localDateTimeFields(timestamp: number) {
  const date = new Date(timestamp)
  const pad = (value: number) => String(value).padStart(2, "0")
  return {
    date: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    time: `${pad(date.getHours())}:${pad(date.getMinutes())}`,
  }
}

export function combineLocalDateTime(date: string, time: string): number | undefined {
  if (!date) return undefined
  return new Date(`${date}T${time || "00:00"}`).getTime()
}

/** An event without an end date is bookable on its start day. */
export function eventBookingEnd(start: number, end?: number): number {
  if (end !== undefined) return end
  const date = new Date(start)
  date.setHours(23, 59, 59, 999)
  return date.getTime()
}

export function eventSelectionTimestamp(selection: { date: Date | null; time: string | null }): number | null {
  if (!selection.date || !selection.time || !/^([01]\d|2[0-3]):[0-5]\d$/.test(selection.time)) return null
  const [hours, minutes] = selection.time.split(":").map(Number)
  const date = new Date(selection.date)
  date.setHours(hours!, minutes!, 0, 0)
  return Number.isFinite(date.getTime()) ? date.getTime() : null
}

export function validEventSelection(selection: { date: Date | null; time: string | null }, start: number, end?: number) {
  const timestamp = eventSelectionTimestamp(selection)
  return timestamp !== null && timestamp >= start && timestamp <= eventBookingEnd(start, end)
}

export function clampDateTime(date: Date, min: Date, max?: Date): Date {
  return new Date(Math.min(max?.getTime() ?? Infinity, Math.max(min.getTime(), date.getTime())))
}
