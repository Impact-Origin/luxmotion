/**
 * O slug da parceria tal como vem do endereço.
 *
 * O Next entrega o segmento **codificado**: `/en/kiss&tell` chega ao código
 * como `"kiss%26tell"`. Na base de dados está `kiss&tell`, portanto procurar
 * pelo que chega não encontra nada e a página responde 404 — foi assim que uma
 * parceria criada no back-office ficou inalcançável sem ninguém perceber
 * porquê. Medido: pedir `/en/kiss&tell` e `/en/kiss%26tell` dá o mesmo valor
 * codificado; um slug só com letras chega intacto.
 *
 * Descodificar não é um remendo: é o que faltava. O que está no endereço é a
 * forma codificada do slug, e é o slug que se procura.
 *
 * Isto não dispensa a validação em `convex/partnerships.ts`, que já não deixa
 * criar slugs assim. Serve para os que já existem — e um slug com `&` continua
 * a não poder entrar no sitemap, que é XML.
 */
export function decodeReferralSlug(raw: string): string {
  try {
    return decodeURIComponent(raw)
  } catch {
    /* Um `%` solto no endereço faz o decode rebentar. Aí vale o texto
       original, que também não vai encontrar nada — mas 404 é melhor do que a
       página inteira a estoirar. */
    return raw
  }
}
