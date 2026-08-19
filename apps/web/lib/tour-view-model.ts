/**
 * O tour já resolvido para um idioma, e a forma como as páginas o consomem.
 *
 * O `TourData` vivia dentro do ficheiro da página e era importado por três
 * componentes — mover a página partia-os. Vive aqui, ao lado da resolução de
 * idioma que o servidor e o `useTourBySlug` têm de partilhar para a hidratação
 * não divergir.
 */

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

type TourTranslation = {
  locale: string;
  title?: string;
  subtitle?: string;
  description?: unknown;
  included?: string[];
  excluded?: string[];
  seoTitle?: string;
  seoDescription?: string;
};

export type TourRecord = {
  originalLanguage?: string;
  title: string;
  subtitle?: string;
  description?: unknown;
  included?: string[];
  excluded?: string[];
  seoTitle?: string;
  seoDescription?: string;
  translations?: TourTranslation[];
};

export type TourView<T extends TourRecord = TourRecord> = {
  tour: T;
  title: string;
  subtitle?: string;
  description?: unknown;
  included?: string[];
  excluded?: string[];
  seoTitle?: string;
  seoDescription?: string;
};

export function resolveTourView<T extends TourRecord>(
  tour: T,
  locale: string,
): TourView<T> {
  const translation =
    locale && locale !== tour.originalLanguage
      ? tour.translations?.find((t) => t.locale === locale)
      : undefined;

  return {
    tour,
    title: translation?.title ?? tour.title,
    subtitle: translation?.subtitle ?? tour.subtitle,
    description: translation?.description ?? tour.description,
    included: translation?.included ?? tour.included,
    excluded: translation?.excluded ?? tour.excluded,
    seoTitle: translation?.seoTitle ?? tour.seoTitle,
    seoDescription: translation?.seoDescription ?? tour.seoDescription,
  };
}
