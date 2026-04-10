import type { CountryIso2 } from "react-international-phone"

export const locales = ["pt", "en", "de", "nl", "fr", "es"] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "pt"

export const localeNames: Record<Locale, string> = {
  pt: "Português",
  en: "English",
  de: "Deutsch",
  nl: "Nederlands",
  fr: "Français",
  es: "Español",
}

export const localeFlags: Record<Locale, string> = {
  pt: "🇵🇹",
  en: "🇬🇧",
  de: "🇩🇪",
  nl: "🇳🇱",
  fr: "🇫🇷",
  es: "🇪🇸",
}

export const localeCountryIso: Record<Locale, CountryIso2> = {
  pt: "pt",
  en: "gb",
  de: "de",
  nl: "nl",
  fr: "fr",
  es: "es",
}

