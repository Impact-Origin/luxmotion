"use client"

import { useLocale } from "next-intl"
import { Header } from "@/components/new-landing-page/header"
import { BlogDetailHero } from "@/components/blogs/blog-detail-hero"
import { BlogArticleHeader } from "@/components/blogs/blog-article-header"
import { BlogArticleContent, ContentBlock } from "@/components/blogs/blog-article-content"
import { RelatedBlogsSection, RelatedBlog } from "@/components/blogs/related-blogs-section"
import { ToursSection } from "@/components/new-landing-page/tours-section"
import { NewsletterSection } from "@/components/new-landing-page/newsletter-section"
import { ContactSection } from "@/components/new-landing-page/contact-section"
import { Footer } from "@/components/new-landing-page/footer"
import { BlogDetailSkeleton } from "@/components/blogs/blog-skeletons"
import { useBlogBySlug, usePublishedBlogs } from "@/hooks/use-blog-data"
import { tiptapToContentBlocks } from "@/lib/blog-content-transformer"

function formatUpdatedDate(timestamp?: number): string {
  if (!timestamp) return ""
  return `Updated ${new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  })}`
}

function BlogDetailContent({ slug }: { slug: string }) {
  const locale = useLocale()
  const { blog, isLoading, content, title } = useBlogBySlug(slug, locale)
  const { blogs: allBlogs } = usePublishedBlogs()

  if (isLoading) {
    return <BlogDetailSkeleton />
  }

  if (!blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-20">
        <h1 className="text-2xl font-bold text-zinc-900 mb-4">Blog not found</h1>
        <p className="text-zinc-500">The blog post you're looking for doesn't exist.</p>
      </div>
    )
  }

  const contentBlocks: ContentBlock[] = content ? tiptapToContentBlocks(content) : []

  const articleData = {
    breadcrumbs: [
      { label: "Blog", href: "/blogs" },
      { label: blog.category, href: `/blogs?category=${blog.category.toLowerCase()}` },
      { label: title || blog.title },
    ],
    category: blog.category,
    title: title || blog.title,
    author: `By ${blog.author}`,
    updatedDate: formatUpdatedDate(blog.updatedAt),
    readTime: `${blog.readTimeMinutes} min read`,
  }

  const relatedBlogs: RelatedBlog[] = allBlogs
    .filter((b) => b._id !== blog._id && b.status === "published")
    .slice(0, 4)
    .map((b) => ({
      id: b._id,
      slug: b.slug,
      image: b.heroImageUrl || "/mockup-blogs/blog_details_mockup_1.png",
      category: b.category,
      title: b.title,
      date: b.publishedAt
        ? new Date(b.publishedAt).toLocaleDateString("pt-PT", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "",
      description: b.excerpt,
    }))

  return (
    <>
      <BlogDetailHero imageUrl={blog.heroImageUrl} />
      <BlogArticleHeader {...articleData} />
      <BlogArticleContent blocks={contentBlocks} />
      {relatedBlogs.length > 0 && <RelatedBlogsSection blogs={relatedBlogs} />}
      <ToursSection />
      <div className="xl:mt-[200px]">
        <NewsletterSection />
      </div>
      <ContactSection />
    </>
  )
}

export function BlogDetailClient({ slug }: { slug: string }) {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <div className="pt-[46px] md:pt-[46px]">
        <BlogDetailContent slug={slug} />
      </div>
      <Footer />
    </div>
  )
}
