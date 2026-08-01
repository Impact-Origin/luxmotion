"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  HomeThemeProvider,
  HomeHeader,
} from "@/components/new-landing-page/home-theme";
import { Footer } from "@/components/new-landing-page/footer";
import { TourResultsHero } from "@/components/tours/tour-results-hero";
import { DestinationNav } from "@/components/tours/destination-nav";
import { SearchResultsContent } from "@/components/tours/search-results-content";

function TourResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  return (
    <>
      <TourResultsHero />
      <DestinationNav currentSlug="" />
      <SearchResultsContent searchQuery={query} />
    </>
  );
}

export default function TourResultsPage() {
  return (
    <HomeThemeProvider>
      <>
        <HomeHeader />
        <div className="pt-[46px] md:pt-[46px]">
          <Suspense fallback={<div className="h-[520px]" />}>
            <TourResultsContent />
          </Suspense>
        </div>
        <Footer />
      </>
    </HomeThemeProvider>
  );
}
