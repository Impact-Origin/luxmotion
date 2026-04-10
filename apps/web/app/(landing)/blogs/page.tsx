"use client"

import { Header } from "@/components/new-landing-page/header"
import { BlogsHero } from "@/components/blogs/blogs-hero"
import { FeaturedBlogsSection } from "@/components/blogs/featured-blogs-section"
import { LatestGuidesSection } from "@/components/blogs/latest-guides-section"
import { ToursSection } from "@/components/new-landing-page/tours-section"
import { NewsletterSection } from "@/components/new-landing-page/newsletter-section"
import { ContactSection } from "@/components/new-landing-page/contact-section"
import { Footer } from "@/components/new-landing-page/footer"
import { useFeaturedBlogs, usePublishedBlogs } from "@/hooks/use-blog-data"

function BlogsContent() {
  const { blogs: featuredBlogs, isLoading: featuredLoading } = useFeaturedBlogs()
  const { blogs: publishedBlogs, isLoading: publishedLoading } = usePublishedBlogs()

  return (
    <>
      <BlogsHero />
      <FeaturedBlogsSection blogs={featuredBlogs} isLoading={featuredLoading} />
      <LatestGuidesSection guides={publishedBlogs} isLoading={publishedLoading} />
      <ToursSection />
      <div className="xl:mt-[140px]">
        <NewsletterSection />
      </div>
      <ContactSection />
    </>
  )
}

export default function BlogsPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <div className="pt-[46px] md:pt-[46px]">
        <BlogsContent />
      </div>
      <Footer />
    </div>
  )
}
