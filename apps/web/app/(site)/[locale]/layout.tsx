import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";
import { getMessages, getTimeZone, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { ConvexClientProvider } from "@/components/providers/convex-client-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Poppins, Geist_Mono, Cormorant_Garamond, Montserrat } from "next/font/google";
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

// Vários blocos (hero social-proof, heros do wedding/schools) pedem Montserrat
// pelo nome; sem estar carregada aqui caíam em silêncio para a --font-sans.
const fontMontserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
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
    default: "LuxMotion | Private Transfers and Tours in Portugal",
    template: "%s | LuxMotion",
  },
  description:
    "Private transfers, tours, events, and premium mobility services across Portugal.",
  applicationName: "LuxMotion",
  keywords: [
    "Portugal transfers",
    "Lisbon airport transfer",
    "private tours Portugal",
    "chauffeur service Portugal",
    "LuxMotion",
    "LuxMotion by EasyTransfer",
  ],
  openGraph: {
    type: "website",
    siteName: "LuxMotion",
    url: "/",
    title: "LuxMotion | Private Transfers and Tours in Portugal",
    description:
      "Private transfers, tours, events, and premium mobility services across Portugal.",
    images: [{ url: absoluteUrl("/og-luxmotion.jpg") }],
    locale: "pt_PT",
  },
  twitter: {
    card: "summary_large_image",
    title: "LuxMotion | Private Transfers and Tours in Portugal",
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

/**
 * Uma variante estática por idioma. Sem isto, o Next só as geraria a pedido.
 */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Diz ao next-intl qual é o idioma desta rota. Sem esta chamada, cada página
  // volta a lê-lo dos cabeçalhos e passa a ser renderizada a pedido — sem erro
  // nenhum a avisar, só sem cache.
  setRequestLocale(locale);

  const messages = await getMessages();

  /* O dicionário inteiro é serializado dentro do HTML de todas as páginas: são
     266 KB, dos quais 38 KB são textos do admin que nenhuma página pública usa.
     Cortá-los aqui é seguro — o admin tem a sua própria raiz e recebe o
     dicionário completo. */
  const publicMessages = Object.fromEntries(
    Object.entries(messages as Record<string, unknown>).filter(
      ([key]) => !key.toLowerCase().startsWith("admin"),
    ),
  );
  const timeZone = await getTimeZone();

  return (
    <ClerkProvider signInUrl="/admin/sign-in">
      <ConvexClientProvider>
        <html
          lang={locale}
          suppressHydrationWarning
          className={`${fontSans.variable} ${fontMono.variable} ${fontTitle.variable} ${fontMontserrat.variable}`}
        >
          <body className="antialiased font-sans">
            <Providers
              locale={locale}
              messages={publicMessages}
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
