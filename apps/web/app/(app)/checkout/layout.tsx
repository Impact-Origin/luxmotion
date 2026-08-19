import { Inter, Cormorant_Garamond } from "next/font/google";

import "@workspace/ui/globals.css";
import { GoogleMapsProvider } from "@/components/providers/google-maps-provider";
import { createNoIndexMetadata } from "@/lib/seo";

const fontSans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

const fontTitle = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-title",
});

export const metadata = createNoIndexMetadata("Checkout");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${fontSans.variable} ${fontTitle.variable} font-sans checkout-dark`}>
      <GoogleMapsProvider>{children}</GoogleMapsProvider>
    </div>
  );
}
