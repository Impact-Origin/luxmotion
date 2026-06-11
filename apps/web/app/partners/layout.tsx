import { Inter, Cormorant_Garamond } from "next/font/google"
import "@workspace/ui/globals.css"
import { Header } from "@/components/new-landing-page/header"
import { Footer } from "@/components/new-landing-page/footer"
import { WhatsAppFloat } from "@/components/new-landing-page/whatsapp-float"
import { createNoIndexMetadata } from "@/lib/seo"

const fontSans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
})

const fontTitle = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-title",
})

export const metadata = createNoIndexMetadata("Partner Application")

export default function PartnersLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`${fontSans.variable} ${fontTitle.variable} font-sans bg-[#f7f4ef] text-[#1c1b18] min-h-screen flex flex-col`}
    >
      <Header variant="light" />
      <main className="flex-1 pt-[60px] lg:pt-[72px] flex flex-col">
        {children}
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
