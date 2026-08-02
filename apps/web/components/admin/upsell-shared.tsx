/** Vocabulário partilhado pelos dois formulários de upsell e pela lista. */

export type UpsellTag = "none" | "recommended" | "mostPopular"

export const TAG_LABELS: Record<UpsellTag, string> = {
  none: "Sem selo",
  recommended: "Recomendado",
  mostPopular: "Mais popular",
}

export type UpsellPricingModel = "perPerson" | "flat"

export const PRICING_LABELS: Record<UpsellPricingModel, string> = {
  perPerson: "Por pessoa",
  flat: "Preço fixo",
}
