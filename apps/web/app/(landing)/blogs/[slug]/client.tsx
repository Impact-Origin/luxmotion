"use client"

import { useLocale, useTranslations } from "next-intl"
import { Header } from "@/components/new-landing-page/header"
import { BlogDetailHero, BlogHeroBreadcrumb } from "@/components/blogs/blog-detail-hero"
import { BlogArticleContent, ContentBlock } from "@/components/blogs/blog-article-content"
import { BlogToc } from "@/components/blogs/blog-toc"
import {
  BlogDetailSidebar,
  SidebarRelatedItem,
} from "@/components/blogs/blog-detail-sidebar"
import { BlogArticleFooter } from "@/components/blogs/blog-article-footer"
import { BlogPrevNext, PrevNextItem } from "@/components/blogs/blog-prev-next"
import { Footer } from "@/components/new-landing-page/footer"
import { BlogDetailSkeleton } from "@/components/blogs/blog-skeletons"
import { useBlogBySlug, usePublishedBlogs } from "@/hooks/use-blog-data"
import { tiptapToContentBlocks } from "@/lib/blog-content-transformer"

const LOCALE_DATE_MAP: Record<string, string> = {
  en: "en-US",
  pt: "pt-PT",
  de: "de-DE",
  es: "es-ES",
  fr: "fr-FR",
  nl: "nl-NL",
}

function formatPublishedDate(timestamp: number | undefined, locale: string): string {
  if (!timestamp) return ""
  const intlLocale = LOCALE_DATE_MAP[locale] ?? "en-US"
  const formatted = new Date(timestamp).toLocaleDateString(intlLocale, {
    month: "long",
    year: "numeric",
  })
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

function formatShortDate(timestamp: number | undefined, locale: string): string {
  if (!timestamp) return ""
  const intlLocale = LOCALE_DATE_MAP[locale] ?? "en-US"
  const formatted = new Date(timestamp).toLocaleDateString(intlLocale, {
    month: "short",
    year: "numeric",
  })
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

function BlogDetailContent({ slug }: { slug: string }) {
  const locale = useLocale()
  const tArticle = useTranslations("blogArticle")
  const { blog, isLoading, content, title } = useBlogBySlug(slug, locale)
  const { blogs: allBlogs } = usePublishedBlogs()

  if (isLoading) {
    return <BlogDetailSkeleton />
  }

  if (!blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-20">
        <h1 className="text-2xl font-medium text-white mb-4">Blog not found</h1>
        <p className="text-[#999]">The blog post you&apos;re looking for doesn&apos;t exist.</p>
      </div>
    )
  }

  const contentBlocks: ContentBlock[] = content ? tiptapToContentBlocks(content) : []
  const resolvedTitle = title || blog.title

  const breadcrumbs: BlogHeroBreadcrumb[] = [
    { label: tArticle("journal"), href: "/blogs" },
    { label: blog.category, href: `/blogs?category=${blog.category.toLowerCase()}` },
    { label: resolvedTitle },
  ]

  const otherBlogs = allBlogs.filter(
    (b) => b._id !== blog._id && b.status === "published",
  )

  const chronological = [...allBlogs]
    .filter((b) => b.status === "published")
    .sort((a, b) => (a.publishedAt ?? a.createdAt) - (b.publishedAt ?? b.createdAt))

  const currentIdx = chronological.findIndex((b) => b._id === blog._id)
  const previousBlog = currentIdx > 0 ? chronological[currentIdx - 1] : null
  const nextBlog =
    currentIdx >= 0 && currentIdx < chronological.length - 1
      ? chronological[currentIdx + 1]
      : null

  const previousNav: PrevNextItem | null = previousBlog
    ? { slug: previousBlog.slug, title: previousBlog.title }
    : null
  const nextNav: PrevNextItem | null = nextBlog
    ? { slug: nextBlog.slug, title: nextBlog.title }
    : null

  const sidebarRelated: SidebarRelatedItem[] = otherBlogs.slice(0, 3).map((b) => ({
    id: b._id,
    slug: b.slug,
    image: b.heroImageUrl || "/mockup-blogs/blog_details_mockup_1.png",
    category: b.category,
    title: b.title,
    date: formatShortDate(b.publishedAt, locale),
    readTimeMinutes: b.readTimeMinutes,
  }))

  return (
    <>
      <BlogDetailHero
        imageUrl={blog.heroImageUrl}
        breadcrumbs={breadcrumbs}
        category={blog.category}
        title={resolvedTitle}
        author={blog.author}
        publishedDate={formatPublishedDate(blog.publishedAt, locale)}
        readTime={tArticle("readTime", { minutes: blog.readTimeMinutes })}
      />
      <div className="px-4 md:px-5 lg:px-6 xl:px-[56px] pt-[24px] xl:pt-[56px] pb-[40px] xl:pb-[80px]">
        <div className="max-w-[1280px] mx-auto flex flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_280px] gap-10 xl:gap-[64px] items-start">
          <div className="flex flex-col gap-[36px] min-w-0 w-full">
            <BlogToc blocks={contentBlocks} />
            <BlogArticleContent blocks={contentBlocks} />
            <BlogArticleFooter tags={blog.tags} shareTitle={resolvedTitle} />
          </div>
          <BlogDetailSidebar
            author={{ name: blog.author }}
            related={sidebarRelated}
            bookHref="/checkout"
            className="order-last lg:order-none lg:sticky lg:top-[88px]"
          />
        </div>
      </div>
      <BlogPrevNext previous={previousNav} next={nextNav} />
    </>
  )
}

export function BlogDetailClient({ slug }: { slug: string }) {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <Header />
      <BlogDetailContent slug={slug} />
      <Footer />
    </div>
  )
}
