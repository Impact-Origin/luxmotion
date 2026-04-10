"use client"

import { cn } from "@workspace/ui/lib/utils"

const LANGUAGE_LABELS: Record<string, string> = {
  en: "EN",
  pt: "PT",
  de: "DE",
  es: "ES",
  fr: "FR",
  nl: "NL",
}


const LANGUAGE_FULL_NAMES: Record<string, string> = {
  en: "English",
  pt: "Portuguese",
  de: "German",
  es: "Spanish",
  fr: "French",
  nl: "Dutch",
}

interface LanguageBadgeProps {
  originalLanguage: string
  availableLanguages?: string[]
  size?: "sm" | "md"
  className?: string
}

export function LanguageBadge({
  originalLanguage,
  availableLanguages = [],
  size = "sm",
  className,
}: LanguageBadgeProps) {
  const otherLanguages = availableLanguages.filter((l) => l !== originalLanguage)
  const hasTranslations = otherLanguages.length > 0

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-1",
        size === "sm" ? "text-[10px]" : "text-xs",
        className
      )}
    >
      <span className="font-medium text-zinc-500 uppercase">
        {LANGUAGE_LABELS[originalLanguage] || originalLanguage}
      </span>
      {hasTranslations && (
        <span className="font-medium text-[#27c7ff]">
          +{otherLanguages.length}
        </span>
      )}
    </div>
  )
}

interface LanguageSelectorProps {
  originalLanguage: string
  availableLanguages: string[]
  currentLocale: string
  onSelect?: (locale: string) => void
  className?: string
}

export function LanguageSelector({
  originalLanguage,
  availableLanguages,
  currentLocale,
  onSelect,
  className,
}: LanguageSelectorProps) {
  const allLanguages = [originalLanguage, ...availableLanguages.filter((l) => l !== originalLanguage)]

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-xs text-zinc-500">Available in:</span>
      <div className="flex items-center gap-1">
        {allLanguages.map((lang) => (
          <button
            key={lang}
            onClick={() => onSelect?.(lang)}
            className={cn(
              "px-2 py-1 rounded text-xs font-medium transition-colors",
              lang === currentLocale
                ? "bg-[#27c7ff] text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            )}
          >
            {LANGUAGE_LABELS[lang] || lang}
          </button>
        ))}
      </div>
    </div>
  )
}

interface LanguageInfoProps {
  originalLanguage: string
  currentLocale: string
  className?: string
}

export function LanguageInfo({ originalLanguage, currentLocale, className }: LanguageInfoProps) {
  const isOriginal = originalLanguage === currentLocale
  const originalName = LANGUAGE_FULL_NAMES[originalLanguage] || originalLanguage

  if (isOriginal) {
    return (
      <span className={cn("text-xs text-zinc-500", className)}>
        Written in {originalName}
      </span>
    )
  }

  return (
    <span className={cn("text-xs text-zinc-500", className)}>
      Translated from {originalName}
    </span>
  )
}
