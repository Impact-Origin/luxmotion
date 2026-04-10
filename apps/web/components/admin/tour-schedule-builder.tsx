"use client"

import * as React from "react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { Plus, Trash2, Clock, Calendar } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { useTranslations } from "next-intl"

interface TimeSlot {
  startTime: string
  endTime?: string
}

interface Schedule {
  activeDays: number[]
  timeSlots: TimeSlot[]
  validFrom?: string
  validUntil?: string
  isActive: boolean
}

interface TourScheduleBuilderProps {
  schedule: Schedule
  onChange: (schedule: Schedule) => void
  disabled?: boolean
}

export function TourScheduleBuilder({
  schedule,
  onChange,
  disabled = false,
}: TourScheduleBuilderProps) {
  const t = useTranslations("adminTours.schedule")

  const DAYS_OF_WEEK = [
    { value: 1, label: t("days.mon") },
    { value: 2, label: t("days.tue") },
    { value: 3, label: t("days.wed") },
    { value: 4, label: t("days.thu") },
    { value: 5, label: t("days.fri") },
    { value: 6, label: t("days.sat") },
    { value: 0, label: t("days.sun") },
  ]

  const toggleDay = (day: number) => {
    const newDays = schedule.activeDays.includes(day)
      ? schedule.activeDays.filter((d) => d !== day)
      : [...schedule.activeDays, day].sort()
    onChange({ ...schedule, activeDays: newDays })
  }

  const addTimeSlot = () => {
    onChange({
      ...schedule,
      timeSlots: [...schedule.timeSlots, { startTime: "", endTime: "" }],
    })
  }

  const removeTimeSlot = (index: number) => {
    onChange({
      ...schedule,
      timeSlots: schedule.timeSlots.filter((_, i) => i !== index),
    })
  }

  const updateTimeSlot = (index: number, updates: Partial<TimeSlot>) => {
    onChange({
      ...schedule,
      timeSlots: schedule.timeSlots.map((slot, i) =>
        i === index ? { ...slot, ...updates } : slot
      ),
    })
  }

  const selectAllDays = () => {
    onChange({ ...schedule, activeDays: [0, 1, 2, 3, 4, 5, 6] })
  }

  const selectWeekdays = () => {
    onChange({ ...schedule, activeDays: [1, 2, 3, 4, 5] })
  }

  const selectWeekends = () => {
    onChange({ ...schedule, activeDays: [0, 6] })
  }

  const clearDays = () => {
    onChange({ ...schedule, activeDays: [] })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-bold flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {t("activeDays")}
          </Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={selectAllDays}
              disabled={disabled}
              className="h-7 text-xs"
            >
              {t("allDays")}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={selectWeekdays}
              disabled={disabled}
              className="h-7 text-xs"
            >
              {t("weekdays")}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={selectWeekends}
              disabled={disabled}
              className="h-7 text-xs"
            >
              {t("weekends")}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearDays}
              disabled={disabled}
              className="h-7 text-xs"
            >
              {t("clear")}
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          {DAYS_OF_WEEK.map((day) => (
            <button
              key={day.value}
              type="button"
              onClick={() => toggleDay(day.value)}
              disabled={disabled}
              className={cn(
                "flex-1 py-3 rounded-lg border-2 text-sm font-medium transition-all",
                schedule.activeDays.includes(day.value)
                  ? "bg-zinc-900 text-white border-zinc-900"
                  : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300"
              )}
            >
              {day.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-bold flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {t("timeSlots")}
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addTimeSlot}
            disabled={disabled}
            className="h-9"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t("addTime")}
          </Button>
        </div>

        {schedule.timeSlots.length === 0 ? (
          <div className="text-center py-6 text-zinc-500 border-2 border-dashed border-zinc-200 rounded-lg text-sm">
            {t("noTimeSlots")}
          </div>
        ) : (
          <div className="space-y-2">
            {schedule.timeSlots.map((slot, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg border border-zinc-200 bg-white"
              >
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-zinc-500">{t("startTime")} *</Label>
                    <Input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) =>
                        updateTimeSlot(index, { startTime: e.target.value })
                      }
                      disabled={disabled}
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-zinc-500">{t("endTime")}</Label>
                    <Input
                      type="time"
                      value={slot.endTime || ""}
                      onChange={(e) =>
                        updateTimeSlot(index, { endTime: e.target.value || undefined })
                      }
                      disabled={disabled}
                      className="h-10"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTimeSlot(index)}
                  disabled={disabled}
                  className="h-10 w-10 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <Label className="text-base font-bold">{t("validityPeriod")}</Label>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs text-zinc-500">{t("validFrom")}</Label>
            <Input
              type="date"
              value={schedule.validFrom || ""}
              onChange={(e) =>
                onChange({ ...schedule, validFrom: e.target.value || undefined })
              }
              disabled={disabled}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-zinc-500">{t("validUntil")}</Label>
            <Input
              type="date"
              value={schedule.validUntil || ""}
              onChange={(e) =>
                onChange({ ...schedule, validUntil: e.target.value || undefined })
              }
              disabled={disabled}
              className="h-11"
            />
          </div>
        </div>
        <p className="text-xs text-zinc-500">
          {t("noDateRestrictions")}
        </p>
      </div>

      <div className="pt-4 border-t border-zinc-200">
        <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg border border-zinc-200 hover:bg-zinc-50 transition-colors">
          <Checkbox
            checked={schedule.isActive}
            onCheckedChange={(checked) =>
              onChange({ ...schedule, isActive: checked as boolean })
            }
            disabled={disabled}
            className="size-5"
          />
          <div>
            <span className="font-semibold text-sm text-zinc-700 group-hover:text-zinc-900 transition-colors">
              {t("scheduleActive")}
            </span>
            <p className="text-xs text-zinc-500">
              {t("scheduleActiveHelp")}
            </p>
          </div>
        </label>
      </div>
    </div>
  )
}
