import { fetchQuery } from "convex/nextjs"
import { api } from "@workspace/convex/api"
import { Suspense } from "react"
import { Header } from "@/components/new-landing-page/header"
import { Footer } from "@/components/new-landing-page/footer"
import { AllToursBrowser } from "@/components/ultra-luxury-tours/browse/all-tours-browser"

export default async function UltraLuxuryAllToursPage() {
  const initialTours = await fetchQuery(api.tours.listUltraLuxury, {}).catch(() => null)

  return (
    <div className="min-h-screen bg-white text-[#0d0d0d]">
      <Header />
      <div className="pt-[46px] md:pt-[46px]">
        <Suspense fallback={<div className="min-h-[520px]" />}>
          <AllToursBrowser initialTours={initialTours} />
        </Suspense>
      </div>
      <Footer />
    </div>
  )
}
