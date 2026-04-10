"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/new-landing-page/header"
import { BlogResultsHero } from "@/components/blogs/blog-results-hero"
import { BlogResultsSection } from "@/components/blogs/blog-results-section"
import { NewsletterSection } from "@/components/new-landing-page/newsletter-section"
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

export default function BlogResultsPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <div className="pt-[46px] md:pt-[46px]">
        <Suspense fallback={<div className="h-[520px]" />}>
          <BlogResultsContent />
        </Suspense>
        <div className="xl:mt-[140px]">
          <NewsletterSection />
        </div>
      </div>
      <Footer />
    </div>
  )
}
