import { createNoIndexMetadata } from "@/lib/seo";

export const metadata = createNoIndexMetadata("Payment");

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
