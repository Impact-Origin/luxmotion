import { Inter, Cormorant_Garamond } from "next/font/google"

import { Suspense } from "react"
import "@workspace/ui/globals.css"
import { GoogleMapsProvider } from "@/components/providers/google-maps-provider"
import { TourCheckoutProvider } from "@/components/tours/tour-checkout-context"
import { TourCheckoutModal } from "@/components/tours/tour-checkout-modal"
import { TourCheckoutReturnHandler } from "@/components/tours/tour-checkout-return-handler"
import { WhatsAppFloat } from "@/components/new-landing-page/whatsapp-float"

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

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode
  }>) {
    return (
        <div className={`${fontSans.variable} ${fontTitle.variable} font-sans`}>
            <GoogleMapsProvider>
                <TourCheckoutProvider>
                    {children}
                    <Suspense fallback={null}>
                        <TourCheckoutReturnHandler />
                    </Suspense>
                    <TourCheckoutModal />
                    <WhatsAppFloat />
                </TourCheckoutProvider>
            </GoogleMapsProvider>
        </div>
    )
}