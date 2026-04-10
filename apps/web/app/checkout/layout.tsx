import { Poppins } from "next/font/google";

import "@workspace/ui/globals.css";
import { GoogleMapsProvider } from "@/components/providers/google-maps-provider";
import { createNoIndexMetadata } from "@/lib/seo";

const fontSans = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata = createNoIndexMetadata("Checkout");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${fontSans.variable} font-sans `}>
      <GoogleMapsProvider>{children}</GoogleMapsProvider>
    </div>
  );
}
