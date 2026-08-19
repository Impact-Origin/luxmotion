import { defineRouting } from "next-intl/routing"
import { defaultLocale, locales } from "./config"

/**
 * Encaminhamento por idioma.
 *
 * Até aqui o idioma vinha do cookie NEXT_LOCALE e todos os idiomas partilhavam
 * o mesmo endereço: o Google, que não traz cookies, via sempre inglês, e as
 * outras cinco versões não existiam para ele. Com o prefixo no URL, cada idioma
 * passa a ter endereço próprio e a poder ser indexado — e, como deixa de haver
 * leitura de cookies, as páginas voltam a poder ser guardadas em cache.
 *
 * `always`: o inglês também leva prefixo (/en/tours). Os endereços antigos, sem
 * prefixo, são reencaminhados pelo middleware.
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
  // Mantém o cookie NEXT_LOCALE a funcionar: quem já escolheu um idioma é
  // levado para a versão certa em vez de cair sempre no inglês.
  localeDetection: true,
})
