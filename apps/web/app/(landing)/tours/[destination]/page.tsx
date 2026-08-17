import { notFound } from "next/navigation";
import {
  HomeThemeProvider,
  HomeHeader,
} from "@/components/new-landing-page/home-theme";
import { DestinationPageContent } from "@/components/tours/destination-page-content";
import { Footer } from "@/components/new-landing-page/footer";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import {
  buildBreadcrumbSchema,
  buildServiceSchema,
} from "@/lib/structured-data";

/* O universo de destinos vive em três sítios que têm de andar a par: aqui (as
   rotas), em `components/tours/destination-nav.tsx` (a barra) e em
   `components/admin/constants.ts` (o que o admin deixa escolher). Faltar num
   deles dá uma página sem entrada no menu, ou uma entrada que dá 404. */
const destinations: Record<string, string> = {
  lisboa: "Lisboa",
  porto: "Porto",
  ericeira: "Ericeira",
  algarve: "Algarve",
  alentejo: "Alentejo",
  acores: "Açores",
  madeira: "Madeira",
};

interface DestinationPageProps {
  params: Promise<{ destination: string }>;
}

export function generateStaticParams() {
  return Object.keys(destinations).map((destination) => ({
    destination,
  }));
}

export async function generateMetadata({
  params,
}: DestinationPageProps): Promise<Metadata> {
  const { destination } = await params;
  const destinationName = destinations[destination];

  if (!destinationName) {
    return createPageMetadata({
      title: "Tours",
      description: "Explore our tours and experiences across Portugal.",
      path: "/tours",
    });
  }

  return createPageMetadata({
    title: `${destinationName} Tours`,
    description: `Explore curated tours and experiences in ${destinationName}.`,
    path: `/tours/${destination}`,
    image: "/tours/tours-destination-hero.webp",
    keywords: [destinationName, "Portugal tours", "private experiences"],
  });
}

export default async function DestinationPage({
  params,
}: DestinationPageProps) {
  const { destination } = await params;
  const destinationName = destinations[destination];

  if (!destinationName) {
    notFound();
  }

  return (
    <HomeThemeProvider>
      <>
        <JsonLd
          data={buildBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Tours", url: "/tours" },
            { name: destinationName, url: `/tours/${destination}` },
          ])}
        />
        <JsonLd
          data={buildServiceSchema({
            name: `${destinationName} Tours`,
            description: `Tailored tours and local experiences in ${destinationName}.`,
            path: `/tours/${destination}`,
            image: "/tours/tours-destination-hero.webp",
          })}
        />
        <HomeHeader />
        <div className="pt-[46px] md:pt-[46px]">
          <DestinationPageContent
            destination={destinationName}
            slug={destination}
          />
        </div>
        <Footer />
      </>
    </HomeThemeProvider>
  );
}
