import { PartnershipLanding } from "@/components/partnerships/partnership-landing";
import { fetchQuery } from "convex/nextjs";
import { api } from "@workspace/convex/api";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { createNoIndexMetadata, createPageMetadata } from "@/lib/seo";
import { buildBreadcrumbSchema, buildServiceSchema } from "@/lib/structured-data";
import { resolvePartnershipLandingTemplate } from "@/lib/partnership-landing-templates";

export default async function ReferralLandingPage({
  params,
}: {
  params: Promise<{ referral: string }>;
}) {
  const { referral } = await params;

  const partnership = await fetchQuery(api.partnerships.getBySlug, {
    slug: referral,
  });

  if (!partnership || partnership.status === "inactive") {
    notFound();
  }

  const seoTitle =
    partnership.content?.seoTitle ||
    partnership.content?.heroTitle ||
    partnership.name;

  const seoDescription =
    partnership.content?.seoDescription ||
    partnership.welcomeMessage ||
    `Custom landing page for ${partnership.name} powered by Easy Transfer.`;

  const landingTemplate = resolvePartnershipLandingTemplate(
    partnership.landingTemplate,
  );

  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: partnership.name, url: `/${referral}` },
        ])}
      />
      <JsonLd
        data={buildServiceSchema({
          name: seoTitle,
          description: seoDescription,
          path: `/${referral}`,
          image: partnership.logoUrl,
        })}
      />
      <PartnershipLanding
        template={landingTemplate}
        theme={partnership.theme}
        logoUrl={partnership.logoUrl}
        heroImageUrl={partnership.heroImageUrl}
        partnerName={partnership.name}
        partnershipSlug={referral}
      />
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ referral: string }>;
}): Promise<Metadata> {
  const { referral } = await params;
  const partnership = await fetchQuery(api.partnerships.getBySlug, {
    slug: referral,
  });

  if (!partnership || partnership.status === "inactive") {
    return createNoIndexMetadata("Partner page");
  }

  const seoTitle =
    partnership.content?.seoTitle ||
    partnership.content?.heroTitle ||
    partnership.name;

  const seoDescription =
    partnership.content?.seoDescription ||
    partnership.welcomeMessage ||
    `Custom landing page for ${partnership.name} powered by Easy Transfer.`;

  return createPageMetadata({
    title: seoTitle,
    description: seoDescription,
    path: `/${referral}`,
    image: partnership.logoUrl,
    noIndex: partnership.status === "inactive",
  });
}
