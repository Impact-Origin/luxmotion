import { notFound } from "next/navigation"
import { Header } from "@/components/new-landing-page/header"
import { DestinationPageContent } from "@/components/tours/destination-page-content"
import { Footer } from "@/components/new-landing-page/footer"
import type { Metadata } from "next"
import { createPageMetadata } from "@/lib/seo"
import { JsonLd } from "@/components/seo/json-ld"
import { buildBreadcrumbSchema, buildServiceSchema } from "@/lib/structured-data"

const destinations: Record<string, string> = {
  lisboa: "Lisboa",
  porto: "Porto",
  algarve: "Algarve",
  alentejo: "Alentejo",
  acores: "Açores",
  madeira: "Madeira",
}

interface DestinationPageProps {
  params: Promise<{ destination: string }>
}

export function generateStaticParams() {
  return Object.keys(destinations).map((destination) => ({
    destination,
  }))
}

export async function generateMetadata({ params }: DestinationPageProps): Promise<Metadata> {
  const { destination } = await params
  const destinationName = destinations[destination]

  if (!destinationName) {
    return createPageMetadata({
      title: "Tours",
      description: "Explore our tours and experiences across Portugal.",
      path: "/tours",
    })
  }

  return createPageMetadata({
    title: `${destinationName} Tours`,
    description: `Explore curated tours and experiences in ${destinationName}.`,
    path: `/tours/${destination}`,
    image: "/tours_destination_hero.jpg",
    keywords: [destinationName, "Portugal tours", "private experiences"],
  })
}

export default async function DestinationPage({ params }: DestinationPageProps) {
  const { destination } = await params
  const destinationName = destinations[destination]

  if (!destinationName) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <JsonLd
        data={
          buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Tours", url: "/tours" },
            { name: destinationName, url: `/tours/${destination}` },
          ])
        }
      />
      <JsonLd
        data={
          buildServiceSchema({
            name: `${destinationName} Tours`,
            description: `Tailored tours and local experiences in ${destinationName}.`,
            path: `/tours/${destination}`,
            image: "/tours_destination_hero.jpg",
          })
        }
      />
      <Header />
      <div className="pt-[46px] md:pt-[46px]">
        <DestinationPageContent destination={destinationName} slug={destination} />
      </div>
      <Footer />
    </div>
  )
}
