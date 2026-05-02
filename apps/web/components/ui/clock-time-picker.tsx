"use client"

import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

interface ClockTimePickerProps {
  value?: { hours: number; minutes: number }
  onChange?: (time: { hours: number; minutes: number }) => void
  onCancel?: () => void
  onConfirm?: () => void
  minTime?: { hours: number; minutes: number }
  headline?: string
  luxmotion?: boolean
}

type SelectionMode = "hours" | "minutes"
type InputMode = "dial" | "keyboard"

const CLOCK_SIZE = 256
const CLOCK_RADIUS = CLOCK_SIZE / 2
const NUMBER_RADIUS = 104

function getAngleForHour(hour: number): number {
  const normalizedHour = hour === 12 ? 0 : hour
  return normalizedHour * 30
}

function getAngleForMinute(minute: number): number {
  return (minute / 60) * 360
}

function snapToNearestFive(value: number): number {
  return Math.round(value / 5) * 5
}

function getValueFromAngle(angle: number, mode: SelectionMode): number {
  const normalizedAngle = ((angle % 360) + 360) % 360
  if (mode === "hours") {
    const hour = Math.round(normalizedAngle / 30) % 12
    return hour === 0 ? 12 : hour
  }
  const rawMinute = Math.round(normalizedAngle / 6) % 60
  return snapToNearestFive(rawMinute)
}

function getPositionForAngle(angleDeg: number, radius: number): { x: number; y: number } {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180
  return {
    x: CLOCK_RADIUS + radius * Math.cos(angleRad),
    y: CLOCK_RADIUS + radius * Math.sin(angleRad),
  }
}

export function ClockTimePicker({
  value = { hours: 7, minutes: 0 },
  onChange,
  onCancel,
  onConfirm,
  minTime,
  headline = "Select time",
  luxmotion = false,
}: ClockTimePickerProps) {
  const [selectionMode, setSelectionMode] = React.useState<SelectionMode>("hours")
  const [inputMode, setInputMode] = React.useState<InputMode>("dial")
  const [period, setPeriod] = React.useState<"AM" | "PM">(value.hours >= 12 ? "PM" : "AM")
  const [isDragging, setIsDragging] = React.useState(false)
  const [isAnimating, setIsAnimating] = React.useState(false)
  const [isModeTransitioning, setIsModeTransitioning] = React.useState(false)
  const clockRef = React.useRef<HTMLDivElement>(null)
  const hoursInputRef = React.useRef<HTMLInputElement>(null)
  const minutesInputRef = React.useRef<HTMLInputElement>(null)

  const [hoursInput, setHoursInput] = React.useState("")
  const [minutesInput, setMinutesInput] = React.useState("")
  const [isHoursFocused, setIsHoursFocused] = React.useState(false)
  const [isMinutesFocused, setIsMinutesFocused] = React.useState(false)

  const displayHour = value.hours === 0 ? 12 : value.hours > 12 ? value.hours - 12 : value.hours

  const get24Hour = (hour12: number, isPM: boolean): number => {
    if (hour12 === 12) {
      return isPM ? 12 : 0
    }
    return isPM ? hour12 + 12 : hour12
  }

  const validateAndApplyTime = (newHours: number, newMinutes: number) => {
    let validHours = newHours
    let validMinutes = newMinutes

    if (minTime) {
      if (validHours < minTime.hours) {
        validHours = minTime.hours
        validMinutes = minTime.minutes
      } else if (validHours === minTime.hours && validMinutes < minTime.minutes) {
        validMinutes = minTime.minutes
      }
    }

    onChange?.({ hours: validHours, minutes: validMinutes })
  }

  const handleClockInteraction = (clientX: number, clientY: number) => {
    if (!clockRef.current) return

    const rect = clockRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const x = clientX - centerX
    const y = clientY - centerY

    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90
    angle = ((angle % 360) + 360) % 360

    const newValue = getValueFromAngle(angle, selectionMode)

    if (selectionMode === "hours") {
      const hour24 = get24Hour(newValue, period === "PM")
      validateAndApplyTime(hour24, value.minutes)
    } else {
      let validMinutes = newValue
      if (minTime && value.hours === minTime.hours && validMinutes < minTime.minutes) {
        validMinutes = snapToNearestFive(Math.max(validMinutes, minTime.minutes))
      }
      onChange?.({ hours: value.hours, minutes: validMinutes })
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    handleClockInteraction(e.clientX, e.clientY)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleClockInteraction(e.clientX, e.clientY)
    }
  }

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false)
      if (selectionMode === "hours") {
        setIsAnimating(true)
        setTimeout(() => {
          setSelectionMode("minutes")
          setIsAnimating(false)
        }, 200)
      }
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    const touch = e.touches[0]
    if (touch) {
      handleClockInteraction(touch.clientX, touch.clientY)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      const touch = e.touches[0]
      if (touch) {
        handleClockInteraction(touch.clientX, touch.clientY)
      }
    }
  }

  const handleTouchEnd = () => {
    if (isDragging) {
      setIsDragging(false)
      if (selectionMode === "hours") {
        setIsAnimating(true)
        setTimeout(() => {
          setSelectionMode("minutes")
          setIsAnimating(false)
        }, 200)
      }
    }
  }

  React.useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false)
    window.addEventListener("mouseup", handleGlobalMouseUp)
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp)
  }, [])

  const handlePeriodChange = (newPeriod: "AM" | "PM") => {
    if (newPeriod === period) return
    setPeriod(newPeriod)

    let newHour24: number
    if (newPeriod === "PM") {
      newHour24 = value.hours < 12 ? value.hours + 12 : value.hours
    } else {
      newHour24 = value.hours >= 12 ? value.hours - 12 : value.hours
    }

    validateAndApplyTime(newHour24, value.minutes)
  }

  const handleHourInputClick = () => {
    if (selectionMode !== "hours") {
      setIsAnimating(true)
      setTimeout(() => {
        setSelectionMode("hours")
        setIsAnimating(false)
      }, 150)
    }
  }

  const handleMinuteInputClick = () => {
    if (selectionMode !== "minutes") {
      setIsAnimating(true)
      setTimeout(() => {
        setSelectionMode("minutes")
        setIsAnimating(false)
      }, 150)
    }
  }

  const toggleInputMode = () => {
    setIsModeTransitioning(true)
    setTimeout(() => {
      setInputMode(inputMode === "dial" ? "keyboard" : "dial")
      setIsModeTransitioning(false)
      if (inputMode === "dial") {
        setTimeout(() => hoursInputRef.current?.focus(), 100)
      }
    }, 150)
  }

  const handleKeyboardHoursChange = (val: string) => {
    const numericVal = val.replace(/\D/g, "").slice(0, 2)
    setHoursInput(numericVal)
  }

  const handleKeyboardHoursBlur = () => {
    setIsHoursFocused(false)
    if (hoursInput !== "") {
      let h = parseInt(hoursInput || "0", 10)
      if (h > 12) h = 12
      if (h < 1) h = 1
      const hour24 = get24Hour(h, period === "PM")
      validateAndApplyTime(hour24, value.minutes)
    }
    setHoursInput("")
  }

  const handleKeyboardMinutesChange = (val: string) => {
    const numericVal = val.replace(/\D/g, "").slice(0, 2)
    setMinutesInput(numericVal)
  }

  const handleKeyboardMinutesBlur = () => {
    setIsMinutesFocused(false)
    if (minutesInput !== "") {
      let m = parseInt(minutesInput || "0", 10)
      if (m > 59) m = 59
      if (m < 0) m = 0
      validateAndApplyTime(value.hours, m)
    }
    setMinutesInput("")
  }

  const currentAngle = selectionMode === "hours"
    ? getAngleForHour(displayHour)
    : getAngleForMinute(value.minutes)

  const hours = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]
  const values = selectionMode === "hours" ? hours : minutes
  const selectedValue = selectionMode === "hours" ? displayHour : value.minutes

  return (
    <div className={cn("flex flex-col items-center w-full overflow-hidden", luxmotion ? "bg-[#faf7f2] rounded-none border border-[rgba(154,117,53,0.22)]" : "bg-[#e9f9ff] rounded-[28px]")}>
      <div className="w-full pt-6 px-6 shrink-0">
        <p
          className="text-[14px] text-black leading-[1.55]"
          style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}
        >
          {inputMode === "keyboard" ? "Enter time" : headline}
        </p>
      </div>

      <div className="w-full flex-1 flex flex-col gap-9 items-center px-6 min-h-0">
        <div className="flex gap-3 items-start shrink-0">
          <div className="flex items-start">
            {inputMode === "keyboard" ? (
              <>
                <div
                  className={cn(
                    "w-24 flex flex-col items-center overflow-hidden transition-all duration-200",
                    luxmotion ? "rounded-none bg-[rgba(168,131,58,0.12)]" : "rounded-lg bg-[#bceeff]",
                    isHoursFocused && (luxmotion ? "ring-2 ring-[#a08248] ring-offset-2 ring-offset-[#faf7f2]" : "ring-2 ring-[#27c7ff] ring-offset-2 ring-offset-[#e9f9ff]")
                  )}
                >
                  <input
                    ref={hoursInputRef}
                    type="text"
                    inputMode="numeric"
                    maxLength={2}
                    value={isHoursFocused ? hoursInput : String(displayHour).padStart(2, "0")}
                    onChange={(e) => handleKeyboardHoursChange(e.target.value)}
                    onFocus={() => {
                      setIsHoursFocused(true)
                      setHoursInput(String(displayHour).padStart(2, "0"))
                    }}
                    onBlur={handleKeyboardHoursBlur}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === "Tab" || e.key === ":") {
                        if (e.key !== "Tab") e.preventDefault()
                        handleKeyboardHoursBlur()
                        minutesInputRef.current?.focus()
                      }
                    }}
                    className={cn(
                      "h-20 w-24 flex flex-col justify-center text-center bg-transparent outline-none transition-colors duration-200",
                      isHoursFocused ? (luxmotion ? "text-[#a08248]" : "text-[#0e4659]") : "text-[#1d1b20]"
                    )}
                    style={{
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: "57px",
                      fontWeight: 400,
                      lineHeight: "64px",
                      letterSpacing: "-0.25px",
                    }}
                  />
                </div>

                <div
                  className="w-6 h-20 flex flex-col justify-center text-center text-[#1d1b20]"
                  style={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "57px",
                    fontWeight: 400,
                    lineHeight: "64px",
                  }}
                >
                  :
                </div>

                <div
                  className={cn(
                    "w-24 flex flex-col items-center justify-center overflow-hidden transition-all duration-200",
                    luxmotion ? "rounded-none bg-[rgba(168,131,58,0.12)]" : "rounded-lg bg-[#bceeff]",
                    isMinutesFocused && (luxmotion ? "ring-2 ring-[#a08248] ring-offset-2 ring-offset-[#faf7f2]" : "ring-2 ring-[#27c7ff] ring-offset-2 ring-offset-[#e9f9ff]")
                  )}
                >
                  <input
                    ref={minutesInputRef}
                    type="text"
                    inputMode="numeric"
                    maxLength={2}
                    value={isMinutesFocused ? minutesInput : String(value.minutes).padStart(2, "0")}
                    onChange={(e) => handleKeyboardMinutesChange(e.target.value)}
                    onFocus={() => {
                      setIsMinutesFocused(true)
                      setMinutesInput(String(value.minutes).padStart(2, "0"))
                    }}
                    onBlur={handleKeyboardMinutesBlur}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleKeyboardMinutesBlur()
                      }
                    }}
                    className={cn(
                      "h-20 w-[97px] flex flex-col justify-center text-center bg-transparent outline-none transition-colors duration-200",
                      isMinutesFocused ? (luxmotion ? "text-[#a08248]" : "text-[#0e4659]") : "text-[#1d1b20]"
                    )}
                    style={{
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: "57px",
                      fontWeight: 400,
                      lineHeight: "64px",
                      letterSpacing: "-0.25px",
                    }}
                  />
                </div>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleHourInputClick}
                  className={cn(
                    "w-24 flex flex-col items-center overflow-hidden transition-all duration-200",
                    luxmotion ? "rounded-none bg-[rgba(168,131,58,0.12)]" : "rounded-lg bg-[#bceeff]",
                    selectionMode === "hours" && (luxmotion ? "ring-2 ring-[#a08248] ring-offset-2 ring-offset-[#faf7f2]" : "ring-2 ring-[#27c7ff] ring-offset-2 ring-offset-[#e9f9ff]")
                  )}
                >
                  <div
                    className={cn(
                      "h-20 w-24 flex flex-col justify-center text-center transition-colors duration-200",
                      selectionMode === "hours" ? (luxmotion ? "text-[#a08248]" : "text-[#0e4659]") : "text-[#1d1b20]"
                    )}
                    style={{
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: "57px",
                      fontWeight: 400,
                      lineHeight: "64px",
                      letterSpacing: "-0.25px",
                    }}
                  >
                    {String(displayHour).padStart(2, "0")}
                  </div>
                </button>

                <div
                  className="w-6 h-20 flex flex-col justify-center text-center text-[#1d1b20]"
                  style={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "57px",
                    fontWeight: 400,
                    lineHeight: "64px",
                  }}
                >
                  :
                </div>

                <button
                  type="button"
                  onClick={handleMinuteInputClick}
                  className={cn(
                    "w-24 flex flex-col items-center justify-center overflow-hidden transition-all duration-200",
                    luxmotion ? "rounded-none bg-[rgba(168,131,58,0.12)]" : "rounded-lg bg-[#bceeff]",
                    selectionMode === "minutes" && (luxmotion ? "ring-2 ring-[#a08248] ring-offset-2 ring-offset-[#faf7f2]" : "ring-2 ring-[#27c7ff] ring-offset-2 ring-offset-[#e9f9ff]")
                  )}
                >
                  <div
                    className={cn(
                      "h-20 w-[97px] flex flex-col justify-center text-center transition-colors duration-200",
                      selectionMode === "minutes" ? (luxmotion ? "text-[#a08248]" : "text-[#0e4659]") : "text-[#1d1b20]"
                    )}
                    style={{
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: "57px",
                      fontWeight: 400,
                      lineHeight: "64px",
                      letterSpacing: "-0.25px",
                    }}
                  >
                    {String(value.minutes).padStart(2, "0")}
                  </div>
                </button>
              </>
            )}
          </div>

          <div className={cn("h-20 w-[52px] border border-[#79747e] overflow-hidden flex flex-col shrink-0", luxmotion ? "rounded-none bg-[#faf7f2]" : "rounded-lg bg-[#e9f9ff]")}>
            <button
              type="button"
              onClick={() => handlePeriodChange("AM")}
              className={cn(
                "flex-1 flex flex-col items-center justify-center border-b border-[#79747e] min-h-0 transition-all duration-200",
                period === "AM"
                  ? luxmotion ? "bg-[#a08248]" : "bg-[#0e4659]"
                  : luxmotion ? "hover:bg-[#a08248]/10" : "hover:bg-[#0e4659]/10"
              )}
            >
              <div className="flex-1 flex items-center justify-center px-2.5 py-2 w-full min-h-0">
                <span
                  className={cn(
                    "text-center transition-colors duration-200",
                    period === "AM"
                      ? luxmotion ? "text-white" : "text-[#e9f9ff]"
                      : "text-[#49454f]"
                  )}
                  style={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "16px",
                    fontWeight: 500,
                    lineHeight: "24px",
                    letterSpacing: "0.15px",
                  }}
                >
                  AM
                </span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => handlePeriodChange("PM")}
              className={cn(
                "flex-1 flex flex-col items-center justify-center border-t border-[#79747e] min-h-0 transition-all duration-200",
                period === "PM"
                  ? luxmotion ? "bg-[#a08248]" : "bg-[#0e4659]"
                  : luxmotion ? "hover:bg-[#a08248]/10" : "hover:bg-[#0e4659]/10"
              )}
            >
              <div className="flex-1 flex items-center justify-center px-2.5 py-2 w-full min-h-0">
                <span
                  className={cn(
                    "text-center transition-colors duration-200",
                    period === "PM"
                      ? luxmotion ? "text-white" : "text-[#e9f9ff]"
                      : "text-[#49454f]"
                  )}
                  style={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "16px",
                    fontWeight: 500,
                    lineHeight: "24px",
                    letterSpacing: "0.15px",
                  }}
                >
                  PM
                </span>
              </div>
            </button>
          </div>
        </div>

        {inputMode === "dial" ? (
          <div
            ref={clockRef}
            className={cn(
              "relative rounded-full cursor-pointer select-none shrink-0",
              luxmotion ? "bg-[rgba(168,131,58,0.12)]" : "bg-[#bceeff]",
              isAnimating && "transition-all duration-200 scale-[0.92] opacity-60",
              isModeTransitioning && "transition-all duration-150 scale-[0.85] opacity-0"
            )}
            style={{ width: CLOCK_SIZE, height: CLOCK_SIZE }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className={cn("absolute rounded-full", luxmotion ? "bg-[#a08248]" : "bg-[#27c7ff]")}
              style={{
                width: 8,
                height: 8,
                left: CLOCK_RADIUS - 4,
                top: CLOCK_RADIUS - 4,
                transform: isDragging ? "scale(1.5)" : "scale(1)",
                transition: "transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />

            <div
              className={cn("absolute origin-left", luxmotion ? "bg-[#a08248]" : "bg-[#27c7ff]")}
              style={{
                width: NUMBER_RADIUS - 24,
                height: 2,
                left: CLOCK_RADIUS,
                top: CLOCK_RADIUS - 1,
                transform: `rotate(${currentAngle - 90}deg)`,
                transition: isDragging ? "none" : "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            />

            {values.map((val, index) => {
              const angle = index * 30
              const pos = getPositionForAngle(angle, NUMBER_RADIUS)
              const isSelected = val === selectedValue

              return (
                <div
                  key={`${selectionMode}-${val}`}
                  className="absolute flex items-center justify-center"
                  style={{
                    width: 48,
                    height: 48,
                    left: pos.x - 24,
                    top: pos.y - 24,
                    opacity: isAnimating ? 0 : 1,
                    transform: isAnimating ? "scale(0.5)" : "scale(1)",
                    transition: `all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 20}ms`,
                  }}
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex flex-col items-center justify-center overflow-hidden",
                      isSelected
                        ? luxmotion ? "bg-[#a08248]" : "bg-[#27c7ff]"
                        : luxmotion ? "bg-transparent hover:bg-[#a08248]/20" : "bg-transparent hover:bg-[#27c7ff]/20"
                    )}
                    style={{
                      transform: isSelected ? (isDragging ? "scale(1.15)" : "scale(1)") : "scale(0.92)",
                      transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    }}
                  >
                    <span
                      className={cn(
                        "text-center",
                        isSelected ? "text-white" : "text-[#1d1b20]"
                      )}
                      style={{
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: "16px",
                        fontWeight: 400,
                        lineHeight: "24px",
                        letterSpacing: "0.5px",
                        transition: "color 0.15s ease",
                      }}
                    >
                      {selectionMode === "minutes" ? String(val).padStart(2, "0") : val}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div
            className={cn(
              "flex flex-col items-center justify-center shrink-0 transition-all duration-200",
              isModeTransitioning ? "opacity-0 scale-90" : "opacity-100 scale-100"
            )}
            style={{ width: CLOCK_SIZE, height: CLOCK_SIZE }}
          >
            <div className="text-center px-8">
              <p
                className="text-[#49454f] mb-2"
                style={{
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: "14px",
                  fontWeight: 400,
                  lineHeight: "20px",
                }}
              >
                Use the number keys to enter time
              </p>
              <p
                className="text-[#79747e]"
                style={{
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: "12px",
                  fontWeight: 400,
                  lineHeight: "16px",
                }}
              >
                Hours: 1-12 • Minutes: 00-59
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="w-full flex items-center justify-between pb-5 pl-3 pr-6 shrink-0">
        <button
          type="button"
          onClick={toggleInputMode}
          className="w-12 h-12 flex items-center justify-center"
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden hover:bg-black/5 active:bg-black/10 active:scale-95 transition-all duration-150">
            {inputMode === "dial" ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M20 5H4C2.9 5 2.01 5.9 2.01 7L2 19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V7C22 5.9 21.1 5 20 5ZM11 8H13V10H11V8ZM11 11H13V13H11V11ZM8 8H10V10H8V8ZM8 11H10V13H8V11ZM7 13H5V11H7V13ZM7 10H5V8H7V10ZM16 19H8V17H16V19ZM16 13H14V11H16V13ZM16 10H14V8H16V10ZM19 13H17V11H19V13ZM19 10H17V8H19V10Z"
                  fill="#49454f"
                />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z"
                  fill="#49454f"
                />
              </svg>
            )}
          </div>
        </button>

        <div className="flex gap-2 items-start">
          <button
            type="button"
            onClick={onCancel}
            className="h-12 flex items-center justify-center"
          >
            <div className="rounded-full overflow-hidden hover:bg-black/5 active:bg-black/10 active:scale-95 transition-all duration-150">
              <div className="flex gap-2 items-center justify-center px-4 py-2.5">
                <span
                  className={luxmotion ? "text-[#a08248]" : "text-[#27c7ff]"}
                  style={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "14px",
                    fontWeight: 500,
                    lineHeight: "20px",
                    letterSpacing: "0.1px",
                  }}
                >
                  Cancel
                </span>
              </div>
            </div>
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-12 flex items-center justify-center"
          >
            <div className="rounded-full overflow-hidden hover:bg-black/5 active:bg-black/10 active:scale-95 transition-all duration-150">
              <div className="flex gap-2 items-center justify-center px-4 py-2.5">
                <span
                  className={luxmotion ? "text-[#a08248]" : "text-[#27c7ff]"}
                  style={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "14px",
                    fontWeight: 500,
                    lineHeight: "20px",
                    letterSpacing: "0.1px",
                  }}
                >
                  OK
                </span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
