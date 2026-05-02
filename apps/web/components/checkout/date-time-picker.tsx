"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Clock, X } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover"
import { CalendarIcon } from "lucide-react"
import Image from "next/image"
import { useIsMobile } from "@/hooks/use-is-mobile"
import { MobileDrawer } from "../ui/mobile-drawer"
import { cn } from "@workspace/ui/lib/utils"
import { ClockTimePicker } from "@/components/ui/clock-time-picker"
import { ClockTimePicker as ClockTimePickerDark } from "@/components/new-landing-page/booking/clock-time-picker"

interface DateTimePickerProps {
  value?: Date | string | number | null
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  label?: string
  variant?: "default" | "widget" | "new-widget" | "quote"
  hideLeftIcon?: boolean
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]

export function DateTimePicker({ value, onChange, placeholder = "Partida", label = "Partida", variant = "default", hideLeftIcon = false }: DateTimePickerProps) {
  const normalizedValue = React.useMemo(() => {
    if (!value) return undefined
    if (value instanceof Date) return value
    const d = new Date(value)
    return Number.isFinite(d.getTime()) ? d : undefined
  }, [value])

  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(normalizedValue)
  const [hours, setHours] = React.useState(0)
  const [minutes, setMinutes] = React.useState(0)
  const [viewMonth, setViewMonth] = React.useState(normalizedValue ? normalizedValue.getMonth() : new Date().getMonth())
  const [viewYear, setViewYear] = React.useState(normalizedValue ? normalizedValue.getFullYear() : new Date().getFullYear())

  const [hoursInput, setHoursInput] = React.useState("")
  const [minutesInput, setMinutesInput] = React.useState("")
  const [isHoursFocused, setIsHoursFocused] = React.useState(false)
  const [isMinutesFocused, setIsMinutesFocused] = React.useState(false)
  const [showClockPicker, setShowClockPicker] = React.useState(false)
  const minutesInputRef = React.useRef<HTMLInputElement>(null)

  const isMobile = useIsMobile()

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  React.useEffect(() => {
    if (normalizedValue) {
      setDate(normalizedValue)
      setHours(normalizedValue.getHours())
      setMinutes(normalizedValue.getMinutes())
      setViewMonth(normalizedValue.getMonth())
      setViewYear(normalizedValue.getFullYear())
    }
  }, [normalizedValue])

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

  const handleDateSelect = (selectedDate: Date) => {
    setDate(selectedDate)
    const newDate = new Date(selectedDate)
    
    const isToday = selectedDate.getFullYear() === today.getFullYear() &&
                    selectedDate.getMonth() === today.getMonth() &&
                    selectedDate.getDate() === today.getDate()
    
    let validHours = hours
    let validMinutes = minutes
    
    if (isToday) {
      const minHour = now.getHours()
      const minMinute = now.getMinutes()
      
      if (validHours < minHour) {
        validHours = minHour
        validMinutes = minMinute
      } else if (validHours === minHour && validMinutes < minMinute) {
        validMinutes = minMinute
      }
      
      setHours(validHours)
      setMinutes(validMinutes)
    }
    
    newDate.setHours(validHours, validMinutes)
    onChange?.(newDate)
  }

  const handleTimeChange = (newHours: number, newMinutes: number) => {
    let validHours = newHours
    let validMinutes = newMinutes
    
    if (isSelectedDateToday()) {
      const minHour = now.getHours()
      const minMinute = now.getMinutes()
      
      if (validHours < minHour) {
        validHours = minHour
        validMinutes = minMinute
      } else if (validHours === minHour && validMinutes < minMinute) {
        validMinutes = minMinute
      }
    }
    
    setHours(validHours)
    setMinutes(validMinutes)
    if (date) {
      const newDate = new Date(date)
      newDate.setHours(validHours, validMinutes)
      onChange?.(newDate)
    }
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setDate(undefined)
    setHours(0)
    setMinutes(0)
    onChange?.(undefined)
  }

  const formatDisplay = () => {
    if (!date) return ""
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = String(date.getFullYear())
    const h = String(hours).padStart(2, "0")
    const m = String(minutes).padStart(2, "0")
    return `${day}/${month}/${year} - ${h}:${m}`
  }

  const isDateSelected = (d: Date) => {
    if (!date) return false
    return d.getFullYear() === date.getFullYear() &&
           d.getMonth() === date.getMonth() &&
           d.getDate() === date.getDate()
  }

  const isDateToday = (d: Date) => {
    return d.getFullYear() === today.getFullYear() &&
           d.getMonth() === today.getMonth() &&
           d.getDate() === today.getDate()
  }

  const isDateInPast = (d: Date) => {
    const dateOnly = new Date(d.getFullYear(), d.getMonth(), d.getDate())
    return dateOnly < today
  }

  const isSelectedDateToday = () => {
    if (!date) return false
    return date.getFullYear() === today.getFullYear() &&
           date.getMonth() === today.getMonth() &&
           date.getDate() === today.getDate()
  }

  const calendarDays = generateCalendarDays()

  const isWidget = variant === "widget"
  const isNewWidget = variant === "new-widget"
  const isQuote = variant === "quote"

  const dark = isNewWidget

  const pickerContent = (
    <div className={cn("p-4 overflow-y-auto", isMobile && "px-0")}>
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={handlePrevMonth}
          disabled={!canNavigateToPrevMonth()}
          className={`w-8 h-8 flex items-center justify-center transition-colors ${
            canNavigateToPrevMonth()
              ? dark ? "text-[rgba(255,255,255,0.5)] hover:text-white" : "text-[#9ca3af] hover:text-[#6b7280]"
              : dark ? "text-[rgba(255,255,255,0.15)] cursor-not-allowed" : "text-[#e5e7eb] cursor-not-allowed"
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1">
          <span className={cn("text-[15px] font-medium", dark ? "text-white" : "text-[#222222]")}>
            {MONTHS[viewMonth]} {viewYear}
          </span>
          <div className="flex flex-col -space-y-1 ml-1">
            <button
              type="button"
              onClick={handleNextYear}
              className={cn("transition-colors p-0.5", dark ? "text-[rgba(255,255,255,0.5)] hover:text-white" : "text-[#9ca3af] hover:text-[#6b7280]")}
            >
              <ChevronUp className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={handlePrevYear}
              disabled={!canNavigateToPrevYear()}
              className={`transition-colors p-0.5 ${
                canNavigateToPrevYear()
                  ? dark ? "text-[rgba(255,255,255,0.5)] hover:text-white" : "text-[#9ca3af] hover:text-[#6b7280]"
                  : dark ? "text-[rgba(255,255,255,0.15)] cursor-not-allowed" : "text-[#e5e7eb] cursor-not-allowed"
              }`}
            >
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleNextMonth}
          className={cn("w-8 h-8 flex items-center justify-center transition-colors", dark ? "text-[rgba(255,255,255,0.5)] hover:text-white" : "text-[#9ca3af] hover:text-[#6b7280]")}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {DAYS.map((day) => (
          <div
            key={day}
            className={cn("h-8 flex items-center justify-center text-[13px] font-medium", dark ? "text-[rgba(255,255,255,0.4)]" : "text-[#9ca3af]")}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {calendarDays.map((item, index) => {
          const isPast = isDateInPast(item.date)
          return (
            <button
              key={index}
              type="button"
              onClick={() => !isPast && handleDateSelect(item.date)}
              disabled={isPast}
              className={`h-9 flex items-center justify-center text-[14px] transition-colors ${isQuote ? "rounded-none" : "rounded-lg"} ${
                isPast
                  ? dark ? "text-[rgba(255,255,255,0.15)] cursor-not-allowed" : "text-[#d1d5db] cursor-not-allowed"
                  : isDateSelected(item.date)
                  ? dark ? "bg-[#C9A96E] text-[#0D0D0D] font-semibold" : isQuote ? "bg-[#a08248] text-white font-semibold" : "bg-[#27c7ff] text-white font-semibold"
                  : isDateToday(item.date)
                  ? dark ? "text-[#C9A96E] font-semibold hover:bg-[rgba(255,255,255,0.08)]" : isQuote ? "text-[#a08248] font-semibold hover:bg-[rgba(168,131,58,0.08)]" : "text-[#27c7ff] font-semibold hover:bg-[#f3f4f6]"
                  : item.isCurrentMonth
                  ? dark ? "text-white hover:bg-[rgba(255,255,255,0.08)]" : isQuote ? "text-[#1a1612] hover:bg-[rgba(168,131,58,0.06)]" : "text-[#222222] hover:bg-[#f3f4f6]"
                  : dark ? "text-[rgba(255,255,255,0.25)] hover:bg-[rgba(255,255,255,0.05)]" : "text-[#d1d5db] hover:bg-[#f3f4f6]"
              }`}
            >
              {item.day}
            </button>
          )
        })}
      </div>

      <div className={cn("border-t my-4", dark ? "border-[rgba(255,255,255,0.08)]" : "border-[#e5e7eb]")} />

      <div>
        <label className={cn("block text-[15px] font-semibold mb-2", dark ? "text-white" : "text-[#222222]")}>
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowClockPicker(true)}
          className={cn(
            "flex items-center w-full h-12 px-3 border transition-colors",
            isQuote ? "rounded-none" : "rounded-lg",
            dark
              ? "border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.25)]"
              : isQuote
              ? "border-[rgba(154,117,53,0.22)] bg-[#faf7f2] hover:border-[#a08248]"
              : "border-[#e0e0e0] bg-white hover:border-[#bfbfbf]"
          )}
        >
          <Clock className={cn("w-5 h-5 flex-shrink-0", dark ? "text-[#C9A96E]" : isQuote ? "text-[#a08248]" : "text-[#27c7ff]")} />
          <div className="flex items-center flex-1 ml-2">
            <span className={cn("text-[15px]", dark ? "text-white" : "text-[#222222]")}>
              {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}
            </span>
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation()
              handleTimeChange(0, 0)
            }}
            className={cn("transition-colors ml-2 cursor-pointer", dark ? "text-[rgba(255,255,255,0.4)] hover:text-white" : "text-[#9ca3af] hover:text-[#6b7280]")}
          >
            <X className="w-4 h-4" />
          </div>
        </button>
      </div>

      {isMobile && (
        <button
          onClick={() => setOpen(false)}
          className={cn(
            "w-full mt-6 py-3.5 font-bold transition-colors",
            isQuote ? "rounded-none uppercase tracking-[1.1px] text-[14px]" : "rounded-xl",
            dark
              ? "bg-[#C9A96E] text-[#0D0D0D] active:brightness-90"
              : isQuote
              ? "bg-[#a08248] text-white active:bg-[#8a6f3c]"
              : "bg-[#29C5F6] text-white active:bg-[#20aadd] shadow-lg shadow-[#29C5F6]/20"
          )}
        >
          Confirm
        </button>
      )}
    </div>
  )

  const ClockComponent = dark ? ClockTimePickerDark : ClockTimePicker

  const clockPickerContent = (
    <ClockComponent
      value={{ hours, minutes }}
      onChange={(time) => handleTimeChange(time.hours, time.minutes)}
      onCancel={() => setShowClockPicker(false)}
      onConfirm={() => setShowClockPicker(false)}
      minTime={isSelectedDateToday() ? { hours: now.getHours(), minutes: now.getMinutes() } : undefined}
      headline="Select time"
      {...(isQuote && !dark ? { luxmotion: true } : {})}
    />
  )

  const trigger = (
    <button
      type="button"
      className={
        isQuote
          ? `w-full h-[44px] px-3 bg-[#faf7f2] border border-[rgba(154,117,53,0.22)] flex items-center gap-2 transition-colors hover:border-[#a08248] focus:outline-none focus:border-[#a08248] ${
              date ? "text-[#0d0d0d]" : "text-[#999]"
            }`
          : isNewWidget
          ? `w-full h-full px-0 py-0 bg-transparent border-0 flex items-center gap-2 focus:outline-none focus:ring-0 cursor-pointer`
          : isWidget
          ? `w-full h-full px-6 py-4 md:py-3 bg-transparent border-0 flex items-center gap-3 focus:outline-none focus:ring-0 hover:bg-zinc-50/50 transition-colors`
          : `w-full h-12 px-4 border border-[#e0e0e0] rounded-lg bg-white flex items-center gap-3 transition-all hover:border-[#bfbfbf] focus:outline-none focus:ring-2 focus:ring-[#27c7ff] focus:border-[#27c7ff] ${
              date ? "text-[#222222]" : "text-[#a2a2a2]"
            }`
      }
      style={isNewWidget ? {
        color: date ? "white" : "#696969"
      } : isWidget ? {
        color: date ? "#222" : "#808080"
      } : undefined}
    >
      {isQuote ? (
        !hideLeftIcon && <CalendarIcon className="w-4 h-4 flex-shrink-0 text-[#a08248]" strokeWidth={2} />
      ) : isNewWidget ? (
        !hideLeftIcon && <CalendarIcon className="w-6 h-6 flex-shrink-0" strokeWidth={2} style={{ color: "#C9A96E" }} />
      ) : isWidget ? (
        <div
          data-theme-color="heroBookingIcon"
          className="w-5 h-5 flex-shrink-0 calendar-arrow-icon"
          role="img"
          aria-label="Calendar arrow right"
          style={{ color: "var(--theme-hero-booking-icon, #27C7FF)" }}
        />
      ) : (
        <CalendarIcon className="w-5 h-5 flex-shrink-0 text-[#bfbfbf]" strokeWidth={2.5} />
      )}
      <span className={`flex-1 text-left ${isQuote ? "text-[14px] leading-none" : isNewWidget ? "text-[14px] font-normal leading-tight" : isWidget ? "text-[15px] font-medium leading-tight" : "text-[15px]"}`}>
        {date ? formatDisplay() : placeholder}
      </span>
      {date && !isWidget && !isNewWidget && !isQuote && (
        <X
          className="w-5 h-5 text-[#bfbfbf] hover:text-[#808080] flex-shrink-0"
          onClick={handleClear}
        />
      )}
      {date && isQuote && (
        <X
          className="w-4 h-4 text-[#999] hover:text-[#0d0d0d] flex-shrink-0"
          onClick={handleClear}
        />
      )}
    </button>
  )

  if (isMobile) {
    return (
      <MobileDrawer
        open={open}
        onOpenChange={(newOpen) => {
          setOpen(newOpen)
          if (!newOpen) setShowClockPicker(false)
        }}
        trigger={trigger}
        title={showClockPicker ? "Select time" : placeholder}
      >
        <div className="relative overflow-hidden">
          <div
            className={cn(
              "transition-all duration-300 ease-out",
              showClockPicker
                ? "opacity-0 -translate-x-full absolute inset-0 pointer-events-none"
                : "opacity-100 translate-x-0"
            )}
          >
            {pickerContent}
          </div>
          <div
            className={cn(
              "transition-all duration-300 ease-out",
              showClockPicker
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-full absolute inset-0 pointer-events-none"
            )}
          >
            {clockPickerContent}
          </div>
        </div>
      </MobileDrawer>
    )
  }

  return (
    <Popover open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen)
      if (!newOpen) setShowClockPicker(false)
    }}>
      <PopoverTrigger asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "p-0 shadow-lg overflow-hidden transition-all duration-300 ease-out",
          showClockPicker
            ? cn("w-[328px] border-0", dark ? "bg-transparent rounded-none" : isQuote ? "bg-[#faf7f2] rounded-none" : "bg-[#e9f9ff] rounded-[28px]")
            : cn(
                "w-[280px]",
                dark
                  ? "bg-[#1e1d1b] border-[rgba(255,255,255,0.12)] rounded-none"
                  : isQuote
                  ? "bg-white border-[rgba(154,117,53,0.22)] rounded-none"
                  : "bg-white border-[#e0e0e0] rounded-xl"
              )
        )}
        align="start"
        sideOffset={8}
      >
        <div className="relative">
          <div
            className={cn(
              "transition-all duration-300 ease-out",
              showClockPicker
                ? "opacity-0 scale-95 absolute inset-0 pointer-events-none"
                : "opacity-100 scale-100"
            )}
          >
            {pickerContent}
          </div>
          <div
            className={cn(
              "transition-all duration-300 ease-out",
              showClockPicker
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95 absolute inset-0 pointer-events-none"
            )}
          >
            {clockPickerContent}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

