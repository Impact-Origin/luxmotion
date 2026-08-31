/**
 * As regras de preço dos transfers, num sítio só.
 *
 * Estiveram sempre no browser (hooks/use-vehicles.ts) e o servidor gravava o
 * que o checkout mandasse. Isso deu pelo menos duas viagens nocturnas cobradas
 * sem a taxa: o preço era calculado uma vez, guardado como fotografia no
 * veículo escolhido, e se a data mudasse depois a fotografia ficava velha.
 *
 * Aqui o cálculo é uma função pura, sem React e sem estado, e é o servidor que
 * a corre. O checkout passa a mostrar o número que o servidor devolve.
 */

/** Percentagem sobre a tarifa de dia, para pernas em horário nocturno. */
export const NIGHT_TAX_PERCENT = 20;
/** Mínimo por perna, quando os 20% ficam abaixo deste valor. */
export const NIGHT_TAX_MIN_EUR = 9;

/**
 * Horário nocturno: das 20h às 08h.
 *
 * Recebe a data como está gravada — "YYYY-MM-DD HH:mm[:ss]", hora local, sem
 * fuso. Uma data sem hora não é noite: mais vale não cobrar do que cobrar por
 * causa de um campo em branco.
 */
export function isNightDeparture(departureDate: string | undefined | null): boolean {
  if (!departureDate) return false;
  const match = /^\d{4}-\d{2}-\d{2}[ T](\d{2}):/.exec(departureDate);
  if (!match) return false;
  const hour = Number(match[1]);
  if (!Number.isFinite(hour)) return false;
  return hour >= 20 || hour < 8;
}

export type LegPricingInput = {
  pricePerKm: number;
  minimumPrice: number;
  /** Distância de uma perna, em quilómetros. */
  distance?: number | null;
  isNight: boolean;
  isNightReturn?: boolean;
  bookReturn?: boolean;
  /** A recolha da ida é num aeroporto: acresce a percentagem abaixo a essa perna. */
  isAirportPickup?: boolean;
  airportSurchargePercent?: number;
};

export type LegPricing = {
  /** O que o cliente paga pelo transfer, já com noite e aeroporto. */
  price: number;
  /** O mesmo sem a taxa noturna, para a linha do detalhe. */
  dayPrice: number;
  nightTaxOutbound: number;
  nightTaxReturn: number;
  hasDistance: boolean;
};

function nightTaxFor(dayBase: number): number {
  return Math.max(dayBase * (NIGHT_TAX_PERCENT / 100), NIGHT_TAX_MIN_EUR);
}

/**
 * O preço de um veículo para uma viagem.
 *
 * A taxa noturna incide sobre a tarifa de dia de cada perna, e cada perna tem o
 * seu horário: uma ida à meia-noite com volta às dez da manhã leva taxa só na
 * ida. A sobretaxa de aeroporto aplica-se apenas à perna cuja recolha é no
 * aeroporto, e antes da taxa noturna.
 */
export function priceVehicle(input: LegPricingInput): LegPricing {
  const {
    pricePerKm,
    minimumPrice,
    distance,
    isNight,
    isNightReturn = false,
    bookReturn = false,
    isAirportPickup = false,
    airportSurchargePercent = 0,
  } = input;

  const hasDistance = distance !== undefined && distance !== null && distance > 0;
  const airportPct = isAirportPickup ? airportSurchargePercent / 100 : 0;

  if (!hasDistance) {
    return {
      price: 0,
      dayPrice: 0,
      nightTaxOutbound: 0,
      nightTaxReturn: 0,
      hasDistance: false,
    };
  }

  const legBase = Math.max(minimumPrice, pricePerKm * distance!);

  if (bookReturn) {
    const airportSurcharge = legBase * airportPct;
    const dayPrice = legBase + legBase + airportSurcharge;
    const nightTaxOutbound = isNight ? nightTaxFor(legBase) : 0;
    const nightTaxReturn = isNightReturn ? nightTaxFor(legBase) : 0;
    return {
      price: dayPrice + nightTaxOutbound + nightTaxReturn,
      dayPrice,
      nightTaxOutbound,
      nightTaxReturn,
      hasDistance: true,
    };
  }

  const airportSurcharge = legBase * airportPct;
  const dayPrice = legBase + airportSurcharge;
  const nightTaxOutbound = isNight ? nightTaxFor(legBase) : 0;
  return {
    price: dayPrice + nightTaxOutbound,
    dayPrice,
    nightTaxOutbound,
    nightTaxReturn: 0,
    hasDistance: true,
  };
}
