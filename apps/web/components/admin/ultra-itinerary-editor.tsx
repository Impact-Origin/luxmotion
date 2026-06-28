"use client"

import * as React from "react"
import { Plus, Trash2, GripVertical } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import { ImageUpload } from "./image-upload"

export interface EditorStop {
  time: string
  label: string
  title: string
  description: string
  imageId?: string
  imageUrl?: string | null
  lat: string
  lng: string
}

export interface EditorDay {
  title: string
  titleAccent: string
  hoursActive: string
  nights: string
  hotel: string
  stops: EditorStop[]
}

export const emptyStop = (): EditorStop => ({ time: "", label: "", title: "", description: "", lat: "", lng: "" })
export const emptyDay = (): EditorDay => ({ title: "", titleAccent: "", hoursActive: "", nights: "", hotel: "", stops: [emptyStop()] })

interface UltraItineraryEditorProps {
  days: EditorDay[]
  onChange: (days: EditorDay[]) => void
  disabled?: boolean
}

export function UltraItineraryEditor({ days, onChange, disabled }: UltraItineraryEditorProps) {
  const updateDay = (di: number, patch: Partial<EditorDay>) =>
    onChange(days.map((d, i) => (i === di ? { ...d, ...patch } : d)))

  const updateStop = (di: number, si: number, patch: Partial<EditorStop>) =>
    onChange(days.map((d, i) => (i === di ? { ...d, stops: d.stops.map((s, j) => (j === si ? { ...s, ...patch } : s)) } : d)))

  const addDay = () => onChange([...days, emptyDay()])
  const removeDay = (di: number) => onChange(days.filter((_, i) => i !== di))
  const addStop = (di: number) => updateDay(di, { stops: [...days[di]!.stops, emptyStop()] })
  const removeStop = (di: number, si: number) => updateDay(di, { stops: days[di]!.stops.filter((_, j) => j !== si) })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-foreground">Day-by-day Itinerary</h3>
          <p className="text-xs text-muted-foreground">Ultra-luxury tours only. Leave empty to fall back to the flat stops list.</p>
        </div>
        <Button type="button" variant="outline" onClick={addDay} disabled={disabled}>
          <Plus className="mr-2 h-4 w-4" /> Add day
        </Button>
      </div>

      {days.length === 0 && (
        <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          No itinerary days yet.
        </p>
      )}

      {days.map((day, di) => (
        <div key={di} className="space-y-4 rounded-xl border border-amber-200 bg-amber-50/30 p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold uppercase tracking-wide text-amber-700">Day {di + 1}</span>
            <Button type="button" variant="ghost" onClick={() => removeDay(di)} disabled={disabled} className="text-red-600 hover:bg-red-50">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <Label className="text-xs">Day title</Label>
              <Input value={day.title} onChange={(e) => updateDay(di, { title: e.target.value })} disabled={disabled} placeholder="Sintra & the" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Title accent (gold italic)</Label>
              <Input value={day.titleAccent} onChange={(e) => updateDay(di, { titleAccent: e.target.value })} disabled={disabled} placeholder="Atlantic Edge" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Active time</Label>
              <Input value={day.hoursActive} onChange={(e) => updateDay(di, { hoursActive: e.target.value })} disabled={disabled} placeholder="~6 hours active" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Nights</Label>
                <Input type="number" min={0} value={day.nights} onChange={(e) => updateDay(di, { nights: e.target.value })} disabled={disabled} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Hotel</Label>
                <Input value={day.hotel} onChange={(e) => updateDay(di, { hotel: e.target.value })} disabled={disabled} placeholder="Bairro Alto Hotel" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {day.stops.map((stop, si) => (
              <div key={si} className="space-y-3 rounded-lg border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                    <GripVertical className="h-3.5 w-3.5" /> Stop {si + 1}
                  </span>
                  <Button type="button" variant="ghost" onClick={() => removeStop(di, si)} disabled={disabled} className="h-7 px-2 text-red-600 hover:bg-red-50">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-[100px_1fr]">
                  <div className="space-y-1">
                    <Label className="text-xs">Time</Label>
                    <Input value={stop.time} onChange={(e) => updateStop(di, si, { time: e.target.value })} disabled={disabled} placeholder="09:00" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Label</Label>
                    <Input value={stop.label} onChange={(e) => updateStop(di, si, { label: e.target.value })} disabled={disabled} placeholder="Arrival / Check-in / Lunch" />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Title</Label>
                  <Input value={stop.title} onChange={(e) => updateStop(di, si, { title: e.target.value })} disabled={disabled} placeholder="Pena Palace" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Description</Label>
                  <Textarea value={stop.description} onChange={(e) => updateStop(di, si, { description: e.target.value })} disabled={disabled} rows={2} />
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_120px_120px]">
                  <div className="space-y-1">
                    <Label className="text-xs">Image</Label>
                    <ImageUpload value={stop.imageUrl} onChange={(storageId) => updateStop(di, si, { imageId: storageId })} disabled={disabled} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Latitude</Label>
                    <Input value={stop.lat} onChange={(e) => updateStop(di, si, { lat: e.target.value })} disabled={disabled} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Longitude</Label>
                    <Input value={stop.lng} onChange={(e) => updateStop(di, si, { lng: e.target.value })} disabled={disabled} />
                  </div>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => addStop(di)} disabled={disabled} className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Add stop
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
