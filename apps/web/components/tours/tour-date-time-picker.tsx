"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Calendar, Clock, X } from "lucide-react"
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
        "pt-4 border-t border-[#e5e7eb]",
        !isMobile && "pt-0 border-t-0 border-l pl-5 min-h-[332px] flex flex-col"
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-[#27c7ff]" />
        <span className="text-[14px] font-semibold text-[#222222]">
          {t("selectTime")}
        </span>
      </div>

      {!selectedDate && (
        <div className="flex-1 min-h-[140px] rounded-2xl border border-dashed border-[#dbe4ea] bg-[#f8fafc] px-4 py-6 text-[14px] text-[#9ca3af]">
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
                  "w-full px-3 py-2.5 rounded-xl text-[13px] font-medium text-center whitespace-nowrap transition-all",
                  selectedTime === slot.startTime
                    ? "bg-[#27c7ff] text-white shadow-md shadow-[#27c7ff]/30"
                    : "bg-[#f3f4f6] text-[#222222] hover:bg-[#27c7ff]/10 hover:text-[#27c7ff]"
                )}
              >
                {slot.startTime}
                {slot.endTime && ` - ${slot.endTime}`}
              </button>
            ))}
          </div>

          {selectedDateAvailability.isSpecial && selectedDateAvailability.reason && (
            <p className="text-[12px] text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg">
              {selectedDateAvailability.reason}
            </p>
          )}
        </div>
      )}

      {selectedDate && (!selectedDateAvailability || selectedDateSlots.length === 0) && !isLoading && (
        <div className="flex-1 min-h-[140px] rounded-2xl border border-dashed border-[#dbe4ea] bg-[#f8fafc] px-4 py-6 text-[14px] text-[#9ca3af]">
          {t("noTimesAvailable")}
        </div>
      )}
    </div>
  )

  const pickerContent = (
    <div className={cn("p-4 overflow-y-auto", isMobile ? "px-2" : "max-h-[80vh]")}>
      <div className={cn(!isMobile && "grid grid-cols-[320px_minmax(240px,1fr)] gap-5 items-start")}>
        <div>
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={handlePrevMonth}
              disabled={!canNavigateToPrevMonth()}
              className={cn(
                "w-8 h-8 flex items-center justify-center transition-colors rounded-full",
                canNavigateToPrevMonth()
                  ? "text-[#9ca3af] hover:text-[#6b7280] hover:bg-gray-100"
                  : "text-[#e5e7eb] cursor-not-allowed"
              )}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1">
              <span className="text-[15px] font-semibold text-[#222222]">
                {months[viewMonth]} {viewYear}
              </span>
              <div className="flex flex-col -space-y-1 ml-1">
                <button
                  type="button"
                  onClick={handleNextYear}
                  className="text-[#9ca3af] hover:text-[#6b7280] transition-colors p-0.5"
                >
                  <ChevronUp className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={handlePrevYear}
                  disabled={!canNavigateToPrevYear()}
                  className={cn(
                    "transition-colors p-0.5",
                    canNavigateToPrevYear()
                      ? "text-[#9ca3af] hover:text-[#6b7280]"
                      : "text-[#e5e7eb] cursor-not-allowed"
                  )}
                >
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="w-8 h-8 flex items-center justify-center text-[#9ca3af] hover:text-[#6b7280] hover:bg-gray-100 transition-colors rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 mb-2">
            {DAYS.map((day) => (
              <div
                key={day}
                className="h-8 flex items-center justify-center text-[13px] font-medium text-[#9ca3af]"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((item, index) => {
              const isPast = isDateInPast(item.date)
              const isAvailable = isDateAvailable(item.date)
              const isSelected = isDateSelected(item.date)
              const isToday = isDateToday(item.date)
              const dayAvailability = getAvailabilityForDate(item.date)
              const isSpecial = dayAvailability?.isSpecial || dayAvailability?.isRescheduled

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => isAvailable && handleDateSelect(item.date)}
                  disabled={!isAvailable}
                  className={cn(
                    "h-10 w-10 flex items-center justify-center text-[14px] transition-all rounded-full relative",
                    !item.isCurrentMonth && "opacity-40",
                    isPast || !isAvailable
                      ? "text-[#d1d5db] cursor-not-allowed"
                      : isSelected
                      ? "bg-[#27c7ff] text-white font-semibold shadow-md shadow-[#27c7ff]/30"
                      : isToday
                      ? "text-[#27c7ff] font-semibold ring-2 ring-[#27c7ff] ring-inset"
                      : isAvailable
                      ? "text-[#222222] hover:bg-[#27c7ff]/10 font-medium"
                      : "text-[#d1d5db]"
                  )}
                >
                  {item.day}
                  {isAvailable && !isSelected && (
                    <span className={cn(
                      "absolute bottom-1 w-1 h-1 rounded-full",
                      isSpecial ? "bg-amber-400" : "bg-[#27c7ff]"
                    )} />
                  )}
                </button>
              )
            })}
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <div className="w-5 h-5 border-2 border-[#27c7ff] border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {timePanel}
      </div>

      {isMobile && selectedDate && selectedTime && (
        <button
          onClick={() => setOpen(false)}
          className="w-full mt-6 bg-[#27c7ff] text-white py-3.5 rounded-xl font-bold active:bg-[#20aadd] transition-colors shadow-lg shadow-[#27c7ff]/20"
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
        "w-full h-[47px] px-4 border rounded-[12px] bg-white flex items-center gap-3 transition-all",
        displayValue
          ? "border-[#27c7ff] text-[#222222]"
          : "border-[#dedede] text-[#9ca3af]",
        "hover:border-[#27c7ff] focus:outline-none focus:ring-2 focus:ring-[#27c7ff]/20 focus:border-[#27c7ff]"
      )}
    >
      <Calendar className={cn(
        "w-5 h-5 shrink-0",
        displayValue ? "text-[#27c7ff]" : "text-[#bfbfbf]"
      )} />
      <span className="flex-1 text-left text-[15px]">
        {displayValue || t("selectDateAndTime")}
      </span>
      {displayValue && (
        <X
          className="w-5 h-5 text-[#bfbfbf] hover:text-[#808080] shrink-0"
          onClick={(e) => {
            e.stopPropagation()
            setSelectedDate(null)
            setSelectedTime(null)
            onChange?.({ date: null, time: null })
          }}
        />
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
        className="max-h-[80vh] overflow-hidden p-0 bg-white border-[#e0e0e0] rounded-xl shadow-xl"
        align="start"
        sideOffset={8}
        style={{
          width: "var(--radix-popover-trigger-width)",
          maxWidth: "calc(100vw - 2rem)",
        }}
      >
        {pickerContent}
      </PopoverContent>
    </Popover>
  )
}
