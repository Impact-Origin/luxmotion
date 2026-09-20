import { createNoIndexMetadata } from "@/lib/seo";
import { Suspense } from "react";
import { OpenAIPixel } from "@/components/analytics/openai-pixel";
import { CaptureAdSource } from "@/components/analytics/capture-ad-source";

export const metadata = createNoIndexMetadata("Payment");

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Suspense fallback={null}>
        <CaptureAdSource />
      </Suspense>
      <OpenAIPixel />
    </>
  );
}
