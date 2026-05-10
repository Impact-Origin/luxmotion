"use client"

import { useEffect, useState, type FormEvent } from "react"
import { Video, VideoOff, X } from "lucide-react"
import { useTranslations } from "next-intl"
import {
  FieldLabel,
  LightButton,
  LightInput,
  SERIF_FONT,
} from "@/components/applications/shared"
import type { PartnerDriverEntry } from "../partner-application-context"

type DriverDraft = Omit<PartnerDriverEntry, "id">

interface DriverFormModalProps {
  open: boolean
  onClose: () => void
  onSave: (entry: DriverDraft) => void
  initial?: DriverDraft
}

const EMPTY_DRAFT: DriverDraft = {
  fullName: "",
  email: "",
  phone: "",
  hasVideo: false,
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function DriverFormModal({ open, onClose, onSave, initial }: DriverFormModalProps) {
  const t = useTranslations("partnerApplication.stepDrivers")
  const tCommon = useTranslations("common")

  const [draft, setDraft] = useState<DriverDraft>(initial ?? EMPTY_DRAFT)

  useEffect(() => {
    if (open) setDraft(initial ?? EMPTY_DRAFT)
  }, [open, initial])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  if (!open) return null

  const canSave =
    draft.fullName.trim().length > 0 &&
    EMAIL_RE.test(draft.email.trim()) &&
    draft.phone.trim().length > 0

  function commit() {
    if (!canSave) return
    onSave({
      fullName: draft.fullName.trim(),
      email: draft.email.trim(),
      phone: draft.phone.trim(),
      hasVideo: draft.hasVideo,
    })
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    e.stopPropagation()
    commit()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      <div
        className="absolute inset-0 bg-[rgba(15,14,12,0.55)]"
        onClick={onClose}
        aria-hidden
      />
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-[520px] max-h-full overflow-y-auto bg-[#f7f4ee] border border-[rgba(28,27,24,0.08)] flex flex-col gap-6 p-6 md:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1 min-w-0">
            <h2
              className="text-[24px] md:text-[28px] leading-[1.1] text-[#1c1b18]"
              style={SERIF_FONT}
            >
              {t("modalTitle")}
            </h2>
            <p className="text-[13px] text-[#696969] leading-[1.4]">
              {t("modalSubtitle")}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={tCommon("close")}
            className="shrink-0 size-8 flex items-center justify-center text-[#696969] hover:text-[#1c1b18] transition-colors"
          >
            <X size={18} strokeWidth={1.6} />
          </button>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <label className="flex flex-col gap-2">
            <FieldLabel required>{t("fields.fullName.label")}</FieldLabel>
            <LightInput
              value={draft.fullName}
              onChange={(e) => setDraft((d) => ({ ...d, fullName: e.target.value }))}
              placeholder={t("fields.fullName.placeholder")}
              autoFocus
            />
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col gap-2">
              <FieldLabel required>{t("fields.email.label")}</FieldLabel>
              <LightInput
                type="email"
                value={draft.email}
                onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
                placeholder={t("fields.email.placeholder")}
              />
            </label>
            <label className="flex flex-col gap-2">
              <FieldLabel required>{t("fields.phone.label")}</FieldLabel>
              <LightInput
                type="tel"
                value={draft.phone}
                onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
                placeholder={t("fields.phone.placeholder")}
              />
            </label>
          </div>

          <button
            type="button"
            onClick={() => setDraft((d) => ({ ...d, hasVideo: !d.hasVideo }))}
            className="flex items-center gap-3 bg-white border border-[rgba(28,27,24,0.08)] hover:border-[rgba(28,27,24,0.18)] px-4 py-3 text-left transition-colors"
          >
            <span
              className={`size-9 shrink-0 flex items-center justify-center border-[0.727px] ${
                draft.hasVideo
                  ? "bg-[rgba(201,169,110,0.08)] border-[rgba(201,169,110,0.18)] text-[#a08248]"
                  : "bg-[rgba(28,27,24,0.04)] border-[rgba(28,27,24,0.08)] text-[#696969]"
              }`}
            >
              {draft.hasVideo ? (
                <Video size={16} strokeWidth={1.6} />
              ) : (
                <VideoOff size={16} strokeWidth={1.6} />
              )}
            </span>
            <span className="flex-1 min-w-0 flex flex-col gap-0.5">
              <span className="text-[13px] font-semibold text-[#1c1b18] leading-tight">
                {t("fields.hasVideo.label")}
              </span>
              <span className="text-[12px] text-[#696969] leading-tight">
                {draft.hasVideo ? t("hasVideoYes") : t("hasVideoNo")}
              </span>
            </span>
          </button>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <LightButton variant="outline" size="md" onClick={onClose}>
            {tCommon("cancel")}
          </LightButton>
          <LightButton
            type="button"
            variant="primary"
            size="md"
            disabled={!canSave}
            onClick={commit}
          >
            {t("saveDriver")}
          </LightButton>
        </div>
      </form>
    </div>
  )
}
