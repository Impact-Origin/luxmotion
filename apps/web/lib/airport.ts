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
 * Os aeroportos portugueses: identificador do Google e coordenadas.
 *
 * Ambos vieram da API do Google (Place Details), não de memória.
 */
type Aeroporto = { nome: string; placeId: string; lat: number; lng: number }

const AEROPORTOS: Aeroporto[] = [
  { nome: "Lisboa · Humberto Delgado", placeId: "ChIJgwHZFkYyGQ0RRm0DWD6lZgo", lat: 38.7788454, lng: -9.1319758 },
  { nome: "Porto · Francisco Sá Carneiro", placeId: "ChIJrStKYWRvJA0R0TlgbYpXGhU", lat: 41.2473992, lng: -8.6806638 },
  { nome: "Faro · Gago Coutinho", placeId: "ChIJm5mnTbBSBQ0RRztnYx5VRCE", lat: 37.0165746, lng: -7.9705537 },
  { nome: "Madeira · Cristiano Ronaldo", placeId: "ChIJ6xlRBVRiYAwR7cmGjBb7wVY", lat: 32.6975155, lng: -16.774145 },
  { nome: "Ponta Delgada · João Paulo II", placeId: "ChIJ-QPpnfoqQwsR1yGd6x257gU", lat: 37.7493461, lng: -25.7103849 },
  { nome: "Cascais · Tires", placeId: "ChIJn3CH1mjPHg0RCIXOSj2NWKY", lat: 38.7247009, lng: -9.3534113 },
]

/**
 * A distância ao aeroporto até à qual a recolha conta como recolha de
 * aeroporto.
 *
 * O terminal não é um ponto: a Alameda das Comunidades Portuguesas, que é a
 * rua do próprio aeroporto de Lisboa, fica a 1,36 km do centro que o Google
 * devolve. Um raio pequeno de mais deixava de fora quem escreve a morada da
 * gare em vez de escolher o aeroporto na lista.
 *
 * O preço de dois quilómetros, medido: apanha também os Olivais (1,58 km), a
 * Portela (1,87 km) e a Av. de Berlim (1,96 km). Uma recolha aí leva os 12%
 * sem ser no aeroporto. Ficam de fora Moscavide (2,55 km), Alvalade (3,07 km)
 * e o Parque das Nações (3,33 km).
 */
export const AIRPORT_RADIUS_KM = 2

/** Distância em quilómetros entre dois pontos (haversine). */
function distanciaKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371.0088
  const rad = (g: number) => (g * Math.PI) / 180
  const dLat = rad(bLat - aLat)
  const dLng = rad(bLng - aLng)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(aLat)) * Math.cos(rad(bLat)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

/**
 * A recolha é num aeroporto?
 *
 * Três pistas, e basta uma:
 *
 *   coordenadas  — a que manda. Não depende do idioma nem de o sítio ter sido
 *                  escolhido na lista, e apanha as moradas de dentro do
 *                  aeroporto que não trazem a palavra no nome.
 *   identificador — exacto para quem escolheu o aeroporto na lista.
 *   texto         — a rede de segurança para quando não há coordenadas ainda,
 *                   e para os aeroportos que não estão na tabela.
 */
export function isAirportPickup(pickup: {
  text?: string | null
  placeId?: string | null
  lat?: number | null
  lng?: number | null
}): boolean {
  const { text, placeId, lat, lng } = pickup

  if (typeof lat === "number" && typeof lng === "number" && Number.isFinite(lat) && Number.isFinite(lng)) {
    const perto = AEROPORTOS.some(
      (a) => distanciaKm(lat, lng, a.lat, a.lng) <= AIRPORT_RADIUS_KM,
    )
    if (perto) return true
  }

  if (placeId && AEROPORTOS.some((a) => a.placeId === placeId)) return true

  return isAirportLocation(text)
}

/** Percentage added to the base transfer fare when the pickup is an airport. */
export const AIRPORT_SURCHARGE_PERCENT = 12
