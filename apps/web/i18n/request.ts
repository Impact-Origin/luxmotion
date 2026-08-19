// messages reloaded: tourDetails.inquiry.confirmation added
import { getRequestConfig } from "next-intl/server"
import { hasLocale } from "next-intl"
import { cookies } from "next/headers"
import { routing } from "./routing"
import type { Locale } from "./config"
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

/**
 * O idioma vem do segmento do URL, não de um cookie.
 *
 * Era `cookies()` que estava aqui, e ler cookies obriga o Next a renderizar
 * tudo a pedido: nenhuma página do site podia ser guardada em cache. Vindo do
 * segmento, as páginas voltam a poder ser estáticas.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  let locale: Locale = routing.defaultLocale

  if (hasLocale(routing.locales, requested)) {
    locale = requested
  } else {
    // Fora do segmento de idioma — o checkout, o pagamento e o admin, que
    // mantêm os endereços antigos porque são alvo de retornos de gateway e de
    // links já entregues. Aí o cookie continua a mandar, como sempre mandou.
    const cookieLocale = (await cookies()).get("NEXT_LOCALE")?.value
    if (hasLocale(routing.locales, cookieLocale)) locale = cookieLocale
  }

  return {
    locale,
    timeZone: "Europe/Lisbon",
    messages: messagesByLocale[locale],
  }
})
