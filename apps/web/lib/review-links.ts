/**
 * Fichas públicas de avaliações. Estavam espalhadas por vários componentes (e o
 * link do Google já divergia entre páginas) — ficam aqui para mudarem num sítio
 * só.
 */
export const GOOGLE_REVIEWS_URL = "https://maps.app.goo.gl/tkYzTBBAHKnf7N467"
export const TRUSTPILOT_REVIEWS_URL =
  "https://www.trustpilot.com/review/easytransferericeira.com"

/** Atributos comuns a qualquer link para estas fichas (abrem noutro separador). */
export const REVIEW_LINK_PROPS = {
  target: "_blank",
  rel: "noopener noreferrer",
} as const
