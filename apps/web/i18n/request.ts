import { getRequestConfig } from "next-intl/server"
import { cookies } from "next/headers"
import { defaultLocale, locales, type Locale } from "./config"
import ptMessages from "../messages/pt.json"
import enMessages from "../messages/en.json"
import deMessages from "../messages/de.json"
import nlMessages from "../messages/nl.json"
import frMessages from "../messages/fr.json"
import esMessages from "../messages/es.json"

const messagesByLocale: Record<Locale, Record<string, unknown>> = {
  pt: ptMessages,
  en: enMessages,
  de: deMessages,
  nl: nlMessages,
  fr: frMessages,
  es: esMessages,
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value
  const locale = (locales.includes(localeCookie as Locale) ? localeCookie : defaultLocale) as Locale

  return {
    locale,
    timeZone: "Europe/Lisbon",
    messages: messagesByLocale[locale],
  }
})
