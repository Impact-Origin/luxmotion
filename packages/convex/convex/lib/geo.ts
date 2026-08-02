/**
 * Distância geodésica entre dois pontos.
 *
 * Esta fórmula estava copiada à letra dentro de `tours.listNearCoordinates` e
 * de `events.listNearCoordinates`, sem estar exportada em nenhum dos dois. Os
 * upsells do checkout precisam exactamente do mesmo cálculo, e uma terceira
 * cópia era o caminho para as três divergirem.
 */

const EARTH_RADIUS_KM = 6371;

const toRad = (deg: number) => (deg * Math.PI) / 180;

export type LatLng = { lat: number; lng: number };

export function haversineKm(a: LatLng, b: LatLng): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(a.lat)) *
      Math.cos(toRad(b.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

/** Uma casa decimal: é o que a UI mostra ("a 12,4 km"). */
export function roundKm(km: number): number {
  return Math.round(km * 10) / 10;
}
