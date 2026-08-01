"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  HomeThemeProvider,
  HomeHeader,
} from "@/components/new-landing-page/home-theme";
import { ToursTopBar } from "@/components/tours/tours-top-bar";
import { ToursCartBar } from "@/components/tours/tours-cart-bar";
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
      <div className="pb-[var(--cart-bar-h,0px)] [--tours-bar-h:30px] md:[--tours-bar-h:36px]">
        <ToursTopBar />
        <HomeHeader />
        <div className="pt-[76px] md:pt-[82px]">
          <Suspense fallback={<div className="h-[520px]" />}>
            <TourResultsContent />
          </Suspense>
        </div>
        <Footer />
        <ToursCartBar />
      </div>
    </HomeThemeProvider>
  );
}
