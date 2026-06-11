"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/new-landing-page/header"
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

export default function BlogResultsPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <Header variant="light" />
      <div className="pt-[60px] lg:pt-[72px]">
        <Suspense fallback={<div className="h-[520px]" />}>
          <BlogResultsContent />
        </Suspense>
      </div>
      <Footer />
    </div>
  )
}
