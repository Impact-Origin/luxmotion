export const PARTNERSHIP_LANDING_TEMPLATES = [
  "transfer",
  "whitelabel",
  "wedding-whitelabel",
] as const;

export type PartnershipLandingTemplate =
  (typeof PARTNERSHIP_LANDING_TEMPLATES)[number];

export const DEFAULT_PARTNERSHIP_LANDING_TEMPLATE: PartnershipLandingTemplate =
  "transfer";

export function isPartnershipLandingTemplate(
  value: string | undefined | null,
): value is PartnershipLandingTemplate {
  return (
    value !== undefined &&
    value !== null &&
    PARTNERSHIP_LANDING_TEMPLATES.includes(value as PartnershipLandingTemplate)
  );
}

export function resolvePartnershipLandingTemplate(
  value: string | undefined | null,
): PartnershipLandingTemplate {
  return isPartnershipLandingTemplate(value)
    ? value
    : DEFAULT_PARTNERSHIP_LANDING_TEMPLATE;
}
