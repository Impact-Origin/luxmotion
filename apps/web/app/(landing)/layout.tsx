import { Montserrat, Yellowtail } from "next/font/google"

import { Suspense } from "react"
import "@workspace/ui/globals.css"
import { GoogleMapsProvider } from "@/components/providers/google-maps-provider"
import { TourCheckoutProvider } from "@/components/tours/tour-checkout-context"
import { TourCheckoutModal } from "@/components/tours/tour-checkout-modal"
import { TourCheckoutReturnHandler } from "@/components/tours/tour-checkout-return-handler"

const fontSans = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
})

const fontSignature = Yellowtail({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-signature",
})


export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode
  }>) {
    return (
        <div className={`${fontSans.variable} ${fontSignature.variable} font-sans`}>
            <GoogleMapsProvider>
                <TourCheckoutProvider>
                    {children}
                    <Suspense fallback={null}>
                        <TourCheckoutReturnHandler />
                    </Suspense>
                    <TourCheckoutModal />
                </TourCheckoutProvider>
            </GoogleMapsProvider>
        </div>
    )
}