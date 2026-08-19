import { Metadata } from "next"
import { fetchQuery } from "convex/nextjs"
import { api } from "@workspace/convex/api"
import { BlogDetailClient } from "./client"
import { getLocale, setRequestLocale } from "next-intl/server"
import { JsonLd } from "@/components/seo/json-ld"
import { createNoIndexMetadata, createPageMetadata, extractTextContent } from "@/lib/seo"
import { buildArticleSchema, buildBreadcrumbSchema } from "@/lib/structured-data"
import { resolveBlogView } from "@/lib/blog-view-model"
import { notFound } from "next/navigation"

interface BlogDetailPageProps {
  params: Promise<{ locale: string; slug: string }>
}

type BlogTranslation = {
  locale: string
  title?: string
  excerpt?: string
  content?: unknown
  seoTitle?: string
  seoDescription?: string
}

type BlogSeoSource = {
  title: string
  excerpt?: string
  content?: unknown
  seoTitle?: string
  seoDescription?: string
  heroImageUrl?: string | null
  heroImageAlt?: string
  author?: string
  publishedAt?: number
  updatedAt?: number
  status?: string
  tags?: string[]
  translations?: BlogTranslation[]
}

function resolveBlogSeo(blog: BlogSeoSource, locale: string) {
  const translation = blog.translations?.find((item: { locale: string }) => item.locale === locale)

  const title =
    translation?.seoTitle ||
    translation?.title ||
    blog.seoTitle ||
    blog.title

  const description =
    translation?.seoDescription ||
    translation?.excerpt ||
    extractTextContent(translation?.content) ||
    blog.seoDescription ||
    blog.excerpt ||
    extractTextContent(blog.content)

  return {
    title,
    description,
  }
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params
  setRequestLocale(locale)

  try {
    const blog = await fetchQuery(api.blogs.getBySlug, { slug })

    if (!blog) {
      return createNoIndexMetadata("Blog not found")
    }

    const seo = resolveBlogSeo(blog, locale)

    return createPageMetadata({
      title: seo.title,
      description: seo.description,
      path: `/blogs/${slug}`,
      image: blog.heroImageUrl,
      imageAlt: blog.heroImageAlt,
      type: "article",
      keywords: blog.tags,
      noIndex: blog.status !== "published",
    })
  } catch {
    return createNoIndexMetadata("Blog")
  }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  // Um Convex fora do ar não deve deitar a página abaixo: nesse caso o cliente
  // ainda vai buscar o artigo, como fazia antes. Só que "não respondeu" e "não
  // existe" não são a mesma coisa, e só a segunda é um 404.
  let blog: Awaited<ReturnType<typeof fetchQuery<typeof api.blogs.getBySlug>>> = null
  let reachable = true
  try {
    blog = await fetchQuery(api.blogs.getBySlug, { slug })
  } catch {
    reachable = false
  }

  // O notFound() vivia no componente cliente, onde no servidor ainda estava a
  // carregar: um slug inexistente respondia 200 e o Google indexava-o como
  // página válida. Rascunhos continuam a ser servidos, com noindex, para não
  // partir a revisão antes de publicar.
  if (reachable && !blog) notFound()

  const seo = blog ? resolveBlogSeo(blog, locale) : null
  const initial = blog ? resolveBlogView(blog, locale) : null

  return (
    <>
      {blog && seo && (
        <>
          <JsonLd
            data={
              buildBreadcrumbSchema([
                { name: "Home", url: "/" },
                { name: "Blog", url: "/blogs" },
                { name: seo.title, url: `/blogs/${slug}` },
              ])
            }
          />
          <JsonLd
            data={
              buildArticleSchema({
                headline: seo.title,
                description: seo.description,
                path: `/blogs/${slug}`,
                image: blog.heroImageUrl,
                authorName: blog.author,
                publishedAt: blog.publishedAt,
                modifiedAt: blog.updatedAt,
              })
            }
          />
        </>
      )}
      <BlogDetailClient slug={slug} initial={initial} />
    </>
  )
}
