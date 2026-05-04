"use client"

import { useId, useRef, type ChangeEvent } from "react"
import { FileText, ImageIcon, Upload, X } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

export interface LightFileUploadProps {
  value: File | null
  onChange: (file: File | null) => void
  /** Accept attribute, e.g. "image/jpeg,image/png,application/pdf" */
  accept?: string
  /** Max file size in MB */
  maxSizeMb?: number
  /** Title shown in idle state, e.g. "Carregar alvará ou licença TVDE" */
  idleTitle: string
  /** Subtitle shown in idle state, e.g. "jpg,png ou pdf - máx. 10mb" */
  idleSubtitle: string
  /** ARIA label for the clear button */
  removeLabel: string
  /** Callback for size violations — receives the displayable error label */
  onError?: (message: string) => void
  /** Error label override — single localized string */
  sizeErrorLabel?: string
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function fileKindIcon(file: File) {
  if (file.type.startsWith("image/")) return ImageIcon
  return FileText
}

export function LightFileUpload({
  value,
  onChange,
  accept = "image/jpeg,image/png,application/pdf",
  maxSizeMb = 10,
  idleTitle,
  idleSubtitle,
  removeLabel,
  onError,
  sizeErrorLabel,
}: LightFileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const inputId = useId()

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    if (!file) return
    if (file.size > maxSizeMb * 1024 * 1024) {
      onError?.(sizeErrorLabel ?? `File exceeds ${maxSizeMb}MB`)
      e.target.value = ""
      return
    }
    onChange(file)
    e.target.value = ""
  }

  if (value) {
    const Icon = fileKindIcon(value)
    return (
      <div className="flex items-center gap-3 bg-white border border-[rgba(28,27,24,0.08)] px-4 py-3 w-full">
        <div className="size-8 shrink-0 bg-[rgba(201,169,110,0.08)] border-[0.727px] border-[rgba(201,169,110,0.18)] flex items-center justify-center text-[#a08248]">
          <Icon size={16} strokeWidth={1.6} />
        </div>
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <p className="text-[12px] font-semibold text-[#1a1a1a] truncate leading-none">
            {value.name}
          </p>
          <p className="text-[10px] text-[#696969] truncate leading-none">
            {formatBytes(value.size)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onChange(null)}
          aria-label={removeLabel}
          className="size-8 shrink-0 bg-[rgba(155,44,44,0.08)] border-[0.727px] border-[rgba(155,44,44,0.1)] flex items-center justify-center text-[#9b2c2c] hover:bg-[rgba(155,44,44,0.14)] transition-colors"
        >
          <X size={16} strokeWidth={2} />
        </button>
      </div>
    )
  }

  return (
    <label
      htmlFor={inputId}
      className={cn(
        "group flex flex-col items-center justify-center gap-2 w-full px-6 py-[22px]",
        "bg-[rgba(154,117,53,0.07)] border border-dashed border-[rgba(154,117,53,0.22)]",
        "cursor-pointer hover:bg-[rgba(154,117,53,0.12)] hover:border-[rgba(154,117,53,0.4)] transition-colors",
      )}
    >
      <Upload size={24} strokeWidth={1.6} className="text-[#0d0d0d] group-hover:text-[#a08248] transition-colors" />
      <div className="flex flex-col items-center gap-1.5 max-w-full">
        <span className="text-[12px] font-semibold text-[#0d0d0d] text-center leading-none">
          {idleTitle}
        </span>
        <span className="text-[10px] text-[#696969] text-center leading-none">
          {idleSubtitle}
        </span>
      </div>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        className="sr-only"
        accept={accept}
        onChange={handleChange}
      />
    </label>
  )
}
