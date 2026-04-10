import { createNoIndexMetadata } from "@/lib/seo";

export const metadata = createNoIndexMetadata("Preview Site");

export default function PreviewSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
