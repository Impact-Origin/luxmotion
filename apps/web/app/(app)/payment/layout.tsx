import { createNoIndexMetadata } from "@/lib/seo";
import { OpenAIPixel } from "@/components/analytics/openai-pixel";

export const metadata = createNoIndexMetadata("Payment");

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <OpenAIPixel />
    </>
  );
}
