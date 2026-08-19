"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { HomeThemeProvider, HomeHeader } from "@/components/new-landing-page/home-theme"
import { BlogResultsHero } from "@/components/blogs/blog-results-hero"
import { BlogResultsSection } from "@/components/blogs/blog-results-section"
import { Footer } from "@/components/new-landing-page/footer"

function BlogResultsContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  return (
    <>
      <BlogResultsHero />
      <BlogResultsSection searchQuery={query} />
    </>
  )
}

/* Página cliente: o setRequestLocale não se aplica aqui, e por usar
   searchParams nunca poderia ser estática de qualquer forma. */
export default function BlogResultsPage() {

  return (
    <HomeThemeProvider>
      <HomeHeader />
      <div className="pt-[60px] lg:pt-[72px]">
        <Suspense fallback={<div className="h-[520px]" />}>
          <BlogResultsContent />
        </Suspense>
      </div>
      <Footer />
    </HomeThemeProvider>
  )
}
