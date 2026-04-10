import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { createPageMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const tBlogs = await getTranslations("blogsHero")

  return createPageMetadata({
    title: tBlogs("title"),
    description: "Travel guides, local insights, and curated inspiration for Portugal journeys.",
    path: "/blogs",
    image: "/mockup-blogs/lisbon-city-center.jpg",
    keywords: ["Portugal travel blog", "Lisbon guide", "Portugal itinerary", "travel tips"],
  })
}

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
  return children
}
