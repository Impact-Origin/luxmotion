import type { CountryIso2 } from "react-international-phone"

export const locales = ["pt", "en", "de", "nl", "fr", "es"] as const
export type Locale = (typeof locales)[number]

// Idioma por defeito para quem abre o site sem cookie NEXT_LOCALE (ex.: 1ª
// visita). Quem já escolheu um idioma mantém a sua escolha via cookie.
export const defaultLocale: Locale = "en"

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



