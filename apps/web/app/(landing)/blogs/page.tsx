"use client"

import { Header } from "@/components/new-landing-page/header"
import { BlogsHero } from "@/components/blogs/blogs-hero"
import { FeaturedBlogsSection } from "@/components/blogs/featured-blogs-section"
import { ImmersiveToursSection } from "@/components/blogs/immersive-tours-section"
import { ContactSection } from "@/components/new-landing-page/contact-section"
import { Footer } from "@/components/new-landing-page/footer"

export default function BlogsPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <Header />
      <div className="pt-[46px] md:pt-[46px]">
        <BlogsHero />
        <FeaturedBlogsSection />
        <ImmersiveToursSection />
        <ContactSection />
      </div>
      <Footer />
    </div>
  )
}
