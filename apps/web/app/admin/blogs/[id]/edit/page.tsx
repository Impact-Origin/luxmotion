"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "@workspace/convex/api"
import type { Id } from "@workspace/convex/dataModel"
import { Loader2 } from "lucide-react"
import { BlogForm } from "@/components/admin/blog-form"

export default function EditBlogPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const blog = useQuery(api.blogs.getById, { id: id as Id<"blogs"> })

  useEffect(() => {
    if (blog === null) router.replace("/admin/blogs")
  }, [blog, router])

  if (!blog) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <BlogForm initialData={blog} onClose={() => router.push("/admin/blogs")} />
  )
}
