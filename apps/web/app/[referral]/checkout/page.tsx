import { CheckoutPage } from "@/components/customizable-checkout/checkout-page"
import { DynamicThemeProvider } from "@/components/dynamic-theme-provider"
import { fetchQuery } from "convex/nextjs";
import { api } from "@workspace/convex/api";
import { notFound } from "next/navigation";

export default async function Page({
  params
}: {
  params: Promise<{ referral: string }>
}) {
  const { referral } = await params;

  const partnership = await fetchQuery(api.partnerships.getBySlug, { slug: referral });

  if (!partnership || partnership.status === "inactive") {
    notFound();
  }

  return (
    <DynamicThemeProvider theme={partnership.theme}>
      <CheckoutPage partnershipSlug={referral} />
    </DynamicThemeProvider>
  )
}
