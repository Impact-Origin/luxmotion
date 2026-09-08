/**
 * Reconhecer uma recolha no aeroporto, para lhe somar a sobretaxa
 * ("ideia do Afonso" — a percentagem está em `siteSettings.airportSurchargePercent`).
 *
 * A pista é o texto da morada de recolha. Isso só funciona porque o texto
 * guardado passou a trazer o nome do sítio à frente da morada postal — ver
 * `rotularSitio` em `components/ui/google-places-input.tsx`. Até aqui guardava-se
 * só o `formatted_address` do Google, que no aeroporto de Lisboa é "Alameda das
 * Comunidades Portuguesas, 1700-111 Lisboa": sem a palavra "aeroporto", a
 * sobretaxa nunca somava a quem escolhia o aeroporto na lista de sugestões.
 *
 * O nome vem do Google no idioma do **browser** de quem reserva, e não no
 * idioma do site — o script do Maps é carregado sem `language`. Por isso a
 * lista não são os seis idiomas do site: são os idiomas de quem viaja para
 * Portugal. Falta um? A recolha deixa de levar sobretaxa, que é o lado errado
 * mas inofensivo — nunca cobra a mais a quem não está no aeroporto.
 */
const AIRPORT_KEYWORDS = [
  "airport", // en
  "aeroporto", // pt, it
  "aeropuerto", // es
  "aéroport", // fr
  "aeroport", // fr sem acento, ca
  "flughafen", // de
  "luchthaven", // nl
  "vliegveld", // nl
  "lufthavn", // da, no
  "flygplats", // sv
  "lentoasema", // fi
  "lotnisko", // pl
  "letiště", // cs
  "letiste",
  "havalimanı", // tr
  "havalimani",
  "repülőtér", // hu
  "aerodrom", // hr, sr, ro
]

/** True when a free-text location string looks like an airport. */
export function isAirportLocation(text: string | null | undefined): boolean {
  if (!text) return false
  const value = text.toLowerCase()
  return AIRPORT_KEYWORDS.some((keyword) => value.includes(keyword))
}

/**
 * Os aeroportos portugueses pelo identificador do Google.
 *
 * A rede de segurança da lista de palavras acima. O identificador é o mesmo
 * seja qual for o idioma do browser, portanto quem reserve num idioma que não
 * esteja na lista continua a levar a sobretaxa. Foram lidos da API do Google
 * (Find Place), e o nome ao lado é o que ela devolveu.
 *
 * Escolher o Terminal 1 ou o parque de estacionamento dá outro identificador —
 * esses ficam para a lista de palavras, porque trazem "Aeroporto" no nome.
 */
const AIRPORT_PLACE_IDS: Record<string, string> = {
  ChIJgwHZFkYyGQ0RRm0DWD6lZgo: "Lisboa · Humberto Delgado",
  ChIJrStKYWRvJA0R0TlgbYpXGhU: "Porto · Francisco Sá Carneiro",
  ChIJm5mnTbBSBQ0RRztnYx5VRCE: "Faro · Gago Coutinho",
  ChIJ6xlRBVRiYAwR7cmGjBb7wVY: "Madeira · Cristiano Ronaldo",
  "ChIJ-QPpnfoqQwsR1yGd6x257gU": "Ponta Delgada · João Paulo II",
  ChIJn3CH1mjPHg0RCIXOSj2NWKY: "Cascais · Tires",
}

/**
 * A recolha é num aeroporto?
 *
 * Duas pistas, e basta uma. O identificador do Google é exacto mas só existe
 * para quem escolheu o sítio na lista; o texto apanha o resto — moradas
 * escritas à mão, terminais, e os aeroportos que não estão na tabela.
 */
export function isAirportPickup(pickup: {
  text?: string | null
  placeId?: string | null
}): boolean {
  if (pickup.placeId && AIRPORT_PLACE_IDS[pickup.placeId]) return true
  return isAirportLocation(pickup.text)
}

/** Percentage added to the base transfer fare when the pickup is an airport. */
export const AIRPORT_SURCHARGE_PERCENT = 12
