"use client"

import { useRouter } from "next/navigation"
import { BlogForm } from "@/components/admin/blog-form"

export default function NewBlogPage() {
  const router = useRouter()
  return (
    <BlogForm onClose={() => router.push("/admin/blogs")} />
  )
}
