"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, CalendarClock, Clock, X } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover"
import { useIsMobile } from "@/hooks/use-is-mobile"
import { MobileDrawer } from "../ui/mobile-drawer"
import { cn } from "@workspace/ui/lib/utils"
import { useTranslations } from "next-intl"

interface TimeSlot {
  startTime: string
  endTime?: string
}

interface DayAvailability {
  date: number
  timeSlots: TimeSlot[]
  isCancelled: boolean
  isRescheduled: boolean
  isSpecial: boolean
  reason?: string
}

interface TourDateTimePickerProps {
  value?: { date: Date | null; time: string | null }
  onChange?: (value: { date: Date | null; time: string | null }) => void
  availability: DayAvailability[]
  bookingDeadlineHours?: number
  isLoading?: boolean
  onMonthChange?: (startDate: number, endDate: number) => void
}

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]

export function TourDateTimePicker({
  value,
  onChange,
  availability,
  bookingDeadlineHours,
  isLoading,
  onMonthChange
}: TourDateTimePickerProps) {
  const t = useTranslations("tourDetails")
  const [open, setOpen] = React.useState(false)
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(value?.date || null)
  const [selectedTime, setSelectedTime] = React.useState<string | null>(value?.time || null)
  const [viewMonth, setViewMonth] = React.useState(value?.date ? value.date.getMonth() : new Date().getMonth())
  const [viewYear, setViewYear] = React.useState(value?.date ? value.date.getFullYear() : new Date().getFullYear())

  const isMobile = useIsMobile()
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  React.useEffect(() => {
    if (value?.date) {
      setSelectedDate(value.date)
      setViewMonth(value.date.getMonth())
      setViewYear(value.date.getFullYear())
    }
    if (value?.time) {
      setSelectedTime(value.time)
    }
  }, [value])

  React.useEffect(() => {
    if (onMonthChange) {
      const startDate = Date.UTC(viewYear, viewMonth, 1)
      const endDate = Date.UTC(viewYear, viewMonth + 1, 0, 23, 59, 59, 999)
      onMonthChange(startDate, endDate)
    }
  }, [viewMonth, viewYear, onMonthChange])

  const availabilityMap = React.useMemo(() => {
    const map = new Map<string, DayAvailability>()
    availability.forEach(day => {
      const d = new Date(day.date)
      const key = `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`
      map.set(key, day)
    })
    return map
  }, [availability])

  const getAvailabilityForDate = (date: Date): DayAvailability | undefined => {
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
    return availabilityMap.get(key)
  }

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: number, year: number) => {
    return (new Date(year, month, 1).getDay() + 6) % 7
  }

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(viewMonth, viewYear)
    const firstDay = getFirstDayOfMonth(viewMonth, viewYear)
    const days: { day: number; isCurrentMonth: boolean; date: Date }[] = []

    const prevMonth = viewMonth === 0 ? 11 : viewMonth - 1
    const prevYear = viewMonth === 0 ? viewYear - 1 : viewYear
    const daysInPrevMonth = getDaysInMonth(prevMonth, prevYear)

    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i
      days.push({
        day,
        isCurrentMonth: false,
        date: new Date(prevYear, prevMonth, day)
      })
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(viewYear, viewMonth, i)
      })
    }

    const remainingDays = 42 - days.length
    const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1
    const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear

    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(nextYear, nextMonth, i)
      })
    }

    return days
  }

  const canNavigateToPrevMonth = () => {
    if (viewYear > now.getFullYear()) return true
    if (viewYear === now.getFullYear() && viewMonth > now.getMonth()) return true
    return false
  }

  const canNavigateToPrevYear = () => {
    return viewYear > now.getFullYear()
  }

  const handlePrevMonth = () => {
    if (!canNavigateToPrevMonth()) return
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear(viewYear - 1)
    } else {
      setViewMonth(viewMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear(viewYear + 1)
    } else {
      setViewMonth(viewMonth + 1)
    }
  }

  const handlePrevYear = () => {
    if (!canNavigateToPrevYear()) return
    setViewYear(viewYear - 1)
  }

  const handleNextYear = () => {
    setViewYear(viewYear + 1)
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setSelectedTime(null)
    onChange?.({ date, time: null })
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    onChange?.({ date: selectedDate, time })
    if (!isMobile) {
      setOpen(false)
    }
  }

  const isDateInPast = (d: Date) => {
    const dateOnly = new Date(d.getFullYear(), d.getMonth(), d.getDate())
    return dateOnly < today
  }

  const isDateToday = (d: Date) => {
    return d.getFullYear() === today.getFullYear() &&
           d.getMonth() === today.getMonth() &&
           d.getDate() === today.getDate()
  }

  const isDateSelected = (d: Date) => {
    if (!selectedDate) return false
    return d.getFullYear() === selectedDate.getFullYear() &&
           d.getMonth() === selectedDate.getMonth() &&
           d.getDate() === selectedDate.getDate()
  }

  const isSlotPastDeadline = (d: Date, startTime: string) => {
    if (!bookingDeadlineHours) return false
    const [hours, minutes] = startTime.split(":").map(Number)
    const slotDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), hours, minutes)
    const deadlineMs = bookingDeadlineHours * 60 * 60 * 1000
    return slotDate.getTime() - Date.now() < deadlineMs
  }

  const getBookableSlots = (d: Date, slots: TimeSlot[]) => {
    if (!bookingDeadlineHours) return slots
    return slots.filter(slot => !isSlotPastDeadline(d, slot.startTime))
  }

  const isDateAvailable = (d: Date) => {
    if (isDateInPast(d)) return false
    const availability = getAvailabilityForDate(d)
    if (!availability) return false
    if (availability.isCancelled) return false
    return getBookableSlots(d, availability.timeSlots).length > 0
  }

  const selectedDateAvailability = selectedDate ? getAvailabilityForDate(selectedDate) : null
  const selectedDateSlots =
    selectedDate && selectedDateAvailability
      ? getBookableSlots(selectedDate, selectedDateAvailability.timeSlots)
      : []

  const formatDisplayDate = () => {
    if (!selectedDate) return null
    const day = String(selectedDate.getDate()).padStart(2, "0")
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0")
    const year = selectedDate.getFullYear()
    return `${day}/${month}/${year}`
  }

  const calendarDays = generateCalendarDays()

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const timePanel = (
    <div
      className={cn(
        "pt-4 border-t border-[rgba(255,255,255,0.08)]",
        !isMobile && "pt-0 border-t-0 border-l border-[rgba(255,255,255,0.08)] pl-5 min-h-[332px] flex flex-col"
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-[#C9A96E]" />
        <span className="text-[12px] font-semibold text-[#f7f4ef] tracking-[1.35px] uppercase">
          {t("selectTime")}
        </span>
      </div>

      {!selectedDate && (
        <div className="flex-1 min-h-[140px] border border-dashed border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.02)] px-4 py-6 text-[13px] text-[rgba(247,244,239,0.5)]">
          {t("selectDateAndTime")}
        </div>
      )}

      {selectedDate && selectedDateAvailability && selectedDateSlots.length > 0 && (
        <div className={cn("space-y-3", !isMobile && "flex-1 min-h-0")}>
          <div
            className={cn(
              "grid gap-2",
              isMobile ? "grid-cols-1" : "grid-cols-2 max-h-[320px] overflow-y-auto pr-1 content-start"
            )}
          >
            {selectedDateSlots.map((slot, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleTimeSelect(slot.startTime)}
                className={cn(
                  "w-full px-3 py-2.5 text-[13px] font-medium text-center whitespace-nowrap transition-colors border",
                  selectedTime === slot.startTime
                    ? "bg-[rgba(201,169,110,0.12)] border-[#C9A96E] text-[#C9A96E]"
                    : "bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)] text-[rgba(247,244,239,0.75)] hover:border-[rgba(201,169,110,0.4)] hover:text-[#C9A96E]"
                )}
              >
                {slot.startTime}
                {slot.endTime && ` - ${slot.endTime}`}
              </button>
            ))}
          </div>

          {selectedDateAvailability.isSpecial && selectedDateAvailability.reason && (
            <p className="text-[12px] text-[#C9A96E] bg-[rgba(201,169,110,0.08)] border border-[rgba(201,169,110,0.2)] px-3 py-1.5">
              {selectedDateAvailability.reason}
            </p>
          )}
        </div>
      )}

      {selectedDate && (!selectedDateAvailability || selectedDateSlots.length === 0) && !isLoading && (
        <div className="flex-1 min-h-[140px] border border-dashed border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.02)] px-4 py-6 text-[13px] text-[rgba(247,244,239,0.5)]">
          {t("noTimesAvailable")}
        </div>
      )}
    </div>
  )

  const pickerContent = (
    <div className={cn("p-4 overflow-y-auto", isMobile ? "px-2" : "max-h-[80vh]")}>
      <div className={cn(!isMobile && "grid grid-cols-[320px_minmax(240px,1fr)] gap-5 items-start")}>
        <div>
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={handlePrevMonth}
              disabled={!canNavigateToPrevMonth()}
              className={cn(
                "size-[32px] border border-[rgba(247,244,239,0.08)] flex items-center justify-center transition-colors",
                canNavigateToPrevMonth()
                  ? "text-[rgba(247,244,239,0.62)] hover:text-[#C9A96E] hover:border-[rgba(201,169,110,0.4)]"
                  : "text-[rgba(247,244,239,0.2)] cursor-not-allowed"
              )}
            >
              <ChevronLeft className="size-[14px]" />
            </button>

            <div className="flex items-center gap-2">
              <span
                className="text-[18px] font-semibold text-white"
                style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif" }}
              >
                {months[viewMonth]} {viewYear}
              </span>
              <div className="flex flex-col border border-[rgba(247,244,239,0.08)]">
                <button
                  type="button"
                  onClick={handleNextYear}
                  className="px-1 text-[rgba(247,244,239,0.62)] hover:text-[#C9A96E] transition-colors"
                >
                  <ChevronUp className="size-[10px]" />
                </button>
                <button
                  type="button"
                  onClick={handlePrevYear}
                  disabled={!canNavigateToPrevYear()}
                  className={cn(
                    "px-1 transition-colors",
                    canNavigateToPrevYear()
                      ? "text-[rgba(247,244,239,0.62)] hover:text-[#C9A96E]"
                      : "text-[rgba(247,244,239,0.2)] cursor-not-allowed"
                  )}
                >
                  <ChevronDown className="size-[10px]" />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="size-[32px] border border-[rgba(247,244,239,0.08)] flex items-center justify-center text-[rgba(247,244,239,0.62)] hover:text-[#C9A96E] hover:border-[rgba(201,169,110,0.4)] transition-colors"
            >
              <ChevronRight className="size-[14px]" />
            </button>
          </div>

          <div className="grid grid-cols-7 mb-1">
            {DAYS.map((day) => (
              <div
                key={day}
                className="h-8 flex items-center justify-center text-[10px] font-bold text-[rgba(247,244,239,0.38)] tracking-[0.79px] uppercase"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {calendarDays.map((item, index) => {
              const isPast = isDateInPast(item.date)
              const isAvailable = isDateAvailable(item.date)
              const isSelected = isDateSelected(item.date)
              const isToday = isDateToday(item.date)

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => isAvailable && handleDateSelect(item.date)}
                  disabled={!isAvailable}
                  className={cn(
                    "h-10 w-full flex items-center justify-center text-[14px] transition-colors",
                    !item.isCurrentMonth && "opacity-40",
                    isPast || !isAvailable
                      ? "text-[rgba(247,244,239,0.25)] cursor-not-allowed"
                      : isSelected
                      ? "text-[#9a7535] font-bold bg-[rgba(201,169,110,0.08)]"
                      : isToday
                      ? "text-[#C9A96E] font-bold border border-[rgba(201,169,110,0.4)]"
                      : isAvailable
                      ? "text-[rgba(247,244,239,0.62)] font-medium hover:text-[#C9A96E] hover:bg-[rgba(201,169,110,0.06)]"
                      : "text-[rgba(247,244,239,0.25)]"
                  )}
                >
                  {item.day}
                </button>
              )
            })}
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <div className="w-5 h-5 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {timePanel}
      </div>

      {isMobile && selectedDate && selectedTime && (
        <button
          onClick={() => setOpen(false)}
          className="w-full mt-6 bg-[#C9A96E] text-[#0D0D0D] py-3.5 font-bold tracking-[1.1px] uppercase text-[13px] transition-colors hover:bg-[#b8954f]"
        >
          {t("confirm")}
        </button>
      )}
    </div>
  )

  const displayValue = selectedDate && selectedTime
    ? `${formatDisplayDate()} ${t("at")} ${selectedTime}`
    : selectedDate
    ? formatDisplayDate()
    : null

  const trigger = (
    <button
      type="button"
      className={cn(
        "w-full h-[44px] px-[13px] py-[14px] border border-[rgba(255,255,255,0.12)] bg-[#1E1D1B] flex items-center gap-2 transition-colors",
        "hover:border-[rgba(201,169,110,0.4)] focus:outline-none focus:border-[rgba(201,169,110,0.6)]"
      )}
    >
      <span
        className={cn(
          "flex-1 text-left text-[14px] leading-none truncate",
          displayValue ? "text-white" : "text-[#999]"
        )}
      >
        {displayValue || "00/00/00, 00:00"}
      </span>
      {displayValue ? (
        <X
          className="size-[18px] text-[#999] hover:text-white shrink-0"
          onClick={(e) => {
            e.stopPropagation()
            setSelectedDate(null)
            setSelectedTime(null)
            onChange?.({ date: null, time: null })
          }}
        />
      ) : (
        <CalendarClock className="size-6 text-[#999] shrink-0" />
      )}
    </button>
  )

  if (isMobile) {
    return (
      <MobileDrawer
        open={open}
        onOpenChange={setOpen}
        trigger={trigger}
        title={t("selectDateAndTime")}
      >
        {pickerContent}
      </MobileDrawer>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent
        className="max-h-[80vh] overflow-hidden p-0 bg-[#1e1d1b] border border-[rgba(255,255,255,0.12)] rounded-none shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6)]"
        align="start"
        sideOffset={8}
        style={{
          width: "auto",
          minWidth: "var(--radix-popover-trigger-width)",
          maxWidth: "calc(100vw - 2rem)",
        }}
      >
        {pickerContent}
      </PopoverContent>
    </Popover>
  )
}
