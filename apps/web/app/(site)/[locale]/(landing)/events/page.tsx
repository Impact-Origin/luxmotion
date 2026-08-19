import { cachedQuery } from "@/lib/convex-cache";
import { setRequestLocale } from "next-intl/server"
import { fetchQuery } from "convex/nextjs";
import { api } from "@workspace/convex/api";
import {
  HomeThemeProvider,
  HomeHeader,
} from "@/components/new-landing-page/home-theme";
import { Footer } from "@/components/new-landing-page/footer";
import { EventsHero } from "@/components/events/events-hero";
import { FeaturedEventsSection } from "@/components/events/featured-events-section";
import { AllEventsSection } from "@/components/events/all-events-section";

/**
 * O índice de eventos era um componente cliente de cima a baixo: o HTML saía
 * com o menu, o rodapé e mais nada. Os eventos passam a ser resolvidos aqui, e
 * o cliente continua a filtrar e a ordenar por cima deles.
 */
export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const [initialUpcoming, initialPublished, initialFeatured] = await Promise.all([
    cachedQuery(["events", "upcoming", "5"], () => fetchQuery(api.events.listUpcoming, { limit: 5 })).catch(() => null),
    cachedQuery(["events", "published"], () => fetchQuery(api.events.listPublished, {})).catch(() => null),
    cachedQuery(["events", "featured", "3"], () => fetchQuery(api.events.listFeatured, { limit: 3 })).catch(() => null),
  ]);

  return (
    // O fundo e a cor do texto vêm do HomeThemeProvider.
    <HomeThemeProvider>
      <>
        <HomeHeader />
        <div className="pt-[46px] md:pt-[46px]">
          <EventsHero
            initialUpcoming={initialUpcoming}
            initialPublished={initialPublished}
          />
          <FeaturedEventsSection initialFeatured={initialFeatured} />
          <AllEventsSection initialEvents={initialPublished} />
        </div>
        <Footer />
      </>
    </HomeThemeProvider>
  );
}
