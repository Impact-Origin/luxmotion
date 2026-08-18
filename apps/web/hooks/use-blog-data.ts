"use client"

import { useQuery } from "convex/react"
import { api } from "@workspace/convex/api"
import { MOCK_FEATURED_BLOGS, MOCK_LATEST_BLOGS, MockBlog } from "@/lib/mock-blogs"

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_BLOGS === "true"

export interface BlogData {
  _id: string
  slug: string
  title: string
  excerpt: string
  content: any
  heroImageUrl: string | null
  heroImageAlt?: string
  /* Segunda imagem gerada pela automação, inserida no corpo do artigo. Só as
     queries de detalhe a resolvem: os cards da listagem usam só a capa. */
  editorialImageUrl?: string | null
  editorialImageAlt?: string
  editorialImageCaption?: string
  category: string
  author: string
  authorRole?: string
  authorBio?: string
  authorAvatarId?: string
  authorAvatarUrl?: string | null
  originalLanguage: string
  status: "draft" | "published" | "archived"
  isFeatured: boolean
  readTimeMinutes: number
  publishedAt?: number
  createdAt: number
  updatedAt: number
  availableLanguages: string[]
  seoTitle?: string
  seoDescription?: string
  tags?: string[]
}

export interface BlogWithTranslations extends BlogData {
  translations: Array<{
    _id: string
    blogId: string
    locale: string
    title: string
    excerpt: string
    content: any
    seoTitle?: string
    seoDescription?: string
    updatedAt: number
  }>
}

export function useFeaturedBlogs() {
  const data = useQuery(api.blogs.listFeatured, USE_MOCK ? "skip" : {})

  if (USE_MOCK) {
    return {
      blogs: MOCK_FEATURED_BLOGS as unknown as BlogData[],
      isLoading: false,
    }
  }

  return {
    blogs: (data as BlogData[] | undefined) ?? [],
    isLoading: data === undefined,
  }
}

export function usePublishedBlogs() {
  const data = useQuery(api.blogs.listPublished, USE_MOCK ? "skip" : {})

  if (USE_MOCK) {
    return {
      blogs: MOCK_LATEST_BLOGS as unknown as BlogData[],
      isLoading: false,
    }
  }

  return {
    blogs: (data as BlogData[] | undefined) ?? [],
    isLoading: data === undefined,
  }
}

export function useAllBlogs() {
  const data = useQuery(api.blogs.list, USE_MOCK ? "skip" : {})

  if (USE_MOCK) {
    return {
      blogs: MOCK_LATEST_BLOGS as unknown as BlogData[],
      isLoading: false,
    }
  }

  return {
    blogs: (data as BlogData[] | undefined) ?? [],
    isLoading: data === undefined,
  }
}

export function useBlogBySlug(slug: string, locale?: string) {
  const blogData = useQuery(
    api.blogs.getBySlug,
    USE_MOCK ? "skip" : { slug }
  )

  if (USE_MOCK) {
    const mockBlog = MOCK_LATEST_BLOGS.find((b) => b.slug === slug)
    return {
      blog: mockBlog as unknown as BlogWithTranslations | null,
      isLoading: false,
      content: mockBlog?.content,
      title: mockBlog?.title,
      excerpt: mockBlog?.excerpt,
    }
  }

  const blog = blogData as BlogWithTranslations | null | undefined

  if (blog === undefined) {
    return {
      blog: undefined,
      isLoading: true,
      content: undefined,
      title: undefined,
      excerpt: undefined,
    }
  }

  if (!blog) {
    return {
      blog: null,
      isLoading: false,
      content: null,
      title: null,
      excerpt: null,
    }
  }

  const translation = locale && locale !== blog.originalLanguage
    ? blog.translations?.find((t) => t.locale === locale)
    : null

  return {
    blog,
    isLoading: false,
    content: translation?.content ?? blog.content,
    title: translation?.title ?? blog.title,
    excerpt: translation?.excerpt ?? blog.excerpt,
    seoTitle: translation?.seoTitle ?? blog.seoTitle,
    seoDescription: translation?.seoDescription ?? blog.seoDescription,
  }
}

export function useBlogById(id: string | null) {
  const data = useQuery(
    api.blogs.getById,
    USE_MOCK || !id ? "skip" : { id: id as any }
  )

  if (USE_MOCK && id) {
    const mockBlog = MOCK_LATEST_BLOGS.find((b) => b._id === id)
    return {
      blog: mockBlog ? { ...mockBlog, translations: [] } as unknown as BlogWithTranslations : null,
      isLoading: false,
    }
  }

  return {
    blog: data as BlogWithTranslations | null | undefined,
    isLoading: data === undefined && id !== null,
  }
}

export function useBlogCategories() {
  const data = useQuery(api.blogs.getCategories, USE_MOCK ? "skip" : {})

  if (USE_MOCK) {
    const categories = [...new Set(MOCK_LATEST_BLOGS.map((b) => b.category))]
    return {
      categories,
      isLoading: false,
    }
  }

  return {
    categories: (data as string[] | undefined) ?? [],
    isLoading: data === undefined,
  }
}

export function useFilteredBlogs(filters: {
  search?: string
  category?: string
  status?: string
  sortBy?: "newest" | "oldest"
}) {
  const { blogs, isLoading } = useAllBlogs()

  if (isLoading) {
    return { blogs: [], isLoading: true }
  }

  let filtered = [...blogs]

  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(
      (b) =>
        b.title.toLowerCase().includes(searchLower) ||
        b.excerpt.toLowerCase().includes(searchLower) ||
        b.category.toLowerCase().includes(searchLower)
    )
  }

  if (filters.category && filters.category !== "all") {
    filtered = filtered.filter(
      (b) => b.category.toLowerCase() === filters.category!.toLowerCase()
    )
  }

  if (filters.status && filters.status !== "all") {
    filtered = filtered.filter((b) => b.status === filters.status)
  }

  if (filters.sortBy === "oldest") {
    filtered.sort((a, b) => a.createdAt - b.createdAt)
  } else {
    filtered.sort((a, b) => b.createdAt - a.createdAt)
  }

  return { blogs: filtered, isLoading: false }
}
