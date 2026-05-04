"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import { LightSelect } from "./light-select"
import { LightButton } from "./light-button"

export type LanguageLevel = "survival" | "intermediate" | "fluent"

export interface LanguageEntry {
  code: string
  level: LanguageLevel
}

interface LanguageOption {
  value: string
  label: string
}

interface LevelOption {
  value: LanguageLevel
  label: string
}

interface LanguageProficiencyInputProps {
  value: LanguageEntry[]
  onChange: (next: LanguageEntry[]) => void
  languageOptions: LanguageOption[]
  levelOptions: LevelOption[]
  addPlaceholder: string
  addLabel: string
  defaultLevel?: LanguageLevel
}

export function LanguageProficiencyInput({
  value,
  onChange,
  languageOptions,
  levelOptions,
  addPlaceholder,
  addLabel,
  defaultLevel = "intermediate",
}: LanguageProficiencyInputProps) {
  const [draft, setDraft] = useState("")

  const remainingOptions = languageOptions.filter(
    (opt) => !value.some((entry) => entry.code === opt.value),
  )

  function commitDraft() {
    if (!draft) return
    if (value.some((entry) => entry.code === draft)) {
      setDraft("")
      return
    }
    onChange([...value, { code: draft, level: defaultLevel }])
    setDraft("")
  }

  function setLevel(code: string, level: LanguageLevel) {
    onChange(value.map((entry) => (entry.code === code ? { ...entry, level } : entry)))
  }

  function removeAt(code: string) {
    onChange(value.filter((entry) => entry.code !== code))
  }

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex flex-col sm:flex-row gap-2 items-stretch w-full">
        <LightSelect
          value={draft}
          onChange={setDraft}
          placeholder={addPlaceholder}
          options={remainingOptions}
          className="flex-1"
        />
        <LightButton
          variant="outline"
          size="md"
          onClick={commitDraft}
          disabled={!draft}
          iconRight={<Plus size={18} strokeWidth={1.6} />}
        >
          {addLabel}
        </LightButton>
      </div>

      {value.length > 0 ? (
        <div className="flex flex-col mt-1">
          {value.map((entry) => {
            const opt = languageOptions.find((o) => o.value === entry.code)
            const label = opt?.label ?? entry.code
            return (
              <div
                key={entry.code}
                className="bg-white border-b border-[rgba(28,27,24,0.06)] last:border-b-0 flex items-center justify-between gap-3 p-4 w-full"
              >
                <span className="text-[12px] font-semibold text-[#1a1a1a] leading-none w-[100px] shrink-0">
                  {label}
                </span>
                <div className="flex gap-1 items-center">
                  {levelOptions.map((lvl) => {
                    const active = entry.level === lvl.value
                    return (
                      <button
                        key={lvl.value}
                        type="button"
                        onClick={() => setLevel(entry.code, lvl.value)}
                        className={
                          active
                            ? "h-[28px] px-[9px] py-[7px] bg-[rgba(154,117,53,0.07)] border border-[rgba(154,117,53,0.22)] text-[#9a7535] text-[10px] font-semibold uppercase tracking-[0.2px] leading-none transition-colors"
                            : "h-[28px] px-[9px] py-[7px] bg-[rgba(247,244,239,0.38)] border border-[rgba(28,27,24,0.08)] text-[#696969] text-[10px] font-medium uppercase tracking-[0.2px] leading-none hover:text-[#1c1b18] transition-colors"
                        }
                      >
                        {lvl.label}
                      </button>
                    )
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => removeAt(entry.code)}
                  className="size-8 flex items-center justify-center bg-[rgba(155,44,44,0.08)] border border-[rgba(155,44,44,0.1)] text-[#9b2c2c] hover:bg-[rgba(155,44,44,0.14)] transition-colors shrink-0"
                  aria-label={`Remove ${label}`}
                >
                  <X size={16} strokeWidth={1.8} />
                </button>
              </div>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
