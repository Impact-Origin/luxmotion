"use client";

import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@workspace/convex/api";
import type { NearbyTour } from "@/components/checkout/experiences-step";
import { useSafeQuery } from "@/hooks/use-safe-query";
import { useCheckoutRadiiKm } from "@/hooks/use-site-settings";

interface UseNearbyToursProps {
  lat: number | null;
  lng: number | null;
  /** Só para casos especiais: por omissão vêm das definições do admin. */
  radiusKm?: number;
}

type UpsellLists = {
  stops: NonNullable<
    ReturnType<typeof useQuery<typeof api.upsells.listForDestination>>
  >["stops"];
  experiences: NonNullable<
    ReturnType<typeof useQuery<typeof api.upsells.listForDestination>>
  >["experiences"];
};

const NO_UPSELLS: UpsellLists = { stops: [], experiences: [] };

function formatEventDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

export function useNearbyTours({ lat, lng, radiusKm }: UseNearbyToursProps) {
  /* Dois raios distintos, ambos do admin (/admin/numbers): quem procura um tour
     no destino quer resultados apertados, quem já vai a caminho aceita um
     desvio maior. Antes eram 30 km fixos escondidos no backend, iguais para os
     dois. */
  const { toursKm: toursRadiusKm, upsellKm: upsellRadiusKm } =
    useCheckoutRadiiKm();
  const hasPlace = lat != null && lng != null;
  const effectiveToursRadiusKm = radiusKm ?? toursRadiusKm;
  const effectiveUpsellRadiusKm = radiusKm ?? upsellRadiusKm;

  const tours = useQuery(
    api.tours.listNearCoordinates,
    hasPlace && effectiveToursRadiusKm != null
      ? { lat, lng, radiusKm: effectiveToursRadiusKm }
      : "skip"
  );

  const events = useQuery(
    api.events.listNearCoordinates,
    hasPlace && effectiveToursRadiusKm != null
      ? { lat, lng, radiusKm: effectiveToursRadiusKm }
      : "skip"
  );

  /* Paragens extra e experiências passaram a ter tabelas próprias, geridas em
     /admin/upsells. A query trata do cross-match: universais aparecem sempre,
     os restantes só se estiverem dentro do raio do destino.

     `useQueries` e não `useQuery`, pela mesma razão que `use-site-settings.ts`:
     se esta função ainda não estiver no deployment — o frontend vai ao ar pelo
     Vercel, o backend só com `npx convex deploy` — o `useQuery` RE-LANÇA o erro
     durante o render. Como este hook vive na raiz da página de checkout, isso
     não escondia só as secções novas: derrubava a página inteira, incluindo os
     tours, os eventos e o pagamento. Aqui o erro chega como VALOR e degrada
     para "não há upsells". */
  const { data: upsellsData, error: upsellsError } = useSafeQuery(
    api.upsells.listForDestination,
    hasPlace && effectiveUpsellRadiusKm != null
      ? { lat, lng, radiusKm: effectiveUpsellRadiusKm }
      : "skip"
  );

  const upsells = upsellsError ? NO_UPSELLS : upsellsData;

  const allItems = useMemo(() => {
    const transformedEvents: NearbyTour[] = (events ?? []).map((event) => ({
      _id: event._id,
      slug: event.slug,
      title: event.title,
      subtitle: event.subtitle,
      description: event.description,
      bannerImageUrl: event.bannerImageUrl,
      basePrice: event.basePrice,
      duration: formatEventDate(event.eventDate),
      distanceKm: event.distanceKm,
      category: "events" as const,
      addons: event.addons,
    }));

    const transformedStops: NearbyTour[] = (upsells?.stops ?? []).map((stop) => ({
      _id: stop._id,
      slug: "",
      title: stop.title,
      description: stop.description,
      bannerImageUrl: stop.imageUrl,
      basePrice: stop.price30,
      duration: "30 min",
      /* As duas durações seguem para o cartão e para o modal. O preço de 15
         minutos era pedido no admin e não chegava a lado nenhum. */
      durations: [
        ...(stop.price15 != null ? [{ minutes: 15, price: stop.price15 }] : []),
        { minutes: 30, price: stop.price30 },
      ],
      locationLabel: stop.location?.title ?? undefined,
      // Universais não têm distância: mostrar "a 0 km" seria uma mentira.
      distanceKm: stop.distanceKm ?? undefined,
      category: "upsellStop" as const,
      tag: stop.tag,
      // Uma paragem cobra-se por paragem: quatro pessoas numa de €15 pagam €15.
      flatPrice: true,
      hasDateField: false,
      hasSpecialRequest: true,
      location: stop.location,
    }));

    const transformedUpsellExperiences: NearbyTour[] = (
      upsells?.experiences ?? []
    ).map((experience) => ({
      _id: experience._id,
      slug: "",
      title: experience.title,
      description: experience.description,
      bannerImageUrl: experience.imageUrl,
      basePrice: experience.basePrice,
      duration: experience.duration,
      distanceKm: experience.distanceKm ?? undefined,
      category: "upsellExperience" as const,
      tag: experience.tag,
      priceNote: experience.pricingModel === "perPerson" ? "/ pessoa" : undefined,
      flatPrice: experience.pricingModel === "flat",
      hasDateField: experience.hasDateField,
      hasSpecialRequest: experience.hasSpecialRequest,
      location: experience.location,
      locationLabel: experience.location?.title ?? undefined,
      addons: experience.addons.map((addon) => ({
        _id: addon.id,
        title: addon.name,
        price: addon.price,
        pricingType: addon.pricingType,
        currency: experience.currency,
      })),
    }));

    // As categorias `stops` e `experiences` de `tours` deixam de ser oferecidas:
    // foram substituídas pelas tabelas de upsells. Ficam na base de dados até a
    // migração ser dada por boa, mas não voltam ao checkout.
    const legacyFiltered = (tours ?? []).filter(
      (tour) => tour.category !== "stops" && tour.category !== "experiences"
    );

    return [
      ...legacyFiltered,
      ...transformedEvents,
      ...transformedStops,
      ...transformedUpsellExperiences,
    ];
  }, [tours, events, upsells]);

  /* Só os tours e os eventos decidem se o passo das experiências existe. Os
     upsells, quando chegarem, acrescentam cartões — nunca decidem o passo.

     Amarrá-los aqui tinha uma consequência que não se via: enquanto
     `nearbyToursLoaded` fosse falso, `passengerStep` valia 2, o mesmo número
     que `experiencesStep`, e o passo 2 desenhava o formulário de passageiro por
     cima dos tours que já tinham chegado. */
  const isLoading = hasPlace && (tours === undefined || events === undefined);

  return {
    tours: allItems,
    isLoading,
  };
}
