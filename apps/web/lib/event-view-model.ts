/**
 * O evento já resolvido para um idioma.
 *
 * Mesma razão do blog-view-model: a página renderiza o evento com isto no
 * servidor e o `useEventBySlug` volta a passar por aqui quando o Convex manda
 * uma actualização. Duas regras diferentes davam duas árvores diferentes e a
 * hidratação partia.
 */

type EventTranslation = {
  locale: string;
  title?: string;
  subtitle?: string;
  description?: unknown;
  included?: string[];
  excluded?: string[];
  seoTitle?: string;
  seoDescription?: string;
};

export type EventRecord = {
  originalLanguage?: string;
  title: string;
  subtitle?: string;
  description?: unknown;
  included?: string[];
  excluded?: string[];
  seoTitle?: string;
  seoDescription?: string;
  translations?: EventTranslation[];
};

export type EventView<T extends EventRecord = EventRecord> = {
  event: T;
  title: string;
  subtitle?: string;
  description?: unknown;
  included?: string[];
  excluded?: string[];
  seoTitle?: string;
  seoDescription?: string;
};

export function resolveEventView<T extends EventRecord>(
  event: T,
  locale: string,
): EventView<T> {
  const translation =
    locale && locale !== event.originalLanguage
      ? event.translations?.find((t) => t.locale === locale)
      : undefined;

  return {
    event,
    title: translation?.title ?? event.title,
    subtitle: translation?.subtitle ?? event.subtitle,
    description: translation?.description ?? event.description,
    included: translation?.included ?? event.included,
    excluded: translation?.excluded ?? event.excluded,
    seoTitle: translation?.seoTitle ?? event.seoTitle,
    seoDescription: translation?.seoDescription ?? event.seoDescription,
  };
}
