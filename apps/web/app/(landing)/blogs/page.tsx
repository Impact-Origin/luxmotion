"use client"

import { HomeThemeProvider, HomeHeader } from "@/components/new-landing-page/home-theme"
import { BlogsHero } from "@/components/blogs/blogs-hero"
import { FeaturedBlogsSection } from "@/components/blogs/featured-blogs-section"
import { ImmersiveToursSection } from "@/components/blogs/immersive-tours-section"
import { ContactSection } from "@/components/new-landing-page/contact-section"
import { Footer } from "@/components/new-landing-page/footer"

export default function BlogsPage() {
  return (
    <HomeThemeProvider>
      <HomeHeader />
      <div className="pt-[46px] md:pt-[46px]">
        <BlogsHero />
        <FeaturedBlogsSection />
        <ImmersiveToursSection />
        <ContactSection />
      </div>
      <Footer />
    </HomeThemeProvider>
  )
}
