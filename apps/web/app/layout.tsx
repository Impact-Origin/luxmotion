import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";
import { getLocale, getMessages, getTimeZone } from "next-intl/server";
import { ConvexClientProvider } from "@/components/providers/convex-client-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Poppins, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import type { Metadata } from "next";
import { absoluteUrl, getSiteUrl } from "@/lib/seo";

const fontSans = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const fontTitle = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-title",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Easy Transfer | Private Transfers and Tours in Portugal",
    template: "%s | Easy Transfer",
  },
  description:
    "Private transfers, tours, events, and premium mobility services across Portugal.",
  applicationName: "Easy Transfer",
  keywords: [
    "Portugal transfers",
    "Lisbon airport transfer",
    "private tours Portugal",
    "chauffeur service Portugal",
    "Easy Transfer",
  ],
  openGraph: {
    type: "website",
    siteName: "Easy Transfer",
    url: "/",
    title: "Easy Transfer | Private Transfers and Tours in Portugal",
    description:
      "Private transfers, tours, events, and premium mobility services across Portugal.",
    images: [{ url: absoluteUrl("/og-luxmotion.jpg") }],
    locale: "pt_PT",
  },
  twitter: {
    card: "summary_large_image",
    title: "Easy Transfer | Private Transfers and Tours in Portugal",
    description:
      "Private transfers, tours, events, and premium mobility services across Portugal.",
    images: [absoluteUrl("/og-luxmotion.jpg")],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const timeZone = await getTimeZone();

  return (
    <ClerkProvider signInUrl="/admin/sign-in">
      <ConvexClientProvider>
        <html
          lang={locale}
          suppressHydrationWarning
          className={`${fontSans.variable} ${fontMono.variable} ${fontTitle.variable}`}
        >
          <body className="antialiased font-sans">
            <Providers
              locale={locale}
              messages={messages as Record<string, unknown>}
              timeZone={timeZone}
            >
              {children}
            </Providers>
          </body>
        </html>
      </ConvexClientProvider>
    </ClerkProvider>
  );
}
