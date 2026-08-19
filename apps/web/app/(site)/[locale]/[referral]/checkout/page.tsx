import { setRequestLocale } from "next-intl/server"
import { CheckoutPage } from "@/components/customizable-checkout/checkout-page"
import { DynamicThemeProvider } from "@/components/dynamic-theme-provider"
import { fetchQuery } from "convex/nextjs";
import { api } from "@workspace/convex/api";
import { notFound } from "next/navigation";
import { CaptureReferral } from "@/components/referral/capture-referral";

export default async function Page({
  params
}: {
  params: Promise<{ locale: string; referral: string }>
}) {
  const { locale, referral } = await params;
  setRequestLocale(locale);

  const partnership = await fetchQuery(api.partnerships.getBySlug, { slug: referral });

  if (!partnership || partnership.status === "inactive") {
    notFound();
  }

  return (
    <DynamicThemeProvider theme={partnership.theme}>
      {/* Valid, active partnership: drop a first-party referral cookie so a later
          order (even one placed on the main-site checkout) still attributes here. */}
      <CaptureReferral slug={referral} />
      <CheckoutPage partnershipSlug={referral} />
    </DynamicThemeProvider>
  )
}
