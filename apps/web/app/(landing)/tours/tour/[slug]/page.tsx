import {
  HomeThemeProvider,
  HomeHeader,
} from "@/components/new-landing-page/home-theme";
import { ToursTopBar } from "@/components/tours/tours-top-bar";
import { ToursCartBar } from "@/components/tours/tours-cart-bar";
import { Footer } from "@/components/new-landing-page/footer";
import { TourDetailsWrapper } from "@/components/tours/tour-details-wrapper";
import type { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "@workspace/convex/api";
import { getLocale } from "next-intl/server";
import { JsonLd } from "@/components/seo/json-ld";
import {
  createNoIndexMetadata,
  createPageMetadata,
  extractTextContent,
} from "@/lib/seo";
import {
  buildBreadcrumbSchema,
  buildServiceSchema,
} from "@/lib/structured-data";

export interface Review {
  author: string;
  avatar?: string;
  rating: number;
  text: string;
  source?: string;
  nationality?: string;
  createdAt?: number;
}

export interface MeetingPoint {
  title: string;
  address: string;
  description?: string;
  lat?: number;
  lng?: number;
}

export interface TourData {
  _id?: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string | Record<string, any>;
  tourType: string;
  category?: "tours" | "experiences" | "private";
  duration: string;
  groupSize: string;
  languages: string[];
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  bannerImage: string;
  additionalBanners: { url: string; type: "image" | "video" }[];
  images: string[];

  included: string[];
  excluded: string[];
  itinerary: {
    time: string;
    title: string;
    description: string;
    image?: string;
    lat?: number;
    lng?: number;
  }[];
  pickup: MeetingPoint;
  dropoff: MeetingPoint;
  mapCenter: {
    lat: number;
    lng: number;
  };
  reviews: Review[];
  cancellationPolicy: string;
  minPassengers?: number;
  maxPassengers?: number;
  addons?: {
    _id: string;
    title: string;
    description?: string;
    imageUrl?: string | null;
    price: number;
    pricingType: "per_person" | "flat";
    currency: string;
  }[];
}

interface TourDetailsPageProps {
  params: Promise<{ slug: string }>;
}

type TourTranslation = {
  locale: string;
  title?: string;
  description?: unknown;
  seoTitle?: string;
  seoDescription?: string;
};

type TourSeoSource = {
  title: string;
  description?: unknown;
  seoTitle?: string;
  seoDescription?: string;
  translations?: TourTranslation[];
  bannerImageUrl?: string | null;
  tags?: string[];
  status?: string;
  destination?: string;
};

function resolveTourSeo(tour: TourSeoSource, locale: string) {
  const translation = tour.translations?.find(
    (item: { locale: string }) => item.locale === locale,
  );

  const title =
    translation?.seoTitle || translation?.title || tour.seoTitle || tour.title;

  const description =
    translation?.seoDescription ||
    extractTextContent(translation?.description) ||
    tour.seoDescription ||
    extractTextContent(tour.description);

  return {
    title,
    description,
  };
}

export async function generateMetadata({
  params,
}: TourDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const tour = await fetchQuery(api.tours.getBySlug, { slug });

  if (!tour) {
    return createNoIndexMetadata("Tour not found");
  }

  const seo = resolveTourSeo(tour, locale);

  return createPageMetadata({
    title: seo.title,
    description: seo.description,
    path: `/tours/tour/${slug}`,
    image: tour.bannerImageUrl,
    keywords: tour.tags,
    noIndex: tour.status !== "published",
  });
}

export default async function TourDetailsPage({
  params,
}: TourDetailsPageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const tour = await fetchQuery(api.tours.getBySlug, { slug });
  const seo = tour ? resolveTourSeo(tour, locale) : null;

  return (
    <HomeThemeProvider>
      <div className="pb-[var(--cart-bar-h,0px)] [--tours-bar-h:30px] md:[--tours-bar-h:36px]">
        <ToursTopBar />
        {tour && seo && (
          <>
            <JsonLd
              data={buildBreadcrumbSchema([
                { name: "Home", url: "/" },
                { name: "Tours", url: "/tours" },
                { name: seo.title, url: `/tours/tour/${slug}` },
              ])}
            />
            <JsonLd
              data={buildServiceSchema({
                name: seo.title,
                description: seo.description,
                path: `/tours/tour/${slug}`,
                image: tour.bannerImageUrl,
                areaServed: tour.destination || "Portugal",
              })}
            />
          </>
        )}
        <HomeHeader
          transparentOverHero
          transparentOverHeroMobileOnly
          heroScrollThreshold={100}
        />
        {/* A faixa de topo é fixa; sem este espaço tapava o cimo da
            galeria, porque aqui o header flutua por cima da hero. */}
        <div className="pt-[30px] md:pt-[36px]">
          <TourDetailsWrapper slug={slug} />
        </div>
        <Footer />
        <ToursCartBar />
      </div>
    </HomeThemeProvider>
  );
}
