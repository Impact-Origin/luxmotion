import { setRequestLocale } from "next-intl/server"
import { fetchQuery } from "convex/nextjs"
import { api } from "@workspace/convex/api"
import { HomeThemeProvider, HomeHeader } from "@/components/new-landing-page/home-theme"
import { BlogsHero } from "@/components/blogs/blogs-hero"
import { FeaturedBlogsSection } from "@/components/blogs/featured-blogs-section"
import { ImmersiveToursSection } from "@/components/blogs/immersive-tours-section"
import { ContactSection } from "@/components/new-landing-page/contact-section"
import { Footer } from "@/components/new-landing-page/footer"

/**
 * O índice do blog era um componente cliente de cima a baixo: o HTML saía com o
 * menu, o rodapé e mais nada. Os artigos passam a ser resolvidos aqui, e o
 * cliente continua a filtrar e a ordenar por cima deles.
 */
export default async function BlogsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const [initialFeatured, initialPublished] = await Promise.all([
    fetchQuery(api.blogs.listFeatured, {}).catch(() => null),
    fetchQuery(api.blogs.listPublished, {}).catch(() => null),
  ])

  return (
    <HomeThemeProvider>
      <HomeHeader />
      <div className="pt-[46px] md:pt-[46px]">
        <BlogsHero />
        <FeaturedBlogsSection
          initialFeatured={initialFeatured}
          initialPublished={initialPublished}
        />
        <ImmersiveToursSection />
        <ContactSection />
      </div>
      <Footer />
    </HomeThemeProvider>
  )
}
