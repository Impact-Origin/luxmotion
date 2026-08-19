"use client"

import { setRequestLocale } from "next-intl/server"
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

export default async function BlogResultsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

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
