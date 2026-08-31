import type { ThemeConfig } from "@/components/dynamic-theme-provider";
import {
  resolvePartnershipLandingTemplate,
  type PartnershipLandingTemplate,
} from "@/lib/partnership-landing-templates";
import { TransferLanding } from "./transfer-landing";
import { WhitelabelLanding } from "./whitelabel-landing";
import { WeddingWhitelabelLanding } from "./wedding-whitelabel-landing";

export function PartnershipLanding({
  template,
  theme,
  logoUrl,
  heroImageUrl,
  partnerName,
  partnershipSlug,
  isPreviewMode = false,
}: {
  template?: PartnershipLandingTemplate | string | null;
  theme?: Partial<ThemeConfig>;
  logoUrl?: string | null;
  heroImageUrl?: string | null;
  partnerName?: string;
  partnershipSlug?: string;
  isPreviewMode?: boolean;
}) {
  const resolvedTemplate = resolvePartnershipLandingTemplate(template);

  switch (resolvedTemplate) {
    case "whitelabel":
      return (
        <WhitelabelLanding
          logoUrl={logoUrl}
          heroImageUrl={heroImageUrl}
          partnershipSlug={partnershipSlug}
          partnerName={partnerName}
          themeMode={theme?.themeMode}
        />
      );
    case "wedding-whitelabel":
      return (
        <WeddingWhitelabelLanding
          logoUrl={logoUrl}
          partnerName={partnerName}
          heroImageUrl={heroImageUrl}
          partnershipSlug={partnershipSlug}
        />
      );
    case "transfer":
    default:
      return (
        <TransferLanding
          theme={theme}
          logoUrl={logoUrl}
          isPreviewMode={isPreviewMode}
        />
      );
  }
}
