"use client"

import { useState, type KeyboardEvent } from "react"
import { Plus, X } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { LightInput } from "./light-input"
import { LightButton } from "./light-button"

interface OperatingZonesInputProps {
  zones: string[]
  onChange: (zones: string[]) => void
  placeholder: string
  addLabel: string
}

export function OperatingZonesInput({
  zones,
  onChange,
  placeholder,
  addLabel,
}: OperatingZonesInputProps) {
  const [draft, setDraft] = useState("")

  function commitDraft() {
    const value = draft.trim()
    if (!value) return
    if (zones.includes(value)) {
      setDraft("")
      return
    }
    onChange([...zones, value])
    setDraft("")
  }

  function removeAt(index: number) {
    onChange(zones.filter((_, i) => i !== index))
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault()
      commitDraft()
    }
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex flex-col sm:flex-row gap-2 items-stretch w-full">
        <LightInput
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKey}
          placeholder={placeholder}
          className="flex-1"
        />
        <LightButton
          variant="outline"
          size="md"
          onClick={commitDraft}
          iconRight={<Plus size={18} strokeWidth={1.6} />}
        >
          {addLabel}
        </LightButton>
      </div>
      {zones.length > 0 ? (
        <div className="flex flex-wrap gap-2 pt-1">
          {zones.map((zone, idx) => (
            <span
              key={`${zone}-${idx}`}
              className={cn(
                "inline-flex items-center gap-1.5 bg-white border border-[rgba(28,27,24,0.08)] pl-3 pr-2 h-8 text-[13px] text-[#1c1b18]",
              )}
            >
              {zone}
              <button
                type="button"
                onClick={() => removeAt(idx)}
                className="text-[#696969] hover:text-[#1c1b18] transition-colors p-0.5"
                aria-label={`Remove ${zone}`}
              >
                <X size={14} strokeWidth={1.8} />
              </button>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  )
}
